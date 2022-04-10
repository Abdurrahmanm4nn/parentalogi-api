'use strict';

const sequelize = require("sequelize");

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn('users', 'time_joined', {
      type: Sequelize.BIGINT,
      defaultValue: 0,
      allowNull: false
    });
    await queryInterface.addColumn('users', 'nama_pengguna', { 
      type: Sequelize.STRING(30), 
      allowNull: false,
      defaultValue: ''
    });
    await queryInterface.addColumn('users', 'nama', { 
      type: Sequelize.STRING(30), 
      allowNull: false,
      defaultValue: ''
    });
    await queryInterface.addColumn('users', 'bio', { 
      type: Sequelize.STRING(200), defaultValue: null }
    );
    await queryInterface.addColumn('users', 'tanggal_lahir', {
      type: Sequelize.DATEONLY, defaultValue: null }
    );
    await queryInterface.addColumn('users', 'domisili', { 
      type: Sequelize.STRING(100), defaultValue: null }
    );
    await queryInterface.addColumn('users', 'pekerjaan', { 
      type: Sequelize.STRING(100), defaultValue: null }
    );
    await queryInterface.addColumn('users', 'foto_profil', { 
      type: Sequelize.STRING, defaultValue: null }
    );
    await queryInterface.addColumn('users', 'createdAt', { 
      type: Sequelize.DATE, 
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
     }
    );
    await queryInterface.addColumn('users', 'updatedAt', { 
      type: Sequelize.DATE, 
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
     }
    );
    await queryInterface.addColumn('users', 'waktu_terakhir_ubah_password', { 
      type: Sequelize.DATE, 
      allowNull: false,
      defaultValue: sequelize.fn('NOW') 
     }
    );
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.ENUM('ACTIVE','BANNED','DELETED',''), 
      allowNull: false,
      defaultValue: ''
     }
    ); 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'nama_pengguna');
    await queryInterface.removeColumn('users', 'nama');
    await queryInterface.removeColumn('users', 'bio');
    await queryInterface.removeColumn('users', 'tanggal_lahir');
    await queryInterface.removeColumn('users', 'domisili');
    await queryInterface.removeColumn('users', 'pekerjaan');
    await queryInterface.removeColumn('users', 'foto_profil');
    await queryInterface.removeColumn('users', 'createdAt');
    await queryInterface.removeColumn('users', 'updatedAt');
    await queryInterface.removeColumn('users', 'waktu_terakhir_ubah_password');
    await queryInterface.removeColumn('users', 'status'); 
  }
};
