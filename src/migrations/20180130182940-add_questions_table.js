'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('questions', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
            },
            question: {
                allowNull: false,
                type: Sequelize.STRING
            },
            difficulty: {
                allowNull: false,
                type: Sequelize.FLOAT
            }
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('questions', {});
    }
};
