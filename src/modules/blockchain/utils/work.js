const logger = require('../../../utils/logger');
const utilConfig = require("../../../utils/config");
const config = utilConfig.get("web3");
const contractUtil = require("./contract");
let instance;

//const addressen = await zusatzaufgabe.addressen.call(0);

class Work {

    /**
     *  Create contract in blockchain by main contract.
     *
     * @param work
     * @returns {Promise.<TResult>}
     */
    createWork(work) {
        let address = config.main_contract_path;
        let gas = config.create_contract_gas_count;
        let contractInfo = require('./abi/Main.json');

        return contractUtil.readContractFromAddress(contractInfo, address).then(contract => {
            return contract.newContract(work.skillCodes, work.skillToPosition, work.startDate, work.endDate,
                                        work.empoloyee, work.company, work.weekPayment, {gas});
        }).then(data => {
            logger.log(`contract creation complite!`);
            logger.log(data);
            logger.log(`'transaction hash: ', ${data.tx}`);
            return true
        }).catch(err => {
            logger.error(err);
            return false
        });
    }
}


if (typeof instance !== Work)
    instance = new Work();

module.exports = instance;

