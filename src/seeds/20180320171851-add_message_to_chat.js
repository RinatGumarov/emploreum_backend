'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('messages', [
            {
                text: "test",
                user_id: "1",
                chat_id: 1
            },
            {
                text: "test",
                user_id: "2",
                chat_id: 1
            }
        ], {});
    },
    
    down: (queryInterface, Sequelize) => {
    }
};
