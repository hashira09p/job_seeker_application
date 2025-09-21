'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn("User","username","firstName")
    await queryInterface.addColumn('User','lastName',{
      type: Sequelize.STRING,
      allowNull: false
    })
    await queryInterface.addColumn("User", "role",{
      type:Sequelize.STRING,
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn("User","firstName","username")
    await queryInterface.removeColumn('User','lastName')
    await queryInterface.removeColumn("User", "role")
  }
};
