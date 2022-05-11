const { Sequelize, sequelize } = require("./baseModel");

const ReadingList = sequelize.define("reading_list", {
    id_user: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
        allowNull: false
    },
    id_post: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false
    }
});

module.exports = ReadingList;