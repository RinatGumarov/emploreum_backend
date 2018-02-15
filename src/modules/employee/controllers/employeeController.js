const skillService = require('../../specialisation/services/skillService');
const cvService = require('../services/cvService');
const employeeService = require('../services/employeeService');
const vacancyService = require('../../company/services/vacancyService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

    router.get('/vacancy/:vacancyId/add', async (req, res) => {
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

    router.get('/vacancy/recommended', async (req, res) => {
        let employee = await employeeService.getByUserId(req.user.id);
        let employeeSkills = await skillService.getEmployeeSkills(employee.id);
        let recommendedVacancies = await vacancyService.getRecommended(employeeSkills, employee.id);
        res.json(recommendedVacancies);
    });

    router.get('/info', async (req, res) => {
        let employee = await employeeService.getByUserId(req.user.id);
        res.json(employee);
    });

    router.get('/skills', async (req, res) => {
        let employee = await employeeService.getByUserId(req.user.id);
        let employeeSkills = await cvService.getEmployeeSkills(employee.id);
        res.json(employeeSkills);
    });

    router.get('/contracts/current', async (req, res) => {
        try {
            return res.send([]);
        }
        catch (err) {
            logger.error(err.trace);
            return res.status(500).send({error: 'Could not get current works for the employee'});
        }
    });

    return router;
};