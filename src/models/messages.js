module.exports = (sequelize, DataTypes) => {

    let messages = sequelize.define('messages', {
        text: DataTypes.TEXT,
        is_employee_message: DataTypes.BOOLEAN,
        is_company_message: DataTypes.BOOLEAN,
        is_view: DataTypes.BOOLEAN,
    }, {
        timestamps: false
    });

    messages.associate = function (models) {
        messages.belongsTo(models.chats, {
            foreignKey: 'chat_id',
        });
    };

    return messages;
};