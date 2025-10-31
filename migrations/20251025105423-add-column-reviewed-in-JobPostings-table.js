'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("JobPostings", "reviewed",{
      type: Sequelize.BOOLEAN,
      allowNull:false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("JobPostings", "reviewed")
  }
};
