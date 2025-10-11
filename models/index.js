import Users from "./user.js"
import Companies from "./company.js";
import JobPostings from "./jobPosting.js"
import Documents from "./document.js"
import fs from "fs"
import path from "path";
import sequelize from "../config/database.js";
import { Sequelize } from "sequelize";

const db = {}


db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Users = Users;
db.Companies = Companies;
db.JobPostings = JobPostings;
db.Documents = Documents;

Users.associate(db);
Companies.associate(db);
JobPostings.associate(db);
Documents.associate(db);

export default db;