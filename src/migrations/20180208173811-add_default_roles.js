'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('roles', [
            {
                role: 'EMPLOYEE'
            },
            {
                role: 'COMPANY'
            }
        ], {});
    },

    // нет откаточной миграции
    down: (queryInterface, Sequelize) => {

    }
};
