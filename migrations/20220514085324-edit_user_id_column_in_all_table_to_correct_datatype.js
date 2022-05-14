'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    //Table : comments
    await queryInterface.changeColumn('comments', 'id_penulis', {
      type: Sequelize.UUID,
      allowNull: false
    });
    
    //Table : posts
    await queryInterface.changeColumn('posts', 'id_penulis', {
      type: Sequelize.UUID,
      allowNull: false
    });
    
    //Table : reading_list
    await queryInterface.changeColumn('reading_list', 'id_user', {
      type: Sequelize.UUID,
      allowNull: false
    });

    // Table : user_follows_user
    await queryInterface.changeColumn('user_follows_user', 'id_pengikut', {
      type: Sequelize.UUID,
      allowNull: false
    });
    await queryInterface.changeColumn('user_follows_user', 'id_diikuti', {
      type: Sequelize.UUID,
      allowNull: false
    });

    // Table : user_likes_to_comment
    await queryInterface.changeColumn('user_likes_to_post', 'id_user', {
      type: Sequelize.UUID,
      allowNull: false
    });

    // Table : user_likes_to_post
    await queryInterface.changeColumn('user_likes_to_post', 'id_user', {
      type: Sequelize.UUID,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    //Table : comments
    await queryInterface.changeColumn('posts', 'id_penulis', {
      type: Sequelize.CHAR(36),
      allowNull: false
    });
    
    //Table : posts
    await queryInterface.changeColumn('posts', 'id_penulis', {
      type: Sequelize.CHAR(36),
      allowNull: false
    });
    
    //Table : reading_list
    await queryInterface.changeColumn('reading_list', 'id_user', {
      type: Sequelize.CHAR(36),
      allowNull: false
    });

    // Table : user_follows_user
    await queryInterface.changeColumn('user_follows_user', 'id_pengikut', {
      type: Sequelize.CHAR(36),
      allowNull: false
    });
    await queryInterface.changeColumn('user_follows_user', 'id_diikuti', {
      type: Sequelize.CHAR(36),
      allowNull: false
    });

    // Table : user_likes_to_comment
    await queryInterface.changeColumn('user_likes_to_post', 'id_user', {
      type: Sequelize.CHAR(36),
      allowNull: false
    });

    // Table : user_likes_to_post
    await queryInterface.changeColumn('user_likes_to_post', 'id_user', {
      type: Sequelize.CHAR(36),
      allowNull: false
    });
  }
};
