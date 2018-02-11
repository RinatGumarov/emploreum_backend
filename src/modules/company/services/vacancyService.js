const models = require('../../../core/models');
const Vacancies = models.vacancies;
const Companies = models.companies;
const ProfileSkills = models.profile_skills;
const VacancyProfileSkills = models.vacancy_profile_skills;
const logger = require('../../../utils/logger');
const Op = require('sequelize').Op;
const profilesService = require('../../specialisation/services/profilesService');
const skillsService = require('../../specialisation/services/skillsService');
const companyService = require('../services/companyService');

let instance;

class VacanciesService {

    async save(params) {
        return await Vacancies.create(params);
    }

    async findProfileSkill(profileId, skillId) {
        return await ProfileSkills.findOne({
            where: {
                profile_id: {
                    [Op.eq]: profileId,
                },
                skill_id: {
                    [Op.eq]: skillId,
                }
            }
        });
    }

    async addProfileSkillToVacancy(options) {
        // let profiles = options.profiles;
        // let info = options.info;
        // let name = options.name;
        // let pricePerWeek = options.pricePerWeek;
        // let duration = options.duration;
        // let company = await companyService.findByUserId(userId);
        // let vacancy = await Vacancies.create({
        //     company_id: company.id,
        //     name: name,
        //     info: info,
        //     duration: duration,
        //     pricePerWeek: pricePerWeek,
        // });
        // await Object.keys(profiles).forEach(async (profile) => {
        //     await profiles[profile].forEach(async (skill) => {
        //         let profileId = (await profilesService.findOneByName(profile)).id;
        //         let skillId = (await skillsService.findByName(skill)).id;
        //         let ps = await ProfileSkills.findOne({
        //             where: {
        //                 profile_id: {
        //                     [Op.eq]: profileId,
        //                 },
        //                 skill_id: {
        //                     [Op.eq]: skillId,
        //                 }
        //             }
        //         });
        return await VacancyProfileSkills.create(
            options
        //     {
        //     vacancy_id: vacancy.id,
        //     profile_skill_id: ps.id
        // }
        );
        //         logger.log(vps);
        //     });
        // });
        // logger.log(`created vacancy ${vacancy.name}`);
        // return vacancy;
    }

}

if (typeof instance !== VacanciesService) {
    instance = new VacanciesService();
}

module.exports = instance;