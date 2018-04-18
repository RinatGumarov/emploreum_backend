const testService = require('../services/testService');
const profileSkillService = require('../../specialisation/services/profileSkillService');

const logger = require('../../../utils/logger');

module.exports.func = (router) => {
    
    /** создание теста компанией */
    router.post('/company/create', async (req, res) => {
        try {
            let company = req.user.company;
            let options = req.body;
            options.companyId = company.id;
            let test = await testService.save(options);
            let profiles = req.body.specifications;
            await profiles.forEach(async (profile) => {
                await profile.skills.forEach(async (skill) => {
                    let profileSkill = await profileSkillService.findProfileSkill(profile.id, skill.id);
                    await testService.addProfileSkills(test, profileSkill);
                });
            });
            
            return res.json(test.id);
        }
        catch (err) {
            logger.error(err.stack);
            return res.status(500).json({error: err.message});
        }
    });
    
    return router;
};
