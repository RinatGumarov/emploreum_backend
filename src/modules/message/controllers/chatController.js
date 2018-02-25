const chatService = require('../services/chatService');

module.exports.func = (router) => {

    router.get('/chats/all', async (req, res) => {

        let chats;
        if (req.user.role === "EMPLOYEE") {
            chats = await chatService.getAllChatsFroEmployee(req.user.id);
        } else {
            chats = await chatService.getAllChatsFroCompany(req.user.id);
        }

        res.json(chats)

    });
    

    return router;

};

