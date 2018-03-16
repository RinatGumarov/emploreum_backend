const models = require('../../../core/models');
const Works = models.works;
const blockchainWork = require('../utils/work');

const socketSender = require('../../../core/socketSender');

const blockchainInfo = require('./blockchainEventService');
const companyService = require('../../company/services/companyService');
const vacancyService = require('../../company/services/vacancyService');
const skillsService = require('../../specialisation/services/skillService');
const balanceService = require('../services/balanceService');
const messageService = require('../../message/services/messageService');
const employeeService = require('../../employee/services/employeeService');

const Web3InitError = require('../utils/Web3Error');
const employeeBlockchainUtil = require('../utils/employee');
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
                attributes: ['name'],
                model: models.companies
            }, {
                model: models.vacancies,
                attributes: ['weekPayment']
            }],
            where: {
                employeeId: {
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
                if (message) {
                    message += ' and';
                }
                message += ` company ${company.name}.`;
            }
            if (message) {
                await blockchainInfo.set(company.userId, `contract creation ${address}`,
                    `Creating contract in blockchain for${message}`);
                await Promise.all(promises);
                await blockchainInfo.unset(company.userId, `contract creation ${address}`);
            }
            message = `employee ${employee.name} and company ${company.name}.`;

            await blockchainInfo.set(company.userId, `work creation ${address}`,
                `Creating contract in blockchain between ${message}`);

            await this.createWork(vacancyId, employee, companyUser);

            await blockchainInfo.unset(company.userId, `work creation ${address}`);
            return true;
        } catch (e) {
            logger.error(e.stack);
            logger.log('Waiting promises, count: ' + promises.length);

            await Promise.all(promises);

            await blockchainInfo.unset(company.userId, `contract creation ${address}`);
            await blockchainInfo.unset(company.userId, `work creation ${address}`);

            return false;
        }
    }

    //toDo
    async createWork(vacancyId, employee, companyUser) {
        let vacancy = await vacancyService.findById(vacancyId);
        let begin = new Date();
        let end = new Date().setMonth(begin.getMonth() + vacancy.duration);

        let workData = {
            vacancyId: vacancy.id,
            beginDate: begin,
            endDate: end,
            employeeId: employee.id,
            companyId: companyUser.company.id,
            status: 0
        };

        let skillCodes = await this.generateCodes(vacancyId);

        let blockchainWorkData = {
            skillCodes,
            duration: vacancy.duration,
            employee: employee.user.accountAddress,
            company: companyUser.accountAddress,
            weekPayment: web3.utils.toWei(String(vacancy.weekPayment), 'ether')
        };

        let contract = await blockchainWork.createWork(blockchainWorkData).then(async (result) => {
            if (!result)
                throw new Web3InitError('Could not register company in blockchain');

            await vacancyService.deleteAwaitedContractByVacancyId(vacancy.id, employee.userId);
            await socketSender.sendSocketMessage(`${employee.userId}:vacancy`, {
                type: 'ADD',
                vacancy: result.address
            });

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
        let company = await companyService.findByIdWithUser(work.companyId);
        let vacancy = await vacancyService.findById(work.vacancyId);
        let decryptResult = await Account.decryptAccount(company.user.encryptedKey, company.user.keyPassword);
        let result = await blockchainWork.start(work.contract,
            web3.utils.toWei(vacancy.weekPayment.toFixed(18), 'ether'), decryptResult.privateKey);
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

        let amount = web3.utils.toWei(String(work.vacancy.weekPayment.toFixed(18)), 'ether');
        let privateKey = await Account.decryptAccount(work.company.user.encryptedKey,
            work.company.user.keyPassword).privateKey;

        // передаем callback функцию так как web3 принимает собственные promise

        let result = await blockchainWork.sendWeekSalary(work.contract, amount, privateKey, async (data) => {

            let employeeBalance = await balanceService.getBalance(work.employee.user.accountAddress);
            let companyBalance = await balanceService.getBalance(work.company.user.accountAddress);
            await socketSender.sendSocketMessage(`${work.employee.userId}:balance`, {
                balance: employeeBalance
            });
            await socketSender.sendSocketMessage(`${work.company.userId}:balance`, {
                balance: companyBalance
            });

            return data;
        });

        let transaction = {
            currency: 'eth',
            amount: parseFloat(work.vacancy.weekPayment.toFixed(18)),
            transactionHash: result.transactionHash,
            workId: work.id

        };

        let savedTransaction = await this.createContractTransaction(transaction);

        await messageService.sendToCompany(work.employee, work.company.id, 'New transaction for employee');
        await socketSender.sendSocketMessage(`${work.company.userId}:transactions`, {
            transaction: savedTransaction
        });

        logger.log(`===\nsalary paid\n===\n${result}\n===`);
        return result;
    }

    async addRatingToEmployee(work) {
        let workAddress = work.contract;
        let employeeContractAddress = work.employee.contract;
        let skillCodes = await this.generateCodes(work.vacancyId);

        let promises = [];

        skillCodes.forEach(async code => {
            let rating = this.calculateRating(workAddress, employeeContractAddress);
            promises.push(employeeBlockchainUtil.changeSkillRating(employeeContractAddress, code, rating));
        });

        await Promise.all(promises);
    }

    async createContractTransaction(transaction) {
        if (transaction.transactionHash)
            return await models.workTransactions.create(transaction);
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
                    companyId: {
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
                await blockchainInfo.set(companies[i].userId, `salary:${allWorks[j].contract}`, 'Send salary');
                try {
                    await this.sendWeekSalary(allWorks[j]);
                    await this.addRatingToEmployee(allWorks[j]);
                } catch (e) {
                    logger.error(e.stack);
                }
                await blockchainInfo.unset(companies[i].userId, `salary:${allWorks[j].contract}`);
            }

        }
    }

    // TODO raiting calculation for employee on paying week salary

    calculateRating(workAddress, employeeContractAddress) {
        return 1;
    }

    async generateCodes(vacancyId) {
        let skillCodes = [];
        let profiles = await vacancyService.getVacancyProfiles(vacancyId);
        for (let profile of profiles) {
            for (let skill of profile.skills) {
                let code = ((profile.id - 1) << 12) + (skill.id - 1);
                skillCodes.push(code);
            }
        }

        return skillCodes;
    }
}

instance = new WorkService();
module.exports = instance;
