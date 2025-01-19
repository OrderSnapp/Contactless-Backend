'use strict';

const { createdBy, updatedBy } = require('../src/utils/timestamp');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
        id:{
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        firstName:{
          type: Sequelize.STRING,
          allowNull: false
        },
        lastName:{
          type: Sequelize.STRING,
          allowNull: false
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        phone:{
          type: Sequelize.STRING
        },
        status:{
          type: Sequelize.ENUM('Active', 'Inactive'),
          defaultValue: 'Active'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        createdBy:{
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        updatedBy:{
          type: Sequelize.INTEGER,
          allowNull: false
        },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
