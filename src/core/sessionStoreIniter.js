"use strict";
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const configUtil = require('../utils/config');


let instance;

class sessionStoreIniter {


    constructor() {
        let configDb;
        let dbUser;
        let dbPassword;
        let dbName;
        let dbHost;
        let dbPort;
        if (configUtil.get("database")) {
            configDb = configUtil.get("database").production;
            dbUser = configDb.username;
            dbPassword = configDb.password;
            dbName = configDb.database;
            dbHost = configDb.host;
            dbPort = configDb.port;
        }
        let urlPath = process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
        this.store = new pgSession({
            conString: urlPath
        });
    }

    getStore() {
        return this.store;
    }


}

// singelton
if (typeof instance !== sessionStoreIniter) {
    instance = new sessionStoreIniter();
}

module.exports = instance;
