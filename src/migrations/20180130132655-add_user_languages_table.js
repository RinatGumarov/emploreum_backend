'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('user_languages', {
            employee_id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.BIGINT,
                references: {
                    model: "employees",
                    key: "id"
                }
            },
            language_id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.BIGINT,
                references: {
                    model: "languages",
                    key: "id"
                }
            }

        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('user_languages', {});
    }
};
