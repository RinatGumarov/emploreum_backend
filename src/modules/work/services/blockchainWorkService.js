const models = require('../../../core/models');
const Works = models.works;
const blockchainWork = require('../../blockchain/utils/work');
const logger = require('../../../utils/logger');

const Op = models.sequelize.Op;

let instance;

class BlockchainWorkService {

    async createBlockchainWork(startDate, endDate, employee_address, company_address, weekPayment){
        let blockchainWorkData = {
            skillCodes: [],
            skillToPosition: [],
            startDate,
            endDate,
            empoloyee: account_address,
            company: company_address,
            weekPayment,
        };
        await blockchainWork.createWork(blockchainWorkData).then(result => {
            if (!result)
                throw new Web3InitError('Could not registrate company in blockchain');
        });
        await this.save(workData, employee);
    }

}

if (typeof instance !== BlockchainWorkService) {
    instance = new BlockchainWorkService();
}

module.exports = instance;
