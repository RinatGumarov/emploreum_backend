const employeeService = require('../services/employeeService');
const userService = require('../../user/services/userService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    /**  обновить инфу по aut employee */
    router.post('/info/update', async (req, res) => {
        try {
            await employeeService.update(req.user.employee, req.body);
            await userService.addLanguages(req.user, req.body.languages);
            res.json('success');
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({error: 'Could not update info by auth employee'});
        }
    });
    
    return router;
};
