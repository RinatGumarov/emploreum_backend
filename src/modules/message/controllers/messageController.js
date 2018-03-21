const messageService = require('../services/messageService');

module.exports.func = (router) => {
    
    router.get('/chat/:chatId([0-9]+)/all', async (req, res) => {
        let messages = await messageService.getAllMessageByChatId(req.params.chatId, req.user);
        res.json(messages)
        
    });
    return router;
    
};

