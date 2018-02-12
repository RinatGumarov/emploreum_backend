module.exports = (sequelize, DataTypes) => {
    let profile_skills = sequelize.define('profile_skills', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
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
            foreignKey: 'vacancy_id',
            through: 'vacancy_profile_skills'
        });
    };


    return profile_skills;
};