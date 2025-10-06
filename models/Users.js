import sequelize from "../config/database.js";
import { DataTypes, Model } from "sequelize";

class Users extends Model {}

Users.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    fullName: DataTypes.STRING
},{
    sequelize,
    modelName: "Users",
    timestamps: true
})

Users.associate = (models) => {
    Users.hasOne(models.Companies,{foreignKey: "userID", as: "company"})
}

export default Users;