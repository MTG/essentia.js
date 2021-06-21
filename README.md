
![alt text](https://user-images.githubusercontent.com/14850001/66190489-67098d80-e68c-11e9-9a7c-35b82f6635e1.png)

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Build Status](https://travis-ci.org/MTG/essentia.js.svg?branch=master)](https://travis-ci.org/MTG/essentia.js)
[![npm version](https://badge.fury.io/js/essentia.js.svg)](https://badge.fury.io/js/essentia.js)
[![](https://data.jsdelivr.com/v1/package/npm/essentia.js/badge)](https://www.jsdelivr.com/package/npm/essentia.js)


`Essentia.js` is a JavaScript (JS) library for music/audio signal analysis and processing developed at the [Music Technology Group, UPF, Barcelona](https://www.upf.edu/web/mtg/). The core of library is powered by [Essentia C++ library](https://essentia.upf.edu) back-end using [WebAssembly](https://webassembly.org/) built via [Emscripten](https://emscripten.org/) along with a high-level JS and TypeScript API and add-on utility modules. ie, You can run an extensive collection of music/audio processing and analysis algorithms/models on your web browser or Node.js runtime applications. It supports both real-time and offline audio analysis use-cases.  

The packaged add-on modules includes configurable feature extractors for some selected features, interface for feature extraction and inference of a collection of pre-trained audio ML models using [Tensorflow.js](https://www.tensorflow.org/js), some helper classes for visualizing common music processing features directly into your HTML web page using [Plotly.js](https://plotly.com/javascript/) library.

- License: [https://essentia.upf.edu/licensing_information.html](https://essentia.upf.edu/licensing_information.html)

- Repository: [https://github.com/MTG/essentia.js](https://github.com/MTG/essentia.js)

- Releases: [https://github.com/MTG/essentia.js/releases](https://github.com/MTG/essentia.js/releases)


- Live demos: [https://mtg.github.io/essentia.js/examples](https://mtg.github.io/essentia.js/examples)


- Documentation: [https://mtg.github.io/essentia.js/docs/api](https://mtg.github.io/essentia.js/docs/api/)

- Tutorials: [https://mtg.github.io/essentia.js/docs/api/list_tutorial.html](https://mtg.github.io/essentia.js/docs/api/list_tutorial.html)
  

You are also most welcome to [contribute](CONTRIBUTING.md) to `essentia.js`. 

> NOTE: Essentia.js is currently under rapid development. This means that APIs and features will evolve. It is recommended that devs who adopt essentia.js today upgrade their installation as new releases become available, as backwards compatibility is not yet guaranteed. Some of the algorithms are not yet manually tested on the JavaScript front. Please submit the issues at https://github.com/MTG/essentia.js/issues.

## Citing essentia.js
If you want to cite essentia.js in a scholarly work, please use the following reference.


> Albin Correya, Dmitry Bogdanov, Luis Joglar-Ongay, Xavier Serra. “Essentia.js: A JavaScript Library for Music and Audio Analysis on the Web”, 21st International Society for Music Information Retrieval Conference, Montréal, Canada, pp. 605-612. 2020.


