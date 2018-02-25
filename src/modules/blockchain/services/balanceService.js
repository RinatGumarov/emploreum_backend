const models = require('../../../core/models');
const web3 = require('../utils/web3');

const Op = models.sequelize.Op;

let instance;

class BalanceService {
    
    async getBalance(address) {
        return web3.utils.fromWei(await web3.eth.getBalance(address), "ether");
    };
    
}

instance = new BalanceService();
module.exports = instance;
