module.exports = (sequelize, DataTypes) => {
    let roles = sequelize.define('roles', {
        role: DataTypes.STRING
    }, {
        timestamps: false
    });

    roles.associate = function (models) {
        roles.hasMany(models.users, {
            foreignKey: 'roleId'
        });
    };

    return roles;
};