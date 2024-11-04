'use strict';

const { faker } = require('@faker-js/faker');

// Number of entries to create
const TOTAL_PLANTS = 50_000;
// Batch size for each insertion
const BATCH_SIZE = 10_000;

module.exports = {
  async up(queryInterface, Sequelize) {
    const plants = [];

    for (let i = 0; i < TOTAL_PLANTS; i++) {
      plants.push({
        name: faker.word.noun(),
        bloom_time: faker.date.month(),
        planting_time: faker.date.month(),
        discoverer: faker.person.fullName(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Insert in batches
      if (plants.length === BATCH_SIZE) {
        await queryInterface.bulkInsert('Plants', plants, {});
        console.log(`Inserted ${i + 1} plants`);
        plants.length = 0;
      }
    }

    // Insert any remaining plants that didn't fill the last batch
    if (plants.length > 0) {
      await queryInterface.bulkInsert('Plants', plants, {});
      console.log(`Inserted remaining ${plants.length} plants`);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Plants', null, {});
  }
};
