'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("users", "role", {})
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.addColumn("users", "role", Sequelize.STRING)
    }
};
