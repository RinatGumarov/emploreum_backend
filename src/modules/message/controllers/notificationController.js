const notificationService = require('../services/notificationService');

module.exports.func = (router) => {
    
    router.get('/notifications/read', async (req, res) => {
        let count = await notificationService.readNotifications(req.user);
        res.json({
            data: "success"
        })
    });
    
    router.get('/notifications', async (req, res) => {
        let notifications = await notificationService.getAllNotifications(req.user);
        res.json({
            notifications: notifications
        })
    });
    
    
    return router;
    
};

