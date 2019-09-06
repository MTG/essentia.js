
# essentiamin.js

TODO (finish readme)


## Setup

You can either use the docker or build everything from source on your local system.


### Building from source


* Install emscripten https://emscripten.org/docs/getting_started/downloads.html.

* Compile essentia with emscripten compiler. Check essentia documentation https://essentia.upf.edu/documentation/installing.html#compiling-essentia for more details.


```bash
# configure build settings for essentia using kissfft
emconfigure sh -c './waf configure --prefix=$EMSCRIPTEN/system/local/ --build-static --fft=KISS --emscripten'

# compile and build essentia
emmake ./waf

# (you might need sudo rights)
emmake ./waf install

```

* Complie essentiamin.js bindings.

```bash
emconfigure sh -c './build_essentia-bindings.sh'
```
Check the bash script for the intermediate steps.



OR 

### Using docker

```bash
docker pull acorreya/essentia-emscripten:initial
```

TODO: add instructions to use it


## Usage


## Examples

### Usage in JavaScript


Eg: The follwing examples demonstrates how to compute log-mel-bands for the the given audio buffer using our compiled essentiamin.js file.

```html
<html lang="en">
  <script>

    var Module = {
        onRuntimeInitialized: function() {

            console.log("Essentia module loaded succesfuly ...");

            var frameSize = 1024;
            var hopSize = 1024;
            var signalArray = new Float32Array(audioBuffer); // get audio buffer from the audio context of web audio api

            var signal = typedFloat32ArrayVec(signalArray);

            // compute logMelBands for the given audio signal
            var melBands = Module.logMelBandsExtractor(signal, frameSize, hopSize);

            // if you want to run the algos in essentia debugging mode 
            Module.debuggerEssentia(true);

            // shutdown the essentia instance if you no longer need.
            Module.shutdownEssentia();
    
        }
    };
  </script>
  <head>
      <script src="web/dist/essentiamin.js"></script>
      <script>
            // function to convert javascript float 32 typed array to a std::vector<float>
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

## Web demos

```bash
./server.sh
```
