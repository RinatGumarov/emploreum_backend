'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('messages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            text: Sequelize.TEXT,
            is_employee_message: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            is_company_message: {
                allowNull: false,
                type: Sequelize.BOOLEAN
            },
            is_view: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            },
            chat_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "chats",
                    key: "id",
                },
                cascade: true,
                onDelete: "CASCADE",
            },
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('messages', {});
    }
};
