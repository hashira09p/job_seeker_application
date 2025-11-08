import { Sequelize } from "sequelize";
import dotenv from "dotenv"

dotenv.config();

const sequelize = new Sequelize("una_sa_trabaho_app", "postgres", process.env.DATABASE_PASSWORD || "password123", {
    host: "localhost",
    dialect: "postgres",
    logging: false
})

// Test the connection
sequelize.authenticate()
    .then(() => console.log('✓ Database connected successfully'))
    .catch(err => console.error('✗ Unable to connect to database:', err.message));

export default sequelize;