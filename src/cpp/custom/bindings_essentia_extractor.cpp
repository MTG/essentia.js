/*
 * EssentiaExtractor
 * Shows example for creating bindings for your customly written cpp essentia extractors.
 */
#include <stdio.h>
#include <emscripten/bind.h>
#include "essentia_extractor.h"

using namespace emscripten;

void initEssentia(bool debugMode) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(debugMode);
}

void shutdownEssentia() {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.shutDown();
}

std::string getEssentiaVersion() {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  return essentiaExtractor.essentiaVersion;
}

std::vector<std::vector<float> > frameGenerator(std::vector<float>& signal, int frameSize, int hopSize) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  return essentiaExtractor.frameGenerator(signal, frameSize, hopSize);
}

std::vector<float> windowing(std::vector<float>& signalFrame, std::string windowType) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  return essentiaExtractor.windowing(signalFrame, windowType);
}


void bpmHistogram(std::vector<float>& signal, std::vector<float>& bpmEstimates, std::vector<float>& histogram) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  essentiaExtractor.bpmHistogram(signal, bpmEstimates, histogram);
}

std::vector<float> hpcp(std::vector<float>& signalFrame, bool nonLinear) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  return essentiaExtractor.hpcp(signalFrame, nonLinear);
}

void pitchYin(std::vector<float>& signalFrame, float pitch, float pitchConfidence) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  essentiaExtractor.pitchYin(signalFrame, pitch, pitchConfidence);
}

void pitchProbabilisticYinExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& voicedProbabilities) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  essentiaExtractor.pitchProbabilisticYinExtractor(signal, pitch, voicedProbabilities);
}

void pitchMelodiaExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& pitchConfidence) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  essentiaExtractor.pitchMelodiaExtractor(signal, pitch, pitchConfidence);
}

void predominantPitchMelodiaExtractor(std::vector<float>& signal, std::vector<float>& pitch, std::vector<float>& pitchConfidence) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  essentiaExtractor.predominantPitchMelodiaExtractor(signal, pitch, pitchConfidence);
}

void mfccExtractor(std::vector<float>& signal, std::vector<float>& mfccBands, std::vector<float>& mfccCoeffs) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  essentiaExtractor.mfcc(signal, mfccBands, mfccCoeffs);  
};

void chordExtractor(std::vector<float>& chroma,  int hopSize, std::vector<std::string>& chords, std::vector<float>& strength) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  essentiaExtractor.chordDetection(chroma, hopSize, chords, strength);
}

float danceability(std::vector<float>& signal) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  return essentiaExtractor.danceability(signal);
}

std::vector<float> logMelSpectrogram(std::vector<float>& spectrumFrame, int numBands) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  return essentiaExtractor.logMelSpectrogram(spectrumFrame, numBands);
}

std::vector<float> logMelSpectrogramExtractor(std::vector<float>& signal, int numBands, int frameSize, int hopSize, std::string windowType) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  return essentiaExtractor.logMelSpectrogramExtractor(signal, numBands,frameSize, hopSize, windowType);
}

std::vector<float> spectrumExtractor(std::vector<float>& signal, int frameSize, int hopSize, std::string windowType) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  return essentiaExtractor.spectrumExtractor(signal, frameSize, hopSize, windowType);
}

void beatTrackerMultiFeature(std::vector<float>& signal, std::vector<float>& ticks, float confidence) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  essentiaExtractor.beatTrackerMultiFeature(signal, ticks, confidence);
}

void loudnessEBUR128(std::vector<float>& signal, std::vector<float>& momLoudness, std::vector<float>& shortLoudness, float integrateLoudness, float loudRange) {
  EssentiaExtractor essentiaExtractor;
  essentiaExtractor.initState(false);
  essentiaExtractor.loudnessEBUR128(signal, momLoudness, shortLoudness, integrateLoudness, loudRange);
}

// expose cpp functions to js using embind wrappers
EMSCRIPTEN_BINDINGS(my_extractor) {
  function("initEssentia", &initEssentia);
  function("shutdownEssentia", &shutdownEssentia);
  function("getEssentiaVersion", &getEssentiaVersion);
  function("windowing", &windowing);
  function("frameGenerator", &frameGenerator);
  function("danceability", &danceability);
  function("beatTrackerMultiFeature", &beatTrackerMultiFeature);
  function("hpcp", &hpcp);
  function("pitchMelodiaExtractor", &pitchMelodiaExtractor);
  function("pitchProbabilisticYinExtractor", &pitchProbabilisticYinExtractor);
  function("predominantPitchMelodiaExtractor", &predominantPitchMelodiaExtractor);
  function("spectrumExtractor", &spectrumExtractor);
  function("mfccExtractor", &mfccExtractor);
  function("logMelSpectrogram", &logMelSpectrogram);
  function("logMelSpectrogramExtractor", &logMelSpectrogramExtractor);
  function("bpmHistogram", &bpmHistogram);
  function("chordExtractor", &chordExtractor);
  function("loudnessEBUR128", &loudnessEBUR128);
  // map stl datatypes (eg. var x = new Module.VectorFloat(); )
  register_vector<int>("VectorInt");
  register_vector<float>("VectorFloat");
  register_vector<double>("VectorDouble");
  register_vector<std::string>("VectorString");
  register_vector<std::vector<float>>("VectorVectorFloat");
  // register_vector<std::vector<double>>("VectorVectorDouble");
}

