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

const Users = sequelize.define('users', {
    user_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(128),
        allowNull: false,
        unique: true
      },
      password_hash: { type: Sequelize.STRING(128), allowNull: false },
      nama_pengguna: { type: Sequelize.STRING(30), allowNull: false },
      nama: { type: Sequelize.STRING(30), allowNull: false },
      bio: { type: Sequelize.STRING(200), defaultValue: null },
      tanggal_lahir: {type: Sequelize.DATEONLY, defaultValue: null },
      domisili: { type: Sequelize.STRING(100), defaultValue: null },
      pekerjaan: { type: Sequelize.STRING(100), defaultValue: null },
      foto_profil: { type: Sequelize.STRING, defaultValue: null },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      waktu_terakhir_ubah_password: { type: Sequelize.DATE, allowNull: false },
      status: {type: Sequelize.ENUM('ACTIVE','BANNED','DELETED',''), allowNull: false }
})

Users.addScope('profile', 
  { 
   attributes: { 
     exclude: [
      'password_hash', 
      'user_id', 
      'createdAt', 
      'updatedAt', 
      'waktu_terakhir_ubah_password', 
      'status'
    ] } 
  }
);

module.exports = Users;