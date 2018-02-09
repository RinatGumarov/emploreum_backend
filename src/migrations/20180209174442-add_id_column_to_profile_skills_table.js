'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.addColumn("profile_skills", "id", {
                    allowNull: false,
                    primaryKey: true,
                    unique: true,
                    autoIncrement: true,
                    type: Sequelize.BIGINT
                }, {}),
                queryInterface.removeColumn('profile_skills', 'profile_id', {}, {}),
                queryInterface.removeColumn('profile_skills', 'skill_id', {}, {}),
                queryInterface.addColumn("profile_skills", "profile_id", {
                    allowNull: false,
                    type: Sequelize.BIGINT,
                    references: {
                        model: "profiles",
                        key: "id"
                    }
                }, {}),
                queryInterface.addColumn("profile_skills", "skill_id", {
                    allowNull: false,
                    type: Sequelize.BIGINT,
                    references: {
                        model: "skills",
                        key: "id"
                    }
                }, {}),
            ]);
        });
    },

    down(queryInterface, Sequelize) {
        //no need for down method
    }
};