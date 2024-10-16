'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove all plants from the Plants table
    await queryInterface.bulkDelete('Plants', null, {});
    await queryInterface.sequelize.query('ALTER TABLE Plants AUTO_INCREMENT = 1;');
  },

  async down(queryInterface, Sequelize) {
    // No need to rollback
    return;
  }
};
