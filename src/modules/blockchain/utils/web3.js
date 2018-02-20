const Web3 = require("web3");
const configService = require("../../../utils/config");
/**
 * Web3 init module
 */
let instance;
let configuration = configService.get("web3");
let blockchainHost = process.env.BLOCKCHAIN_HOST || configuration.host;
let blockchainPort = process.env.BLOCKCHAIN_PORT || configuration.port;
if (!instance) {
    instance = new Web3(new Web3.providers.HttpProvider(`${blockchainHost}:${blockchainPort}`));
}

module.exports = instance;