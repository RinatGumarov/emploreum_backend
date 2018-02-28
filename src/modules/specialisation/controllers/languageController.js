const languageService = require('../services/languageService');

module.exports.func = (router) => {
    
    router.get('/languages', async (req, res) => {
        res.send(await languageService.findAll());
    });
    
    return router;
    
};

