const userService = require('../services/userService');
const employeeSearchService = require('../../employee/services/employeeSearchService');
const vacancySearchService = require('../../company/services/vacancySearchService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    router.get('/languages', async (req, res) => {
        try {
            let languages = await userService.allLanguages(req.user);
            res.json(languages);
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: 'Could not get user languages'});
        }
    });
    
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
            logger.error(err.stack);
            return res.status(500).send({error: 'search error'});
        }
    });
    
    
    return router;
    
};
