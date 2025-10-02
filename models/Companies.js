import sequelize from "../config/database.js"
import { DataTypes, Model } from "sequelize";
import Users from "./Companies.js";

class Companies extends Model {}
  
Companies.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    industry: DataTypes.STRING,
    website: DataTypes.STRING,
    userID: DataTypes.INTEGER,
    arrangement: DataTypes.INTEGER
},{
    sequelize,
    modelName: 'Companies',
    timestamps: true
});

Companies.associate = (models) => {
    Companies.belongsTo(models.Users,{foreignKey: "userID", as: "user"})
}

export default Companies;