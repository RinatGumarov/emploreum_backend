module.exports = (sequelize, DataTypes) => {
    let employees = sequelize.define('employees', {
        phone: DataTypes.STRING,
        sex: DataTypes.BOOLEAN,
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        photo_path: DataTypes.STRING,
        city: DataTypes.STRING,
        birthday: DataTypes.DATE,
    }, {
        timestamps: false
    });

    employees.associate = function (models) {
        employees.belongsTo(models.gradation_enums, {
            foreignKey: 'gradation'
        });
        employees.belongsToMany(models.languages, {
            through: 'user_languages',
            foreignKey: 'user_id'
        });
        employees.hasMany(models.achievements, {
            foreignKey: 'user_id'
        });
        employees.hasMany(models.cv, {
            foreignKey: 'user_id'
        });
        employees.hasMany(models.not_valid_jobs, {
            foreignKey: 'user_id'
        });
        employees.hasOne(models.users, {
            foreignKey: 'id'
        });
    };

    return employees;
};