const fs = require('fs');
const mkdirp = require('mkdirp');
const config = require('../utils/config');

let instance;

class FileSystem {
    
    constructor() {
        this.folders = [];
        this.files = [];
        this.folders.push(process.env.upload_dir || config.get("file").upload_dir);
        this.files.push(process.env.upload_dir || config.get("file").log_file);
        this.files.push(process.env.upload_dir || config.get("file").log_error_file);
    }
    
    init() {
        for (let i = 0; i < this.folders.length; i++) {
            if (!fs.existsSync(this.folders[i])) {
                mkdirp(this.folders[i]);
            }
        }
        
        for (let i = 0; i < this.files.length; i++) {
            if (!fs.existsSync(this.folders[i])) {
                fs.appendFile(this.files[i]);
            }
        }
    }
}


instance = new FileSystem();
module.exports = instance;