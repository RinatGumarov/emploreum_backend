'use strict';

module.exports = {
    
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('session', {
            sid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            sess: Sequelize.JSON,
            expire: Sequelize.DATE,
        });
    },
    
    down: (queryInterface) => {
        return queryInterface.dropTable('session', {});
    }
};
