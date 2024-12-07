'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const existingUser = await queryInterface.rawSelect('Users', {
      where: {
        username: 'Sunchengchhay'
      },
    }, ['id']);

    const salt = bcrypt.genSaltSync(10);
    

    // If the user does not exist, insert it
    if (!existingUser) {
      await queryInterface.bulkInsert('Users', [
        {
          username: 'Sunchengchhay',
          email: 'sunchengchhay@gmail.com',
          password: bcrypt.hashSync('Sonchhay2018@@', salt),
          phone: '096 777 777',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 1,
          updatedBy: 1,
        }
      ], {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
