module.exports.func = (router) => {

    router.post('/create', async (req, res) => {
        try {
            let company = await companyService.findByUserId(req.user.id);
            let options = req.body;
            let vacancy = await vacancyService.save(options);
            let profiles = options.specifications;
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
            logger.error(err.stack);
            return res.status(500).send({error: err.message});
        }
    });

    return router;

};

