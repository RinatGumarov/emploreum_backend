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
            logger.error(err.stack);
            res.status(500).send({error: 'Could not attach vacancy'});
        }
    });

    router.get('/vacancy/recommended', async (req, res) => {
        try {
            let employee = await employeeService.getByUserId(req.user.id);
            let employeeSkills = await skillService.getEmployeeSkills(employee.id);
            let recommendedVacancies = await vacancyService.getRecommended(employeeSkills, employee.id);
            res.json(recommendedVacancies);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({error: 'Could not get recommended vacancy'});
        }
    });

    router.get('/info', async (req, res) => {
        try {
            let employee = await employeeService.getByUserId(req.user.id);
            res.json(employee);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({error: 'Could not get user info'});
        }
    });

    router.get('/skills', async (req, res) => {
        try {
            let employee = await employeeService.getByUserId(req.user.id);
            let employeeSkills = await cvService.getEmployeeSkills(employee.id);
            res.json(employeeSkills);
        } catch (err) {
            logger.error(err.stack);
            res.status(500).send({error: 'Could not get user skills'});
        }
    });

    router.get('/contracts/current', async (req, res) => {
        try {
            return res.send([]);
        }
        catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: 'Could not get current works for the employee'});
        }
    });

    return router;
};