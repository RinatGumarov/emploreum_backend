const employeeService = require('../../employee/services/employeeService');
const companyService = require('../../company/services/companyService');
const chatService = require('../services/chatService');
const messageService = require('../services/messageService');

module.exports.func = (router) => {

    router.get('/chat/:chatId/all', async (req, res) => {

        let messages;

        if (req.user.role === "EMPLOYEE") {
            let employee = await employeeService.getByUserId(req.user.id);
            messages = await messageService.getAllMessageByChatIdAndEmployee(req.params.chatId, req.user.id);
        } else {
            let company = await companyService.findByUserId(req.user.id);
            messages = await messageService.getAllMessageByChatIdAndCompany(req.params.chatId, req.user.id);
        }

        res.json(messages)

    });
    return router;

};

