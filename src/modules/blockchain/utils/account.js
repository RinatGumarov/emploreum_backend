const contractUtil = require("./contract");
const web3 = require("./web3");
const utilConfig = require("../../../utils/config");
const config = utilConfig.get("web3");
const logger = require("../../../utils/logger");

let instance;

class RegistrationUtil {

    /**
     * Create new company address in blockchain.
     *
     * @param password: String
     * @returns {PrivateKey} encrypted private key
     */
    generateCompanyAccount(password) {
        let account = web3.eth.accounts.create();
        logger.log(`address: ${account.address} generated for company`);
        return account.encrypt(password);

    };

    /**
     * Create new employee address in blockchain.
     *
     * @param password: String
     * @returns {PrivateKey} encrypted private key
     */

    generateEmployeeAccount(password) {
        let account = web3.eth.accounts.create();
        logger.log(`address: ${account.address} generated for employee`);
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

        let tx = {to, value, gas: 1036820};
        return web3.eth.accounts.signTransaction(tx, privateKey)
            .then(data => {
                return web3.eth.sendSignedTransaction(data.rawTransaction)
                    .once("transactionHash", function (hash) {
                        console.log(hash);
                        callback(hash)
                    })
                    .on("receipt", console.log);
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
        var contractInfo = require("./abi/Employee.json");

        return contractUtil.createContract(contractInfo, gas, employee.firstName, employee.lastName, employee.email,
                                           employee.address
        ).then(contract => {
            logger.log(`Employee contract created: ${contract}`);
            return contract;
        }).catch(err => {
            logger.error(err);
            return false
        });
    }

    /**
     *  Register company in blockchain.
     *
     * @param company
     * @returns {Promise.<Contract instance || false>}
     */
    registerCompany(company) {
        let gas = config.employee_create_gas_amount;
        var contractInfo = require("./abi/Company.json");

        return contractUtil.createContract(contractInfo, gas, company.name, company.raiting, company.address).then(
            contract => {
                logger.log(`Company contract created: ${contract}`);
                return contract;
            }).catch(err => {
            logger.error(err);
            return false
        });
    }
}

if (typeof instance !== RegistrationUtil)
    instance = new RegistrationUtil();

module.exports = instance;