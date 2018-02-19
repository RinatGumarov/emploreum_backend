"use strict";
const io = require('socket.io')();
const http = require('http');
const logger = require('../utils/logger');
const passportSocketIo = require("passport.socketio");
const configUtil = require('../utils/config');
const cookieParser = require('cookie-parser');

let socketSenderInstance;

class SocketSender {
    
    constructor() {
        this.funcOnUserConnecting = [];
    };
    
    addConnectingFunction(func) {
        this.funcOnUserConnecting.push(func)
    }
    
    init(server) {
        let config = configUtil.get("session");
        let newServer = http.Server(server);
        
        io.attach(newServer);
        
        io.use(passportSocketIo.authorize({
            cookieParser: cookieParser,
            key: config.secret,
            success: function (data, accept) {
    
                accept(null, true);
                
                // if (socket.request.session.passportые) {
                //     let userId = socket.request.session.passport.user.id;
                //     for (let i = 0; i < this.funcOnUserConnecting.length; i++) {
                //         let func = this.funcOnUserConnecting[i];
                //         func(userId, socket)
                //     }
                //     logger.log(userId + " socket connected")
                // }
            },
        }));
        
        
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
