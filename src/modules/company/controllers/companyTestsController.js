const companyService = require('../services/companyService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get('/tests', async (req, res) => {
        try {
            let company = req.user.company;
            let tests = await companyService.findAllTests(company.id);
            res.json(tests);
        } catch (err) {
            logger.error(err.stack);
            res.status(500)
                .json({error: err});
        }
    });
    
    return router;
    
};
