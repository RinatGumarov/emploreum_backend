const messageService = require('../../message/services/messageService');
const vacancyService = require('../../company/services/vacancyService');
const workService = require('../services/workService');
const companyService = require('../../company/services/companyService');
const employeeService = require('../../employee/services/employeeService');
const logger = require('../../../utils/logger');


module.exports.func = (router) => {

    router.post('/approve', async (req, res) => {
        let vacancyId = req.body.vacancyId;
        let vacancy = await vacancyService.findById(vacancyId);
        let employee = await employeeService.getById(req.body.employeeId);
        let company = await companyService.findByVacancyId(vacancyId);
        // первоначальное создание контракта в блокчайн для работника если у него еше нет контракта
        if (!employee.has_contract) {
            await employeeService.createBlockchainAccountForEmployee(
                employee.name, employee.name, req.user.email, req.user.account_address);
        }
        // создание контракта для компании если его еше нет в блокчайн
        if (!company.has_contract) {
            await companyService.createBlockchainAccountForCompany(company.name, 10, req.user.account_address)
        }
        await workService.createWork(vacancy, employee, company, vacancyId, req.user.account_address);
        await messageService.sendToEmployee(req.user.id, employee.id, "Доуай Работай. Тебя заапрувели");
        return res.send({data: 'success'});
    });

    router.post('/start', async (req, res) => {
        
    });

    return router;

};

