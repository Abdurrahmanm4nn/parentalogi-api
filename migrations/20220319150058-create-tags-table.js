'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tags', { 
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      }, 
      nama: { type: Sequelize.STRING(20), allowNull: false },
      deskripsi: { type: Sequelize.STRING, defaultValue: null },
      warna: { type: Sequelize.STRING(20), defaultValue: null }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tags');
  }
};
