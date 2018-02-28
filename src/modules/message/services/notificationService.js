const models = require('../../../core/models');
const Notifications = models.notifications;
const Op = models.sequelize.Op;
const socketSender = require('../../../core/socketSender');


let instance;

/**
 * сервис для отправки уведомлений
 * по сокету
 */
class NotificationService {
    
    /**
     * послать уведомление
     * @param userId
     * @param text
     * @returns {Promise<*>}
     */
    async sendNotification(userId, text) {
        let notification = await Notifications.create({
            user_id: userId,
            text: text
        });
        await socketSender.sendSocketMessage(userId, notification);
        return notification;
    };
    
    /**
     * показать новые уведомления
     * и сделать их прчоитанными
     */
    async getAllNotifications(user) {
        let notifications = await Notifications.findAll({
            where: {
                is_view: {[Op.eq]: false},
                user_id: {[Op.eq]: user.id}
            },
            order: [
                ['is_view', 'DESC'],
            ]
        });
        
        return notifications;
    }
    
    async readNotifications(user) {
        Notifications.update({
            is_view: true
        }, {
            where: {
                is_view: {[Op.eq]: false},
                user_id: {[Op.eq]: user.id}
            }
        });
    }
    
}

instance = new NotificationService();
module.exports = instance;