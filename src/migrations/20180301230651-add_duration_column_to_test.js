'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.addColumn("tests", "duration", {
                    type: Sequelize.INTEGER,
                    comment: "продолжительность теста в минутах"
                }, {}),
            ]);
        });
    },

    down: (queryInterface) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.removeColumn("tests", "duration"),
            ]);
        });
    }
};
