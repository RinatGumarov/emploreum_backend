module.exports = (sequelize, DataTypes) => {
    let answers = sequelize.define('answers', {
        answer: DataTypes.STRING,
        is_true: DataTypes.BOOLEAN
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