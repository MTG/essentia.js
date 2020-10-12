/*
 * Copyright (C) 2006-2020  Music Technology Group - Universitat Pompeu Fabra
 *
 * This file is part of Essentia
 *
 * Essentia is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation (FSF), either version 3 of the License, or (at your
 * option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the Affero GNU General Public License
 * version 3 along with this program.  If not, see http://www.gnu.org/licenses/
 */

// NOTE: This source code is machine-generated.

#include <essentia/algorithmfactory.h>
#include <essentia/essentiamath.h>
#include <essentia/pool.h>
#include "essentiajs.h"

using namespace essentia;
using namespace essentia::standard;

// convert a Float32 JS typed array into std::vector<float>
// https://github.com/emscripten-core/emscripten/issues/5519#issuecomment-589702756
std::vector<float> float32ArrayToVector(const val &arr) {
  unsigned int length = arr["length"].as<unsigned int>();
  std::vector<float> vec(length);
  val heap = val::module_property("HEAPU8");
  val memory = heap["buffer"];
  val memoryView = val::global("Float32Array").new_(memory, reinterpret_cast<std::uintptr_t>(vec.data()), length);
  // https://github.com/emscripten-core/emscripten/issues/5519#issuecomment-333302296
  vec.reserve(length);
  memoryView.call<void>("set", arr);
  return vec;
}

// instantiating the essentia algo registry with an optional argument to enable debug mode 
EssentiaJS::EssentiaJS(bool debugger) {
  if (debugger) {
    // if true sets essentia debugger active
    // EAll is a special value in essentia that contains all modules
    setDebugLevel(EAll); 
    unsetDebugLevel(EMemory | EConnectors);
    // activate warnings
    essentia::warningLevelActive = true; 
    // activate info
    essentia::infoLevelActive = true;
    // activate error level    
    essentia::errorLevelActive = true;    
  } else {
    essentia::infoLevelActive = false;
    essentia::warningLevelActive = false;
  }
  essentia::init();
  essentiaVersion = essentia::version;
}

// shutdown essentia instance
void EssentiaJS::shutdown() {
  essentia::shutdown();
}

// Method for frameCutting the given audio signal
std::vector<std::vector<float> > EssentiaJS::FrameGenerator(const val& signalArray, int frameSize, int hopSize) {
  // convert JS typed typed float 32 array to std::vector<float>
  std::vector<float> signal = float32ArrayToVector(signalArray);
  // create algorithm instances
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* fc   = factory.create("FrameCutter",
                   "frameSize", frameSize,
                   "hopSize", hopSize);
  Pool pool;
  std::vector<float> frame;
  fc->input("signal").set(signal);
  fc->output("frame").set(frame);
  while (true) {
    // compute a frame
    fc->compute();
    // if it was the last one (ie: it was empty), then we're done.
    if (!frame.size()) {
      break;
    }
    // if the frame is silent, just drop it and go on processing
    if (isSilent(frame)) continue;
    pool.add("frames", frame);
  }
  delete fc;
  return pool.value<std::vector<std::vector<float> > >("frames");
}

// This a wrapper for MonoMixer algorithm to accept both left and right channels to downmix an stereo channel input to mono
// check https://essentia.upf.edu/reference/std_MonoMixer.html for algorithm details
// TODO: could be reimplemented with BinaryOperator and UnaryOperator in the future
val EssentiaJS::MonoMixer(std::vector<float>& left_channel, std::vector<float>& right_channel) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

  // TODO: remove this stereosample cresting overhead in future 
  Algorithm* algoStereoMuxer = factory.create("StereoMuxer");
  algoStereoMuxer->input("left").set(left_channel);
  algoStereoMuxer->input("right").set(right_channel);
  std::vector<StereoSample> stereoSignal;
  algoStereoMuxer->output("audio").set(stereoSignal);
  algoStereoMuxer->compute();
  delete algoStereoMuxer;

  Algorithm* algoMonoMixer = factory.create("MonoMixer");
  std::vector<float> output_audio;
  algoMonoMixer->input("audio").set(stereoSignal);
  // set numberChannels=2 since we only deal with stereo signal in this wrapper
  algoMonoMixer->input("numberChannels").set(2);
  algoMonoMixer->output("audio").set(output_audio);
  algoMonoMixer->compute();

  val outputMonoMixer(val::object());
  outputMonoMixer.set("audio", output_audio);
  delete algoMonoMixer;
  return outputMonoMixer;
};

// This a wrapper for LoudnessEBUR128 algorithm to accept both left and right channels of an stereo audio signal seperately
// check https://essentia.upf.edu/reference/std_LoudnessEBUR128.html for algorithm details
val EssentiaJS::LoudnessEBUR128(std::vector<float>& left_channel, std::vector<float>& right_channel, const float hopSize, const float sampleRate, const bool startAtZero) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

  Algorithm* algoStereoMuxer = factory.create("StereoMuxer");
  algoStereoMuxer->input("left").set(left_channel);
  algoStereoMuxer->input("right").set(right_channel);
  std::vector<StereoSample> stereoSignal;
  algoStereoMuxer->output("audio").set(stereoSignal);
  algoStereoMuxer->compute();
  delete algoStereoMuxer;

  Algorithm* algoLoudnessEBUR128 = factory.create("LoudnessEBUR128", "hopSize", hopSize, "sampleRate", sampleRate, "startAtZero", startAtZero);
  algoLoudnessEBUR128->input("signal").set(stereoSignal);
  std::vector<float> output_momentaryLoudness;
  std::vector<float> output_shortTermLoudness;
  float output_integratedLoudness;
  float output_loudnessRange;
  algoLoudnessEBUR128->output("momentaryLoudness").set(output_momentaryLoudness);
  algoLoudnessEBUR128->output("shortTermLoudness").set(output_shortTermLoudness);
  algoLoudnessEBUR128->output("integratedLoudness").set(output_integratedLoudness);
  algoLoudnessEBUR128->output("loudnessRange").set(output_loudnessRange);
  algoLoudnessEBUR128->compute();
  val outputLoudnessEBUR128(val::object());
  outputLoudnessEBUR128.set("momentaryLoudness", output_momentaryLoudness);
  outputLoudnessEBUR128.set("shortTermLoudness", output_shortTermLoudness);
  outputLoudnessEBUR128.set("integratedLoudness", output_integratedLoudness);
  outputLoudnessEBUR128.set("loudnessRange", output_loudnessRange);

  delete algoLoudnessEBUR128;
  return outputLoudnessEBUR128;
}

// NOTE: The following code snippets are machine generated. Do not edit.
 
// check https://essentia.upf.edu/reference/std_AfterMaxToBeforeMaxEnergyRatio.html
val EssentiaJS::AfterMaxToBeforeMaxEnergyRatio(std::vector<float>& input_pitch) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoAfterMaxToBeforeMaxEnergyRatio = factory.create("AfterMaxToBeforeMaxEnergyRatio");
  algoAfterMaxToBeforeMaxEnergyRatio->input("pitch").set(input_pitch);
  float output_afterMaxToBeforeMaxEnergyRatio;
  algoAfterMaxToBeforeMaxEnergyRatio->output("afterMaxToBeforeMaxEnergyRatio").set(output_afterMaxToBeforeMaxEnergyRatio);
  algoAfterMaxToBeforeMaxEnergyRatio->compute();
  val outputAfterMaxToBeforeMaxEnergyRatio(val::object());
  outputAfterMaxToBeforeMaxEnergyRatio.set("afterMaxToBeforeMaxEnergyRatio", output_afterMaxToBeforeMaxEnergyRatio);
  delete algoAfterMaxToBeforeMaxEnergyRatio;
  return outputAfterMaxToBeforeMaxEnergyRatio;
}
 
// check https://essentia.upf.edu/reference/std_AllPass.html
val EssentiaJS::AllPass(std::vector<float>& input_signal, const float bandwidth, const float cutoffFrequency, const int order, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoAllPass = factory.create("AllPass", "bandwidth", bandwidth, "cutoffFrequency", cutoffFrequency, "order", order, "sampleRate", sampleRate);
  algoAllPass->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoAllPass->output("signal").set(output_signal);
  algoAllPass->compute();
  val outputAllPass(val::object());
  outputAllPass.set("signal", output_signal);
  delete algoAllPass;
  return outputAllPass;
}
 
// check https://essentia.upf.edu/reference/std_AudioOnsetsMarker.html
val EssentiaJS::AudioOnsetsMarker(std::vector<float>& input_signal, const std::vector<float>& onsets, const float sampleRate, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoAudioOnsetsMarker = factory.create("AudioOnsetsMarker", "onsets", onsets, "sampleRate", sampleRate, "type", type);
  algoAudioOnsetsMarker->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoAudioOnsetsMarker->output("signal").set(output_signal);
  algoAudioOnsetsMarker->compute();
  val outputAudioOnsetsMarker(val::object());
  outputAudioOnsetsMarker.set("signal", output_signal);
  delete algoAudioOnsetsMarker;
  return outputAudioOnsetsMarker;
}
 
// check https://essentia.upf.edu/reference/std_AutoCorrelation.html
val EssentiaJS::AutoCorrelation(std::vector<float>& input_array, const float frequencyDomainCompression, const bool generalized, const std::string& normalization) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoAutoCorrelation = factory.create("AutoCorrelation", "frequencyDomainCompression", frequencyDomainCompression, "generalized", generalized, "normalization", normalization);
  algoAutoCorrelation->input("array").set(input_array);
  std::vector<float> output_autoCorrelation;
  algoAutoCorrelation->output("autoCorrelation").set(output_autoCorrelation);
  algoAutoCorrelation->compute();
  val outputAutoCorrelation(val::object());
  outputAutoCorrelation.set("autoCorrelation", output_autoCorrelation);
  delete algoAutoCorrelation;
  return outputAutoCorrelation;
}
 
// check https://essentia.upf.edu/reference/std_BFCC.html
val EssentiaJS::BFCC(std::vector<float>& input_spectrum, const int dctType, const float highFrequencyBound, const int inputSize, const int liftering, const std::string& logType, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const int numberCoefficients, const float sampleRate, const std::string& type, const std::string& weighting) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBFCC = factory.create("BFCC", "dctType", dctType, "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "liftering", liftering, "logType", logType, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "numberCoefficients", numberCoefficients, "sampleRate", sampleRate, "type", type, "weighting", weighting);
  algoBFCC->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  std::vector<float> output_bfcc;
  algoBFCC->output("bands").set(output_bands);
  algoBFCC->output("bfcc").set(output_bfcc);
  algoBFCC->compute();
  val outputBFCC(val::object());
  outputBFCC.set("bands", output_bands);
  outputBFCC.set("bfcc", output_bfcc);
  delete algoBFCC;
  return outputBFCC;
}
 
// check https://essentia.upf.edu/reference/std_BPF.html
val EssentiaJS::BPF(float input_x, const std::vector<float>& xPoints, const std::vector<float>& yPoints) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBPF = factory.create("BPF", "xPoints", xPoints, "yPoints", yPoints);
  algoBPF->input("x").set(input_x);
  float output_y;
  algoBPF->output("y").set(output_y);
  algoBPF->compute();
  val outputBPF(val::object());
  outputBPF.set("y", output_y);
  delete algoBPF;
  return outputBPF;
}
 
// check https://essentia.upf.edu/reference/std_BandPass.html
val EssentiaJS::BandPass(std::vector<float>& input_signal, const float bandwidth, const float cutoffFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBandPass = factory.create("BandPass", "bandwidth", bandwidth, "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
  algoBandPass->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoBandPass->output("signal").set(output_signal);
  algoBandPass->compute();
  val outputBandPass(val::object());
  outputBandPass.set("signal", output_signal);
  delete algoBandPass;
  return outputBandPass;
}
 
// check https://essentia.upf.edu/reference/std_BandReject.html
val EssentiaJS::BandReject(std::vector<float>& input_signal, const float bandwidth, const float cutoffFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBandReject = factory.create("BandReject", "bandwidth", bandwidth, "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
  algoBandReject->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoBandReject->output("signal").set(output_signal);
  algoBandReject->compute();
  val outputBandReject(val::object());
  outputBandReject.set("signal", output_signal);
  delete algoBandReject;
  return outputBandReject;
}
 
// check https://essentia.upf.edu/reference/std_BarkBands.html
val EssentiaJS::BarkBands(std::vector<float>& input_spectrum, const int numberBands, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBarkBands = factory.create("BarkBands", "numberBands", numberBands, "sampleRate", sampleRate);
  algoBarkBands->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  algoBarkBands->output("bands").set(output_bands);
  algoBarkBands->compute();
  val outputBarkBands(val::object());
  outputBarkBands.set("bands", output_bands);
  delete algoBarkBands;
  return outputBarkBands;
}
 
// check https://essentia.upf.edu/reference/std_BeatTrackerDegara.html
val EssentiaJS::BeatTrackerDegara(std::vector<float>& input_signal, const int maxTempo, const int minTempo) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBeatTrackerDegara = factory.create("BeatTrackerDegara", "maxTempo", maxTempo, "minTempo", minTempo);
  algoBeatTrackerDegara->input("signal").set(input_signal);
  std::vector<float> output_ticks;
  algoBeatTrackerDegara->output("ticks").set(output_ticks);
  algoBeatTrackerDegara->compute();
  val outputBeatTrackerDegara(val::object());
  outputBeatTrackerDegara.set("ticks", output_ticks);
  delete algoBeatTrackerDegara;
  return outputBeatTrackerDegara;
}
 
// check https://essentia.upf.edu/reference/std_BeatTrackerMultiFeature.html
val EssentiaJS::BeatTrackerMultiFeature(std::vector<float>& input_signal, const int maxTempo, const int minTempo) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBeatTrackerMultiFeature = factory.create("BeatTrackerMultiFeature", "maxTempo", maxTempo, "minTempo", minTempo);
  algoBeatTrackerMultiFeature->input("signal").set(input_signal);
  std::vector<float> output_ticks;
  float output_confidence;
  algoBeatTrackerMultiFeature->output("ticks").set(output_ticks);
  algoBeatTrackerMultiFeature->output("confidence").set(output_confidence);
  algoBeatTrackerMultiFeature->compute();
  val outputBeatTrackerMultiFeature(val::object());
  outputBeatTrackerMultiFeature.set("ticks", output_ticks);
  outputBeatTrackerMultiFeature.set("confidence", output_confidence);
  delete algoBeatTrackerMultiFeature;
  return outputBeatTrackerMultiFeature;
}
 
// check https://essentia.upf.edu/reference/std_Beatogram.html
val EssentiaJS::Beatogram(std::vector<float>& input_loudness, std::vector<std::vector<float> >& input_loudnessBandRatio, const int size) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBeatogram = factory.create("Beatogram", "size", size);
  algoBeatogram->input("loudness").set(input_loudness);
  algoBeatogram->input("loudnessBandRatio").set(input_loudnessBandRatio);
  std::vector<std::vector<float> > output_beatogram;
  algoBeatogram->output("beatogram").set(output_beatogram);
  algoBeatogram->compute();
  val outputBeatogram(val::object());
  outputBeatogram.set("beatogram", output_beatogram);
  delete algoBeatogram;
  return outputBeatogram;
}
 
// check https://essentia.upf.edu/reference/std_BeatsLoudness.html
val EssentiaJS::BeatsLoudness(std::vector<float>& input_signal, const float beatDuration, const float beatWindowDuration, const std::vector<float>& beats, const std::vector<float>& frequencyBands, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBeatsLoudness = factory.create("BeatsLoudness", "beatDuration", beatDuration, "beatWindowDuration", beatWindowDuration, "beats", beats, "frequencyBands", frequencyBands, "sampleRate", sampleRate);
  algoBeatsLoudness->input("signal").set(input_signal);
  std::vector<float> output_loudness;
  std::vector<std::vector<float> > output_loudnessBandRatio;
  algoBeatsLoudness->output("loudness").set(output_loudness);
  algoBeatsLoudness->output("loudnessBandRatio").set(output_loudnessBandRatio);
  algoBeatsLoudness->compute();
  val outputBeatsLoudness(val::object());
  outputBeatsLoudness.set("loudness", output_loudness);
  outputBeatsLoudness.set("loudnessBandRatio", output_loudnessBandRatio);
  delete algoBeatsLoudness;
  return outputBeatsLoudness;
}
 
// check https://essentia.upf.edu/reference/std_BinaryOperator.html
val EssentiaJS::BinaryOperator(std::vector<float>& input_array1, std::vector<float>& input_array2, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBinaryOperator = factory.create("BinaryOperator", "type", type);
  algoBinaryOperator->input("array1").set(input_array1);
  algoBinaryOperator->input("array2").set(input_array2);
  std::vector<float> output_array;
  algoBinaryOperator->output("array").set(output_array);
  algoBinaryOperator->compute();
  val outputBinaryOperator(val::object());
  outputBinaryOperator.set("array", output_array);
  delete algoBinaryOperator;
  return outputBinaryOperator;
}
 
// check https://essentia.upf.edu/reference/std_BinaryOperatorStream.html
val EssentiaJS::BinaryOperatorStream(std::vector<float>& input_array1, std::vector<float>& input_array2, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBinaryOperatorStream = factory.create("BinaryOperatorStream", "type", type);
  algoBinaryOperatorStream->input("array1").set(input_array1);
  algoBinaryOperatorStream->input("array2").set(input_array2);
  std::vector<float> output_array;
  algoBinaryOperatorStream->output("array").set(output_array);
  algoBinaryOperatorStream->compute();
  val outputBinaryOperatorStream(val::object());
  outputBinaryOperatorStream.set("array", output_array);
  delete algoBinaryOperatorStream;
  return outputBinaryOperatorStream;
}
 
// check https://essentia.upf.edu/reference/std_BpmHistogramDescriptors.html
val EssentiaJS::BpmHistogramDescriptors(std::vector<float>& input_bpmIntervals) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBpmHistogramDescriptors = factory.create("BpmHistogramDescriptors");
  algoBpmHistogramDescriptors->input("bpmIntervals").set(input_bpmIntervals);
  float output_firstPeakBPM;
  float output_firstPeakWeight;
  float output_firstPeakSpread;
  float output_secondPeakBPM;
  float output_secondPeakWeight;
  float output_secondPeakSpread;
  std::vector<float> output_histogram;
  algoBpmHistogramDescriptors->output("firstPeakBPM").set(output_firstPeakBPM);
  algoBpmHistogramDescriptors->output("firstPeakWeight").set(output_firstPeakWeight);
  algoBpmHistogramDescriptors->output("firstPeakSpread").set(output_firstPeakSpread);
  algoBpmHistogramDescriptors->output("secondPeakBPM").set(output_secondPeakBPM);
  algoBpmHistogramDescriptors->output("secondPeakWeight").set(output_secondPeakWeight);
  algoBpmHistogramDescriptors->output("secondPeakSpread").set(output_secondPeakSpread);
  algoBpmHistogramDescriptors->output("histogram").set(output_histogram);
  algoBpmHistogramDescriptors->compute();
  val outputBpmHistogramDescriptors(val::object());
  outputBpmHistogramDescriptors.set("firstPeakBPM", output_firstPeakBPM);
  outputBpmHistogramDescriptors.set("firstPeakWeight", output_firstPeakWeight);
  outputBpmHistogramDescriptors.set("firstPeakSpread", output_firstPeakSpread);
  outputBpmHistogramDescriptors.set("secondPeakBPM", output_secondPeakBPM);
  outputBpmHistogramDescriptors.set("secondPeakWeight", output_secondPeakWeight);
  outputBpmHistogramDescriptors.set("secondPeakSpread", output_secondPeakSpread);
  outputBpmHistogramDescriptors.set("histogram", output_histogram);
  delete algoBpmHistogramDescriptors;
  return outputBpmHistogramDescriptors;
}
 
// check https://essentia.upf.edu/reference/std_BpmRubato.html
val EssentiaJS::BpmRubato(std::vector<float>& input_beats, const float longRegionsPruningTime, const float shortRegionsMergingTime, const float tolerance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBpmRubato = factory.create("BpmRubato", "longRegionsPruningTime", longRegionsPruningTime, "shortRegionsMergingTime", shortRegionsMergingTime, "tolerance", tolerance);
  algoBpmRubato->input("beats").set(input_beats);
  std::vector<float> output_rubatoStart;
  std::vector<float> output_rubatoStop;
  int output_rubatoNumber;
  algoBpmRubato->output("rubatoStart").set(output_rubatoStart);
  algoBpmRubato->output("rubatoStop").set(output_rubatoStop);
  algoBpmRubato->output("rubatoNumber").set(output_rubatoNumber);
  algoBpmRubato->compute();
  val outputBpmRubato(val::object());
  outputBpmRubato.set("rubatoStart", output_rubatoStart);
  outputBpmRubato.set("rubatoStop", output_rubatoStop);
  outputBpmRubato.set("rubatoNumber", output_rubatoNumber);
  delete algoBpmRubato;
  return outputBpmRubato;
}
 
// check https://essentia.upf.edu/reference/std_CentralMoments.html
val EssentiaJS::CentralMoments(std::vector<float>& input_array, const std::string& mode, const float range) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoCentralMoments = factory.create("CentralMoments", "mode", mode, "range", range);
  algoCentralMoments->input("array").set(input_array);
  std::vector<float> output_centralMoments;
  algoCentralMoments->output("centralMoments").set(output_centralMoments);
  algoCentralMoments->compute();
  val outputCentralMoments(val::object());
  outputCentralMoments.set("centralMoments", output_centralMoments);
  delete algoCentralMoments;
  return outputCentralMoments;
}
 
// check https://essentia.upf.edu/reference/std_Centroid.html
val EssentiaJS::Centroid(std::vector<float>& input_array, const float range) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoCentroid = factory.create("Centroid", "range", range);
  algoCentroid->input("array").set(input_array);
  float output_centroid;
  algoCentroid->output("centroid").set(output_centroid);
  algoCentroid->compute();
  val outputCentroid(val::object());
  outputCentroid.set("centroid", output_centroid);
  delete algoCentroid;
  return outputCentroid;
}
 
// check https://essentia.upf.edu/reference/std_ChordsDescriptors.html
val EssentiaJS::ChordsDescriptors(std::vector<std::string> input_chords, std::string input_key, std::string input_scale) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoChordsDescriptors = factory.create("ChordsDescriptors");
  algoChordsDescriptors->input("chords").set(input_chords);
  algoChordsDescriptors->input("key").set(input_key);
  algoChordsDescriptors->input("scale").set(input_scale);
  std::vector<float> output_chordsHistogram;
  float output_chordsNumberRate;
  float output_chordsChangesRate;
  std::string output_chordsKey;
  std::string output_chordsScale;
  algoChordsDescriptors->output("chordsHistogram").set(output_chordsHistogram);
  algoChordsDescriptors->output("chordsNumberRate").set(output_chordsNumberRate);
  algoChordsDescriptors->output("chordsChangesRate").set(output_chordsChangesRate);
  algoChordsDescriptors->output("chordsKey").set(output_chordsKey);
  algoChordsDescriptors->output("chordsScale").set(output_chordsScale);
  algoChordsDescriptors->compute();
  val outputChordsDescriptors(val::object());
  outputChordsDescriptors.set("chordsHistogram", output_chordsHistogram);
  outputChordsDescriptors.set("chordsNumberRate", output_chordsNumberRate);
  outputChordsDescriptors.set("chordsChangesRate", output_chordsChangesRate);
  outputChordsDescriptors.set("chordsKey", output_chordsKey);
  outputChordsDescriptors.set("chordsScale", output_chordsScale);
  delete algoChordsDescriptors;
  return outputChordsDescriptors;
}
 
// check https://essentia.upf.edu/reference/std_ChordsDetection.html
val EssentiaJS::ChordsDetection(std::vector<std::vector<float> >& input_pcp, const int hopSize, const float sampleRate, const float windowSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoChordsDetection = factory.create("ChordsDetection", "hopSize", hopSize, "sampleRate", sampleRate, "windowSize", windowSize);
  algoChordsDetection->input("pcp").set(input_pcp);
  std::vector<std::string> output_chords;
  std::vector<float> output_strength;
  algoChordsDetection->output("chords").set(output_chords);
  algoChordsDetection->output("strength").set(output_strength);
  algoChordsDetection->compute();
  val outputChordsDetection(val::object());
  outputChordsDetection.set("chords", output_chords);
  outputChordsDetection.set("strength", output_strength);
  delete algoChordsDetection;
  return outputChordsDetection;
}
 
// check https://essentia.upf.edu/reference/std_ChordsDetectionBeats.html
val EssentiaJS::ChordsDetectionBeats(std::vector<std::vector<float> >& input_pcp, std::vector<float>& input_ticks, const std::string& chromaPick, const int hopSize, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoChordsDetectionBeats = factory.create("ChordsDetectionBeats", "chromaPick", chromaPick, "hopSize", hopSize, "sampleRate", sampleRate);
  algoChordsDetectionBeats->input("pcp").set(input_pcp);
  algoChordsDetectionBeats->input("ticks").set(input_ticks);
  std::vector<std::string> output_chords;
  std::vector<float> output_strength;
  algoChordsDetectionBeats->output("chords").set(output_chords);
  algoChordsDetectionBeats->output("strength").set(output_strength);
  algoChordsDetectionBeats->compute();
  val outputChordsDetectionBeats(val::object());
  outputChordsDetectionBeats.set("chords", output_chords);
  outputChordsDetectionBeats.set("strength", output_strength);
  delete algoChordsDetectionBeats;
  return outputChordsDetectionBeats;
}
 
// check https://essentia.upf.edu/reference/std_ChromaCrossSimilarity.html
val EssentiaJS::ChromaCrossSimilarity(std::vector<std::vector<float> >& input_queryFeature, std::vector<std::vector<float> >& input_referenceFeature, const float binarizePercentile, const int frameStackSize, const int frameStackStride, const int noti, const bool oti, const bool otiBinary, const bool streaming) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoChromaCrossSimilarity = factory.create("ChromaCrossSimilarity", "binarizePercentile", binarizePercentile, "frameStackSize", frameStackSize, "frameStackStride", frameStackStride, "noti", noti, "oti", oti, "otiBinary", otiBinary, "streaming", streaming);
  algoChromaCrossSimilarity->input("queryFeature").set(input_queryFeature);
  algoChromaCrossSimilarity->input("referenceFeature").set(input_referenceFeature);
  std::vector<std::vector<float> > output_csm;
  algoChromaCrossSimilarity->output("csm").set(output_csm);
  algoChromaCrossSimilarity->compute();
  val outputChromaCrossSimilarity(val::object());
  outputChromaCrossSimilarity.set("csm", output_csm);
  delete algoChromaCrossSimilarity;
  return outputChromaCrossSimilarity;
}
 
// check https://essentia.upf.edu/reference/std_Chromagram.html
val EssentiaJS::Chromagram(std::vector<float>& input_frame, const int binsPerOctave, const float minFrequency, const int minimumKernelSize, const std::string& normalizeType, const int numberBins, const float sampleRate, const float scale, const float threshold, const std::string& windowType, const bool zeroPhase) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoChromagram = factory.create("Chromagram", "binsPerOctave", binsPerOctave, "minFrequency", minFrequency, "minimumKernelSize", minimumKernelSize, "normalizeType", normalizeType, "numberBins", numberBins, "sampleRate", sampleRate, "scale", scale, "threshold", threshold, "windowType", windowType, "zeroPhase", zeroPhase);
  algoChromagram->input("frame").set(input_frame);
  std::vector<float> output_chromagram;
  algoChromagram->output("chromagram").set(output_chromagram);
  algoChromagram->compute();
  val outputChromagram(val::object());
  outputChromagram.set("chromagram", output_chromagram);
  delete algoChromagram;
  return outputChromagram;
}
 
// check https://essentia.upf.edu/reference/std_ClickDetector.html
val EssentiaJS::ClickDetector(std::vector<float>& input_frame, const float detectionThreshold, const int frameSize, const int hopSize, const int order, const int powerEstimationThreshold, const float sampleRate, const int silenceThreshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoClickDetector = factory.create("ClickDetector", "detectionThreshold", detectionThreshold, "frameSize", frameSize, "hopSize", hopSize, "order", order, "powerEstimationThreshold", powerEstimationThreshold, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold);
  algoClickDetector->input("frame").set(input_frame);
  std::vector<float> output_starts;
  std::vector<float> output_ends;
  algoClickDetector->output("starts").set(output_starts);
  algoClickDetector->output("ends").set(output_ends);
  algoClickDetector->compute();
  val outputClickDetector(val::object());
  outputClickDetector.set("starts", output_starts);
  outputClickDetector.set("ends", output_ends);
  delete algoClickDetector;
  return outputClickDetector;
}
 
// check https://essentia.upf.edu/reference/std_Clipper.html
val EssentiaJS::Clipper(std::vector<float>& input_signal, const float max, const float min) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoClipper = factory.create("Clipper", "max", max, "min", min);
  algoClipper->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoClipper->output("signal").set(output_signal);
  algoClipper->compute();
  val outputClipper(val::object());
  outputClipper.set("signal", output_signal);
  delete algoClipper;
  return outputClipper;
}
 
// check https://essentia.upf.edu/reference/std_CoverSongSimilarity.html
val EssentiaJS::CoverSongSimilarity(std::vector<std::vector<float> >& input_inputArray, const std::string& alignmentType, const float disExtension, const float disOnset, const std::string& distanceType) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoCoverSongSimilarity = factory.create("CoverSongSimilarity", "alignmentType", alignmentType, "disExtension", disExtension, "disOnset", disOnset, "distanceType", distanceType);
  algoCoverSongSimilarity->input("inputArray").set(input_inputArray);
  std::vector<std::vector<float> > output_scoreMatrix;
  float output_distance;
  algoCoverSongSimilarity->output("scoreMatrix").set(output_scoreMatrix);
  algoCoverSongSimilarity->output("distance").set(output_distance);
  algoCoverSongSimilarity->compute();
  val outputCoverSongSimilarity(val::object());
  outputCoverSongSimilarity.set("scoreMatrix", output_scoreMatrix);
  outputCoverSongSimilarity.set("distance", output_distance);
  delete algoCoverSongSimilarity;
  return outputCoverSongSimilarity;
}
 
// check https://essentia.upf.edu/reference/std_Crest.html
val EssentiaJS::Crest(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoCrest = factory.create("Crest");
  algoCrest->input("array").set(input_array);
  float output_crest;
  algoCrest->output("crest").set(output_crest);
  algoCrest->compute();
  val outputCrest(val::object());
  outputCrest.set("crest", output_crest);
  delete algoCrest;
  return outputCrest;
}
 
// check https://essentia.upf.edu/reference/std_CrossCorrelation.html
val EssentiaJS::CrossCorrelation(std::vector<float>& input_arrayX, std::vector<float>& input_arrayY, const int maxLag, const int minLag) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoCrossCorrelation = factory.create("CrossCorrelation", "maxLag", maxLag, "minLag", minLag);
  algoCrossCorrelation->input("arrayX").set(input_arrayX);
  algoCrossCorrelation->input("arrayY").set(input_arrayY);
  std::vector<float> output_crossCorrelation;
  algoCrossCorrelation->output("crossCorrelation").set(output_crossCorrelation);
  algoCrossCorrelation->compute();
  val outputCrossCorrelation(val::object());
  outputCrossCorrelation.set("crossCorrelation", output_crossCorrelation);
  delete algoCrossCorrelation;
  return outputCrossCorrelation;
}
 
// check https://essentia.upf.edu/reference/std_CrossSimilarityMatrix.html
val EssentiaJS::CrossSimilarityMatrix(std::vector<std::vector<float> >& input_queryFeature, std::vector<std::vector<float> >& input_referenceFeature, const bool binarize, const float binarizePercentile, const int frameStackSize, const int frameStackStride) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoCrossSimilarityMatrix = factory.create("CrossSimilarityMatrix", "binarize", binarize, "binarizePercentile", binarizePercentile, "frameStackSize", frameStackSize, "frameStackStride", frameStackStride);
  algoCrossSimilarityMatrix->input("queryFeature").set(input_queryFeature);
  algoCrossSimilarityMatrix->input("referenceFeature").set(input_referenceFeature);
  std::vector<std::vector<float> > output_csm;
  algoCrossSimilarityMatrix->output("csm").set(output_csm);
  algoCrossSimilarityMatrix->compute();
  val outputCrossSimilarityMatrix(val::object());
  outputCrossSimilarityMatrix.set("csm", output_csm);
  delete algoCrossSimilarityMatrix;
  return outputCrossSimilarityMatrix;
}
 
// check https://essentia.upf.edu/reference/std_CubicSpline.html
val EssentiaJS::CubicSpline(float input_x, const int leftBoundaryFlag, const float leftBoundaryValue, const int rightBoundaryFlag, const float rightBoundaryValue, const std::vector<float>& xPoints, const std::vector<float>& yPoints) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoCubicSpline = factory.create("CubicSpline", "leftBoundaryFlag", leftBoundaryFlag, "leftBoundaryValue", leftBoundaryValue, "rightBoundaryFlag", rightBoundaryFlag, "rightBoundaryValue", rightBoundaryValue, "xPoints", xPoints, "yPoints", yPoints);
  algoCubicSpline->input("x").set(input_x);
  float output_y;
  float output_dy;
  float output_ddy;
  algoCubicSpline->output("y").set(output_y);
  algoCubicSpline->output("dy").set(output_dy);
  algoCubicSpline->output("ddy").set(output_ddy);
  algoCubicSpline->compute();
  val outputCubicSpline(val::object());
  outputCubicSpline.set("y", output_y);
  outputCubicSpline.set("dy", output_dy);
  outputCubicSpline.set("ddy", output_ddy);
  delete algoCubicSpline;
  return outputCubicSpline;
}
 
// check https://essentia.upf.edu/reference/std_DCRemoval.html
val EssentiaJS::DCRemoval(std::vector<float>& input_signal, const float cutoffFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDCRemoval = factory.create("DCRemoval", "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
  algoDCRemoval->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoDCRemoval->output("signal").set(output_signal);
  algoDCRemoval->compute();
  val outputDCRemoval(val::object());
  outputDCRemoval.set("signal", output_signal);
  delete algoDCRemoval;
  return outputDCRemoval;
}
 
// check https://essentia.upf.edu/reference/std_DCT.html
val EssentiaJS::DCT(std::vector<float>& input_array, const int dctType, const int inputSize, const int liftering, const int outputSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDCT = factory.create("DCT", "dctType", dctType, "inputSize", inputSize, "liftering", liftering, "outputSize", outputSize);
  algoDCT->input("array").set(input_array);
  std::vector<float> output_dct;
  algoDCT->output("dct").set(output_dct);
  algoDCT->compute();
  val outputDCT(val::object());
  outputDCT.set("dct", output_dct);
  delete algoDCT;
  return outputDCT;
}
 
// check https://essentia.upf.edu/reference/std_Danceability.html
val EssentiaJS::Danceability(std::vector<float>& input_signal, const float maxTau, const float minTau, const float sampleRate, const float tauMultiplier) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDanceability = factory.create("Danceability", "maxTau", maxTau, "minTau", minTau, "sampleRate", sampleRate, "tauMultiplier", tauMultiplier);
  algoDanceability->input("signal").set(input_signal);
  float output_danceability;
  std::vector<float> output_dfa;
  algoDanceability->output("danceability").set(output_danceability);
  algoDanceability->output("dfa").set(output_dfa);
  algoDanceability->compute();
  val outputDanceability(val::object());
  outputDanceability.set("danceability", output_danceability);
  outputDanceability.set("dfa", output_dfa);
  delete algoDanceability;
  return outputDanceability;
}
 
// check https://essentia.upf.edu/reference/std_Decrease.html
val EssentiaJS::Decrease(std::vector<float>& input_array, const float range) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDecrease = factory.create("Decrease", "range", range);
  algoDecrease->input("array").set(input_array);
  float output_decrease;
  algoDecrease->output("decrease").set(output_decrease);
  algoDecrease->compute();
  val outputDecrease(val::object());
  outputDecrease.set("decrease", output_decrease);
  delete algoDecrease;
  return outputDecrease;
}
 
// check https://essentia.upf.edu/reference/std_Derivative.html
val EssentiaJS::Derivative(std::vector<float>& input_signal) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDerivative = factory.create("Derivative");
  algoDerivative->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoDerivative->output("signal").set(output_signal);
  algoDerivative->compute();
  val outputDerivative(val::object());
  outputDerivative.set("signal", output_signal);
  delete algoDerivative;
  return outputDerivative;
}
 
// check https://essentia.upf.edu/reference/std_DerivativeSFX.html
val EssentiaJS::DerivativeSFX(std::vector<float>& input_envelope) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDerivativeSFX = factory.create("DerivativeSFX");
  algoDerivativeSFX->input("envelope").set(input_envelope);
  float output_derAvAfterMax;
  float output_maxDerBeforeMax;
  algoDerivativeSFX->output("derAvAfterMax").set(output_derAvAfterMax);
  algoDerivativeSFX->output("maxDerBeforeMax").set(output_maxDerBeforeMax);
  algoDerivativeSFX->compute();
  val outputDerivativeSFX(val::object());
  outputDerivativeSFX.set("derAvAfterMax", output_derAvAfterMax);
  outputDerivativeSFX.set("maxDerBeforeMax", output_maxDerBeforeMax);
  delete algoDerivativeSFX;
  return outputDerivativeSFX;
}
 
// check https://essentia.upf.edu/reference/std_DiscontinuityDetector.html
val EssentiaJS::DiscontinuityDetector(std::vector<float>& input_frame, const float detectionThreshold, const float energyThreshold, const int frameSize, const int hopSize, const int kernelSize, const int order, const int silenceThreshold, const int subFrameSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDiscontinuityDetector = factory.create("DiscontinuityDetector", "detectionThreshold", detectionThreshold, "energyThreshold", energyThreshold, "frameSize", frameSize, "hopSize", hopSize, "kernelSize", kernelSize, "order", order, "silenceThreshold", silenceThreshold, "subFrameSize", subFrameSize);
  algoDiscontinuityDetector->input("frame").set(input_frame);
  std::vector<float> output_discontinuityLocations;
  std::vector<float> output_discontinuityAmplitudes;
  algoDiscontinuityDetector->output("discontinuityLocations").set(output_discontinuityLocations);
  algoDiscontinuityDetector->output("discontinuityAmplitudes").set(output_discontinuityAmplitudes);
  algoDiscontinuityDetector->compute();
  val outputDiscontinuityDetector(val::object());
  outputDiscontinuityDetector.set("discontinuityLocations", output_discontinuityLocations);
  outputDiscontinuityDetector.set("discontinuityAmplitudes", output_discontinuityAmplitudes);
  delete algoDiscontinuityDetector;
  return outputDiscontinuityDetector;
}
 
// check https://essentia.upf.edu/reference/std_Dissonance.html
val EssentiaJS::Dissonance(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDissonance = factory.create("Dissonance");
  algoDissonance->input("frequencies").set(input_frequencies);
  algoDissonance->input("magnitudes").set(input_magnitudes);
  float output_dissonance;
  algoDissonance->output("dissonance").set(output_dissonance);
  algoDissonance->compute();
  val outputDissonance(val::object());
  outputDissonance.set("dissonance", output_dissonance);
  delete algoDissonance;
  return outputDissonance;
}
 
// check https://essentia.upf.edu/reference/std_DistributionShape.html
val EssentiaJS::DistributionShape(std::vector<float>& input_centralMoments) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDistributionShape = factory.create("DistributionShape");
  algoDistributionShape->input("centralMoments").set(input_centralMoments);
  float output_spread;
  float output_skewness;
  float output_kurtosis;
  algoDistributionShape->output("spread").set(output_spread);
  algoDistributionShape->output("skewness").set(output_skewness);
  algoDistributionShape->output("kurtosis").set(output_kurtosis);
  algoDistributionShape->compute();
  val outputDistributionShape(val::object());
  outputDistributionShape.set("spread", output_spread);
  outputDistributionShape.set("skewness", output_skewness);
  outputDistributionShape.set("kurtosis", output_kurtosis);
  delete algoDistributionShape;
  return outputDistributionShape;
}
 
// check https://essentia.upf.edu/reference/std_Duration.html
val EssentiaJS::Duration(std::vector<float>& input_signal, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDuration = factory.create("Duration", "sampleRate", sampleRate);
  algoDuration->input("signal").set(input_signal);
  float output_duration;
  algoDuration->output("duration").set(output_duration);
  algoDuration->compute();
  val outputDuration(val::object());
  outputDuration.set("duration", output_duration);
  delete algoDuration;
  return outputDuration;
}
 
// check https://essentia.upf.edu/reference/std_DynamicComplexity.html
val EssentiaJS::DynamicComplexity(std::vector<float>& input_signal, const float frameSize, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDynamicComplexity = factory.create("DynamicComplexity", "frameSize", frameSize, "sampleRate", sampleRate);
  algoDynamicComplexity->input("signal").set(input_signal);
  float output_dynamicComplexity;
  float output_loudness;
  algoDynamicComplexity->output("dynamicComplexity").set(output_dynamicComplexity);
  algoDynamicComplexity->output("loudness").set(output_loudness);
  algoDynamicComplexity->compute();
  val outputDynamicComplexity(val::object());
  outputDynamicComplexity.set("dynamicComplexity", output_dynamicComplexity);
  outputDynamicComplexity.set("loudness", output_loudness);
  delete algoDynamicComplexity;
  return outputDynamicComplexity;
}
 
// check https://essentia.upf.edu/reference/std_ERBBands.html
val EssentiaJS::ERBBands(std::vector<float>& input_spectrum, const float highFrequencyBound, const int inputSize, const float lowFrequencyBound, const int numberBands, const float sampleRate, const std::string& type, const float width) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoERBBands = factory.create("ERBBands", "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "lowFrequencyBound", lowFrequencyBound, "numberBands", numberBands, "sampleRate", sampleRate, "type", type, "width", width);
  algoERBBands->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  algoERBBands->output("bands").set(output_bands);
  algoERBBands->compute();
  val outputERBBands(val::object());
  outputERBBands.set("bands", output_bands);
  delete algoERBBands;
  return outputERBBands;
}
 
// check https://essentia.upf.edu/reference/std_EffectiveDuration.html
val EssentiaJS::EffectiveDuration(std::vector<float>& input_signal, const float sampleRate, const float thresholdRatio) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoEffectiveDuration = factory.create("EffectiveDuration", "sampleRate", sampleRate, "thresholdRatio", thresholdRatio);
  algoEffectiveDuration->input("signal").set(input_signal);
  float output_effectiveDuration;
  algoEffectiveDuration->output("effectiveDuration").set(output_effectiveDuration);
  algoEffectiveDuration->compute();
  val outputEffectiveDuration(val::object());
  outputEffectiveDuration.set("effectiveDuration", output_effectiveDuration);
  delete algoEffectiveDuration;
  return outputEffectiveDuration;
}
 
// check https://essentia.upf.edu/reference/std_Energy.html
val EssentiaJS::Energy(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoEnergy = factory.create("Energy");
  algoEnergy->input("array").set(input_array);
  float output_energy;
  algoEnergy->output("energy").set(output_energy);
  algoEnergy->compute();
  val outputEnergy(val::object());
  outputEnergy.set("energy", output_energy);
  delete algoEnergy;
  return outputEnergy;
}
 
// check https://essentia.upf.edu/reference/std_EnergyBand.html
val EssentiaJS::EnergyBand(std::vector<float>& input_spectrum, const float sampleRate, const float startCutoffFrequency, const float stopCutoffFrequency) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoEnergyBand = factory.create("EnergyBand", "sampleRate", sampleRate, "startCutoffFrequency", startCutoffFrequency, "stopCutoffFrequency", stopCutoffFrequency);
  algoEnergyBand->input("spectrum").set(input_spectrum);
  float output_energyBand;
  algoEnergyBand->output("energyBand").set(output_energyBand);
  algoEnergyBand->compute();
  val outputEnergyBand(val::object());
  outputEnergyBand.set("energyBand", output_energyBand);
  delete algoEnergyBand;
  return outputEnergyBand;
}
 
// check https://essentia.upf.edu/reference/std_EnergyBandRatio.html
val EssentiaJS::EnergyBandRatio(std::vector<float>& input_spectrum, const float sampleRate, const float startFrequency, const float stopFrequency) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoEnergyBandRatio = factory.create("EnergyBandRatio", "sampleRate", sampleRate, "startFrequency", startFrequency, "stopFrequency", stopFrequency);
  algoEnergyBandRatio->input("spectrum").set(input_spectrum);
  float output_energyBandRatio;
  algoEnergyBandRatio->output("energyBandRatio").set(output_energyBandRatio);
  algoEnergyBandRatio->compute();
  val outputEnergyBandRatio(val::object());
  outputEnergyBandRatio.set("energyBandRatio", output_energyBandRatio);
  delete algoEnergyBandRatio;
  return outputEnergyBandRatio;
}
 
// check https://essentia.upf.edu/reference/std_Entropy.html
val EssentiaJS::Entropy(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoEntropy = factory.create("Entropy");
  algoEntropy->input("array").set(input_array);
  float output_entropy;
  algoEntropy->output("entropy").set(output_entropy);
  algoEntropy->compute();
  val outputEntropy(val::object());
  outputEntropy.set("entropy", output_entropy);
  delete algoEntropy;
  return outputEntropy;
}
 
// check https://essentia.upf.edu/reference/std_Envelope.html
val EssentiaJS::Envelope(std::vector<float>& input_signal, const bool applyRectification, const float attackTime, const float releaseTime, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoEnvelope = factory.create("Envelope", "applyRectification", applyRectification, "attackTime", attackTime, "releaseTime", releaseTime, "sampleRate", sampleRate);
  algoEnvelope->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoEnvelope->output("signal").set(output_signal);
  algoEnvelope->compute();
  val outputEnvelope(val::object());
  outputEnvelope.set("signal", output_signal);
  delete algoEnvelope;
  return outputEnvelope;
}
 
// check https://essentia.upf.edu/reference/std_EqualLoudness.html
val EssentiaJS::EqualLoudness(std::vector<float>& input_signal, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoEqualLoudness = factory.create("EqualLoudness", "sampleRate", sampleRate);
  algoEqualLoudness->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoEqualLoudness->output("signal").set(output_signal);
  algoEqualLoudness->compute();
  val outputEqualLoudness(val::object());
  outputEqualLoudness.set("signal", output_signal);
  delete algoEqualLoudness;
  return outputEqualLoudness;
}
 
// check https://essentia.upf.edu/reference/std_Flatness.html
val EssentiaJS::Flatness(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFlatness = factory.create("Flatness");
  algoFlatness->input("array").set(input_array);
  float output_flatness;
  algoFlatness->output("flatness").set(output_flatness);
  algoFlatness->compute();
  val outputFlatness(val::object());
  outputFlatness.set("flatness", output_flatness);
  delete algoFlatness;
  return outputFlatness;
}
 
// check https://essentia.upf.edu/reference/std_FlatnessDB.html
val EssentiaJS::FlatnessDB(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFlatnessDB = factory.create("FlatnessDB");
  algoFlatnessDB->input("array").set(input_array);
  float output_flatnessDB;
  algoFlatnessDB->output("flatnessDB").set(output_flatnessDB);
  algoFlatnessDB->compute();
  val outputFlatnessDB(val::object());
  outputFlatnessDB.set("flatnessDB", output_flatnessDB);
  delete algoFlatnessDB;
  return outputFlatnessDB;
}
 
// check https://essentia.upf.edu/reference/std_FlatnessSFX.html
val EssentiaJS::FlatnessSFX(std::vector<float>& input_envelope) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFlatnessSFX = factory.create("FlatnessSFX");
  algoFlatnessSFX->input("envelope").set(input_envelope);
  float output_flatness;
  algoFlatnessSFX->output("flatness").set(output_flatness);
  algoFlatnessSFX->compute();
  val outputFlatnessSFX(val::object());
  outputFlatnessSFX.set("flatness", output_flatness);
  delete algoFlatnessSFX;
  return outputFlatnessSFX;
}
 
// check https://essentia.upf.edu/reference/std_Flux.html
val EssentiaJS::Flux(std::vector<float>& input_spectrum, const bool halfRectify, const std::string& norm) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFlux = factory.create("Flux", "halfRectify", halfRectify, "norm", norm);
  algoFlux->input("spectrum").set(input_spectrum);
  float output_flux;
  algoFlux->output("flux").set(output_flux);
  algoFlux->compute();
  val outputFlux(val::object());
  outputFlux.set("flux", output_flux);
  delete algoFlux;
  return outputFlux;
}
 
// check https://essentia.upf.edu/reference/std_FrameCutter.html
val EssentiaJS::FrameCutter(std::vector<float>& input_signal, const int frameSize, const int hopSize, const bool lastFrameToEndOfFile, const bool startFromZero, const float validFrameThresholdRatio) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFrameCutter = factory.create("FrameCutter", "frameSize", frameSize, "hopSize", hopSize, "lastFrameToEndOfFile", lastFrameToEndOfFile, "startFromZero", startFromZero, "validFrameThresholdRatio", validFrameThresholdRatio);
  algoFrameCutter->input("signal").set(input_signal);
  std::vector<float> output_frame;
  algoFrameCutter->output("frame").set(output_frame);
  algoFrameCutter->compute();
  val outputFrameCutter(val::object());
  outputFrameCutter.set("frame", output_frame);
  delete algoFrameCutter;
  return outputFrameCutter;
}
 
// check https://essentia.upf.edu/reference/std_FrameToReal.html
val EssentiaJS::FrameToReal(std::vector<float>& input_signal, const int frameSize, const int hopSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFrameToReal = factory.create("FrameToReal", "frameSize", frameSize, "hopSize", hopSize);
  algoFrameToReal->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoFrameToReal->output("signal").set(output_signal);
  algoFrameToReal->compute();
  val outputFrameToReal(val::object());
  outputFrameToReal.set("signal", output_signal);
  delete algoFrameToReal;
  return outputFrameToReal;
}
 
// check https://essentia.upf.edu/reference/std_FrequencyBands.html
val EssentiaJS::FrequencyBands(std::vector<float>& input_spectrum, const std::vector<float>& frequencyBands, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFrequencyBands = factory.create("FrequencyBands", "frequencyBands", frequencyBands, "sampleRate", sampleRate);
  algoFrequencyBands->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  algoFrequencyBands->output("bands").set(output_bands);
  algoFrequencyBands->compute();
  val outputFrequencyBands(val::object());
  outputFrequencyBands.set("bands", output_bands);
  delete algoFrequencyBands;
  return outputFrequencyBands;
}
 
// check https://essentia.upf.edu/reference/std_GFCC.html
val EssentiaJS::GFCC(std::vector<float>& input_spectrum, const int dctType, const float highFrequencyBound, const int inputSize, const std::string& logType, const float lowFrequencyBound, const int numberBands, const int numberCoefficients, const float sampleRate, const float silenceThreshold, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoGFCC = factory.create("GFCC", "dctType", dctType, "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "logType", logType, "lowFrequencyBound", lowFrequencyBound, "numberBands", numberBands, "numberCoefficients", numberCoefficients, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold, "type", type);
  algoGFCC->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  std::vector<float> output_gfcc;
  algoGFCC->output("bands").set(output_bands);
  algoGFCC->output("gfcc").set(output_gfcc);
  algoGFCC->compute();
  val outputGFCC(val::object());
  outputGFCC.set("bands", output_bands);
  outputGFCC.set("gfcc", output_gfcc);
  delete algoGFCC;
  return outputGFCC;
}
 
// check https://essentia.upf.edu/reference/std_GapsDetector.html
val EssentiaJS::GapsDetector(std::vector<float>& input_frame, const float attackTime, const int frameSize, const int hopSize, const int kernelSize, const float maximumTime, const float minimumTime, const float postpowerTime, const float prepowerThreshold, const float prepowerTime, const float releaseTime, const float sampleRate, const float silenceThreshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoGapsDetector = factory.create("GapsDetector", "attackTime", attackTime, "frameSize", frameSize, "hopSize", hopSize, "kernelSize", kernelSize, "maximumTime", maximumTime, "minimumTime", minimumTime, "postpowerTime", postpowerTime, "prepowerThreshold", prepowerThreshold, "prepowerTime", prepowerTime, "releaseTime", releaseTime, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold);
  algoGapsDetector->input("frame").set(input_frame);
  std::vector<float> output_starts;
  std::vector<float> output_ends;
  algoGapsDetector->output("starts").set(output_starts);
  algoGapsDetector->output("ends").set(output_ends);
  algoGapsDetector->compute();
  val outputGapsDetector(val::object());
  outputGapsDetector.set("starts", output_starts);
  outputGapsDetector.set("ends", output_ends);
  delete algoGapsDetector;
  return outputGapsDetector;
}
 
// check https://essentia.upf.edu/reference/std_GeometricMean.html
val EssentiaJS::GeometricMean(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoGeometricMean = factory.create("GeometricMean");
  algoGeometricMean->input("array").set(input_array);
  float output_geometricMean;
  algoGeometricMean->output("geometricMean").set(output_geometricMean);
  algoGeometricMean->compute();
  val outputGeometricMean(val::object());
  outputGeometricMean.set("geometricMean", output_geometricMean);
  delete algoGeometricMean;
  return outputGeometricMean;
}
 
// check https://essentia.upf.edu/reference/std_HFC.html
val EssentiaJS::HFC(std::vector<float>& input_spectrum, const float sampleRate, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHFC = factory.create("HFC", "sampleRate", sampleRate, "type", type);
  algoHFC->input("spectrum").set(input_spectrum);
  float output_hfc;
  algoHFC->output("hfc").set(output_hfc);
  algoHFC->compute();
  val outputHFC(val::object());
  outputHFC.set("hfc", output_hfc);
  delete algoHFC;
  return outputHFC;
}
 
// check https://essentia.upf.edu/reference/std_HPCP.html
val EssentiaJS::HPCP(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, const bool bandPreset, const float bandSplitFrequency, const int harmonics, const float maxFrequency, const bool maxShifted, const float minFrequency, const bool nonLinear, const std::string& normalized, const float referenceFrequency, const float sampleRate, const int size, const std::string& weightType, const float windowSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHPCP = factory.create("HPCP", "bandPreset", bandPreset, "bandSplitFrequency", bandSplitFrequency, "harmonics", harmonics, "maxFrequency", maxFrequency, "maxShifted", maxShifted, "minFrequency", minFrequency, "nonLinear", nonLinear, "normalized", normalized, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "size", size, "weightType", weightType, "windowSize", windowSize);
  algoHPCP->input("frequencies").set(input_frequencies);
  algoHPCP->input("magnitudes").set(input_magnitudes);
  std::vector<float> output_hpcp;
  algoHPCP->output("hpcp").set(output_hpcp);
  algoHPCP->compute();
  val outputHPCP(val::object());
  outputHPCP.set("hpcp", output_hpcp);
  delete algoHPCP;
  return outputHPCP;
}
 
// check https://essentia.upf.edu/reference/std_HarmonicBpm.html
val EssentiaJS::HarmonicBpm(std::vector<float>& input_bpms, const int bpm, const float threshold, const float tolerance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHarmonicBpm = factory.create("HarmonicBpm", "bpm", bpm, "threshold", threshold, "tolerance", tolerance);
  algoHarmonicBpm->input("bpms").set(input_bpms);
  std::vector<float> output_harmonicBpms;
  algoHarmonicBpm->output("harmonicBpms").set(output_harmonicBpms);
  algoHarmonicBpm->compute();
  val outputHarmonicBpm(val::object());
  outputHarmonicBpm.set("harmonicBpms", output_harmonicBpms);
  delete algoHarmonicBpm;
  return outputHarmonicBpm;
}
 
// check https://essentia.upf.edu/reference/std_HarmonicPeaks.html
val EssentiaJS::HarmonicPeaks(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, float input_pitch, const int maxHarmonics, const float tolerance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHarmonicPeaks = factory.create("HarmonicPeaks", "maxHarmonics", maxHarmonics, "tolerance", tolerance);
  algoHarmonicPeaks->input("frequencies").set(input_frequencies);
  algoHarmonicPeaks->input("magnitudes").set(input_magnitudes);
  algoHarmonicPeaks->input("pitch").set(input_pitch);
  std::vector<float> output_harmonicFrequencies;
  std::vector<float> output_harmonicMagnitudes;
  algoHarmonicPeaks->output("harmonicFrequencies").set(output_harmonicFrequencies);
  algoHarmonicPeaks->output("harmonicMagnitudes").set(output_harmonicMagnitudes);
  algoHarmonicPeaks->compute();
  val outputHarmonicPeaks(val::object());
  outputHarmonicPeaks.set("harmonicFrequencies", output_harmonicFrequencies);
  outputHarmonicPeaks.set("harmonicMagnitudes", output_harmonicMagnitudes);
  delete algoHarmonicPeaks;
  return outputHarmonicPeaks;
}
 
// check https://essentia.upf.edu/reference/std_HighPass.html
val EssentiaJS::HighPass(std::vector<float>& input_signal, const float cutoffFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHighPass = factory.create("HighPass", "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
  algoHighPass->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoHighPass->output("signal").set(output_signal);
  algoHighPass->compute();
  val outputHighPass(val::object());
  outputHighPass.set("signal", output_signal);
  delete algoHighPass;
  return outputHighPass;
}
 
// check https://essentia.upf.edu/reference/std_HighResolutionFeatures.html
val EssentiaJS::HighResolutionFeatures(std::vector<float>& input_hpcp, const int maxPeaks) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHighResolutionFeatures = factory.create("HighResolutionFeatures", "maxPeaks", maxPeaks);
  algoHighResolutionFeatures->input("hpcp").set(input_hpcp);
  float output_equalTemperedDeviation;
  float output_nonTemperedEnergyRatio;
  float output_nonTemperedPeaksEnergyRatio;
  algoHighResolutionFeatures->output("equalTemperedDeviation").set(output_equalTemperedDeviation);
  algoHighResolutionFeatures->output("nonTemperedEnergyRatio").set(output_nonTemperedEnergyRatio);
  algoHighResolutionFeatures->output("nonTemperedPeaksEnergyRatio").set(output_nonTemperedPeaksEnergyRatio);
  algoHighResolutionFeatures->compute();
  val outputHighResolutionFeatures(val::object());
  outputHighResolutionFeatures.set("equalTemperedDeviation", output_equalTemperedDeviation);
  outputHighResolutionFeatures.set("nonTemperedEnergyRatio", output_nonTemperedEnergyRatio);
  outputHighResolutionFeatures.set("nonTemperedPeaksEnergyRatio", output_nonTemperedPeaksEnergyRatio);
  delete algoHighResolutionFeatures;
  return outputHighResolutionFeatures;
}
 
// check https://essentia.upf.edu/reference/std_Histogram.html
val EssentiaJS::Histogram(std::vector<float>& input_array, const float maxValue, const float minValue, const std::string& normalize, const int numberBins) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHistogram = factory.create("Histogram", "maxValue", maxValue, "minValue", minValue, "normalize", normalize, "numberBins", numberBins);
  algoHistogram->input("array").set(input_array);
  std::vector<float> output_histogram;
  std::vector<float> output_binEdges;
  algoHistogram->output("histogram").set(output_histogram);
  algoHistogram->output("binEdges").set(output_binEdges);
  algoHistogram->compute();
  val outputHistogram(val::object());
  outputHistogram.set("histogram", output_histogram);
  outputHistogram.set("binEdges", output_binEdges);
  delete algoHistogram;
  return outputHistogram;
}
 
// check https://essentia.upf.edu/reference/std_HprModelAnal.html
val EssentiaJS::HprModelAnal(std::vector<float>& input_frame, float input_pitch, const int fftSize, const int freqDevOffset, const float freqDevSlope, const float harmDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const int nHarmonics, const std::string& orderBy, const float sampleRate, const float stocf) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHprModelAnal = factory.create("HprModelAnal", "fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "harmDevSlope", harmDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "nHarmonics", nHarmonics, "orderBy", orderBy, "sampleRate", sampleRate, "stocf", stocf);
  algoHprModelAnal->input("frame").set(input_frame);
  algoHprModelAnal->input("pitch").set(input_pitch);
  std::vector<float> output_frequencies;
  std::vector<float> output_magnitudes;
  std::vector<float> output_phases;
  std::vector<float> output_res;
  algoHprModelAnal->output("frequencies").set(output_frequencies);
  algoHprModelAnal->output("magnitudes").set(output_magnitudes);
  algoHprModelAnal->output("phases").set(output_phases);
  algoHprModelAnal->output("res").set(output_res);
  algoHprModelAnal->compute();
  val outputHprModelAnal(val::object());
  outputHprModelAnal.set("frequencies", output_frequencies);
  outputHprModelAnal.set("magnitudes", output_magnitudes);
  outputHprModelAnal.set("phases", output_phases);
  outputHprModelAnal.set("res", output_res);
  delete algoHprModelAnal;
  return outputHprModelAnal;
}
 
// check https://essentia.upf.edu/reference/std_HpsModelAnal.html
val EssentiaJS::HpsModelAnal(std::vector<float>& input_frame, float input_pitch, const int fftSize, const int freqDevOffset, const float freqDevSlope, const float harmDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const int nHarmonics, const std::string& orderBy, const float sampleRate, const float stocf) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHpsModelAnal = factory.create("HpsModelAnal", "fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "harmDevSlope", harmDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "nHarmonics", nHarmonics, "orderBy", orderBy, "sampleRate", sampleRate, "stocf", stocf);
  algoHpsModelAnal->input("frame").set(input_frame);
  algoHpsModelAnal->input("pitch").set(input_pitch);
  std::vector<float> output_frequencies;
  std::vector<float> output_magnitudes;
  std::vector<float> output_phases;
  std::vector<float> output_stocenv;
  algoHpsModelAnal->output("frequencies").set(output_frequencies);
  algoHpsModelAnal->output("magnitudes").set(output_magnitudes);
  algoHpsModelAnal->output("phases").set(output_phases);
  algoHpsModelAnal->output("stocenv").set(output_stocenv);
  algoHpsModelAnal->compute();
  val outputHpsModelAnal(val::object());
  outputHpsModelAnal.set("frequencies", output_frequencies);
  outputHpsModelAnal.set("magnitudes", output_magnitudes);
  outputHpsModelAnal.set("phases", output_phases);
  outputHpsModelAnal.set("stocenv", output_stocenv);
  delete algoHpsModelAnal;
  return outputHpsModelAnal;
}
 
// check https://essentia.upf.edu/reference/std_IDCT.html
val EssentiaJS::IDCT(std::vector<float>& input_dct, const int dctType, const int inputSize, const int liftering, const int outputSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoIDCT = factory.create("IDCT", "dctType", dctType, "inputSize", inputSize, "liftering", liftering, "outputSize", outputSize);
  algoIDCT->input("dct").set(input_dct);
  std::vector<float> output_idct;
  algoIDCT->output("idct").set(output_idct);
  algoIDCT->compute();
  val outputIDCT(val::object());
  outputIDCT.set("idct", output_idct);
  delete algoIDCT;
  return outputIDCT;
}
 
// check https://essentia.upf.edu/reference/std_IIR.html
val EssentiaJS::IIR(std::vector<float>& input_signal, const std::vector<float>& denominator, const std::vector<float>& numerator) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoIIR = factory.create("IIR", "denominator", denominator, "numerator", numerator);
  algoIIR->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoIIR->output("signal").set(output_signal);
  algoIIR->compute();
  val outputIIR(val::object());
  outputIIR.set("signal", output_signal);
  delete algoIIR;
  return outputIIR;
}
 
// check https://essentia.upf.edu/reference/std_Inharmonicity.html
val EssentiaJS::Inharmonicity(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoInharmonicity = factory.create("Inharmonicity");
  algoInharmonicity->input("frequencies").set(input_frequencies);
  algoInharmonicity->input("magnitudes").set(input_magnitudes);
  float output_inharmonicity;
  algoInharmonicity->output("inharmonicity").set(output_inharmonicity);
  algoInharmonicity->compute();
  val outputInharmonicity(val::object());
  outputInharmonicity.set("inharmonicity", output_inharmonicity);
  delete algoInharmonicity;
  return outputInharmonicity;
}
 
// check https://essentia.upf.edu/reference/std_InstantPower.html
val EssentiaJS::InstantPower(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoInstantPower = factory.create("InstantPower");
  algoInstantPower->input("array").set(input_array);
  float output_power;
  algoInstantPower->output("power").set(output_power);
  algoInstantPower->compute();
  val outputInstantPower(val::object());
  outputInstantPower.set("power", output_power);
  delete algoInstantPower;
  return outputInstantPower;
}
 
// check https://essentia.upf.edu/reference/std_Intensity.html
val EssentiaJS::Intensity(std::vector<float>& input_signal, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoIntensity = factory.create("Intensity", "sampleRate", sampleRate);
  algoIntensity->input("signal").set(input_signal);
  int output_intensity;
  algoIntensity->output("intensity").set(output_intensity);
  algoIntensity->compute();
  val outputIntensity(val::object());
  outputIntensity.set("intensity", output_intensity);
  delete algoIntensity;
  return outputIntensity;
}
 
// check https://essentia.upf.edu/reference/std_Key.html
val EssentiaJS::Key(std::vector<float>& input_pcp, const int numHarmonics, const int pcpSize, const std::string& profileType, const float slope, const bool useMajMin, const bool usePolyphony, const bool useThreeChords) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoKey = factory.create("Key", "numHarmonics", numHarmonics, "pcpSize", pcpSize, "profileType", profileType, "slope", slope, "useMajMin", useMajMin, "usePolyphony", usePolyphony, "useThreeChords", useThreeChords);
  algoKey->input("pcp").set(input_pcp);
  std::string output_key;
  std::string output_scale;
  float output_strength;
  float output_firstToSecondRelativeStrength;
  algoKey->output("key").set(output_key);
  algoKey->output("scale").set(output_scale);
  algoKey->output("strength").set(output_strength);
  algoKey->output("firstToSecondRelativeStrength").set(output_firstToSecondRelativeStrength);
  algoKey->compute();
  val outputKey(val::object());
  outputKey.set("key", output_key);
  outputKey.set("scale", output_scale);
  outputKey.set("strength", output_strength);
  outputKey.set("firstToSecondRelativeStrength", output_firstToSecondRelativeStrength);
  delete algoKey;
  return outputKey;
}
 
// check https://essentia.upf.edu/reference/std_KeyExtractor.html
val EssentiaJS::KeyExtractor(std::vector<float>& input_audio, const bool averageDetuningCorrection, const int frameSize, const int hopSize, const int hpcpSize, const float maxFrequency, const int maximumSpectralPeaks, const float minFrequency, const float pcpThreshold, const std::string& profileType, const float sampleRate, const float spectralPeaksThreshold, const float tuningFrequency, const std::string& weightType, const std::string& windowType) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoKeyExtractor = factory.create("KeyExtractor", "averageDetuningCorrection", averageDetuningCorrection, "frameSize", frameSize, "hopSize", hopSize, "hpcpSize", hpcpSize, "maxFrequency", maxFrequency, "maximumSpectralPeaks", maximumSpectralPeaks, "minFrequency", minFrequency, "pcpThreshold", pcpThreshold, "profileType", profileType, "sampleRate", sampleRate, "spectralPeaksThreshold", spectralPeaksThreshold, "tuningFrequency", tuningFrequency, "weightType", weightType, "windowType", windowType);
  algoKeyExtractor->input("audio").set(input_audio);
  std::string output_key;
  std::string output_scale;
  float output_strength;
  algoKeyExtractor->output("key").set(output_key);
  algoKeyExtractor->output("scale").set(output_scale);
  algoKeyExtractor->output("strength").set(output_strength);
  algoKeyExtractor->compute();
  val outputKeyExtractor(val::object());
  outputKeyExtractor.set("key", output_key);
  outputKeyExtractor.set("scale", output_scale);
  outputKeyExtractor.set("strength", output_strength);
  delete algoKeyExtractor;
  return outputKeyExtractor;
}
 
// check https://essentia.upf.edu/reference/std_LPC.html
val EssentiaJS::LPC(std::vector<float>& input_frame, const int order, const float sampleRate, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLPC = factory.create("LPC", "order", order, "sampleRate", sampleRate, "type", type);
  algoLPC->input("frame").set(input_frame);
  std::vector<float> output_lpc;
  std::vector<float> output_reflection;
  algoLPC->output("lpc").set(output_lpc);
  algoLPC->output("reflection").set(output_reflection);
  algoLPC->compute();
  val outputLPC(val::object());
  outputLPC.set("lpc", output_lpc);
  outputLPC.set("reflection", output_reflection);
  delete algoLPC;
  return outputLPC;
}
 
// check https://essentia.upf.edu/reference/std_Larm.html
val EssentiaJS::Larm(std::vector<float>& input_signal, const float attackTime, const float power, const float releaseTime, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLarm = factory.create("Larm", "attackTime", attackTime, "power", power, "releaseTime", releaseTime, "sampleRate", sampleRate);
  algoLarm->input("signal").set(input_signal);
  float output_larm;
  algoLarm->output("larm").set(output_larm);
  algoLarm->compute();
  val outputLarm(val::object());
  outputLarm.set("larm", output_larm);
  delete algoLarm;
  return outputLarm;
}
 
// check https://essentia.upf.edu/reference/std_Leq.html
val EssentiaJS::Leq(std::vector<float>& input_signal) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLeq = factory.create("Leq");
  algoLeq->input("signal").set(input_signal);
  float output_leq;
  algoLeq->output("leq").set(output_leq);
  algoLeq->compute();
  val outputLeq(val::object());
  outputLeq.set("leq", output_leq);
  delete algoLeq;
  return outputLeq;
}
 
// check https://essentia.upf.edu/reference/std_LevelExtractor.html
val EssentiaJS::LevelExtractor(std::vector<float>& input_signal, const int frameSize, const int hopSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLevelExtractor = factory.create("LevelExtractor", "frameSize", frameSize, "hopSize", hopSize);
  algoLevelExtractor->input("signal").set(input_signal);
  std::vector<float> output_loudness;
  algoLevelExtractor->output("loudness").set(output_loudness);
  algoLevelExtractor->compute();
  val outputLevelExtractor(val::object());
  outputLevelExtractor.set("loudness", output_loudness);
  delete algoLevelExtractor;
  return outputLevelExtractor;
}
 
// check https://essentia.upf.edu/reference/std_LogAttackTime.html
val EssentiaJS::LogAttackTime(std::vector<float>& input_signal, const float sampleRate, const float startAttackThreshold, const float stopAttackThreshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLogAttackTime = factory.create("LogAttackTime", "sampleRate", sampleRate, "startAttackThreshold", startAttackThreshold, "stopAttackThreshold", stopAttackThreshold);
  algoLogAttackTime->input("signal").set(input_signal);
  float output_logAttackTime;
  float output_attackStart;
  float output_attackStop;
  algoLogAttackTime->output("logAttackTime").set(output_logAttackTime);
  algoLogAttackTime->output("attackStart").set(output_attackStart);
  algoLogAttackTime->output("attackStop").set(output_attackStop);
  algoLogAttackTime->compute();
  val outputLogAttackTime(val::object());
  outputLogAttackTime.set("logAttackTime", output_logAttackTime);
  outputLogAttackTime.set("attackStart", output_attackStart);
  outputLogAttackTime.set("attackStop", output_attackStop);
  delete algoLogAttackTime;
  return outputLogAttackTime;
}
 
// check https://essentia.upf.edu/reference/std_LogSpectrum.html
val EssentiaJS::LogSpectrum(std::vector<float>& input_spectrum, const float binsPerSemitone, const int frameSize, const float rollOn, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLogSpectrum = factory.create("LogSpectrum", "binsPerSemitone", binsPerSemitone, "frameSize", frameSize, "rollOn", rollOn, "sampleRate", sampleRate);
  algoLogSpectrum->input("spectrum").set(input_spectrum);
  std::vector<float> output_logFreqSpectrum;
  std::vector<float> output_meanTuning;
  float output_localTuning;
  algoLogSpectrum->output("logFreqSpectrum").set(output_logFreqSpectrum);
  algoLogSpectrum->output("meanTuning").set(output_meanTuning);
  algoLogSpectrum->output("localTuning").set(output_localTuning);
  algoLogSpectrum->compute();
  val outputLogSpectrum(val::object());
  outputLogSpectrum.set("logFreqSpectrum", output_logFreqSpectrum);
  outputLogSpectrum.set("meanTuning", output_meanTuning);
  outputLogSpectrum.set("localTuning", output_localTuning);
  delete algoLogSpectrum;
  return outputLogSpectrum;
}
 
// check https://essentia.upf.edu/reference/std_LoopBpmConfidence.html
val EssentiaJS::LoopBpmConfidence(std::vector<float>& input_signal, float input_bpmEstimate, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLoopBpmConfidence = factory.create("LoopBpmConfidence", "sampleRate", sampleRate);
  algoLoopBpmConfidence->input("signal").set(input_signal);
  algoLoopBpmConfidence->input("bpmEstimate").set(input_bpmEstimate);
  float output_confidence;
  algoLoopBpmConfidence->output("confidence").set(output_confidence);
  algoLoopBpmConfidence->compute();
  val outputLoopBpmConfidence(val::object());
  outputLoopBpmConfidence.set("confidence", output_confidence);
  delete algoLoopBpmConfidence;
  return outputLoopBpmConfidence;
}
 
// check https://essentia.upf.edu/reference/std_LoopBpmEstimator.html
val EssentiaJS::LoopBpmEstimator(std::vector<float>& input_signal, const float confidenceThreshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLoopBpmEstimator = factory.create("LoopBpmEstimator", "confidenceThreshold", confidenceThreshold);
  algoLoopBpmEstimator->input("signal").set(input_signal);
  float output_bpm;
  algoLoopBpmEstimator->output("bpm").set(output_bpm);
  algoLoopBpmEstimator->compute();
  val outputLoopBpmEstimator(val::object());
  outputLoopBpmEstimator.set("bpm", output_bpm);
  delete algoLoopBpmEstimator;
  return outputLoopBpmEstimator;
}
 
// check https://essentia.upf.edu/reference/std_Loudness.html
val EssentiaJS::Loudness(std::vector<float>& input_signal) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLoudness = factory.create("Loudness");
  algoLoudness->input("signal").set(input_signal);
  float output_loudness;
  algoLoudness->output("loudness").set(output_loudness);
  algoLoudness->compute();
  val outputLoudness(val::object());
  outputLoudness.set("loudness", output_loudness);
  delete algoLoudness;
  return outputLoudness;
}
 
// check https://essentia.upf.edu/reference/std_LoudnessVickers.html
val EssentiaJS::LoudnessVickers(std::vector<float>& input_signal, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLoudnessVickers = factory.create("LoudnessVickers", "sampleRate", sampleRate);
  algoLoudnessVickers->input("signal").set(input_signal);
  float output_loudness;
  algoLoudnessVickers->output("loudness").set(output_loudness);
  algoLoudnessVickers->compute();
  val outputLoudnessVickers(val::object());
  outputLoudnessVickers.set("loudness", output_loudness);
  delete algoLoudnessVickers;
  return outputLoudnessVickers;
}
 
// check https://essentia.upf.edu/reference/std_LowLevelSpectralEqloudExtractor.html
val EssentiaJS::LowLevelSpectralEqloudExtractor(std::vector<float>& input_signal, const int frameSize, const int hopSize, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLowLevelSpectralEqloudExtractor = factory.create("LowLevelSpectralEqloudExtractor", "frameSize", frameSize, "hopSize", hopSize, "sampleRate", sampleRate);
  algoLowLevelSpectralEqloudExtractor->input("signal").set(input_signal);
  std::vector<float> output_dissonance;
  std::vector<std::vector<float> > output_sccoeffs;
  std::vector<std::vector<float> > output_scvalleys;
  std::vector<float> output_spectral_centroid;
  std::vector<float> output_spectral_kurtosis;
  std::vector<float> output_spectral_skewness;
  std::vector<float> output_spectral_spread;
  algoLowLevelSpectralEqloudExtractor->output("dissonance").set(output_dissonance);
  algoLowLevelSpectralEqloudExtractor->output("sccoeffs").set(output_sccoeffs);
  algoLowLevelSpectralEqloudExtractor->output("scvalleys").set(output_scvalleys);
  algoLowLevelSpectralEqloudExtractor->output("spectral_centroid").set(output_spectral_centroid);
  algoLowLevelSpectralEqloudExtractor->output("spectral_kurtosis").set(output_spectral_kurtosis);
  algoLowLevelSpectralEqloudExtractor->output("spectral_skewness").set(output_spectral_skewness);
  algoLowLevelSpectralEqloudExtractor->output("spectral_spread").set(output_spectral_spread);
  algoLowLevelSpectralEqloudExtractor->compute();
  val outputLowLevelSpectralEqloudExtractor(val::object());
  outputLowLevelSpectralEqloudExtractor.set("dissonance", output_dissonance);
  outputLowLevelSpectralEqloudExtractor.set("sccoeffs", output_sccoeffs);
  outputLowLevelSpectralEqloudExtractor.set("scvalleys", output_scvalleys);
  outputLowLevelSpectralEqloudExtractor.set("spectral_centroid", output_spectral_centroid);
  outputLowLevelSpectralEqloudExtractor.set("spectral_kurtosis", output_spectral_kurtosis);
  outputLowLevelSpectralEqloudExtractor.set("spectral_skewness", output_spectral_skewness);
  outputLowLevelSpectralEqloudExtractor.set("spectral_spread", output_spectral_spread);
  delete algoLowLevelSpectralEqloudExtractor;
  return outputLowLevelSpectralEqloudExtractor;
}
 
// check https://essentia.upf.edu/reference/std_LowLevelSpectralExtractor.html
val EssentiaJS::LowLevelSpectralExtractor(std::vector<float>& input_signal, const int frameSize, const int hopSize, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLowLevelSpectralExtractor = factory.create("LowLevelSpectralExtractor", "frameSize", frameSize, "hopSize", hopSize, "sampleRate", sampleRate);
  algoLowLevelSpectralExtractor->input("signal").set(input_signal);
  std::vector<std::vector<float> > output_barkbands;
  std::vector<float> output_barkbands_kurtosis;
  std::vector<float> output_barkbands_skewness;
  std::vector<float> output_barkbands_spread;
  std::vector<float> output_hfc;
  std::vector<std::vector<float> > output_mfcc;
  std::vector<float> output_pitch;
  std::vector<float> output_pitch_instantaneous_confidence;
  std::vector<float> output_pitch_salience;
  std::vector<float> output_silence_rate_20dB;
  std::vector<float> output_silence_rate_30dB;
  std::vector<float> output_silence_rate_60dB;
  std::vector<float> output_spectral_complexity;
  std::vector<float> output_spectral_crest;
  std::vector<float> output_spectral_decrease;
  std::vector<float> output_spectral_energy;
  std::vector<float> output_spectral_energyband_low;
  std::vector<float> output_spectral_energyband_middle_low;
  std::vector<float> output_spectral_energyband_middle_high;
  std::vector<float> output_spectral_energyband_high;
  std::vector<float> output_spectral_flatness_db;
  std::vector<float> output_spectral_flux;
  std::vector<float> output_spectral_rms;
  std::vector<float> output_spectral_rolloff;
  std::vector<float> output_spectral_strongpeak;
  std::vector<float> output_zerocrossingrate;
  std::vector<float> output_inharmonicity;
  std::vector<std::vector<float> > output_tristimulus;
  std::vector<float> output_oddtoevenharmonicenergyratio;
  algoLowLevelSpectralExtractor->output("barkbands").set(output_barkbands);
  algoLowLevelSpectralExtractor->output("barkbands_kurtosis").set(output_barkbands_kurtosis);
  algoLowLevelSpectralExtractor->output("barkbands_skewness").set(output_barkbands_skewness);
  algoLowLevelSpectralExtractor->output("barkbands_spread").set(output_barkbands_spread);
  algoLowLevelSpectralExtractor->output("hfc").set(output_hfc);
  algoLowLevelSpectralExtractor->output("mfcc").set(output_mfcc);
  algoLowLevelSpectralExtractor->output("pitch").set(output_pitch);
  algoLowLevelSpectralExtractor->output("pitch_instantaneous_confidence").set(output_pitch_instantaneous_confidence);
  algoLowLevelSpectralExtractor->output("pitch_salience").set(output_pitch_salience);
  algoLowLevelSpectralExtractor->output("silence_rate_20dB").set(output_silence_rate_20dB);
  algoLowLevelSpectralExtractor->output("silence_rate_30dB").set(output_silence_rate_30dB);
  algoLowLevelSpectralExtractor->output("silence_rate_60dB").set(output_silence_rate_60dB);
  algoLowLevelSpectralExtractor->output("spectral_complexity").set(output_spectral_complexity);
  algoLowLevelSpectralExtractor->output("spectral_crest").set(output_spectral_crest);
  algoLowLevelSpectralExtractor->output("spectral_decrease").set(output_spectral_decrease);
  algoLowLevelSpectralExtractor->output("spectral_energy").set(output_spectral_energy);
  algoLowLevelSpectralExtractor->output("spectral_energyband_low").set(output_spectral_energyband_low);
  algoLowLevelSpectralExtractor->output("spectral_energyband_middle_low").set(output_spectral_energyband_middle_low);
  algoLowLevelSpectralExtractor->output("spectral_energyband_middle_high").set(output_spectral_energyband_middle_high);
  algoLowLevelSpectralExtractor->output("spectral_energyband_high").set(output_spectral_energyband_high);
  algoLowLevelSpectralExtractor->output("spectral_flatness_db").set(output_spectral_flatness_db);
  algoLowLevelSpectralExtractor->output("spectral_flux").set(output_spectral_flux);
  algoLowLevelSpectralExtractor->output("spectral_rms").set(output_spectral_rms);
  algoLowLevelSpectralExtractor->output("spectral_rolloff").set(output_spectral_rolloff);
  algoLowLevelSpectralExtractor->output("spectral_strongpeak").set(output_spectral_strongpeak);
  algoLowLevelSpectralExtractor->output("zerocrossingrate").set(output_zerocrossingrate);
  algoLowLevelSpectralExtractor->output("inharmonicity").set(output_inharmonicity);
  algoLowLevelSpectralExtractor->output("tristimulus").set(output_tristimulus);
  algoLowLevelSpectralExtractor->output("oddtoevenharmonicenergyratio").set(output_oddtoevenharmonicenergyratio);
  algoLowLevelSpectralExtractor->compute();
  val outputLowLevelSpectralExtractor(val::object());
  outputLowLevelSpectralExtractor.set("barkbands", output_barkbands);
  outputLowLevelSpectralExtractor.set("barkbands_kurtosis", output_barkbands_kurtosis);
  outputLowLevelSpectralExtractor.set("barkbands_skewness", output_barkbands_skewness);
  outputLowLevelSpectralExtractor.set("barkbands_spread", output_barkbands_spread);
  outputLowLevelSpectralExtractor.set("hfc", output_hfc);
  outputLowLevelSpectralExtractor.set("mfcc", output_mfcc);
  outputLowLevelSpectralExtractor.set("pitch", output_pitch);
  outputLowLevelSpectralExtractor.set("pitch_instantaneous_confidence", output_pitch_instantaneous_confidence);
  outputLowLevelSpectralExtractor.set("pitch_salience", output_pitch_salience);
  outputLowLevelSpectralExtractor.set("silence_rate_20dB", output_silence_rate_20dB);
  outputLowLevelSpectralExtractor.set("silence_rate_30dB", output_silence_rate_30dB);
  outputLowLevelSpectralExtractor.set("silence_rate_60dB", output_silence_rate_60dB);
  outputLowLevelSpectralExtractor.set("spectral_complexity", output_spectral_complexity);
  outputLowLevelSpectralExtractor.set("spectral_crest", output_spectral_crest);
  outputLowLevelSpectralExtractor.set("spectral_decrease", output_spectral_decrease);
  outputLowLevelSpectralExtractor.set("spectral_energy", output_spectral_energy);
  outputLowLevelSpectralExtractor.set("spectral_energyband_low", output_spectral_energyband_low);
  outputLowLevelSpectralExtractor.set("spectral_energyband_middle_low", output_spectral_energyband_middle_low);
  outputLowLevelSpectralExtractor.set("spectral_energyband_middle_high", output_spectral_energyband_middle_high);
  outputLowLevelSpectralExtractor.set("spectral_energyband_high", output_spectral_energyband_high);
  outputLowLevelSpectralExtractor.set("spectral_flatness_db", output_spectral_flatness_db);
  outputLowLevelSpectralExtractor.set("spectral_flux", output_spectral_flux);
  outputLowLevelSpectralExtractor.set("spectral_rms", output_spectral_rms);
  outputLowLevelSpectralExtractor.set("spectral_rolloff", output_spectral_rolloff);
  outputLowLevelSpectralExtractor.set("spectral_strongpeak", output_spectral_strongpeak);
  outputLowLevelSpectralExtractor.set("zerocrossingrate", output_zerocrossingrate);
  outputLowLevelSpectralExtractor.set("inharmonicity", output_inharmonicity);
  outputLowLevelSpectralExtractor.set("tristimulus", output_tristimulus);
  outputLowLevelSpectralExtractor.set("oddtoevenharmonicenergyratio", output_oddtoevenharmonicenergyratio);
  delete algoLowLevelSpectralExtractor;
  return outputLowLevelSpectralExtractor;
}
 
// check https://essentia.upf.edu/reference/std_LowPass.html
val EssentiaJS::LowPass(std::vector<float>& input_signal, const float cutoffFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLowPass = factory.create("LowPass", "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
  algoLowPass->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoLowPass->output("signal").set(output_signal);
  algoLowPass->compute();
  val outputLowPass(val::object());
  outputLowPass.set("signal", output_signal);
  delete algoLowPass;
  return outputLowPass;
}
 
// check https://essentia.upf.edu/reference/std_MFCC.html
val EssentiaJS::MFCC(std::vector<float>& input_spectrum, const int dctType, const float highFrequencyBound, const int inputSize, const int liftering, const std::string& logType, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const int numberCoefficients, const float sampleRate, const float silenceThreshold, const std::string& type, const std::string& warpingFormula, const std::string& weighting) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMFCC = factory.create("MFCC", "dctType", dctType, "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "liftering", liftering, "logType", logType, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "numberCoefficients", numberCoefficients, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold, "type", type, "warpingFormula", warpingFormula, "weighting", weighting);
  algoMFCC->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  std::vector<float> output_mfcc;
  algoMFCC->output("bands").set(output_bands);
  algoMFCC->output("mfcc").set(output_mfcc);
  algoMFCC->compute();
  val outputMFCC(val::object());
  outputMFCC.set("bands", output_bands);
  outputMFCC.set("mfcc", output_mfcc);
  delete algoMFCC;
  return outputMFCC;
}
 
// check https://essentia.upf.edu/reference/std_MaxFilter.html
val EssentiaJS::MaxFilter(std::vector<float>& input_signal, const bool causal, const int width) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMaxFilter = factory.create("MaxFilter", "causal", causal, "width", width);
  algoMaxFilter->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoMaxFilter->output("signal").set(output_signal);
  algoMaxFilter->compute();
  val outputMaxFilter(val::object());
  outputMaxFilter.set("signal", output_signal);
  delete algoMaxFilter;
  return outputMaxFilter;
}
 
// check https://essentia.upf.edu/reference/std_MaxMagFreq.html
val EssentiaJS::MaxMagFreq(std::vector<float>& input_spectrum, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMaxMagFreq = factory.create("MaxMagFreq", "sampleRate", sampleRate);
  algoMaxMagFreq->input("spectrum").set(input_spectrum);
  float output_maxMagFreq;
  algoMaxMagFreq->output("maxMagFreq").set(output_maxMagFreq);
  algoMaxMagFreq->compute();
  val outputMaxMagFreq(val::object());
  outputMaxMagFreq.set("maxMagFreq", output_maxMagFreq);
  delete algoMaxMagFreq;
  return outputMaxMagFreq;
}
 
// check https://essentia.upf.edu/reference/std_MaxToTotal.html
val EssentiaJS::MaxToTotal(std::vector<float>& input_envelope) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMaxToTotal = factory.create("MaxToTotal");
  algoMaxToTotal->input("envelope").set(input_envelope);
  float output_maxToTotal;
  algoMaxToTotal->output("maxToTotal").set(output_maxToTotal);
  algoMaxToTotal->compute();
  val outputMaxToTotal(val::object());
  outputMaxToTotal.set("maxToTotal", output_maxToTotal);
  delete algoMaxToTotal;
  return outputMaxToTotal;
}
 
// check https://essentia.upf.edu/reference/std_Mean.html
val EssentiaJS::Mean(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMean = factory.create("Mean");
  algoMean->input("array").set(input_array);
  float output_mean;
  algoMean->output("mean").set(output_mean);
  algoMean->compute();
  val outputMean(val::object());
  outputMean.set("mean", output_mean);
  delete algoMean;
  return outputMean;
}
 
// check https://essentia.upf.edu/reference/std_Median.html
val EssentiaJS::Median(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMedian = factory.create("Median");
  algoMedian->input("array").set(input_array);
  float output_median;
  algoMedian->output("median").set(output_median);
  algoMedian->compute();
  val outputMedian(val::object());
  outputMedian.set("median", output_median);
  delete algoMedian;
  return outputMedian;
}
 
// check https://essentia.upf.edu/reference/std_MedianFilter.html
val EssentiaJS::MedianFilter(std::vector<float>& input_array, const int kernelSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMedianFilter = factory.create("MedianFilter", "kernelSize", kernelSize);
  algoMedianFilter->input("array").set(input_array);
  std::vector<float> output_filteredArray;
  algoMedianFilter->output("filteredArray").set(output_filteredArray);
  algoMedianFilter->compute();
  val outputMedianFilter(val::object());
  outputMedianFilter.set("filteredArray", output_filteredArray);
  delete algoMedianFilter;
  return outputMedianFilter;
}
 
// check https://essentia.upf.edu/reference/std_MelBands.html
val EssentiaJS::MelBands(std::vector<float>& input_spectrum, const float highFrequencyBound, const int inputSize, const bool log, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const float sampleRate, const std::string& type, const std::string& warpingFormula, const std::string& weighting) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMelBands = factory.create("MelBands", "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "log", log, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "sampleRate", sampleRate, "type", type, "warpingFormula", warpingFormula, "weighting", weighting);
  algoMelBands->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  algoMelBands->output("bands").set(output_bands);
  algoMelBands->compute();
  val outputMelBands(val::object());
  outputMelBands.set("bands", output_bands);
  delete algoMelBands;
  return outputMelBands;
}
 
// check https://essentia.upf.edu/reference/std_Meter.html
val EssentiaJS::Meter(std::vector<std::vector<float> >& input_beatogram) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMeter = factory.create("Meter");
  algoMeter->input("beatogram").set(input_beatogram);
  float output_meter;
  algoMeter->output("meter").set(output_meter);
  algoMeter->compute();
  val outputMeter(val::object());
  outputMeter.set("meter", output_meter);
  delete algoMeter;
  return outputMeter;
}
 
// check https://essentia.upf.edu/reference/std_MinMax.html
val EssentiaJS::MinMax(std::vector<float>& input_array, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMinMax = factory.create("MinMax", "type", type);
  algoMinMax->input("array").set(input_array);
  float output_real;
  int output_int;
  algoMinMax->output("real").set(output_real);
  algoMinMax->output("int").set(output_int);
  algoMinMax->compute();
  val outputMinMax(val::object());
  outputMinMax.set("real", output_real);
  outputMinMax.set("int", output_int);
  delete algoMinMax;
  return outputMinMax;
}
 
// check https://essentia.upf.edu/reference/std_MinToTotal.html
val EssentiaJS::MinToTotal(std::vector<float>& input_envelope) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMinToTotal = factory.create("MinToTotal");
  algoMinToTotal->input("envelope").set(input_envelope);
  float output_minToTotal;
  algoMinToTotal->output("minToTotal").set(output_minToTotal);
  algoMinToTotal->compute();
  val outputMinToTotal(val::object());
  outputMinToTotal.set("minToTotal", output_minToTotal);
  delete algoMinToTotal;
  return outputMinToTotal;
}
 
// check https://essentia.upf.edu/reference/std_MovingAverage.html
val EssentiaJS::MovingAverage(std::vector<float>& input_signal, const int size) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMovingAverage = factory.create("MovingAverage", "size", size);
  algoMovingAverage->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoMovingAverage->output("signal").set(output_signal);
  algoMovingAverage->compute();
  val outputMovingAverage(val::object());
  outputMovingAverage.set("signal", output_signal);
  delete algoMovingAverage;
  return outputMovingAverage;
}
 
// check https://essentia.upf.edu/reference/std_MultiPitchKlapuri.html
val EssentiaJS::MultiPitchKlapuri(std::vector<float>& input_signal, const float binResolution, const int frameSize, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const int magnitudeThreshold, const float maxFrequency, const float minFrequency, const int numberHarmonics, const float referenceFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMultiPitchKlapuri = factory.create("MultiPitchKlapuri", "binResolution", binResolution, "frameSize", frameSize, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "numberHarmonics", numberHarmonics, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate);
  algoMultiPitchKlapuri->input("signal").set(input_signal);
  std::vector<std::vector<float> > output_pitch;
  algoMultiPitchKlapuri->output("pitch").set(output_pitch);
  algoMultiPitchKlapuri->compute();
  val outputMultiPitchKlapuri(val::object());
  outputMultiPitchKlapuri.set("pitch", output_pitch);
  delete algoMultiPitchKlapuri;
  return outputMultiPitchKlapuri;
}
 
// check https://essentia.upf.edu/reference/std_MultiPitchMelodia.html
val EssentiaJS::MultiPitchMelodia(std::vector<float>& input_signal, const float binResolution, const int filterIterations, const int frameSize, const bool guessUnvoiced, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const int magnitudeThreshold, const float maxFrequency, const int minDuration, const float minFrequency, const int numberHarmonics, const float peakDistributionThreshold, const float peakFrameThreshold, const float pitchContinuity, const float referenceFrequency, const float sampleRate, const int timeContinuity) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMultiPitchMelodia = factory.create("MultiPitchMelodia", "binResolution", binResolution, "filterIterations", filterIterations, "frameSize", frameSize, "guessUnvoiced", guessUnvoiced, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "minDuration", minDuration, "minFrequency", minFrequency, "numberHarmonics", numberHarmonics, "peakDistributionThreshold", peakDistributionThreshold, "peakFrameThreshold", peakFrameThreshold, "pitchContinuity", pitchContinuity, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "timeContinuity", timeContinuity);
  algoMultiPitchMelodia->input("signal").set(input_signal);
  std::vector<std::vector<float> > output_pitch;
  algoMultiPitchMelodia->output("pitch").set(output_pitch);
  algoMultiPitchMelodia->compute();
  val outputMultiPitchMelodia(val::object());
  outputMultiPitchMelodia.set("pitch", output_pitch);
  delete algoMultiPitchMelodia;
  return outputMultiPitchMelodia;
}
 
// check https://essentia.upf.edu/reference/std_Multiplexer.html
val EssentiaJS::Multiplexer(const int numberRealInputs, const int numberVectorRealInputs) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMultiplexer = factory.create("Multiplexer", "numberRealInputs", numberRealInputs, "numberVectorRealInputs", numberVectorRealInputs);
  std::vector<std::vector<float> > output_data;
  algoMultiplexer->output("data").set(output_data);
  algoMultiplexer->compute();
  val outputMultiplexer(val::object());
  outputMultiplexer.set("data", output_data);
  delete algoMultiplexer;
  return outputMultiplexer;
}
 
// check https://essentia.upf.edu/reference/std_NNLSChroma.html
val EssentiaJS::NNLSChroma(std::vector<std::vector<float> >& input_logSpectrogram, std::vector<float>& input_meanTuning, std::vector<float>& input_localTuning, const std::string& chromaNormalization, const int frameSize, const float sampleRate, const float spectralShape, const float spectralWhitening, const std::string& tuningMode, const bool useNNLS) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoNNLSChroma = factory.create("NNLSChroma", "chromaNormalization", chromaNormalization, "frameSize", frameSize, "sampleRate", sampleRate, "spectralShape", spectralShape, "spectralWhitening", spectralWhitening, "tuningMode", tuningMode, "useNNLS", useNNLS);
  algoNNLSChroma->input("logSpectrogram").set(input_logSpectrogram);
  algoNNLSChroma->input("meanTuning").set(input_meanTuning);
  algoNNLSChroma->input("localTuning").set(input_localTuning);
  std::vector<std::vector<float> > output_tunedLogfreqSpectrum;
  std::vector<std::vector<float> > output_semitoneSpectrum;
  std::vector<std::vector<float> > output_bassChromagram;
  std::vector<std::vector<float> > output_chromagram;
  algoNNLSChroma->output("tunedLogfreqSpectrum").set(output_tunedLogfreqSpectrum);
  algoNNLSChroma->output("semitoneSpectrum").set(output_semitoneSpectrum);
  algoNNLSChroma->output("bassChromagram").set(output_bassChromagram);
  algoNNLSChroma->output("chromagram").set(output_chromagram);
  algoNNLSChroma->compute();
  val outputNNLSChroma(val::object());
  outputNNLSChroma.set("tunedLogfreqSpectrum", output_tunedLogfreqSpectrum);
  outputNNLSChroma.set("semitoneSpectrum", output_semitoneSpectrum);
  outputNNLSChroma.set("bassChromagram", output_bassChromagram);
  outputNNLSChroma.set("chromagram", output_chromagram);
  delete algoNNLSChroma;
  return outputNNLSChroma;
}
 
// check https://essentia.upf.edu/reference/std_NoiseAdder.html
val EssentiaJS::NoiseAdder(std::vector<float>& input_signal, const bool fixSeed, const int level) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoNoiseAdder = factory.create("NoiseAdder", "fixSeed", fixSeed, "level", level);
  algoNoiseAdder->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoNoiseAdder->output("signal").set(output_signal);
  algoNoiseAdder->compute();
  val outputNoiseAdder(val::object());
  outputNoiseAdder.set("signal", output_signal);
  delete algoNoiseAdder;
  return outputNoiseAdder;
}
 
// check https://essentia.upf.edu/reference/std_NoiseBurstDetector.html
val EssentiaJS::NoiseBurstDetector(std::vector<float>& input_frame, const float alpha, const int silenceThreshold, const int threshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoNoiseBurstDetector = factory.create("NoiseBurstDetector", "alpha", alpha, "silenceThreshold", silenceThreshold, "threshold", threshold);
  algoNoiseBurstDetector->input("frame").set(input_frame);
  std::vector<float> output_indexes;
  algoNoiseBurstDetector->output("indexes").set(output_indexes);
  algoNoiseBurstDetector->compute();
  val outputNoiseBurstDetector(val::object());
  outputNoiseBurstDetector.set("indexes", output_indexes);
  delete algoNoiseBurstDetector;
  return outputNoiseBurstDetector;
}
 
// check https://essentia.upf.edu/reference/std_NoveltyCurve.html
val EssentiaJS::NoveltyCurve(std::vector<std::vector<float> >& input_frequencyBands, const float frameRate, const bool normalize, const std::vector<float>& weightCurve, const std::string& weightCurveType) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoNoveltyCurve = factory.create("NoveltyCurve", "frameRate", frameRate, "normalize", normalize, "weightCurve", weightCurve, "weightCurveType", weightCurveType);
  algoNoveltyCurve->input("frequencyBands").set(input_frequencyBands);
  std::vector<float> output_novelty;
  algoNoveltyCurve->output("novelty").set(output_novelty);
  algoNoveltyCurve->compute();
  val outputNoveltyCurve(val::object());
  outputNoveltyCurve.set("novelty", output_novelty);
  delete algoNoveltyCurve;
  return outputNoveltyCurve;
}
 
// check https://essentia.upf.edu/reference/std_NoveltyCurveFixedBpmEstimator.html
val EssentiaJS::NoveltyCurveFixedBpmEstimator(std::vector<float>& input_novelty, const int hopSize, const float maxBpm, const float minBpm, const float sampleRate, const float tolerance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoNoveltyCurveFixedBpmEstimator = factory.create("NoveltyCurveFixedBpmEstimator", "hopSize", hopSize, "maxBpm", maxBpm, "minBpm", minBpm, "sampleRate", sampleRate, "tolerance", tolerance);
  algoNoveltyCurveFixedBpmEstimator->input("novelty").set(input_novelty);
  std::vector<float> output_bpms;
  std::vector<float> output_amplitudes;
  algoNoveltyCurveFixedBpmEstimator->output("bpms").set(output_bpms);
  algoNoveltyCurveFixedBpmEstimator->output("amplitudes").set(output_amplitudes);
  algoNoveltyCurveFixedBpmEstimator->compute();
  val outputNoveltyCurveFixedBpmEstimator(val::object());
  outputNoveltyCurveFixedBpmEstimator.set("bpms", output_bpms);
  outputNoveltyCurveFixedBpmEstimator.set("amplitudes", output_amplitudes);
  delete algoNoveltyCurveFixedBpmEstimator;
  return outputNoveltyCurveFixedBpmEstimator;
}
 
// check https://essentia.upf.edu/reference/std_OddToEvenHarmonicEnergyRatio.html
val EssentiaJS::OddToEvenHarmonicEnergyRatio(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoOddToEvenHarmonicEnergyRatio = factory.create("OddToEvenHarmonicEnergyRatio");
  algoOddToEvenHarmonicEnergyRatio->input("frequencies").set(input_frequencies);
  algoOddToEvenHarmonicEnergyRatio->input("magnitudes").set(input_magnitudes);
  float output_oddToEvenHarmonicEnergyRatio;
  algoOddToEvenHarmonicEnergyRatio->output("oddToEvenHarmonicEnergyRatio").set(output_oddToEvenHarmonicEnergyRatio);
  algoOddToEvenHarmonicEnergyRatio->compute();
  val outputOddToEvenHarmonicEnergyRatio(val::object());
  outputOddToEvenHarmonicEnergyRatio.set("oddToEvenHarmonicEnergyRatio", output_oddToEvenHarmonicEnergyRatio);
  delete algoOddToEvenHarmonicEnergyRatio;
  return outputOddToEvenHarmonicEnergyRatio;
}
 
// check https://essentia.upf.edu/reference/std_OnsetDetection.html
val EssentiaJS::OnsetDetection(std::vector<float>& input_spectrum, std::vector<float>& input_phase, const std::string& method, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoOnsetDetection = factory.create("OnsetDetection", "method", method, "sampleRate", sampleRate);
  algoOnsetDetection->input("spectrum").set(input_spectrum);
  algoOnsetDetection->input("phase").set(input_phase);
  float output_onsetDetection;
  algoOnsetDetection->output("onsetDetection").set(output_onsetDetection);
  algoOnsetDetection->compute();
  val outputOnsetDetection(val::object());
  outputOnsetDetection.set("onsetDetection", output_onsetDetection);
  delete algoOnsetDetection;
  return outputOnsetDetection;
}
 
// check https://essentia.upf.edu/reference/std_OnsetDetectionGlobal.html
val EssentiaJS::OnsetDetectionGlobal(std::vector<float>& input_signal, const int frameSize, const int hopSize, const std::string& method, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoOnsetDetectionGlobal = factory.create("OnsetDetectionGlobal", "frameSize", frameSize, "hopSize", hopSize, "method", method, "sampleRate", sampleRate);
  algoOnsetDetectionGlobal->input("signal").set(input_signal);
  std::vector<float> output_onsetDetections;
  algoOnsetDetectionGlobal->output("onsetDetections").set(output_onsetDetections);
  algoOnsetDetectionGlobal->compute();
  val outputOnsetDetectionGlobal(val::object());
  outputOnsetDetectionGlobal.set("onsetDetections", output_onsetDetections);
  delete algoOnsetDetectionGlobal;
  return outputOnsetDetectionGlobal;
}
 
// check https://essentia.upf.edu/reference/std_OnsetRate.html
val EssentiaJS::OnsetRate(std::vector<float>& input_signal) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoOnsetRate = factory.create("OnsetRate");
  algoOnsetRate->input("signal").set(input_signal);
  std::vector<float> output_onsets;
  float output_onsetRate;
  algoOnsetRate->output("onsets").set(output_onsets);
  algoOnsetRate->output("onsetRate").set(output_onsetRate);
  algoOnsetRate->compute();
  val outputOnsetRate(val::object());
  outputOnsetRate.set("onsets", output_onsets);
  outputOnsetRate.set("onsetRate", output_onsetRate);
  delete algoOnsetRate;
  return outputOnsetRate;
}
 
// check https://essentia.upf.edu/reference/std_OverlapAdd.html
val EssentiaJS::OverlapAdd(std::vector<float>& input_signal, const int frameSize, const float gain, const int hopSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoOverlapAdd = factory.create("OverlapAdd", "frameSize", frameSize, "gain", gain, "hopSize", hopSize);
  algoOverlapAdd->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoOverlapAdd->output("signal").set(output_signal);
  algoOverlapAdd->compute();
  val outputOverlapAdd(val::object());
  outputOverlapAdd.set("signal", output_signal);
  delete algoOverlapAdd;
  return outputOverlapAdd;
}
 
// check https://essentia.upf.edu/reference/std_PeakDetection.html
val EssentiaJS::PeakDetection(std::vector<float>& input_array, const bool interpolate, const int maxPeaks, const float maxPosition, const float minPeakDistance, const float minPosition, const std::string& orderBy, const float range, const float threshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPeakDetection = factory.create("PeakDetection", "interpolate", interpolate, "maxPeaks", maxPeaks, "maxPosition", maxPosition, "minPeakDistance", minPeakDistance, "minPosition", minPosition, "orderBy", orderBy, "range", range, "threshold", threshold);
  algoPeakDetection->input("array").set(input_array);
  std::vector<float> output_positions;
  std::vector<float> output_amplitudes;
  algoPeakDetection->output("positions").set(output_positions);
  algoPeakDetection->output("amplitudes").set(output_amplitudes);
  algoPeakDetection->compute();
  val outputPeakDetection(val::object());
  outputPeakDetection.set("positions", output_positions);
  outputPeakDetection.set("amplitudes", output_amplitudes);
  delete algoPeakDetection;
  return outputPeakDetection;
}
 
// check https://essentia.upf.edu/reference/std_PercivalBpmEstimator.html
val EssentiaJS::PercivalBpmEstimator(std::vector<float>& input_signal, const int frameSize, const int frameSizeOSS, const int hopSize, const int hopSizeOSS, const int maxBPM, const int minBPM, const int sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPercivalBpmEstimator = factory.create("PercivalBpmEstimator", "frameSize", frameSize, "frameSizeOSS", frameSizeOSS, "hopSize", hopSize, "hopSizeOSS", hopSizeOSS, "maxBPM", maxBPM, "minBPM", minBPM, "sampleRate", sampleRate);
  algoPercivalBpmEstimator->input("signal").set(input_signal);
  float output_bpm;
  algoPercivalBpmEstimator->output("bpm").set(output_bpm);
  algoPercivalBpmEstimator->compute();
  val outputPercivalBpmEstimator(val::object());
  outputPercivalBpmEstimator.set("bpm", output_bpm);
  delete algoPercivalBpmEstimator;
  return outputPercivalBpmEstimator;
}
 
// check https://essentia.upf.edu/reference/std_PercivalEnhanceHarmonics.html
val EssentiaJS::PercivalEnhanceHarmonics(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPercivalEnhanceHarmonics = factory.create("PercivalEnhanceHarmonics");
  algoPercivalEnhanceHarmonics->input("array").set(input_array);
  std::vector<float> output_array;
  algoPercivalEnhanceHarmonics->output("array").set(output_array);
  algoPercivalEnhanceHarmonics->compute();
  val outputPercivalEnhanceHarmonics(val::object());
  outputPercivalEnhanceHarmonics.set("array", output_array);
  delete algoPercivalEnhanceHarmonics;
  return outputPercivalEnhanceHarmonics;
}
 
// check https://essentia.upf.edu/reference/std_PercivalEvaluatePulseTrains.html
val EssentiaJS::PercivalEvaluatePulseTrains(std::vector<float>& input_oss, std::vector<float>& input_positions) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPercivalEvaluatePulseTrains = factory.create("PercivalEvaluatePulseTrains");
  algoPercivalEvaluatePulseTrains->input("oss").set(input_oss);
  algoPercivalEvaluatePulseTrains->input("positions").set(input_positions);
  float output_lag;
  algoPercivalEvaluatePulseTrains->output("lag").set(output_lag);
  algoPercivalEvaluatePulseTrains->compute();
  val outputPercivalEvaluatePulseTrains(val::object());
  outputPercivalEvaluatePulseTrains.set("lag", output_lag);
  delete algoPercivalEvaluatePulseTrains;
  return outputPercivalEvaluatePulseTrains;
}
 
// check https://essentia.upf.edu/reference/std_PitchContourSegmentation.html
val EssentiaJS::PitchContourSegmentation(std::vector<float>& input_pitch, std::vector<float>& input_signal, const int hopSize, const float minDuration, const int pitchDistanceThreshold, const int rmsThreshold, const int sampleRate, const int tuningFrequency) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchContourSegmentation = factory.create("PitchContourSegmentation", "hopSize", hopSize, "minDuration", minDuration, "pitchDistanceThreshold", pitchDistanceThreshold, "rmsThreshold", rmsThreshold, "sampleRate", sampleRate, "tuningFrequency", tuningFrequency);
  algoPitchContourSegmentation->input("pitch").set(input_pitch);
  algoPitchContourSegmentation->input("signal").set(input_signal);
  std::vector<float> output_onset;
  std::vector<float> output_duration;
  std::vector<float> output_MIDIpitch;
  algoPitchContourSegmentation->output("onset").set(output_onset);
  algoPitchContourSegmentation->output("duration").set(output_duration);
  algoPitchContourSegmentation->output("MIDIpitch").set(output_MIDIpitch);
  algoPitchContourSegmentation->compute();
  val outputPitchContourSegmentation(val::object());
  outputPitchContourSegmentation.set("onset", output_onset);
  outputPitchContourSegmentation.set("duration", output_duration);
  outputPitchContourSegmentation.set("MIDIpitch", output_MIDIpitch);
  delete algoPitchContourSegmentation;
  return outputPitchContourSegmentation;
}
 
// check https://essentia.upf.edu/reference/std_PitchContours.html
val EssentiaJS::PitchContours(std::vector<std::vector<float> >& input_peakBins, std::vector<std::vector<float> >& input_peakSaliences, const float binResolution, const int hopSize, const float minDuration, const float peakDistributionThreshold, const float peakFrameThreshold, const float pitchContinuity, const float sampleRate, const float timeContinuity) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchContours = factory.create("PitchContours", "binResolution", binResolution, "hopSize", hopSize, "minDuration", minDuration, "peakDistributionThreshold", peakDistributionThreshold, "peakFrameThreshold", peakFrameThreshold, "pitchContinuity", pitchContinuity, "sampleRate", sampleRate, "timeContinuity", timeContinuity);
  algoPitchContours->input("peakBins").set(input_peakBins);
  algoPitchContours->input("peakSaliences").set(input_peakSaliences);
  std::vector<std::vector<float> > output_contoursBins;
  std::vector<std::vector<float> > output_contoursSaliences;
  std::vector<float> output_contoursStartTimes;
  float output_duration;
  algoPitchContours->output("contoursBins").set(output_contoursBins);
  algoPitchContours->output("contoursSaliences").set(output_contoursSaliences);
  algoPitchContours->output("contoursStartTimes").set(output_contoursStartTimes);
  algoPitchContours->output("duration").set(output_duration);
  algoPitchContours->compute();
  val outputPitchContours(val::object());
  outputPitchContours.set("contoursBins", output_contoursBins);
  outputPitchContours.set("contoursSaliences", output_contoursSaliences);
  outputPitchContours.set("contoursStartTimes", output_contoursStartTimes);
  outputPitchContours.set("duration", output_duration);
  delete algoPitchContours;
  return outputPitchContours;
}
 
// check https://essentia.upf.edu/reference/std_PitchContoursMelody.html
val EssentiaJS::PitchContoursMelody(std::vector<std::vector<float> >& input_contoursBins, std::vector<std::vector<float> >& input_contoursSaliences, std::vector<float>& input_contoursStartTimes, float input_duration, const float binResolution, const int filterIterations, const bool guessUnvoiced, const int hopSize, const float maxFrequency, const float minFrequency, const float referenceFrequency, const float sampleRate, const bool voiceVibrato, const float voicingTolerance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchContoursMelody = factory.create("PitchContoursMelody", "binResolution", binResolution, "filterIterations", filterIterations, "guessUnvoiced", guessUnvoiced, "hopSize", hopSize, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "voiceVibrato", voiceVibrato, "voicingTolerance", voicingTolerance);
  algoPitchContoursMelody->input("contoursBins").set(input_contoursBins);
  algoPitchContoursMelody->input("contoursSaliences").set(input_contoursSaliences);
  algoPitchContoursMelody->input("contoursStartTimes").set(input_contoursStartTimes);
  algoPitchContoursMelody->input("duration").set(input_duration);
  std::vector<float> output_pitch;
  std::vector<float> output_pitchConfidence;
  algoPitchContoursMelody->output("pitch").set(output_pitch);
  algoPitchContoursMelody->output("pitchConfidence").set(output_pitchConfidence);
  algoPitchContoursMelody->compute();
  val outputPitchContoursMelody(val::object());
  outputPitchContoursMelody.set("pitch", output_pitch);
  outputPitchContoursMelody.set("pitchConfidence", output_pitchConfidence);
  delete algoPitchContoursMelody;
  return outputPitchContoursMelody;
}
 
// check https://essentia.upf.edu/reference/std_PitchContoursMonoMelody.html
val EssentiaJS::PitchContoursMonoMelody(std::vector<std::vector<float> >& input_contoursBins, std::vector<std::vector<float> >& input_contoursSaliences, std::vector<float>& input_contoursStartTimes, float input_duration, const float binResolution, const int filterIterations, const bool guessUnvoiced, const int hopSize, const float maxFrequency, const float minFrequency, const float referenceFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchContoursMonoMelody = factory.create("PitchContoursMonoMelody", "binResolution", binResolution, "filterIterations", filterIterations, "guessUnvoiced", guessUnvoiced, "hopSize", hopSize, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate);
  algoPitchContoursMonoMelody->input("contoursBins").set(input_contoursBins);
  algoPitchContoursMonoMelody->input("contoursSaliences").set(input_contoursSaliences);
  algoPitchContoursMonoMelody->input("contoursStartTimes").set(input_contoursStartTimes);
  algoPitchContoursMonoMelody->input("duration").set(input_duration);
  std::vector<float> output_pitch;
  std::vector<float> output_pitchConfidence;
  algoPitchContoursMonoMelody->output("pitch").set(output_pitch);
  algoPitchContoursMonoMelody->output("pitchConfidence").set(output_pitchConfidence);
  algoPitchContoursMonoMelody->compute();
  val outputPitchContoursMonoMelody(val::object());
  outputPitchContoursMonoMelody.set("pitch", output_pitch);
  outputPitchContoursMonoMelody.set("pitchConfidence", output_pitchConfidence);
  delete algoPitchContoursMonoMelody;
  return outputPitchContoursMonoMelody;
}
 
// check https://essentia.upf.edu/reference/std_PitchContoursMultiMelody.html
val EssentiaJS::PitchContoursMultiMelody(std::vector<std::vector<float> >& input_contoursBins, std::vector<std::vector<float> >& input_contoursSaliences, std::vector<float>& input_contoursStartTimes, float input_duration, const float binResolution, const int filterIterations, const bool guessUnvoiced, const int hopSize, const float maxFrequency, const float minFrequency, const float referenceFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchContoursMultiMelody = factory.create("PitchContoursMultiMelody", "binResolution", binResolution, "filterIterations", filterIterations, "guessUnvoiced", guessUnvoiced, "hopSize", hopSize, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate);
  algoPitchContoursMultiMelody->input("contoursBins").set(input_contoursBins);
  algoPitchContoursMultiMelody->input("contoursSaliences").set(input_contoursSaliences);
  algoPitchContoursMultiMelody->input("contoursStartTimes").set(input_contoursStartTimes);
  algoPitchContoursMultiMelody->input("duration").set(input_duration);
  std::vector<std::vector<float> > output_pitch;
  algoPitchContoursMultiMelody->output("pitch").set(output_pitch);
  algoPitchContoursMultiMelody->compute();
  val outputPitchContoursMultiMelody(val::object());
  outputPitchContoursMultiMelody.set("pitch", output_pitch);
  delete algoPitchContoursMultiMelody;
  return outputPitchContoursMultiMelody;
}
 
// check https://essentia.upf.edu/reference/std_PitchFilter.html
val EssentiaJS::PitchFilter(std::vector<float>& input_pitch, std::vector<float>& input_pitchConfidence, const int confidenceThreshold, const int minChunkSize, const bool useAbsolutePitchConfidence) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchFilter = factory.create("PitchFilter", "confidenceThreshold", confidenceThreshold, "minChunkSize", minChunkSize, "useAbsolutePitchConfidence", useAbsolutePitchConfidence);
  algoPitchFilter->input("pitch").set(input_pitch);
  algoPitchFilter->input("pitchConfidence").set(input_pitchConfidence);
  std::vector<float> output_pitchFiltered;
  algoPitchFilter->output("pitchFiltered").set(output_pitchFiltered);
  algoPitchFilter->compute();
  val outputPitchFilter(val::object());
  outputPitchFilter.set("pitchFiltered", output_pitchFiltered);
  delete algoPitchFilter;
  return outputPitchFilter;
}
 
// check https://essentia.upf.edu/reference/std_PitchMelodia.html
val EssentiaJS::PitchMelodia(std::vector<float>& input_signal, const float binResolution, const int filterIterations, const int frameSize, const bool guessUnvoiced, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const int magnitudeThreshold, const float maxFrequency, const int minDuration, const float minFrequency, const int numberHarmonics, const float peakDistributionThreshold, const float peakFrameThreshold, const float pitchContinuity, const float referenceFrequency, const float sampleRate, const int timeContinuity) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchMelodia = factory.create("PitchMelodia", "binResolution", binResolution, "filterIterations", filterIterations, "frameSize", frameSize, "guessUnvoiced", guessUnvoiced, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "minDuration", minDuration, "minFrequency", minFrequency, "numberHarmonics", numberHarmonics, "peakDistributionThreshold", peakDistributionThreshold, "peakFrameThreshold", peakFrameThreshold, "pitchContinuity", pitchContinuity, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "timeContinuity", timeContinuity);
  algoPitchMelodia->input("signal").set(input_signal);
  std::vector<float> output_pitch;
  std::vector<float> output_pitchConfidence;
  algoPitchMelodia->output("pitch").set(output_pitch);
  algoPitchMelodia->output("pitchConfidence").set(output_pitchConfidence);
  algoPitchMelodia->compute();
  val outputPitchMelodia(val::object());
  outputPitchMelodia.set("pitch", output_pitch);
  outputPitchMelodia.set("pitchConfidence", output_pitchConfidence);
  delete algoPitchMelodia;
  return outputPitchMelodia;
}
 
// check https://essentia.upf.edu/reference/std_PitchSalience.html
val EssentiaJS::PitchSalience(std::vector<float>& input_spectrum, const float highBoundary, const float lowBoundary, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchSalience = factory.create("PitchSalience", "highBoundary", highBoundary, "lowBoundary", lowBoundary, "sampleRate", sampleRate);
  algoPitchSalience->input("spectrum").set(input_spectrum);
  float output_pitchSalience;
  algoPitchSalience->output("pitchSalience").set(output_pitchSalience);
  algoPitchSalience->compute();
  val outputPitchSalience(val::object());
  outputPitchSalience.set("pitchSalience", output_pitchSalience);
  delete algoPitchSalience;
  return outputPitchSalience;
}
 
// check https://essentia.upf.edu/reference/std_PitchSalienceFunction.html
val EssentiaJS::PitchSalienceFunction(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, const float binResolution, const float harmonicWeight, const float magnitudeCompression, const float magnitudeThreshold, const int numberHarmonics, const float referenceFrequency) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchSalienceFunction = factory.create("PitchSalienceFunction", "binResolution", binResolution, "harmonicWeight", harmonicWeight, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "numberHarmonics", numberHarmonics, "referenceFrequency", referenceFrequency);
  algoPitchSalienceFunction->input("frequencies").set(input_frequencies);
  algoPitchSalienceFunction->input("magnitudes").set(input_magnitudes);
  std::vector<float> output_salienceFunction;
  algoPitchSalienceFunction->output("salienceFunction").set(output_salienceFunction);
  algoPitchSalienceFunction->compute();
  val outputPitchSalienceFunction(val::object());
  outputPitchSalienceFunction.set("salienceFunction", output_salienceFunction);
  delete algoPitchSalienceFunction;
  return outputPitchSalienceFunction;
}
 
// check https://essentia.upf.edu/reference/std_PitchSalienceFunctionPeaks.html
val EssentiaJS::PitchSalienceFunctionPeaks(std::vector<float>& input_salienceFunction, const float binResolution, const float maxFrequency, const float minFrequency, const float referenceFrequency) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchSalienceFunctionPeaks = factory.create("PitchSalienceFunctionPeaks", "binResolution", binResolution, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency);
  algoPitchSalienceFunctionPeaks->input("salienceFunction").set(input_salienceFunction);
  std::vector<float> output_salienceBins;
  std::vector<float> output_salienceValues;
  algoPitchSalienceFunctionPeaks->output("salienceBins").set(output_salienceBins);
  algoPitchSalienceFunctionPeaks->output("salienceValues").set(output_salienceValues);
  algoPitchSalienceFunctionPeaks->compute();
  val outputPitchSalienceFunctionPeaks(val::object());
  outputPitchSalienceFunctionPeaks.set("salienceBins", output_salienceBins);
  outputPitchSalienceFunctionPeaks.set("salienceValues", output_salienceValues);
  delete algoPitchSalienceFunctionPeaks;
  return outputPitchSalienceFunctionPeaks;
}
 
// check https://essentia.upf.edu/reference/std_PitchYin.html
val EssentiaJS::PitchYin(std::vector<float>& input_signal, const int frameSize, const bool interpolate, const float maxFrequency, const float minFrequency, const float sampleRate, const float tolerance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchYin = factory.create("PitchYin", "frameSize", frameSize, "interpolate", interpolate, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "sampleRate", sampleRate, "tolerance", tolerance);
  algoPitchYin->input("signal").set(input_signal);
  float output_pitch;
  float output_pitchConfidence;
  algoPitchYin->output("pitch").set(output_pitch);
  algoPitchYin->output("pitchConfidence").set(output_pitchConfidence);
  algoPitchYin->compute();
  val outputPitchYin(val::object());
  outputPitchYin.set("pitch", output_pitch);
  outputPitchYin.set("pitchConfidence", output_pitchConfidence);
  delete algoPitchYin;
  return outputPitchYin;
}
 
// check https://essentia.upf.edu/reference/std_PitchYinFFT.html
val EssentiaJS::PitchYinFFT(std::vector<float>& input_spectrum, const int frameSize, const bool interpolate, const float maxFrequency, const float minFrequency, const float sampleRate, const float tolerance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchYinFFT = factory.create("PitchYinFFT", "frameSize", frameSize, "interpolate", interpolate, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "sampleRate", sampleRate, "tolerance", tolerance);
  algoPitchYinFFT->input("spectrum").set(input_spectrum);
  float output_pitch;
  float output_pitchConfidence;
  algoPitchYinFFT->output("pitch").set(output_pitch);
  algoPitchYinFFT->output("pitchConfidence").set(output_pitchConfidence);
  algoPitchYinFFT->compute();
  val outputPitchYinFFT(val::object());
  outputPitchYinFFT.set("pitch", output_pitch);
  outputPitchYinFFT.set("pitchConfidence", output_pitchConfidence);
  delete algoPitchYinFFT;
  return outputPitchYinFFT;
}
 
// check https://essentia.upf.edu/reference/std_PitchYinProbabilistic.html
val EssentiaJS::PitchYinProbabilistic(std::vector<float>& input_signal, const int frameSize, const int hopSize, const float lowRMSThreshold, const std::string& outputUnvoiced, const bool preciseTime, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchYinProbabilistic = factory.create("PitchYinProbabilistic", "frameSize", frameSize, "hopSize", hopSize, "lowRMSThreshold", lowRMSThreshold, "outputUnvoiced", outputUnvoiced, "preciseTime", preciseTime, "sampleRate", sampleRate);
  algoPitchYinProbabilistic->input("signal").set(input_signal);
  std::vector<float> output_pitch;
  std::vector<float> output_voicedProbabilities;
  algoPitchYinProbabilistic->output("pitch").set(output_pitch);
  algoPitchYinProbabilistic->output("voicedProbabilities").set(output_voicedProbabilities);
  algoPitchYinProbabilistic->compute();
  val outputPitchYinProbabilistic(val::object());
  outputPitchYinProbabilistic.set("pitch", output_pitch);
  outputPitchYinProbabilistic.set("voicedProbabilities", output_voicedProbabilities);
  delete algoPitchYinProbabilistic;
  return outputPitchYinProbabilistic;
}
 
// check https://essentia.upf.edu/reference/std_PitchYinProbabilities.html
val EssentiaJS::PitchYinProbabilities(std::vector<float>& input_signal, const int frameSize, const float lowAmp, const bool preciseTime, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchYinProbabilities = factory.create("PitchYinProbabilities", "frameSize", frameSize, "lowAmp", lowAmp, "preciseTime", preciseTime, "sampleRate", sampleRate);
  algoPitchYinProbabilities->input("signal").set(input_signal);
  std::vector<float> output_pitch;
  std::vector<float> output_probabilities;
  float output_RMS;
  algoPitchYinProbabilities->output("pitch").set(output_pitch);
  algoPitchYinProbabilities->output("probabilities").set(output_probabilities);
  algoPitchYinProbabilities->output("RMS").set(output_RMS);
  algoPitchYinProbabilities->compute();
  val outputPitchYinProbabilities(val::object());
  outputPitchYinProbabilities.set("pitch", output_pitch);
  outputPitchYinProbabilities.set("probabilities", output_probabilities);
  outputPitchYinProbabilities.set("RMS", output_RMS);
  delete algoPitchYinProbabilities;
  return outputPitchYinProbabilities;
}
 
// check https://essentia.upf.edu/reference/std_PitchYinProbabilitiesHMM.html
val EssentiaJS::PitchYinProbabilitiesHMM(std::vector<std::vector<float> >& input_pitchCandidates, std::vector<std::vector<float> >& input_probabilities, const float minFrequency, const int numberBinsPerSemitone, const float selfTransition, const float yinTrust) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchYinProbabilitiesHMM = factory.create("PitchYinProbabilitiesHMM", "minFrequency", minFrequency, "numberBinsPerSemitone", numberBinsPerSemitone, "selfTransition", selfTransition, "yinTrust", yinTrust);
  algoPitchYinProbabilitiesHMM->input("pitchCandidates").set(input_pitchCandidates);
  algoPitchYinProbabilitiesHMM->input("probabilities").set(input_probabilities);
  std::vector<float> output_pitch;
  algoPitchYinProbabilitiesHMM->output("pitch").set(output_pitch);
  algoPitchYinProbabilitiesHMM->compute();
  val outputPitchYinProbabilitiesHMM(val::object());
  outputPitchYinProbabilitiesHMM.set("pitch", output_pitch);
  delete algoPitchYinProbabilitiesHMM;
  return outputPitchYinProbabilitiesHMM;
}
 
// check https://essentia.upf.edu/reference/std_PowerMean.html
val EssentiaJS::PowerMean(std::vector<float>& input_array, const float power) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPowerMean = factory.create("PowerMean", "power", power);
  algoPowerMean->input("array").set(input_array);
  float output_powerMean;
  algoPowerMean->output("powerMean").set(output_powerMean);
  algoPowerMean->compute();
  val outputPowerMean(val::object());
  outputPowerMean.set("powerMean", output_powerMean);
  delete algoPowerMean;
  return outputPowerMean;
}
 
// check https://essentia.upf.edu/reference/std_PowerSpectrum.html
val EssentiaJS::PowerSpectrum(std::vector<float>& input_signal, const int size) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPowerSpectrum = factory.create("PowerSpectrum", "size", size);
  algoPowerSpectrum->input("signal").set(input_signal);
  std::vector<float> output_powerSpectrum;
  algoPowerSpectrum->output("powerSpectrum").set(output_powerSpectrum);
  algoPowerSpectrum->compute();
  val outputPowerSpectrum(val::object());
  outputPowerSpectrum.set("powerSpectrum", output_powerSpectrum);
  delete algoPowerSpectrum;
  return outputPowerSpectrum;
}
 
// check https://essentia.upf.edu/reference/std_PredominantPitchMelodia.html
val EssentiaJS::PredominantPitchMelodia(std::vector<float>& input_signal, const float binResolution, const int filterIterations, const int frameSize, const bool guessUnvoiced, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const int magnitudeThreshold, const float maxFrequency, const int minDuration, const float minFrequency, const int numberHarmonics, const float peakDistributionThreshold, const float peakFrameThreshold, const float pitchContinuity, const float referenceFrequency, const float sampleRate, const int timeContinuity, const bool voiceVibrato, const float voicingTolerance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPredominantPitchMelodia = factory.create("PredominantPitchMelodia", "binResolution", binResolution, "filterIterations", filterIterations, "frameSize", frameSize, "guessUnvoiced", guessUnvoiced, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "minDuration", minDuration, "minFrequency", minFrequency, "numberHarmonics", numberHarmonics, "peakDistributionThreshold", peakDistributionThreshold, "peakFrameThreshold", peakFrameThreshold, "pitchContinuity", pitchContinuity, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "timeContinuity", timeContinuity, "voiceVibrato", voiceVibrato, "voicingTolerance", voicingTolerance);
  algoPredominantPitchMelodia->input("signal").set(input_signal);
  std::vector<float> output_pitch;
  std::vector<float> output_pitchConfidence;
  algoPredominantPitchMelodia->output("pitch").set(output_pitch);
  algoPredominantPitchMelodia->output("pitchConfidence").set(output_pitchConfidence);
  algoPredominantPitchMelodia->compute();
  val outputPredominantPitchMelodia(val::object());
  outputPredominantPitchMelodia.set("pitch", output_pitch);
  outputPredominantPitchMelodia.set("pitchConfidence", output_pitchConfidence);
  delete algoPredominantPitchMelodia;
  return outputPredominantPitchMelodia;
}
 
// check https://essentia.upf.edu/reference/std_RMS.html
val EssentiaJS::RMS(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoRMS = factory.create("RMS");
  algoRMS->input("array").set(input_array);
  float output_rms;
  algoRMS->output("rms").set(output_rms);
  algoRMS->compute();
  val outputRMS(val::object());
  outputRMS.set("rms", output_rms);
  delete algoRMS;
  return outputRMS;
}
 
// check https://essentia.upf.edu/reference/std_RawMoments.html
val EssentiaJS::RawMoments(std::vector<float>& input_array, const float range) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoRawMoments = factory.create("RawMoments", "range", range);
  algoRawMoments->input("array").set(input_array);
  std::vector<float> output_rawMoments;
  algoRawMoments->output("rawMoments").set(output_rawMoments);
  algoRawMoments->compute();
  val outputRawMoments(val::object());
  outputRawMoments.set("rawMoments", output_rawMoments);
  delete algoRawMoments;
  return outputRawMoments;
}
 
// check https://essentia.upf.edu/reference/std_ReplayGain.html
val EssentiaJS::ReplayGain(std::vector<float>& input_signal, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoReplayGain = factory.create("ReplayGain", "sampleRate", sampleRate);
  algoReplayGain->input("signal").set(input_signal);
  float output_replayGain;
  algoReplayGain->output("replayGain").set(output_replayGain);
  algoReplayGain->compute();
  val outputReplayGain(val::object());
  outputReplayGain.set("replayGain", output_replayGain);
  delete algoReplayGain;
  return outputReplayGain;
}
 
// check https://essentia.upf.edu/reference/std_Resample.html
val EssentiaJS::Resample(std::vector<float>& input_signal, const float inputSampleRate, const float outputSampleRate, const int quality) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoResample = factory.create("Resample", "inputSampleRate", inputSampleRate, "outputSampleRate", outputSampleRate, "quality", quality);
  algoResample->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoResample->output("signal").set(output_signal);
  algoResample->compute();
  val outputResample(val::object());
  outputResample.set("signal", output_signal);
  delete algoResample;
  return outputResample;
}
 
// check https://essentia.upf.edu/reference/std_ResampleFFT.html
val EssentiaJS::ResampleFFT(std::vector<float>& input_input, const int inSize, const int outSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoResampleFFT = factory.create("ResampleFFT", "inSize", inSize, "outSize", outSize);
  algoResampleFFT->input("input").set(input_input);
  std::vector<float> output_output;
  algoResampleFFT->output("output").set(output_output);
  algoResampleFFT->compute();
  val outputResampleFFT(val::object());
  outputResampleFFT.set("output", output_output);
  delete algoResampleFFT;
  return outputResampleFFT;
}
 
// check https://essentia.upf.edu/reference/std_RhythmDescriptors.html
val EssentiaJS::RhythmDescriptors(std::vector<float>& input_signal) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoRhythmDescriptors = factory.create("RhythmDescriptors");
  algoRhythmDescriptors->input("signal").set(input_signal);
  std::vector<float> output_beats_position;
  float output_confidence;
  float output_bpm;
  std::vector<float> output_bpm_estimates;
  std::vector<float> output_bpm_intervals;
  float output_first_peak_bpm;
  float output_first_peak_spread;
  float output_first_peak_weight;
  float output_second_peak_bpm;
  float output_second_peak_spread;
  float output_second_peak_weight;
  std::vector<float> output_histogram;
  algoRhythmDescriptors->output("beats_position").set(output_beats_position);
  algoRhythmDescriptors->output("confidence").set(output_confidence);
  algoRhythmDescriptors->output("bpm").set(output_bpm);
  algoRhythmDescriptors->output("bpm_estimates").set(output_bpm_estimates);
  algoRhythmDescriptors->output("bpm_intervals").set(output_bpm_intervals);
  algoRhythmDescriptors->output("first_peak_bpm").set(output_first_peak_bpm);
  algoRhythmDescriptors->output("first_peak_spread").set(output_first_peak_spread);
  algoRhythmDescriptors->output("first_peak_weight").set(output_first_peak_weight);
  algoRhythmDescriptors->output("second_peak_bpm").set(output_second_peak_bpm);
  algoRhythmDescriptors->output("second_peak_spread").set(output_second_peak_spread);
  algoRhythmDescriptors->output("second_peak_weight").set(output_second_peak_weight);
  algoRhythmDescriptors->output("histogram").set(output_histogram);
  algoRhythmDescriptors->compute();
  val outputRhythmDescriptors(val::object());
  outputRhythmDescriptors.set("beats_position", output_beats_position);
  outputRhythmDescriptors.set("confidence", output_confidence);
  outputRhythmDescriptors.set("bpm", output_bpm);
  outputRhythmDescriptors.set("bpm_estimates", output_bpm_estimates);
  outputRhythmDescriptors.set("bpm_intervals", output_bpm_intervals);
  outputRhythmDescriptors.set("first_peak_bpm", output_first_peak_bpm);
  outputRhythmDescriptors.set("first_peak_spread", output_first_peak_spread);
  outputRhythmDescriptors.set("first_peak_weight", output_first_peak_weight);
  outputRhythmDescriptors.set("second_peak_bpm", output_second_peak_bpm);
  outputRhythmDescriptors.set("second_peak_spread", output_second_peak_spread);
  outputRhythmDescriptors.set("second_peak_weight", output_second_peak_weight);
  outputRhythmDescriptors.set("histogram", output_histogram);
  delete algoRhythmDescriptors;
  return outputRhythmDescriptors;
}
 
// check https://essentia.upf.edu/reference/std_RhythmExtractor.html
val EssentiaJS::RhythmExtractor(std::vector<float>& input_signal, const int frameHop, const int frameSize, const int hopSize, const float lastBeatInterval, const int maxTempo, const int minTempo, const int numberFrames, const float sampleRate, const std::vector<float>& tempoHints, const float tolerance, const bool useBands, const bool useOnset) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoRhythmExtractor = factory.create("RhythmExtractor", "frameHop", frameHop, "frameSize", frameSize, "hopSize", hopSize, "lastBeatInterval", lastBeatInterval, "maxTempo", maxTempo, "minTempo", minTempo, "numberFrames", numberFrames, "sampleRate", sampleRate, "tempoHints", tempoHints, "tolerance", tolerance, "useBands", useBands, "useOnset", useOnset);
  algoRhythmExtractor->input("signal").set(input_signal);
  float output_bpm;
  std::vector<float> output_ticks;
  std::vector<float> output_estimates;
  std::vector<float> output_bpmIntervals;
  algoRhythmExtractor->output("bpm").set(output_bpm);
  algoRhythmExtractor->output("ticks").set(output_ticks);
  algoRhythmExtractor->output("estimates").set(output_estimates);
  algoRhythmExtractor->output("bpmIntervals").set(output_bpmIntervals);
  algoRhythmExtractor->compute();
  val outputRhythmExtractor(val::object());
  outputRhythmExtractor.set("bpm", output_bpm);
  outputRhythmExtractor.set("ticks", output_ticks);
  outputRhythmExtractor.set("estimates", output_estimates);
  outputRhythmExtractor.set("bpmIntervals", output_bpmIntervals);
  delete algoRhythmExtractor;
  return outputRhythmExtractor;
}
 
// check https://essentia.upf.edu/reference/std_RhythmExtractor2013.html
val EssentiaJS::RhythmExtractor2013(std::vector<float>& input_signal, const int maxTempo, const std::string& method, const int minTempo) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoRhythmExtractor2013 = factory.create("RhythmExtractor2013", "maxTempo", maxTempo, "method", method, "minTempo", minTempo);
  algoRhythmExtractor2013->input("signal").set(input_signal);
  float output_bpm;
  std::vector<float> output_ticks;
  float output_confidence;
  std::vector<float> output_estimates;
  std::vector<float> output_bpmIntervals;
  algoRhythmExtractor2013->output("bpm").set(output_bpm);
  algoRhythmExtractor2013->output("ticks").set(output_ticks);
  algoRhythmExtractor2013->output("confidence").set(output_confidence);
  algoRhythmExtractor2013->output("estimates").set(output_estimates);
  algoRhythmExtractor2013->output("bpmIntervals").set(output_bpmIntervals);
  algoRhythmExtractor2013->compute();
  val outputRhythmExtractor2013(val::object());
  outputRhythmExtractor2013.set("bpm", output_bpm);
  outputRhythmExtractor2013.set("ticks", output_ticks);
  outputRhythmExtractor2013.set("confidence", output_confidence);
  outputRhythmExtractor2013.set("estimates", output_estimates);
  outputRhythmExtractor2013.set("bpmIntervals", output_bpmIntervals);
  delete algoRhythmExtractor2013;
  return outputRhythmExtractor2013;
}
 
// check https://essentia.upf.edu/reference/std_RhythmTransform.html
val EssentiaJS::RhythmTransform(std::vector<std::vector<float> >& input_melBands, const int frameSize, const int hopSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoRhythmTransform = factory.create("RhythmTransform", "frameSize", frameSize, "hopSize", hopSize);
  algoRhythmTransform->input("melBands").set(input_melBands);
  std::vector<std::vector<float> > output_rhythm;
  algoRhythmTransform->output("rhythm").set(output_rhythm);
  algoRhythmTransform->compute();
  val outputRhythmTransform(val::object());
  outputRhythmTransform.set("rhythm", output_rhythm);
  delete algoRhythmTransform;
  return outputRhythmTransform;
}
 
// check https://essentia.upf.edu/reference/std_RollOff.html
val EssentiaJS::RollOff(std::vector<float>& input_spectrum, const float cutoff, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoRollOff = factory.create("RollOff", "cutoff", cutoff, "sampleRate", sampleRate);
  algoRollOff->input("spectrum").set(input_spectrum);
  float output_rollOff;
  algoRollOff->output("rollOff").set(output_rollOff);
  algoRollOff->compute();
  val outputRollOff(val::object());
  outputRollOff.set("rollOff", output_rollOff);
  delete algoRollOff;
  return outputRollOff;
}
 
// check https://essentia.upf.edu/reference/std_SNR.html
val EssentiaJS::SNR(std::vector<float>& input_frame, const float MAAlpha, const float MMSEAlpha, const float NoiseAlpha, const int frameSize, const float noiseThreshold, const float sampleRate, const bool useBroadbadNoiseCorrection) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSNR = factory.create("SNR", "MAAlpha", MAAlpha, "MMSEAlpha", MMSEAlpha, "NoiseAlpha", NoiseAlpha, "frameSize", frameSize, "noiseThreshold", noiseThreshold, "sampleRate", sampleRate, "useBroadbadNoiseCorrection", useBroadbadNoiseCorrection);
  algoSNR->input("frame").set(input_frame);
  float output_instantSNR;
  float output_averagedSNR;
  std::vector<float> output_spectralSNR;
  algoSNR->output("instantSNR").set(output_instantSNR);
  algoSNR->output("averagedSNR").set(output_averagedSNR);
  algoSNR->output("spectralSNR").set(output_spectralSNR);
  algoSNR->compute();
  val outputSNR(val::object());
  outputSNR.set("instantSNR", output_instantSNR);
  outputSNR.set("averagedSNR", output_averagedSNR);
  outputSNR.set("spectralSNR", output_spectralSNR);
  delete algoSNR;
  return outputSNR;
}
 
// check https://essentia.upf.edu/reference/std_SaturationDetector.html
val EssentiaJS::SaturationDetector(std::vector<float>& input_frame, const float differentialThreshold, const float energyThreshold, const int frameSize, const int hopSize, const float minimumDuration, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSaturationDetector = factory.create("SaturationDetector", "differentialThreshold", differentialThreshold, "energyThreshold", energyThreshold, "frameSize", frameSize, "hopSize", hopSize, "minimumDuration", minimumDuration, "sampleRate", sampleRate);
  algoSaturationDetector->input("frame").set(input_frame);
  std::vector<float> output_starts;
  std::vector<float> output_ends;
  algoSaturationDetector->output("starts").set(output_starts);
  algoSaturationDetector->output("ends").set(output_ends);
  algoSaturationDetector->compute();
  val outputSaturationDetector(val::object());
  outputSaturationDetector.set("starts", output_starts);
  outputSaturationDetector.set("ends", output_ends);
  delete algoSaturationDetector;
  return outputSaturationDetector;
}
 
// check https://essentia.upf.edu/reference/std_Scale.html
val EssentiaJS::Scale(std::vector<float>& input_signal, const bool clipping, const float factor, const float maxAbsValue) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoScale = factory.create("Scale", "clipping", clipping, "factor", factor, "maxAbsValue", maxAbsValue);
  algoScale->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoScale->output("signal").set(output_signal);
  algoScale->compute();
  val outputScale(val::object());
  outputScale.set("signal", output_signal);
  delete algoScale;
  return outputScale;
}
 
// check https://essentia.upf.edu/reference/std_SineSubtraction.html
val EssentiaJS::SineSubtraction(std::vector<float>& input_frame, std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases, const int fftSize, const int hopSize, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSineSubtraction = factory.create("SineSubtraction", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate);
  algoSineSubtraction->input("frame").set(input_frame);
  algoSineSubtraction->input("magnitudes").set(input_magnitudes);
  algoSineSubtraction->input("frequencies").set(input_frequencies);
  algoSineSubtraction->input("phases").set(input_phases);
  std::vector<float> output_frame;
  algoSineSubtraction->output("frame").set(output_frame);
  algoSineSubtraction->compute();
  val outputSineSubtraction(val::object());
  outputSineSubtraction.set("frame", output_frame);
  delete algoSineSubtraction;
  return outputSineSubtraction;
}
 
// check https://essentia.upf.edu/reference/std_SingleBeatLoudness.html
val EssentiaJS::SingleBeatLoudness(std::vector<float>& input_beat, const float beatDuration, const float beatWindowDuration, const std::vector<float>& frequencyBands, const std::string& onsetStart, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSingleBeatLoudness = factory.create("SingleBeatLoudness", "beatDuration", beatDuration, "beatWindowDuration", beatWindowDuration, "frequencyBands", frequencyBands, "onsetStart", onsetStart, "sampleRate", sampleRate);
  algoSingleBeatLoudness->input("beat").set(input_beat);
  float output_loudness;
  std::vector<float> output_loudnessBandRatio;
  algoSingleBeatLoudness->output("loudness").set(output_loudness);
  algoSingleBeatLoudness->output("loudnessBandRatio").set(output_loudnessBandRatio);
  algoSingleBeatLoudness->compute();
  val outputSingleBeatLoudness(val::object());
  outputSingleBeatLoudness.set("loudness", output_loudness);
  outputSingleBeatLoudness.set("loudnessBandRatio", output_loudnessBandRatio);
  delete algoSingleBeatLoudness;
  return outputSingleBeatLoudness;
}
 
// check https://essentia.upf.edu/reference/std_Slicer.html
val EssentiaJS::Slicer(std::vector<float>& input_audio, const std::vector<float>& endTimes, const float sampleRate, const std::vector<float>& startTimes, const std::string& timeUnits) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSlicer = factory.create("Slicer", "endTimes", endTimes, "sampleRate", sampleRate, "startTimes", startTimes, "timeUnits", timeUnits);
  algoSlicer->input("audio").set(input_audio);
  std::vector<std::vector<float> > output_frame;
  algoSlicer->output("frame").set(output_frame);
  algoSlicer->compute();
  val outputSlicer(val::object());
  outputSlicer.set("frame", output_frame);
  delete algoSlicer;
  return outputSlicer;
}
 
// check https://essentia.upf.edu/reference/std_SpectralCentroidTime.html
val EssentiaJS::SpectralCentroidTime(std::vector<float>& input_array, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectralCentroidTime = factory.create("SpectralCentroidTime", "sampleRate", sampleRate);
  algoSpectralCentroidTime->input("array").set(input_array);
  float output_centroid;
  algoSpectralCentroidTime->output("centroid").set(output_centroid);
  algoSpectralCentroidTime->compute();
  val outputSpectralCentroidTime(val::object());
  outputSpectralCentroidTime.set("centroid", output_centroid);
  delete algoSpectralCentroidTime;
  return outputSpectralCentroidTime;
}
 
// check https://essentia.upf.edu/reference/std_SpectralComplexity.html
val EssentiaJS::SpectralComplexity(std::vector<float>& input_spectrum, const float magnitudeThreshold, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectralComplexity = factory.create("SpectralComplexity", "magnitudeThreshold", magnitudeThreshold, "sampleRate", sampleRate);
  algoSpectralComplexity->input("spectrum").set(input_spectrum);
  float output_spectralComplexity;
  algoSpectralComplexity->output("spectralComplexity").set(output_spectralComplexity);
  algoSpectralComplexity->compute();
  val outputSpectralComplexity(val::object());
  outputSpectralComplexity.set("spectralComplexity", output_spectralComplexity);
  delete algoSpectralComplexity;
  return outputSpectralComplexity;
}
 
// check https://essentia.upf.edu/reference/std_SpectralContrast.html
val EssentiaJS::SpectralContrast(std::vector<float>& input_spectrum, const int frameSize, const float highFrequencyBound, const float lowFrequencyBound, const float neighbourRatio, const int numberBands, const float sampleRate, const float staticDistribution) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectralContrast = factory.create("SpectralContrast", "frameSize", frameSize, "highFrequencyBound", highFrequencyBound, "lowFrequencyBound", lowFrequencyBound, "neighbourRatio", neighbourRatio, "numberBands", numberBands, "sampleRate", sampleRate, "staticDistribution", staticDistribution);
  algoSpectralContrast->input("spectrum").set(input_spectrum);
  std::vector<float> output_spectralContrast;
  std::vector<float> output_spectralValley;
  algoSpectralContrast->output("spectralContrast").set(output_spectralContrast);
  algoSpectralContrast->output("spectralValley").set(output_spectralValley);
  algoSpectralContrast->compute();
  val outputSpectralContrast(val::object());
  outputSpectralContrast.set("spectralContrast", output_spectralContrast);
  outputSpectralContrast.set("spectralValley", output_spectralValley);
  delete algoSpectralContrast;
  return outputSpectralContrast;
}
 
// check https://essentia.upf.edu/reference/std_SpectralPeaks.html
val EssentiaJS::SpectralPeaks(std::vector<float>& input_spectrum, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const float minFrequency, const std::string& orderBy, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectralPeaks = factory.create("SpectralPeaks", "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "minFrequency", minFrequency, "orderBy", orderBy, "sampleRate", sampleRate);
  algoSpectralPeaks->input("spectrum").set(input_spectrum);
  std::vector<float> output_frequencies;
  std::vector<float> output_magnitudes;
  algoSpectralPeaks->output("frequencies").set(output_frequencies);
  algoSpectralPeaks->output("magnitudes").set(output_magnitudes);
  algoSpectralPeaks->compute();
  val outputSpectralPeaks(val::object());
  outputSpectralPeaks.set("frequencies", output_frequencies);
  outputSpectralPeaks.set("magnitudes", output_magnitudes);
  delete algoSpectralPeaks;
  return outputSpectralPeaks;
}
 
// check https://essentia.upf.edu/reference/std_SpectralWhitening.html
val EssentiaJS::SpectralWhitening(std::vector<float>& input_spectrum, std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, const float maxFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectralWhitening = factory.create("SpectralWhitening", "maxFrequency", maxFrequency, "sampleRate", sampleRate);
  algoSpectralWhitening->input("spectrum").set(input_spectrum);
  algoSpectralWhitening->input("frequencies").set(input_frequencies);
  algoSpectralWhitening->input("magnitudes").set(input_magnitudes);
  std::vector<float> output_magnitudes;
  algoSpectralWhitening->output("magnitudes").set(output_magnitudes);
  algoSpectralWhitening->compute();
  val outputSpectralWhitening(val::object());
  outputSpectralWhitening.set("magnitudes", output_magnitudes);
  delete algoSpectralWhitening;
  return outputSpectralWhitening;
}
 
// check https://essentia.upf.edu/reference/std_Spectrum.html
val EssentiaJS::Spectrum(std::vector<float>& input_frame, const int size) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectrum = factory.create("Spectrum", "size", size);
  algoSpectrum->input("frame").set(input_frame);
  std::vector<float> output_spectrum;
  algoSpectrum->output("spectrum").set(output_spectrum);
  algoSpectrum->compute();
  val outputSpectrum(val::object());
  outputSpectrum.set("spectrum", output_spectrum);
  delete algoSpectrum;
  return outputSpectrum;
}
 
// check https://essentia.upf.edu/reference/std_SpectrumCQ.html
val EssentiaJS::SpectrumCQ(std::vector<float>& input_frame, const int binsPerOctave, const float minFrequency, const int minimumKernelSize, const int numberBins, const float sampleRate, const float scale, const float threshold, const std::string& windowType, const bool zeroPhase) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectrumCQ = factory.create("SpectrumCQ", "binsPerOctave", binsPerOctave, "minFrequency", minFrequency, "minimumKernelSize", minimumKernelSize, "numberBins", numberBins, "sampleRate", sampleRate, "scale", scale, "threshold", threshold, "windowType", windowType, "zeroPhase", zeroPhase);
  algoSpectrumCQ->input("frame").set(input_frame);
  std::vector<float> output_spectrumCQ;
  algoSpectrumCQ->output("spectrumCQ").set(output_spectrumCQ);
  algoSpectrumCQ->compute();
  val outputSpectrumCQ(val::object());
  outputSpectrumCQ.set("spectrumCQ", output_spectrumCQ);
  delete algoSpectrumCQ;
  return outputSpectrumCQ;
}
 
// check https://essentia.upf.edu/reference/std_SpectrumToCent.html
val EssentiaJS::SpectrumToCent(std::vector<float>& input_spectrum, const int bands, const float centBinResolution, const int inputSize, const bool log, const float minimumFrequency, const std::string& normalize, const float sampleRate, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectrumToCent = factory.create("SpectrumToCent", "bands", bands, "centBinResolution", centBinResolution, "inputSize", inputSize, "log", log, "minimumFrequency", minimumFrequency, "normalize", normalize, "sampleRate", sampleRate, "type", type);
  algoSpectrumToCent->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  std::vector<float> output_frequencies;
  algoSpectrumToCent->output("bands").set(output_bands);
  algoSpectrumToCent->output("frequencies").set(output_frequencies);
  algoSpectrumToCent->compute();
  val outputSpectrumToCent(val::object());
  outputSpectrumToCent.set("bands", output_bands);
  outputSpectrumToCent.set("frequencies", output_frequencies);
  delete algoSpectrumToCent;
  return outputSpectrumToCent;
}
 
// check https://essentia.upf.edu/reference/std_Spline.html
val EssentiaJS::Spline(float input_x, const float beta1, const float beta2, const std::string& type, const std::vector<float>& xPoints, const std::vector<float>& yPoints) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpline = factory.create("Spline", "beta1", beta1, "beta2", beta2, "type", type, "xPoints", xPoints, "yPoints", yPoints);
  algoSpline->input("x").set(input_x);
  float output_y;
  algoSpline->output("y").set(output_y);
  algoSpline->compute();
  val outputSpline(val::object());
  outputSpline.set("y", output_y);
  delete algoSpline;
  return outputSpline;
}
 
// check https://essentia.upf.edu/reference/std_SprModelAnal.html
val EssentiaJS::SprModelAnal(std::vector<float>& input_frame, const int fftSize, const int freqDevOffset, const float freqDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const std::string& orderBy, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSprModelAnal = factory.create("SprModelAnal", "fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "orderBy", orderBy, "sampleRate", sampleRate);
  algoSprModelAnal->input("frame").set(input_frame);
  std::vector<float> output_frequencies;
  std::vector<float> output_magnitudes;
  std::vector<float> output_phases;
  std::vector<float> output_res;
  algoSprModelAnal->output("frequencies").set(output_frequencies);
  algoSprModelAnal->output("magnitudes").set(output_magnitudes);
  algoSprModelAnal->output("phases").set(output_phases);
  algoSprModelAnal->output("res").set(output_res);
  algoSprModelAnal->compute();
  val outputSprModelAnal(val::object());
  outputSprModelAnal.set("frequencies", output_frequencies);
  outputSprModelAnal.set("magnitudes", output_magnitudes);
  outputSprModelAnal.set("phases", output_phases);
  outputSprModelAnal.set("res", output_res);
  delete algoSprModelAnal;
  return outputSprModelAnal;
}
 
// check https://essentia.upf.edu/reference/std_SprModelSynth.html
val EssentiaJS::SprModelSynth(std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases, std::vector<float>& input_res, const int fftSize, const int hopSize, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSprModelSynth = factory.create("SprModelSynth", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate);
  algoSprModelSynth->input("magnitudes").set(input_magnitudes);
  algoSprModelSynth->input("frequencies").set(input_frequencies);
  algoSprModelSynth->input("phases").set(input_phases);
  algoSprModelSynth->input("res").set(input_res);
  std::vector<float> output_frame;
  std::vector<float> output_sineframe;
  std::vector<float> output_resframe;
  algoSprModelSynth->output("frame").set(output_frame);
  algoSprModelSynth->output("sineframe").set(output_sineframe);
  algoSprModelSynth->output("resframe").set(output_resframe);
  algoSprModelSynth->compute();
  val outputSprModelSynth(val::object());
  outputSprModelSynth.set("frame", output_frame);
  outputSprModelSynth.set("sineframe", output_sineframe);
  outputSprModelSynth.set("resframe", output_resframe);
  delete algoSprModelSynth;
  return outputSprModelSynth;
}
 
// check https://essentia.upf.edu/reference/std_SpsModelAnal.html
val EssentiaJS::SpsModelAnal(std::vector<float>& input_frame, const int fftSize, const int freqDevOffset, const float freqDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const std::string& orderBy, const float sampleRate, const float stocf) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpsModelAnal = factory.create("SpsModelAnal", "fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "orderBy", orderBy, "sampleRate", sampleRate, "stocf", stocf);
  algoSpsModelAnal->input("frame").set(input_frame);
  std::vector<float> output_frequencies;
  std::vector<float> output_magnitudes;
  std::vector<float> output_phases;
  std::vector<float> output_stocenv;
  algoSpsModelAnal->output("frequencies").set(output_frequencies);
  algoSpsModelAnal->output("magnitudes").set(output_magnitudes);
  algoSpsModelAnal->output("phases").set(output_phases);
  algoSpsModelAnal->output("stocenv").set(output_stocenv);
  algoSpsModelAnal->compute();
  val outputSpsModelAnal(val::object());
  outputSpsModelAnal.set("frequencies", output_frequencies);
  outputSpsModelAnal.set("magnitudes", output_magnitudes);
  outputSpsModelAnal.set("phases", output_phases);
  outputSpsModelAnal.set("stocenv", output_stocenv);
  delete algoSpsModelAnal;
  return outputSpsModelAnal;
}
 
// check https://essentia.upf.edu/reference/std_SpsModelSynth.html
val EssentiaJS::SpsModelSynth(std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases, std::vector<float>& input_stocenv, const int fftSize, const int hopSize, const float sampleRate, const float stocf) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpsModelSynth = factory.create("SpsModelSynth", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate, "stocf", stocf);
  algoSpsModelSynth->input("magnitudes").set(input_magnitudes);
  algoSpsModelSynth->input("frequencies").set(input_frequencies);
  algoSpsModelSynth->input("phases").set(input_phases);
  algoSpsModelSynth->input("stocenv").set(input_stocenv);
  std::vector<float> output_frame;
  std::vector<float> output_sineframe;
  std::vector<float> output_stocframe;
  algoSpsModelSynth->output("frame").set(output_frame);
  algoSpsModelSynth->output("sineframe").set(output_sineframe);
  algoSpsModelSynth->output("stocframe").set(output_stocframe);
  algoSpsModelSynth->compute();
  val outputSpsModelSynth(val::object());
  outputSpsModelSynth.set("frame", output_frame);
  outputSpsModelSynth.set("sineframe", output_sineframe);
  outputSpsModelSynth.set("stocframe", output_stocframe);
  delete algoSpsModelSynth;
  return outputSpsModelSynth;
}
 
// check https://essentia.upf.edu/reference/std_StartStopCut.html
val EssentiaJS::StartStopCut(std::vector<float>& input_audio, const int frameSize, const int hopSize, const float maximumStartTime, const float maximumStopTime, const float sampleRate, const int threshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoStartStopCut = factory.create("StartStopCut", "frameSize", frameSize, "hopSize", hopSize, "maximumStartTime", maximumStartTime, "maximumStopTime", maximumStopTime, "sampleRate", sampleRate, "threshold", threshold);
  algoStartStopCut->input("audio").set(input_audio);
  int output_startCut;
  int output_stopCut;
  algoStartStopCut->output("startCut").set(output_startCut);
  algoStartStopCut->output("stopCut").set(output_stopCut);
  algoStartStopCut->compute();
  val outputStartStopCut(val::object());
  outputStartStopCut.set("startCut", output_startCut);
  outputStartStopCut.set("stopCut", output_stopCut);
  delete algoStartStopCut;
  return outputStartStopCut;
}
 
// check https://essentia.upf.edu/reference/std_StartStopSilence.html
val EssentiaJS::StartStopSilence(std::vector<float>& input_frame, const int threshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoStartStopSilence = factory.create("StartStopSilence", "threshold", threshold);
  algoStartStopSilence->input("frame").set(input_frame);
  int output_startFrame;
  int output_stopFrame;
  algoStartStopSilence->output("startFrame").set(output_startFrame);
  algoStartStopSilence->output("stopFrame").set(output_stopFrame);
  algoStartStopSilence->compute();
  val outputStartStopSilence(val::object());
  outputStartStopSilence.set("startFrame", output_startFrame);
  outputStartStopSilence.set("stopFrame", output_stopFrame);
  delete algoStartStopSilence;
  return outputStartStopSilence;
}
 
// check https://essentia.upf.edu/reference/std_StochasticModelAnal.html
val EssentiaJS::StochasticModelAnal(std::vector<float>& input_frame, const int fftSize, const int hopSize, const float sampleRate, const float stocf) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoStochasticModelAnal = factory.create("StochasticModelAnal", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate, "stocf", stocf);
  algoStochasticModelAnal->input("frame").set(input_frame);
  std::vector<float> output_stocenv;
  algoStochasticModelAnal->output("stocenv").set(output_stocenv);
  algoStochasticModelAnal->compute();
  val outputStochasticModelAnal(val::object());
  outputStochasticModelAnal.set("stocenv", output_stocenv);
  delete algoStochasticModelAnal;
  return outputStochasticModelAnal;
}
 
// check https://essentia.upf.edu/reference/std_StochasticModelSynth.html
val EssentiaJS::StochasticModelSynth(std::vector<float>& input_stocenv, const int fftSize, const int hopSize, const float sampleRate, const float stocf) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoStochasticModelSynth = factory.create("StochasticModelSynth", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate, "stocf", stocf);
  algoStochasticModelSynth->input("stocenv").set(input_stocenv);
  std::vector<float> output_frame;
  algoStochasticModelSynth->output("frame").set(output_frame);
  algoStochasticModelSynth->compute();
  val outputStochasticModelSynth(val::object());
  outputStochasticModelSynth.set("frame", output_frame);
  delete algoStochasticModelSynth;
  return outputStochasticModelSynth;
}
 
// check https://essentia.upf.edu/reference/std_StrongDecay.html
val EssentiaJS::StrongDecay(std::vector<float>& input_signal, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoStrongDecay = factory.create("StrongDecay", "sampleRate", sampleRate);
  algoStrongDecay->input("signal").set(input_signal);
  float output_strongDecay;
  algoStrongDecay->output("strongDecay").set(output_strongDecay);
  algoStrongDecay->compute();
  val outputStrongDecay(val::object());
  outputStrongDecay.set("strongDecay", output_strongDecay);
  delete algoStrongDecay;
  return outputStrongDecay;
}
 
// check https://essentia.upf.edu/reference/std_StrongPeak.html
val EssentiaJS::StrongPeak(std::vector<float>& input_spectrum) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoStrongPeak = factory.create("StrongPeak");
  algoStrongPeak->input("spectrum").set(input_spectrum);
  float output_strongPeak;
  algoStrongPeak->output("strongPeak").set(output_strongPeak);
  algoStrongPeak->compute();
  val outputStrongPeak(val::object());
  outputStrongPeak.set("strongPeak", output_strongPeak);
  delete algoStrongPeak;
  return outputStrongPeak;
}
 
// check https://essentia.upf.edu/reference/std_SuperFluxExtractor.html
val EssentiaJS::SuperFluxExtractor(std::vector<float>& input_signal, const float combine, const int frameSize, const int hopSize, const float ratioThreshold, const float sampleRate, const float threshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSuperFluxExtractor = factory.create("SuperFluxExtractor", "combine", combine, "frameSize", frameSize, "hopSize", hopSize, "ratioThreshold", ratioThreshold, "sampleRate", sampleRate, "threshold", threshold);
  algoSuperFluxExtractor->input("signal").set(input_signal);
  std::vector<float> output_onsets;
  algoSuperFluxExtractor->output("onsets").set(output_onsets);
  algoSuperFluxExtractor->compute();
  val outputSuperFluxExtractor(val::object());
  outputSuperFluxExtractor.set("onsets", output_onsets);
  delete algoSuperFluxExtractor;
  return outputSuperFluxExtractor;
}
 
// check https://essentia.upf.edu/reference/std_SuperFluxNovelty.html
val EssentiaJS::SuperFluxNovelty(std::vector<std::vector<float> >& input_bands, const int binWidth, const int frameWidth) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSuperFluxNovelty = factory.create("SuperFluxNovelty", "binWidth", binWidth, "frameWidth", frameWidth);
  algoSuperFluxNovelty->input("bands").set(input_bands);
  float output_differences;
  algoSuperFluxNovelty->output("differences").set(output_differences);
  algoSuperFluxNovelty->compute();
  val outputSuperFluxNovelty(val::object());
  outputSuperFluxNovelty.set("differences", output_differences);
  delete algoSuperFluxNovelty;
  return outputSuperFluxNovelty;
}
 
// check https://essentia.upf.edu/reference/std_SuperFluxPeaks.html
val EssentiaJS::SuperFluxPeaks(std::vector<float>& input_novelty, const float combine, const float frameRate, const float pre_avg, const float pre_max, const float ratioThreshold, const float threshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSuperFluxPeaks = factory.create("SuperFluxPeaks", "combine", combine, "frameRate", frameRate, "pre_avg", pre_avg, "pre_max", pre_max, "ratioThreshold", ratioThreshold, "threshold", threshold);
  algoSuperFluxPeaks->input("novelty").set(input_novelty);
  std::vector<float> output_peaks;
  algoSuperFluxPeaks->output("peaks").set(output_peaks);
  algoSuperFluxPeaks->compute();
  val outputSuperFluxPeaks(val::object());
  outputSuperFluxPeaks.set("peaks", output_peaks);
  delete algoSuperFluxPeaks;
  return outputSuperFluxPeaks;
}
 
// check https://essentia.upf.edu/reference/std_TCToTotal.html
val EssentiaJS::TCToTotal(std::vector<float>& input_envelope) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTCToTotal = factory.create("TCToTotal");
  algoTCToTotal->input("envelope").set(input_envelope);
  float output_TCToTotal;
  algoTCToTotal->output("TCToTotal").set(output_TCToTotal);
  algoTCToTotal->compute();
  val outputTCToTotal(val::object());
  outputTCToTotal.set("TCToTotal", output_TCToTotal);
  delete algoTCToTotal;
  return outputTCToTotal;
}
 
// check https://essentia.upf.edu/reference/std_TempoScaleBands.html
val EssentiaJS::TempoScaleBands(std::vector<float>& input_bands, const std::vector<float>& bandsGain, const float frameTime) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTempoScaleBands = factory.create("TempoScaleBands", "bandsGain", bandsGain, "frameTime", frameTime);
  algoTempoScaleBands->input("bands").set(input_bands);
  std::vector<float> output_scaledBands;
  float output_cumulativeBands;
  algoTempoScaleBands->output("scaledBands").set(output_scaledBands);
  algoTempoScaleBands->output("cumulativeBands").set(output_cumulativeBands);
  algoTempoScaleBands->compute();
  val outputTempoScaleBands(val::object());
  outputTempoScaleBands.set("scaledBands", output_scaledBands);
  outputTempoScaleBands.set("cumulativeBands", output_cumulativeBands);
  delete algoTempoScaleBands;
  return outputTempoScaleBands;
}
 
// check https://essentia.upf.edu/reference/std_TempoTap.html
val EssentiaJS::TempoTap(std::vector<float>& input_featuresFrame, const int frameHop, const int frameSize, const int maxTempo, const int minTempo, const int numberFrames, const float sampleRate, const std::vector<float>& tempoHints) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTempoTap = factory.create("TempoTap", "frameHop", frameHop, "frameSize", frameSize, "maxTempo", maxTempo, "minTempo", minTempo, "numberFrames", numberFrames, "sampleRate", sampleRate, "tempoHints", tempoHints);
  algoTempoTap->input("featuresFrame").set(input_featuresFrame);
  std::vector<float> output_periods;
  std::vector<float> output_phases;
  algoTempoTap->output("periods").set(output_periods);
  algoTempoTap->output("phases").set(output_phases);
  algoTempoTap->compute();
  val outputTempoTap(val::object());
  outputTempoTap.set("periods", output_periods);
  outputTempoTap.set("phases", output_phases);
  delete algoTempoTap;
  return outputTempoTap;
}
 
// check https://essentia.upf.edu/reference/std_TempoTapDegara.html
val EssentiaJS::TempoTapDegara(std::vector<float>& input_onsetDetections, const int maxTempo, const int minTempo, const std::string& resample, const float sampleRateODF) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTempoTapDegara = factory.create("TempoTapDegara", "maxTempo", maxTempo, "minTempo", minTempo, "resample", resample, "sampleRateODF", sampleRateODF);
  algoTempoTapDegara->input("onsetDetections").set(input_onsetDetections);
  std::vector<float> output_ticks;
  algoTempoTapDegara->output("ticks").set(output_ticks);
  algoTempoTapDegara->compute();
  val outputTempoTapDegara(val::object());
  outputTempoTapDegara.set("ticks", output_ticks);
  delete algoTempoTapDegara;
  return outputTempoTapDegara;
}
 
// check https://essentia.upf.edu/reference/std_TempoTapMaxAgreement.html
val EssentiaJS::TempoTapMaxAgreement(std::vector<std::vector<float> >& input_tickCandidates) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTempoTapMaxAgreement = factory.create("TempoTapMaxAgreement");
  algoTempoTapMaxAgreement->input("tickCandidates").set(input_tickCandidates);
  std::vector<float> output_ticks;
  float output_confidence;
  algoTempoTapMaxAgreement->output("ticks").set(output_ticks);
  algoTempoTapMaxAgreement->output("confidence").set(output_confidence);
  algoTempoTapMaxAgreement->compute();
  val outputTempoTapMaxAgreement(val::object());
  outputTempoTapMaxAgreement.set("ticks", output_ticks);
  outputTempoTapMaxAgreement.set("confidence", output_confidence);
  delete algoTempoTapMaxAgreement;
  return outputTempoTapMaxAgreement;
}
 
// check https://essentia.upf.edu/reference/std_TempoTapTicks.html
val EssentiaJS::TempoTapTicks(std::vector<float>& input_periods, std::vector<float>& input_phases, const int frameHop, const int hopSize, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTempoTapTicks = factory.create("TempoTapTicks", "frameHop", frameHop, "hopSize", hopSize, "sampleRate", sampleRate);
  algoTempoTapTicks->input("periods").set(input_periods);
  algoTempoTapTicks->input("phases").set(input_phases);
  std::vector<float> output_ticks;
  std::vector<float> output_matchingPeriods;
  algoTempoTapTicks->output("ticks").set(output_ticks);
  algoTempoTapTicks->output("matchingPeriods").set(output_matchingPeriods);
  algoTempoTapTicks->compute();
  val outputTempoTapTicks(val::object());
  outputTempoTapTicks.set("ticks", output_ticks);
  outputTempoTapTicks.set("matchingPeriods", output_matchingPeriods);
  delete algoTempoTapTicks;
  return outputTempoTapTicks;
}
 
// check https://essentia.upf.edu/reference/std_TonalExtractor.html
val EssentiaJS::TonalExtractor(std::vector<float>& input_signal, const int frameSize, const int hopSize, const float tuningFrequency) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTonalExtractor = factory.create("TonalExtractor", "frameSize", frameSize, "hopSize", hopSize, "tuningFrequency", tuningFrequency);
  algoTonalExtractor->input("signal").set(input_signal);
  float output_chords_changes_rate;
  std::vector<float> output_chords_histogram;
  std::string output_chords_key;
  float output_chords_number_rate;
  std::vector<std::string> output_chords_progression;
  std::string output_chords_scale;
  std::vector<float> output_chords_strength;
  std::vector<std::vector<float> > output_hpcp;
  std::vector<std::vector<float> > output_hpcp_highres;
  std::string output_key_key;
  std::string output_key_scale;
  float output_key_strength;
  algoTonalExtractor->output("chords_changes_rate").set(output_chords_changes_rate);
  algoTonalExtractor->output("chords_histogram").set(output_chords_histogram);
  algoTonalExtractor->output("chords_key").set(output_chords_key);
  algoTonalExtractor->output("chords_number_rate").set(output_chords_number_rate);
  algoTonalExtractor->output("chords_progression").set(output_chords_progression);
  algoTonalExtractor->output("chords_scale").set(output_chords_scale);
  algoTonalExtractor->output("chords_strength").set(output_chords_strength);
  algoTonalExtractor->output("hpcp").set(output_hpcp);
  algoTonalExtractor->output("hpcp_highres").set(output_hpcp_highres);
  algoTonalExtractor->output("key_key").set(output_key_key);
  algoTonalExtractor->output("key_scale").set(output_key_scale);
  algoTonalExtractor->output("key_strength").set(output_key_strength);
  algoTonalExtractor->compute();
  val outputTonalExtractor(val::object());
  outputTonalExtractor.set("chords_changes_rate", output_chords_changes_rate);
  outputTonalExtractor.set("chords_histogram", output_chords_histogram);
  outputTonalExtractor.set("chords_key", output_chords_key);
  outputTonalExtractor.set("chords_number_rate", output_chords_number_rate);
  outputTonalExtractor.set("chords_progression", output_chords_progression);
  outputTonalExtractor.set("chords_scale", output_chords_scale);
  outputTonalExtractor.set("chords_strength", output_chords_strength);
  outputTonalExtractor.set("hpcp", output_hpcp);
  outputTonalExtractor.set("hpcp_highres", output_hpcp_highres);
  outputTonalExtractor.set("key_key", output_key_key);
  outputTonalExtractor.set("key_scale", output_key_scale);
  outputTonalExtractor.set("key_strength", output_key_strength);
  delete algoTonalExtractor;
  return outputTonalExtractor;
}
 
// check https://essentia.upf.edu/reference/std_TonicIndianArtMusic.html
val EssentiaJS::TonicIndianArtMusic(std::vector<float>& input_signal, const float binResolution, const int frameSize, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const float magnitudeThreshold, const float maxTonicFrequency, const float minTonicFrequency, const int numberHarmonics, const int numberSaliencePeaks, const float referenceFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTonicIndianArtMusic = factory.create("TonicIndianArtMusic", "binResolution", binResolution, "frameSize", frameSize, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxTonicFrequency", maxTonicFrequency, "minTonicFrequency", minTonicFrequency, "numberHarmonics", numberHarmonics, "numberSaliencePeaks", numberSaliencePeaks, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate);
  algoTonicIndianArtMusic->input("signal").set(input_signal);
  float output_tonic;
  algoTonicIndianArtMusic->output("tonic").set(output_tonic);
  algoTonicIndianArtMusic->compute();
  val outputTonicIndianArtMusic(val::object());
  outputTonicIndianArtMusic.set("tonic", output_tonic);
  delete algoTonicIndianArtMusic;
  return outputTonicIndianArtMusic;
}
 
// check https://essentia.upf.edu/reference/std_TriangularBands.html
val EssentiaJS::TriangularBands(std::vector<float>& input_spectrum, const std::vector<float>& frequencyBands, const int inputSize, const bool log, const std::string& normalize, const float sampleRate, const std::string& type, const std::string& weighting) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTriangularBands = factory.create("TriangularBands", "frequencyBands", frequencyBands, "inputSize", inputSize, "log", log, "normalize", normalize, "sampleRate", sampleRate, "type", type, "weighting", weighting);
  algoTriangularBands->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  algoTriangularBands->output("bands").set(output_bands);
  algoTriangularBands->compute();
  val outputTriangularBands(val::object());
  outputTriangularBands.set("bands", output_bands);
  delete algoTriangularBands;
  return outputTriangularBands;
}
 
// check https://essentia.upf.edu/reference/std_TriangularBarkBands.html
val EssentiaJS::TriangularBarkBands(std::vector<float>& input_spectrum, const float highFrequencyBound, const int inputSize, const bool log, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const float sampleRate, const std::string& type, const std::string& weighting) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTriangularBarkBands = factory.create("TriangularBarkBands", "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "log", log, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "sampleRate", sampleRate, "type", type, "weighting", weighting);
  algoTriangularBarkBands->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  algoTriangularBarkBands->output("bands").set(output_bands);
  algoTriangularBarkBands->compute();
  val outputTriangularBarkBands(val::object());
  outputTriangularBarkBands.set("bands", output_bands);
  delete algoTriangularBarkBands;
  return outputTriangularBarkBands;
}
 
// check https://essentia.upf.edu/reference/std_Trimmer.html
val EssentiaJS::Trimmer(std::vector<float>& input_signal, const bool checkRange, const float endTime, const float sampleRate, const float startTime) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTrimmer = factory.create("Trimmer", "checkRange", checkRange, "endTime", endTime, "sampleRate", sampleRate, "startTime", startTime);
  algoTrimmer->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoTrimmer->output("signal").set(output_signal);
  algoTrimmer->compute();
  val outputTrimmer(val::object());
  outputTrimmer.set("signal", output_signal);
  delete algoTrimmer;
  return outputTrimmer;
}
 
// check https://essentia.upf.edu/reference/std_Tristimulus.html
val EssentiaJS::Tristimulus(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTristimulus = factory.create("Tristimulus");
  algoTristimulus->input("frequencies").set(input_frequencies);
  algoTristimulus->input("magnitudes").set(input_magnitudes);
  std::vector<float> output_tristimulus;
  algoTristimulus->output("tristimulus").set(output_tristimulus);
  algoTristimulus->compute();
  val outputTristimulus(val::object());
  outputTristimulus.set("tristimulus", output_tristimulus);
  delete algoTristimulus;
  return outputTristimulus;
}
 
// check https://essentia.upf.edu/reference/std_TruePeakDetector.html
val EssentiaJS::TruePeakDetector(std::vector<float>& input_signal, const bool blockDC, const bool emphasise, const int oversamplingFactor, const int quality, const float sampleRate, const float threshold, const int version) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTruePeakDetector = factory.create("TruePeakDetector", "blockDC", blockDC, "emphasise", emphasise, "oversamplingFactor", oversamplingFactor, "quality", quality, "sampleRate", sampleRate, "threshold", threshold, "version", version);
  algoTruePeakDetector->input("signal").set(input_signal);
  std::vector<float> output_peakLocations;
  std::vector<float> output_output;
  algoTruePeakDetector->output("peakLocations").set(output_peakLocations);
  algoTruePeakDetector->output("output").set(output_output);
  algoTruePeakDetector->compute();
  val outputTruePeakDetector(val::object());
  outputTruePeakDetector.set("peakLocations", output_peakLocations);
  outputTruePeakDetector.set("output", output_output);
  delete algoTruePeakDetector;
  return outputTruePeakDetector;
}
 
// check https://essentia.upf.edu/reference/std_TuningFrequency.html
val EssentiaJS::TuningFrequency(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, const float resolution) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTuningFrequency = factory.create("TuningFrequency", "resolution", resolution);
  algoTuningFrequency->input("frequencies").set(input_frequencies);
  algoTuningFrequency->input("magnitudes").set(input_magnitudes);
  float output_tuningFrequency;
  float output_tuningCents;
  algoTuningFrequency->output("tuningFrequency").set(output_tuningFrequency);
  algoTuningFrequency->output("tuningCents").set(output_tuningCents);
  algoTuningFrequency->compute();
  val outputTuningFrequency(val::object());
  outputTuningFrequency.set("tuningFrequency", output_tuningFrequency);
  outputTuningFrequency.set("tuningCents", output_tuningCents);
  delete algoTuningFrequency;
  return outputTuningFrequency;
}
 
// check https://essentia.upf.edu/reference/std_TuningFrequencyExtractor.html
val EssentiaJS::TuningFrequencyExtractor(std::vector<float>& input_signal, const int frameSize, const int hopSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTuningFrequencyExtractor = factory.create("TuningFrequencyExtractor", "frameSize", frameSize, "hopSize", hopSize);
  algoTuningFrequencyExtractor->input("signal").set(input_signal);
  std::vector<float> output_tuningFrequency;
  algoTuningFrequencyExtractor->output("tuningFrequency").set(output_tuningFrequency);
  algoTuningFrequencyExtractor->compute();
  val outputTuningFrequencyExtractor(val::object());
  outputTuningFrequencyExtractor.set("tuningFrequency", output_tuningFrequency);
  delete algoTuningFrequencyExtractor;
  return outputTuningFrequencyExtractor;
}
 
// check https://essentia.upf.edu/reference/std_UnaryOperator.html
val EssentiaJS::UnaryOperator(std::vector<float>& input_array, const float scale, const float shift, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoUnaryOperator = factory.create("UnaryOperator", "scale", scale, "shift", shift, "type", type);
  algoUnaryOperator->input("array").set(input_array);
  std::vector<float> output_array;
  algoUnaryOperator->output("array").set(output_array);
  algoUnaryOperator->compute();
  val outputUnaryOperator(val::object());
  outputUnaryOperator.set("array", output_array);
  delete algoUnaryOperator;
  return outputUnaryOperator;
}
 
// check https://essentia.upf.edu/reference/std_UnaryOperatorStream.html
val EssentiaJS::UnaryOperatorStream(std::vector<float>& input_array, const float scale, const float shift, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoUnaryOperatorStream = factory.create("UnaryOperatorStream", "scale", scale, "shift", shift, "type", type);
  algoUnaryOperatorStream->input("array").set(input_array);
  std::vector<float> output_array;
  algoUnaryOperatorStream->output("array").set(output_array);
  algoUnaryOperatorStream->compute();
  val outputUnaryOperatorStream(val::object());
  outputUnaryOperatorStream.set("array", output_array);
  delete algoUnaryOperatorStream;
  return outputUnaryOperatorStream;
}
 
// check https://essentia.upf.edu/reference/std_Variance.html
val EssentiaJS::Variance(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoVariance = factory.create("Variance");
  algoVariance->input("array").set(input_array);
  float output_variance;
  algoVariance->output("variance").set(output_variance);
  algoVariance->compute();
  val outputVariance(val::object());
  outputVariance.set("variance", output_variance);
  delete algoVariance;
  return outputVariance;
}
 
// check https://essentia.upf.edu/reference/std_Vibrato.html
val EssentiaJS::Vibrato(std::vector<float>& input_pitch, const float maxExtend, const float maxFrequency, const float minExtend, const float minFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoVibrato = factory.create("Vibrato", "maxExtend", maxExtend, "maxFrequency", maxFrequency, "minExtend", minExtend, "minFrequency", minFrequency, "sampleRate", sampleRate);
  algoVibrato->input("pitch").set(input_pitch);
  std::vector<float> output_vibratoFrequency;
  std::vector<float> output_vibratoExtend;
  algoVibrato->output("vibratoFrequency").set(output_vibratoFrequency);
  algoVibrato->output("vibratoExtend").set(output_vibratoExtend);
  algoVibrato->compute();
  val outputVibrato(val::object());
  outputVibrato.set("vibratoFrequency", output_vibratoFrequency);
  outputVibrato.set("vibratoExtend", output_vibratoExtend);
  delete algoVibrato;
  return outputVibrato;
}
 
// check https://essentia.upf.edu/reference/std_WarpedAutoCorrelation.html
val EssentiaJS::WarpedAutoCorrelation(std::vector<float>& input_array, const int maxLag, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoWarpedAutoCorrelation = factory.create("WarpedAutoCorrelation", "maxLag", maxLag, "sampleRate", sampleRate);
  algoWarpedAutoCorrelation->input("array").set(input_array);
  std::vector<float> output_warpedAutoCorrelation;
  algoWarpedAutoCorrelation->output("warpedAutoCorrelation").set(output_warpedAutoCorrelation);
  algoWarpedAutoCorrelation->compute();
  val outputWarpedAutoCorrelation(val::object());
  outputWarpedAutoCorrelation.set("warpedAutoCorrelation", output_warpedAutoCorrelation);
  delete algoWarpedAutoCorrelation;
  return outputWarpedAutoCorrelation;
}
 
// check https://essentia.upf.edu/reference/std_Welch.html
val EssentiaJS::Welch(std::vector<float>& input_frame, const int averagingFrames, const int fftSize, const int frameSize, const float sampleRate, const std::string& scaling, const std::string& windowType) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoWelch = factory.create("Welch", "averagingFrames", averagingFrames, "fftSize", fftSize, "frameSize", frameSize, "sampleRate", sampleRate, "scaling", scaling, "windowType", windowType);
  algoWelch->input("frame").set(input_frame);
  std::vector<float> output_psd;
  algoWelch->output("psd").set(output_psd);
  algoWelch->compute();
  val outputWelch(val::object());
  outputWelch.set("psd", output_psd);
  delete algoWelch;
  return outputWelch;
}
 
// check https://essentia.upf.edu/reference/std_Windowing.html
val EssentiaJS::Windowing(std::vector<float>& input_frame, const bool normalized, const int size, const std::string& type, const int zeroPadding, const bool zeroPhase) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoWindowing = factory.create("Windowing", "normalized", normalized, "size", size, "type", type, "zeroPadding", zeroPadding, "zeroPhase", zeroPhase);
  algoWindowing->input("frame").set(input_frame);
  std::vector<float> output_frame;
  algoWindowing->output("frame").set(output_frame);
  algoWindowing->compute();
  val outputWindowing(val::object());
  outputWindowing.set("frame", output_frame);
  delete algoWindowing;
  return outputWindowing;
}
 
// check https://essentia.upf.edu/reference/std_ZeroCrossingRate.html
val EssentiaJS::ZeroCrossingRate(std::vector<float>& input_signal, const float threshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoZeroCrossingRate = factory.create("ZeroCrossingRate", "threshold", threshold);
  algoZeroCrossingRate->input("signal").set(input_signal);
  float output_zeroCrossingRate;
  algoZeroCrossingRate->output("zeroCrossingRate").set(output_zeroCrossingRate);
  algoZeroCrossingRate->compute();
  val outputZeroCrossingRate(val::object());
  outputZeroCrossingRate.set("zeroCrossingRate", output_zeroCrossingRate);
  delete algoZeroCrossingRate;
  return outputZeroCrossingRate;
}
