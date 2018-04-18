const employeeService = require('../services/employeeService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get('/contracts/awaited', async (req, res) => {
        try {
            let contracts = await employeeService.getAwaitedContracts(req.user.employee);
            res.send(contracts);
        }
        catch (err) {
            logger.error(err.stack);
            res.status(500).send({error: 'Could not get awaited contracts for the employee'});
        }
    });
    
    return router;
};
