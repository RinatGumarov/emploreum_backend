module.exports = (sequelize, DataTypes) => {
   
    let notifications = sequelize.define('notifications', {
        text: DataTypes.STRING,
        is_view: DataTypes.BOOLEAN
    }, {
        timestamps: false
    });
    notifications.associate = function (models) {
        notifications.belongsTo(models.users, {
            foreignKey: 'user_id'
        });
    };
    
    return notifications;
};