'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('proffile_skills', {
      proffile_id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "proffiles",
          key: "id"
        }
      },
      skill_id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "skills",
          key: "id"
        }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('proffile_skills');
  }
};
