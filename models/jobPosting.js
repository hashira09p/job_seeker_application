import sequelize from "../config/database.js";
import {Model, DataTypes} from "sequelize"
class JobPostings extends Model {}

JobPostings.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.STRING,
    companyID: DataTypes.INTEGER,
    location: DataTypes.STRING,
    salaryMin: DataTypes.INTEGER,
    salaryMax: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'JobPostings',
    timestamps: true
});  

JobPostings.associate = (models) => {
  JobPostings.belongsTo(models.Companies,{foreignKey: "companyID", as: "company"})
}

export default JobPostings;