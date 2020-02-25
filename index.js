"use strict"
// make entrypoint to ES6 class using esm
require = require('esm')(module)
var Essentia = require('./dist/essentia-module');
module.exports = Essentia;