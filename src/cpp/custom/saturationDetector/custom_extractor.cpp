#include "custom_extractor.h"


// Util function to convert a Float32 JS typed array into std::vector<float>
// https://github.com/emscripten-core/emscripten/issues/5519#issuecomment-624775352
std::vector<float> float32ArrayToVector(const val &v) {
  std::vector<float> rv;
  const auto l = v["length"].as<unsigned>();
  rv.resize(l);
  emscripten::val memoryView{emscripten::typed_memory_view(l, rv.data())};
  memoryView.call<void>("set", v);
  return rv;
}

// class constructor to call the configure method
SaturationDetectorExtractor::SaturationDetectorExtractor(const int frameSize, const int hopSize) {
  configure(frameSize, hopSize);
};

// method to configure algorithm settings used in your extractor
void SaturationDetectorExtractor::configure(const int frameSize, const int hopSize){
  essentia::init();
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

  _FrameCutter = factory.create("FrameCutter",
          "frameSize", frameSize,
          "hopSize", hopSize,
          "startFromZero", true
  );
  _SaturationDetector = factory.create("SaturationDetector",
          "frameSize", frameSize,
          "hopSize", hopSize
  );
};

// compute methods for your extractor
val SaturationDetectorExtractor::compute(const val& audioData) {

  // convert JS Float32 typed array into std::vector<float>
  // eg. getChannelData output from the Web Audio API AudioContext instance
  std::vector<float> audioSignal = float32ArrayToVector(audioData);

  _FrameCutter->input("signal").set(audioSignal);
  std::vector<Real> frameFrameCutter;
  _FrameCutter->output("frame").set(frameFrameCutter);
  _SaturationDetector->input("frame").set(frameFrameCutter);
  std::vector<Real> startsSaturationDetector, endsSaturationDetector;
  _SaturationDetector->output("starts").set(startsSaturationDetector);
  _SaturationDetector->output("ends").set(endsSaturationDetector);


  while (true) {
      // compute a frame
      _FrameCutter->compute();
      // if it was the last one (ie: it was empty), then we are done.
      if (!frameFrameCutter.size()) {
          break;
      }
      // if the frame is silent, just drop it and go on processing
      if (isSilent(frameFrameCutter)) continue;
      _SaturationDetector->compute();
  }

  val outputSaturation(val::object());
  outputSaturation.set("starts", startsSaturationDetector);
  outputSaturation.set("ends", endsSaturationDetector);
  return outputSaturation;

};

// method for resetting the internal states used in the extractor
void SaturationDetectorExtractor::reset() {
  _FrameCutter->reset();
  _SaturationDetector->reset();
};

// method for deleting the algorithms used in the extractor
void SaturationDetectorExtractor::shutdown() {
  delete _FrameCutter;
  delete _SaturationDetector;
  essentia::shutdown();
};
