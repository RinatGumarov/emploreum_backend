const workService = require('../services/workService');
const employeeService = require('../../employee/services/employeeService');
const configUtils = require('../../../utils/config');
const logger = require('../../../utils/logger');
const mutex = require('../utils/mutex');

module.exports.func = (router) => {

    router.post('/approve', async (req, res) => {
        let object = {
            userId: req.user.company.userId,
            employeeId: req.body.userId,
            vacancyId: req.body.vacancyId
        };

        if (!mutex.addMutex(object))
            return res.status(500).json({ data: 'Multiple approve request.' });

        req.connection.setTimeout(1000 * 60 * 10);

        let vacancyId = req.body.vacancyId;
        let address = req.user.accountAddress;
        let employee = await employeeService.getByUserId(req.body.userId);
        let company = req.user.company;

        let result = await workService.approve(vacancyId, address, employee, company, req.user);

        if (!mutex.removeMutex(object))
            result = false;

        return result ?
            res.json({ data: 'success' })
            :
            res.status(500).json({ data: 'fail' });

    });

    router.post('/:workId([0-9]+)/start', async (req, res) => {
        await workService.startWork(req.params.workId);
        res.json({ data: 'successful' });
    });

    /**
     * запуск начисления денег в котнракты между сотрудниками
     * и компаниями и выплата зарплаты сотрудникам
     */
    router.get('/run/salary/:token', async (req, res) => {
        let config = configUtils.get('server');
        req.connection.setTimeout(1000 * 60 * 10);
        let token = process.env.SALARY_TOKEN || config.token;
        if (req.params.token === token) {
            try {
                await workService.sendWeekSalaryForAllCompanies();
                res.send({ data: 'successful' });
            } catch (err) {
                logger.error(err.stack);
                res.status(500).send({ error: err });
            }
        } else {
            res.status(500).send({ error: 'token not found' });
        }
    });

    return router;

};

