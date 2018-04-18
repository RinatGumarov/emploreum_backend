const testService = require('../services/testService');
const vacancyService = require('../../vacancy/services/vacancyService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    /** начало теста */
    router.get('/:vacancyId([0-9]+)/start', async (req, res) => {
        try {
            let employee = req.user.employee;
            let vacancy = await vacancyService.findById(req.params.vacancyId);
            let test = await testService.findById(vacancy.testId);
            let started = await  testService.findTestEnds(employee.id, test.id);
            if (started) {
                return res.json({data: 'already started'});
            }
            if (!started)
                await testService.startTest(employee, test);
            return res.json({data: 'success'});
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).json({error: err.message});
        }
    });
    
    return router;
    
};
