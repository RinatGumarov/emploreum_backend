'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('achievements', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            desc: {
                allowNull: false,
                type: Sequelize.STRING,
                comment: 'Описание достижения'
            },
            photo_path: {
                allowNull: false,
                type: Sequelize.STRING
            },
            user_id: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "users",
                    key: "id"
                }
            }
        });
    },


    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('achievements');
    }
};
