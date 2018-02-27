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
     * @param userId
     * @param params
     * @returns {Promise<*>}
     */
    async update(employee, params) {
        return await employee.update(params)
    }
    
    /**
     * получить инфо о работнике по его id
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
    async attachVacancy(employee, vacancyId) {
        await employee.addVacancy(vacancyId);
    }
    
    /**
     * работает или нет в данный момнет
     * @param employee
     * @returns {Promise<boolean>}
     */
    async wasWorking(employee) {
        let works = employee.works();
        return works !== null;
    }
    
    /**
     * получить все вакансии на которые откликнулся чувак
     * @param userId
     * @returns {Promise<void>}
     */
    async getAwaitedContracts(employee) {
        let vacancies = await employee.vacancies();
        return vacancies;
        
    }
    
    /**
     * создает контракт для работника в блокчейн
     * @param employee
     * @param purseAddress
     * @returns {Promise<Contract>}
     */
    async createBlockchainAccountForEmployee(employee, purseAddress, socketAddress) {
        let blockchainEmployee = {
            firstName: employee.name,
            lastName: employee.surname,
            email: employee.email,
            address: purseAddress,
        };
        await blockchainInfo.set(socketAddress, `employee${purseAddress}`, `creating contract for employee ${employee.name}`);
        let contract = await Account.registerEmployee(blockchainEmployee);
        if (!contract) {
            throw new Web3InitError("Could not register employee in blockchain");
        }
        await blockchainInfo.unset(socketAddress, `employee${purseAddress}`);
        employee.contract = contract.address;
        employee.save();
        return contract;
    }
    
    async getById(employeeId) {
        return await Employees.findById(employeeId);
    }
    
}

instance = new EmployeesService();
module.exports = instance;