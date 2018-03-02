'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('cvs', [
            {
                profile_id: 1,
                employee_id: 1
            }], {});
    },
    
    down: (queryInterface, Sequelize) => {
    }
};
