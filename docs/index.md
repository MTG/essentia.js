
![alt text](https://user-images.githubusercontent.com/14850001/66190489-67098d80-e68c-11e9-9a7c-35b82f6635e1.png)

[![Build Status](https://travis-ci.org/MTG/essentia.js.svg?branch=master)](https://travis-ci.org/MTG/essentia.js)
[![npm version](https://badge.fury.io/js/essentia.js.svg)](https://badge.fury.io/js/essentia.js)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

[essentia.js](https://essentia.upf.edu/essentiajs) enables state-of-the-art music/audio analysis algorithms on your web-client and/or Node.js applications. 

You can find the latest releases on [Github](https://github.com/MTG/essentia.js/releases) or on [npm](https://www.npmjs.com/package/essentia.js).


## Builds Reference

### Core JS API

- `essentia.js-core.js` - `Essentia` main JS interface for web browsers.
- `essentia.js-core.es.js` - `Essentia` main JS interface for ES6 imports.

### WASM modules 

Imports an [Emscripten WASM Module](https://emscripten.org/docs/api_reference/module.html) object `EssentiaModule` to the global namespace which has JS bindings to essentia C++ library WASM back-end.

- `essentia-wasm.web.wasm` - essentia WASM back-end for asynchronous imports. 
- `essentia-wasm.web.js` - JS glue code for loading `essentia-wasm-web.wasm` (can be used with HTML `<script>` tag).
- `essentia-wasm.module.js` -  essentia WASM back-end for synchronous imports (ES6 style import and AudioWorklet support).

The documentation for essentia C++ algorithms can be found [here](https://essentia.upf.edu/algorithms_reference.html).
  
  
### Add-on JS modules

- `essentia.js-extractor.js` - `EssentiaExtractor` import for  web browsers
- `essentia.js-extractor.es.js` - `EssentiaExtractor` for ES6 imports.
- `essentia.js-plot.js` - `EssentiaPlot` import for  web browsers
- `essentia.js-plot.es.js` - `EssentiaPlot` for ES6 imports.


### Essentia WebAssembly (WASM) back-end

The essentia WASM back-end allows us to use all the [essentia standard mode](https://essentia.upf.edu/documentation.html) C++ algorithms except the ones mentioned [here](https://github.com/MTG/essentia.js/blob/master/src/python/excluded_algos.md) in JavaScript. The WASM back-end provides JS bindings to the generated custom C++ wrapper using [emscripten embind](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html) through [`EssentiaJS`](https://github.com/MTG/essentia.js/blob/a0985aacac01296b86ba00a21f60ca017e7b38c0/src/cpp/bindings_essentiajs.cpp#L29) class.


### Typescript interface

essentia.js also provides a typscript programming interface which can be found [here](https://github.com/MTG/essentia.js/tree/master/src/typescript).
