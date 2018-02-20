"use strict";
const io = require('socket.io')();
const http = require('http');
const logger = require('../utils/logger');
const passportSocketIo = require("passport.socketio");
const configUtil = require('../utils/config');
const cookieParser = require('cookie-parser');
const sessionStoreIniter = require('./sessionStoreIniter');

let socketSenderInstance;

class SocketSender {
    
    constructor() {
        this.funcOnUserConnecting = [];
    };
    
    addConnectingFunction(func) {
        this.funcOnUserConnecting.push(func)
    }
    
    init(server) {
        
        let configSession = configUtil.get("session");
        let newServer = http.Server(server);
        
        io.attach(newServer);
        
        io.use(passportSocketIo.authorize({
            cookieParser: cookieParser,
            secret: configSession.secret,
            key: 'express.sid',
            store: sessionStoreIniter.getStore(),
        }));
        
        let meSocketSender = this;
        io.on('connection', function (socket) {
            if (socket.request.user) {
                let userId = socket.request.user.id;
                for (let i = 0; i < meSocketSender.funcOnUserConnecting.length; i++) {
                    let func = meSocketSender.funcOnUserConnecting[i];
                    func(userId, socket)
                }
                logger.log(userId + " socket connected")
            }
        });
        
        return newServer;
    }
    
    sendSocketMessage(chatId, object) {
        logger.log("поссылка " + chatId + " " + object);
        io.emit(chatId, object);
    }
    
}

// singelton
if (typeof socketSenderInstance !== SocketSender) {
    socketSenderInstance = new SocketSender();
}

module.exports = socketSenderInstance;
