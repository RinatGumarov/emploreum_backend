const fs = require('fs');
const mkdirp = require('mkdirp');
const config = require('../utils/config');
const logger = require('../utils/logger');

let instance;

class FileSystem {
    
    constructor() {
        this.folders = [];
        this.folders.push(process.env.log_dir || config.get("file").log_dir);
        this.folders.push(process.env.upload_dir || config.get("file").upload_dir);
    }
    
    init() {
        this.folders.forEach(directory => {
            if (!fs.existsSync(directory)) {
                mkdirp(directory, function () {
                    logger.log("Filse system is initilized.");
                });
            }
        }
    }
}


instance = new FileSystem();
module.exports = instance;
