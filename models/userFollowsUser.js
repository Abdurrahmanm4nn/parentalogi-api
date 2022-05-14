const { Sequelize, sequelize } = require("./baseModel");

const UserFollowsUser = sequelize.define("user_follows_user", {
    id_pengikut: {
      type: Sequelize.CHAR(36),
      primaryKey: true,
      allowNull: false
    }, 
    id_diikuti: {
      type: Sequelize.CHAR(36),
      primaryKey: true,
      allowNull: false
    }
});

module.exports = UserFollowsUser;