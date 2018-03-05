'use strict';
const path = require('path');
const socketSender = require('../../core/socketSender');
const blockChainEventService = require('./services/blockchainEventService');

const ModuleClass = require('../../core/module');
const controllersPath = path.resolve(__dirname, 'controllers');
const middlewaresPath = path.resolve(__dirname, 'middlewares');

var module = new ModuleClass('blockchain', controllersPath, middlewaresPath);

/**
 * устанавливаем фукнции которые должны выполниться при конекте пользователя к сокету
 */
socketSender.addConnectingFunction(function (userId, socket) {
    if (blockChainEventService.hasTransactions(userId))
        blockChainEventService.sendData(userId);
});

module.init();
