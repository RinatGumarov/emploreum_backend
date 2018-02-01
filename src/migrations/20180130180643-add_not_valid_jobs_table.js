'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('not_valid_jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "users",
          key: "id"
        }
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      start: {
        allowNull: false,
        type: Sequelize.DATE
      },
      finish: {
        type: Sequelize.DATE,
        comment: "конец работы, если не передано значит работает на этой работе"
      },
      desc: {
        allowNull: false,
        type: Sequelize.DATE,
        comment: "описание чем занимался на работе"
      }
    });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('not_valid_jobs');
  }
};
