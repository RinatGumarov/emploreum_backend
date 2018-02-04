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
            phone: {
                type: Sequelize.INTEGER,
                comment: 'Телефон'
            },
            sex: {
                type: Sequelize.BOOLEAN,
                comment: 'пол'
            },
            name: {
                type: Sequelize.STRING,
                comment: 'имя'
            },
            surname: {
                type: Sequelize.STRING,
                comment: 'Фамилия'
            },
            photo_path: {
                type: Sequelize.STRING,
                comment: 'путь кортинки для аватар'
            },
            city: {
                type: Sequelize.STRING,
                comment: 'место жительства или нахождения'
            },
            birthday: {
                type: Sequelize.DATE,
                comment: 'день рождения'
            },
            status: {
                allowNull: false,
                defaultValue: 1,
                type: Sequelize.INTEGER,
                comment: 'статус регистрации'
            },
            gradation: {
                type: Sequelize.BIGINT,
                references: {
                    model: "gradation_enums",
                    key: "id"
                },
                comment: 'уровень образования'
            }

        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable('users', {});
    }
};
