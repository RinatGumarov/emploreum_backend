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
     * @param userId
     * @returns {Promise<*>}
     */
    async getAllNotifications(userId) {
        let notifications = await Notifications.findAll({
            where: {
                is_view: {[Op.eq]: true},
                user_id: {[Op.eq]: userId}
            },
            order: [
                ['is_view', 'DESC'],
            ]
        });
        Notifications.update({
            is_view: true
        }, {
            where: {
                is_view: {[Op.eq]: false},
                user_id: {[Op.eq]: userId}
            }
        });
        return notifications;
    }
    
    /**
     * количество новых уведомлений
     * @param userId
     * @returns {Promise<number>}
     */
    async getNewNotificationsCount(userId) {
        
        let notifications = await Notifications.findAll({
            attributes: ["id"],
            where: {
                is_view: {[Op.eq]: true},
                user_id: {[Op.eq]: userId}
            },
        });
       
        return (notifications.length) ? notifications.length : 0;
    }
}

instance = new NotificationService();
module.exports = instance;