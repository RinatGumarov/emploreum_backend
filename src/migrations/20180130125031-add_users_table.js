'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
            },
            email: {
                unique: true,
                allowNull: false,
                type: Sequelize.STRING,
                comment: 'Почта - логин пользователя'
            },
            password: {
              type: Sequelize.STRING,
              allowNull: false,
              comment: 'Пароль'
            },
            status: {
                allowNull: false,
                defaultValue: 1,
                type: Sequelize.INTEGER,
                comment: 'статус регистрации'
            },
            role: {
                allowNull: false,
                type: Sequelize.STRING,
                comment: 'employee или company'
            }
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('users', {});
    }
};
