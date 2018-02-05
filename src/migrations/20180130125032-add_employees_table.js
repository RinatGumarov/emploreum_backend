'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('employees', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
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
                comment: 'путь до аватарки'
            },
            city: {
                type: Sequelize.STRING,
                comment: 'место жительства или нахождения'
            },
            birthday: {
                type: Sequelize.DATE,
                comment: 'день рождения'
            },
            gradation: {
                type: Sequelize.BIGINT,
                references: {
                    model: "gradation_enums",
                    key: "id"
                },
                comment: 'уровень образования'
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: true,
                references: {
                    model: "users",
                    key: "id"
                },
                comment: 'там емейл и пароль'
            }
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('employees', {});
    }
};
