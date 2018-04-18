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
}

instance = new Company();

module.exports = instance;
