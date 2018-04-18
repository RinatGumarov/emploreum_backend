"use strict";
const path = require('path');
const passport = require('./utils/passport');
const mailSender = require('../message/utils/mailSender');

const ModuleClass = require('../../core/module');

const controllersPath = path.resolve(__dirname, "controllers");
const middlewaresPath = path.resolve(__dirname, "middlewares");
const apiTestPath = path.resolve(__dirname, "test/api");

var module = new ModuleClass("auth", controllersPath, middlewaresPath, apiTestPath);

passport.init();
mailSender.init();
module.init();