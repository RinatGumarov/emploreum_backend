'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction(() => {
          return Promise.all([
              queryInterface.removeColumn('employees', 'photo_path', {}, {}),
              queryInterface.removeColumn('companies', 'logo', {}, {}),
              queryInterface.addColumn("employees", "photo_path", {
                  type: Sequelize.STRING,
                  comment: 'путь до аватарки',
                  defaultValue : "/upload/empty.png"
              }, {}),
              queryInterface.addColumn("companies", "logo", {
                  type: Sequelize.STRING,
                  comment: 'путь до аватарки',
                  defaultValue : "/upload/empty.png"
              }, {}),
          ]);
      });
  },

  down: (queryInterface, Sequelize) => {
    // нету изменение дефаулт значения
  }
};
