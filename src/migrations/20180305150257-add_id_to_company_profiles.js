'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(() => {
            return queryInterface.addColumn("company_profiles", "id", {
                allowNull: false,
                primaryKey: true,
                unique: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
            }, {});
        });
    },
    
    down(queryInterface, Sequelize) {
        return queryInterface.removeColumn('company_profiles', 'id');
    }
};