'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.addColumn("companies", "response_text", {
            type: Sequelize.BIGINT,
        }, {});
    },

    down(queryInterface, Sequelize) {
        return queryInterface.removeColumn("companies", "response_text")
    }
};