module.exports = (sequelize, DataTypes) => {
    let employees = sequelize.define('employees', {
        phone: DataTypes.STRING,
        sex: DataTypes.BOOLEAN,
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        photoPath: {
            type: DataTypes.STRING,
            field: "photo_path"
        },
        userId: {
            type: DataTypes.BIGINT,
            field: "user_id"
        },
        city: DataTypes.STRING,
        birthday: DataTypes.DATE,
        about: DataTypes.TEXT,
        contract: DataTypes.STRING,
    }, {
        timestamps: false
    });
    
    employees.associate = function (models) {
        employees.belongsTo(models.gradationEnums, {
            foreignKey: 'gradation'
        });
        employees.hasMany(models.achievements, {
            foreignKey: 'employeeId'
        });
        employees.hasMany(models.cvs, {
            foreignKey: 'employeeId'
        });
        employees.hasMany(models.notValidJobs, {
            foreignKey: 'employeeId'
        });
        employees.belongsTo(models.users, {
            foreignKey: 'userId',
        });
        employees.belongsToMany(models.vacancies, {
            through: 'vacancyEmployees',
            foreignKey: 'employeeId',
            timestamps: false,
        });
        employees.hasMany(models.works, {
            foreignKey: 'employeeId',
        });
        
        employees.hasMany(models.passedQuestions, {
            foreignKey: 'employeeId',
        })
        
    };
    
    return employees;
};