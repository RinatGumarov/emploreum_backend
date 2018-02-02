'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('profiles', {
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

  down: (queryInterface) => {
      return queryInterface.dropTable('profiles', {});
  }
};
