
![alt text](https://user-images.githubusercontent.com/14850001/66190489-67098d80-e68c-11e9-9a7c-35b82f6635e1.png)

[![Build Status](https://travis-ci.org/MTG/essentia.js.svg?branch=master)](https://travis-ci.org/MTG/essentia.js)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

[Status]: Under development, unoptimized and use at your own risk.


## Setup

You can find the pre-compiled modules in the `builds/` directory.

If you need to recompile the bindings, you can either use the docker or build everything from source on your local system.

### Using docker

```bash
docker pull mtgupf/essentia-emscripten:2.1-beta6-dev
```
- Mount the current directory as volume and run `build-bindings.sh` inside the docker container and check the new builds at the `builds/` directory.

```bash
docker run --rm -v `pwd`:/srv/workspace/ mtgupf/essentia-emscripten:2.1-beta6-dev /srv/workspace/build-bindings.sh
```

OR

### Building from source


* Install emscripten https://emscripten.org/docs/getting_started/downloads.html.

* Clone the `emscripten` branch of essentia repository
```bash
git clone -b emscripten https://github.com/MTG/essentia.git
```

* Compile essentia C++ library with the emscripten compiler. Check essentia [documentation](https://essentia.upf.edu/documentation/installing.html#compiling-essentia) for more details.


```bash
# configure build settings for essentia using kissfft
emconfigure sh -c './waf configure --prefix=$EMSCRIPTEN/system/local/ --build-static --lightweight= --fft=KISS --emscripten'

# compile and build essentia
emmake ./waf

# (you might need sudo rights)
emmake ./waf install

```

* Build essentiamin.js module and the bindings.

```bash
emconfigure sh -c './build-bindings.sh'
```
Check the bash script for the intermediate steps.

 
## Usage

### Examples

- Usage in JavaScript


Eg: The follwing code block shows some simple examples on how to use essentia.js in your web page. Here we call the wrapped functions in  essentia.js inside the `onRuntimeInitialized` callback (ie., once the webassembly modules are loaded in the browser). Check https://developer.mozilla.org/en-US/docs/WebAssembly/Loading_and_running for more about loading and running webassembly modules.

```html
<html lang="en">
  <script>

    var Module = {
        onRuntimeInitialized: function() {

            console.log("Essentia module loaded succesfuly ...");
            // get version of essentia used for this build
            console.log(Module.getEssentiaVersion());

            var frameSize = 1024;
            var hopSize = 1024;

            // get audio data from web audio api buffer using getChannelData method
            var signalArray = audioBuffer.getChannelData(0); 

            // convert to std::vector<float>
            var signal = typedFloat32ArrayVec(signalArray);

            // generate overlapping frames of a given audio signal (usefull for framewise processing)
            var frames = Module.frameGenerator(signal, frameSize, hopSize);

            // compute log-mel spectrogram 
            var logMelSpectrogram = [];
            for (var i=0; i < frames.size(); i++) {
                var wFrame = Module.windowing(frames.get(i), "hann");
                var spectrum = Module.spectrum(wFrame);
                var logBand = Module.logMelBands(spectrum, numBands);
                var melBandFrame = vec2typedFloat32Array(logBand);
                logMelSpectrogram.push(melBandFrame);
            }
            console.log(logMelSpectrogram);


            // compute the hpcp chroma features for each audio frame
            for (var i=0; i<frames.size(); i++) {
                var wFrame = Module.windowing(frames.get(i), "blackmanharris62");
                var toSmooth = true;
                var hpcp = Module.hpcp(frames.get(i), toSmooth);
            }

            
            var numBands = 128;
            // compute logMelBands for the given audio signal
            var melBands = Module.logMelBandsExtractor(signal, numBands, frameSize, hopSize);

            // compute predominant melody contour from monophonic/polyphonic music signal using melodia alogirithm
            var pitches = new Module.VectorFloat();
            var pitchConfidence = new Module.VectorFloat();
            // fill the vectors with the output
            Module.predominantPitchMelodiaExtractor(signal, pitches, pitchConfidence);

            // if you want to enable essentia debugging mode
            Module.initEssentia(true);

            // shutdown the essentia instance if you no longer need.
            Module.shutdownEssentia();
    
        }
    };
  </script>
  <head>
      <script src="builds/essentiamin-0.0.1.js"></script>
      <script>
            // sample function to convert javascript float32 typed array to a std::vector<float>
            typedFloat32Array2Vec = function(typedArray) {
                var vec = new Module.VectorFloat();
                for (var i=0; i<typedArray.length; i++) {
                    if (typeof typedArray[i] === 'undefined') {
                        vec.push_back(0);
                    }
                    else {
                        vec.push_back(typedArray[i]);
                    }
                }
                return vec;
            }
      </script>
  </head>
</html>
```
