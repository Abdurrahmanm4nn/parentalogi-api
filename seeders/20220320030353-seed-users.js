'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        user_id: '1',
        email: 'Bob_Carter8695@gembat.biz',
        password_hash: 'password',
        nama_pengguna: 'Bob_gendats',
        nama: 'Bob Carter',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        user_id: '2',
        email: 'Russell_James5235@extex.org',
        password_hash: 'password',
        nama_pengguna: 'Jr696',
        nama: 'James Russell',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        user_id: '3',
        email: 'Marvin_Beal6555@qater.org',
        password_hash: 'password',
        nama_pengguna: 'koh_Marvin',
        nama: 'Marvin Beal',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        user_id: '4',
        email: 'Kurt_Villiger975@deavo.com',
        password_hash: 'password',
        nama_pengguna: 'Kv975',
        nama: 'Kurt Villiger',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        user_id: '5',
        email: 'Frank_Drummond6929@yahoo.com',
        password_hash: 'password',
        nama_pengguna: 'BigFrankyD',
        nama: 'Frank Drummond',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        user_id: '6',
        email: 'Remy_Abbey8327@ovock.tech',
        password_hash: 'password',
        nama_pengguna: 'RemygaGigit',
        nama: 'Remy Abbey',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        user_id: '7',
        email: 'Mike_Warren6859@muall.tech',
        password_hash: 'password',
        nama_pengguna: 'MikelvNotWar',
        nama: 'Mike Warren',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        user_id: '8',
        email: 'John_Martin7564@netmail.net',
        password_hash: 'password',
        nama_pengguna: 'JonijoniyesPapa',
        nama: 'John Martin',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        user_id: '9',
        email: 'Newton_Isaac8460@dionrab.com',
        password_hash: 'password',
        nama_pengguna: 'EatDatPhysics',
        nama: 'Isaac Newton',
        waktu_terakhir_ubah_password: Sequelize.fn('NOW'),
        status: 'ACTIVE'
      },
      {
        user_id: '10',
        email: 'Evan_Gregory5855@bretoux.com',
        password_hash: 'password',
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
