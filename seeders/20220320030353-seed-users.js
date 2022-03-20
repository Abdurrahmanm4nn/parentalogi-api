'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        email: 'Bob_Carter8695@gembat.biz',
        password: 'password',
        nama_pengguna: 'Bob_gendats',
        nama: 'Bob Carter',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        email: 'Russell_James5235@extex.org',
        password: 'password',
        nama_pengguna: 'Jr696',
        nama: 'James Russell',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        email: 'Marvin_Beal6555@qater.org',
        password: 'password',
        nama_pengguna: 'koh_Marvin',
        nama: 'Marvin Beal',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        email: 'Kurt_Villiger975@deavo.com',
        password: 'password',
        nama_pengguna: 'Kv975',
        nama: 'Kurt Villiger',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        email: 'Frank_Drummond6929@yahoo.com',
        password: 'password',
        nama_pengguna: 'BigFrankyD',
        nama: 'Frank Drummond',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        email: 'Remy_Abbey8327@ovock.tech',
        password: 'password',
        nama_pengguna: 'RemygaGigit',
        nama: 'Remy Abbey',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        email: 'Mike_Warren6859@muall.tech',
        password: 'password',
        nama_pengguna: 'MikelvNotWar',
        nama: 'Mike Warren',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        email: 'John_Martin7564@netmail.net',
        password: 'password',
        nama_pengguna: 'JonijoniyesPapa',
        nama: 'John Martin',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        email: 'Newton_Isaac8460@dionrab.com',
        password: 'password',
        nama_pengguna: 'EatDatPhysics',
        nama: 'Isaac Newton',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        email: 'Evan_Gregory5855@bretoux.com',
        password: 'password',
        nama_pengguna: 'GEsiBoodjankLapuk',
        nama: 'Gregory Evan',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
