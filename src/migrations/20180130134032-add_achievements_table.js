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
            employee_id: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "employees",
                    key: "id"
                }
            }
        });
    },


    down: (queryInterface) => {
        return queryInterface.dropTable('achievements', {});
    }
};
