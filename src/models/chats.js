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
        timestamps: false
    });
    
    chats.associate = function (models) {
        chats.belongsTo(models.employees, {
            foreignKey: 'employee_id',
        });
        chats.belongsTo(models.companies, {
            foreignKey: 'company_id',
        });
        chats.hasMany(models.messages, {
            foreignKey: 'chat_id',
        })
    };
    
    return chats;
};