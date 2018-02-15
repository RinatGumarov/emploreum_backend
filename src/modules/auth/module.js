"use strict";
const path = require('path');
const passport = require('./utils/passport');
const mailSender = require('../message/utils/mailSender');

const ModuleClass = require('../../core/module');

const controllersPath = path.resolve(__dirname, "controllers");
const middlewaresPath = path.resolve(__dirname, "middlewares");

var module = new ModuleClass("auth", controllersPath, middlewaresPath);

passport.init();
mailSender.init();
module.init();