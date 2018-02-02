'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('answers', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
            },
            question_id: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "questions",
                    key: "id"
                }
            },
            answer: {
                allowNull: false,
                type: Sequelize.STRING
            },
            is_true: {
                allowNull: false,
                type: Sequelize.BOOLEAN
            }
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('answers', {});
    }
};
