module.exports = (sequelize, DataTypes) => {
    
    let notifications = sequelize.define('notifications', {
        text: DataTypes.STRING,
        isView: {
            type: DataTypes.BOOLEAN,
            field: "is_view"
        },
        userId: {
            type: DataTypes.BIGINT,
            field: "user_id"
        }
    }, {
        timestamps: false
    });
    notifications.associate = function (models) {
        notifications.belongsTo(models.users, {
            foreignKey: 'userId'
        });
    };
    
    return notifications;
};