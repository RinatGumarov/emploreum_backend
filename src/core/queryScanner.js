"use strict";

const fs = require('fs');
const path = require('path');

let queryScannerInstance;

class QueryScanner {


    constructor() {
        this.queries = {};
    }

    scanQueries(moduleName, queriesPath) {
        return fs.readdirSync(queriesPath).filter(function (queryFileName) {
            let filePath = path.resolve(queriesPath, queryFileName);
            return path.parse(filePath).ext === '.sql';
        }).forEach((queryFileName) => {
            let queryName = path.parse(queryFileName).name.replace(/-/g, "_");
            let filePath = path.resolve(queriesPath, queryFileName);
            if (!this[moduleName]) {
                this[moduleName] = {};
            }
            this[moduleName][queryName] = fs.readFileSync(filePath).toString().split(String.fromCharCode(10)).join(" ");
        });
    }

}

// singelton
if (typeof queryScannerInstance !== QueryScanner) {
    queryScannerInstance = new QueryScanner();
}

module.exports = queryScannerInstance;
