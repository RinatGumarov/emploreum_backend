let instance;
const logger = require('../../../utils/logger');
const contractUtil = require('./contract');


class Employee {
    readEmployeeContract(address) {
        let contractInfo = require('./abi/Employee.json');
        return contractUtil.readContractFromAddress(contractInfo, address);
    }

    readWorkContract(address) {
        let contractInfo = require('./abi/Work.json');
        return contractUtil.readContractFromAddress(contractInfo, address);
    }

    changeBonusRating = (address, newRating) =>
        this.readEmployeeContract(address)
            .then(instance => instance.changeBonusRating(newRating))
            .then(data => {
                logger.log(`Employee ${address} bonus rating is changed!`);
                logger.log(`'transaction hash: ', ${data.transactionHash}`);
                return data;
            })
            .catch(err => {
                logger.error(err);
                return false;
            });


    changeTestRating = (address, testCode, newRating, skillCode) =>
        this.readEmployeeContract(address)
            .then(instance => instance.changeTestRating(testCode, newRating, skillCode))
            .then(data => {
                logger.log(`Employee ${address} test rating is changed!`);
                logger.log(`'transaction hash: ', ${data.transactionHash}`);
                return data;
            })
            .catch(err => {
                logger.error(err);
                return false;
            });


    dispute(address, work) { }

    changeEmployeeAddress(address, employeeAddress) {}

    finishWork(address, work) {}

    getSkills = (address) =>
        this.readEmployeeContract(address)
            .then(instance => instance.getSkills())
            .then(data => {
                data = data.filter(obj => obj);
                logger.log(`Employee ${address} skills: ${data}`);
                return data;
            })
            .catch(err => {
                logger.error(err);
                return false;
            });


    getSkillRatingBySkillCode = (address, skillCode) =>
        this.readEmployeeContract(address)
            .then(instance => instance.getSkillRatingBySkillCode(skillCode))
            .then(data => {
                logger.log(`Employee ${address} skill ${skillCode} rating: ${data}`);
                return data;
            })
            .catch(err => {
                logger.error(err);
                return false;
            });


    getSkillHistory = (address, skillCode) =>
        this.readEmployeeContract(address)
            .then(instance => instance.getSkillHistory(skillCode))
            .then(history =>
                Promise.all(
                    history
                        .filter(obj => obj)
                        .map(workAddress => this.readWorkContract(workAddress))
                )
            )
            .then(workIncenses => {
                const promises = workIncenses.map(work => work.getWorkData());
                return Promise.all(promises);
            })
            .then(data => {
                logger.log(`Employee ${address} skill ${skillCode} history: ${data}`);
                return data;
            })
            .catch(err => {
                logger.error(err);
                return false;
            });


    getWorks = (address) =>
        this.readEmployeeContract(address)
            .then(instance => instance.getWorks())
            .then(data => {
                data = data.filter(obj => obj);
                logger.log(`Employee ${address} works: ${data}`);
                return data;
            })
            .catch(err => {
                logger.error(err);
                return false;
            });


}

instance = new Employee();

module.exports = instance;
