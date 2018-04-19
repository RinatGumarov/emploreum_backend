let instance;
const logger = require('../../../utils/logger');
const contractUtil = require('./contract');


class Company {
    readCompanyContract(address) {
        let contractInfo = require('./abi/Company.json');
        return contractUtil.readContractFromAddress(contractInfo, address);
    }

    getRating(address) {
        return this.readCompanyContract(address)
            .then(instance => instance.getRating())
            .then(data => {
                logger.log(`Company ${address} rating: ${data}`);
                return data.div(1000000)
                    .toString();
            })
            .catch(err => {
                logger.error(err);
                return 0;
            });
    }

    getWorks(address) {
        return this.readCompanyContract(address)
            .then(instance => instance.getWorks())
            .then(data => {
                logger.log(`Company ${address} rating: ${data}`);
                return data;
            });
    }

    dispute(address, workAddress, privateKey, callback = logger.log) {
        let gas = config.create_dispute_gas_amount;
        let contractInfo = require('./abi/Company.json');

        let contract = new web3.eth.Contract(contractInfo.abi, workAddress);
        let data = contract.methods.dispute(workAddress)
            .encodeABI();

        return account.sendTransaction(value, workAddress, privateKey, callback, 1, { gas, data })
            .then(data => {
                logger.log(`Company ${address} set dispute on work ${workAddress}!`);
                logger.log(data);
                logger.log(`'transaction hash: ', ${data.transactionHash}`);
                return data;
            });
    }
}

instance = new Company();

module.exports = instance;
