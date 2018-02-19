'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.addColumn("employees", "contract", {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                }, {}),
                queryInterface.addColumn("companies", "contract", {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                }, {}),
            ]);
        });
    },

    down(queryInterface, Sequelize) {
        //no need for down method
    }
};