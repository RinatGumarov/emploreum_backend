module.exports = (sequelize, DataTypes) => {
    let works = sequelize.define('works', {
        status: DataTypes.INTEGER,
        begin_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        contract: DataTypes.STRING,
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