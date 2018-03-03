module.exports = (sequelize, DataTypes) => {
    let answers = sequelize.define('answers', {
        name: DataTypes.STRING,
        isTrue: {
            type: DataTypes.BOOLEAN,
            filed: "is_true"
        },
        questionId: {
            type: DataTypes.BIGINT,
            field: "question_id"
        }
    }, {
        timestamps: false
    });
    answers.associate = function (models) {
        answers.belongsTo(models.questions, {
            foreignKey: 'question_id'
        });
    };
    
    return answers;
};