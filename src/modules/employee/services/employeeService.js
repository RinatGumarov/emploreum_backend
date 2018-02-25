const models = require("../../../core/models");
const Account = require("../../blockchain/utils/account");

const Employees = models.employees;
const Works = models.works;
const blockchainInfo = require('../../blockchain/services/blockchainEventService');
const socketSender = require('../../../core/socketSender');
const logger = require('../../../utils/logger');

const Web3InitError = require("../../blockchain/utils/Web3Error");
const Op = models.sequelize.Op;

let instance;

/**
 * класс работника
 */
class EmployeesService {
    
    /**
     * сохранение работника и создание для него
     * резюме с определенными специализациями
     * @param userId
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
     * обновить рабоника
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
     * получить работника по юзеру
     * @param userId
     * @returns {Promise<Model>}
     */
    async getByUserId(userId) {
        let employee = await Employees.findOne({
            where: {
                user_id: {[Op.eq]: userId}
            },
            include: [models.users]
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
     * работает ли работник
     * @param employeeId
     * @returns {Promise<boolean>}
     */
    async wasWorking(employeeId) {
        let works = await Works.find({
            where: {
                employee_id: {
                    [Op.eq]: employeeId,
                },
            },
        });
        return works !== null;
    }
    
    /**
     * получить все вакансии на которые откликнулся чувак
     * @param userId
     * @returns {Promise<void>}
     */
    async getAwaitedContracts(userId) {
        let vacancies = await models.vacancies.findAll({
            include: [{
                model: models.companies
            }, {
                attributes: [],
                required: true,
                model: models.employees,
                where: {
                    user_id: {[Op.eq]: userId},
                }
            }]
        });
        return vacancies;
        
    }
    
    /**
     * создание контракта работника в блокчейна
     * @param companyUserId
     * @param employee
     * @param firstName
     * @param lastName
     * @param email
     * @param address
     * @returns {Promise<Contract>}
     */
    async createBlockchainAccountForEmployee(companyUserId, employee, firstName, lastName, email, address) {
        let blockchainEmployee = {
            firstName,
            lastName,
            email,
            address,
        };
        await blockchainInfo.set(companyUserId, `employee${address}`, `creating contract for employee ${firstName}`);
        let contract = await Account.registerEmployee(blockchainEmployee).then(async (result) => {
            if (!result)
                throw new Web3InitError("Could not register employee in blockchain");
            await blockchainInfo.unset(companyUserId, `employee${address}`);
            return result;
        });
        employee.contract = contract.address;
        employee.save();
        return contract;
    }
    
    /**
     * получить работника по его id
     * @param employeeId
     * @returns {Promise<*>}
     */
    async getById(employeeId) {
        return await Employees.findById(employeeId);
    }
    
}

instance = new EmployeesService();
module.exports = instance;