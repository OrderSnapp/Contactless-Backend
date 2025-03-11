'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tableId: {
        type: Sequelize.UUID,
        references: {
          model: 'Tables',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      orderNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      batchNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      subTotal: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      totalQuantity: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      tax: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      discount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      orderDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      progressStatus: {
          type: Sequelize.ENUM('PENDING', 'APPROVED', 'ACCEPTED', 'COOKING', 'COOKED', 'COMPLETED'),
          allowNull: false,
      },
      totalAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      orderStatus: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('Orders');
  }
};
