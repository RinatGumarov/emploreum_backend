module.exports = (sequelize, DataTypes) => {
    
    let vacancyEmployees = sequelize.define('vacancyEmployees', {
        vacancyId: {
            type: DataTypes.BIGINT,
            field: "vacancy_id"
        },
        employeeId: {
            type: DataTypes.BIGINT,
            field: "employee_id"
        }
    }, {
        timestamps: false,
        tableName: 'vacancy_employees'
    });
    
    
    vacancyEmployees.associate = function (models) {
        vacancyEmployees.belongsTo(models.vacancies, {
            foreignKey: 'vacancyId'
        });
        vacancyEmployees.belongsTo(models.employees, {
            foreignKey: 'employeeId'
        });
    };
    
    
    return vacancyEmployees;
};