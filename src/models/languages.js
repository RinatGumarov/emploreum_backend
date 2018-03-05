module.exports = (sequelize, DataTypes) => {
    let languages = sequelize.define('languages', {
        name: DataTypes.STRING
    }, {
        timestamps: false
    });
    return languages;
};