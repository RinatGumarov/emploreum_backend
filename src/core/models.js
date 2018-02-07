"use strict";

const Sequelize = require('sequelize');
const config = require('../utils/config');
const logger = require('../utils/logger');
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