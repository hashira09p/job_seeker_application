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

app.listen(port, () => {
    console.log(`Server is listening at port ${port}`)
})