'use strict';

module.exports = {
    up: (queryInterface) => {
        return queryInterface.dropTable('employee_languages', {});
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.createTable('employee_languages', {
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
    }
};
