module.exports = (sequelize, DataTypes) => {
    let gradation_enums = sequelize.define('gradation_enums', {
        name: DataTypes.STRING
    }, {
        timestamps: false
    });
    return gradation_enums;
};