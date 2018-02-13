const logger = require('../../../utils/logger');
const web3 = require('./web3');
const Web3InitError = require('./Web3Error');
const utilConfig = require("../../../utils/config");
const config = utilConfig.get("web3");

let defaultAccount = 1;

let instance;

class Util {

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

if (typeof instance !== Util)
    instance = new Util();

module.exports = instance;



