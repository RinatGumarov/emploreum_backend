const companyService = require('../services/companyService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.post('/update', async (req, res) => {
        try {
            let company = await companyService.update(req.user.company, req.body);
            res.status(200)
                .json({success: true});
        } catch (err) {
            logger.error(err.stack);
            res.status(500)
                .json({error: err});
        }
    });
    
    return router;
};
