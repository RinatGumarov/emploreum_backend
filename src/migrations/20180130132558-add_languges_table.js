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
      languge: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
        comment: 'наименование языка'
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('languages');
  }
};
