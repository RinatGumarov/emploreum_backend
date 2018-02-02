module.exports = (sequelize, DataTypes) => {
    let languages = sequelize.define('languages', {
        language: DataTypes.STRING
    }, {
        timestamps: false
    });
    return languages;
};