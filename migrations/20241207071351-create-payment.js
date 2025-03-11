'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
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
        onDelete: 'CASCADE',
      },
      paymentDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      paymentMethod: {
        type: Sequelize.ENUM('CASH', 'CARD', 'ONLINE'),
        allowNull: false,
      },
      paymentAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      paymentStatus: {
        type: Sequelize.ENUM('PENDING', 'SUCCESS', 'FAILED'),
        defaultValue: 'PENDING',
      },
      transactionId: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Payments');
  }
};
