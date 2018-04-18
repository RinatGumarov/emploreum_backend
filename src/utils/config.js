"use strict";

const fs = require('fs');
const path = require('path');

let configInstance;

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
     * @param pathToConfig:string
     * считывает указанную папку и достает от туда конфиги
     * с расширением .json
     */
    constructor(pathToConfig = `${__dirname}/../../configs/`) {
        
        this.config = {};
        
        fs.readdirSync(pathToConfig).filter(function (configName) {
            
            let filePath = path.resolve(pathToConfig, configName);
            return path.parse(filePath).ext === '.json';
            
        }).forEach((configName) => {
            
            let pathToConfigFile = path.resolve(pathToConfig, configName);
            let configStr = fs.readFileSync(pathToConfigFile);
            // имя файла без расширения
            let filename = path.parse(pathToConfigFile).name;
            this.config[filename] = JSON.parse(configStr);
            
        });
        
    }
}

configInstance = new Config();
module.exports = configInstance;
