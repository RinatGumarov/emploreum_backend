const cvService = require('../services/cvService');
const employeeService = require('../services/employeeService');
const messageService = require('../../message/services/messageService');
const balanceService = require('../../blockchain/services/balanceService');
const vacancyService = require('../../company/services/vacancyService');
const companyService = require('../../company/services/companyService');
const workService = require('../../blockchain/services/workService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

    router.get('/vacancy/enroll/:vacancyId([0-9]+)', async (req, res) => {
        try {
            let vacancyId = req.params.vacancyId;
            let company = await companyService.findByVacancyId(vacancyId);
            await employeeService.attachVacancy(req.user.employee, vacancyId);
            // не может это асунуть в employee сервис так как используем его в message сервиск
            await messageService.sendToCompany(req.user.employee, company.id, 'Вам постучались на вакансию');
            return res.send({ data: 'success' });
        }
        catch (err) {
            logger.error(err.stack);
            return res.status(500).send({ error: 'Could not attach vacancy' });
        }
    });
    
    
    router.get('/vacancy/recommended', async (req, res) => {
        let recommendedVacancies = await vacancyService.getRecommendedVacancies(req.user.employee);
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

    router.get('/indicators', async (req, res) => {
        let endedContractsCount = await employeeService.countEndedWorks(req.user.employee);
        let currentContractsCount = await employeeService.countCurrentWorks(req.user.employee);
        let income = await employeeService.getIncome(req.user.employee);
        let balance = await balanceService.getBalance(req.user.accountAddress);
        return res.send({
            endedContractsCount,
            currentContractsCount,
            income,
            balance,
            address: req.user.account_address
        });
    });
    
    router.get('/address', async (req, res) => {
        return res.send(req.user.accountAddress);
    });

    router.get('/contracts/awaited', async (req, res) => {
        try {
            let contracts = await employeeService.getAwaitedContracts(req.user.employee);
            return res.send(contracts);
        }
        catch (err) {
            logger.error(err.stack);
            return res.status(500).send({ error: 'Could not get awaited contracts for the employee' });
        }
    });

    router.get('/contracts/current', async (req, res) => {
        try {
            return res.send(await workService.findAllByEmployeeId(req.user.employee.id));
        }
        catch (err) {
            logger.error(err.stack);
            return res.status(500).send({ error: 'Could not get current works for the employee' });
        }
    });


    router.get('/all', async (req, res) => {
        try {
            let employees = await employeeService.findAllEmployees();
            return res.send(employees);
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).send({ error: 'Could not get all employees' });
        }
    });

    router.get('/rating/:employeeUserId([0-9]+)', async (req, res) => {
        let rating = await employeeService.getRating(req.params.employeeUserId);
        return res.send({ rating });
    });

    return router;
};
