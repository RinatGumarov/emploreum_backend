const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
    let users = sequelize.define('users', {
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        status: DataTypes.INTEGER,
        role: DataTypes.STRING
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
        users.hasMany(models.employees, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            cascade: true
        } );

        users.hasMany(models.companies, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            cascade: true
        } );
    };

    return users;
};