const employeeService = require('../../employee/services/employeeService');
const companyService = require('../../company/services/companyService');
const chatService = require('../services/chatService');
const messageService = require('../services/messageService');

module.exports.func = (router) => {

    router.get('/new', async (req, res) => {

        let newMessage;

        if (req.user.role === "EMPLOYEE") {
            let employee = await employeeService.getByUserId(req.user.id);
            newMessage = await chatService.getAllChatsWithNewMessageForEmployee(employee.id);
        } else {
            let company = await companyService.findByUserId(req.user.id);
            newMessage = await chatService.getAllChatsWithNewMessageForCompany(company.id);
        }
        res.json(newMessage)

    });

    router.get('/chat/:chatId/all', async (req, res) => {

        let messages;

        if (req.user.role === "EMPLOYEE") {
            let employee = await employeeService.getByUserId(req.user.id);
            messages = await messageService.getAllMessageByChatIdAndEmployeeId(req.params.chatId, employee.id);
        } else {
            let company = await companyService.findByUserId(req.user.id);
            messages = await messageService.getAllMessageByChatIdAndCompanyId(req.params.chatId, company.id);
        }

        res.json(messages)

    });
    return router;

};

