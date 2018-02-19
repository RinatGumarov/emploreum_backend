"use strict";
const io = require('socket.io')();
const http = require('http');
const logger = require('../utils/logger');

let socketSenderInstance;

class SocketSender {
    
    constructor() {
        this.funcOnUserConnecting = [];
    };
    
    addConnectingFunction(func) {
        this.funcOnUserConnecting.push(func)
    }
    
    init(server) {
        
        let newServer = http.Server(server);
        io.on('connection', function (socket) {
            let userId = socket.request.session.passport.user.id;
            for (let i = 0; i < this.funcOnUserConnecting.length; i++) {
                let func = this.funcOnUserConnecting[i];
                func(userId, socket)
            }
            logger.log(userId + " socket connected")
        });
        io.attach(newServer);
        return newServer;
    }
    
    sendSocketMessage(chatId, object) {
        logger.log("поссылка " + chatId + " " + object)
        io.emit(chatId, object);
    }
    
}

// singelton
if (typeof socketSenderInstance !== SocketSender) {
    socketSenderInstance = new SocketSender();
}

module.exports = socketSenderInstance;
