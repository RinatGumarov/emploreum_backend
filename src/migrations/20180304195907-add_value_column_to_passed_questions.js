'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.addColumn("passed_questions", "value", {
                    type: Sequelize.DOUBLE,
                    comment: "вклад ответа в тест"
                }, {}),
            ]);
        });
    },

    down: (queryInterface) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.removeColumn("passed_questions", "value"),
            ]);
        });
    }
};
