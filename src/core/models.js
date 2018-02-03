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
        let databaseConfig = config.get("database").production;
        this.dbModel = {};
        this.sequelize = new Sequelize(
            databaseConfig.database,
            databaseConfig.username,
            databaseConfig.password,
            databaseConfig
        );
    }
}

// singelton
if (typeof app !== Models) {
    modelsInstance = new Models();
}

module.exports = modelsInstance;