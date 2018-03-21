'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.removeColumn('messages', 'is_view', {}),
                queryInterface.addColumn("messages", "status", {
                    type: Sequelize.STRING,
                    defaultValue: "sent",
                })
            ]);
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.removeColumn('messages', 'status', {}),
                queryInterface.addColumn('messages', 'is_view', {
                    defaultValue: false,
                    type: Sequelize.BOOLEAN
                }),
            ]);
        });
    }
};
