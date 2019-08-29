
# essentiamin.js

TODO (finish readme)


## Setup

You can either use the docker or build everything from source on your local system.


### Using docker

```bash
docker pull acorreya/essentia-emscripten:initial
```

TODO: add instructions to use it

OR

### Building from source


* Install emscripten


* Compile essentia with emscripten compiler.

Check compile instructions for essentia from [here]().

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

            // function to convert javascript float 32 typed array to a std::vector<float>
            typedFloat32Array2Vec = function(typedArray) {

                var vec = new Module.VectorFloat();
                var cnt = 0;
                for (var i=0; i<typedArray.length; i++) {
                    if (typeof typedArray[i] === 'undefined') {
                        vec.push_back(0);
                        cnt ++;
                    }
                    else {
                        vec.push_back(typedArray[i]);
                    }
                }
                return vec;
            }

            var signal = typedFloat32ArrayVec(signalArray);


            // compute logMelBands for the given audio signal
            var melBands = Module.logMelBands(signal, frameSize, hopSize);

    
        }
    };
  </script>
  <head>
      <script src="web/dist/essentiamin.js"></script>
  </head>
</html>
```

- Lauch the web demo

```bash
./server.sh
```
