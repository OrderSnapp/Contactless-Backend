'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Tables', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      menuId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Menus', // Name of the referenced table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
        
      },
      qrImage: {
        type: Sequelize.BLOB,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: Sequelize.NOW,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Tables');
  }
};
