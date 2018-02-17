const models = require('../../../core/models');
const Works = models.works;
// const blockchainWork = require('../../blockchain/utils/work');
const logger = require('../../../utils/logger');

const Op = models.sequelize.Op;

let instance;

class WorkService {

    async save(workData, employee) {
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

    async createWork(employee, company, vacancyId){
        let today = new Date();
        
        let workData = {
            vacancy_id: vacancyId,
            begin_date: today,
            end_date: 1519827609,
            employee_id: employee.id,
            company_id: company.id,
            status: 0,
        };
        let blockchainWorkData = {
            skillCodes: [],
            skillToPosition: [],
            startDate: today,
            endDate: workData.end_date,
            empoloyee: req.user.account_address,
            company: company.user.account_address,
            weekPayment: vacancy.pricePerWeek,
        };
        await blockchainWork.createWork(blockchainWorkData).then(result => {
            if (!result)
                throw new Web3InitError('Could not registrate company in blockchain');
        });
        save(workData, employee);
    }

}

if (typeof instance !== WorkService) {
    instance = new WorkService();
}

module.exports = instance;
