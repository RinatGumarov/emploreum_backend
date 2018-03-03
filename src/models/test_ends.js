module.exports = (sequelize, DataTypes) => {
    
    let test_starts = sequelize.define('tests_starts', {
        ends: DataTypes.DATE,
        employeeId: {
            type: DataTypes.BIGINT,
            field: "employee_id"
        },
        testId: {
            type: DataTypes.BIGINT,
            field: "test_id"
        }
    }, {
        timestamps: false,
    });
    test_starts.associate = function (models) {
        test_starts.belongsTo(models.employees, {
            foreignKey: 'employee_id'
        });
        test_starts.belongsTo(models.tests, {
            foreignKey: "test_id",
        });
    };
    
    
    return test_starts;
};