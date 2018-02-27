'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('languages', [
            {
                name: "russian",
            },
            {
                name: "english",
            },
            {
                name: "french",
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
    }
};
