const models = require('../../../core/models');
const Employees = models.employees;
const Vacancies = models.vacancies;


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
     * @param userId
     * @param vacancyId
     * @returns {Promise<void>}
     */
    async attachVacancy(userId, vacancyId) {
        let employee = await this.getByUserId(userId);
        await employee.addVacancy(vacancyId);
    }
    
    /**
     * получить все вакансии на которые откликнулся чувак
     * @param userId
     * @returns {Promise<void>}
     */
    async getAwaitedContracts(userId) {
        let vacancies = await Vacancies.findAll({
            include: [{
                model: models.companies
            }, {
                attributes: [],
                required: true,
                model: models.employees,
                where: {
                    user_id: {[Op.eq]: userId}
                }
            }]
        });
        return vacancies;
        
    }
}

if (typeof instance !== EmployeesService) {
    instance = new EmployeesService();
}

module.exports = instance;