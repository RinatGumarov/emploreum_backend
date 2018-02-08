module.exports = (sequelize, DataTypes) => {
    let company_profiles = sequelize.define('company_profiles', {}, {
        timestamps: false
    });

    company_profiles.associate = function (models) {
        company_profiles.belongsTo(models.companies, {
            foreignKey: 'company_id'
        });
        company_profiles.belongsTo(models.profiles, {
            foreignKey: 'profile_id'
        });
    };


    return company_profiles;
};