module.exports = (sequelize, DataTypes) => {
    
    let questions = sequelize.define('questions', {
        question: DataTypes.TEXT,
        difficulty: DataTypes.FLOAT
    }, {
        timestamps: false
    });

    return questions;
};