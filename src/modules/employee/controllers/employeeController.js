const cvService = require('../services/cvService');
const employeeService = require('../services/employeeService');
const messageService = require('../../message/services/messageService');
const vacancyService = require('../../company/services/vacancyService');
const companyService = require('../../company/services/companyService');
const workService = require('../../work/services/workService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get("/vacancy/enroll/:vacancyId([0-9]+)", async (req, res) => {
        try {
            let vacancyId = req.params.vacancyId;
            let company = await companyService.findByVacancyId(vacancyId);
            await employeeService.attachVacancy(req.user.employee, vacancyId);
            // не может это асунуть в employee сервис так как используем его в message сервиск
            await messageService.sendToCompany(req.user.employee, company.id, "Вам постучались на вакансию");
            return res.send({data: "success"});
        }
        catch (err) {
            logger.error(err.message);
            return res.status(500).send({error: "Could not attach vacancy"});
        }
    });
    
    
    router.get('/vacancy/recommended', async (req, res) => {
        let recommendedVacancies = await vacancyService.getRecommended(req.user.id);
        res.json(recommendedVacancies);
    });
    
    router.get('/info/:employeeUserId([0-9]+)', async (req, res) => {
        let employee = await employeeService.getByUserId(req.params.employeeUserId);
        res.json(employee);
    });
    
    router.get('/skills/:employeeUserId([0-9]+)', async (req, res) => {
        let employeeSkills = await cvService.getEmployeeSpecification(req.params.employeeUserId);
        res.json(employeeSkills);
    });
    
    router.get("/address", async (req, res) => {
        return res.send(req.user.account_address);
    });
    
    router.get("/contracts/awaited", async (req, res) => {
        try {
            let contracts = await employeeService.getAwaitedContracts(req.user.employee);
            return res.send(contracts);
        }
        catch (err) {
            logger.error(err.trace);
            return res.status(500).send({error: "Could not get awaited contracts for the employee"});
        }
    });
    
    router.get("/contracts/current", async (req, res) => {
        try {
            return res.send(await workService.findAllByEmployeeId(req.user.employee.id));
        }
        catch (err) {
            logger.error(err);
            return res.status(500).send({error: "Could not get current works for the employee"});
        }
    });
    
    
    return router;
};
