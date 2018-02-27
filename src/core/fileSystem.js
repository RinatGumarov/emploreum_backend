const fs = require('fs');
const mkdirp = require('mkdirp');
const config = require('../utils/config');
const logger = require('../utils/logger');

let instance;

class FileSystem {
    
    constructor() {
        this.uploadDir = process.env.upload_dir || config.get("file").upload_dir;
    }
    
    init() {
        if (!fs.existsSync(this.uploadDir)) {
            mkdirp(this.uploadDir, function () {
                logger.log("файловая система инициализирована");
            });
        }
    }
}


instance = new FileSystem();
module.exports = instance;