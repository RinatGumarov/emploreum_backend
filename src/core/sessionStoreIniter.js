"use strict";
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const configUtil = require('../utils/config');


let instance;

class sessionStoreIniter {
    
    
    constructor() {
        let urlPath;
        if (configUtil.get("database")) {
            let configDb;
            let dbUser;
            let dbPassword;
            let dbName;
            let dbHost;
            let dbPort;
            
            if (process.env.NODE_ENV !== "test") {
                configDb = configUtil.get("database").production;
            } else {
                configDb = configUtil.get("database").test;
            }
            dbUser = configDb.username;
            dbPassword = configDb.password;
            dbName = configDb.database;
            dbHost = configDb.host;
            dbPort = configDb.port;
            urlPath = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
        } else if (process.env.DATABASE_URL) {
            urlPath = process.env.DATABASE_URL;
        } else {
            throw Error("session store initer error");
        }
        
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
