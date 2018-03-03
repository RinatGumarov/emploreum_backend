const models = require('../../../core/models');
const Works = models.works;
const blockchainWork = require('../utils/work');
const socketSender = require('../../../core/socketSender');
const blockchainInfo = require('./blockchainEventService');
const companyService = require('../../company/services/companyService');
const vacancyService = require('../../company/services/vacancyService');
const balanceService = require('../services/balanceService');
const messageService = require('../../message/services/messageService');
const Web3InitError = require('../utils/Web3Error');
const Account = require('../utils/account');
const web3 = require('../utils/web3');
const logger = require('../../../utils/logger');
const employeeService = require('../../employee/services/employeeService');
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
                attributes: ['name'],
                model: models.companies
            }, {
                model: models.vacancies,
                attributes: ['week_payment']
            }],
            where: {
                employee_id: {
                    [Op.eq]: employeeId
                }
            }
        });
        return works;
    }

    async approve(vacancyId, address, employee, company, companyUser) {
        let promises = [];

        try {
            let message;

            if (!employee.contract) {
                let promise = employeeService.createBlockchainAccountForEmployee(employee);

                promises.push(promise);
                message = ` employee ${employee.name}`;
            }

            if (!company.contract) {
                let promise = companyService.createBlockchainAccountForCompany(companyUser, 10);

                promises.push(promise);

                if (message)
                    message += ' and';

                message += ` company ${company.name}.`;
            }


            if (message) {
                await blockchainInfo.set(company.user_id, `contract creation ${address}`,
                    `Creating contract in blockchain for${message}`);

                await Promise.all(promises);

                await blockchainInfo.unset(company.user_id, `contract creation ${address}`);
            }

            message = `employee ${employee.name} and company ${company.name}.`;

            await blockchainInfo.set(company.user_id, `work creation ${address}`,
                `Creating contract in blockchain between ${message}`);

            await this.createWork(vacancyId, employee, companyUser);

            await blockchainInfo.unset(company.user_id, `work creation ${address}`);

            return true;
        } catch (e) {
            logger.error(e.stack);
            logger.log('Waiting promises, count: ' + promises.length);

            await Promise.all(promises);

            await blockchainInfo.unset(company.user_id, `contract creation ${address}`);
            await blockchainInfo.unset(company.user_id, `work creation ${address}`);

            return false;
        }
    }

    //toDo
    async createWork(vacancyId, employee, companyUser) {
        let vacancy = await vacancyService.findById(vacancyId);
        let begin = new Date();
        let end = new Date().setMonth(begin.getMonth() + vacancy.duration);

        let workData = {
            vacancy_id: vacancy.id,
            begin_date: begin,
            end_date: end,
            employee_id: employee.id,
            company_id: companyUser.company.id,
            status: 0
        };

        let blockchainWorkData = {
            skillCodes: [],
            skillToPosition: [],
            duration: vacancy.duration,
            employee: employee.user.account_address,
            company: companyUser.account_address,
            weekPayment: web3.utils.toWei(String(vacancy.week_payment), 'ether')
        };

        await blockchainInfo.set(companyUser.id, `work${employee.user.account_address}`,
            `creating contract for work ${vacancy.id}`);

        let contract = await blockchainWork.createWork(blockchainWorkData).then(async (result) => {
            if (!result)
                throw new Web3InitError('Could not register company in blockchain');

            await vacancyService.deleteAwaitedContractByVacancyId(vacancy.id, employee.user_id);
            await socketSender.sendSocketMessage(`${employee.user_id}:vacancy`, {
                type: 'ADD',
                vacancy: result.address
            });
            await blockchainInfo.unset(companyUser.id, `work${employee.user.account_address}`);

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
        let result = await blockchainWork.start(work.contract,
            web3.utils.toWei(vacancy.week_payment.toFixed(18), 'ether'), decryptResult.privateKey);
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

        let amount = web3.utils.toWei(String(work.vacancy.week_payment.toFixed(18)), 'ether');
        let privateKey = await Account.decryptAccount(work.company.user.encrypted_key,
            work.company.user.key_password).privateKey;

        // передаем callback функцию так как web3 принимает собственные promise

        let result = await blockchainWork.sendWeekSalary(work.contract, amount, privateKey, async (data) => {

            let employeeBalance = await balanceService.getBalance(work.employee.user.account_address);
            let companyBalance = await balanceService.getBalance(work.company.user.account_address);
            await socketSender.sendSocketMessage(`${work.employee.user_id}:balance`, {
                balance: employeeBalance
            });
            await socketSender.sendSocketMessage(`${work.company.user_id}:balance`, {
                balance: companyBalance
            });

            return data;
        });

        let transaction = {
            currency: 'eth',
            amount: parseFloat(work.vacancy.week_payment.toFixed(18)),
            transaction_hash: result.transactionHash,
            work_id: work.id

        };

        let savedTransaction = await this.createContractTransaction(transaction);

        await messageService.sendToCompany(work.employee, work.company.id, 'New transaction for employee');
        await socketSender.sendSocketMessage(`${work.company.user_id}:transactions`, {
            transaction: savedTransaction
        });
        logger.log(`===\nsalary paid\n===\n${result}\n===`);
        return result;
    }

    async createContractTransaction(transaction) {
        if (transaction.transaction_hash)
            return await models.work_transactions.create(transaction);
    }

    /**
     * заплатить деньги всем сотрудникам
     * и закинуть денежные срадства во все контракты
     * заключенные между определеной компанией и сотрудниками
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
                    { model: models.employees, include: [models.users] },
                    { model: models.companies, include: [models.users] },
                    models.vacancies
                ]
            });
            for (let j = 0; j < allWorks.length; ++j) {
                await blockchainInfo.set(companies[i].user_id, `salary:${allWorks[j].contract}`, 'Send salary');
                try {
                    await this.sendWeekSalary(allWorks[j]);
                } catch (e) {
                    logger.error(e.stack);
                }
                await blockchainInfo.unset(companies[i].user_id, `salary:${allWorks[j].contract}`);
            }

        }
    }

}

instance = new WorkService();
module.exports = instance;
