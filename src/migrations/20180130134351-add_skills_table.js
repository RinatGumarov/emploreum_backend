'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('skills', {
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
      },
      photo_path: {
        allowNull: false,
        type: Sequelize.STRING
      },
      parent_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "skills",
          key: "id"
        },
        comment: 'Родительский скил'
      }
    });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('skills');
  }
};
