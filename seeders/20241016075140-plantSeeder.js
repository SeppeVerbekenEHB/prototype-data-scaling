'use strict';

const { faker } = require('@faker-js/faker');

// Generate 100 random plant objects
const plants = [];

for (let i = 0; i < 100; i++) {
  plants.push({
    name: faker.word.noun(),
    bloom_time: faker.date.month(),
    planting_time: faker.date.month(),
    discoverer: faker.person.fullName(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert 100 random plants
    await queryInterface.bulkInsert('Plants', plants, {});
  },

  async down(queryInterface, Sequelize) {
    // Remove all plants when rolling back
    await queryInterface.bulkDelete('Plants', null, {});
  }
};
