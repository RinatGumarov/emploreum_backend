let instance;
const logger = require('../../../utils/logger');
const hashFromObject = require('object-hash');

const generateHash = function (obj) {
    if (Object.keys(obj).length == 0)
        throw new TypeError('Mutex parameters error');

    return hashFromObject(obj);
};

class Mutex {
    constructor() {
        this.currentCalls = {};
    }

    addMutex(uniqueObj, message) {
        let hash = generateHash(uniqueObj);

        if (!this.currentCalls[hash]) {
            this.currentCalls[hash] = true;
            return true;
        }

        return false;
    }

    removeMutex(uniqueObj) {
        let hash = generateHash(uniqueObj);

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
