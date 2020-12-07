"use strict"

const EssentiaWASM = require("../../dist/essentia-wasm.module").EssentiaWASM;
const Essentia = require("../../dist/essentia.js-core.es");

// export as default for entry point to node package with the js wrapper
const EssentiaNode = new Essentia(EssentiaWASM);

module.exports = EssentiaNode
