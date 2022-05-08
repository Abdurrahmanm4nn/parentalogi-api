'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('user_follows_user', 'id_pengikut', {
      type: Sequelize.STRING(36),
      allowNull: false
    });
    await queryInterface.changeColumn('user_follows_user', 'id_diikuti', {
      type: Sequelize.STRING(36),
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.changeColumn('user_follows_user', 'id_pengikut', {
      type: Sequelize.INTEGER(11),
      allowNull: false
    });
    await queryInterface.changeColumn('user_follows_user', 'id_diikuti', {
      type: Sequelize.INTEGER(11),
      allowNull: false
    });
  }
};
