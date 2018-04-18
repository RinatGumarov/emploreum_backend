const vacancyService = require('../services/vacancyService');
const logger = require('../../../utils/logger');


module.exports.func = (router) => {
    
    /** отклонить постучавшегося кандидата */
    router.post('/:vacancyId([0-9]+)/candidate/:candidatesId([0-9]+)/reject', async (req, res) => {
        try {
            await vacancyService.deleteAwaitedContractByVacancyId(req.params.vacancyId, req.params.candidatesId);
            res.json({data: "success"});
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).json({error: err.message});
        }
    });
    
    return router;
};
