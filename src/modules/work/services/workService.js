const models = require('../../../core/models');
const Works = models.works;
const blockchainWork = require('../../blockchain/utils/work');
const blockchainInfo = require('../../blockchain/services/blockchainEventService');
const companyService = require('../../company/services/companyService');
const vacancyService = require('../../company/services/vacancyService');
const Web3InitError = require('../../blockchain/utils/Web3Error');
const Account = require('../../blockchain/utils/account');
const web3 = require('../../blockchain/utils/web3');
const logger = require('../../../utils/logger');

const Op = models.sequelize.Op;

let instance;

class WorkService {

    async save(workData) {
        return await Works.create(workData);
    }

    async findAllByEmployeeId(employeeId) {
        let works = await Works.findAll({
            where: {
                employee_id: {
                    [Op.eq]: employeeId
                }
            }
        });
        return works;
    }

    //toDo
    async createWork(vacancy, employee, company, account_address) {
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
            employee: account_address,
            company: company.user.account_address,
            weekPayment: vacancy.week_payment,
        };
        await blockchainInfo.set(companyUserId, address, `creating contract for work ${vacancy.id}`);
        let contract = await blockchainWork.createWork(blockchainWorkData).then(async (result) => {
            if (!result)
                throw new Web3InitError('Could not register company in blockchain');
            await blockchainInfo.unset(companyUserId, address);
            return result;
        });
        console.log(contract);
        workData.contract = contract.address;
        await this.save(workData);
        return contract;
    }


    async startWork(id) {
        let work = await Works.findById(id);
        let company = await companyService.findByIdWithUser(work.company_id);
        let vacancy = await vacancyService.findById(work.vacancy_id);
        let privateKey = await Account.decryptAccount(company.user.encrypted_key, company.user.key_password).privateKey;
        if (await blockchainWork.start(work.contract, web3.utils.toWei('0.0000001', "ether"), privateKey))
            logger.log('work started');
        else
            logger.error('couldn\'t start work');
    }


    async pay(id){
        let work = await Works.findById(id);
        let company = await companyService.findByIdWithUser(work.company_id);
        let privateKey = await Account.decryptAccount(company.user.encrypted_key, company.user.key_password).privateKey;
        await blockchainWork.sendWeekSalary(work.contract, web3.utils.toWei('0.00000001', "ether"), privateKey);
    }

}

if (typeof instance !== WorkService) {
    instance = new WorkService();
}

module.exports = instance;
