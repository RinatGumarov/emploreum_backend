module.exports = (sequelize, DataTypes) => {
    let companyProfiles = sequelize.define('companyProfiles', {
        companyId: {
            type: DataTypes.BIGINT,
            field: "company_id"
        },
        profileId: {
            type: DataTypes.BIGINT,
            field: "profile_id"
        }
    }, {
        timestamps: false,
        tableName: 'company_profiles',
    });
    
    companyProfiles.associate = function (models) {
        companyProfiles.belongsTo(models.companies, {
            foreignKey: 'companyId'
        });
        companyProfiles.belongsTo(models.profiles, {
            foreignKey: 'profileId'
        });
    };
    
    return companyProfiles;
};