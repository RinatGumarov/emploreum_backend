'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('cv_answers', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
            },
            answer_id: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "answers",
                    key: "id"
                }
            },
            answer_date: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('cv_answers', {});
    }
};
