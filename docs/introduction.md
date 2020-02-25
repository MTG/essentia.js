
![alt text](https://user-images.githubusercontent.com/14850001/66190489-67098d80-e68c-11e9-9a7c-35b82f6635e1.png)

[![Build Status](https://travis-ci.org/MTG/essentia.js.svg?branch=master)](https://travis-ci.org/MTG/essentia.js)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

[essentia.js](https://essentia.upf.edu/essentiajs) enables state-of-the-art audio/music analysis algorithms on your web-client. Currently, [essentia.js](https://essentia.upf.edu/essentiajs) builds only support essentia standard mode algorithms besides the ones that are listed [here](src/python/excluded_algos.md).


You can find pre-compiled builds [here](https://github.com/MTG/essentia.js/tree/module/dist).

- `essentia.wasm` - Asynchronous WASM build of generic javascript bindings for essentia C++ library. 
- `essentia.js` - JS glue code for loading `essentia.wasm` (can be used with HTML `<script>` tag).
- `essentia-module.js` - Synchronous build of generic javascript bindings for essentia C++ library (ES6 import/export and AudioWorklet support).
- `essentia.tools.js` - Utility methods for converting JS typed arrays to and from essentia input types.


&nbsp;