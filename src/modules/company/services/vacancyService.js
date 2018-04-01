const models = require('../../../core/models');
const Vacancies = models.vacancies;
const Employees = models.employees;
const VacancyEmployees = models.vacancyEmployees;
const ProfileSkills = models.profileSkills;
const Profiles = models.profiles;
const VacancyProfileSkills = models.vacancyProfileSkills;
const testService = require('../../test/services/testService');

const queryScanner = require('../../../core/queryScanner');
const employeeService = require('../../employee/services/employeeService');
const messageService = require('../../message/services/messageService');
const companyService = require('./companyService');
const socketSender = require('../../../core/socketSender');


const Op = models.sequelize.Op;

let instance;

class VacancyService {
    
    async save(params) {
        return await Vacancies.create(params);
    }
    
    async addProfileSkillToVacancy(options) {
        return await VacancyProfileSkills.create(options)
    }
    
    async findAllOpenVacancies(company) {
        let vacancies = await Vacancies.findAll({
            where: {
                companyId: {
                    [Op.eq]: company.id,
                    
                },
                opened: {
                    [Op.eq]: true
                }
            }
        });
        
        return await this.initSpecificationsFromVacancies(vacancies);
        
    }
    
    /**
     * toDo
     * @param vacancies
     * @returns {Promise<*>}
     */
    async initSpecificationsFromVacancies(vacancies) {
        for (let i = 0; vacancies.length && i < vacancies.length; ++i) {
            let profiles = await this.getVacancySpecification(vacancies[i].id);
            vacancies[i].dataValues.profiles = profiles;
        }
        return vacancies;
    };
    
    
    async findById(id) {
        return await Vacancies.findOne({
            where: {
                id: {
                    [Op.eq]: id
                }
            },
            include: [{
                model: models.companies
            }]
        });
    }
    
    /**
     * найти все профили и скилы вакансии
     * @param vacancyId
     * @returns {Promise<Array<Model>>}
     */
    async getVacancySpecification(vacancyId) {
        let queryStr = queryScanner.company.vacancy_specifications;
        return await queryScanner.query(queryStr, {
            model: models.profiles,
            include: [models.skills],
            replacements: {
                vacancyId: vacancyId
            },
        });
    }
    
    /**
     * получить всех кто постучался
     * @param vacancyId
     * @returns {Promise<*>}
     */
    async getCandidatesByVacancyId(vacancyId) {
        let candidates = await Employees.findAll({
            attributes: ["name", "photoPath"],
            include: [{
                model: models.users,
                attributes: ['id']
            }, {
                attributes: [],
                required: true,
                model: models.vacancies,
                where: {
                    id: {[Op.eq]: vacancyId}
                }
            }]
        });
        return candidates;
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
                employeeId: {[Op.eq]: employeeId},
                vacancyId: {[Op.eq]: vacancyId}
            }
        });
        let company = await companyService.findByVacancyId(vacancyId);
        socketSender.sendSocketMessage(`${userId}:vacancy`, {
            type: 'DELETE',
            id: vacancyId
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
                    [Op.eq]: vacancyId
                }
            },
            include: [{
                model: models.employees,
                required: false,
                where: {
                    id: {
                        [Op.eq]: employeeId
                    }
                }
            }]
        });
        if (vacancy.employees.length !== 0)
            return 'submitted';
        if (vacancy.testId === null)
            return 'available';
        else {
            let testEnds = await testService.findTestEnds(employee.id, vacancy.testId);
            if (testEnds === null)
                return 'start';
            else {
                // если тест уже засабмитили то надо бы ему махнуть ends time
                if (!(testEnds.ends === null || testEnds.ends > new Date())) {
                    let testScore = await models.testScores.findOne({
                        where: {
                            [Op.and]: {
                                employeeId: {
                                    [Op.eq]: employee.id,
                                },
                                testId: {
                                    [Op.eq]: vacancy.testId,
                                }
                            }
                        }
                    });
                    if (testScore && testScore.passed)
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
        if (vacancy.companyId !== company.id) {
            return false;
        }
        await socketSender.sendSocketMessage(`${employee.userId}:invitation`, vacancy);
        let userOwnerForSendMessage = await company.getUser();
        let userFromForSendMessage = await employee.getUser();
        await messageService.sendMessage(
            userOwnerForSendMessage,
            userFromForSendMessage,
            "We'd like to invite you for a job"
        );
        return true;
    }
    
    
}

instance = new VacancyService();
module.exports = instance;