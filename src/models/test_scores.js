module.exports = (sequelize, DataTypes) => {
    
    let test_scores = sequelize.define('test_scores', {
        questionsCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: "questions_count"
        },
        correctAnswersCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: "correct_answers_count"
        },
        employeeId: {
            type: DataTypes.BIGINT,
            field: "employee_id"
        },
        testId: {
            type: DataTypes.BIGINT,
            field: "test_id"
        }
    }, {
        timestamps: false
    });
    test_scores.associate = function (models) {
        test_scores.belongsTo(models.employees, {
            foreignKey: 'employee_id'
        });
        test_scores.belongsTo(models.tests, {
            foreignKey: "test_id",
        });
    };
    
    
    return test_scores;
};