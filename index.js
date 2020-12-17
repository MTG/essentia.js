"use strict"
// make entrypoint to ES6 class using esm
require = require('esm')(module)
const EssentiaPkg = require('./src/js/es6module.main.js');
module.exports = EssentiaPkg;