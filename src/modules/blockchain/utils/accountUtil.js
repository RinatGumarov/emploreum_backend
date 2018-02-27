const logger = require('../../../utils/logger');
const web3 = require('./web3');
const Web3InitError = require('./Web3Error');
const utilConfig = require("../../../utils/config");
const config = utilConfig.get("web3");

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
            let defaultAccount = process.env.DEFAULT_ACCOUNT || config.defaultAccount;
            let account_password = process.env.ACCOUNT_PASSWORD || config.account_password;
            let unlock_time = process.env.UNLOCK_TIME || config.unlock_time;
            contract.defaults({from: accounts[defaultAccount]});
            
            return web3.eth.personal.unlockAccount(accounts[defaultAccount], account_password,
                web3.utils.toHex(unlock_time));
        }).then(status => {
            logger.log(`try to unlock account, status: ${status}`);
            return status ? contract : null;
        })
    }
}

instance = new Util();
module.exports = instance;



