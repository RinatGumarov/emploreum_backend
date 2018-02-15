const employeeService = require('../../employee/services/employeeService');
const companyService = require('../../company/services/companyService');
const chatService = require('../services/chatService');
const messageService = require('../services/messageService');

module.exports.func = (router) => {

    router.get('/new', async (req, res) => {
        try {
            let newMessage;
            if (req.user.role === "EMPLOYEE") {
                let employee = await employeeService.getByUserId(req.user.id);
                newMessage = await chatService.getAllChatsWithNewMessageForEmployee(employee.id);
            } else {
                let company = await companyService.findByUserId(req.user.id);
                newMessage = await chatService.getAllChatsWithNewMessageForCompany(company.id);
            }
            res.json(newMessage)
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({error: 'Could not get new messages'});
        }
    });

    router.get('/chat/:chatId/all', async (req, res) => {
        try {
            let messages;
            if (req.user.role === "EMPLOYEE") {
                let employee = await employeeService.getByUserId(req.user.id);
                messages = await messageService.getAllMessageByChatIdAndEmployeeId(req.params.chatId, employee.id);
            } else {
                let company = await companyService.findByUserId(req.user.id);
                messages = await messageService.getAllMessageByChatIdAndCompanyId(req.params.chatId, company.id);
            }
            res.json(messages);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({error: 'Could not get messages by chat'});

        }

    });
    return router;

};

