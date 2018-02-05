module.exports = (sequelize, DataTypes) => {
    
    let skills = sequelize.define('skills', {
        name: DataTypes.STRING,
        photo_path: DataTypes.STRING
    }, {
        timestamps: false
    });

    skills.associate = function (models) {
        skills.belongsTo(models.skills, {
            foreignKey: 'parent_id'
        });
        skills.belongsToMany(models.profiles, {
            through: 'profile_skills',
            foreignKey: 'skill_id'
        });
    };

    return skills;
};