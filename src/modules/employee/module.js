"use strict";
const path = require('path');

const ModuleClass = require('../../core/module');

const controllersPath = path.resolve(__dirname, "controllers");
const middlewaresPath = path.resolve(__dirname, 'middlewares');
const apiTestPath = path.resolve(__dirname, "test/api");
const queriesPath = path.resolve(__dirname, "queries");

var module = new ModuleClass("employee", controllersPath, middlewaresPath, apiTestPath, queriesPath);
module.init();