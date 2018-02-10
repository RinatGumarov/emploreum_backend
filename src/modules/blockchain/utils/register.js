const readContractFromAddress = require("./contract").readContractFromAddress;
const web3 = require("./contract").web3;
const utilConfig = require("../../../utils/config");
let config = utilConfig.get("web3");

// return promise with address

module.exports.generateCompanyAddress = function (company) {
    let password = generatePassword(company.name);
    return web3.eth.personal.newAccount(password)
        .then(address => {
            console.log('address: ', address, ' generated for employee ', company)
            savePassword(address, password);
            return address
        })
};

// return promise with address

module.exports.generateEmploeeAddress = function (employee) {
    let password = generatePassword(employee.firstName)
    return web3.eth.personal.newAccount(password)
        .then(address => {
            console.log('address: ', address, ' generated for employee ', employee)
            savePassword(address, password)
            return address
        })
}

// TODO
function generatePassword(s) {
    console.log('password generator should be rewritten')
    return web3.utils.keccak256(s)
}

// TODO
function savePassword(address, password) {
    console.log('Misha should write that method')
}

module.exports.registerEmploee = function (employee, address) {
    let path = config.create_contract_path;
    let gas = config.create_contract_gas_count;

    return readContractFromAddress(path, address).then(contract => {
        contract.contract.newEmployee('_firstName', '_lastName', '_email', 1, employee, {gas}).then(data => {
            console.log('employee registeration complite!')
            console.log('transaction hash: ', data.tx)
            return true
        }).catch(err => {
            console.log(err)
            return false
        })
    })
}
