'use strict';

const Users = require('./data/users');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const results = [];
    const salt = await bcrypt.genSalt(10);

    for (const res of Users) {
      const password = await bcrypt.hash(res.password, salt);
      results.push({
        id: res.id,
        name: `${res.name}_${res.id.slice(0, 5)}`,
        gender: res.gender,
        location: res.location,
        university: res.university,
        interests: res.interests,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('users', results);
  },

  async down(queryInterface) {
    const removeData = [];
    Users.forEach((res) => {
      removeData.push(res.id);
    });
    return queryInterface.bulkDelete('users', { id: removeData }, null);
  },
};
