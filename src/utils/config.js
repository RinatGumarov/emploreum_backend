"use strict";

const fs = require('fs');
const path = require('path');

var configInstance;

class Config {

    /**
     * @param configName:string
     * @returns {*}
     * возврашает конфиг по имени
     */
    get(configName) {
        return this.config[configName];
    }

    /**
     * @param patToConfig:string
     * считывает указанную папку и достает от туда конфиги
     * с расширением .json
     */
    constructor(patToConfig = `${__dirname}/../../configs/`) {

        this.config = {};

        fs.readdirSync(patToConfig).filter(function (configName) {

            let filePath = path.resolve(patToConfig, configName);
            return path.parse(filePath).ext === '.json';

        }).forEach((configName) => {

            let pathToConfigFile = path.resolve(patToConfig, configName);
            let configStr = fs.readFileSync(pathToConfigFile);
            // имя файла без расширения
            let filename = path.parse(pathToConfigFile).name;
            this.config[filename] = JSON.parse(configStr);

        });

    }
}

// singelton
if (typeof configInstance != Config) {
    configInstance = new Config();
}

module.exports = configInstance;
