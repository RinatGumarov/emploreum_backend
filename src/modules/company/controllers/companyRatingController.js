const companyService = require('../services/companyService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get('/rating/:companyId([0-9]+)', async (req, res) => {
        try {
            let company = await companyService.findByUserId(req.params.companyId);
            let rating = await companyService.getRating(company);
            return res.json(rating);
        } catch (err) {
            logger.error(err.stack);
            res.status(500)
                .json({error: err});
        }
    });
    
    return router;
    
};
