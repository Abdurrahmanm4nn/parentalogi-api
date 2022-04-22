require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config")[env];
const { Sequelize, DataTypes } = require("sequelize");

// passing parameters for database connection based on environment
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

module.exports = { Sequelize, sequelize };