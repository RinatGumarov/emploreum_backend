const messageService = require('../../message/services/messageService');
const vacancyService = require('../../company/services/vacancyService');
const workService = require('../services/workService');
const companyService = require('../../company/services/companyService');
const employeeService = require('../../employee/services/employeeService');
const logger = require('../../../utils/logger');


module.exports.func = (router) => {

    router.post('/approve', async (req, res) => {
        let vacancyId = req.params.vacancyId;
        let vacancy = await vacancyService.findById(vacancyId);
        let employee = await employeeService.getByUserId(req.user.id);
        let company = await companyService.findByVacancyId(vacancyId);
        // первоначальное создание контракта в блокчайн для работника если у него еше нет контракта
        if (!(await employeeService.wasWorking(employee.id))) {
            await employeeService.createBlockchainAccountForEmployee(
                employee.name, employee.name, 10, req.user.email, req.user.account_address);
        }
        // создание контракта для компании если его еше нет в блокчайн
        if (!(await companyService.hasContracts(company.id))) {
            await companyService.createBlockchainAccountForCompany(company.name, 10, company.user.account_address)
        }
        workService.createWork(vacancy, employee, company, vacancyId, req.user.account_address);
        await messageService.sendToEmployee(req.user.id, employee.id, "Доуай Работай. Тебя заапрувели");
        return res.send({data: 'success'});
    });

    router.post('/start', async (req, res) => {
        
    });

    return router;

};

