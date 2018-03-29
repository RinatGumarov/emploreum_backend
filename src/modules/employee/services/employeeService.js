const models = require('../../../core/models');

const Vacancies = models.vacancies;

const Account = require('../../blockchain/utils/account');
const employeeUtil = require('../../blockchain/utils/employee');

const Employees = models.employees;
const Works = models.works;

const Web3InitError = require('../../blockchain/utils/Web3Error');
const blockchainEmployeeUtil = require('../../blockchain/utils/employee');
const Op = models.sequelize.Op;
const _ = require('lodash');


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

        return Account.registerEmployee(blockchainEmployee)
            .then(contract => {
                if (!contract)
                    throw new Web3InitError('Could not register employee in blockchain');

                employee.contract = contract.address;
                employee.save();
                return contract;
            });
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

    async addRatingToSkills(employeeUserId, employeeSkills) {
        const address = (await this.getByUserId(employeeUserId)).contract;

        for (let profile of employeeSkills) {
            const promises = profile.skills.map(skill => {
                skill.dataValues.rating = 0;
                if (address) {
                    const skillCode = skillUtil.generateSkillCode(profile.profileId, skill.id);
                    return blockchainEmployeeUtil.getSkillRatingBySkillCode(address, skillCode)
                        .then(rating => {
                            skill.dataValues.rating = rating;
                            return skill;
                        });
                } else Promise.resolve(skill);
            });
            profile.skills = await Promise.all(promises);
        }
    }
    
}

instance = new EmployeesService();
module.exports = instance;