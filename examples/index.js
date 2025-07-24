"use strict"

const EssentiaWASM = require("./dist/essentia-wasm.umd");
const Essentia = require("./dist/essentia.js-core.umd");
const EssentiaModel = require("./dist/essentia.js-model.umd");
const EssentiaExtractor = require("./dist/essentia.js-extractor.umd");
const EssentiaPlot = require("./dist/essentia.js-plot.umd");


module.exports = {
    // WASM backend
    EssentiaWASM,
    // Core JS API
    Essentia,
    // Add-on modules
    EssentiaModel,
    EssentiaExtractor,
    EssentiaPlot
};