'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.addColumn("vacancies", "test_id", {
            type: Sequelize.BIGINT,
            references: {
                model: "tests",
                key: "id",
            },
        }, {});
    },

    down(queryInterface, Sequelize) {
        return queryInterface.removeColumn("vacancies", "test_id")
    }
};