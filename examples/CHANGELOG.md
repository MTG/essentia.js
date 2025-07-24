# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.1.3] - 2021-06-25

### Added

- Fix TypeError on audioBufferToMonoSignal in `essentia.js-core` (see [#58](https://github.com/MTG/essentia.js/issues/58))
- Add a basic Node.js example to the repo (see [#44](https://github.com/MTG/essentia.js/issues/44)).



## [0.1.2] - 2021-06-24

### Changes

- Fix TypeError on audioBufferToMonoSignal in `essentia.js-model` (see [#58](https://github.com/MTG/essentia.js/issues/58))



## [0.1.1] - 2021-06-20

### Added

- Added `essentia.js-model` add-on module to facilitate the end-to-end use of a collection of pre-trained tensorflow.js audio ML models.
- Added both realtime and offline use-case examples for using essentia.js and tensorflow.js along with documentation.


### Changes

- Changed namespaces in node.js entrypoint. ie. Now, all the add-on modules are also exposed in the node.js import (see #50).
- Re-organized the directory structure of the source code and related scripts in terms of category of the module.
- Essentia WASM backend sync build files are now distributed as both UMD and ES6 compatiable formats (`essentia-wasm.umd.js` and `essentia-wasm.es.js`).

## [0.1.0] - 2020-09-14

### Added 
- Added support for new algorithms for pitch extraction (Melodia), EBUR loudness and downmixing stereo signals etc. (see [#6](https://github.com/MTG/essentia.js/issues/6) and [#30](https://github.com/MTG/essentia.js/issues/30)). 
- Added example of how to write efficient custom C++ features exractor and their corresponding Essentia WASM JS bindings for performance demanding applications (see [here](https://github.com/MTG/essentia.js/pull/38/commits/517065cab819f9d9bef8bae8c8ee1e33d627f67e)).
- Added both normal and minified builds of essentia.js seperately.
  

### Changes

- Removed algorithms with non-supported IO wrappers from the bindings (see [#27](https://github.com/MTG/essentia.js/issues/27)) 
- Changed global namespace `EssentiaModule` to `EssentiaWASM` in Essentia WASM backend imports (see [#29](https://github.com/MTG/essentia.js/issues/29)).
- Dockerfile updated to compile and build from upstream code (see [#25](https://github.com/MTG/essentia.js/issues/25)). 
- Adapted the examples and documentation template with the upstream source.
- Minor fixes in `essentia.js-plot` add-on module.
- Enhanced build scripts for building both WASM and JS API.
- Updated CI/CD scripts and settings accordingly.
- Minor fixes in the `essentia.js-extractor` add-on modules. Updated default parameter settings. Changed the module interface to work with a single audio frame.
- Add `delete` method in the `essentia.js-core*` API.

    

## [0.0.9] - 2020-04-27

### Added

- Typescript API for core essentia.js algorithms
- Add-on classes for easy-to.use extractors and visualizing audio features in a DOM object.
- Updated build scripts to bundle the final distros using Rollup.
- Improved API documentation generated using jsdoc.
- Added tutorials and starter web application examples for both realtime and offline audio feature extraction tasks.