import { Sequelize } from "sequelize";

const sequelize = new Sequelize("una_sa_trabaho_app", "postgres", "123456",{
    host: "localhost",
    dialect: "postgres"
})

export default sequelize;