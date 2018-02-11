const companyService = require('../services/companyService');
const vacancyService = require('../services/vacancyService');
const logger = require('../../../utils/logger');

module.exports.func = (router) => {

    router.post('/vacancy', async (req, res) => {
        try {
            let company = await companyService.findByUserId(req.user.id);
            let options = req.body;
            options.company_id = company.id;
            let vacancy = await vacancyService.save(options);
            let profiles = options.profiles;
            await profiles.forEach(async (profile) => {
                await profile.skills.forEach(async (skill) => {
                    let profileSkill = await vacancyService.findProfileSkill(profile.id, skill.id);
                    let vacancyProfileSkill = await vacancyService.addProfileSkillToVacancy({
                        vacancy_id: vacancy.id,
                        profile_skill_id: profileSkill.id
                    });
                    logger.log(vacancyProfileSkill);
                });
            });
            return res.status(200).send({vacancy: vacancy});
        }
        catch (err) {
            return res.status(500).send({error: err.message});
        }
    });

    return router;

};