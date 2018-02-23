const models = require("../../../core/models");
const Account = require("../../blockchain/utils/account");

const Employees = models.employees;
const Works = models.works;
const blockchainInfo = require('../../blockchain/services/blockchainEventService');
const _ = require('lodash');
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

    async getById(employeeId) {
        return await Employees.findById(employeeId);
    }

    async findAll() {
        let employees = await Employees.findAll({
            include: [{
                model: models.cvs,
                attributes: ["id"],
                include: [{model: models.profiles, attributes: ["name"]}, {model: models.skills, attributes: ["name"]}],
            }],
            attributes: ["user_id", "name", "surname", "photo_path", "city", "birthday"]
        });

        employees = await employees.map((employee) => {
            if (employee.birthday)
                employee.age = new Date().getFullYear() - employee.birthday.getFullYear();
            let skills = [];
            let specifications = [];
            for (let i = 0; i < employee.cvs.length; ++i) {
                for (let j = 0; j < employee.cvs[i].skills.length; ++j){
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

}

if (typeof instance !== EmployeesService) {
    instance = new EmployeesService();
}

module.exports = instance;