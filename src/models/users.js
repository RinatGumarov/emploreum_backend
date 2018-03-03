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
            field: "keyPassword"
            
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
            foreignKey: 'user_id'
        });
        users.hasOne(models.companies, {
            foreignKey: 'user_id'
        });
        users.belongsTo(models.roles, {
            foreignKey: 'role_id'
        });
        users.hasMany(models.notifications, {
            foreignKey: 'user_id'
        });
    };
    
    return users;
};