"use strict";

const chalk = require('chalk');
let loggerInstance;

class Logger {
    
    constructor() {
        console.log("Logger init " + chalk.green('✓'));
    }
    
    /**
     * @param err
     * метод для логирования ошибок
     */
    error(err) {
        console.error(chalk.red(err));
    }
    
    /**
     * @param msg
     * метод для записи логов не связанных с ошибками
     */
    log(msg) {
        if (process.env.NODE_ENV !== "test") {
            console.log(msg)
        }
    }
}

loggerInstance = new Logger();
module.exports = loggerInstance;

