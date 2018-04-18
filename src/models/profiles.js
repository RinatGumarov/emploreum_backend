module.exports = (sequelize, DataTypes) => {
    let profiles = sequelize.define('profiles', {
        name: DataTypes.STRING
    }, {
        timestamps: false
    });
    
    profiles.associate = function (models) {
        profiles.belongsToMany(models.skills, {
            through: 'profileSkills',
            foreignKey: 'profileId',
            timestamps: false
        });
        
        profiles.hasMany(models.profileSkills, {
            foreignKey: 'profileId',
            as: 'profileSkillsTrough'
        });
        
        profiles.belongsToMany(models.companies, {
            through: 'companyProfiles',
            foreignKey: 'profileId',
            timestamps: false
        });
    };
    
    
    return profiles;
};