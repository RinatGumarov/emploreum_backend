const logger = require("../../utils/logger");
let instance;

class Test {
    run() {
        logger.log("pong");
        process.exit()
    }
}

instance = new Test();
module.exports = instance;