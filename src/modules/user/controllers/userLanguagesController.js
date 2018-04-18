const userService = require('../services/userService');

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
    
    return router;
    
};
