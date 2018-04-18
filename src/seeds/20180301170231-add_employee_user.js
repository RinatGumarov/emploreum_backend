'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', [{
            email: 'b@b.ru',
            password: '$2a$10$wj2P2SY6zATSsBOPfxQBm.C5qOmpAA18Jt1M55/veJ/TZ39meJTU2',
            status: 0,
            role_id: 1,
        }], {});
    },
    
    down: (queryInterface, Sequelize) => {
    }
};
