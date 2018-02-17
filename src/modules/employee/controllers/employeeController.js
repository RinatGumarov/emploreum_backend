const skillService = require('../../specialisation/services/skillService');
const cvService = require('../services/cvService');
const employeeService = require('../services/employeeService');
const companyService = require('../../company/services/companyService');
const messageService = require('../../message/services/messageService');
const vacancyService = require('../../company/services/vacancyService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get('/vacancy/enroll/:vacancyId([0-9]+)', async (req, res) => {
        try {
            await employeeService.attachVacancy(req.user.id, req.params.vacancyId);
            let company = await companyService.findByVacancyId(req.params.vacancyId);
            await messageService.sendToCompany(req.user.id, company.id, "Вам постучались на вакансию");
            res.send({data: 'success'});
        }
        catch (err) {
            logger.error(err.message);
            res.status(500).send({error: 'Could not attach vacancy'});
        }
    });
    
    router.get('/vacancy/recommended', async (req, res) => {
        let employeeSkills = await skillService.getEmployeeSkills(req.user.id);
        let recommendedVacancies = await vacancyService.getRecommended(employeeSkills, req.user.id);
        res.json(recommendedVacancies);
    });
    
    router.get('/info', async (req, res) => {
        let employee = await employeeService.getByUserId(req.user.id);
        res.json(employee);
    });
    
    router.get('/skills', async (req, res) => {
        let employeeSkills = await cvService.getEmployeeSkillsWithProfiles(req.user.id);
        res.json(employeeSkills);
    });
    
    /**
     * вакансии на котороые откликнулся чувак
     */
    router.get('/contracts/awaited', async (req, res) => {
        try {
            let contracts = await employeeService.getAwaitedContracts(req.user.id);
            return res.send(contracts);
        }
        catch (err) {
            logger.error(err.trace);
            return res.status(500).send({error: 'Could not get awaited contracts for the employee'});
        }
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