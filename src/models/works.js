module.exports = (sequelize, DataTypes) => {
    let works = sequelize.define('work_transactions', {
        status: DataTypes.INTEGER,
        currency: DataTypes.STRING,
        created_at: DataTypes.DATE,
        amount: DataTypes.DOUBLE,
        transaction_hash: DataTypes.STRING,
        interval_id: DataTypes.INTEGER,
    }, {
        timestamps: false
    });

    works.associate = function (models) {
        works.belongsTo(models.companies, {
            foreignKey: 'company_id'
        });

        works.belongsTo(models.employees, {
            foreignKey: 'employee_id',
        });

        works.belongsTo(models.vacancies, {
            foreignKey: 'vacancy_id',
        });
    };

    return works;
};