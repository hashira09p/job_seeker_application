import sequelize from "../config/database";
import { DataTypes, Model } from "sequelize";

class Applicants extends Model {}
Applicants.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    jobID: DataTypes.INTEGER,
    userID: DataTypes.INTEGER,
    status: DataTypes.STRING,
    documentID: DataTypes.INTEGER,
    coverLetter:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Applicants',
});