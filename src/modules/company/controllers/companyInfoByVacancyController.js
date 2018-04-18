const companyService = require('../services/companyService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    /**
     * получить инфу о компании по вокансии
     */
    router.get('/info/vacancy/:id([0-9]+)', async (req, res) => {
        try {
            let company = await companyService.findByVacancyId(req.params.id);
            res.status(200)
                .json(company);
        } catch (err) {
            logger.error(err.stack);
            res.status(500)
                .json({error: err});
        }
    });
    
    
    return router;
    
};
