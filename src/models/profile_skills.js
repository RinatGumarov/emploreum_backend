module.exports = (sequelize, DataTypes) => {
    let profile_skills = sequelize.define('profile_skills', {
        skillId: {
            type: DataTypes.BIGINT,
            field: "skill_id"
        },
        profileId: {
            type: DataTypes.BIGINT,
            field: "profile_id"
        }
    }, {
        timestamps: false
    });
    
    profile_skills.associate = function (models) {
        profile_skills.belongsTo(models.skills, {
            foreignKey: 'skill_id'
        });
        profile_skills.belongsTo(models.profiles, {
            foreignKey: 'profile_id'
        });
        profile_skills.belongsToMany(models.vacancies, {
            foreignKey: 'profile_skill_id',
            through: 'vacancy_profile_skills'
        });
        profile_skills.belongsToMany(models.tests, {
            foreignKey: 'profile_skill_id',
            through: 'test_profile_skills',
            timestamps: false
        });
    };
    
    
    return profile_skills;
};