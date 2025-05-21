import { Sequelize, DataTypes } from "sequelize";
import db from "../config/database.js";

const Admin = db.define("admin", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'createdat',   
  updatedAt: 'updatedat'
});

export default Admin;
