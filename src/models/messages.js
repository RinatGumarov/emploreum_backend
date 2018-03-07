module.exports = (sequelize, DataTypes) => {
    
    let messages = sequelize.define('messages', {
        text: DataTypes.TEXT,
        isEmployeeMessage: {
            type: DataTypes.BOOLEAN,
            field: "is_employee_message"
        },
        isCompanyMessage: {
            type: DataTypes.BOOLEAN,
            field: "is_company_message"
        },
        isView: {
            type: DataTypes.BOOLEAN,
            field: "is_view"
        },
        chatId: {
            type: DataTypes.BIGINT,
            field: "chat_id"
        },
        createdAt:{
            type: DataTypes.DATE,
            field: "created_at"
        }
    }, {
        timestamps: false
    });
    
    messages.associate = function (models) {
        messages.belongsTo(models.chats, {
            foreignKey: 'chatId',
        });
    };
    
    return messages;
};