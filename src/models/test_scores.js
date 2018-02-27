module.exports = (sequelize, DataTypes) => {

    let test_scores = sequelize.define('test_scores', {
        questions_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        correct_answers_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        timestamps: false
    });
    test_scores.associate = function (models) {
        test_scores.belongsTo(models.employees, {
            foreignKey: 'employee_id'
        });
        test_scores.belongsTo(models.tests, {
            foreignKey: "test_id",
        });
        test_scores.belongsToMany(models.profile_skills, {
            through: 'test_profile_skills',
            foreignKey: 'test_id',
            timestamps: false,
        });
    };


    return test_scores;
};