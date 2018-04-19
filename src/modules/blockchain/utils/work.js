const logger = require('../../../utils/logger');
const config = require('../../../../public_configs/gas_amounts');
const contractUtil = require('./contract');
const account = require('./account');
const web3 = require('./web3');
let instance;


class Work {

    readWorkContract(address) {
        let contractInfo = require('./abi/Work.json');
        return contractUtil.readContractFromAddress(contractInfo, address);
    }

    /**
     *  Create contract in blockchain by main contract.
     *
     * @param work
     * @returns {Promise.<TResult>}
     */
    createWork(work) {
        //TODO add gas estimation for max skillCodes and skillToPosition
        let gas = config.create_work_gas_amount;
        var contractInfo = require('./abi/Work.json');

        return contractUtil.createContract(contractInfo, gas, 1, work.skillCodes,
            work.duration, work.employee, work.employeeContractAddress, work.company, work.companyContractAddress,
            work.weekPayment
        )
            .then(contract => {
                this.contractListener(contract);
                logger.log(`Work contract created: ${contract}`);
                return contract;
            });
    }

    start(workAddress, value, privateKey, callback = logger.log) {
        let gas = config.work_start_transaction_gas_amount;
        let contractInfo = require('./abi/Work.json');

        let contract = new web3.eth.Contract(contractInfo.abi, workAddress);
        let data = contract.methods.start()
            .encodeABI();

        return account.sendTransaction(value, workAddress, privateKey, callback, 1, { gas, data })
            .then(data => {
                logger.log(`Contract ${workAddress} starting work now!`);
                logger.log(`'Transaction hash: ', ${data.transactionHash}`);
                return data;
            });
    }

    deposit(workAddress, value, privateKey, callback = logger.log) {
        //TODO
        let gas = config.create_contract_gas_amount;
        let contractInfo = require('./abi/Work.json');


        let contract = new web3.eth.Contract(contractInfo.abi, workAddress);
        let data = contract.methods.deposit()
            .encodeABI();

        return account.sendTransaction(value, workAddress, privateKey, callback, 1, { gas, data })
            .then(data => {
                logger.log(`Send deposite to ${workAddress} contract!`);
                logger.log(data);
                logger.log(`'transaction hash: ', ${data.transactionHash}`);
                return data;
            });
    }

    sendWeekSalary(workAddress, hours, value, privateKey, callback) {
        let gas = config.send_week_salary_gas_amount;
        let contractInfo = require('./abi/Work.json');

        let contract = new web3.eth.Contract(contractInfo.abi, workAddress);
        let data = contract.methods.sendWeekSalary(hours)
            .encodeABI();

        return account.sendTransaction(value, workAddress, privateKey, callback, 1, { gas, data })
            .then(data => {
                logger.log(`Week payment send to ${workAddress} contract!`);
                logger.log(`'transaction hash: ', ${data.transactionHash}`);
                return data;
            });
    }

    solveFrizzing(workAddress, value, privateKey, callback = logger.log) {
        //TODO
        let gas = config.create_contract_gas_amount;
        let contractInfo = require('./abi/Work.json');

        let contract = new web3.eth.Contract(contractInfo.abi, workAddress);
        let data = contract.methods.solveFrizzing()
            .encodeABI();

        return account.sendTransaction(value, workAddress, privateKey, callback, 1, { gas, data })
            .then(data => {
                logger.log(`Contract ${workAddress} start working!`);
                logger.log(data);
                logger.log(`'transaction hash: ', ${data.transactionHash}`);
                return data;
            });
    }

    solveDispute(workAddress, winner) {
        //TODO
        let gas = config.solve_dispute_gas_amount;
        let contractInfo = require('./abi/Work.json');

        return contractUtil.readContractFromAddress(contractInfo, workAddress)
            .then(contract => {
                return contract.solveDispute(winner, { gas });
            })
            .then(data => {
                logger.log(`Contract ${workAddress} finished with dispute. Winner: ${winner}.`);
                logger.log(data);
                logger.log(`'transaction hash: ', ${data.transactionHash}`);
                return data;
            });
    }

    finish(workAddress) {
        //TODO
        let gas = config.create_contract_gas_amount;
        let contractInfo = require('./abi/Work.json');

        return contractUtil.readContractFromAddress(contractInfo, workAddress)
            .then(contract => {
                return contract.finish();
            })
            .then(data => {
                logger.log(`Contract ${workAddress} finished!`);
                logger.log(data);
                logger.log(`'transaction hash: ', ${data.transactionHash}`);
                return data;
            });
    }

    getWorkData(workAddress) {
        //TODO
        let gas = config.create_contract_gas_amount;
        let contractInfo = require('./abi/Work.json');

        return contractUtil.readContractFromAddress(contractInfo, workAddress)
            .then(contract => {
                return contract.getWorkData();
            })
            .then(data => {
                logger.log(`Data from work with address: ${workAddress}!`);
                logger.log(data);
                return data;
            });
    }

    async contractListener(address, contractType) {
        let events = (await this.getWorkData(address)).allEvents();
        events.watch((err, data) => {
            console.log(`employee date ${data.event}: ${data.args.index} ${data.args.data}`);
        });
    }
}


instance = new Work();
module.exports = instance;

