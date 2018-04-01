'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.removeColumn("companies", "created_at"),
                queryInterface.addColumn("users", "created_at", {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.fn('NOW')
                }, {})
            ]);
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.removeColumn("users", "created_at"),
                queryInterface.addColumn("companies", "created_at", {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.fn('NOW')
                }, {})
            ]);
        });
    }
};
