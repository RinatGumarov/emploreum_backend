const vacancyService = require('../services/vacancyService');
const logger = require('../../../utils/logger');


module.exports.func = (router) => {
    
    router.get('/:id([0-9]+)/candidates', async (req, res) => {
        try {
            let candidates = await vacancyService.getCandidatesByVacancyId(req.params.id);
            res.json(candidates);
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).json({error: err.message});
        }
    });
    
    return router;
};
