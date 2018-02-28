const chatService = require('../services/chatService');

module.exports.func = (router) => {

    router.get('/chats/all', async (req, res) => {

        let chats;
        if (req.user.role === "EMPLOYEE") {
            chats = await chatService.getAllChatsFroEmployee(req.user.employee);
        } else {
            chats = await chatService.getAllChatsFroCompany(req.user.company);
        }

        res.json(chats)

    });
    
    return router;

};

