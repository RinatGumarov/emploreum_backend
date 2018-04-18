const vacancyService = require('../services/vacancyService');
const logger = require('../../../utils/logger');


module.exports.func = (router) => {
    
    /** Только для работника. Узнать может ли он постучаться на вакансию. */
    router.get('/:vacancyId([0-9]+)/available', async (req, res) => {
        try {
            let isAvailable = await vacancyService.isAvailable(req.params.vacancyId, req.user.id);
            res.json(isAvailable);
        } catch (err) {
            logger.error(err.stack);
            res.json({error: err.message});
        }
    });
    
    return router;
};
