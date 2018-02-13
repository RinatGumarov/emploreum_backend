'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert('skills', [
            {
                name: 'postgres',
                photo_path: "/upload/postgres.png"
            },
            {
                name: 'java',
                photo_path: "/upload/java.png"
            },
            {
                name: 'javascript',
                photo_path: "/upload/js.png"
            },
            {
                name: 'ios',
                photo_path: "/upload/apple.png"
            },
            {
                name: 'android',
                photo_path: "/upload/android.png"
            },
            {
                name: 'hadoop',
                photo_path: "/upload/hadoop.png"
            },

        ], {});
    },

    down: (queryInterface, Sequelize) => {
    }
};
