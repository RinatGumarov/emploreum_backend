"use strict";
const path = require('path');

const ModuleClass = require('../../core/module');

const contrillersPath = path.resolve(__dirname, "controllers");
const middlewaresPath = path.resolve(__dirname, "middlewares");
const modelsPath = path.resolve(__dirname, "models");

var module = new ModuleClass("company", contrillersPath, middlewaresPath, modelsPath);
module.init();