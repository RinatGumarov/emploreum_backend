"use strict";
const path = require('path');

const ModuleClass = require('../../core/module');

const controllersPath = path.resolve(__dirname, "controllers");
const apiTestPath = path.resolve(__dirname, "test/api");

var module = new ModuleClass("specialisation", controllersPath, null, apiTestPath);
module.init();