const skillService = require('../../specialisation/services/skillService');
const cvService = require('../services/cvService');
const employeeService = require('../services/employeeService');
const companyService = require('../../company/services/companyService');
const workService = require('../services/workService');
const messageService = require('../../message/services/messageService');
const vacancyService = require('../../company/services/vacancyService');
const Account = require('../../blockchain/utils/account');
const logger = require('../../../utils/logger');
const Web3InitError = require('../../blockchain/utils/Web3Error');
const work = require('../../blockchain/utils/work');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

    router.post('/vacancy/:vacancyId/add', async (req, res) => {
        try {
            let vacancyId = req.params.vacancyId;
            let vacancy = await vacancyService.findById(vacancyId);
            let employee = await employeeService.getByUserId(req.user.id);
            let company = await companyService.findByUserIdWithUser(req.body.companyId);
            await employeeService.attachVacancy(employee, vacancyId);
            if (!(await employeeService.wasWorking(employee.id))) {
                employeeService.createBlockchainAccountForEmployee(
                    employee.name, employee.name, 10, req.user.email, req.user.account_address);
            }
            if (!(await companyService.hasContracts(company.id))) {
                companyService.createBlockchainAccountForCompany(company.name, 10, company.user.account_address)
            }
            workService.createWork(employee, company, vacancyId);
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

    router.get('/contracts/current', async (req, res) => {
       try {
           let employee = await employeeService.getByUserId(req.user.id);
           return res.send(await workService.findAllByEmployeeId(employee.id));
       }
       catch (err) {
           logger.error(err.trace);
           return res.status(500).send({error: 'Could not get current works for the employee'});
       }
    });

    router.get('/profiles', async (req, res) => {
        let employee = await employeeService.getByUserId(req.user.id);
        let employeeProfiles = await profilesService.getEmployeeProfiles(employee.id);
        res.json(employeeProfiles);
    });

    return router;
};