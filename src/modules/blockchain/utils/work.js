const logger = require("../../../utils/logger");
const utilConfig = require("../../../utils/config");
const config = utilConfig.get("web3");
const contractUtil = require("./contract");
const account = require("./account");
const web3 = require("./web3");
let instance;


class Work {
    
    /**
     *  Create contract in blockchain by main contract.
     *
     * @param work
     * @returns {Promise.<TResult>}
     */
    createWork(work) {
        let gas = process.env.CREATE_CONTRACT_GAS_AMOUNT || config.create_work_gas_amount;
        var contractInfo = require("./abi/Work.json");
        
        return contractUtil.createContract(contractInfo, gas, work.skillCodes, work.skillToPosition,
            work.duration, work.employee, work.company, work.weekPayment
        ).then(contract => {
            logger.log(`Work contract created: ${contract}`);
            return contract;
        }).catch(err => {
            logger.error(err);
            return false
        });
    }
    
    start(workAddress, value, privateKey) {
        let gas = process.env.WORK_START_TRANSACTION_GAS_AMOUNT || config.work_start_transaction_gas_amount;
        let contractInfo = require("./abi/Work.json");
        
        let contract = new web3.eth.Contract(contractInfo.abi, workAddress);
        let data = contract.methods.start().encodeABI();
        
        return account.sendTransaction(value, workAddress, privateKey, logger.log, gas, data).then(data => {
            logger.log(`Contract ${workAddress} starting work now!`);
            logger.log(`'Transaction hash: ', ${data.transactionHash}`);
            return data;
        }).catch(err => {
            logger.error(err);
            return false
        });
    }
    
    deposit(workAddress, value, privateKey) {
        let gas = process.env.CREATE_CONTRACT_GAS_AMOUNT || config.create_contract_gas_count;
        let contractInfo = require("./abi/Work.json");
        
        
        let contract = new web3.eth.Contract(contractInfo.abi, workAddress);
        let data = contract.methods.deposit().encodeABI();
        
        return account.sendTransaction(value, workAddress, privateKey, logger.log, gas, data).then(data => {
            logger.log(`Send deposite to ${workAddress} contract!`);
            logger.log(data);
            logger.log(`'transaction hash: ', ${data.transactionHash}`);
            return data
        }).catch(err => {
            logger.error(err);
            return false
        });
    }
    
    sendWeekSalary(workAddress, value, privateKey, callback) {
        let gas = process.env.SEND_WEEK_SALARY_GAS_AMOUNT || config.send_week_salary_gas_amount;
        let contractInfo = require("./abi/Work.json");
        
        let contract = new web3.eth.Contract(contractInfo.abi, workAddress);
        let data = contract.methods.sendWeekSalary().encodeABI();
        
        return account.sendTransaction(value, workAddress, privateKey, callback, gas, data).then(data => {
            logger.log(`Week payment send to ${workAddress} contract!`);
            logger.log(`'transaction hash: ', ${data.transactionHash}`);
            return data
        }).catch(err => {
            logger.error(err);
            return false
        });
    }
    
    solveFrizzing(workAddress, value, privateKey) {
        let gas = process.env.CREATE_CONTRACT_GAS_COUNT || config.create_contract_gas_count;
        let contractInfo = require("./abi/Work.json");
        
        let contract = new web3.eth.Contract(contractInfo.abi, workAddress);
        let data = contract.methods.solveFrizzing().encodeABI();
        
        return account.sendTransaction(value, workAddress, privateKey, logger.log, gas, data).then(data => {
            logger.log(`Contract ${workAddress} start working!`);
            logger.log(data);
            logger.log(`'transaction hash: ', ${data.transactionHash}`);
            return data
        }).catch(err => {
            logger.error(err);
            return false
        });
    }
    
    solveDispute(workAddress, winner, privateKey) {
        let gas = process.env.CREATE_CONTRACT_GAS_COUNT || config.create_contract_gas_count;
        let contractInfo = require("./abi/Work.json");
        
        return contractUtil.readContractFromAddress(contractInfo, workAddress).then(contract => {
            return contract.solveDisput(winner);
        }).then(data => {
            logger.log(`Contract ${workAddress} finished with dispute. Winner: ${winner}.`);
            logger.log(data);
            logger.log(`'transaction hash: ', ${data.transactionHash}`);
            return data
        }).catch(err => {
            logger.error(err);
            return false
        });
    }
    
    finish(workAddress) {
        let gas = process.env.CREATE_CONTRACT_GAS_COUNT || config.create_contract_gas_count;
        let contractInfo = require("./abi/Work.json");
        
        return contractUtil.readContractFromAddress(contractInfo, workAddress).then(contract => {
            return contract.finish();
        }).then(data => {
            logger.log(`Contract ${workAddress} finished!`);
            logger.log(data);
            logger.log(`'transaction hash: ', ${data.transactionHash}`);
            return data
        }).catch(err => {
            logger.error(err);
            return false
        });
    }
    
    getWorkData(workAddress) {
        let gas = process.env.CREATE_CONTRACT_GAS_COUNT || config.create_contract_gas_count;
        let contractInfo = require("./abi/Work.json");
        
        return contractUtil.readContractFromAddress(contractInfo, workAddress).then(contract => {
            return contract.getWorkData();
        }).then(data => {
            logger.log(`Current data from ${workAddress}!`);
            logger.log(data);
            logger.log(`'transaction hash: ', ${data.transactionHash}`);
            return data
        }).catch(err => {
            logger.error(err);
            return false
        });
    }
}


instance = new Work();
module.exports = instance;

