'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('notifications', [
            {
                text: "test",
                user_id: 2,
            }
        ], {});
    },
    
    down: (queryInterface, Sequelize) => {
    }
};
