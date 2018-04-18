'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('tests', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            company_id: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                    model: 'companies',
                    key: 'id',
                },
            },
            name: {
                type: Sequelize.STRING,
            },
        });
    },

    down: (queryInterface) => {
        queryInterface.dropTable('tests', {});
    }
};
