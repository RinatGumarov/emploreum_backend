'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('roles', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            role: {
                unique: true,
                allowNull: false,
                type: Sequelize.STRING
            }
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('roles', {});
    }
};
