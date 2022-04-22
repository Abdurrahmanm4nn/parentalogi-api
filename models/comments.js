const { Sequelize, sequelize } = require("./baseModel");
const Posts = require("./posts");
const Users = require("./users");

const Comments = sequelize.define("comments", {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_post: {
    type: Sequelize.INTEGER(11),
    references: {
      model: Posts,
      key: "id",
    },
    allowNull: false,
  },
  id_penulis: {
    type: Sequelize.INTEGER(11),
    references: {
      model: Users,
      key: "user_id",
    },
    allowNull: false,
  },
  orang_tua: { type: Sequelize.INTEGER(11), allowNull: false, defaultValue: 0 },
  isi_text: { type: Sequelize.TEXT("long"), allowNull: false },
  jumlah_disukai: {
    type: Sequelize.INTEGER(8),
    allowNull: false,
    defaultValue: 0,
  },
  createdAt: { type: Sequelize.DATE, allowNull: false },
  telah_dihapus: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 0 },
  telah_diubah: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 0 },
  updatedAt: { type: Sequelize.DATE, allowNull: false },
});

module.exports = Comments;
