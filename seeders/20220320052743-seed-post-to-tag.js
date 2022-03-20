'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('post_to_tag', [
      {
        id_post: 1,
        id_tag: 1
      },
      {
        id_post: 2,
        id_tag: 2
      },
      {
        id_post: 3,
        id_tag: 3
      },
      {
        id_post: 4,
        id_tag: 4
      },
      {
        id_post: 5,
        id_tag: 5
      },
      {
        id_post: 6,
        id_tag: 6
      },
      {
        id_post: 7,
        id_tag: 7
      },
      {
        id_post: 8,
        id_tag: 8
      },
      {
        id_post: 9,
        id_tag: 9
      },
      {
        id_post: 10,
        id_tag: 10
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('post_to_tag', null, {});
  }
};
