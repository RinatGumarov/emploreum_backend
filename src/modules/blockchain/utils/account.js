const contractUtil = require('./contract');
const web3 = require('./web3');
const config = require('../../../../public_configs/gas_amounts');
const logger = require('../../../utils/logger');

let instance;

class RegistrationUtil {

    /**
     * Create new address in blockchain.
     *
     * @param password: String
     * @returns {PrivateKey} encrypted private key
     */

    generateAccount(password) {
        let account = web3.eth.accounts.create();
        logger.log(`address: ${account.address} generated for user`);
        return account.encrypt(password);
    }

    /**
     * Decrypt account with password
     *
     * @param key: encrypted key
     * @param password: String
     * @returns {Account}
     */
    decryptAccount(key, password) {
        return web3.eth.accounts.decrypt(key, password);
    }

    /**
     *  Send transaction to address
     *
     * @param value: String in wei
     * @param to: String address
     * @param privateKey: String start with 0x
     * @param callback
     * @returns {Promise.<TResult>}
     */

    sendTransaction(value, to, privateKey, callback) {
        let lastArgument = arguments[4];

        let gas = lastArgument.gas || config.send_transaction_gas_amount;
        let data = lastArgument.data;
        let gasPrice = lastArgument.gasPrice || process.env.GAS_PRICE || config.gas_price;

        let tx = { to, value, gas, data, gasPrice };

        return web3.eth.accounts.signTransaction(tx, privateKey)
            .then(data => {
                return web3.eth.sendSignedTransaction(data.rawTransaction)
                    .once('transactionHash', function (hash) {
                        logger.log(hash);
                    })
                    // .on("confirmation", console.log)
                    .on('error', (error) => {
                        logger.log(error);
                    }).once('receipt', callback);
            });

    }

    /**
     * Register employee in blockchain.
     *
     * @param employee
     * @returns {Promise.<Contract instance || false>}
     */
    registerEmployee(employee) {
        let gas = config.employee_create_gas_amount;
        var contractInfo = require('./abi/Employee.json');

        return contractUtil.createContract(contractInfo, gas, employee.firstName, employee.lastName,
            employee.email, employee.address
        ).then(contract => {
            logger.log(`Employee contract created: ${contract}`);
            return contract;
        }).catch(err => {
            logger.error(err);
            return false;
        });
    }

    /**
     * Register company in blockchain.
     *
     * @param company
     * @returns {Promise.<Contract instance || false>}
     */
    registerCompany(company) {
        let gas = config.company_create_gas_amount;
        var contractInfo = require('./abi/Company.json');

        return contractUtil.createContract(contractInfo, gas, company.name, company.address).then(contract => {
            logger.log(`Company contract created: ${contract}`);
            return contract;
        }).catch(err => {
            logger.error(err);
            return false;
        });
    }
}

instance = new RegistrationUtil();
module.exports = instance;