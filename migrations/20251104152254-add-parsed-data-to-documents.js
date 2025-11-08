'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    // Add columns to support Affinda AI resume parsing
    await queryInterface.addColumn('Documents', 'parsedData', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'JSON string of parsed resume data from Affinda API'
    });
    
    await queryInterface.addColumn('Documents', 'isParsed', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Whether the document has been successfully parsed by AI'
    });
    
    await queryInterface.addColumn('Documents', 'parseFailed', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Whether AI parsing failed for this document'
    });
    
    await queryInterface.addColumn('Documents', 'parseError', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Error message if parsing failed'
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove columns if migration is rolled back
    await queryInterface.removeColumn('Documents', 'parsedData');
    await queryInterface.removeColumn('Documents', 'isParsed');
    await queryInterface.removeColumn('Documents', 'parseFailed');
    await queryInterface.removeColumn('Documents', 'parseError');
  }
};
