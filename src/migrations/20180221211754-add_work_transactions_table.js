'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('work_transactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            work_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'works',
                    key: 'id',
                },
                cascade: true,
                onDelete: 'CASCADE',
            },
            currency: {
                type: Sequelize.STRING,
                defaultValue: 'ETH'
            },
            amount: {
                type: Sequelize.DOUBLE,
            },
            transaction_hash: Sequelize.STRING,
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable('work_transactions', {});
    }
};
