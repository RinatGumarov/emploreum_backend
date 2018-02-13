const skillService = require('../../specialisation/services/skillService');
const profilesService = require('../../specialisation/services/profileService');
const employeeService = require('../services/employeeService');
const vacancyService = require('../../company/services/vacancyService');

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

    // toDo переделать на профили - скилы
    router.get('/skills', async (req, res) => {
        let employee = await employeeService.getByUserId(req.user.id);
        let employeeSkills = await skillService.getEmployeeSkills(employee.id);
        res.json(employeeSkills);
    });

    router.get('/profiles', async (req, res) => {
        let employee = await employeeService.getByUserId(req.user.id);
        let employeeProfiles = await profilesService.getEmployeeProfiles(employee.id);
        res.json(employeeProfiles);
    });


    return router;
};