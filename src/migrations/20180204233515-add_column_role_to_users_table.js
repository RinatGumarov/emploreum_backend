'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.addColumn('users', 'role', Sequelize.STRING);
    },

    down: (queryInterface) => {
        queryInterface.removeColumn('users', 'role');
    }
};
