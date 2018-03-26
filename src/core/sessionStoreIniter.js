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
        if (configUtil.get("database") && process.env.NODE_ENV !== "test") {
            configDb = configUtil.get("database").production;
        } else {
            configDb = configUtil.get("database").test;
        }
        dbUser = configDb.username;
        dbPassword = configDb.password;
        dbName = configDb.database;
        dbHost = configDb.host;
        dbPort = configDb.port;
        let urlPath = process.env.DATABASE_URL || `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
        this.store = new pgSession({
            conString: urlPath
        });
    }
    
    getStore() {
        return this.store;
    }
    
    
}

instance = new sessionStoreIniter();
module.exports = instance;
