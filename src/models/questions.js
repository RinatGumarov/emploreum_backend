module.exports = (sequelize, DataTypes) => {
    
    let questions = sequelize.define('questions', {
        name: DataTypes.TEXT,
        difficulty: DataTypes.FLOAT,
        type: DataTypes.ENUM,
    }, {
        timestamps: false
    });
    questions.associate = function (models) {
        questions.belongsTo(models.tests, {
            foreignKey: 'test_id'
        });
    };


    return questions;
};