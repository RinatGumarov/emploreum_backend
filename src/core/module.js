"use strict";

const fs = require('fs');
const path = require('path');
const app = require('./app');
const queryScanner = require('./queryScanner');

/**
 * клас модулей
 * @type {Module}
 */
module.exports = class Module {


    /**
     * считывает папку
     * и подключает js файлы
     * @param pathToFiles
     */
    initFiles(pathToFiles) {
        fs.readdirSync(pathToFiles).filter(function (filename) {
            let filePath = path.resolve(pathToFiles, filename);
            return path.parse(filePath).ext === '.js';
        }).forEach((filename) => {

            let initFunc = require(path.resolve(pathToFiles, filename)).func;
            if (typeof initFunc === "function") {
                app.getServer().use(`/${this.moduleName}`, initFunc(this.router));
            }
        });
    }

    constructor(moduleName, pathToControllers, pathToMiddlewares, queriesPath) {
        if (!moduleName) {
            throw new Error('не передано название модуля');
        }
        this.moduleName = moduleName;
        this.pathToControllers = pathToControllers;
        this.pathToMiddlewares = pathToMiddlewares;
        this.queriesPath = queriesPath;
    }

    init() {
        this.router = app.getRouter();

        if (this.pathToMiddlewares) {
            this.initFiles(this.pathToMiddlewares);
        }

        if (this.pathToControllers) {
            this.initFiles(this.pathToControllers);
        }

        if (this.queriesPath) {
            queryScanner.scanQueries(this.moduleName, this.queriesPath);
        }
    }
};
