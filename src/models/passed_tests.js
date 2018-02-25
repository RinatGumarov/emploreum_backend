module.exports = (sequelize, DataTypes) => {
    let profiles = sequelize.define('profiles', {
        answer: DataTypes.TEXT,

    }, {
        timestamps: false
    });

    profiles.associate = function (models) {
        profiles.belongsToMany(models.skills, {
            through: 'profile_skills',
            foreignKey: 'profile_id',
            timestamps: false
        });

        profiles.hasMany(models.profile_skills, {
            foreignKey: 'profile_id',
            as: 'profile_skills_trough'
        });

        profiles.belongsToMany(models.companies, {
            through: 'company_profiles',
            foreignKey: 'profile_id',
            timestamps: false
        });
    };


    return profiles;
};