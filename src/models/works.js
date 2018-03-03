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
        vacancyId: {
            type: DataTypes.BIGINT,
            field: "vacancy_id"
        },
        companyId: {
            type: DataTypes.BIGINT,
            field: "company_id"
        },
        vacancyId: {
            type: DataTypes.BIGINT,
            field: "vacancy_id"
        }
    }, {
        timestamps: false
    });
    
    works.associate = function (models) {
        works.belongsTo(models.companies, {
            foreignKey: 'company_id'
        });
        
        works.belongsTo(models.employees, {
            foreignKey: 'employee_id',
        });
        
        works.belongsTo(models.vacancies, {
            foreignKey: 'vacancy_id',
        });
    };
    
    return works;
};