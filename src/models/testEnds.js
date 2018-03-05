module.exports = (sequelize, DataTypes) => {
    
    let testsStarts = sequelize.define('testsStarts', {
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
    testsStarts.associate = function (models) {
        testsStarts.belongsTo(models.employees, {
            foreignKey: 'employeeId'
        });
        testsStarts.belongsTo(models.tests, {
            foreignKey: "testId",
        });
    };
    
    
    return testsStarts;
};