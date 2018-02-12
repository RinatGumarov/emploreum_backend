'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', [{
            email: 'a@a.ru',
            password: '$2a$10$wj2P2SY6zATSsBOPfxQBm.C5qOmpAA18Jt1M55/veJ/TZ39meJTU2',
            status: 3,
            role_id: 2,
        }], {});
    },

    down: (queryInterface, Sequelize) => {
    }
};
