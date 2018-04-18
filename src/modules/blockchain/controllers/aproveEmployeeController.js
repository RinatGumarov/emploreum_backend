const workService = require('../services/workService');
const employeeService = require('../../employee/services/employeeService');
const logger = require('../../../utils/logger');
const mutex = require('../utils/mutex');

module.exports.func = (router) => {

    router.post('/approve', async (req, res) => {
        let object = {
            userId: req.user.company.userId,
            employeeId: req.body.userId,
            vacancyId: req.body.vacancyId
        };

        try {
            if (!mutex.addMutex(object)) {
                return res.status(500)
                    .json({ data: 'Multiple approve request.' });
            }
            req.connection.setTimeout(1000 * 60 * 10);

            let vacancyId = req.body.vacancyId;
            let address = req.user.accountAddress;
            let employee = await employeeService.getByUserId(req.body.userId);
            let company = req.user.company;
            let result = await workService.approve(vacancyId, address, employee, company, req.user);
            mutex.removeMutex(object);
            res.json({ data: 'success' });

        } catch (err) {
            mutex.removeMutex(object);
            logger.error(err.stack);
            res.status(500)
                .json({
                    error: err.message
                });
        }

    });

    return router;

};

