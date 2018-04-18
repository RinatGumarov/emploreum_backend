const companyService = require('../services/companyService');
const vacancyService = require('../../vacancy/services/vacancyService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    /** получить все вакансии по компании */
    router.get('/:companyId([0-9]+)/vacancies', async (req, res) => {
        try {
            let company = await companyService.findByUserId(req.params.companyId);
            let vacancies = await vacancyService.findAllOpenVacancies(company);
            res.json(vacancies);
        } catch (err) {
            logger.error(err.stack);
            return res.status(500)
                .json({error: err.message});
        }
    });
    
    return router;
    
};
