const vacancyService = require('../services/vacancyService');
const logger = require('../../../utils/logger');


module.exports.func = (router) => {
    
    /**
     * получить инфомарцию о вакансии
     */
    router.get('/info/:id([0-9]+)', async (req, res) => {
        try {
            let vacancy = await vacancyService.findById(req.params.id);
            if (req.user && req.user.role === "EMPLOYEE") {
                let available = await vacancyService.isAvailable(req.params.id, req.user.id);
                vacancy.setDataValue("available", available);
            }
            res.json(vacancy);
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).json({error: err.message});
        }
    });
    
    
    return router;
    
};
