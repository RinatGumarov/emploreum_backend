const userService = require('../services/userService');
const employeeSearchService = require('../../employee/services/employeeSearchService');

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
            let result;
            if (params.type = "employees") {
                result = await employeeSearchService.search(params);
            }
            res.json(result);
        } catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: 'Could not get user languages'});
        }
    });
    
    
    return router;
    
};
