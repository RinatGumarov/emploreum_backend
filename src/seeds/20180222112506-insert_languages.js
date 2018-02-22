'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('languages', [
            {
                language: "russian",
            },
            {
                language: "english",
            },
            {
                language: "french",
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
    }
};
