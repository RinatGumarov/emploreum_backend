'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('not_valid_job_skills', {
            not_valid_job_id: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "not_valid_jobs",
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
        return queryInterface.dropTable('not_valid_job_skills', {});
    }
};
