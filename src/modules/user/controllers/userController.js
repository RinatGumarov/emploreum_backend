const userService = require('../services/userService');

module.exports.func = (router) => {
    
    router.get('/languages', async (req, res) => {
        let languages = await userService.allLanguages(req.user);
        res.json(languages);
    });
    
    return router;
    
};

