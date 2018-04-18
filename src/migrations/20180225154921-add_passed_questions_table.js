'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('passed_questions', {
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
            question_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'questions',
                    key: 'id',
                },
                cascade: true,
                onDelete: 'CASCADE',
            },
            answer: {
                type: Sequelize.TEXT,
            },
            correct: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable('passed_questions', {});
    }
};
