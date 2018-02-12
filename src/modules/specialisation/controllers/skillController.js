const skillService = require('../services/skillService');

module.exports.func = (router) => {

    router.get('/skills/:profileId', async (req, res) => {
        let skills = await skillService.findByProfileId(req.params.profileId);
        res.json({skills: skills});
    });

    return router;

};

