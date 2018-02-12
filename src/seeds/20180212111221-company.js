'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('companies', [{
            name: 'sberkek',
            user_id: 1,
            about: 'sberkek company. we make products for sberbank',
        }], {});
    },

    down: (queryInterface, Sequelize) => {
    }
};
