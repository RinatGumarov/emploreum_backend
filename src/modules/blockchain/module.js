"use strict";
const path = require('path');

const ModuleClass = require('../../core/module');
const controllersPath = path.resolve(__dirname, "controllers");

var module = new ModuleClass("blockchain", controllersPath);

module.init();
