'use strict';

const { updatedBy } = require('../src/utils/timestamp');

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
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedBy : {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    });
    await queryInterface.addIndex('OrderStatusLogs', ['orderId']);
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderStatusLogs');
  }
};
