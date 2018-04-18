'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('vacancy_employees', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
            },
            vacancy_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "vacancies",
                    key: "id",
                },
                cascade: true,
                onDelete: "CASCADE",
            },
            employee_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "employees",
                    key: "id",
                },
                cascade: true,
                onDelete: "CASCADE",
            }
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('vacancy_employees', {});
    }
};
