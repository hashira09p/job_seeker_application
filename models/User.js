import sequelize from "../config/database.js";
import { DataTypes, Model } from "sequelize";

class User extends Model {}

User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
},{
    sequelize,
    modelName: "User",
    timestamps: true
})

export default User;