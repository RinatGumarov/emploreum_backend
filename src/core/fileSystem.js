const fs = require('fs');
const mkdirp = require('mkdirp');
const config = require('../utils/config');

let instance;

class FileSystem {
    
    constructor() {
        this.folders = [];
        this.folders.push(process.env.UPLODA_DIR || config.get('file').upload_dir);
        this.folders.push(process.env.LOG_DIR || config.get('file').log_dir);
    }
    
    init() {
        for (let i = 0; i < this.folders.length; i++) {
            if (!fs.existsSync(this.folders[i])) {
                mkdirp(this.folders[i]);
            }
        }
    }
}


instance = new FileSystem();
module.exports = instance;
