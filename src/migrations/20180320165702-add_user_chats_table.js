'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('user_chats', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
            },
            chat_id: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "chats",
                    key: "id"
                }
            },
            user_id: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "users",
                    key: "id"
                }
            }
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('user_chats', {});
    }
};
