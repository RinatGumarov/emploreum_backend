'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                
                queryInterface.sequelize.query('TRUNCATE messages CASCADE;'),
                queryInterface.removeColumn('messages', 'is_employee_message', {}),
                queryInterface.removeColumn('messages', 'is_company_message', {}),
                queryInterface.addColumn("messages", "user_id", {
                    primaryKey: true,
                    allowNull: false,
                    type: Sequelize.BIGINT,
                    references: {
                        model: "users",
                        key: "id"
                    }
                })
                
            ]);
        });
    },
    
    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.removeColumn('messages', 'user_id', {}),
                queryInterface.addColumn('messages', 'is_employee_message', {
                    allowNull: false,
                    defaultValue:false,
                    type: Sequelize.BOOLEAN
                }),
                queryInterface.addColumn('messages', 'is_company_message', {
                    allowNull: false,
                    defaultValue:false,
                    type: Sequelize.BOOLEAN
                }),
            ]);
        });
    }
};
