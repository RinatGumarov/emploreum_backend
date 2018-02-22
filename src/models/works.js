module.exports = (sequelize, DataTypes) => {
    let works = sequelize.define('works', {
        status: DataTypes.INTEGER,
        currency: DataTypes.STRING,
        created_at: DataTypes.DATE,
        amount: DataTypes.DOUBLE,
        transaction_hash: DataTypes.STRING,
        pay_date: DataTypes.DATE,
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