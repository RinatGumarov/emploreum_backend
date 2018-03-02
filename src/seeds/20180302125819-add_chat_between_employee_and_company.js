'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('chats', [
            {
                employee_id: 1,
                company_id: 1
            }
        ], {});
    },
    
    down: (queryInterface, Sequelize) => {
    }
};
