import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import sequelize from './config/database.js'
import User from './models/User.js'
import bcrypt from 'bcrypt'

const port = 3000;
const app = express();

app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

async function authenticate(){
  try{
    await sequelize.authenticate()
    await sequelize.sync({force:false})
    console.log("Database connected and synced")
  }catch(err){
    console.log(err.message);    
  }
}

authenticate();

app.listen(port, () => {
  console.log(`Server is running in port ${port}`)
})

app.post("/submit", async(req, res) =>{
  if (req.body){
    console.log("Data transmitted to backend successfully")
    try{
      await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      })
      res.send('success')
    }catch(err){
      console.log(err.message)
    }

  }else{
    console.log("There is no Data")
  }
})