const contract = require("./contract");
const web3 = require("./web3");
const utilConfig = require("../../../utils/config");
const config = utilConfig.get("web3");
const logger = require('../../../utils/logger');
const Web3InitError = require('./Web3Error');

let instance;
let defaultAccount = 1;

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
     * @returns {Promise.<TResult>}
     */
    registerEmployee(employee) {
        let path = config.main_contract_path;
        let address = config.create_contract_address;
        let gas = config.create_contract_gas_count;
        let contractInfo = require(path);

        return contract.readContractFromAddress(contractInfo, address).then(contract => {
            contract.newEmployee(employee.firstName, employee.lastName, employee.email, employee.raiting,
                                 employee.address, employee.positionCodes, employee.skillCodes,
                                 employee.skillToPosition, {gas}
            ).then(data => {
                logger.log(`employee registeration complite!`);
                logger.log(`'transaction hash: ', ${data.tx}`);
                return true
            }).catch(err => {
                console.log(err)
                return false
            })
        })
    }

    /**
     * Try to unlock account by defaultAccount position
     *
     * @param contract
     * @returns {Promise.<TResult>} with contract or null
     */
    unlockMainAccount(contract) {
        return web3.eth.getAccounts().then(accounts => {
            if (accounts.length === 0)
                throw new Web3InitError('there is no any init accounts in web3');

            contract.defaults({from: accounts[defaultAccount]});

            return web3.eth.personal
                .unlockAccount(accounts[defaultAccount], config.account_password, web3.utils.toHex(config.unlock_time));
        }).then(status => {
            logger.log(`try to unlock account, status: ${status}`);
            return status ? contract : null;
        })
    }
}

if (typeof instance !== RegistrationUtil)
    instance = new RegistrationUtil();

module.exports = instance;