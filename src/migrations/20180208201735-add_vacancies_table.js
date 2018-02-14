'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('vacancies', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
            },
            name: {
                type: Sequelize.STRING
            },
            info: {
                type: Sequelize.TEXT,
            },
            pricePerWeek: {
                type: Sequelize.DOUBLE,
            },
            duration: {
                type: Sequelize.INTEGER,
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
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('vacancies', {});
    }
};
