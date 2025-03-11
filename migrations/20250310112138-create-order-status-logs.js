'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('OrderStatusLogs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED', 'ACCEPTED', 'COOKING', 'COOKED', 'COMPLETED'),
        allowNull: false,
      },
      changedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.addIndex('OrderStatusLogs', ['orderId']);
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderStatusLogs');
  }
};
