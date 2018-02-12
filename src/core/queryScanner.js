"use strict";

const fs = require('fs');
const path = require('path');

let queryScannerInstance;

class QueryScanner{


    constructor() {
        this.queries = {};
    }

    scanQueries(moduleName, queriesPath) {
        return fs.readdirSync(queriesPath).filter(function (queryFileName) {
            let filePath = path.resolve(queriesPath, queryFileName);
            return path.parse(filePath).ext === '.sql';
        }).forEach((queryFileName) => {
            let queryName = path.parse(queryFileName).name;
            let filePath = path.resolve(queriesPath, queryFileName);
            if (!this.queries[moduleName]) {
                this.queries[moduleName] = {};
            }
            this.queries[moduleName][queryName] = fs.readFileSync(filePath).toString().split(String.fromCharCode(10)).join(" ");
        });
    }

    get(moduleName, queryName) {
        return this.queries[moduleName][queryName]
    }

}

// singelton
if (typeof queryScannerInstance !== QueryScanner) {
    queryScannerInstance = new QueryScanner();
}

module.exports = queryScannerInstance;
