const messageService = require('../services/messageService');
const userService = require('../../auth/services/userService');

module.exports.func = (router) => {
    
    //toDo send intochat
    
    router.get('/chat/:chatId([0-9]+)/all', async (req, res) => {
        let messages = await messageService.getAllMessageByChatId(req.params.chatId, req.user);
        res.json(messages)
        
    });
    
    router.post('/create', async (req, res) => {
        let userFrom = await userService.getUserById(req.body.fromId);
        let message = await messageService.sendMessage(req.user, userFrom, req.body.text);
        res.json(message)
        
    });
    
    
    return router;
    
};

