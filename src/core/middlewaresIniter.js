const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('./middlewares/cors');
const configUtil = require('../utils/config');
const sessionStoreIniter = require('./sessionStoreIniter');


module.exports = class MiddlewaresIniter {
    
    constructor(server, express) {
        this.server = server;
        this.express = express;
    }
    
    correctRequest() {
        let configSession = configUtil.get("session");
        this.server.use(this.express.static('public'));
        this.server.use(cors);
        this.server.use(bodyParser.json({limit: '10mb'}));
        this.server.use(bodyParser.urlencoded({
            extended: true,
            limit: '10mb'
        }));
        this.server.use(cookieParser());
        this.server.use(session({
            key: 'express.sid',
            secret: configSession.secret,
            store: sessionStoreIniter.getStore(),
            resave: false,
        }));
        this.server.use(passport.initialize());
        this.server.use(passport.session());
    }
};