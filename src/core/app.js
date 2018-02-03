"use strict";

const express = require('express');
const logger = require('../utils/logger');
const config = require('../utils/config');
const models = require("./models");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const ip = require('ip');
const cors = require('./middlewares/cors');
let appInstance;

class Application {

    initReqRes() {
        this.server.use(cors);
        console.log('cors finished');
        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({ extended: false }));
        this.server.use(cookieParser());
        this.server.use(session({
            secret: 'keyboard cat',
        }));
        this.server.use(passport.initialize());
        this.server.use(passport.session());
    }

    constructor() {

        this.config = config.get("server");
        this.express = express;

        this.server = this.express();
        this.port = this.config.port;
        this.host = this.config.host;

        this.initReqRes();
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
