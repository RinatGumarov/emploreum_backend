module.exports = (sequelize, DataTypes) => {
    
    let chats = sequelize.define('chats', {
        employeeId: {
            type: DataTypes.BIGINT,
            field: "employee_id"
        },
        companyId: {
            type: DataTypes.BIGINT,
            field: "company_id"
        }
    }, {
        underscored: false,
        timestamps: false
    });
    
    chats.associate = function (models) {
        chats.belongsTo(models.employees, {
            foreignKey: 'employeeId',
        });
        chats.belongsTo(models.companies, {
            foreignKey: 'companyId',
        });
        chats.hasMany(models.messages, {
            foreignKey: 'chatId',
        })
    };
    
    return chats;
};