const notificationService = require('../services/notificationService');

module.exports.func = (router) => {
    
    router.get('/notifications/new/count', async (req, res) => {
        let count = await notificationService.getNewNotificationsCount(req.user.id);
        res.json({
            count: count
        })
    });
    
    router.get('/notifications', async (req, res) => {
        let notifications = await notificationService.getAllNotifications(req.user.id);
        res.json({
            notifications: notifications
        })
    });
    
    
    return router;
    
};

