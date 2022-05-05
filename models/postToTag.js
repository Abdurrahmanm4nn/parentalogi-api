require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  config.database, 
  config.username, 
  config.password,
  {
    host: config.host,
    dialect: config.dialect
  }
);

const PostToTag = sequelize.define('post_to_tag', {
  id_post: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    allowNull: false
  }, 
  id_tag: {
    type: DataTypes.INTEGER(11),
    primaryKey: true,
    allowNull: false
  }
});

module.exports = PostToTag;