module.exports = (sequelize, DataTypes) => {
    
    let cv = sequelize.define('cvs', {}, {
        timestamps: false
    });

    cv.associate = function (models) {
        cv.belongsTo(models.profiles, {
            foreignKey: 'profile_id'
        });
        cv.belongsToMany(models.answers, {
            through: 'cv_answers',
            foreignKey: 'cv_id'
        });
        cv.belongsToMany(models.skills, {
            through: 'cv_skills',
            foreignKey: 'cv_id'
        });
    };

    return cv;
};