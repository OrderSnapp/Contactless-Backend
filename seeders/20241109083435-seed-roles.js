'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const existingAdminRole = await queryInterface.rawSelect('Roles', {
      where: {
        name: 'Admin'
      },
    }, ['id']);

    const existingUserRole = await queryInterface.rawSelect('Roles', {
      where: {
        name: 'User'
      },
    }, ['id']);

    const existingStaffRole = await queryInterface.rawSelect('Roles', {
      where: {
        name: 'Staff'
      },
    }, ['id']);

    // If the roles do not exist, insert them
    if (!existingAdminRole) {
      await queryInterface.bulkInsert('Roles', [
        {
          name: 'Admin',
          acronym: 'ADM',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], {});
    }

    if (!existingStaffRole) {
      await queryInterface.bulkInsert('Roles', [
        {
          name: 'Staff',
          acronym: 'STF',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], {});
    }

    if (!existingUserRole) {
      await queryInterface.bulkInsert('Roles', [
        {
          name: 'User',
          acronym: 'USR',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
