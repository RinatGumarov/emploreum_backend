"use strict";
const io = require('socket.io')();
const http = require('http');
const logger = require('../utils/logger');

let socketSenderInstance;

class SocketSender {


    init(server) {
        let newServer = http.Server(server);
        io.on('connection', function (socket) {
            logger.log("user connected")
        });
        io.attach(newServer);
        return newServer;
    }

    sendSocketMessage(chatId, object) {
        console.log(chatId+" посылка сообщения в чат");
        io.on('connection', function (socket) {
            logger.log(object);
            socket.emit(chatId, object);
        });
    }

}

// singelton
if (typeof socketSenderInstance !== SocketSender) {
    socketSenderInstance = new SocketSender();
}

module.exports = socketSenderInstance;
