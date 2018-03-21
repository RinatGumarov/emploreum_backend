const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
    let users = sequelize.define('users', {
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        status: DataTypes.INTEGER,
        encryptedKey: {
            type: DataTypes.TEXT,
            field: "encrypted_key"
        },
        keyPassword: {
            type: DataTypes.STRING,
            field: "key_password"
            
        },
        accountAddress: {
            type: DataTypes.STRING,
            field: "account_address"
        },
        roleId: {
            type: DataTypes.BIGINT,
            field: "role_id"
        }
    }, {
        timestamps: false
    });
    
    users.beforeCreate((user) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    });
    
    users.beforeUpdate((params, options) => {
        if (params.status) {
            delete params.status;
        }
        if (params.role_id) {
            delete params.role_id;
        }
    });
    
    users.prototype.validPassword = (password, validPass) => {
        return bcrypt.compareSync(password, validPass);
    };
    
    users.associate = function (models) {
        users.hasOne(models.employees, {
            foreignKey: 'userId'
        });
        users.hasOne(models.companies, {
            foreignKey: 'userId'
        });
        users.belongsTo(models.roles, {
            foreignKey: 'roleId'
        });
        users.hasMany(models.notifications, {
            foreignKey: 'userId'
        });
        users.belongsToMany(models.chats, {
            through: 'user_chats',
            foreignKey: 'user_id',
            timestamps: false
        });
    };
    
    return users;
};