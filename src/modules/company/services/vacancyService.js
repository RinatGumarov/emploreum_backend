const models = require('../../../core/models');
const Vacancies = models.vacancies;
const Employees = models.employees;
const VacancyEmployees = models.vacancy_employees;
const ProfileSkills = models.profile_skills;
const Profiles = models.profiles;
const VacancyProfileSkills = models.vacancy_profile_skills;
const testService = require('../../test/services/testService');

const queryScanner = require('../../../core/queryScanner');
const employeeService = require('../../employee/services/employeeService');
const messageService = require('../../message/services/messageService');
const companyService = require('./companyService');
const skillService = require('../../specialisation/services/skillService');
const socketSender = require('../../../core/socketSender');


const Op = models.sequelize.Op;

let instance;

class VacanciesService {

    async save(params) {
        return await Vacancies.create(params);
    }

    async addProfileSkillToVacancy(options) {
        return await VacancyProfileSkills.create(
            options
        )
    }

    async findAllVacanciesByCompany(company) {

        let option = {where: {}};

        if (company) {
            option.where.company_id = {
                [Op.eq]: company.id,
            }
        }

        option.where.opened = true;

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
     * @returns {Promise<*>}
     * @param employee
     */
    async getRecommendedVacancies(employee) {
        let skills = await skillService.getEmployeeSkills(employee);
        let skillsIds = skills.map((skill) => {
            return skill.id
        });

        let queryStr = queryScanner.company.recommended_vacancies;
        return await models.sequelize.query(queryStr,
            {
                replacements: {
                    skillsString: skillsIds.join(",")
                },
                type: models.sequelize.QueryTypes.SELECT,
                model: Vacancies,
                include: [models.companies]
            });
    }

    async findById(id) {
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

    /**
     * получить всех кто постучался
     * @param vacancyId
     * @returns {Promise<*>}
     */
    async getCandidatesByVacancyId(vacancyId) {
        let candidates = await Employees.findAll({
            attributes: ["name", "photo_path"],
            include: [{
                model: models.users,
                attributes: ["id"]
            }, {
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
     * Удалить связть вакансии и работника
     * @param vacancyId
     * @param userId
     * @returns {Promise<boolean>}
     */
    async deleteAwaitedContractByVacancyId(vacancyId, userId) {
        let employee = await employeeService.getByUserId(userId);
        let employeeId = employee.id;
        let vacancyEmployees = await VacancyEmployees.destroy({
            where: {
                employee_id: {[Op.eq]: employeeId},
                vacancy_id: {[Op.eq]: vacancyId}
            }
        });
        let company = await companyService.findByVacancyId(vacancyId);
        await messageService.sendToEmployee(company, employee.id, "вам отклонили в вакансии");
        socketSender.sendSocketMessage(`${userId}:vacancy`, {
            type: "DELETE",
            id: vacancyId,
        });
        return true;
    }

    /**
     * может ли данный емплой постучаться на вакансию
     * @param vacancyId
     * @param userId
     * @returns {Promise<string>} state of vacancy: Available, submitted, start, continue, failed
     */
    async isAvailable(vacancyId, userId) {
        let employee = await employeeService.getByUserId(userId);
        let employeeId = employee.id;
        let vacancy = await Vacancies.findOne({
            where: {
                id: {
                    [Op.eq]: vacancyId,
                }
            },
            include: [{
                model: models.employees,
                required: false,
                where: {
                    id: {
                        [Op.eq]: employeeId,
                    }
                }
            }]
        });
        if (vacancy.employees.length !== 0 )
            return 'submitted';
        if (vacancy.test_id === null)
            return 'available';
        else {
            let testEnds = await testService.findTestEnds(employee.id, vacancy.test_id);
            if (testEnds === null)
                return 'start';
            else {
                // если тест уже засабмитили то надо бы ему махнуть ends time
                if (testEnds.dataValues.ends !== null && testEnds.dataValues.ends < new Date()) {
                    if ((2 + 2) === 4)
                        return 'available';
                    else
                        return 'failed';
                } else
                    return 'continue';
            }
        }
    }

    async sendInvitationToEmployee(company, vacancy, employeeUserId) {
        let employee = await employeeService.getByUserId(employeeUserId);
        if (vacancy.company_id !== company.id) {
            throw Error('You are not provided to invite employee to another\'s vacancy');
        }
        await messageService.sendToEmployee(company, employee.id, "You have new invitation to vacancy");
        await socketSender.sendSocketMessage(`${employee.user_id}:invitation`, vacancy);
    }


}

instance = new VacanciesService();
module.exports = instance;