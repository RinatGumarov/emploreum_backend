const profileService = require('../services/profileService');

module.exports.func = (router) => {


    router.get('/profiles', (req, res) => {
        profileService.all().then(profiles=> {
            res.send({
                profiles: profiles
            })
        });
    });

    return router;

};

