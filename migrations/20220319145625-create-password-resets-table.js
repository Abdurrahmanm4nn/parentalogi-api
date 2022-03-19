'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('password_resets', { 
      id_user: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false
      }, 
      token: { type: Sequelize.STRING(20), allowNull: false },
      waktu_dibuat: { type: Sequelize.STRING(128), allowNull: false },
      waktu_diperbarui: { type: Sequelize.STRING(128), allowNull: false },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('password_resets');
  }
};
