"use strict";

const fs = require('fs');
const path = require('path');
const models = require('./models');

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
    
    /**
     * метод для парсинга моделей в нативных запросах
     * @param query
     * @param options
     * @returns {Promise<*>}
     */
    async query(query, options) {
        if (options.model) {
            options.hasJoin = true;
            options.model._validateIncludedElements(options);
        }
        return await models.sequelize.query(query, options)
    };
    
}

queryScannerInstance = new QueryScanner();
module.exports = queryScannerInstance;
