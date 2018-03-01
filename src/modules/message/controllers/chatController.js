const chatService = require('../services/chatService');

module.exports.func = (router) => {

    router.get('/chats/all', async (req, res) => {

        let chats;
        if (req.user.role === "EMPLOYEE") {
            chats = await chatService.getAllChatsForEmployee(req.user.employee);
        } else {
            chats = await chatService.getAllChatsForCompany(req.user.company);
        }

        res.json(chats)

    });
    
    return router;

};

