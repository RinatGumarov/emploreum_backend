const logger = require('../../../utils/logger');
const web3 = require('./web3');
const Web3InitError = require('./Web3Error');
const utilConfig = require('../../../utils/config');
const config = utilConfig.get('blockchain_node');

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
                throw new Web3InitError('There is no any init accounts in web3.');

            let defaultAccount = process.env.DEFAULT_ACCOUNT || config.defaultAccount;
            let account_password = process.env.ACCOUNT_PASSWORD || config.account_password;
            let unlock_time = process.env.UNLOCK_TIME || config.unlock_time;

            contract.defaults({ from: accounts[defaultAccount] });
            return Promise.resolve(true);
            return web3.eth.personal.unlockAccount(accounts[defaultAccount], account_password,
                web3.utils.toHex(unlock_time));
        }).then(status => {
            logger.log(`Is default account unlocked status: ${status}`);

            if (!status)
                throw new Web3InitError('Can\'t unlock default account. Please check password.');

            return contract;
        });
    }
}

instance = new Util();
module.exports = instance;



