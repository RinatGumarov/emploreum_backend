"use strict";

const express = require('express');
const logger = require('../utils/logger');
const config = require('../utils/config');
const MiddlewaresIniter = require('./middlewaresIniter');
const models = require("./models");
const ip = require('ip');
let appInstance;

class Application {


    constructor() {

        this.config = config.get("server");
        this.express = express;
        this.server = this.express();
        this.port = this.config.port;
        this.host = this.config.host;
        this.middlewaresIniter = new MiddlewaresIniter(this.server);
        // добавление нв все роуты фильторв для корректировки запросов
        this.middlewaresIniter.correctRequest();

    }

    start() {
        //инициализация ассоциаций в моделях
        models.associateModels();
        this.server.listen(this.port, this.host, (err) => {
            if (err) {
                return Logger.error(err.message);
            }
            logger.log("Server started");
            logger.log(`Localhost: http://${this.host}:${this.port}`);
            logger.log(`LAN: http://${ip.address()}:${this.port}`);
            logger.log("Press CTRL-C to stop");
        });
    }

    getServer() {
        return this.server;
    }

    getRouter() {
        return this.express.Router();
    }


}

// singelton
if (typeof app !== Application) {
    appInstance = new Application();
}

module.exports = appInstance;
