const models = require("../../../core/models");
const Account = require("../../blockchain/utils/account");

const Employees = models.employees;
const Works = models.works;
const blockchainInfo = require('../../blockchain/services/blockchainEventService');
const workService = require('../../work/services/workService');
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
    

    async findAll() {
        let employees = await Employees.findAll({
            include: [{
                model: models.cvs,
                attributes: ["id"],
                include: [{model: models.profiles, attributes: ["name"]}, {model: models.skills, attributes: ["name"]}],
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

    async countEndedWorks(employeeId) {
        return await models.works.count({
            where: {
                [Op.and]: {
                    employee_id: {
                        [Op.eq]: employeeId,
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

    async countCurrentWorks(employeeId) {
        return await models.works.count({
            where: {
                [Op.and]: {
                    employee_id: {
                        [Op.eq]: employeeId,
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

    async findCurrentWorksWithVacancies(employeeId) {
        return await models.works.findAll({
            where: {
                [Op.and]: {
                    employee_id: {
                        [Op.eq]: employeeId,
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

    async getIncome(employeeId) {
        let currentContracts = await this.findCurrentWorksWithVacancies(employeeId);
        let result = 0;
        for (let contract of currentContracts) {
            result += contract.vacancy.week_payment;
        }
        return result;
    }

    async getBalance(user) {
        return await web3.eth.getBalance(user.account_address);
    }

}

instance = new EmployeesService();
module.exports = instance;