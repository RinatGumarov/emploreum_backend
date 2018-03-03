module.exports = (sequelize, DataTypes) => {
    
    let questions = sequelize.define('questions', {
        name: DataTypes.TEXT,
        difficulty: DataTypes.FLOAT,
        type: {
            type: DataTypes.ENUM,
            values: ["multipleChoice", "input"],
        },
        testId: {
            type: DataTypes.BIGINT,
            field: "test_id"
        }
    }, {
        timestamps: false
    });
    questions.associate = function (models) {
        questions.belongsTo(models.tests, {
            foreignKey: 'test_id'
        });
        questions.hasMany(models.answers, {
            foreignKey: 'question_id',
        });
        questions.hasMany(models.passed_questions, {
            foreignKey: 'question_id',
        })
    };
    
    
    return questions;
};