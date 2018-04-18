const chatService = require('../services/chatService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get('/chats/all', async (req, res) => {
        try {
            let chats = await chatService.getAllChats(req.user);
            res.json(chats)
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err});
        }
    });
    
    return router;
    
};

