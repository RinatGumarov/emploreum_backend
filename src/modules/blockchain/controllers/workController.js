const workService = require('../services/workService');
const employeeService = require('../../employee/services/employeeService');
const configUtils = require('../../../utils/config');
const logger = require('../../../utils/logger');
const mutex = require('../utils/mutex');
const employeeUtil = require('../utils/employee');
const workUtil = require('../utils/work');
const companyUtil = require('../utils/company');

module.exports.func = (router) => {
    
    router.post('/approve', async (req, res) => {
        let object = {
            userId: req.user.company.userId,
            employeeId: req.body.userId,
            vacancyId: req.body.vacancyId
        };
        
        try {
            
            
            if (!mutex.addMutex(object)) {
                return res.status(500).json({data: 'Multiple approve request.'});
            }
            req.connection.setTimeout(1000 * 60 * 10);
            
            let vacancyId = req.body.vacancyId;
            let address = req.user.accountAddress;
            let employee = await employeeService.getByUserId(req.body.userId);
            let company = req.user.company;
            let result = await workService.approve(vacancyId, address, employee, company, req.user);
            mutex.removeMutex(object);
            res.json({data: 'success'})
            
        } catch (err) {
            mutex.removeMutex(object);
            logger.error(err.stack);
            res.status(500).json({
                error: err.message
            });
        }
        
    });
    
    router.post('/:workId([0-9]+)/start', async (req, res) => {
        await workService.startWork(req.params.workId);
        res.json({data: 'successful'});
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
    
    router.get('/test', async (req, res) => {
        const works = await employeeUtil.getWorks('0x45716ec384f770035ecf7c5131b19ff5e9d85f8c');
        res.json({works});
    });
    
    router.get('/test/skills', async (req, res) => {
        const works = await employeeUtil.getSkills('0x737e0dee21b147a7b5534fa8ad78b9e633d8bf9b');
        res.json({works});
    });
    
    router.get('/workTest', async (req, res) => {
        const data = await workUtil.getWorkData('0x03995539127081ffdd5f1b3ec5c7783b6710954a');
        res.json({data});
    });
    
    router.get('/company/works', async (req, res) => {
        const data = await companyUtil.getWorks('0x14247C5B6fEAA0df9206FfE3bAf3a8cc3F8C8bdA');
        res.json({data});
    });
    
    return router;
    
};

