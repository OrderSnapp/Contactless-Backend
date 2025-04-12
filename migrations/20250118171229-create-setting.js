'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Settings', {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      theme:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      shopName:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      shopLogo:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      font:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      systemUrl:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt:{
        type: Sequelize.DATE,
        allowNull: Sequelize.NOW,
      },
      updatedAt:{
        type: Sequelize.DATE,
        allowNull: Sequelize.NOW,
      },
      createdBy:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updatedBy:{
        type: Sequelize.INTEGER,
        allowNull: true,
      }
})},

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Settings');
  }
};
