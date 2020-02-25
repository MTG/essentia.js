
# Building and installing essentia.js from source

You can find pre-compiled builds [here](https://github.com/MTG/essentia.js/tree/module/dist).


## Compiling essentia using emscripten

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


## Building custom essentia C++ extractor and cross-compile to JS

You could also write  your own customised [essentia feature extractor](https://essentia.upf.edu/howto_standard_extractor.html) in C++ and cross-compile to WASM using emscripten and our toolchain following the build instructions.

- ### Using [`EssentiaExtractor`](../src/cpp/custom/essentia_extractor.cpp) class examples

    - Build using `make -f Makefile.essentia.extractor` given in the `src/cpp/custom/` directory.

- ### Write custom extractor in C++ from scratch.

  - An example of custom essentia C++ extractor with embind bindings. Here we write an extractor for computing log mel-scaled spectrogram from an input audio signal.

  ```c++
  #include <stdio.h>
  #include <essentia/algorithmfactory.h>
  #include <essentia/essentiamath.h>
  #include <essentia/pool.h>
  #include <emscripten/bind.h>

  using namespace essentia;
  using namespace essentia::standard;
  using namespace emscripten;

  std::vector<float> logMelSpectrogramExtractor(std::vector<float>& signal, int numBands, int frameSize, int hopSize, std::string windowType) {
    // we want to compute the MFCC of a input signal: we need the create the following:
    // vector -> framecutter -> windowing -> FFT -> MFCC 
    AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

    Algorithm* fc = factory.create("FrameCutter",
                    "frameSize", frameSize,
                  "hopSize", hopSize,
                  "startFromZero", true);

    Algorithm* w = factory.create("Windowing",
                    "type", windowType,
                  "zeroPadding", frameSize);

    Algorithm* spec = factory.create("Spectrum",
                    "size", frameSize);

    Algorithm* mel = factory.create("MelBands",
                    "numberBands", numBands,
                    "type", "magnitude");

    Algorithm* logNorm = factory.create("UnaryOperator",
                      "type", "log");							   
    /////////// STARTING THE ALGORITHMS //////////////////
    fc->input("signal").set(signal);
    // FrameCutter -> Windowing -> Spectrum
    std::vector<Real> frame, windowedFrame;
    fc->output("frame").set(frame);
    w->input("frame").set(frame);
    w->output("frame").set(windowedFrame);
    spec->input("frame").set(windowedFrame);
    // Spectrum -> MFCC
    std::vector<Real> spectrum, mfccBands, melBands;
    spec->output("spectrum").set(spectrum);
    mel->input("spectrum").set(spectrum);
    mel->output("bands").set(mfccBands);
    logNorm->input("array").set(mfccBands);
    logNorm->output("array").set(melBands);
    while (true) {
      // compute a frame
      fc->compute();
      // if it was the last one (ie: it was empty), then we're done.
      if (!frame.size()) {
        break;
      }
      // if the frame is silent, just drop it and go on processing
      if (isSilent(frame)) continue;
      w->compute();
      spec->compute();
      mel->compute();
      logNorm->compute();
    }
    delete fc;
    delete w;
    delete spec;
    delete mel;
    delete logNorm;
    return melBands;
  }

  EMSCRIPTEN_BINDINGS(es_extractor) {
    function("logMelSpectrogramExtractor", &logMelSpectrogramExtractor);
    register_vector<float>("VectorFloat");
  }

  ```

  - Build it using Emscripten compiler.

  ```bash
  emcc --bind -Oz -s WASM=1 $(YOUR_CPP_FILE) $(EMSCRIPTEN)/system/local/lib/essentia.a  $(YOUR_OUTPUT.js) -s EXCEPTION_DEBUG -s ASSERTIONS=2-s ALLOW_MEMORY_GROWTH=1 
  ```


  - Usage on JavaScript would be like

  ```JavaScript
  Module.logMelSpectrogramExtractor(inputSignal, // std::vector<float> type array
                                    128, // numBands
                                    4096, // frameSize
                                    2048, // hopSize
                                    'hann'); // windowType
  ```

&nbsp;