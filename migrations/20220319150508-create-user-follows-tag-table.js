'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_follows_tag', { 
      id_user: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false
      }, 
      id_tag: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_follows_tag');
  }
};
