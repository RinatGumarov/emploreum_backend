'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('companies', {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
            },
            about: {
                type: Sequelize.TEXT,
                comment: 'о компании'
            },
            name: {
                type: Sequelize.STRING,
                comment: 'Название компании'
            },
            logo: {
                type: Sequelize.STRING,
                comment: 'путь до логотипа компании'
            },
            city: {
                type: Sequelize.STRING,
                comment: 'место нахождения'
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                unique: true,
                references: {
                    model: "users",
                    key: "id"
                },
                cascade: true,
                onDelete: "CASCADE",
                comment: 'там емейл и пароль'
            }
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('companies');
    }
};
