module.exports = (sequelize, DataTypes) => {
    let vacancies = sequelize.define('vacancies', {
        name: DataTypes.STRING,
        info: DataTypes.TEXT,
        pricePerWeek: DataTypes.DOUBLE,
        duration: DataTypes.INTEGER,
    }, {
        timestamps: false
    });

    vacancies.associate = function (models) {
        vacancies.belongsTo(models.companies, {
            foreignKey: 'company_id',
            targetKey: 'id'
        });

        vacancies.belongsToMany(models.employees, {
            through: 'vacancy_employees',
            foreignKey: 'employee_id',
        });

        vacancies.belongsToMany(models.profile_skills, {
            through: 'vacancy_profile_skills',
            foreignKey: 'profileSkillId',
            targetKey: 'id'
        });
    };

    return vacancies;
};