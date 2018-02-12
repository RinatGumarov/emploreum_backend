'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('skills', [
            {
                name: 'postgres',
                photo_path: "random"
            },
            {
                name: 'java',
                photo_path: "random"
            },
            {
                name: 'javascript',
                photo_path: "random"
            },
            {
                name: 'ios',
                photo_path: "random"
            },
            {
                name: 'android',
                photo_path: "random"
            },
            {
                name: 'hadoop',
                photo_path: "random"
            },

        ], {});
    },

    down: (queryInterface, Sequelize) => {
    }
};
