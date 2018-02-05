"use strict";
const path = require('path');

const ModuleClass = require('../../core/module');

const controllersPath = path.resolve(__dirname, "controllers");
const modelsPath = path.resolve(__dirname, "models");

var module = new ModuleClass("info", controllersPath, null, modelsPath);
module.init();