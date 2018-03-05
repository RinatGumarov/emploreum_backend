module.exports = (sequelize, DataTypes) => {
    let passedQuestions = sequelize.define('passedQuestions', {
        answer: DataTypes.TEXT,
        correct: DataTypes.BOOLEAN,
        createdAt: {
            type: DataTypes.DATE,
            field: "created_at"
        },
        testId: {
            type: DataTypes.BIGINT,
            field: "test_id"
        },
        questionId: {
            type: DataTypes.BIGINT,
            field: "question_id"
        },
        employeeId: {
            type: DataTypes.BIGINT,
            field: "employee_id"
        }
    }, {
        timestamps: false,
        tableName: "passed_questions"
    });
    
    passedQuestions.associate = function (models) {
        passedQuestions.belongsTo(models.tests, {
            foreignKey: 'testId',
        });
        
        passedQuestions.belongsTo(models.questions, {
            foreignKey: 'questionId',
        });
        
        passedQuestions.belongsTo(models.employees, {
            foreignKey: 'employeeId',
        });
    };
    
    
    return passedQuestions;
};