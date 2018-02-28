const employeeService = require('../../employee/services/employeeService');
const companyService = require('../../company/services/companyService');
const chatService = require('../services/chatService');
const messageService = require('../services/messageService');

module.exports.func = (router) => {
    
    router.get('/chat/:chatId([0-9]+)/all', async (req, res) => {
        
        let messages;
        
        if (req.user.role === "EMPLOYEE") {
            messages = await messageService.getAllMessageByChatIdAndEmployee(req.params.chatId, req.user.employee);
        } else {
            messages = await messageService.getAllMessageByChatIdAndCompany(req.params.chatId, req.user.company);
        }
        
        res.json(messages)
        
    });
    return router;
    
};

