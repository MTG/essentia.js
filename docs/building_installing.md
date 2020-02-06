
# Building and installing essentia.js

You can find pre-compiled builds [here](https://github.com/MTG/essentia.js/tree/module/dist).


## Compiling and building essentia.js

If you need to recompile the builds, you can either use the [docker](https://docs.docker.com/install/) (recommended) or build everything from source on your local system.


### Using docker

```bash
docker pull mtgupf/essentia-emscripten:2.1-beta5-dev
```
- Mount the current directory as volume and run `build-bindings.sh` inside the docker container and check the new builds at the `dist/` directory.

```bash
docker run --rm -v `pwd`:/srv/workspace/ \
                mtgupf/essentia-emscripten:2.1-beta5-dev \
                /srv/workspace/build-bindings.sh \
                Makefile.essentiajs
```

OR 

### Building from source


* Install [emscripten](https://emscripten.org/docs/getting_started/downloads.html).

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

* Build essentia.js.

```bash
emconfigure sh -c './build-bindings.sh Makefile.essentiajs'
```


## Customizing your essentia.js builds


You can make customised builds of essentia.js for only a set of selected essentia standard algoithms using the following python scripts.
&nbsp;enerator.py](https://github.com/MTG/essentia.js/blob/module/src/python/code_generator.py) script creates cpp source code and bindings for all the algos listed in [included_algos.md](https://github.com/MTG/essentia.js/blob/module/src/python/included_algos.md). This list of included algorithms can be customised using the [configure_bindings.py](https://github.com/MTG/essentia.js/blob/module/src/python/configure_bindings.py) script.

```bash
cd src/python
# configure default list of algorithms for creating the js bindings
python configure_bindings.py 
# OR
# specify a list of algorithms for which you need to create the js bindings
python configure_bindings.py -i "['Key', 'HPCP']"
# OR
# you can also specify the algorithm list by a txt file
python configure_bindings.py -i your_included_algos_list.txt
# for more cli options
 python configure_bindings.py -h
```



## Custom essentia feature extractors 

You could also write  your own customised [essentia feature extractor](https://essentia.upf.edu/howto_standard_extractor.html) in C++ and cross-compile to WASM using emscripten and our toolchain following the build instructions.


&nbsp;
