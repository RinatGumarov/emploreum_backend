'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('profile_skills', {
      profile_id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "profiles",
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

  down: (queryInterface) => {
      return queryInterface.dropTable('profile_skills', {});
  }
};
