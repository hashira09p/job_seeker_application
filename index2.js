import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sequelize from './config/database.js';
import bcrypt from 'bcrypt';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2'
import dotenv from "dotenv"
import { env } from 'process';
import session from 'express-session';
import db from './models/index.js';
import { profile } from 'console';
import jwt from "jsonwebtoken"
import { FileEdit, Trophy } from 'lucide-react';
import multer from "multer"
import fs from "fs"
import path from 'path';

const {Users, Companies, JobPostings, Documents, Applicants} = db
const port = 4000;
const app = express();
const saltRounds = 15;
const JWT_SECRET = "just_a_secret"
const uploadDir = "uploads/resumes"

if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir, {recursive: true})
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})

const upload = multer({storage, limits:{
  fieldSize:  5 * 1024 * 1024 //50MB
}})

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // your React frontend
  credentials: true
}));

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token)
  if (!token) return res.sendStatus(401).json({message: "Wrong Token"});

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post("/admin-register", async(req, res) => {
    const {email, firstName, lastName, password, role, adminKey} = req.body

    console.log(email, firstName, lastName, password, role, adminKey)
    try{
        if(!email || !password){
            res.status(400).json({sucess: false, message: "Email and password are required", })
            console.log("Email and password are required")
            return
        }

        if(adminKey.toUpperCase() != "QWERTY"){
            res.status(400).json({succes: false, message: "adminKey is incorrect"})
            console.log("adminKey is incorrect")
            return
        }

        const user = await Users.findOne({
            where:{
                email: email
            }
        })

        if (user){
            res.send(400).json({success: false, message: "Email is already exist"})
            console.log("Email is already exist")
            return
        }

        bcrypt.hash(password, saltRounds, async function(err, hash){
            if(!err){
                const userCreate = await Users.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hash,
                    role: role,
                    fullName: `${firstName} ${lastName}`
                })
            }else{
                res.status(400).json({success: false, message: err})
                return
            }
        })

        res.status(200).json({success: true, message: "Register Success"})
    }catch(err){
        res.status(400).json({success: true, message: err.message})
    }
});

app.post("/admin-login", async(req, res) => {
 const {email, password} = req.body
  // console.log(email, password)
  try{
    const user= await Users.findOne({
      where:{
        email: email
      }
    })

    console.log(user)
    
    if (user == null) { 
      console.log("User not registered.")
      res.status(400).json({success:false, message: "User not registered."})
      return
    }

    const role = user.role

    await bcrypt.compare(password, user.password, async(err, result) => {
      //this console.log will say false if it is wrong password
      console.log(result)
      if (result){
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "5h" })
        res.status(200).json({success: true, message: "Ok", token, role})
      }else{
        res.status(400).json({success: result, message: "wrong password"})
      }
    })
  }catch(err){
    console.log(err.message)
    res.status(400).json({success: false, message: err.message})
  }
    
})

app.get("/fetchData", authenticateToken, async(req, res) => {
  const currentUserId = req.user.id

  try{
    const currentAdmin = await Users.findOne({
      where: {
        id: currentUserId
      }
    })

    const employersDocuments = await Documents.findAll({
      include: [{
        model: Users,
        as: "user",
        attributes: ["id", "firstName", "lastName", "email", "role", "fullName",    "approved"],
        where: { role: "Employer" } // Filter by user role
      }]
    });

    const jobPostings = await JobPostings.findAll({
      include:[{
        model:Companies,
        as:"company",
        attributes:['name', "industry"]
      },
      {
        model:Applicants,
        as:"applicants",
        attributes:['id']
      }],
    })

    res.status(200).json({success: true, currentAdmin: currentAdmin, employersDocuments: employersDocuments, jobPostings:jobPostings, })
  }catch(err){
    console.log(err.message)
    res.status(400).json({success: false, message: err.message})
  }
})

app.patch("/updateEmployerApproval/:id", authenticateToken, async(req, res) => {
  const employerId = req.params.id
  const updatedApproved = req.body.approved
  console.log(updatedApproved, employerId)

  try{
    const employer = await Users.update({
      approved: updatedApproved
    },{
      where:{
        id: employerId
      } 
    })

    res.status(200).json({success: true, message: "Update Successfully!"})
  }catch(err){
    console.log(err.message)
     res.status(400).json({success: true, message: err.message})
  }
})


app.patch("/updateJobReview/:id", authenticateToken, async(req, res) => {
  const jobPostingId = req.params.id
  const updatedReviewed = req.body.reviewed
  console.log(updatedReviewed)

  try{
    const jobPosting = await JobPostings.update({
      reviewed: updatedReviewed
    },{
      where:{
        id: jobPostingId
      } 
    })

    res.status(200).json({success: true, message: "Update Successfully!"})
  }catch(err){
    console.log(err.message)
     res.status(400).json({success: true, message: err.message})
  }
})

//Download the resume in the applicants. This is Admin side.
app.get("/download-document/:id", authenticateToken, async(req, res) => {
  const applicantDocumentId = req.params.id;

  try {
    const result = await Documents.findOne({
      where: { id: applicantDocumentId }
    });
    
    if (!result || !result.fileDir) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Use process.cwd() instead of __dirname
    const filePath = path.join(process.cwd(), result.fileDir);

    console.log(filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // Get file extension and set appropriate Content-Type
    const fileExtension = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);
    
    let contentType = 'application/octet-stream'; // Default fallback
    
    if (fileExtension === '.pdf') {
      contentType = 'application/pdf';
    } else if (fileExtension === '.docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (fileExtension === '.doc') {
      contentType = 'application/msword';
    }

    // Set proper headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', contentType);

    // Stream the file to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch(err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
    console.log(`Server is listening at port ${port}`)
})