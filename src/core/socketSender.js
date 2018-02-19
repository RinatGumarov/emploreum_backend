"use strict";
const io = require('socket.io')();
const http = require('http');
const logger = require('../utils/logger');
const session = require('express-session');

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
            if (socket.request.session.passportые) {
                let userId = socket.request.session.passport.user.id;
                for (let i = 0; i < this.funcOnUserConnecting.length; i++) {
                    let func = this.funcOnUserConnecting[i];
                    func(userId, socket)
                }
                logger.log(userId + " socket connected")
            }
        });
        io.attach(newServer);
        io.use(function (socket, next) {
            /**
             * сделано для испоьзования passport в сокетах
             */
            session({
                secret: 'keyboard cat'
            })(socket.request, {}, next);
        });
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
