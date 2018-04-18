const employeeSearchService = require('../../employee/services/employeeSearchService');
const vacancySearchService = require('../../vacancy/services/vacancySearchService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get('/search', async (req, res) => {
        try {
            let params = JSON.parse(decodeURIComponent(req.query.filters));
            let result = [];
            if (params.type === "employees") {
                result = await employeeSearchService.search(params);
            } else if (params.type === "vacancies") {
                result = await vacancySearchService.search(params);
            }
            res.json(result);
            
        } catch (err) {
            console.log(err.stack);
            return res.status(500).send({error: 'search error'});
        }
    });
    
    
    return router;
    
};
