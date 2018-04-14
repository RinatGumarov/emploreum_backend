"use strict";

const chalk = require('chalk');
const fs = require('fs');
const config = require('../utils/config');

let loggerInstance;

class Logger {
    
    /**
     * создать и установить файлы для вывода логов
     */
    createLogsFile() {
        let normalLogFileName = this.createSingleLogFile("normal");
        let errorLogFileName = this.createSingleLogFile("error");
        let access = fs.createWriteStream(normalLogFileName, {flags: 'a'});
        let error = fs.createWriteStream(errorLogFileName, {flags: 'a'});
        process.stdout.pipe(access);
        process.stderr.pipe(error);
    }
    
    
    /**
     * создать файл лога если его нету
     * @param logType
     * @returns {string}
     */
    createSingleLogFile(logType) {
        let filename = `${this.logsDir}/${logType}-${new Date().getTime()}.txt`;
        if (!fs.existsSync(filename)) {
            fs.appendFile(filename);
        }
        
        return filename;
    }
    
    
    constructor() {
        this.logsDir = process.env.LOG_DIR || config.get("file").log_dir;
        this.createLogsFile();
        setInterval(this.createLogsFile, 6000 * 60 * 24)
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
        console.log(msg)
    }
}

loggerInstance = new Logger();
module.exports = loggerInstance;
