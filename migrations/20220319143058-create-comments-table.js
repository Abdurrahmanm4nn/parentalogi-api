'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('comments', { 
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_post: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      id_penulis: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      orang_tua: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      isi_text: {
        type: Sequelize.TEXT('long'),
        allowNull: false
      }, 
      jumlah_disukai: {
        type: Sequelize.INTEGER(8),
        allowNull: false,
        defaultValue: 0
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      telah_dihapus: { 
        type: Sequelize.TINYINT(1), 
        allowNull: false, 
        defaultValue: 0 
      },
      telah_diubah: { 
        type: Sequelize.TINYINT(1), 
        allowNull: false, 
        defaultValue: 0 
      },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('comments');
  }
};
