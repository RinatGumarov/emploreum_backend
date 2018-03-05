module.exports = (sequelize, DataTypes) => {
    
    let skills = sequelize.define('skills', {
        name: DataTypes.STRING,
        photoPath: {
            type: DataTypes.STRING,
            field: "photo_path"
        },
        parentId: {
            type: DataTypes.BIGINT,
            field: "parent_id"
        }
    }, {
        timestamps: false
    });
    
    skills.associate = function (models) {
        skills.belongsTo(models.skills, {
            foreignKey: 'parentId'
        });
        skills.belongsToMany(models.profiles, {
            through: 'profileSkills',
            foreignKey: 'skillId',
            timestamps: false
        });
        
        skills.hasMany(models.profileSkills, {
            foreignKey: 'skillId',
            as: 'profileSkillsTrough'
        });
        
        skills.belongsToMany(models.cvs, {
            through: 'cv_skills',
            foreignKey: 'skill_id',
            timestamps: false
        });
    };
    
    return skills;
};