'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.addColumn("works", "pay_date", {
                    type: Sequelize.DATE,
                    comment: "время следующей выплаты"
                }, {}),
            ]);
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.removeColumn("works", "pay_date"),
            ]);
        });
    }
};
