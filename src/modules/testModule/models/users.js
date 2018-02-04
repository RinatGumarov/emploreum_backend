const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
    let users = sequelize.define('users', {
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        phone: DataTypes.STRING,
        sex: DataTypes.BOOLEAN,
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        photo_path: DataTypes.STRING,
        city: DataTypes.STRING,
        birthday: DataTypes.DATE
    }, {
        timestamps: false
    });

    users.associate = function (models) {
        users.belongsTo(models.gradation_enums, {
            foreignKey: 'gradation'
        });
        users.belongsToMany(models.languages, {
            through: 'user_languages',
            foreignKey: 'user_id'
        });
        users.hasMany(models.achievements, {
            foreignKey: 'user_id'
        });
        users.hasMany(models.cv, {
            foreignKey: 'user_id'
        });
        users.hasMany(models.not_valid_jobs, {
            foreignKey: 'user_id'
        });
    };

    users.beforeCreate((user, options) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    });

    users.prototype.validPassword = (password, validPass) => {
        return bcrypt.compareSync(password, validPass);
    };

    return users;
};