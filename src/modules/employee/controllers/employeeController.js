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

    return router;
};