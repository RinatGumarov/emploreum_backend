const messageService = require('../../message/services/messageService');
const workService = require('../services/workService');
const companyService = require('../../company/services/companyService');
const employeeService = require('../../employee/services/employeeService');
const configUtils = require('../../../utils/config');
const blockchainInfo = require('../../blockchain/services/blockchainEventService');

const logger = require('../../../utils/logger');


module.exports.func = (router) => {

    //toDo
    router.post('/approve', async (req, res) => {
        let vacancyId = req.body.vacancyId;
        let address = req.user.account_address;
        let employee = await employeeService.getByUserId(req.body.userId);
        let company = await companyService.findByUserId(req.user.id);

        let promises = [];

        try {
            let message;

            if (!employee.contract) {
                let promise = employeeService.createBlockchainAccountForEmployee(employee);

                promises.push(promise);
                message = ` employee ${employee.name}`;
            }

            if (!company.contract) {
                let promise = companyService.createBlockchainAccountForCompany(company, 10);

                promises.push(promise);

                if (message)
                    message += ' and';

                message += ` company ${company.name}.`;
            }


            if (message) {
                await blockchainInfo.set(company.user_id, `contract creation ${address}`,
                    `Creating contract in blockchain for${message}`);

                await Promise.all(promises);

                blockchainInfo.unset(company.user_id, `contract creation ${address}`);
            }

            message = `employee ${employee.name} and company ${company.name}.`;

            await blockchainInfo.set(company.user_id, `work creation ${address}`,
                `Creating contract in blockchain between ${message}`);

            await workService.createWork(vacancyId, employee, company);

            blockchainInfo.unset(company.user_id, `work creation ${address}`);
        } catch (e) {
            logger.log(e);
            logger.log('Waiting promises, count: ' + promises.length);

            await Promise.all(promises);

            blockchainInfo.unset(company.user_id, `employee${address}`);
            return res.send({ data: 'fail' });
        }

        return res.send({ data: 'success' });
    });

    router.post('/:workId([0-9]+)/start', async (req, res) => {
        await workService.startWork(req.params.workId);
        res.send({ data: 'successful' });
    });

    /**
     * запуск начисления денег в котнракты между сотрудниками
     * и компаниями и выплата зарплаты сотрудникам
     */
    router.get('/run/salary/:token', async (req, res) => {
        let config = configUtils.get('server');
        if (req.params.token === config.token) {
            try {
                await workService.sendWeekSalaryForAllCompanies();
                res.send({ data: 'successful' });
            } catch (err) {
                logger.error(err);
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: 'token not found' });
        }
    });

    router.get('/test', async (req, res) => {
        await workService.startWork(12);
        res.send({ data: 'successful' });
    });

    return router;

};

