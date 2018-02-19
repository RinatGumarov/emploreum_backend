const logger = require("../../../utils/logger");
const utilConfig = require("../../../utils/config");
const config = utilConfig.get("web3");
const contractUtil = require("./contract");
let instance;


class Work {

    /**
     *  Create contract in blockchain by main contract.
     *
     * @param work
     * @returns {Promise.<TResult>}
     */
    createWork(work) {
        let gas = config.create_contract_gas_amount;
        var contractInfo = require("./abi/Contract.json");

        return contractUtil.createContract(contractInfo, gas, work.skillCodes, work.skillToPosition,
                                           work.duration, work.empoloyee, work.company, work.weekPayment
        ).then(contract => {
            logger.log(`Work contract created: ${contract}`);
            return contract;
        }).catch(err => {
            logger.error(err);
            return false
        });
    }

    start(workAddress, value) {
        let gas = config.create_contract_gas_count;
        let contractInfo = require("./abi/Contract.json");

        return contractUtil.readContractFromAddress(contractInfo, workAddress).then(contract => {
            return contract.start({gas, value});
        }).then(data => {
            logger.log(`Contract ${workAddress} start working!`);
            logger.log(data);
            logger.log(`'transaction hash: ', ${data.tx}`);
            return true
        }).catch(err => {
            logger.error(err);
            return false
        });
    }

    deposit(workAddress, value) {
        let gas = config.create_contract_gas_count;
        let contractInfo = require("./abi/Contract.json");

        return contractUtil.readContractFromAddress(contractInfo, workAddress).then(contract => {
            return contract.deposite({gas, value});
        }).then(data => {
            logger.log(`Send deposite to ${workAddress} contract!`);
            logger.log(data);
            logger.log(`'transaction hash: ', ${data.tx}`);
            return true
        }).catch(err => {
            logger.error(err);
            return false
        });
    }

    sendWeekSalary(workAddress) {
        let gas = config.create_contract_gas_count;
        let contractInfo = require("./abi/Main.json");

        return contractUtil.readContractFromAddress(contractInfo, workAddress).then(contract => {
            return contract.sendWeekSalary({gas});
        }).then(data => {
            logger.log(`Week payment send to ${workAddress} contract!`);
            logger.log(data);
            logger.log(`'transaction hash: ', ${data.tx}`);
            return true
        }).catch(err => {
            logger.error(err);
            return false
        });
    }

    solveFrizzing(workAddress, value) {
        let gas = config.create_contract_gas_count;
        let contractInfo = require("./abi/Contract.json");

        return contractUtil.readContractFromAddress(contractInfo, workAddress).then(contract => {
            return contract.solveFrizzing({gas, value});
        }).then(data => {
            logger.log(`Contract ${workAddress} start working!`);
            logger.log(data);
            logger.log(`'transaction hash: ', ${data.tx}`);
            return true
        }).catch(err => {
            logger.error(err);
            return false
        });
    }

    solveDispute(winner) {
        let gas = config.create_contract_gas_count;
        let contractInfo = require("./abi/Contract.json");

        return contractUtil.readContractFromAddress(contractInfo, workAddress).then(contract => {
            return contract.solveDisput(winner);
        }).then(data => {
            logger.log(`Contract ${workAddress} finished with dispute. Winner: ${winner}.`);
            logger.log(data);
            logger.log(`'transaction hash: ', ${data.tx}`);
            return true
        }).catch(err => {
            logger.error(err);
            return false
        });
    }

    finish(winner) {
        let gas = config.create_contract_gas_count;
        let contractInfo = require("./abi/Contract.json");

        return contractUtil.readContractFromAddress(contractInfo, workAddress).then(contract => {
            return contract.finish();
        }).then(data => {
            logger.log(`Contract ${workAddress} finished!`);
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

