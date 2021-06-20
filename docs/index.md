
![alt text](https://user-images.githubusercontent.com/14850001/66190489-67098d80-e68c-11e9-9a7c-35b82f6635e1.png)

[![Build Status](https://travis-ci.org/MTG/essentia.js.svg?branch=master)](https://travis-ci.org/MTG/essentia.js)
[![npm version](https://badge.fury.io/js/essentia.js.svg)](https://badge.fury.io/js/essentia.js)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![](https://data.jsdelivr.com/v1/package/npm/essentia.js/badge)](https://www.jsdelivr.com/package/npm/essentia.js)

[Essentia.js](https://essentia.upf.edu/essentiajs) enables extensive collection of music/audio analysis algorithms on your web-client and/or Node.js applications. 

You can find the latest releases on [Github](https://github.com/MTG/essentia.js/releases) or on [npm](https://www.npmjs.com/package/essentia.js).


## Builds Reference

### Core JS API

Imports core JS API interface as `Essentia` namespace.

- `essentia.js-core*.js` - IIFE import for web browsers.
- `essentia.js-core.umd*.js` - UMD import.
- `essentia.js-core.es*.js` - ES6 style import.

### WebAssembly (WASM) modules 

Imports a custom [Emscripten WASM Module](https://emscripten.org/docs/api_reference/module.html) object `EssentiaWASM` to the global namespace which has JS bindings to Essentia WASM back-end.

- `essentia-wasm.web.wasm` - Essentia WASM back-end for asynchronous imports. 
- `essentia-wasm.web.js` - JS glue code for loading `essentia-wasm-web.wasm` (can be used with HTML `<script>` tag).
- `essentia-wasm.umd.js` -  Essentia WASM back-end for synchronous imports (UMD import and AudioWorklet support).
- `essentia-wasm.es.js` -  Essentia WASM back-end for synchronous imports (ES6 style import and AudioWorklet support).


#### Essentia WASM back-end

The Essentia WASM back-end allows us to use all the [essentia standard mode](https://essentia.upf.edu/documentation.html) C++ algorithms except the ones mentioned [here](https://github.com/MTG/essentia.js/blob/master/src/python/excluded_algos.md) in JavaScript. The WASM back-end provides JS bindings to the generated custom C++ wrapper using [emscripten embind](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html) through [`EssentiaJS`](https://github.com/MTG/essentia.js/blob/a0985aacac01296b86ba00a21f60ca017e7b38c0/src/cpp/bindings_essentiajs.cpp#L29) class.

The detailed documentation for Essentia C++ algorithms can be found [here](https://essentia.upf.edu/algorithms_reference.html).
  
  
### Add-on JS modules

#### `EssentiaModel`

Run pre-trained Essentia-Tensorflow audio ML models for music analysis.

- `essentia.js-model*.js` - IIFE import for web browsers.
- `essentia.js-model.umd*.js` - UMD import.
- `essentia.js-model.es*.js` - ES6 import.

#### `EssentiaPlot`
- `essentia.js-plot*.js` - IIFE import for web browsers.
- `essentia.js-plot.umd*.js` - UMD import.
- `essentia.js-plot.es*.js` - ES6 import.

#### `EssentiaExtractor`

- `essentia.js-extractor*.js` - IIFE import for web browsers.
- `essentia.js-extractor.umd*.js` - UMD import.
- `essentia.js-extractor.es*.js` - ES6 import.

> Note: '*' corresponds to whether it's a minified build or not.


## TypeScript Interface

Essentia.js also provides TypeScript programming interface which can be found along with the builds. The build files (`*.d.ts`) can be found within the [dist](https://www.jsdelivr.com/package/npm/essentia.js?path=dist) directory bundled on NPM. The source code can be found [here](https://github.com/MTG/essentia.js/tree/master/src/typescript).
