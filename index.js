import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'

const port = 3000;
const app = express();

app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is running in port ${port}`)
})

app.post("/submit", async(req, res) =>{
  console.log(req.body)
})