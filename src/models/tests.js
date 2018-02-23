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
    };


    return tests;
};