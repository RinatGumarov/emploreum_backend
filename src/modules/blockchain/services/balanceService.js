const models = require('../../../core/models');
const web3 = require('../utils/web3');
const blockchainConfig = require('../../../../public_configs/gas_amounts');

let instance;

class BalanceService {

    async getBalance(address) {
        let balance = await web3.utils.fromWei(await web3.eth.getBalance(address), 'ether');
        return parseFloat(balance);
    };

    async getSalaryFee() {
        const gasPrice = parseInt(blockchainConfig.gas_price);
        const gas = parseInt(blockchainConfig.send_week_salary_gas_amount);
        let fee = await web3.utils.fromWei(String(gasPrice * gas), 'ether');
        return parseFloat(fee);
    };

}

instance = new BalanceService();
module.exports = instance;
