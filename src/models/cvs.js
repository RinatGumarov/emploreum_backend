module.exports = (sequelize, DataTypes) => {

    let cvs = sequelize.define('cvs', {}, {
        timestamps: false
    });

    cvs.associate = function (models) {
        cvs.belongsTo(models.profiles, {
            foreignKey: 'profile_id',
        });
        cvs.belongsTo(models.employees, {
            foreignKey: 'employee_id',
        });
        cvs.belongsToMany(models.answers, {
            through: 'cv_answers',
            foreignKey: 'cv_id',
            timestamps: false
        });
        cvs.belongsToMany(models.skills, {
            through: 'cv_skills',
            foreignKey: 'cv_id',
            timestamps: false
        });
    };

    return cvs;
};