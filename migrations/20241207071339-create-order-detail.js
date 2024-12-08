'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('OrderDetails', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      menuItemDetailId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'MenuItemDetails',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      Quantity: {
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable('OrderDetails');
  }
};
