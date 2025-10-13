'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Applicants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      coverLetter: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      jobID: {
        type: Sequelize.INTEGER,
        references:{
          model: "JobPostings",
          key: "id"
        }
      },
      userID: {
        type: Sequelize.INTEGER,
        references:{
          model: "Users",
          key: "id"
        }
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "pending"
      },
      documentID: {
        type: Sequelize.INTEGER,
        references:{
          model: "Documents",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('applicants');
  }
};