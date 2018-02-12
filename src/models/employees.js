module.exports = (sequelize, DataTypes) => {
    let employees = sequelize.define('employees', {
        phone: DataTypes.STRING,
        sex: DataTypes.BOOLEAN,
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        photo_path: DataTypes.STRING,
        city: DataTypes.STRING,
        birthday: DataTypes.DATE,
        about: DataTypes.TEXT,
    }, {
        timestamps: false
    });

    employees.associate = function (models) {
        employees.belongsTo(models.gradation_enums, {
            foreignKey: 'gradation'
        });
        employees.belongsToMany(models.languages, {
            through: 'employee_languages',
            timestamps: false,
            foreignKey: 'employee_id'
        });
        employees.hasMany(models.achievements, {
            foreignKey: 'employee_id'
        });
        employees.hasMany(models.cvs, {
            foreignKey: 'employee_id'
        });
        employees.hasMany(models.not_valid_jobs, {
            foreignKey: 'employee_id'
        });
        employees.belongsTo(models.users, {
            foreignKey: 'user_id',
        });
        employees.belongsToMany(models.vacancies, {
            through: 'vacancy_employees',
            foreignKey: 'employee_id',
        });
    };

    return employees;
};