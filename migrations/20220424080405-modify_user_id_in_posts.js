'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('posts', 'id_penulis', {
      type: Sequelize.STRING(36),
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('posts', 'id_penulis', {
      type: Sequelize.INTEGER(11),
      allowNull: false
    });
  }
};
