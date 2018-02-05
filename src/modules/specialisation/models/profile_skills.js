module.exports = (sequelize, DataTypes) => {
    let profile_skills = sequelize.define('profile_skills', {}, {
        timestamps: false
    });

    profile_skills.associate = function (models) {
        profile_skills.belongsTo(models.skills, {
            foreignKey: 'skill_id'
        });
        profile_skills.belongsTo(models.profiles, {
            foreignKey: 'profile_id'
        });
    };


    return profile_skills;
};