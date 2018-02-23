const messageService = require('../../message/services/messageService');
const vacancyService = require('../../company/services/vacancyService');
const workService = require('../services/workService');
const companyService = require('../../company/services/companyService');
const employeeService = require('../../employee/services/employeeService');
const logger = require('../../../utils/logger');


module.exports.func = (router) => {
    
    router.post('/approve', async (req, res) => {
        let vacancyId = req.body.vacancyId;
        let employee = await employeeService.getByUserId(req.body.userId);
        let company = await companyService.findByVacancyId(vacancyId);
        // первоначальное создание контракта в блокчайн для работника если у него еше нет контракта
        if (!employee.contract) {
            await employeeService.createBlockchainAccountForEmployee(
                company.user_id, employee, employee.name, employee.name, req.user.email, req.user.account_address);
        }
        // создание контракта для компании если его еше нет в блокчайн
        if (!company.contract) {
            await companyService.createBlockchainAccountForCompany(company.user_id, company, company.name, 10, req.user.account_address);
        }
        await workService.createWork(vacancyId, employee, company, vacancyId, req.user.account_address);
        await messageService.sendToEmployee(req.user.id, employee.id, "Доуай Работай. Тебя заапрувели");
        return res.send({data: 'success'});
    });
    
    router.post('/:workId([0-9]+)/start', async (req, res) => {
        await workService.startWork(req.params.workId);
        res.send({data: 'successful'});
    });
    
    router.post('/:workId([0-9]+)/pay', async (req, res) => {
        try {
            await workService.pay(req.params.workId);
            res.send({data: "success"});
        } catch (err) {
            logger.error(err.trace);
            res.status(500).send({error: "Something wrong with weekly payment"})
        }
    });
    
    router.post('/:workId([0-9]+)/deposit', async (req, res) => {
        try {
            await workService.deposit(req.params.workId, req.body.amount);
        } catch (err) {
            logger.error(err.trace);
            res.status(500).send({error: "Deposit could not be made"})
        }
    });
    
    
    return router;
    
};

