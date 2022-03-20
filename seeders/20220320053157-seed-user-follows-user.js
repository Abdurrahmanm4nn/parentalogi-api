'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_follows_user', [
      {
        id_pengikut: 8,
        id_diikuti: 1
      },
      {
        id_pengikut: 10,
        id_diikuti: 3
      },
      {
        id_pengikut: 4,
        id_diikuti: 10
      },
      {
        id_pengikut: 9,
        id_diikuti: 6
      },
      {
        id_pengikut: 6,
        id_diikuti: 7
      },
      {
        id_pengikut: 2,
        id_diikuti: 5
      },
      {
        id_pengikut: 3,
        id_diikuti: 2
      },
      {
        id_pengikut: 7,
        id_diikuti: 8
      },
      {
        id_pengikut: 1,
        id_diikuti: 4
      },
      {
        id_pengikut: 5,
        id_diikuti: 9
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_follows_user', null, {});
  }
};
