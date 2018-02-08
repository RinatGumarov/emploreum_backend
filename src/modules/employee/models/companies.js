module.exports = (sequelize, DataTypes) => {
    let companies = sequelize.define('companies', {
        name: DataTypes.STRING,
        about: DataTypes.TEXT,
        logo: DataTypes.STRING,
        city: DataTypes.STRING,
    }, {
        timestamps: false
    });

    companies.associate = function (models) {
        companies.belongsToMany(models.profiles, {
            through: 'company_profiles',
            foreignKey: 'company_id'
        });

        companies.belongsTo(models.users, {
            foreignKey: 'user_id',
            targetKey: 'id',
        });
    };

    return companies;
};