const logger = require('../../../utils/logger');
const socketSender = require('../../../core/socketSender');
let instance;

/**
 * клас отвечающий за контролем транзакций
 * (пример пульсирующая штука в header)
 */
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
     * @param desc
     */
    set(userId, event, desc) {
        if (!this.events[userId]) {
            this.events[userId] = {};
        }
        this.events[userId][event] = desc;
        let contracts = this.get(userId);
        logger.log(`=====================\nsockeTTT!!!!OLOLO\n==================`);
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
        if (this.events[userId] && this.events[userId][event]) {
            // если такой эвент еще идет и мы говорим что он закончился
            delete this.events[userId][event];
            let hasEvents = false;
            if (Object.keys(this.events[userId]).length > 0) {
                hasEvents = true
            }
            if (!hasEvents) {
                socketSender.sendSocketMessage(`${userId}:blockchain`, {
                    success: true
                });
                delete this.events[userId];
            } else {
                let contracts = this.get(userId);
                socketSender.sendSocketMessage(`${userId}:blockchain`, {
                    success: false,
                    contracts: contracts
                });
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

instance = new BlockChainEventService();
module.exports = instance;