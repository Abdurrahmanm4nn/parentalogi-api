'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_follows_tag', [
      {
        id_user: 8,
        id_tag: 3
      },
      {
        id_user: 10,
        id_tag: 7
      },
      {
        id_user: 4,
        id_tag: 6
      },
      {
        id_user: 9,
        id_tag: 10
      },
      {
        id_user: 6,
        id_tag: 1
      },
      {
        id_user: 2,
        id_tag: 4
      },
      {
        id_user: 3,
        id_tag: 2
      },
      {
        id_user: 7,
        id_tag: 8
      },
      {
        id_user: 1,
        id_tag: 9
      },
      {
        id_user: 5,
        id_tag: 5
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_follows_tag', null, {});
  }
};
