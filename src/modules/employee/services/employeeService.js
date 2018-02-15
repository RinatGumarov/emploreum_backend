const models = require('../../../core/models');
const Employees = models.employees;

const companyService = require('../../company/services/companyService');
const chatService = require('../../message/services/chatService');
const messageService = require('../../message/services/messageService');

const Op = models.sequelize.Op;

let instance;

class EmployeesService {

    /**
     * сохранение работника и создание для него
     * резюме с определенными специализациями
     * @param userId
     * @param profiles
     */
    async save(userId) {

        let savedEmployees = await Employees.findOrCreate({
            where: {
                user_id: {[Op.eq]: userId}
            },
            defaults: {
                user_id: userId
            }
        });

        return savedEmployees[0]
    }

    /**
     * @param userId
     * @param params
     * @returns {Promise<*>}
     */
    async update(userId, params) {
        return await
            Employees.update(params, {
                where: {
                    user_id: {[Op.eq]: userId}
                }
            })
    }

    /**
     * @param userId
     * @returns {Promise<Model>}
     */
    async getByUserId(userId) {
        let employee = await Employees.findOne({
            where: {
                user_id: {[Op.eq]: userId}
            }
        });
        return employee;
    }

    /**
     * Прикрепить работника к вакансии по нажатию "Откликнуться".
     * @param employee
     * @param vacancyId
     * @returns {Promise<void>}
     */
    async attachVacancy(employee, vacancyId) {
        await employee.addVacancy(vacancyId);
        let company = await companyService.findByVacancyId(vacancyId);
        let chat = await chatService.save(company.id, employee.id);
        await messageService.sendToCompany(company.id, employee.id, "Вам постучались на вакансию")
    }
}

if (typeof instance !== EmployeesService) {
    instance = new EmployeesService();
}

module.exports = instance;