'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('vacancy_employees', [{
            employee_id: 1,
            vacancy_id: 1
        }], {});
    },
    
    down: (queryInterface, Sequelize) => {
    }
};
