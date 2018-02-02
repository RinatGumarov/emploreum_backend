'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('languages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      language: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
        comment: 'наименование языка'
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('languages', {});
  }
};
