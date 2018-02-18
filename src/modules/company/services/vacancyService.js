const models = require('../../../core/models');
const Vacancies = models.vacancies;
const Companies = models.companies;
const Employees = models.employees;
const VacancyEmployees = models.vacancy_employees;
const ProfileSkills = models.profile_skills;
const Profiles = models.profiles;
const VacancyProfileSkills = models.vacancy_profile_skills;

const queryScanner = require('../../../core/queryScanner');
const employeeService = require('../../employee/services/employeeService');
const messageService = require('../../message/services/messageService');
const skillService = require('../../specialisation/services/skillService');

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
     * @param userId
     * @returns {Promise<*>}
     */
    async getRecommended(userId) {
        let skills = await skillService.getEmployeeSkills(userId);
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
    
    /**
     * получить всех кто постучался
     * @param vacancyId
     * @returns {Promise<*>}
     */
    async getCandidatesByVacancyId(vacancyId) {
        let candidates = await Employees.findAll({
            
            include: [models.users, {
                attributes: [],
                required: true,
                model: models.vacancies,
                where: {
                    id: {[Op.eq]: vacancyId}
                }
            }]
        });
        return candidates
    }
    
    /**
     * отклонить постучавщегося кандидата
     * @param vacancyId
     * @param userId
     * @returns {Promise<boolean>}
     */
    async rejectCandidatesByVacancyId(vacancyId, userId) {
        let employee = await employeeService.getByUserId(userId);
        let employeeId = employee.id;
        let vacancyEmployees = await VacancyEmployees.destroy({
            where: {
                employee_id: {[Op.eq]: employeeId},
                vacancy_id: {[Op.eq]: vacancyId}
            }
        });
        let company = await companyService.findByVacancyId(vacancyId);
        await messageService.sendToEmployee(company.user_id, userId, "вам отклонили в вакансии");
        return true;
    }
    
    /**
     * может ли данный емплой постучаться на вакансию
     * @param vacancyId
     * @param userId
     * @returns {Promise<boolean>}
     */
    async isAvailable(vacancyId, userId) {
        let employee = await employeeService.getByUserId(userId);
        let employeeId = employee.id;
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
                id: {
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