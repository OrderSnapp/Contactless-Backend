'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Tables', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
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
        type: Sequelize.STRING,
        allowNull: false,
      },
      number:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      shape:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      size:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      capacity:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      position:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
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
