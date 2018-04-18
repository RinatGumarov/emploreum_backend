const vacancyService = require('../services/vacancyService');
const logger = require('../../../utils/logger');


module.exports.func = (router) => {
    
    router.get('/:id([0-9]+)/specification', async (req, res) => {
        try {
            let specification = await vacancyService.getVacancySpecification(req.params.id);
            res.json(specification);
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).json({error: err.message});
        }
    });
    
    return router;
};
