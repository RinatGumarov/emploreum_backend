const models = require('../../../core/models');
const Works = models.works;
const blockchainWork = require('../utils/work');
const socketSender = require('../../../core/socketSender');
const blockchainInfo = require('./blockchainEventService');
const companyService = require('../../company/services/companyService');
const vacancyService = require('../../company/services/vacancyService');

const Web3InitError = require('../utils/Web3Error');
const Account = require('../utils/account');
const web3 = require('../utils/web3');
const logger = require('../../../utils/logger');

const Op = models.sequelize.Op;

let instance;

class WorkService {
    
    async save(workData) {
        let work = await Works.create(workData);
        await this.startWork(work.id);
        return work;
    }
    
    async findAllByEmployeeId(employeeId) {
        let works = await Works.findAll({
            include: [{
                attributes: ["name"],
                model: models.companies
            }, {
                model: models.vacancies,
                attributes: ["week_payment"]
            }],
            where: {
                employee_id: {
                    [Op.eq]: employeeId
                }
            }
        });
        return works;
    }
    
    //toDo
    async createWork(vacancyId, employee, company) {
        let vacancy = await vacancyService.findById(vacancyId);
        let begin = new Date();
        let end = new Date().setMonth(begin.getMonth() + vacancy.duration);
        
        let workData = {
            vacancy_id: vacancy.id,
            begin_date: begin,
            end_date: end,
            employee_id: employee.id,
            company_id: company.id,
            status: 0,
        };
        let blockchainWorkData = {
            skillCodes: [],
            skillToPosition: [],
            duration: vacancy.duration,
            employee: employee.user.account_address,
            company: company.user.account_address,
            weekPayment: web3.utils.toWei(String(vacancy.week_payment), 'ether')
        };
        await blockchainInfo.set(company.user_id, `work${employee.user.account_address}`, `creating contract for work ${vacancy.id}`);
        let contract = await blockchainWork.createWork(blockchainWorkData).then(async (result) => {
            if (!result)
                throw new Web3InitError('Could not register company in blockchain');
            await vacancyService.deleteAwaitedContractByVacancyId(vacancy.id, employee.user_id);
            await socketSender.sendSocketMessage(`${employee.user_id}:vacancy`, {
                type: "DELETE",
                id: vacancyId
            });
            await socketSender.sendSocketMessage(`${company.user_id}:employee`, {
                type: "ADD",
                employee: employee
            });
            await blockchainInfo.unset(company.user_id, `work${employee.user.account_address}`);
            return result;
        });
        workData.contract = contract.address;
        await this.save(workData);
        // Закрыть вакансию
        vacancy.opened = false;
        await vacancy.save();
        return contract;
    }
    
    
    /**
     * компания подветрждает начало работы сотрудника
     * + закидывает абки в контракт на следующую неделю
     * @param id
     * @returns {Promise<*>}
     */
    async startWork(id) {
        let work = await Works.findById(id);
        let company = await companyService.findByIdWithUser(work.company_id);
        let vacancy = await vacancyService.findById(work.vacancy_id);
        let decryptResult = await Account.decryptAccount(company.user.encrypted_key, company.user.key_password);
        let result = await blockchainWork.start(work.contract, web3.utils.toWei(vacancy.week_payment.toFixed(18), "ether"), decryptResult.privateKey);
        return result;
    }
    
    /**
     * вышлет зп для employee
     * + возмет бабки на след неделю
     * с кошелька компании в контракт
     * @param work
     * @returns {Promise<*>}
     */
    async sendWeekSalary(work) {
        let amount = web3.utils.toWei(String(work.vacancy.week_payment.toFixed(18)), "ether");
        let privateKey = await Account.decryptAccount(work.company.user.encrypted_key, work.company.user.key_password).privateKey;
        let result = await blockchainWork.sendWeekSalary(work.contract, amount, privateKey, async function (data) {
            await socketSender.sendSocketMessage(`${work.company.user_id}:balance`, {
                type: "RELOAD"
            });
            await socketSender.sendSocketMessage(`${work.employee.user_id}:balance`, {
                type: "RELOAD"
            });
        });
        
        return result;
    }
    
    /**
     * заплотить деньги всем сотрудникам
     * и закинуть денежные срадства во все контракты
     * заключенные между определеной компанией и сотрудниками
     * @param companyId
     * @returns {Promise<void>}
     */
    async sendWeekSalaryForAllCompanies() {
        let companies = await companyService.getAll();
        for (let i = 0; i < companies.length; ++i) {
            logger.log(`deposit for ${companies[i].name}`);
            let allWorks = await Works.findAll({
                where: {
                    company_id: {
                        [Op.eq]: companies[i].id
                    }
                },
                include: [
                    {model: models.employees, include: [models.users]},
                    {model: models.companies, include: [models.users]},
                    models.vacancies
                ]
            });
            for (let i = 0; i < allWorks.length; ++i) {
                await this.sendWeekSalary(allWorks[i]);
            }
        }
    }
    
}

instance = new WorkService();
module.exports = instance;