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
    
    changeBonusRating(address, newRating) {
        return this.readEmployeeContract(address)
            .then(instance => instance.changeBonusRating(newRating))
            .then(data => {
                logger.log(`Employee ${address} bonus rating is changed!`);
                logger.log(`'transaction hash: ', ${data.transactionHash}`);
                return data;
            });
    }
    
    changeTestRating(address, testCode, newRating, skillCode) {
        return this.readEmployeeContract(address)
            .then(instance => instance.changeTestRating(testCode, newRating, skillCode))
            .then(data => {
                logger.log(`Employee ${address} test rating is changed!`);
                logger.log(`'transaction hash: ', ${data.transactionHash}`);
                return data;
            });
    }
    
    dispute(address, work) { }
    
    changeEmployeeAddress(address, employeeAddress) {}
    
    finishWork(address, work) {}
    
    getSkills(address) {
        return this.readEmployeeContract(address)
            .then(instance => instance.getSkills())
            .then(data => {
                data = data.filter(obj => obj);
                logger.log(`Employee ${address} skills: ${data}`);
                return data;
            });
    }
    
    getSkillRatingBySkillCode(address, skillCode) {
        return this.readEmployeeContract(address)
            .then(instance => instance.getSkillRatingBySkillCode(skillCode))
            .then(data => {
                logger.log(`Employee ${address} skill ${skillCode} rating: ${data}`);
                return data.div(1000000).toString();
            });
    }
    
    getSkillHistory(address, skillCode) {
        return this.readEmployeeContract(address)
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
            });
    }
    
    getWorks(address) {
        return this.readEmployeeContract(address)
            .then(instance => instance.getWorks())
            .then(data => {
                data = data.filter(obj => obj);
                logger.log(`Employee ${address} works: ${data}`);
                return data;
            });
    }
    
}

instance = new Employee();

module.exports = instance;
