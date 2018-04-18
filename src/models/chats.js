module.exports = (sequelize, DataTypes) => {
    
    let chats = sequelize.define('chats', {
        // костыль sequlize create() метод см chatService сервис findOrCreate метод
        status: DataTypes.BIGINT,
    }, {
        timestamps: false
    });
    
    chats.associate = function (models) {
        chats.belongsToMany(models.users, {
            through: 'user_chats',
            foreignKey: 'chat_id',
            timestamps: false
        });
        chats.hasMany(models.messages, {
            foreignKey: 'chatId',
        });
    };
    
    return chats;
};