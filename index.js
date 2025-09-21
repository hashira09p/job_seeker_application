import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import sequelize from './config/database.js'
import User from './models/User.js'

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
  // if (req.body){
  //   try{
  //     await User.create({name: })
  //   }
  // }
})