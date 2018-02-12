module.exports = (sequelize, DataTypes) => {
    let vacancy_profile_skills = sequelize.define('vacancy_profile_skills', {}, {
        timestamps: false
    });

    vacancy_profile_skills.associate = function (models) {
        vacancy_profile_skills.hasOne(models.vacancies, {
            foreignKey: 'id'
        });
        vacancy_profile_skills.belongsTo(models.profile_skills, {
            foreignKey: 'profileSkillId'
        });
    };


    return vacancy_profile_skills;
};