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

const Tags = sequelize.define('tags', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nama: { type: DataTypes.STRING(20), allowNull: false },
    deskripsi: { type: DataTypes.STRING, defaultValue: null },
    warna: { type: DataTypes.STRING(20), defaultValue: null },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
});

Tags.addScope('toView',
  {
   attributes: {
     exclude: [
      'createdAt',
      'updatedAt'
    ] }
  }
);

Tags.addScope('onlyIdAndName',
  {
   attributes: {
     include: [
      'id',
      'nama'
    ] }
  }
);

module.exports = Tags;