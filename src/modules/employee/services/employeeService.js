const models = require("../../../core/models");
const Account = require("../../blockchain/utils/account");

const Employees = models.employees;
const Works = models.works;
const blockchainInfo = require('../../blockchain/services/blockchainEventService');
const _ = require('lodash');
const socketSender = require('../../../core/socketSender');
const logger = require('../../../utils/logger');

const Web3InitError = require("../../blockchain/utils/Web3Error");
const web3 = require("../../blockchain/utils/web3");
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
    async update(employee, params) {
        return await employee.update(params)
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
        let vacancies = await employee.getVacancies();
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
    
    /**
     * получить работника по его id
     * @param employeeId
     * @returns {Promise<*>}
     */
    async getById(employeeId) {
        return await Employees.findById(employeeId);
    }
    
    async findAll() {
        let employees = await Employees.findAll({
            include: [{
                model: models.cvs,
                attributes: ["id"],
                include: [
                    {
                        model: models.profiles,
                        attributes: ["name"]
                    },
                    {
                        model: models.skills,
                        attributes: ["name"]
                    }
                ],
            }, {
                model: models.works,
                attributes: ["id"],
                include: [{
                    model: models.companies,
                    attributes: ["name"],
                }, {
                    model: models.vacancies,
                    attributes: ["name"],
                }]
            }],
            attributes: ["user_id", "name", "surname", "photo_path", "city", "birthday"]
        });
        
        employees = await employees.map((employee) => {
            if (employee.birthday)
                employee.age = new Date().getFullYear() - employee.birthday.getFullYear();
            let skills = [];
            let specifications = [];
            for (let i = 0; i < employee.cvs.length; ++i) {
                for (let j = 0; j < employee.cvs[i].skills.length; ++j) {
                    skills.push(employee.cvs[i].skills[j].name)
                }
                specifications.push(employee.cvs[i].profile.name);
            }
            employee.dataValues.skills = _.uniq(skills);
            employee.dataValues.specifications = _.uniq(specifications);
            delete employee.dataValues.cvs;
            return employee;
        });
        return employees;
    }
    
    async countEndedWorks(employee) {
        return await Works.count({
            where: {
                [Op.and]: {
                    employee_id: {
                        [Op.eq]: employee.id,
                    },
                    status: {
                        [Op.or]: {
                            [Op.eq]: -200,
                            [Op.eq]: -500,
                        }
                    }
                }
            }
        })
    }
    
    async countCurrentWorks(employee) {
        return await Works.count({
            where: {
                [Op.and]: {
                    employee_id: {
                        [Op.eq]: employee.id,
                    },
                    status: {
                        [Op.and]: {
                            [Op.gt]: -2,
                            [Op.lt]: 7,
                        }
                    }
                }
            }
        })
    }
    
    async findCurrentWorksWithVacancies(employee) {
        return await Works.findAll({
            where: {
                [Op.and]: {
                    employee_id: {
                        [Op.eq]: employee.id,
                    },
                    status: {
                        [Op.and]: {
                            [Op.gt]: -2,
                            [Op.lt]: 7,
                        }
                    }
                }
            },
            include: [{
                model: models.vacancies,
            }],
        })
    }
    
    async getIncome(employee) {
        let currentContracts = await this.findCurrentWorksWithVacancies(employee);
        let result = 0;
        for (let contract of currentContracts) {
            result += contract.vacancy.week_payment;
        }
        return parseFloat(result.toFixed(10));
    }
}

instance = new EmployeesService();
module.exports = instance;