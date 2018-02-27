module.exports = (sequelize, DataTypes) => {
    let passed_questions = sequelize.define('passed_questions', {
        answer: DataTypes.TEXT,
        correct: DataTypes.BOOLEAN,
        created_at: DataTypes.DATE,
    }, {
        timestamps: false
    });

    passed_questions.associate = function (models) {
        passed_questions.belongsTo(models.tests, {
            foreignKey: 'test_id',
        });

        passed_questions.belongsTo(models.questions, {
            foreignKey: 'question_id',
        });

        passed_questions.belongsTo(models.employees, {
            foreignKey: 'employee_id',
        });
    };


    return passed_questions;
};