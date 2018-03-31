let instance;
const logger = require('../../../utils/logger');
const contractUtil = require('./contract');


class Employee {
    readWorkContract(address) {
        let contractInfo = require('./abi/Employee.json');
        return contractUtil.readContractFromAddress(contractInfo, address);
    }

    changeBonusRating(address, newRating) {
        return this.readWorkContract(address).then(instance => {
            return instance.changeBonusRating(newRating);
        }).then(data => {
            logger.log(`Employee ${address} bonus rating is changed!`);
            logger.log(`'transaction hash: ', ${data.transactionHash}`);
            return data;
        });
    }

    changeSkillRating(address, skillCode, newRating) {
        return this.readWorkContract(address).then(instance => {
            return instance.changeSkillRating(skillCode, newRating);
        }).then(data => {
            logger.log(`Employee ${address} skill rating is changed!`);
            logger.log(`'transaction hash: ', ${data.transactionHash}`);
            return data;
        });
    }

    changeTestRating(address, testCode, newRating) {
        return this.readWorkContract(address).then(instance => {
            return instance.changeTestRating(testCode, newRating);
        }).then(data => {
            logger.log(`Employee ${address} test rating is changed!`);
            logger.log(`'transaction hash: ', ${data.transactionHash}`);
            return data;
        });
    }

    calculateRating(address) {
        return this.readWorkContract(address).then(instance => {
            return instance.calculateRating();
        }).then(data => {
            logger.log(`Employee ${address} rating: ${data}`);
            return data;
        });
    }

    dispute(address, work) { }

    changeEmployeeAddress(address, employeeAddress) {}

    finishWork(address, work) {}

    addWork(address, work, company) {}
}

instance = new Employee();

module.exports = instance;
