'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('proffiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      name: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      }
    });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('proffiles');
  }
};
