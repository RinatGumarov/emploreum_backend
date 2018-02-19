"use strict";
const path = require('path');
const socketSender = require('../../core/socketSender');
const blockChainEventService = require('./services/blockChainEventService');

const ModuleClass = require('../../core/module');
const controllersPath = path.resolve(__dirname, "controllers");

var module = new ModuleClass("blockchain", controllersPath);

/**
 * устанавливаем фукнции которые должны выполниться при конекте пользователя к сокету
 */
socketSender.addConnectingFunction(function (userId, socket) {
    let isLoad = blockChainEventService.isLoad(userId);
    if (isLoad) {
        socket.emit(`${userId}:blockchain`, true)
    }
});

module.init();
