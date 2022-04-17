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

const Posts = sequelize.define('users', {
  id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
  id_penulis: {
    type: Sequelize.INTEGER(11),
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  judul: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  isi_text: {
    type: Sequelize.TEXT('long'),
    allowNull: false
  }, 
  jumlah_disukai: {
    type: Sequelize.INTEGER(8),
    allowNull: false,
    defaultValue: 0
  },
  createdAt: { type: Sequelize.DATE, allowNull: false },
  telah_dihapus: { 
    type: Sequelize.TINYINT(1), 
    allowNull: false, 
    defaultValue: 0 
  },
  telah_diubah: { 
    type: Sequelize.TINYINT(1), 
    allowNull: false, 
    defaultValue: 0 
  },
  updatedAt: { type: Sequelize.DATE, allowNull: false }
});

module.exports = Posts;