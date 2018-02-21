module.exports = (sequelize, DataTypes) => {
    let work_transactions = sequelize.define('work_transactions', {
        status: DataTypes.INTEGER,
        currency: DataTypes.STRING,
        created_at: DataTypes.DATE,
        amount: DataTypes.DOUBLE,
        transaction_hash: DataTypes.STRING,
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