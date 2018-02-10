const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
    let users = sequelize.define('users', {
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        status: DataTypes.INTEGER,
    }, {
        timestamps: false
    });

    users.beforeCreate((user) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    });

    users.prototype.validPassword = (password, validPass) => {
        return bcrypt.compareSync(password, validPass);
    };

    users.associate = function (models) {
        users.hasOne(models.employees, {
            foreignKey: 'user_id'
        });
        users.hasOne(models.companies, {
            foreignKey: 'user_id'
        });
        users.belongsTo(models.roles, {
            foreignKey: 'role_id'
        });
    };

    return users;
};