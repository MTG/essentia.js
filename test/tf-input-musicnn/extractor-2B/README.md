
## Building custom essentia C++ extractor and cross-compile to JS for better performance on JS

A custom C++ feature extractors can be write and cross-compiled to JS using our given template and examples in cases in which the performance of feature extractors are significant. The [`essentia_custom_extractor.h`](./essentia_custom_extractor.h), [`essentia_custom_extractor.cpp`](./essentia_custom_extractor.cpp) and [`bindings_extractor.cpp`](./bindings_extractor.cpp) files demonstrates an example of writing an efficient custom C++ extractor which can be cross-compiled and run on JS for both real-time and offline feature extraction cases. In this particular example the extractor computes Log-scaled MelSpectrogram for a given audio channel data input from the WebAudio API or any other sources. The extractor provide a object-oriented interface which can be used to `configure`, `compute`, `reset` and `shutdown` the algorithms as the user needs (relevant for better performance in batch or real-time feature extractors).


### Usage

  - Build the custom cpp extractor using the given [Makefile](./Makefile). Make sure you have the required dependencies for building Essentia WASM.
  
  ```bash
  make
  ```


  - Usage on JavaScript would be like

  ```JavaScript
  // import essentia-wasm backend
  import { EssentiaWASM } from 'essentia-custom-extractor.module.js';

  // create a instance of our custom 'LogMelSpectrogramExtractor' 
  // by passing our configuration settings for the given parameters
  const extractor = new EssentiaWASM.LogMelSpectrogramExtractor(1024, // frameSize
                                                                512, // hopSize 
                                                                96, // numBands
                                                                'hann'); // windowType


  // Use the Web Audio API to decode the audio channel data from an url of a audio file
  const audioURL = "https://freesound.org/data/previews/328/328857_230356-lq.mp3";
  const audioContext = new AudioContext();
  const response = await fetch(audioURL);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  // getChannelData of channel number 0 (since it's a mono audio signal)
  const audioData = audioBuffer.getChannelData(0);

  // Now, let's compute the log-mel spectrogram feature for the given audio input
  let melSpectrogram =  extractor.compute(audioData);

  // reset the internal states of the algorithms used in the extractor
  extractor.reset();

  // reconfigure our extractor with new parmeter settings
  extractor.configure(1024, 512, 128, 'hann');
  // compute with new settings
  let melSpectrogram =  extractor.compute(audioData);

  // delete algorithms and free memory after it's use
  extractor.shutdown();
  extractor.delete();
  ```