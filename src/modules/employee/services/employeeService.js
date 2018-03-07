const models = require('../../../core/models');
const Vacancies = models.vacancies;
const Account = require('../../blockchain/utils/account');
const employeeUtil = require('../../blockchain/utils/employee');

const Employees = models.employees;
const Works = models.works;
const blockchainInfo = require('../../blockchain/services/blockchainEventService');
const _ = require('lodash');
const socketSender = require('../../../core/socketSender');
const logger = require('../../../utils/logger');

const Web3InitError = require('../../blockchain/utils/Web3Error');
const web3 = require('../../blockchain/utils/web3');
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
                userId: {[Op.eq]: userId}
            },
            defaults: {
                userId: userId
            }
        });

        return savedEmployees[0];
    }

    /**
     * обновить работника
     * @param userId
     * @param params
     * @returns {Promise<*>}
     */
    async update(employee, params) {
        return await employee.update(params);
    }
    
    /**
     * получить работника по юзеру
     * @param userId
     * @returns {Promise<Model>}
     */
    async getByUserId(userId) {
        let employee = await Employees.findOne({
            where: {
                userId: {[Op.eq]: userId}
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
     * получить все вакансии на которые откликнулся чувак
     * @returns {Promise<void>}
     */
    async getAwaitedContracts(employee) {
        let vacancies = await Vacancies.findAll({
            include: [{
                model: models.companies
            }, {
                attributes: [],
                required: true,
                model: models.employees,
                where: {
                    id: {[Op.eq]: employee.id},
                }
            }]
        });
        return vacancies;

    }

    /**
     * создание контракта работника в блокчейна
     * @param employee
     * @returns {Promise<Contract>}
     */
    createBlockchainAccountForEmployee(employee) {
        let blockchainEmployee = {
            firstName: employee.name,
            lastName: employee.name,
            email: employee.user.email,
            address: employee.user.accountAddress
        };

        return Account.registerEmployee(blockchainEmployee).then(contract => {
            if (!contract)
                throw new Web3InitError('Could not register employee in blockchain');

            employee.contract = contract.address;
            employee.save();
            return contract;
        });
    }


    async findAllEmployees() {
        let employees = await Employees.findAll({
            include: [{
                model: models.cvs,
                attributes: ['id'],
                include: [
                    {
                        model: models.profiles,
                        attributes: ['name']
                    },
                    {
                        model: models.skills,
                        attributes: ['name']
                    }
                ]
            }, {
                model: models.works,
                attributes: ['id'],
                include: [{
                    model: models.companies,
                    attributes: ['name']
                }, {
                    model: models.vacancies,
                    attributes: ['name']
                }]
            }],
            attributes: ['userId', 'name', 'surname', 'photoPath', 'city', 'birthday']
        });

        employees = await employees.map((employee) => {
            if (employee.birthday)
                employee.age = new Date().getFullYear() - employee.birthday.getFullYear();
            let skills = [];
            let specifications = [];
            for (let i = 0; i < employee.cvs.length; ++i) {
                for (let j = 0; j < employee.cvs[i].skills.length; ++j) {
                    skills.push(employee.cvs[i].skills[j].name);
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
                    employeeId: {
                        [Op.eq]: employee.id,
                    },
                    status: {
                        [Op.or]: {
                            [Op.eq]: -200,
                            [Op.eq]: -500
                        }
                    }
                }
            }
        });
    }

    async countCurrentWorks(employee) {
        return await Works.count({
            where: {
                [Op.and]: {
                    employeeId: {
                        [Op.eq]: employee.id,
                    },
                    status: {
                        [Op.and]: {
                            [Op.gt]: -2,
                            [Op.lt]: 7
                        }
                    }
                }
            }
        });
    }

    async findCurrentWorksWithVacancies(employee) {
        return await Works.findAll({
            where: {
                [Op.and]: {
                    employeeId: {
                        [Op.eq]: employee.id,
                    },
                    status: {
                        [Op.and]: {
                            [Op.gt]: -2,
                            [Op.lt]: 7
                        }
                    }
                }
            },
            include: [{
                model: models.vacancies
            }]
        });
    }

    async getIncome(employee) {
        let currentContracts = await this.findCurrentWorksWithVacancies(employee);
        let result = 0;
        for (let contract of currentContracts) {
            result += contract.vacancy.weekPayment;
        }
        return parseFloat(result.toFixed(10));
    }

    async getRating(id) {
        let address = await this.getByUserId(id);

        return await employeeUtil.calculateRating(address.contract);
    }
}

instance = new EmployeesService();
module.exports = instance;