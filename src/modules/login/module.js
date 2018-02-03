"use strict";
const path = require('path');
const passport = require('./utils/passport');

const ModuleClass = require('../../core/module');

const controllersPath = path.resolve(__dirname, "controllers");

var module = new ModuleClass("login", controllersPath);
passport.init();
module.init();