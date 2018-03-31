const contractUtil = require('./contract');

let instance;

/**
 * клас для листнеров евентов в blockchain
 */
class Watcher {
    async contractListener(contractAddress, type) {
        let contractInfo;
        switch (type) {
            case "employee":
                contractInfo = require('./abi/Employee.json');
                break;
            
            case "company":
                contractInfo = require('./abi/Company.json');
                break;
            case "work":
                contractInfo = require('./abi/Work.json');
                break;
        }
        let contract = await contractUtil.readContractFromAddress(contractInfo, contractAddress);
        let events = contract.allEvents();
        
        events.watch((err, data) => {
            console.log(`${type} date ${data.event}: ${data.args.index} ${data.args.data} ${data.args.code} ${data.args.company} ${data.args.sender} ${data.args.owner} ${data.args.copm} ${data.args.union}`);
        });
    }
}

instance = new Watcher();
module.exports = instance;
