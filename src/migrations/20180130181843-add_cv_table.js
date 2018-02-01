'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('cv', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
            },
            proffile_id: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "proffiles",
                    key: "id"
                }
            },
            user_id: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "users",
                    key: "id"
                }
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('cv');
    }
};
