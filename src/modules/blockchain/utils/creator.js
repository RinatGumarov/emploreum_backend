const logger = require('../../../utils/logger');
const contractLibrary = require('../utils/contract');
let instance;

class Creator {

    createMainContract() {
        let gas = 4577293;
        var contractInfo = require('../utils/abi/Main.json');

        contractLibrary.createContract(contractInfo, gas).then(contract => {
            logger.log(`Main contract created: ${contract}`);
        })
    }
}

if (typeof instance !== Creator)
    instance = new Creator();

module.exports = Creator;


