
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

- Lauch the web demo

```bash
./server.sh
```
