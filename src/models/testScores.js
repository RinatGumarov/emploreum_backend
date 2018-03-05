module.exports = (sequelize, DataTypes) => {
    
    let testScores = sequelize.define('testScores', {
        passed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
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
        tableName: "test_scores"
    });
    testScores.associate = function (models) {
        testScores.belongsTo(models.employees, {
            foreignKey: 'employeeId'
        });
        testScores.belongsTo(models.tests, {
            foreignKey: "testId",
        });
    };
    
    
    return testScores;
};