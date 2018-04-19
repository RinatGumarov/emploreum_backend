const logger = require('../../../utils/logger');
const config = require('../../../../public_configs/gas_amounts');
const contractUtil = require('./contract');
let instance;

class Dispute {
    vote(disputeAddress, candidate, sender) {
        //TODO
        let gas = config.dispute_vote_gas_amount;
        let contractInfo = require('./abi/Dispute.json');

        return contractUtil.readContractFromAddress(contractInfo, disputeAddress)
            .then(contract => {
                return contract.vote(candidate, sender, { gas });
            })
            .then(data => {
                logger.log(`The ${sender} voted for ${candidate} in dispute ${disputeAddress}`);
                logger.log(data);
                logger.log(`'transaction hash: ', ${data.transactionHash}`);
                return data;
            });
    }
}


instance = new Dispute();
module.exports = instance;

