const languageService = require('../services/languageService');

module.exports.func = (router) => {
    
    router.get('/all', async (req, res) => {
        res.send(await languageService.findAll());
    });
    
    return router;
    
};

