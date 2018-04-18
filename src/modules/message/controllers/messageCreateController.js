const messageService = require('../services/messageService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.post('/create', async (req, res) => {
        try {
            let message = await messageService.sendMessageToChat(req.user, req.body.chatId, req.body.text);
            res.json(message)
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err});
        }
    });
    
    return router;
    
};

