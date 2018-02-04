module.exports = (sequelize, DataTypes) => {
    let not_valid_jobs = sequelize.define('not_valid_jobs', {
        name: DataTypes.STRING,
        desc: DataTypes.TEXT,
        start: DataTypes.DATE,
        finish: DataTypes.DATE
    }, {
        timestamps: false
    });

    not_valid_jobs.associate = function (models) {
        not_valid_jobs.belongsToMany(models.skills, {
            through: 'not_valid_job_skills',
            foreignKey: 'not_valid_job_id'
        });
    };

    return not_valid_jobs;
};