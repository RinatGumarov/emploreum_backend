let instance;
const logger = require('../../../utils/logger');
const hashFromObject = require('object-hash');
const socketSender = require('../../../core/socketSender');

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
        let events = [message];

        if (!this.currentCalls[hash]) {
            this.currentCalls[hash] = { isRun: true, events };
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

    addSocketMessage(uniqueObj, message) {
        let hash = generateHash(uniqueObj);

        if (this.currentCalls[hash]) {
            this.currentCalls[hash].events.push(message);
            return true;
        }

        logger.error(`Mutex error. Can not find call by given uniqueObj: ${uniqueObj}.`);
        return false;
    }

    deleteSocketMessage(uniqueObj, message) {
        let hash = generateHash(uniqueObj);

        if (this.currentCalls[hash]) {
            const index = array.indexOf(element);

            if (index < 0) {
                logger.error(`Mutex error. Can not find messgae by given uniqueObj: ${message}.`);
                return false;
            }

            array.splice(index, 1);
            return true;
        }

        logger.error(`Mutex error. Can not find call by given uniqueObj: ${uniqueObj}.`);
        return false;
    }

    getEventsByObJ(uniqueObj) {
        let hash = generateHash(uniqueObj);
        return this.currentCalls[hash] ? this.currentCalls[hash].events : null
    }

    sendEventsByObj() {
        let hash = generateHash(uniqueObj);

        if (this.currentCalls[hash]) {
            let events = this.currentCalls[hash].events ? this.currentCalls[hash].events : null;
            let success = true;

            socketSender.sendSocketMessage(`${userId}:blockchain`, { events || success});
        }

        return false;
    }
}

instance = new Mutex();

module.exports = instance;
