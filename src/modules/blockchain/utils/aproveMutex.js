let instance;
const logger = require('../../../utils/logger');
const hashFromObject = require('object-hash');

const generateHash = function (companyId, employeeId, vacancyId) {
    if (!companyId && employeeId && vacancyId)
        throw new TypeError('Mutex parameters error');

    return hashFromObject({ companyId, employeeId, vacancyId });
};

class Mutex {
    constructor() {
        this.currentCalls = {};
    }

    addMutex(companyId, employeeId, vacancyId) {
        let hash = generateHash(companyId, employeeId, vacancyId);

        if (!this.currentCalls[hash]) {
            this.currentCalls[hash] = true;
            return true;
        }

        return false;
    }

    removeMutex(companyId, employeeId, vacancyId) {
        let hash = generateHash(companyId, employeeId, vacancyId);

        if (this.currentCalls[hash]) {
            delete this.currentCalls[hash];
            return true;
        }

        logger.error('Mutex error. Suspicion of repeated request.');
        return false;
    }
}

instance = new Mutex();

module.exports = instance;