'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('messages', [
            {
                text: "test",
                is_employee_message: true,
                is_company_message: false,
                chat_id: 1
            },
            {
                text: "test",
                is_employee_message: true,
                is_company_message: false,
                chat_id: 1
            }
        ], {});
    },
    
    down: (queryInterface, Sequelize) => {
    }
};
