'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('tests', [{
            company_id: 1,
            name: "test"
        }], {});
    },
    
    down: (queryInterface, Sequelize) => {
    }
};
