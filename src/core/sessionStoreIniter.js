"use strict";
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const configUtil = require('../utils/config');


let instance;

class sessionStoreIniter {
    
    
    constructor() {
        let configDb = configUtil.get("database").production;
        let dbUser = configDb.username;
        let dbPassword = configDb.password;
        let dbName = configDb.database;
        let dbHost = configDb.host;
        let dbPort = configDb.port;
        this.store = new pgSession({
            conString: `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`
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
