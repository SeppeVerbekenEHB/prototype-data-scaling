'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Plants', [
      {
        name: 'Rose',
        bloom_time: 'Spring',
        planting_time: 'Early Spring',
        discoverer: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tulip',
        bloom_time: 'Spring',
        planting_time: 'Late Autumn',
        discoverer: 'Jane Smith',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sunflower',
        bloom_time: 'Summer',
        planting_time: 'Early Summer',
        discoverer: 'Mary Johnson',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Plants', null, {});
  }
};
