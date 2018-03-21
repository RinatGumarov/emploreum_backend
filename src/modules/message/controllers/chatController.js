const chatService = require('../services/chatService');

module.exports.func = (router) => {
    
    router.get('/chats/all', async (req, res) => {
        let chats = await chatService.getAllChats(req.user);
        res.json(chats)
    });
    
    return router;
    
};

