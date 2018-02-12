const models = require('../../../core/models');
const Vacancies = models.vacancies;
const Companies = models.companies;
const ProfileSkills = models.profile_skills;
const VacancyProfileSkills = models.vacancy_profile_skills;
const queryScanner = require('../../../core/queryScanner');
const logger = require('../../../utils/logger');
const Op = models.sequelize.Op;

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
                        attributes: ['id', 'name'],
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

    async getRecommended(userId) {
        let queryStr = queryScanner.company.recommended_vacancies;
        return models.sequelize.query(queryStr,
            {
                replacements: {skillsString: '1,2,3'},
                type: models.sequelize.QueryTypes.SELECT,
                model: Vacancies
            })
    }
}

if (typeof instance !== VacanciesService) {
    instance = new VacanciesService();
}

module.exports = instance;