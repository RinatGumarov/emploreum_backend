module.exports = (sequelize, DataTypes) => {
    let profile_skills = sequelize.define('profileSkills', {
        skillId: {
            type: DataTypes.BIGINT,
            field: "skill_id"
        },
        profileId: {
            type: DataTypes.BIGINT,
            field: "profile_id"
        }
    }, {
        timestamps: false,
        tableName: "profile_skills"
    });
    
    profile_skills.associate = function (models) {
        profile_skills.belongsTo(models.skills, {
            foreignKey: 'skillId'
        });
        profile_skills.belongsTo(models.profiles, {
            foreignKey: 'profileId'
        });
        profile_skills.belongsToMany(models.vacancies, {
            foreignKey: 'profileSkillId',
            through: 'vacancyProfileSkills',
            timestamps: false
        });
        profile_skills.belongsToMany(models.tests, {
            foreignKey: 'profile_skill_id',
            through: 'test_profile_skills',
            timestamps: false
        });
    };
    
    
    return profile_skills;
};