const companyService = require('../services/companyService');
const vacancyService = require('../../vacancy/services/vacancyService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    /** получить инфу по коипании */
    router.get('/info/:id([0-9]+)', async (req, res) => {
        try {
            let company = await companyService.findByUserId(req.params.id);
            let openVacancies = await  vacancyService.findAllOpenVacancies(company);
            company.dataValues.vacancies = openVacancies.length;
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
