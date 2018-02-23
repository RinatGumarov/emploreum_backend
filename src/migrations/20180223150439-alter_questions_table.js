'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.changeColumn("questions", "difficulty", {
                    allowNull: true,
                    type: Sequelize.FLOAT
                }),
                queryInterface.addColumn("questions", "test_id", {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    references: {
                        model: "tests",
                        key: "id",
                    },
                    cascade: true,
                    onDelete: "CASCADE",
                }),
                queryInterface.addColumn("questions", "type", {
                    type: Sequelize.ENUM,
                    values: ["multipleChoice", "input"],
                }),
                queryInterface.renameColumn("questions", "question", "name")
            ]);
        });
    },

    down: (queryInterface, Sequelize) => {
        // нельзя откатиться, так как идет нарушение нул констрейнта
        return queryInterface.sequelize.transaction(() => {
            return Promise.all([
                queryInterface.removeColumn("questions", "test_id"),
                queryInterface.removeColumn("questions", "type"),
                queryInterface.renameColumn("questions", "name", "question"),
                queryInterface.sequelize.query('DROP TYPE "enum_questions_type";')
            ]);
        });
    }
};
