import { Sequelize } from "sequelize";
import dotenv from "dotenv"

dotenv.config();

const sequelize = new Sequelize("una_sa_trabaho_app", "postgres", process.env.DATABASE_PASSWORD,{
    host: "localhost",
    dialect: "postgres"
})

export default sequelize;