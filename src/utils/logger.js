"use strict";

const chalk = require('chalk');
const fs = require('fs');
const config = require('../utils/config');

let loggerInstance;

class Logger {

    constructor() {
        let logsDir = process.env.LOG_FILE || config.get("file").log_file;
        let errorDir = process.env.LOG_ERROR_FILE || config.get("file").log_error_file;

        let access = fs.createWriteStream(logsDir, {flags: 'a'});
        let error = fs.createWriteStream(errorDir, {flags: 'a'});

        // redirect stdout / stderr
        process.stdout.pipe(access);
        process.stderr.pipe(error);

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
