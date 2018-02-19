const logger = require('../../../utils/logger');
const socketSender = require('../../../core/socketSender');
let instance;

class BlockChainEventService {
    
    constructor() {
        this.events = {};
    }
    
    /**
     * проверяет есть ли не завершенные транзакции в блокчайне
     * @param userId
     * @returns {boolean}
     */
    isLoad(userId) {
        if (this.events[userId]) {
            return this.events[userId].length > 0
        }
        return false;
    }
    
    /**
     * создает новуый евент транзакции в блокчейне
     * @param userId
     * @param event
     */
    set(userId, event) {
        if (!this.events[userId]) {
            this.events[userId] = [];
        }
        this.events[userId].push(event);
        let contracts = this.get(userId);
        socketSender.sendSocketMessage(`${userId}:blockchain`, {
            success: false,
            contracts: contracts
        });
    }
    
    /**
     * говорит что транзакция завершена
     * @param userId
     * @param event
     */
    unset(userId, event) {
        if (!this.events[userId]) {
            let eventIndex = this.events[userId].indexOf(event);
            // если такой эвент еще идет и мы говорим что он закончился
            if (eventIndex != -1) {
                delete this.events[userId][eventIndex];
                if (this.events[userId].length == 0) {
                    socketSender.sendSocketMessage(`${userId}:blockchain`, {
                        success: true
                    });
                    delete this.events[userId];
                }
            }
        }
    }
    
    /**
     * отдает все незавершенные транзакции
     * @param userId
     * @returns {null}
     */
    get(userId) {
        return (this.events[userId]) ? this.events[userId] : null;
    }
}

if (typeof instance !== BlockChainEventService) {
    instance = new BlockChainEventService();
}

module.exports = instance;