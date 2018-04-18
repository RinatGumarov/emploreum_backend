'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('profiles', [
            {
                name: 'web'
            },
            {
                name: 'mobile'
            },
            {
                name: 'desktop'
            },
            {
                name: 'bigdata'
            },
        ], {});

    },

    down: (queryInterface, Sequelize) => {
    }
};
