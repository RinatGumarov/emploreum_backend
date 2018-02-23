module.exports = (sequelize, DataTypes) => {
    
    let questions = sequelize.define('questions', {
        name: DataTypes.TEXT,
        difficulty: DataTypes.FLOAT,
        type: {
            type: DataTypes.ENUM,
            values: ["multipleChoice", "input"],
        },
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
    };


    return questions;
};