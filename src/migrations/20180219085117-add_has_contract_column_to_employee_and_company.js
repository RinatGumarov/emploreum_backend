'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.addColumn("employees", "contract", {
                    type: Sequelize.STRING,
                }, {}),
                queryInterface.addColumn("companies", "contract", {
                    type: Sequelize.STRING,
                }, {}),
                queryInterface.addColumn("works", "contract", {
                    type: Sequelize.STRING,
                }, {}),
            ]);
        });
    },

    down(queryInterface, Sequelize) {
        //no need for down method
    }
};