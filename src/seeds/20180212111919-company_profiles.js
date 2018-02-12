'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('company_profiles', [
            {
                company_id: 1,
                profile_id: 1
            },
            {
                company_id: 1,
                profile_id: 2
            },
            {
                company_id: 1,
                profile_id: 3
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
    }
};
