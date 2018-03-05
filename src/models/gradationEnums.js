module.exports = (sequelize, DataTypes) => {
    let gradationEnums = sequelize.define('gradationEnums', {
        name: DataTypes.STRING
    }, {
        timestamps: false,
        tableName: 'gradation_enums'
    });
    return gradationEnums;
};