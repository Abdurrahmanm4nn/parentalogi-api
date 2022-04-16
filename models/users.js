require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, 
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

const Users = sequelize.define('users', {
    id: {
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
      password: { type: Sequelize.STRING(128), allowNull: false },
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

module.exports = Users;