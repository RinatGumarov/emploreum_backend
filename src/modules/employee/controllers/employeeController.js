const skillService = require('../../specialisation/services/skillService');
const employeeService = require('../services/employeeService');

module.exports.func = (router) => {

    router.post('/vacancy/:vacancyId/add', async (req, res) => {
        try {
            let employee = await employeeService.getByUserId(req.user.id);
            await employeeService.attachVacancy(employee, req.params.vacancyId);
            res.send({data: 'success'});
        }
        catch (err) {
            logger.error(err.message);
            res.status(500).send({error: 'Could not attach vacancy'});
        }
    });

    return router;
};