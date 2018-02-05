module.exports = (sequelize, DataTypes) => {
    let profiles = sequelize.define('profiles', {
        name: DataTypes.STRING
    }, {
        timestamps: false
    });

    profiles.associate = function (models) {
        profiles.belongsToMany(models.skills, {
            through: 'profile_skills',
            foreignKey: 'profile_id'
        });
    };


    return profiles;
};