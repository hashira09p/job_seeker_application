import Users from "./Users.js"
import Companies from "./Companies.js";
import fs from "fs"
import path from "path";
import sequelize from "../config/database.js";
import { Sequelize } from "sequelize";

const db = {}


db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Users = Users;
db.Companies = Companies

Users.associate(db);
Companies.associate(db);

export default db;