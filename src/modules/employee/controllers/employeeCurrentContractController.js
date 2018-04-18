const workService = require('../../blockchain/services/workService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get('/contracts/current', async (req, res) => {
        try {
            res.send(await workService.findAllByEmployeeId(req.user.employee.id));
        }
        catch (err) {
            logger.error(err.stack);
            res.status(500).send({error: 'Could not get current works for the employee'});
        }
    });
    
    return router;
};
