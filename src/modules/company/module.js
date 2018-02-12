"use strict";
const path = require('path');

const ModuleClass = require('../../core/module');

const controllersPath = path.resolve(__dirname, "controllers");
const middlewaresPath = path.resolve(__dirname, 'middlewares');
const queriesPath = path.resolve(__dirname, "queries");

var module = new ModuleClass("company", controllersPath, middlewaresPath, queriesPath);
module.init();