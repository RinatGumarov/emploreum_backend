module.exports = (sequelize, DataTypes) => {
    let workTransactions = sequelize.define('workTransactions', {
        currency: DataTypes.STRING,
        createdAt: {
            type: DataTypes.DATE,
            field: "created_at"
        },
        amount: DataTypes.DOUBLE,
        transactionHash: {
            type: DataTypes.STRING,
            field: "transaction_hash"
        },
        workId: {
            type: DataTypes.BIGINT,
            field: "work_id"
        }
    }, {
        timestamps: false,
        tableName : "work_transactions"
    });
    
    workTransactions.associate = function (models) {
        workTransactions.belongsTo(models.works, {
            foreignKey: 'workId'
        });
    };
    
    return workTransactions;
};