import sequelize from "../config/database.js";
import { DataTypes, Model } from "sequelize";
class Documents extends Model {}
  
Documents.init({
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  docType: DataTypes.STRING,
  fileDir: DataTypes.STRING,
  fileName: DataTypes.STRING,
  deletedAt: DataTypes.DATE
}, {
  sequelize,
  modelName: 'Documents',
});

Documents.associate =(models) => {
  Documents.belongsTo(models.Users,{foreignKey: "userID", as: "user"})
  Documents.belongsToMany(models.JobPostings, {through:"Applicants",foreignKey: "documentID", as: "jobSent"})
}

export default Documents;