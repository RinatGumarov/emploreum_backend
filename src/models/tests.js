module.exports = (sequelize, DataTypes) => {

    let tests = sequelize.define('tests', {
        name: DataTypes.TEXT,
    }, {
        timestamps: false
    });
    tests.associate = function (models) {
        tests.belongsTo(models.vacancies, {
            foreignKey: 'vacancy_id'
        });
        tests.hasMany(models.questions, {
            foreignKey: "test_id",
        });
        tests.belongsToMany(models.profile_skills, {
            through: 'test_profile_skills',
            foreignKey: 'test_id',
            timestamps: false,
        });
    };


    return tests;
};