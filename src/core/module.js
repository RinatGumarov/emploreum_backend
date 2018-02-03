"use strict";

const fs = require('fs');
const path = require('path');
const app = require('./app');
const models = require('./models');

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
            app.getServer().use(`/${this.moduleName}`, initFunc(this.router));
        });
    }

    initModels(pathToModels) {

        fs.readdirSync(pathToModels).filter(function (filename) {
            let filePath = path.resolve(pathToModels, filename);
            return path.parse(filePath).ext === '.js';
        }).forEach((filename) => {
            models.addModel(path.join(pathToModels, filename));
        });

    }

    constructor(moduleName, pathToControllers, pathToMiddlewares, pathToModels) {
        if (!moduleName) {
            throw new Error('не передано название модуля');
        }
        this.moduleName = moduleName;
        this.pathToControllers = pathToControllers;
        this.pathToMiddlewares = pathToMiddlewares;
        this.pathToModels = pathToModels;
        this.db = {};
    }

    init() {
        this.router = app.getRouter();
        if (this.pathToMiddlewares) {
            this.initFiles(this.pathToMiddlewares);
        }
        if (this.pathToControllers) {
            this.initFiles(this.pathToControllers);
        }
        if (this.pathToModels) {
            this.initModels(this.pathToModels);
        }
    }
};
