const profileService = require('../services/profilesService');

module.exports.func = (router) => {

    router.get('/profiles', (req, res) => {
        profileService.all().then(
            (profiles) => res.json({profiles: profiles})
        );
    });

    return router;

};

