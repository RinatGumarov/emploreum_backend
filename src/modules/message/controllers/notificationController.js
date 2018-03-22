const notificationService = require('../services/notificationService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get('/notifications/read', async (req, res) => {
        try {
            let count = await notificationService.readNotifications(req.user);
            res.json({
                data: "success"
            })
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err});
        }
    });
    
    router.get('/notifications', async (req, res) => {
        try {
            let notifications = await notificationService.getAllNotifications(req.user);
            res.json(notifications)
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err});
        }
    });
    
    
    return router;
    
};

