const models = require('../../../core/models');
const Vacancies = models.vacancies;
const Companies = models.companies;
const ProfileSkills = models.profile_skills;
const Profiles = models.profiles;
const VacancyProfileSkills = models.vacancy_profile_skills;

const queryScanner = require('../../../core/queryScanner');
const employeeService = require('../../employee/services/employeeService');
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
    
    async findById(id) {
        let vacancy = await Vacancies.findOne({
            where: {
                id: {
                    [Op.eq]: id,
                }
            }
        })
        
        return vacancy;
    }
    
    async findAll(companyId) {
        
        let option = {where: {}};
        
        if (companyId) {
            option.where.company_id = {
                [Op.eq]: companyId,
            }
        }
        
        // преобразовыываем в нормалььный вид
        let vacancies = await Vacancies.findAll(option);
        
        // преобразовывем в человечиский вид)
        for (let i = 0; vacancies.length && i < vacancies.length; ++i) {
            
            let profiles = await this.getVacancyProfiles(vacancies[i].id);
            vacancies[i].dataValues.profiles = profiles;
        }
        
        return vacancies;
        
    }
    
    /**
     * //toDo
     * метод получения рекомендуемых вакансий по профилю работника
     * Добавить обработку в скрипте array_positions
     * для выявления сходства направления скила работника и направления
     * скила вакансии
     * @param skills
     * @param userId
     * @returns {Promise<*>}
     */
    async getRecommended(skills, userId) {
        let employee = await employeeService.getByUserId(userId);
        let employeeId = employee.id;
        let skillsIds = skills.map((skill) => {
            return skill.id
        });
        
        let queryStr = queryScanner.company.recommended_vacancies;
        let vacancies = await models.sequelize.query(queryStr,
            {
                replacements: {
                    skillsString: skillsIds.join(",")
                },
                type: models.sequelize.QueryTypes.SELECT,
                model: Vacancies,
                include: [models.companies]
            });
        
        return vacancies;
    }

    async findById(id){
        return await Vacancies.findById(id);
    }
    
    /**
     * найти все профили и скилы вакансии
     * @param vacancyId
     * @returns {Promise<Array<Model>>}
     */
    async getVacancyProfiles(vacancyId) {
        let profiles = await Profiles.findAll({
            include: [
                {
                    model: models.skills,
                    include: [{
                        attributes: [],
                        required: true,
                        model: models.profile_skills,
                        as: 'profile_skills_trough',
                        include: [{
                            attributes: [],
                            required: true,
                            model: models.vacancies,
                            where: {
                                id: {[Op.eq]: vacancyId}
                            }
                        }]
                    }]
                },
                {
                    attributes: [],
                    required: true,
                    model: models.profile_skills,
                    as: 'profile_skills_trough',
                    include: [{
                        attributes: [],
                        required: true,
                        model: models.vacancies,
                        where: {
                            id: {[Op.eq]: vacancyId}
                        }
                    }]
                }
            ]
        });
        return profiles;
    }

    async isAvailable(vacancyId, employeeId){
        let vacancy = await Vacancies.findById(vacancyId);
        let result = await Vacancies.findOne({
            include: [{
                model: models.employees,
                where: {
                    id: {
                        [Op.eq]: employeeId,
                    }
                }
            }],
            where: {
                id : {
                    [Op.eq]: vacancyId,
                }
            }
        });
        return result === null;
    }
}

if (typeof instance !== VacanciesService) {
    instance = new VacanciesService();
}

module.exports = instance;