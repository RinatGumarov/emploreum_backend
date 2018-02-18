const Web3 = require("web3");
const configService = require("../../../utils/config");
/**
 * Web3 init module
 */
let instance;
let configuration = configService.get("web3");

if (!instance) {
    instance = new Web3(new Web3.providers.HttpProvider(`${configuration.host}:${configuration.port}`));
}

module.exports = instance;