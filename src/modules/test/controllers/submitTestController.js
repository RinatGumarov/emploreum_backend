const testService = require('../services/testService');
const vacancyService = require('../../vacancy/services/vacancyService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    /** Засабмитеть тест работником */
    router.get('/:vacancyId([0-9]+)/submit', async (req, res) => {
        let employee = req.user.employee;
        let vacancy = await vacancyService.findById(req.params.vacancyId);
        let test = await testService.findById(vacancy.testId);
        await testService.submitTest(employee, test);
        res.json({data: 'success'});
    });
    
    return router;
    
};
