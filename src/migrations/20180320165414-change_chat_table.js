'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.removeColumn('chats', 'employee_id', {}),
                queryInterface.removeColumn('chats', 'company_id', {}),
            ]);
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.sequelize.query('TRUNCATE chats CASCADE;'),
                queryInterface.addColumn('chats', 'employee_id', {
                    allowNull: false,
                    type: Sequelize.BIGINT,
                    references: {
                        model: "employees",
                        key: "id"
                    }
                }),
                queryInterface.addColumn('chats', 'company_id', {
                    allowNull: false,
                    type: Sequelize.BIGINT,
                    references: {
                        model: "companies",
                        key: "id"
                    }
                }),
            ]);
        });
    }
};
