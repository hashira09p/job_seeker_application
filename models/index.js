import Users from "./Users.js"
import Companies from "./Companies.js";
import JobPostings from "./JobPostings.js"
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

Users.associate(db);
Companies.associate(db);
JobPostings.associate(db);

export default db;