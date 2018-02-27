'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('test_profile_skills', {
            test_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "tests",
                    key: "id",
                },
                cascade: true,
                onDelete: "CASCADE",
            },
            profile_skill_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "profile_skills",
                    key: "id",
                },
                cascade: true,
                onDelete: "CASCADE",
            }
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('test_profile_skills', {});
    }
};
