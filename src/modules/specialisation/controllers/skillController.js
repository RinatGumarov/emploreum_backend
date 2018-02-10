const skillService = require('../services/skillsService');

module.exports.func = (router) => {

    router.get('/skills/:profileId', (req, res) => {
        skillService.findByProfileId(req.params.profileId).then(
            (skills) => {
                res.json({skills: skills})
            }
        );
    });

    return router;

};

