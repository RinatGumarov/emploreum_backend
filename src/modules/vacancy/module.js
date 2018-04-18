"use strict";
const path = require('path');

const ModuleClass = require('../../core/module');

const controllersPath = path.resolve(__dirname, "controllers");
const middlewaresPath = path.resolve(__dirname, 'middlewares');
const queriesPath = path.resolve(__dirname, "queries");
const apiTestPath = path.resolve(__dirname, "test/api");

var module = new ModuleClass("vacancy", controllersPath, middlewaresPath, apiTestPath, queriesPath);
module.init();