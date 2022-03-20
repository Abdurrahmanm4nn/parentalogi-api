'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tags', [
      { nama: 'Pertukangan' },
      { nama: 'Otomotif' },
      { nama: 'Teknologi' },
      { nama: 'Parenting' },
      { nama: 'Kuliner' },
      { nama: 'Rumah Tangga' },
      { nama: 'Olahraga' },
      { nama: 'Sosial' },
      { nama: 'Finance' },
      { nama: 'Bisnis' }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tags', null, {});
  }
};
