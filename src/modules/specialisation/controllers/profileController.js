const profileService = require('../services/profilesService');

module.exports.func = (router) => {

    router.get('/profiles', async (req, res) => {
        let profiles = await profileService.all();
        res.json({profiles: profiles})
    });

    return router;

};

