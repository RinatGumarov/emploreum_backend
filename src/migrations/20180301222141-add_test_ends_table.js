'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('test_ends', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            employee_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'employees',
                    key: 'id',
                },
                cascade: true,
                onDelete: 'CASCADE',
            },
            test_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'tests',
                    key: 'id',
                },
                cascade: true,
                onDelete: 'CASCADE',
            },
            ends: {
                type: Sequelize.DATE,
                allowNull: true,
            }
        });
    },

    down: (queryInterface) => {
        queryInterface.dropTable('test_ends', {});
    }
};
