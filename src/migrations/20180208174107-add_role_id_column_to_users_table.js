'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.addColumn("users", "role_id", {
            primaryKey: true,
            allowNull: false,
            defaultValue: await queryInterface.rawSelect('roles', {where: {role: 'EMPLOYEE'}}, ['id']),
            type: Sequelize.BIGINT,
            references: {
                model: "roles",
                key: "id"
            }
        }, {})
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("users", "role_id", {})
    }
};
