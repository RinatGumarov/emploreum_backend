const cvService = require('../services/cvService');
const employeeService = require('../services/employeeService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get('/skills/:employeeUserId([0-9]+)', async (req, res) => {
        try {
            let employeeSkills = await cvService.getEmployeeSpecification(req.params.employeeUserId);
            await employeeService.addRatingToSkills(req.params.employeeUserId, employeeSkills);
            res.json(employeeSkills);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({error: 'Could not get skills by employee'});
        }
    });
    
    return router;
};
