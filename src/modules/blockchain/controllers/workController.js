const messageService = require('../../message/services/messageService');
const workService = require('../services/workService');
const companyService = require('../../company/services/companyService');
const employeeService = require('../../employee/services/employeeService');

//for test
const work = require('../utils/work');

const logger = require('../../../utils/logger');


module.exports.func = (router) => {
    
    //toDo
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
        await workService.createWork(vacancyId, employee, company);
        await messageService.sendToEmployee(req.user.id, employee.id, "Доуай Работай. Тебя заапрувели");
        return res.send({data: 'success'});
    });
    
    router.post('/:workId([0-9]+)/start', async (req, res) => {
        await workService.startWork(req.params.workId);
        res.send({data: 'successful'});
    });
    
    router.get('/test', async (req, res) => {
        return work.getWorkData("0x40153b5a389116594b0efdeb537fba00beca4b67").then(() => res.json(0));
    });
    
    return router;
    
};

