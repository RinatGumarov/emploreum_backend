const employeeService = require('../services/employeeService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get('/info/:employeeUserId([0-9]+)', async (req, res) => {
        try {
            let employee = await employeeService.getByUserId(req.params.employeeUserId);
            res.json(employee);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({error: 'Could not get info by employee'});
        }
    });
    
    return router;
};
