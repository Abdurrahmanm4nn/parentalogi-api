require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config")[env];
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

const UserLikesToPost = sequelize.define(
  "user_likes_to_post",
  {
    id_user: {
      type: Sequelize.CHAR(36),
      primaryKey: true,
      allowNull: false,
    },
    id_post: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    incrementMe: { type: Sequelize.INTEGER, autoIncrement: false },
    freezeTableName: true,
  }
);

module.exports = UserLikesToPost;
