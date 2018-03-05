const logger = require('../../../utils/logger');
const socketSender = require('../../../core/socketSender');

let instance;

class BlockChainEventService {

    constructor() { this.events = {}; }

    /**
     * проверяет есть ли не завершенные транзакции в блокчайне
     * @param userId
     * @returns {boolean}
     */
    hasTransactions(userId) {
        if (this.events[userId]) {
            return this.events[userId].length > 0;
        }
        return false;
    }

    /**
     * создает новуый евент транзакции в блокчейне
     * @param userId
     * @param event
     * @param desc
     */
    set(userId, event, desc) {
        if (!this.events[userId])
            this.events[userId] = {};

        this.events[userId][event] = desc;
        this.sendData(userId);
    }

    /**
     * говорит что транзакция завершена
     * @param userId
     * @param event
     */
    unset(userId, event) {
        if (this.events[userId] && this.events[userId][event]) {
            delete this.events[userId][event];

            this.sendData(userId);
            return true;
        }

        logger.error(`Blockchain error. Can not find events by given userId: ${userId}.`);
        return false;
    }

    sendData(userId) {
        let data = { contracts: this.events[userId] };

        if (Object.keys(this.events[userId]).length == 0)
            data = { success: true };

        socketSender.sendSocketMessage(`${userId}:blockchain`, data);
    }
}

instance = new BlockChainEventService();

module.exports = instance;