const vacancyService = require('../services/vacancyService');
const profileSkillService = require('../../specialisation/services/profileSkillService');
const logger = require('../../../utils/logger');


module.exports.func = (router) => {
    
    router.post('/create', async (req, res) => {
        try {
            let company = req.user.company;
            let options = req.body;
            options.companyId = company.id;
            let vacancy = await vacancyService.save(options);
            let profiles = options.specifications;
            //todo replace with for
            await profiles.forEach(async (profile) => {
                await profile.skills.forEach(async (skill) => {
                    let profileSkill = await profileSkillService.findProfileSkill(profile.id, skill.id);
                    let vacancyProfileSkill = await vacancyService.addProfileSkillToVacancy({
                        vacancyId: vacancy.id,
                        profileSkillId: profileSkill.id
                    });
                });
            });
            return res.status(200).json(vacancy);
        }
        catch (err) {
            logger.error(err.stack);
            return res.status(500).json({error: err.message});
        }
    });
    
    
    return router;
    
};
