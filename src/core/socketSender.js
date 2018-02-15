"use strict";
const io = require('socket.io')();
const http = require('http');
const logger = require('../utils/logger');

let socketSenderInstance;

class SocketSender {


    // toDo
    init(server) {
        let newServer = http.Server(server);
        io.on('connection', function (socket) {
            socket.on('message', function (data) {
                logger.log(data);
                let companyId = data.companyId;
                let userId = data.userId;
                socket.emit(companyId, {
                    userName: userId
                });
            });
        });
        io.attach(newServer);
        return newServer;
    }

}

// singelton
if (typeof socketSenderInstance !== SocketSender) {
    socketSenderInstance = new SocketSender();
}

module.exports = socketSenderInstance;
