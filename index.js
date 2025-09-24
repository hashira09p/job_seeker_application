import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sequelize from './config/database.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2'
import dotenv from "dotenv"
import { env } from 'process';
import session from 'express-session';

dotenv.config()

const port = 3000;
const app = express();
const saltRounds = 15;

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
app.use(cors());
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


passport.use("google", new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async(request, accessToken, refreshToken, profile, done) => {
  try{

    console.log(profile)

    const result = await User.findOne({
      where:{
        email: profile.email
      }
    })

    if(result){
      return done(null, profile)
    }

    await User.create({
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

passport.serializeUser(async(profile, done) => {

  const user = await User.findOne({
    where: {
      email: profile.email
    }
  })
  console.log(user.id)
  return done(null, user.id)
})

passport.deserializeUser(async(id, done) => {
  try{
    
    const user = await User.findByPk(id)
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

app.post("/submit-register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      console.log("Email and password are required");
      return;
    }

    const result = await User.findOne({
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
        await User.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hash,
          role: role,
          fullName: `${firstName} ${lastName}`
        });
        console.log("Saved success")
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

app.post("/submit-login", async(req, res) => {
  const {email, password} = req.body

  try{
    const user= await User.findOne({
      where:{
        email: email
      }
    })

    console.log(user)
    console.log(user.password);
    
    if (user == null) { 
      console.log("User not registered.")
      return res.status(400).json({success:false, message: "unregistered"})
    }

    await bcrypt.compare(password, user.password, async(err, result) => {
      console.log(result)
      if (result){
        console.log(result)
        res.status(200).json({success: true, message: "success"})
      }else{
        res.status(400).json({success: false, message: "wrong password"})
      }
    })
  }catch(err){
    console.log(err.message)
  }
})