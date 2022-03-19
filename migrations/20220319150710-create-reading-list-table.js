'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('reading_list', { 
      id_user: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false
      }, 
      id_post: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('reading_list');
  }
};
