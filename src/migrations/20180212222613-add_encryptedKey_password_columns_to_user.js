'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                                   queryInterface.addColumn("users", "encrypted_key", {
                                       type: Sequelize.TEXT,
                                       unique: true
                                   }, {}),
                                   queryInterface.addColumn("users", "key_password", {
                                       type: Sequelize.STRING,
                                   }, {}),
                                   queryInterface.addColumn("users", "account_address", {
                                       type: Sequelize.STRING,
                                   }, {}),
                               ]);
        });
    },

    down: (queryInterface, Sequelize) => {
    }
};
