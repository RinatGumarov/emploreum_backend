'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(() => {
            return queryInterface.addColumn("vacancy_profile_skills", "id", {
                allowNull: false,
                primaryKey: true,
                unique: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
            }, {});
        });
    },
    
    down(queryInterface, Sequelize) {
        return queryInterface.removeColumn('vacancy_profile_skills', 'id');
    }
};