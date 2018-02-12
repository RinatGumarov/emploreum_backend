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
        return await VacancyProfileSkills.create(
            options
        )
    }

    async findAllByCompanyId(companyId) {
        return await Vacancies.findAll({
            include: [{
                model: ProfileSkills,
                include: [
                    {
                        model: models.profiles
                    },
                    {
                        model: models.skills
                    }
                ],
            }],
            where: {
                company_id: {
                    [Op.eq]: companyId,
                }
            }
        });
    }
}

if (typeof instance !== VacanciesService) {
    instance = new VacanciesService();
}

module.exports = instance;