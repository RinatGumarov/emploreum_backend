module.exports = (sequelize, DataTypes) => {
    let work_transactions = sequelize.define('work_transactions', {
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
        timestamps: false
    });
    
    work_transactions.associate = function (models) {
        work_transactions.belongsTo(models.works, {
            foreignKey: 'work_id'
        });
    };
    
    return work_transactions;
};