const companyService = require('../services/companyService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get('/employees', async (req, res) => {
        try {
            let company = req.user.company;
            res.json(await companyService.findAllEmployees(company));
        } catch (err) {
            logger.error(err.stack);
            res.status(500)
                .json('error');
        }
    });
    
    return router;
    
};
