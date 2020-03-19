
![alt text](https://user-images.githubusercontent.com/14850001/66190489-67098d80-e68c-11e9-9a7c-35b82f6635e1.png)

[![Build Status](https://travis-ci.org/MTG/essentia.js.svg?branch=master)](https://travis-ci.org/MTG/essentia.js)
[![npm version](https://badge.fury.io/js/essentia.js.svg)](https://badge.fury.io/js/essentia.js)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

[essentia.js](https://essentia.upf.edu/essentiajs) enables state-of-the-art music/audio analysis algorithms on your web-client and/or Node JS applications. 

You can find the latest releases on [Github](https://github.com/MTG/essentia.js/releases) or on [npm](https://www.npmjs.com/package/essentia.js).

## JS API Reference


### Core JS Interface

- `essentia.js-core.js` - `Essentia` main JS interface for web browsers.
- `essentia.js-core.es.js` - `Essentia` main JS interface for module imports.

### WASM modules 

Imports an [Emscripten WASM Module](https://emscripten.org/docs/api_reference/module.html) object to global namespace which has JS bindings to essentia C++ library WASM back-end.

- `essentia-wasm.web.wasm` - Asynchronous build of essentia C++ library WASM back-end. 
- `essentia-wasm.web.js` - JS glue code for loading `essentia-wasm-web.wasm` (can be used with HTML `<script>` tag).
- `essentia-wasm.module.js` - Synchronous build of essentia C++ library back-end (ES6 import/export and AudioWorklet support).

Essentia WASM backend algorithms reference can be found [here](https://essentia.upf.edu/algorithms_reference.html) 
  
  
### Additional JS modules

- `essentia.js-plot.js` - `EssentiaPlot` import for  web browsers
- `essentia.js-plot.es.js` - `EssentiaPlot` for module imports.
- `essentia.js-extractor.js` - `EssentiaExtractor` import for  web browsers
- `essentia.js-extractor.es.js` - `EssentiaExtractor` for module imports.

&nbsp;