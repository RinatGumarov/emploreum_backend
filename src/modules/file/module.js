"use strict";
const path = require('path');

const ModuleClass = require('../../core/module');
const middlewaresPath = path.resolve(__dirname, "middlewares");
const apiTestPath = path.resolve(__dirname, "test/api");

var module = new ModuleClass("file", null, middlewaresPath,apiTestPath);
module.init();