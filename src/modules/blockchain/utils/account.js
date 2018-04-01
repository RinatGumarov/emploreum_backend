const contractUtil = require('./contract');
const web3 = require('./web3');
const config = require('../../../../public_configs/gas_amounts');
const logger = require('../../../utils/logger');
const utilConfig = require('../../../utils/config');
const configBlockchain = utilConfig.get('blockchain_node');

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
     * @param gasCoefficient
     * @returns {Promise.<TResult>}
     */

    sendTransaction(value, to, privateKey, callback, gasCoefficient) {

        let self = this;

        if (gasCoefficient > 10) {
            return;
        }

        let lastArgument = arguments[5];

        let gas = lastArgument.gas || config.send_transaction_gas_amount;
        let data = lastArgument.data;
        let gasPrice = lastArgument.gasPrice || process.env.GAS_PRICE || config.gas_price;
        gasPrice = gasPrice * gasCoefficient;

        let tx = { to, value, gas, data, gasPrice };

        return web3.eth.accounts.signTransaction(tx, privateKey)
            .then(data => {
                return web3.eth.sendSignedTransaction(data.rawTransaction)
                    .once('transactionHash', function (hash) {
                        logger.log(hash);
                    })
                    // .on("confirmation", console.log)
                    .on('error', (error) => {
                        logger.error(error.stack);
                        return self.sendTransaction(value, to, privateKey, callback, gasCoefficient * 1.5,
                            lastArgument);
                    })
                    .once('receipt', callback);
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

        return contractUtil.createContract(contractInfo, gas, 1, employee.firstName, employee.lastName,
            employee.email, employee.address
        )
            .then(contract => {
                logger.log(`Employee contract created: ${contract}`);
                return contract;
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

        return contractUtil.createContract(contractInfo, gas, 1, company.name, company.address)
            .then(contract => {
                this.contractListener(contract);
                logger.log(`Company contract created: ${contract}`);
                return contract;
            });
    }

    async contractListener(contract) {
        let events = contract.allEvents();
        events.watch((err, data) => {
            console.log(`contract date ${data.event}: ${data.args.index} ${data.args.data}`);
        });
    }

    //TODO delete after investors review
    depositFromMain(receiver) {
        let coinbase;
        return web3.eth.getAccounts()
            .then(accounts => {
                if (accounts.length === 0)
                    throw new Web3InitError('There is no any init accounts in web3.');

                let defaultAccount = process.env.DEFAULT_ACCOUNT || configBlockchain.defaultAccount;
                let account_password = process.env.ACCOUNT_PASSWORD || configBlockchain.account_password;
                let unlock_time = process.env.UNLOCK_TIME || configBlockchain.unlock_time;
                coinbase = accounts[defaultAccount];
                return web3.eth.personal.unlockAccount(coinbase, account_password,
                    web3.utils.toHex(unlock_time));
            })
            .then(status => {
                logger.log(`Is default account unlocked status: ${status}`);

                if (!status)
                    throw new Web3InitError('Can\'t unlock default account. Please check password.');
                const value = web3.utils.toWei('0.01', 'ether');
                web3.eth.sendTransaction(
                    { from: coinbase, to: receiver, value });
            });
    }
}

instance = new RegistrationUtil();
module.exports = instance;
