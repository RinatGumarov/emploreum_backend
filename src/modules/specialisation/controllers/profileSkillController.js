const profileSkillService = require('../services/profileSkillService');
module.exports.func = (router) => {
    
    router.get('/profileSkills', async (req, res) => {
        let profileSkills = await profileSkillService.getAllForSearch();
        res.json(profileSkills)
    });
    
    return router;
    
};

