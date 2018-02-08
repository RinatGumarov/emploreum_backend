module.exports = (sequelize, DataTypes) => {
    let roles = sequelize.define('roles', {
        role: DataTypes.STRING
    }, {
        timestamps: false
    });
    return roles;
};