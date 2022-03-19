'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('post_to_tag', { 
      id_post: {
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
    await queryInterface.dropTable('post_to_tag');
  }
};
