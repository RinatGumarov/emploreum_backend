module.exports = (sequelize, DataTypes) => {
    let notValidJobs = sequelize.define('notValidJobs', {
        name: DataTypes.STRING,
        desc: DataTypes.TEXT,
        start: DataTypes.DATE,
        finish: DataTypes.DATE
    }, {
        timestamps: false,
        tableName: 'not_valid_jobs'
    });
    notValidJobs.associate = function (models) {
        notValidJobs.belongsToMany(models.skills, {
            through: 'not_valid_job_skills',
            foreignKey: 'not_valid_job_id',
            timestamps: false
        });
    };
    return notValidJobs;
};