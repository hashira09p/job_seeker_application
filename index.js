import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import sequelize from './config/database.js'

const port = 3000;
const app = express();

app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

async function authenticate(){
  try{
    await sequelize.authenticate()
    console.log("Database connected")
  }catch(err){
    console.log(err.message);    
  }
}

authenticate();

app.listen(port, () => {
  console.log(`Server is running in port ${port}`)
})

app.post("/submit", async(req, res) =>{
  console.log(req.body)
})