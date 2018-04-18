const messageService = require('../services/messageService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    
    router.get('/chat/:chatId([0-9]+)/all', async (req, res) => {
        try {
            let messages = await messageService.getAllMessageByChatId(req.params.chatId, req.user);
            res.json(messages)
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err});
        }
    });
    
    
    
    return router;
    
};

