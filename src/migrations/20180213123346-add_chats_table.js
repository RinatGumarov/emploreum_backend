'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('chats', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            employee_id: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "employees",
                    key: "id"
                }
            },
            company_id: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "companies",
                    key: "id"
                }
            },
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('chats', {});
    }
};
