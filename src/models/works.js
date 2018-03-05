module.exports = (sequelize, DataTypes) => {
    let works = sequelize.define('works', {
        status: DataTypes.INTEGER,
        beginDate: {
            type: DataTypes.DATE,
            field: "begin_date"
        },
        endDate: {
            type: DataTypes.DATE,
            field: "end_date"
        },
        contract: DataTypes.STRING,
        payDate: {
            type: DataTypes.DATE,
            field: "pay_date"
        },
        companyId: {
            type: DataTypes.BIGINT,
            field: "company_id"
        },
        vacancyId: {
            type: DataTypes.BIGINT,
            field: "vacancy_id"
        },
        employeeId: {
            type: DataTypes.BIGINT,
            field: "employee_id"
        }
    }, {
        timestamps: false
    });
    
    works.associate = function (models) {
        works.belongsTo(models.companies, {
            foreignKey: 'companyId'
        });
        
        works.belongsTo(models.employees, {
            foreignKey: 'employeeId',
        });
        
        works.belongsTo(models.vacancies, {
            foreignKey: 'vacancyId',
        });
    };
    
    return works;
};