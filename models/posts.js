const { Sequelize, sequelize } = require("./baseModel");
const Users = require("./users");

const Posts = sequelize.define("posts", {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_penulis: {
    type: Sequelize.CHAR(36),
    references: {
      model: Users,
      key: "user_id",
    },
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  judul: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  isi_text: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
  jumlah_disukai: {
    type: Sequelize.INTEGER(8),
    allowNull: false,
    defaultValue: 0,
  },
  foto_cover: { type: Sequelize.STRING, defaultValue: null },
  createdAt: { type: Sequelize.DATE, allowNull: false },
  telah_dihapus: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
  },
  telah_diubah: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
  },
  updatedAt: { type: Sequelize.DATE, allowNull: false },
});

Posts.addScope('toView',
  {
   attributes: {
     exclude: [
      'telah_dihapus'
    ] }
  }
);

module.exports = Posts;
