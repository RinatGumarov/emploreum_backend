const contractUtil = require("./contract");
const web3 = require("./web3");
const utilConfig = require("../../../utils/config");
const config = utilConfig.get("web3");
const logger = require('../../../utils/logger');

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
                    .once('transactionHash', function (hash) {
                        console.log(hash);
                        callback(hash)
                    })
                    .on('receipt', console.log);
            });

    }

    /**
     *  Register employee in blockchain by main contract.
     *
     * @param employee
     * @returns {Promise.<boolean>}
     */
    async registerEmployee(employee) {
        let address = config.main_contract_path;
        let gas = config.create_contract_gas_count;
        let contractInfo = require('./abi/Main.json');

        // TODO check Bulat metodology

        try {
            const data = await contractUtil.readContractFromAddress(contractInfo, address).then(contract => {
                contract.newEmployee(employee.firstName, employee.lastName, employee.email, employee.raiting,
                                     employee.address, employee.positionCodes, employee.skillCodes,
                                     employee.skillToPosition, {gas});

            });
            logger.log(`employee registeration complite!`);
            logger.log(`transaction hash: ${data.tx}`);
            return true;
        } catch (e) {
            logger.error(err);
            return false;
        }
    }

    /**
     *  Register company in blockchain by main contract.
     *
     * @param company
     * @returns {Promise.<TResult>}
     */
    registerCompany(company) {
        let address = config.main_contract_path;
        let gas = config.create_contract_gas_count;
        let contractInfo = require('./abi/Main.json');

        return contractUtil.readContractFromAddress(contractInfo, address).then(contract => {
            return contract.newCompany(company.name, company.raiting, company.address, {gas})
        }).then(data => {
            logger.log(`company registeration complite!`);
            logger.log(`'transaction hash: ', ${data.tx}`);
            return true
        }).catch(err => {
            logger.error(err);
            return false
        });
    }
}

if (typeof instance !== RegistrationUtil)
    instance = new RegistrationUtil();

module.exports = instance;