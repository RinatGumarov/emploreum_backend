const logger = require('../../../utils/logger');
const contractLibrary = require('./contract');
let instance;

class Creator {

    createMainContract() {
        let gas = 4577293;
        var contractInfo = require('../utils/abi/Main.json');

        return contractLibrary.createContract(contractInfo, gas).then(contract => {
            logger.log(`Main contract created: ${contract}`);
            return contract;
        })
    }
}


if (typeof instance !== Creator)
    instance = new Creator();

module.exports = instance;


