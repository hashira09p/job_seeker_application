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
  deletedAt: DataTypes.DATE,
  // New fields for AI parsing with Affinda
  parsedData: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON string of parsed resume data from Affinda API'
  },
  isParsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Whether the document has been successfully parsed by AI'
  },
  parseFailed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Whether AI parsing failed for this document'
  },
  parseError: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Error message if parsing failed'
  }
}, {
  sequelize,
  modelName: 'Documents',
});

Documents.associate =(models) => {
  Documents.belongsTo(models.Users,{foreignKey: "userID", as: "user"})
  Documents.belongsToMany(models.JobPostings, {through:"Applicants",foreignKey: "documentID", as: "jobSent"})
}

export default Documents;