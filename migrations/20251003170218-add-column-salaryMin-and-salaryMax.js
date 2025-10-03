'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("JobPostings", "salaryMin", {
      type: Sequelize.INTEGER,
      allowNull: true
    })
    
    await queryInterface.removeColumn("JobPostings", "salary")

    await queryInterface.addColumn("JobPostings", "salaryMax", {
      type: Sequelize.INTEGER
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("JobPostings", "salaryMin")

    await queryInterface.removeColumn("JobPostings", "salaryMax")
 
  }
};
