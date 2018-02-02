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
            cv_id: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "cv",
                    key: "id"
                }
            }
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('cv_answers', {});
    }
};
