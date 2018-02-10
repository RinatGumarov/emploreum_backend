const Web3 = require("web3");
const web3InitError = require("./Web3Error");
const contractService = require('truffle-contract');
var web3;
module.exports.web3 = web3;

module.exports.initWeb3 = function () {
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    return web3;
};

// return Promise with contract instance

module.exports.readContract = function (contractInfo) {
    return initContract(contractInfo).then(contract => {
        return contract.deplyed()
    })
};

// return Promise with contract instance

module.exports.readContractFromAddress = function (contractInfo, address) {
    return initContract(contractInfo).then(contract => {
        return contract.at(address)
    })
};

// return Promise with contract instance

module.exports.createContract = function (contractInfo, gas) {
    let args = Array.prototype.slice.call(arguments, 2)
    // if (args.length === 0)
    //   args = null
    args.push({gas});
    return initContract(contractInfo).then(contract => {
        return contract.new.apply(null, args)
    })
};

function initContract(contractInfo) {
    if (!web3) {
        throw new Web3InitError()
    }

    let contract = contractService(contractInfo);
    contract.setProvider(web3.currentProvider);

    return new Promise((resolve, reject) => {
        web3.eth.getAccounts((error, accounts) => {
            if (error) {
                throw new Web3InitError(error.message)
            }
            if (accounts.length === 0) {
                throw new Web3InitError('there is no any init accounts in web3')
            }

            contract.defaults({from: accounts[0]})
            resolve(contract)
        })
    })


}
