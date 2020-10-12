# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.1.0] - 2020-09-14

### Added 
- Added support for new algorithms for pitch extraction (Melodia), EBUR loudness and downmixing stereo signals etc. (see [#6](https://github.com/MTG/essentia.js/issues/6) and [#30](https://github.com/MTG/essentia.js/issues/30)). 

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