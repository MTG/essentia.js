"use strict"
// make entrypoint to ES6 class using esm
require = require('esm')(module)
var Essentia = require('./src/js/es6module.main.js');
module.exports = Essentia.default;