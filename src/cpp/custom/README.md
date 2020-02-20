
## Building custom essentia C++ extractor and cross-compile to JS


- ### Using [`EssentiaExtractor`](./essentia_extractor.cpp) class examples


    - Build using `make -f Makefile.essentia.extractor`.

- ### Customly written extractor in C++.

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