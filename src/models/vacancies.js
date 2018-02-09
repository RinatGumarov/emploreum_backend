module.exports = (sequelize, DataTypes) => {
    let vacancies = sequelize.define('vacancies', {
        name: DataTypes.STRING,
        info: DataTypes.TEXT,
        pricePerWeek: DataTypes.DOUBLE,
        duration: DataTypes.INTEGER,
    }, {
        timestamps: false
    });

    vacancies.associate = function (models) {
        vacancies.belongsTo(models.employees, {
            foreignKey: 'employee_id',
            targetKey: 'id',
        });

        vacancies.belongsTo(models.companies, {
            foreignKey: 'company_id',
            targetKey: 'id'
        });
    };

    return vacancies;
};