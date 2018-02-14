'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('vacancies', [
            {
                name: 'java jun dev',
                info: 'hibernate sham spring sham',
                week_payment: 0.3,
                duration: 12,
                company_id: 1,
            },
            {
                name: 'android dev',
                info: 'android sdk should you know',
                week_payment: 0.7,
                duration: 12,
                company_id: 1,
            },
            {
                name: 'ios sham',
                info: 'apple master chieng',
                week_payment: 0.8,
                duration: 12,
                company_id: 1,
            },
            {
                name: 'bigdata sham',
                info: 'davay razdavay!',
                week_payment: 1,
                duration: 12,
                company_id: 1,
            },

        ], {});
    },

    down: (queryInterface, Sequelize) => {
    }
};
