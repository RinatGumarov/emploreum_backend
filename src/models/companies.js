module.exports = (sequelize, DataTypes) => {
    let companies = sequelize.define('companies', {
        name: DataTypes.STRING,
        about: DataTypes.TEXT,
        logo: DataTypes.STRING,
        city: DataTypes.STRING,
        response_text: DataTypes.TEXT,
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
        });
        companies.hasMany(models.chats, {
            foreignKey: 'company_id',
        });
        companies.hasMany(models.vacancies, {
            foreignKey: 'company_id',
        });
    };

    return companies;
};