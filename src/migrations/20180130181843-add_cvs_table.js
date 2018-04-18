'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('cvs', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
            },
            profile_id: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "profiles",
                    key: "id"
                }
            },
            employee_id: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "employees",
                    key: "id"
                },
                cascade: true,
                onDelete: "CASCADE",
            }
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('cvs', {});
    }
};
