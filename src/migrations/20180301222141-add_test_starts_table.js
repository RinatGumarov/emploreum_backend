'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('test_starts', {
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
            started_at: {
                type: Sequelize.DATE,
                defaultValue: new Date(),
            }
        });
    },

    down: (queryInterface) => {
        queryInterface.dropTable('test_starts', {});
    }
};
