const employeeService = require('../../employee/services/employeeService');
const companyService = require('../../company/services/companyService');
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

    router.get('/new', async (req, res) => {

        let newMessage;

        if (req.user.role === "EMPLOYEE") {
            newMessage = await chatService.getAllChatsWithNewMessageForEmployee(req.user.id);
        } else {
            newMessage = await chatService.getAllChatsWithNewMessageForCompany(req.user.id);
        }
        res.json(newMessage)

    });

    return router;

};

