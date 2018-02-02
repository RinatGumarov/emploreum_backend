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
            profile_id: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "profiles",
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

    down: (queryInterface) => {
        return queryInterface.dropTable('cv', {});
    }
};
