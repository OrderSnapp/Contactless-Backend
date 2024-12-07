'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const existingUserRole = await queryInterface.rawSelect('UserRoles', {
      where: {
        userId: 1,
        roleId: 1
      },
    }, ['id']);

    // If the user role does not exist, insert it
    if (!existingUserRole) {
      await queryInterface.bulkInsert('UserRoles', [
        {
          userId: 1,
          roleId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserRoles', null, {});
  }
};
