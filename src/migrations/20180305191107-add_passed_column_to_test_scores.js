'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.addColumn("test_scores", "passed", {
                    type: Sequelize.BOOLEAN,
                    comment: "сдал или не сдал"
                }, {}),
                queryInterface.removeColumn("test_scores", "questions_count"),
                queryInterface.removeColumn("test_scores", "correct_answers_count"),
            ]);
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.removeColumn("test_scores", "passed"),
                queryInterface.addColumn("test_scores", "questions_count", {
                  type: Sequelize.INTEGER,
                }, {}),
                queryInterface.addColumn("test_scores", "correct_answers_count", {
                    type: Sequelize.INTEGER,
                }, {}),
            ]);
        });
    }
};
