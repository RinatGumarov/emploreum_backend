const models = require('../../../core/models');
const Works = models.works;
const blockchainWork = require('../../blockchain/utils/work');
const Web3InitError = require('../../blockchain/utils/Web3Error');
const logger = require('../../../utils/logger');

const Op = models.sequelize.Op;

let instance;

class WorkService {

    async save(workData) {
        return await Works.build(workData).save();
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
        let contract = await blockchainWork.createWork(blockchainWorkData).then(result => {
            if (!result)
                throw new Web3InitError('Could not registrate company in blockchain');
            return result;
        });
        console.log(contract);
        await this.save(workData);
        return contract;
    }

}

if (typeof instance !== WorkService) {
    instance = new WorkService();
}

module.exports = instance;
