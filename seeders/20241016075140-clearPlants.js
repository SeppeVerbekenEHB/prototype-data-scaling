'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Plants', null, {});
    await queryInterface.sequelize.query('ALTER TABLE Plants AUTO_INCREMENT = 1;');
  },

  async down(queryInterface, Sequelize) {
    return;
  }
};
