const skillService = require('../services/skillService');

module.exports.func = (router) => {
    
    router.get('/skills/:profileId([0-9]+)', async (req, res) => {
        let skills = await skillService.findByProfileId(req.params.profileId);
        res.json(skills);
    });
    
    return router;
    
};

