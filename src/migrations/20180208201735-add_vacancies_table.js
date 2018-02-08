'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('vacancies', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            info: {
                allowNull: false,
                type: Sequelize.TEXT,
            },
            
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('vacancies', {});
    }
};
