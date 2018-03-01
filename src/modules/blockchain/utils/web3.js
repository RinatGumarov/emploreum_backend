const Web3 = require('web3');
const configService = require('../../../utils/config');
const configuration = configService.get('blockchain_node');
/**
 * Web3 init module
 */
let instance;

const blockchainHost = process.env.BLOCKCHAIN_HOST || configuration.host;
const blockchainPort = process.env.BLOCKCHAIN_PORT || configuration.port;

if (!instance) {
    instance = new Web3(new Web3.providers.HttpProvider(`${blockchainHost}:${blockchainPort}`));
}

module.exports = instance;