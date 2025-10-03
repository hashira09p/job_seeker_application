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
import { Trophy } from 'lucide-react';


dotenv.config()

const {Users, Companies} = db
const port = 3000;
const app = express();
const saltRounds = 15;
const JWT_SECRET = "just_a_secret"

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
app.use(bodyParser.urlencoded({ extended: true }));

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
  if (!token) return res.sendStatus(401);

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
    successRedirect:"http://localhost:3000/",
    failureRedirect:"/signup"
  })
)


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

  try{
    const user= await Users.findOne({
      where:{
        email: email
      }
    })
    
    const role = user.role

    // console.log(user)
    
    if (user == null) { 
      console.log("User not registered.")
      return res.status(400).json({success:false, message: "unregistered"})
    }

    await bcrypt.compare(password, user.password, async(err, result) => {
      console.log(result)
      if (result){
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" })
        res.status(200).json({success: true, message: "success", token, role})
      }else{
        res.status(400).json({success: false, message: "wrong password"})
      }
    })
  }catch(err){
    console.log(err.message)
  }
})

//Company Page for Employer
app.get("/company-dashboard", authenticateToken, async(req, res) => {
  const result = await Companies.findOne({ 
    where:{
      userID: req.user.id,
    },
    include: {
      model: Users,
      as: "user"
    }
  })
  
  console.log((result.user.firstName))


  res.json({ message: "Welcome to dashboard!", user: req.user, company: result["name"], fullName: result.user.fullName})
});

app.get("/companies", async(req, res) => {
  try{
    const result = await Companies.findAll()
    res.status(200).json({success:true, result})
  }catch(err){
    console.log(err.message)
  }
})


app.listen(port, () => {
  console.log(`Server is running in port ${port}`)
})