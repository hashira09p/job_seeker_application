import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sequelize from './config/database.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';

const port = 3000;
const app = express();
const saltRounds = 15;

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

app.listen(port, () => {
  console.log(`Server is running in port ${port}`)
})

app.post("/submit", async (req, res) => {
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
          role: role
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