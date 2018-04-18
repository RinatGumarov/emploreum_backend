'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction(() => {
          return Promise.all([
              queryInterface.removeColumn('cv_skills', 'cv_id', {}, {}),
              queryInterface.addColumn("cv_skills", "cv_id", {
                  primaryKey: true,
                  allowNull: false,
                  type: Sequelize.BIGINT,
                  references: {
                      model: "cvs",
                      key: "id",
                  },
                  cascade: true,
                  onDelete: "cascade",
              }, {}),
          ]);
      });
  },

  down: (queryInterface, Sequelize) => {
  }
};
