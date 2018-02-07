const config = require('../../../utils/config');
const multer = require('multer');
const path = require('path');
const randomstring = require('randomstring');

let instance;

class UploadIniter {

    constructor() {

        let uploadDir = process.env.upload_dir || config.get("file").upload_dir;
        this.storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, uploadDir)
            },
            filename: function (req, file, cb) {
                let extension = path.parse(file.originalname).ext;
                let filename = randomstring.generate({length: 10});
                cb(null, filename + extension)
            }
        });
        this.middleware = multer({storage: this.storage});

    }

    getMiddleware() {
        return this.middleware;
    }
}

if (typeof instance !== UploadIniter)
    instance = new UploadIniter();

module.exports = instance;