'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('posts', [
      {
        id_penulis: 7,
        slug: 'Pertukangan',
        judul: 'Cara Membetulkan Genteng Rumah yang Bocor',
        isi_text: 'Lorem ipsum dolor sit amet lalala yeyeye ululululu uraaaa!!',
      },
      {
        id_penulis: 5,
        slug: 'Otomotif',
        judul: 'Cara Membetulkan Genteng Rumah yang Bocor',
        isi_text: 'Lorem ipsum dolor sit amet lalala yeyeye ululululu uraaaa!!',
      },
      {
        id_penulis: 1,
        slug: 'Teknologi',
        judul: 'Cara Membetulkan Genteng Rumah yang Bocor',
        isi_text: 'Lorem ipsum dolor sit amet lalala yeyeye ululululu uraaaa!!',
      },
      {
        id_penulis: 2,
        slug: 'Parenting',
        judul: 'Cara Membetulkan Genteng Rumah yang Bocor',
        isi_text: 'Lorem ipsum dolor sit amet lalala yeyeye ululululu uraaaa!!',
      },
      {
        id_penulis: 9,
        slug: 'Kuliner',
        judul: 'Cara Membetulkan Genteng Rumah yang Bocor',
        isi_text: 'Lorem ipsum dolor sit amet lalala yeyeye ululululu uraaaa!!',
      },
      {
        id_penulis: 10,
        slug: 'Rumah Tangga',
        judul: 'Cara Membetulkan Genteng Rumah yang Bocor',
        isi_text: 'Lorem ipsum dolor sit amet lalala yeyeye ululululu uraaaa!!',
      },
      {
        id_penulis: 3,
        slug: 'Olahraga',
        judul: 'Cara Membetulkan Genteng Rumah yang Bocor',
        isi_text: 'Lorem ipsum dolor sit amet lalala yeyeye ululululu uraaaa!!',
      },
      {
        id_penulis: 8,
        slug: 'Sosial',
        judul: 'Cara Membetulkan Genteng Rumah yang Bocor',
        isi_text: 'Lorem ipsum dolor sit amet lalala yeyeye ululululu uraaaa!!',
      },
      {
        id_penulis: 4,
        slug: 'Finance',
        judul: 'Cara Membetulkan Genteng Rumah yang Bocor',
        isi_text: 'Lorem ipsum dolor sit amet lalala yeyeye ululululu uraaaa!!',
      },
      {
        id_penulis: 6,
        slug: 'Bisnis',
        judul: 'Cara Membetulkan Genteng Rumah yang Bocor',
        isi_text: 'Lorem ipsum dolor sit amet lalala yeyeye ululululu uraaaa!!',
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('posts', null, {});
  }
};
