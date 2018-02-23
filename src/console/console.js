//файл для создания консольных програм  (порядок строк важен!)
const app = require("../core/app");
require("../modules");
const minimist = require('minimist');
const path = require('path');
const fs = require('fs');
const logger = require("../utils/logger");

let consoleInstance;

class Console {
    scanScriptDir(scriptDir = `${__dirname}/scripts`) {
        fs.readdirSync(scriptDir).filter(function (scriptFileName) {
            let filePath = path.resolve(scriptDir, scriptFileName);
            return path.parse(filePath).ext === '.js';
        }).forEach((scriptFileName) => {
            let filePath = path.resolve(scriptDir, scriptFileName);
            let shortFileName = path.parse(filePath).name;
            this.scriptsObj[shortFileName] = require(filePath);
        });
    }
    
    constructor() {
        this.scriptsObj = [];
        this.arg = minimist(process.argv.slice(2));
        this.scanScriptDir();
        if (!this.arg["s"]) {
            logger.error("-s flag does not exist");
            process.exit()
        }
        if (!this.scriptsObj[this.arg["s"]]) {
            logger.error("script not found");
            process.exit()
        }
        this.scriptsObj[this.arg["s"]].run();
    }
    
}

// singelton
if (typeof consoleInstance !== Console) {
    consoleInstance = new Console();
}

module.exports = consoleInstance;