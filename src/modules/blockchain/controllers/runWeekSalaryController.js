const workService = require('../services/workService');
const configUtils = require('../../../utils/config');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
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
                res.send({data: 'successful'});
            } catch (err) {
                logger.error(err.stack);
                res.status(500)
                    .send({error: err});
            }
        } else {
            res.status(500)
                .send({error: 'token not found'});
        }
    });
    
    return router;
    
};

