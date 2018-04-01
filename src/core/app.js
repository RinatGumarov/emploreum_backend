"use strict";

const express = require('express');
const config = require('../utils/config');
const MiddlewaresIniter = require('./middlewaresIniter');
const models = require("./models");
const fileSystem = require("./fileSystem");
const socketSender = require("./socketSender");
const ip = require('ip');
let appInstance;

class Application {
    
    /**
     *
     * @param withFileSystemInit
     */
    constructor() {
        fileSystem.init();
        this.config = config.get("server");
        this.express = express;
        this.server = this.express();
        this.port = process.env.PORT || this.config.port;
        this.host = process.env.HOST || this.config.host;
        this.middlewaresIniter = new MiddlewaresIniter(this.server, this.express);
        // добавление на все роуты фильторв для корректировки запросов
        this.middlewaresIniter.correctRequest();
        models.initModels(`${__dirname}/../models/`);
        //инициализация ассоциаций в моделях
        models.associateModels();
    }
    
    /**
     * аргумент withFileSystemInit нужен для тестов
     */
    start() {
        let logger = require("../utils/logger");
        this.server = socketSender.init(this.server);
        this.server.listen(this.port, (err) => {
            if (err) {
                logger.log(err)
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

appInstance = new Application();
module.exports = appInstance;
