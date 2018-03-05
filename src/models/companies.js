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
            through: 'companyProfiles',
            foreignKey: 'companyId'
        });
        companies.belongsTo(models.users, {
            foreignKey: 'userId',
        });
        companies.hasMany(models.chats, {
            foreignKey: 'companyId',
        });
        companies.hasMany(models.vacancies, {
            foreignKey: 'companyId',
        });
        companies.hasMany(models.tests, {
            foreignKey: 'companyId',
        });
    };
    
    return companies;
};