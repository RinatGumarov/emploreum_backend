const Web3 = require("web3");
/**
 * Web3 init module
 */
let instance;

if (!instance)
    instance = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

module.exports = instance;