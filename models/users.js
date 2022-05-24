const { Sequelize, sequelize } = require("./baseModel");

const Users = sequelize.define("users", {
  user_id: {
    type: Sequelize.CHAR(36),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  email: { type: Sequelize.STRING(128), allowNull: false, unique: true },
  password_hash: { type: Sequelize.STRING(128), allowNull: false },
  nama_pengguna: { type: Sequelize.STRING(30), allowNull: false },
  nama: { type: Sequelize.STRING(30), allowNull: false },
  bio: { type: Sequelize.STRING(200), defaultValue: null },
  tanggal_lahir: { type: Sequelize.DATEONLY, defaultValue: null },
  domisili: { type: Sequelize.STRING(100), defaultValue: null },
  pekerjaan: { type: Sequelize.STRING(100), defaultValue: null },
  foto_profil: { type: Sequelize.STRING, defaultValue: null },
  createdAt: { type: Sequelize.DATE, allowNull: false },
  updatedAt: { type: Sequelize.DATE, allowNull: false },
  waktu_terakhir_ubah_password: { type: Sequelize.DATE, allowNull: false },
  status: {
    type: Sequelize.ENUM("ACTIVE", "BANNED", "DELETED", ""),
    allowNull: false,
  },
  role: {
    type: Sequelize.ENUM('USER', 'ADMIN'),
    allowNull: false,
    defaultValue: 'USER'
  },
});

Users.addScope("profile", {
  attributes: {
    exclude: [
      "password_hash",
      "user_id",
      "createdAt",
      "updatedAt",
      "waktu_terakhir_ubah_password",
      "status",
    ],
  },
});
Users.addScope("sneak-peek", {
  attributes: {
    exclude: [
      "password_hash",
      "user_id",
      "createdAt",
      "updatedAt",
      "waktu_terakhir_ubah_password",
      "status",
      "email",
      "domisili",
      "pekerjaan",
      "tanggal_lahir"
    ],
  },
});
Users.addScope("comments", {
  attributes: {
    exclude: [
      "password_hash",
      "user_id",
      "createdAt",
      "updatedAt",
      "waktu_terakhir_ubah_password",
      "status",
      "email",
      "domisili",
      "pekerjaan",
      "tanggal_lahir",
      "bio"
    ],
  },
});

module.exports = Users;
