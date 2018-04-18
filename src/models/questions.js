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
            foreignKey: 'testId'
        });
        questions.hasMany(models.answers, {
            foreignKey: 'questionId',
        });
        questions.hasMany(models.passedQuestions, {
            foreignKey: 'questionId',
        })
    };
    
    
    return questions;
};