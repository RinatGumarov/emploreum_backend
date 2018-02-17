'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      // return queryInterface.createTable('employee_works', {
      //     employee_id: {
      //         primaryKey: true,
      //         allowNull: false,
      //         type: Sequelize.BIGINT,
      //         references: {
      //             model: "employees",
      //             key: "id"
      //         },
      //         cascade: true,
      //         onDelete: 'CASCADE',
      //     },
      //     work_id: {
      //         primaryKey: true,
      //         // allowNull: false,
      //         type: Sequelize.BIGINT,
      //         references: {
      //             model: "works",
      //             key: "id"
      //         },
      //         cascade: true,
      //         onDelete: 'CASCADE',
      //     }
      // });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('employee_works');

  }
};
