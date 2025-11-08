import sequelize from "../config/database.js";
import { DataTypes, Model } from "sequelize";

class Applicants extends Model {}
Applicants.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    JobPostingId:{
      type: DataTypes.INTEGER,
      field: 'JobPostingId',
      onDelete: "CASCADE",
    },
    userID:{
      type: DataTypes.INTEGER,
      field: 'userID',
      onDelete: "CASCADE",
    },
    status: DataTypes.STRING,
    documentID:{
      type: DataTypes.INTEGER,
      field: 'documentID',
      onDelete: "CASCADE",
    },
    coverLetter:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Applicants',
});

Applicants.associate = (models) => {
  Applicants.belongsTo(models.JobPostings,{ foreignKey: { name: 'JobPostingId', field: 'JobPostingId', as:"jobPosting", allowNull: false }, onDelete: "CASCADE",});
  Applicants.belongsTo(models.Users,{foreignKey: "userID"})
  Applicants.belongsTo(models.Documents, {
  foreignKey: "documentID",
  onDelete: "CASCADE",
});
}

export default Applicants;