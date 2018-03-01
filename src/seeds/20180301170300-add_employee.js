'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('employees', [{
            name: 'nasorog',
            user_id: 2,
            about: 'php developer =))',
        }], {});
    },
    
    down: (queryInterface, Sequelize) => {
    }
};
