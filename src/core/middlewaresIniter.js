const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('./middlewares/cors');
const config = require('../utils/config');

module.exports = class MiddlewaresIniter {

    constructor(server) {
        this.server = server;
    }

    correctRequest() {

        this.server.use(cors);
        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({extended: false}));
        this.server.use(cookieParser());
        this.server.use(session({
            secret: 'keyboard cat'
        }));
        this.server.use(passport.initialize());
        this.server.use(passport.session());
    }
}