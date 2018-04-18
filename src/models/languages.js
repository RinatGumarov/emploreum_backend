module.exports = (sequelize, DataTypes) => {
    let languages = sequelize.define('languages', {
        name: DataTypes.STRING
    }, {
        timestamps: false
    });

    languages.associate = function (models) {
        languages.belongsToMany(models.users, {
            through: 'user_languages',
            timestamps: false,
            foreignKey: 'language_id'
        });
    };

    return languages;
};