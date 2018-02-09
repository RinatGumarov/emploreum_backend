'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('vacancy_profile_skills', {
          vacancy_id: {
              type: Sequelize.BIGINT,
              allowNull: false,
              references: {
                  model: "vacancies",
                  key: "id",
              },
              cascade: true,
              onDelete: "CASCADE",
          },
          profile_skill_id: {
              type: Sequelize.BIGINT,
              allowNull: false,
              references: {
                  model: "profile_skills",
                  key: "id",
              },
              cascade: true,
              onDelete: "CASCADE",
          }
      });
  },

  down: (queryInterface) => {
      return queryInterface.dropTable('vacancy_profile_skills', {});
  }
};
