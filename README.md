
# essentiamin.js

TODO: 


## Setup


### Building from source


* Install emscripten


* Compile essentia with emscripten compiler.

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


```bash
./server.sh
```
