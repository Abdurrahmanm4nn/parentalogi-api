'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_likes_to_post', [
      {
        id_user: 8,
        id_post: 3
      },
      {
        id_user: 10,
        id_post: 7
      },
      {
        id_user: 4,
        id_post: 6
      },
      {
        id_user: 9,
        id_post: 10
      },
      {
        id_user: 6,
        id_post: 1
      },
      {
        id_user: 2,
        id_post: 4
      },
      {
        id_user: 3,
        id_post: 2
      },
      {
        id_user: 7,
        id_post: 8
      },
      {
        id_user: 1,
        id_post: 9
      },
      {
        id_user: 5,
        id_post: 5
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_likes_to_post', null, {});
  }
};
