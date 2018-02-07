"use strict";
const path = require('path');

const ModuleClass = require('../../core/module');

const middlewaresPath = path.resolve(__dirname, "middlewares");
const modelsPath = path.resolve(__dirname, "models");

var module = new ModuleClass("employee", null, null, modelsPath);
module.init();