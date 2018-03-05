module.exports = (sequelize, DataTypes) => {
    let vacancies = sequelize.define('vacancies', {
        name: DataTypes.STRING,
        info: DataTypes.TEXT,
        weekPayment: {
            type: DataTypes.DOUBLE,
            field: "week_payment"
        },
        duration: DataTypes.INTEGER,
        opened: DataTypes.BOOLEAN,
        companyId: {
            type: DataTypes.BIGINT,
            field: "company_id"
        },
        testId: {
            type: DataTypes.BIGINT,
            field: "test_id"
        }
    }, {
        timestamps: false
    });
    
    vacancies.associate = function (models) {
        vacancies.belongsTo(models.companies, {
            foreignKey: 'companyId'
        });
        
        vacancies.belongsToMany(models.employees, {
            through: 'vacancyEmployees',
            foreignKey: 'vacancyId',
            timestamps: false,
        });
        
        vacancies.belongsToMany(models.profileSkills, {
            through: 'vacancyProfileSkills',
            foreignKey: 'vacancyId',
            timestamps: false,
        });
        
        vacancies.belongsTo(models.tests, {
            foreignKey: 'testId',
        })
    };
    
    return vacancies;
};