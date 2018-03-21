'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('user_chats', [
            {
                chat_id:1,
                user_id:1
            },
            {
                chat_id:1,
                user_id:2
            }
        ], {});
    },
    
    down: (queryInterface, Sequelize) => {
    }
};
