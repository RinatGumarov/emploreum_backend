module.exports = (sequelize, DataTypes) => {
    
    let test_starts = sequelize.define('testEnds', {
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
        tableName: "test_ends"
    });
    test_starts.associate = function (models) {
        test_starts.belongsTo(models.employees, {
            foreignKey: 'employeeId'
        });
        test_starts.belongsTo(models.tests, {
            foreignKey: "testId",
        });
    };
    
    
    return test_starts;
};