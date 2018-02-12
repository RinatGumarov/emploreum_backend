"use strict";

const Sequelize = require('sequelize');
const config = require('../utils/config');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

let modelsInstance;

class Models {

    associateModels() {
        Object.keys(this).forEach((modelName) => {
            if (this[modelName].associate) {
                this[modelName].associate(this);
            }
        });
    }

    addModel(pathToModel) {

        logger.log(`Инициализирую ${pathToModel} модель`);
        const model = this.sequelize.import(pathToModel);
        this[model.name] = model;
    }


    initModels(pathToModels) {
        let me = this;
        fs.readdirSync(pathToModels).filter(function (filename) {
            let filePath = path.resolve(pathToModels, filename);
            return path.parse(filePath).ext === '.js';
        }).forEach((filename) => {
            me.addModel(path.join(pathToModels, filename));
        });
    }

    constructor() {
        let dbConfig = config.get('database');
        let databaseConfig = {};
        if (dbConfig)
            databaseConfig = dbConfig.production;
        let url = process.env.DATABASE_URL || databaseConfig.url;
        this.dbModel = {};
        if (url) {
            this.sequelize = new Sequelize(url);
        } else {
            this.sequelize = new Sequelize(
                databaseConfig.database,
                databaseConfig.username,
                databaseConfig.password,
                databaseConfig
            );
        }

    }
}

// singelton
if (typeof modelsInstance !== Models) {
    modelsInstance = new Models();
}

module.exports = modelsInstance;