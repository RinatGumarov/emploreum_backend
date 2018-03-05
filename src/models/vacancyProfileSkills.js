module.exports = (sequelize, DataTypes) => {
    let vacancyProfileSkills = sequelize.define('vacancyProfileSkills', {
        vacancyId: {
            type: DataTypes.BIGINT,
            field: "vacancy_id"
        },
        profileSkillId: {
            type: DataTypes.BIGINT,
            field: "profile_skill_id"
        }
    }, {
        timestamps: false,
        tableName: "vacancy_profile_skills"
    });
    
    vacancyProfileSkills.associate = function (models) {
        vacancyProfileSkills.belongsTo(models.vacancies, {
            foreignKey: 'vacancyId'
        });
        vacancyProfileSkills.belongsTo(models.profileSkills, {
            foreignKey: 'profileSkillId'
        });
    };
    
    
    return vacancyProfileSkills;
};