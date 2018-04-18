const testService = require('../services/testService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    /** запрашивание теста компанией */
    router.get('/:testId([0-9]+)', async (req, res) => {
        try {
            let company = req.user.company;
            let test = await testService.findById(req.params.testId);
            if (company && test && test.companyId === company.id) {
                return res.json(test);
            }
            res.status(500).json({error: "access deny"});
        } catch (err) {
            logger.error(err.stack);
            res.status(500).json({error: err.message});
        }
    });
    
    return router;
    
};
