'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('works', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
            },
            status: {
                type: Sequelize.INTEGER,
            },
            begin_date: {
                type: Sequelize.DATE,
            },
            end_date: {
                type: Sequelize.DATE,
            },
            company_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "companies",
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
            },
            vacancy_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "vacancies",
                    key: "id",
                },
            },
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('works', {});
    }
};
