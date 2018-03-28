"use strict";
const path = require('path');

const ModuleClass = require('../../core/module');

const controllersPath = path.resolve(__dirname, "controllers");
const apiTestPath = path.resolve(__dirname, "test/api");
const queriesPath = path.resolve(__dirname, "queries");

var module = new ModuleClass("specialisation", controllersPath, null, apiTestPath, queriesPath);
module.init();