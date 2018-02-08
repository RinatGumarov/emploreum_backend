"use strict";
const path = require('path');

const ModuleClass = require('../../core/module');
const middlewaresPath = path.resolve(__dirname, "middlewares");

var module = new ModuleClass("file", null, middlewaresPath);
module.init();