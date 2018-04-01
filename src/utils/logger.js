"use strict";

const chalk = require('chalk');
const fs = require('fs');

let loggerInstance;

class Logger {
    
    constructor() {
        console.log("Logger init " + chalk.green('✓'));
        let dir = '../../logs/';
        let access = fs.createWriteStream(dir + '/log.txt', { flags: 'a' })
              , error = fs.createWriteStream(dir + '/error.txt', { flags: 'a' });

        // redirect stdout / stderr
        proc.stdout.pipe(access);
        proc.stderr.pipe(error);
    }
    
    /**
     * @param err
     * метод для логирования ошибок
     */
    error(err) {
        if (process.env.NODE_ENV !== "test") {
            console.error(chalk.red(err));
        }
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

