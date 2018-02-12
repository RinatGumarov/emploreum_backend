const skillService = require('../../specialisation/services/skillService');
const vacancyService = require('../../company/services/vacancyService');
const employeeService = require('../services/employeeService');

module.exports.func = (router) => {

    router.get('/vacancy/recommended', async (req, res) => {
        let employee = await employeeService.getByUserId(req.user.id);
        let employeeSkills = await skillService.getEmployeeSkills(employee.id);
        let recommendedVacancies = await vacancyService.getRecommended(employeeSkills);
        res.json(recommendedVacancies);
    });

    router.post('/vacancy/add', async (req, res) => {
        try {
            let employee = await employeeService.getByUserId(req.user.id);
            await employeeService.attachVacancy(employee, req.body.vacancyId);
            res.send({data: 'success'});
        }
        catch (err){
            logger.error(err.message);
            res.status(500).send( { error: 'Could not attach vacancy' } );
        }
    });

    return router;
};