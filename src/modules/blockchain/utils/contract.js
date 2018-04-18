const contractService = require('truffle-contract');
const web3 = require('./web3');
const config = require('../../../../public_configs/gas_amounts');
const logger = require('../../../utils/logger');
const Web3InitError = require('./Web3Error');
const accountUtil = require('./accountUtil');

let instance;

const initContract = function (contractInfo) {
    if (!web3)
        throw new Web3InitError();

    let contract = contractService(contractInfo);
    contract.setProvider(web3.currentProvider);

    // truffle node module bug
    if (typeof contract.currentProvider.sendAsync !== 'function') {
        contract.currentProvider.sendAsync = function () {
            return contract.currentProvider.send.apply(
                contract.currentProvider, arguments
            );
        };
    }

    return accountUtil.unlockMainAccount(contract);
};

class ContractUtil {
    /**
     * Read contract from blockchain with address from abi
     *
     * @param contractInfo
     * @returns {Promise.<TResult>} with contract instance
     */
    readContract(contractInfo) {
        return initContract(contractInfo)
            .then(contract => {
                return contract.deployed();
            });
    };


    /**
     * Read contract from blockchain that located at address
     *
     * @param contractInfo
     * @param address
     * @returns {Promise.<TResult>} with contract instance
     */
    readContractFromAddress(contractInfo, address) {
        return initContract(contractInfo)
            .then(contract => {
                return contract.at(address);
            });
    };

    /**
     * Create contract in blockchain
     *
     * @param contractInfo
     * @param gas
     * @param gasCoefficient
     * @returns {Promise.<TResult>} with contract instance
     */
    createContract(contractInfo, gas, gasCoefficient) {
        let self = this;
        if (gasCoefficient > 10) {
            return;
        }
        let args = Array.prototype.slice.call(arguments, 3);
        let gasPrice = config.gas_price;
        gasPrice = gasPrice * gasCoefficient;
        args.push({ gas, gasPrice });

        return initContract(contractInfo)
            .then(contract => {
                return contract.new.apply(null, args)
                    .then(contract => {
                        logger.log(
                            `Created new contract: ${contract.address}. Transaction hash: ${contract.transactionHash}`);
                        return contract;
                    })
                    .catch((error) => {
                        logger.error(error.stack);
                        gasCoefficient *= 1.5;
                        logger.log(`Starting new contract creation with gasCoefficient: ${gasCoefficient}`);
                        return self.createContract.apply(self, [contractInfo, gas, gasCoefficient].concat(args));
                    });
            });
    };

}

instance = new ContractUtil();
module.exports = instance;