'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.addColumn("works", "interval_id", {
                    type: Sequelize.STRING,
                    comment: "айдишник интервала, чтобы можно было вырубить автоплатеж"
                }, {}),
            ]);
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.removeColumn("works", "interval_id"),
            ]);
        });
    }
};
