const employeeService = require('../../employee/services/employeeService');
const companyService = require('../../company/services/companyService');
const chatService = require('../services/chatService');

module.exports.func = (router) => {

    router.get('/chats/all', async (req, res) => {

        let chats;

        if (req.user.role === "EMPLOYEE") {
            let employee = await employeeService.getByUserId(req.user.id);
            chats = await chatService.getAllChatsFroEmployee(employee.id);
        } else {
            let company = await companyService.findByUserId(req.user.id);
            chats = await chatService.getAllChatsFroCompany(company.id);
        }

        res.json(chats)

    });

    return router;

};

