"use strict";
const path = require('path');

const ModuleClass = require('../../core/module');

const controllersPath = path.resolve(__dirname, "controllers");
const middlewaresPath = path.resolve(__dirname, 'middlewares');
const apiTestPath = path.resolve(__dirname, "test/api");

var module = new ModuleClass("company", controllersPath, middlewaresPath, apiTestPath);
module.init();