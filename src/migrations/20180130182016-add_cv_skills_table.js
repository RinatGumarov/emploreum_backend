'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('cv_skills', {
            cv_id: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "cv",
                    key: "id"
                }
            },
            skill_id: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "skills",
                    key: "id"
                }
            }
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('cv_skills', {});
    }
};
