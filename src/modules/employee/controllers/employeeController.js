const skillService = require('../../specialisation/services/skillService');
const cvService = require('../services/cvService');
const employeeService = require('../services/employeeService');
const companyService = require('../../company/services/companyService');
const messageService = require('../../message/services/messageService');
const vacancyService = require('../../company/services/vacancyService');
const workService = require('../services/workService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get('/vacancy/enroll/:vacancyId([0-9]+)', async (req, res) => {
        try {
            let vacancyId = req.params.vacancyId;
            let vacancy = await vacancyService.findById(vacancyId);
            let employee = await employeeService.getByUserId(req.user.id);
            let company = await companyService.findByVacancyId(vacancyId);
            await employeeService.attachVacancy(req.user.id, vacancyId);
            // первоначальное создание контракта в блокчайн для работника если у него еше нет контракта
            if (!(await employeeService.wasWorking(employee.id))) {
                await employeeService.createBlockchainAccountForEmployee(
                    employee.name, employee.name, 10, req.user.email, req.user.account_address);
            }
            // создание контракта для компании если его еше нет в блокчайн
            if (!(await companyService.hasContracts(company.id))) {
                await companyService.createBlockchainAccountForCompany(company.name, 10, company.user.account_address)
            }
            //todo employee user
            workService.createWork(vacancy, employee, company, vacancyId, req.user.account_address);
            await messageService.sendToCompany(req.user.id, company.id, "Вам постучались на вакансию");
            return res.send({data: 'success'});
        }
        catch (err) {
            logger.error(err.message);
            return res.status(500).send({error: 'Could not attach vacancy'});
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
    
    router.get('/address', async (req, res) => {
        return res.send(req.user.account_address);
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
            let employee = await employeeService.getByUserId(req.user.id);
            return res.send(await workService.findAllByEmployeeId(employee.id));
        }
        catch (err) {
            logger.error(err);
            return res.status(500).send({error: 'Could not get current works for the employee'});
        }
    });
    
    return router;
};