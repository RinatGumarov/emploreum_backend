'use strict';
const path = require('path');
const socketSender = require('../../core/socketSender');
const blockchainEventService = require('./services/blockchainEventService');

const ModuleClass = require('../../core/module');
const controllersPath = path.resolve(__dirname, 'controllers');
const middlewaresPath = path.resolve(__dirname, 'middlewares');

var module = new ModuleClass('blockchain', controllersPath, middlewaresPath);

/**
 * устанавливаем фукнции которые должны выполниться при конекте пользователя к сокету
 */
socketSender.addConnectingFunction(function (userId, socket) {
    if (blockchainEventService.hasTransactions(userId))
        blockchainEventService.sendData(userId);
});

module.init();
