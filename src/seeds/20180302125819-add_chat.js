'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return  queryInterface.sequelize.query('INSERT INTO chats (id) VALUES (1)');
    },
    
    down: (queryInterface, Sequelize) => {
    }
};
