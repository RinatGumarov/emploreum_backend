module.exports = (sequelize, DataTypes) => {
    
    let tests = sequelize.define('tests', {
        name: DataTypes.TEXT,
        companyId: {
            type: DataTypes.BIGINT,
            field: "company_id"
        },
        duration: DataTypes.INTEGER
    }, {
        timestamps: false
    });
    tests.associate = function (models) {
        tests.belongsTo(models.companies, {
            foreignKey: 'companyId'
        });
        tests.hasMany(models.questions, {
            foreignKey: "testId",
        });
        tests.belongsToMany(models.profileSkills, {
            through: 'test_profile_skills',
            foreignKey: 'test_id',
            timestamps: false,
        });
        tests.hasMany(models.passedQuestions, {
            foreignKey: 'testId'
        });
        
        tests.hasOne(models.vacancies, {
            foreignKey: "testId",
        })
    };
    
    
    return tests;
};