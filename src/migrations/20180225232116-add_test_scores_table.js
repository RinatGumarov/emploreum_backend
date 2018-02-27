'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('test_scores', {
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
            questions_count: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'questions',
                    key: 'id',
                },
                cascade: true,
                onDelete: 'CASCADE',
            },
            correct_answers_count: {
                type: Sequelize.TEXT,
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable('test_scores', {});
    }
};
