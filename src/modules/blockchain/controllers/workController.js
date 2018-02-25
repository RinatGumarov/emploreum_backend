const messageService = require('../../message/services/messageService');
const workService = require('../services/workService');
const companyService = require('../../company/services/companyService');
const employeeService = require('../../employee/services/employeeService');
const configUtils = require('../../../utils/config');

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
    
    /**
     * запуск начисления денег в котнракты между сотрудниками
     * и компаниями и выплата зарплаты сотрудникам
     */
    router.get('/run/salary/:token', async (req, res) => {
        lt
        config = configUtils.get("server");
        if (req.params.workId === config.token) {
            try {
                await workService.sendWeekSalaryForAllByCompany();
                res.send({data: 'successful'});
            } catch (err) {
                logger.error(err);
                res.status(500).send({error: err});
            }
        } else {
            res.status(500).send({error: "token not found"});
        }
    });
    
    return router;
    
};

