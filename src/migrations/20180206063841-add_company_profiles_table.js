'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('company_profiles', {
          company_id: {
              primaryKey: true,
              allowNull: false,
              type: Sequelize.BIGINT,
              references: {
                  model: "companies",
                  key: "id"
              }
          },
          profile_id: {
              primaryKey: true,
              allowNull: false,
              type: Sequelize.BIGINT,
              references: {
                  model: "profiles",
                  key: "id"
              }
          }
      });
  },

  down: (queryInterface) => {
      return queryInterface.dropTable('company_profiles', {});
  }
};
