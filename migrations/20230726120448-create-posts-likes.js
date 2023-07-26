'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PostsLikes', {
      like_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'user_id',
        },
        onDelete: 'CASCADE'
      },
      post_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Posts',
          key: 'post_id',
        },
        onDelete: 'CASCADE'
      },
      comment_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Comments',
          key: 'comment_id',
        },
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PostsLikes');
  }
};