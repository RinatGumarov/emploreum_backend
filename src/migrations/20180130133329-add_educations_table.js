'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('educations', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.BIGINT
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        comment: 'наименование образовательного учреждения'
      },
      level: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "gradation_enums",
          key: "id"
        },
        comment: 'уровень заведения'
      },
      employee_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "employees",
          key: "id"
        }
      },
      start: {
        allowNull: false,
        type: Sequelize.DATE,
        comment: 'начало обучения'
      },
      finish: {
        type: Sequelize.DATE,
        comment: 'конец обучения( если не передано значит обучается тут)' 
      }

    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('educations', {});
  }
};
