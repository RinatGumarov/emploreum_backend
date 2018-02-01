### module file

<pre>
"use strict";

const path = require('path');

var ModuleClass = require('../../core/module');

var controllersPath = path.resolve(__dirname, "controllers");
var middlewaresPath = path.resolve(__dirname, "middlewares");
var modelsPath = path.resolve(__dirname, "models");

var module = new ModuleClass("test", controllersPath, middlewaresPath, modelsPath);
module.init();
</pre>