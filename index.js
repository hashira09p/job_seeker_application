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


dotenv.config()

const {Users, Companies, JobPostings} = db
const port = 3000;
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
  fieldSize:  5 * 1024 * 1024
}})

app.use(session(
  {
    secret:'secret',
    resave:false,
    saveUninitialized: false
  }
))

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // your React frontend
  credentials: true
}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

async function authenticate(){
  try{
    await sequelize.authenticate()
    await sequelize.sync({ force: false })
    console.log("Database connected and synced")
  }catch(err){
    console.log(err.message);
  }
}

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

authenticate();

app.get("/auth/google",
  passport.authenticate("google",
    {
    scope: ["email", "profile" ],
    }
  )
)

app.get("/auth/google/app",
  passport.authenticate("google",{
    successRedirect:"http://localhost:5173/",
    failureRedirect:"/signup"
  })
)


// Register
app.post("/submit-register", async (req, res) => {
  try {
    const { firstName, lastName, description, companyName, email,password, role, industry,  website, arrangement} = req.body;

    console.log(companyName);
    console.log(description);
    console.log(role)

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      console.log("Email and password are required");
      return;
    }

    const result = await Users.findOne({
      where: {
        email: email
      }
    });

    if (result) {
      res.status(400).json({ success: false, message: "Email already exists" });
      console.log("Email already exists");
      return;
    }

    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (!err) {
        const result=await Users.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hash,
          role: role,
          fullName: `${firstName} ${lastName}`
        });
          
        if(role == "Employer"){
          await Companies.create({
            name: companyName,
            description: description,
            userID: result.id,
            industry: industry,
            website: website,
            arrangement: arrangement
          })
        }
        
        console.log(result.id)
        res.send("Saved Success");
      } else {
        console.log(err.message);
        res.status(400).json({ success: false, message: err.message });
      }
    });

    
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


//Login
app.post("/submit-login", async(req, res) => {
  const {email, password} = req.body
  // console.log(email, password)
  try{
    const user= await Users.findOne({
      where:{
        email: email
      }
    })
    
    const role = user.role

    console.log(user)
    
    if (user == null) { 
      console.log("User not registered.")
      return res.status(400).json({success:false, message: "unregistered"})
    }

    await bcrypt.compare(password, user.password, async(err, result) => {
      //this console.log will say false if it is wrong password
      console.log(result)
      if (result){
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "5h" })
        res.status(200).json({success: true, message: "success", token, role})
      }else{
        res.status(400).json({success: false, message: "wrong password"})
      }
    })
  }catch(err){
    console.log(err.message)
  }
})

//Employer
//Company Page for Employer
app.get("/companyDashboard", authenticateToken, async(req, res) => {
  const companies = await Companies.findOne({ 
    where:{
      userID: req.user.id,
    },
    include: {
      model: Users,
      as: "user"
    }
  })

  const jobPostings = await JobPostings.findAll({
    where:{
      companyID: companies.id
    }
  })

  res.json({ message: "Welcome to dashboard!", user: req.user, company: companies["name"], fullName: companies.user.fullName, companyID: companies.id, jobPostings})
});

app.post("/jobPostingSubmit", async(req,res) => {
  const {title, description, location, jobType, salaryMin, salaryMax, companyID} = req.body

  console.log(title, description, location, jobType, salaryMin, salaryMax, companyID)
  
  try{
    const result = await JobPostings.create({
      title: title,
      description: description,
      location: location,
      type: jobType,
      companyID: companyID,
      salaryMin: salaryMin,
      salaryMax: salaryMax,
      status: "active"
    })

    console.log(result)
    res.status(200).json({message:"OK", job:result})
  }catch(err){
    console.log(err.message)
  }
});

app.patch("/jobPostings/:id", authenticateToken, async(req,res) => {
  const {title, location, description, type, status, salaryMin, salaryMax} = req.body;
  
  const jobPostingID = req.params.id

  try{
    const result = await JobPostings.update({
      title: title,
      location: location,
      description: description,
      type: type,
      status: status,
      salaryMin: salaryMin,
      salaryMax:salaryMax,},
      
      {
        where:{
        id: jobPostingID
      }
      })

    res.status(200).json({message:"OK"})
  }catch(err){
    console.log(err.message)
  }
})

app.delete("/jobPostings/:id", authenticateToken, async(req,res) => {
  const jobPostingID = req.params.id
  try{
    const result = await JobPostings.destroy({
      where:{
        id: jobPostingID
      }
    })

    res.status(200).json({message:"OK"})
  }catch(err){
    console.log(err.message)
  }
})

//User
//Company Page for User side
app.get("/companies", async(req, res) => {
  try{
    const result = await Companies.findAll()
    res.status(200).json({success:true, result})
  }catch(err){
    console.log(err.message)
  }
})

//jobPosting for User side

app.get("/jobs", async(req, res) => {
  try{
    const jobPosting = await JobPostings.findAll(
      {
        include:{
          model:Companies,
          as:"company",
          attributes:['name', "industry"]
          }
      })
    // console.log(jobPosting)
    res.status(200).json({message: "OK", jobPosting})
  }catch(err){
    console.log(err.message)
  }
})

//Passing application for User side
app.post("/application-submit", authenticateToken,  
  upload.single("resumeFile"),  (req, res) => {
  console.log(req.file)
  console.log(req.user)
  
} )

passport.use("google", new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},

async(request, accessToken, refreshToken, profile, done) => {
  try{

    console.log(profile)

    const result = await Users.findOne({
      where:{
        email: profile.email
      }
    })

    if(result){
      return done(null, profile)
    }

    await Users.create({
      fullName: `${profile.name.givenName} ${profile.name.familyName}`,
      email: profile.email,
      password: "google"
    })

    return done(null, profile)

  }catch(err){
    console.log(err.message)
  }
}
))

//Serialize and Deserialize
passport.serializeUser(async(profile, done) => {

  const user = await Users.findOne({
    where: {
      email: profile.email
    }
  })
  console.log(user.id)
  return done(null, user.id)
})

passport.deserializeUser(async(id, done) => {
  try{
    
    const user = await Users.findByPk(id)
    if(!user){
      return done(null, false)
    }

    done(null,user)

  }catch(err){
    console.log(err.message)
  }
})



app.listen(port, () => {
  console.log(`Server is running in port ${port}`)
})