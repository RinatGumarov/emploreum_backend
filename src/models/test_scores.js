module.exports = (sequelize, DataTypes) => {

    let test_scores = sequelize.define('test_scores', {
        passed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
    };


    return test_scores;
};