const contractService = require('truffle-contract');
const web3 = require("./web3");
const utilConfig = require("../../../utils/config");
const config = utilConfig.get("web3");
const logger = require('../../../utils/logger');
const Web3InitError = require('./Web3Error');
const accountUtil = require('./accountUtil');

let instance;
let gasPrice = web3.utils.toWei('1', 'gwei');

var initContract = function (contractInfo) {
    if (!web3)
        throw new Web3InitError();

    let contract = contractService(contractInfo);
    contract.setProvider(web3.currentProvider);

    return accountUtil.unlockMainAccount(contract);
}

class ContractUtil {
    /**
     * Read contract from blockchain with address from abi
     *
     * @param contractInfo
     * @returns {Promise.<TResult>} with contract instance
     */
    readContract(contractInfo) {
        return initContract(contractInfo).then(contract => {
            return contract.deplyed();
        })
    };


    /**
     * Read contract from blockchain that located at address
     *
     * @param contractInfo
     * @param address
     * @returns {Promise.<TResult>} with contract instance
     */
    readContractFromAddress(contractInfo, address) {
        return initContract(contractInfo).then(contract => {
            return contract.at(address);
        })
    };

    /**
     * Create contract in blockchain
     *
     * @param contractInfo
     * @param gas
     * @param [arg1, arg2, ...] contract constructor args
     * @returns {Promise.<TResult>} with contract instance
     */
    createContract(contractInfo, gas) {
        let args = Array.prototype.slice.call(arguments, 2);
        args.push({gas, gasPrice});

        return initContract(contractInfo).then(contract => {
            return contract.new.apply(null, args).then(contract => {
                logger.log("Created new contract");
                logger.log(contract);

                return contract;
            })
        })
    };
}

if (typeof instance !== ContractUtil)
    instance = new ContractUtil();

module.exports = instance;

