module.exports = (sequelize, DataTypes) => {
    let companies = sequelize.define('companies', {
        name: DataTypes.STRING,
        about: DataTypes.TEXT,
        logo: DataTypes.STRING,
        city: DataTypes.STRING,
        responseText: {
            type: DataTypes.TEXT,
            field: "response_text"
        },
        contract: DataTypes.STRING,
        userId: {
            type: DataTypes.BIGINT,
            field: "user_id"
        }
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
        companies.hasMany(models.tests, {
            foreignKey: 'company_id',
        });
    };
    
    return companies;
};