"use strict";
const app = require("../../../core/app");
const io = require('socket.io');
const http = require('http');
let socketInstance;

class SocketService {


    constructor() {
        this.server = app.getServer();
        this.socket = io(http.Server(this.server));
    }

    sendSocketMessage(chatId, object) {

        this.socket.on('connection', function (socket) {
            socket.emit(chatId, object);
        });
    }

}

// singelton
if (typeof socketInstance !== SocketService) {
    socketInstance = new SocketService();
}

module.exports = socketInstance;
