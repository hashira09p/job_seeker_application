import sequelize from "../config/database.js"
import { DataTypes, Model } from "sequelize";

class Companies extends Model {}
  
Companies.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    industry: DataTypes.STRING,
    website: DataTypes.STRING
},{
    sequelize,
    modelName: 'Companies',
    timestamps: true
});

export default Companies;