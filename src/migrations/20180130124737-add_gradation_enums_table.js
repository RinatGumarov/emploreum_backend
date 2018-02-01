'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('gradation_enums', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            name: {
                unique: true,
                allowNull: false,
                type: Sequelize.STRING,
                comment: 'Наименование уровня образования'
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('gradation_enums');
    }
};
