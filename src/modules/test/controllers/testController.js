const testService = require('../services/testService');
const profileService = require('../../specialisation/services/profileService');

module.exports.func = (router) => {

    router.post('/create', async (req, res) => {
        try {
            let test = await testService.save(req.body);
            let profiles = req.body.specifications;
            await profiles.forEach(async (profile) => {
                await profile.skills.forEach(async (skill) => {
                    let profileSkill = await profileService.findProfileSkill(profile.id, skill.id);
                    await testService.addProfileSkills(test, profileSkill);
                });
            });

            return res.status(200).send({test: test});
        }
        catch (err) {
            logger.error(err.stack);
            return res.status(500).send({error: err.message});
        }
    });

    return router;

};

