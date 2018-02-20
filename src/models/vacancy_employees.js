module.exports = (sequelize, DataTypes) => {
    
    let vacancyEmployees = sequelize.define('vacancy_employees', {}, {
        timestamps: false
    });
    
    
    vacancyEmployees.associate = function (models) {
        vacancyEmployees.belongsTo(models.vacancies, {
            foreignKey: 'vacancy_id'
        });
        vacancyEmployees.belongsTo(models.employees, {
            foreignKey: 'employee_id'
        });
    };
    
    
    return vacancyEmployees;
};