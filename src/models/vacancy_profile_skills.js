module.exports = (sequelize, DataTypes) => {
    let vacancy_profile_skills = sequelize.define('vacancy_profile_skills', {}, {
        timestamps: false
    });

    vacancy_profile_skills.associate = function (models) {
        vacancy_profile_skills.belongsTo(models.vacancies, {
            foreignKey: 'vacancy_id'
        });
        vacancy_profile_skills.belongsTo(models.profile_skills, {
            foreignKey: 'profile_skill_id'
        });
    };


    return vacancy_profile_skills;
};