'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {  
    await queryInterface.bulkInsert('comments', [
        {
          id_post: 1,
          id_penulis: 7,
          isi_text: 'Lorem ipsum dolor sit amet yaudalaya.'
        },
        {
          id_post: 2,
          id_penulis: 5,
          isi_text: 'Lorem ipsum dolor sit amet yaudalaya.'
        },
        {
          id_post: 3,
          id_penulis: 1,
          isi_text: 'Lorem ipsum dolor sit amet yaudalaya.'
        },
        {
          id_post: 4,
          id_penulis: 2,
          isi_text: 'Lorem ipsum dolor sit amet yaudalaya.'
        },
        {
          id_post: 5,
          id_penulis: 9,
          isi_text: 'Lorem ipsum dolor sit amet yaudalaya.'
        },
        {
          id_post: 6,
          id_penulis: 10,
          isi_text: 'Lorem ipsum dolor sit amet yaudalaya.'
        },
        {
          id_post: 7,
          id_penulis: 3,
          isi_text: 'Lorem ipsum dolor sit amet yaudalaya.'
        },
        {
          id_post: 8,
          id_penulis: 8,
          isi_text: 'Lorem ipsum dolor sit amet yaudalaya.'
        },
        {
          id_post: 9,
          id_penulis: 4,
          isi_text: 'Lorem ipsum dolor sit amet yaudalaya.'
        },
        {
          id_post: 10,
          id_penulis: 6,
          isi_text: 'Lorem ipsum dolor sit amet yaudalaya.'
        }
      ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comments', null, {});
  }
};
