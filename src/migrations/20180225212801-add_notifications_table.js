'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('notifications', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                cascade: true,
                onDelete: 'CASCADE',
            },
            is_view: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            text: Sequelize.STRING
        });
    },
    
    down: (queryInterface, Sequelize) => {
        queryInterface.dropTable('notifications', {});
    }
};
