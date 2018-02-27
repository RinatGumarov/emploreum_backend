module.exports = (sequelize, DataTypes) => {

    let tests = sequelize.define('tests', {
        name: DataTypes.TEXT,
    }, {
        timestamps: false
    });
    tests.associate = function (models) {
        tests.belongsTo(models.companies, {
            foreignKey: 'company_id'
        });
        tests.hasMany(models.questions, {
            foreignKey: "test_id",
        });
        tests.belongsToMany(models.profile_skills, {
            through: 'test_profile_skills',
            foreignKey: 'test_id',
            timestamps: false,
        });
        tests.hasMany(models.passed_questions, {
            foreignKey: 'test_id'
        });

        tests.hasOne(models.vacancies, {
            foreignKey: "test_id",
        })
    };


    return tests;
};