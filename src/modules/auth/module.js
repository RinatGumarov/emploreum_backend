"use strict";
const path = require('path');
const passport = require('./utils/passport');
const mailSender = require('./utils/mail-sender');

const ModuleClass = require('../../core/module');

const controllersPath = path.resolve(__dirname, "controllers");

var module = new ModuleClass("auth", controllersPath);
passport.init();
mailSender.init();
module.init();