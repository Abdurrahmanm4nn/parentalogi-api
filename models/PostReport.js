const { Sequelize, sequelize } = require("./baseModel");

const PostReport = sequelize.define("post_report", { 
    id_post: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_reporter: {
      type: Sequelize.UUID,
      allowNull: false
    },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });

module.exports = PostReport;