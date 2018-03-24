const languageService = require('../services/languageService');

module.exports.func = (router) => {
    
    router.get('/all', async (req, res) => {
        res.send(await languageService.findAll());
    });


    router.post('/add', async (req, res) => {
        let user = req.user;
        await languageService.addLanguages(user, req.body.languages);
        return res.send({data: 'success'});
    });

    return router;
    
};

