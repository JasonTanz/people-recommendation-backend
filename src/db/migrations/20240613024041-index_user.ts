'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('users', {
      fields: ['university'],
    });
    await queryInterface.addIndex('users', {
      fields: ['interests'],
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('users', ['university']);
    await queryInterface.removeIndex('users', ['interests']);
  },
};
