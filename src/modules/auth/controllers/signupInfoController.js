const employeesService = require('../../employee/services/employeeService');
const userService = require('../../user/services/userService');
const companiesService = require('../../company/services/companyService');

const logger = require('../../../utils/logger');
const status = require('../utils/status');

module.exports.func = (router) => {
    
    /** шаг заполнения лично информации*/
    router.post('/signup/info', async (req, res) => {
        let user = req.user;
        try {
            switch (user.role) {
                case 'EMPLOYEE':
                    //костыль для одной компоненты регистрации
                    req.body.photoPath = req.body.logo;
                    await employeesService.update(user.employee, req.body);
                    break;
                case 'COMPANY':
                    await companiesService.update(user.company, req.body);
                    break;
            }
            await userService.addLanguages(user, req.body.languages);
            let respObj = await status.incrementStatusAndReturnResponse(user);
            res.status(200).json(respObj);
    
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err.message});
        }
    });
    
    return router;
    
};
