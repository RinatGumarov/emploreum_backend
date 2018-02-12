const companyService = require('../services/companyService');
const vacancyService = require('../services/vacancyService');
const logger = require('../../../utils/logger');

function buildVacancies(vacancies) {
    let beautyVacancies = [];
    for (let i = 0; vacancies.length && i < vacancies.length; ++i) {
        let beautyVacancy = {};
        beautyVacancy.id = vacancies[i].id;
        beautyVacancy.name = vacancies[i].name;
        beautyVacancy.weekPayment = vacancies[i].pricePerWeek;
        beautyVacancy.info = vacancies[i].info;
        beautyVacancy.duration = vacancies[i].duration;
        beautyVacancy.profiles = [];
        let profilesMap = {};
        let profileSkills = vacancies[i].profile_skills;
        for (let j = 0; profileSkills.length && j < profileSkills.length; ++j) {
            if (!profilesMap[profileSkills[i].profile_id]) {
                profilesMap[profileSkills[i].profile_id] = {};
                profilesMap[profileSkills[i].profile_id].id = profileSkills[i].profile.id;
                profilesMap[profileSkills[i].profile_id].name = profileSkills[i].profile.name;
                profilesMap[profileSkills[i].profile_id].skills = [];
            }
            if (!profilesMap[profileSkills[i].profile_id].skills.includes(profileSkills[i].skill))
                profilesMap[profileSkills[i].profile_id].skills.push(profileSkills[i].skill);
        }
        Object.keys(profilesMap).forEach((value) => {
            return beautyVacancy.profiles.push(profilesMap[value]);
        });
        beautyVacancies.push(beautyVacancy);
    }
    return beautyVacancies;
}

module.exports.func = (router) => {

    router.post('/vacancy/create', async (req, res) => {
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
                        profileSkillId: profileSkill.id
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

    router.get('/vacancy', async (req, res) => {
        let company = await companyService.findByUserId(req.user.id);
        let vacancies = await vacancyService.findAllByCompanyId(company.id);
        res.send(buildVacancies(vacancies));
    });


    router.get('/vacancy/recommended', async (req, res) => {
        let recommendedVacancies = await vacancyService.getRecommended();
        res.json(recommendedVacancies);
    });

    return router;

};