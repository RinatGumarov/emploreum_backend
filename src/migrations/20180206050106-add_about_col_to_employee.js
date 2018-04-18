'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      queryInterface.addColumn( 'employees', 'about', Sequelize.TEXT);
  },

  down: (queryInterface) => {
      queryInterface.removeColumn( 'employees', 'about' );
  }
};
