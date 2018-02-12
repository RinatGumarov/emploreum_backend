const profileService = require('../services/profileService');

module.exports.func = (router) => {

    router.get('/profiles', async (req, res) => {
        let profiles = await profileService.all();
        res.json({profiles: profiles})
    });

    return router;

};

