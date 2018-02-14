const models = require('../../../core/models');
const Employees = models.employees;
const logger = require('../../../utils/logger');

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
    async attachVacancy(employee, vacancyId){
        await employee.addVacancy(vacancyId);
    }

    async wasWorking(employeeId){
        let works = await models.works.find({
            where: {
                employee_id: {
                    [Op.eq]: employeeId,
                },
            },
        });
        return works !== null;
    }

    async createBlockchainAccountForEmployee(firstName, lastName, rating, email, accountAddress){
        let blockchainEmployee = {
            firstName,
            lastName,
            email,
            raiting,
            address: req.user.account_address,
            positionCodes: [],
            skillCodes: [],
            skillToPosition: [],
        };
        await Account.registerEmployee(blockchainEmployee).then(result => {
            if (!result)
                throw new Web3InitError('Could not registrate employee in blockchain');
        });
    }

}

if (typeof instance !== EmployeesService) {
    instance = new EmployeesService();
}

module.exports = instance;