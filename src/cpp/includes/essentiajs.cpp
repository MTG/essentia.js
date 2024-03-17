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

#include <essentia/pool.h>
#include "essentiajs.h"


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

void _initEssentia(bool debugger) {
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
}

// START FrameGenerator definitions
FrameGenerator::FrameGenerator(int frameSize, int hopSize) {
  _framecutter = AlgorithmFactory::create("FrameCutter",
                "frameSize", frameSize,
                "hopSize", hopSize);
}
FrameGenerator::~FrameGenerator() {
  delete _framecutter;
}
void FrameGenerator::configure(int frameSize, int hopSize) {
  _framecutter->configure("frameSize", frameSize, "hopSize", hopSize);
}
std::vector<std::vector<float> > FrameGenerator::compute(const val& signalArray) {
  // convert JS typed typed float 32 array to std::vector<float>
  std::vector<float> signal = float32ArrayToVector(signalArray);

  Pool pool;
  std::vector<float> frame;
  _framecutter->input("signal").set(signal);
  _framecutter->output("frame").set(frame);
  while (true) {
    // compute a frame
    _framecutter->compute();
    // if it was the last one (ie: it was empty), then we're done.
    if (!frame.size()) {
      break;
    }
    // if the frame is silent, just drop it and go on processing
    if (isSilent(frame)) continue;
    pool.add("frames", frame);
  }

  return pool.value< std::vector<std::vector<float> > >("frames");
}

void FrameGenerator::reset() {
  _framecutter->reset();
}
// END FrameGenerator definitions

// This a wrapper for MonoMixer algorithm to accept both left and right channels to downmix an stereo channel input to mono
// check https://essentia.upf.edu/reference/std_MonoMixer.html for algorithm details
// TODO: could be reimplemented with BinaryOperator and UnaryOperator in the future
// val EssentiaJS::MonoMixer(std::vector<float>& left_channel, std::vector<float>& right_channel) {
//   AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

//   // TODO: remove this stereosample cresting overhead in future 
//   Algorithm* algoStereoMuxer = factory.create("StereoMuxer");
//   algoStereoMuxer->input("left").set(left_channel);
//   algoStereoMuxer->input("right").set(right_channel);
//   std::vector<StereoSample> stereoSignal;
//   algoStereoMuxer->output("audio").set(stereoSignal);
//   algoStereoMuxer->compute();
//   delete algoStereoMuxer;

//   Algorithm* algoMonoMixer = factory.create("MonoMixer");
//   std::vector<float> output_audio;
//   algoMonoMixer->input("audio").set(stereoSignal);
//   // set numberChannels=2 since we only deal with stereo signal in this wrapper
//   algoMonoMixer->input("numberChannels").set(2);
//   algoMonoMixer->output("audio").set(output_audio);
//   algoMonoMixer->compute();

//   val outputMonoMixer(val::object());
//   outputMonoMixer.set("audio", output_audio);
//   delete algoMonoMixer;
//   return outputMonoMixer;
// };

// This a wrapper for LoudnessEBUR128 algorithm to accept both left and right channels of an stereo audio signal seperately
// check https://essentia.upf.edu/reference/std_LoudnessEBUR128.html for algorithm details
LoudnessEBUR128::LoudnessEBUR128(const float hopSize, const float sampleRate, const bool startAtZero) {
  _algoStereoMuxer = AlgorithmFactory::create("StereoMuxer");
  _algoLoudnessEBUR128 = AlgorithmFactory::create("LoudnessEBUR128", "hopSize", hopSize, "sampleRate", sampleRate, "startAtZero", startAtZero);
}

LoudnessEBUR128::~LoudnessEBUR128() {
  if (_algoStereoMuxer) delete _algoStereoMuxer;
  if (_algoLoudnessEBUR128) delete _algoLoudnessEBUR128;
}

void LoudnessEBUR128::configure(const float hopSize, const float sampleRate, const bool startAtZero) {
  _algoStereoMuxer->configure();
  _algoLoudnessEBUR128->configure("hopSize", hopSize, "sampleRate", sampleRate, "startAtZero", startAtZero);
}

val LoudnessEBUR128::compute(std::vector<float>& left_channel, std::vector<float>& right_channel) {
  _algoStereoMuxer->input("left").set(left_channel);
  _algoStereoMuxer->input("right").set(right_channel);
  std::vector<StereoSample> stereoSignal;
  _algoStereoMuxer->output("audio").set(stereoSignal);
  _algoStereoMuxer->compute();

  _algoLoudnessEBUR128->input("signal").set(stereoSignal);
  std::vector<float> output_momentaryLoudness;
  std::vector<float> output_shortTermLoudness;
  float output_integratedLoudness;
  float output_loudnessRange;
  _algoLoudnessEBUR128->output("momentaryLoudness").set(output_momentaryLoudness);
  _algoLoudnessEBUR128->output("shortTermLoudness").set(output_shortTermLoudness);
  _algoLoudnessEBUR128->output("integratedLoudness").set(output_integratedLoudness);
  _algoLoudnessEBUR128->output("loudnessRange").set(output_loudnessRange);
  _algoLoudnessEBUR128->compute();
  val outputLoudnessEBUR128(val::object());
  outputLoudnessEBUR128.set("momentaryLoudness", output_momentaryLoudness);
  outputLoudnessEBUR128.set("shortTermLoudness", output_shortTermLoudness);
  outputLoudnessEBUR128.set("integratedLoudness", output_integratedLoudness);
  outputLoudnessEBUR128.set("loudnessRange", output_loudnessRange);

  return outputLoudnessEBUR128;
}

void LoudnessEBUR128::reset() {
  _algoStereoMuxer->reset();
  _algoLoudnessEBUR128->reset();
}

// NOTE: The following code snippets are machine generated. Do not edit.

// START AfterMaxToBeforeMaxEnergyRatio definitions
// check https://essentia.upf.edu/reference/std_AfterMaxToBeforeMaxEnergyRatio.html
AfterMaxToBeforeMaxEnergyRatio::AfterMaxToBeforeMaxEnergyRatio() {
	_aftermaxtobeforemaxenergyratio = AlgorithmFactory::create("AfterMaxToBeforeMaxEnergyRatio");
}
AfterMaxToBeforeMaxEnergyRatio::~AfterMaxToBeforeMaxEnergyRatio() {
	if (_aftermaxtobeforemaxenergyratio) delete _aftermaxtobeforemaxenergyratio;
}
void AfterMaxToBeforeMaxEnergyRatio::configure() {
	_aftermaxtobeforemaxenergyratio->configure();
}
val AfterMaxToBeforeMaxEnergyRatio::compute(std::vector<float>& input_pitch) {
	_aftermaxtobeforemaxenergyratio->input("pitch").set(input_pitch);
	float output_afterMaxToBeforeMaxEnergyRatio;
	_aftermaxtobeforemaxenergyratio->output("afterMaxToBeforeMaxEnergyRatio").set(output_afterMaxToBeforeMaxEnergyRatio);
	_aftermaxtobeforemaxenergyratio->compute();
	val outputAfterMaxToBeforeMaxEnergyRatio(val::object());
	outputAfterMaxToBeforeMaxEnergyRatio.set("afterMaxToBeforeMaxEnergyRatio", output_afterMaxToBeforeMaxEnergyRatio);
	return outputAfterMaxToBeforeMaxEnergyRatio;
}
void AfterMaxToBeforeMaxEnergyRatio::reset() {
_aftermaxtobeforemaxenergyratio->reset();
}
// END AfterMaxToBeforeMaxEnergyRatio definitions

// START AllPass definitions
// check https://essentia.upf.edu/reference/std_AllPass.html
AllPass::AllPass(const float bandwidth, const float cutoffFrequency, const int order, const float sampleRate) {
	_allpass = AlgorithmFactory::create("AllPass", "bandwidth", bandwidth, "cutoffFrequency", cutoffFrequency, "order", order, "sampleRate", sampleRate);
}
AllPass::~AllPass() {
	if (_allpass) delete _allpass;
}
void AllPass::configure(const float bandwidth, const float cutoffFrequency, const int order, const float sampleRate) {
	_allpass->configure("bandwidth", bandwidth, "cutoffFrequency", cutoffFrequency, "order", order, "sampleRate", sampleRate);
}
val AllPass::compute(std::vector<float>& input_signal) {
	_allpass->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_allpass->output("signal").set(output_signal);
	_allpass->compute();
	val outputAllPass(val::object());
	outputAllPass.set("signal", output_signal);
	return outputAllPass;
}
void AllPass::reset() {
_allpass->reset();
}
// END AllPass definitions

// START AudioOnsetsMarker definitions
// check https://essentia.upf.edu/reference/std_AudioOnsetsMarker.html
AudioOnsetsMarker::AudioOnsetsMarker(const std::vector<float>& onsets, const float sampleRate, const std::string& type) {
	_audioonsetsmarker = AlgorithmFactory::create("AudioOnsetsMarker", "onsets", onsets, "sampleRate", sampleRate, "type", type);
}
AudioOnsetsMarker::~AudioOnsetsMarker() {
	if (_audioonsetsmarker) delete _audioonsetsmarker;
}
void AudioOnsetsMarker::configure(const std::vector<float>& onsets, const float sampleRate, const std::string& type) {
	_audioonsetsmarker->configure("onsets", onsets, "sampleRate", sampleRate, "type", type);
}
val AudioOnsetsMarker::compute(std::vector<float>& input_signal) {
	_audioonsetsmarker->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_audioonsetsmarker->output("signal").set(output_signal);
	_audioonsetsmarker->compute();
	val outputAudioOnsetsMarker(val::object());
	outputAudioOnsetsMarker.set("signal", output_signal);
	return outputAudioOnsetsMarker;
}
void AudioOnsetsMarker::reset() {
_audioonsetsmarker->reset();
}
// END AudioOnsetsMarker definitions

// START AutoCorrelation definitions
// check https://essentia.upf.edu/reference/std_AutoCorrelation.html
AutoCorrelation::AutoCorrelation(const float frequencyDomainCompression, const bool generalized, const std::string& normalization) {
	_autocorrelation = AlgorithmFactory::create("AutoCorrelation", "frequencyDomainCompression", frequencyDomainCompression, "generalized", generalized, "normalization", normalization);
}
AutoCorrelation::~AutoCorrelation() {
	if (_autocorrelation) delete _autocorrelation;
}
void AutoCorrelation::configure(const float frequencyDomainCompression, const bool generalized, const std::string& normalization) {
	_autocorrelation->configure("frequencyDomainCompression", frequencyDomainCompression, "generalized", generalized, "normalization", normalization);
}
val AutoCorrelation::compute(std::vector<float>& input_array) {
	_autocorrelation->input("array").set(input_array);
	std::vector<float> output_autoCorrelation;
	_autocorrelation->output("autoCorrelation").set(output_autoCorrelation);
	_autocorrelation->compute();
	val outputAutoCorrelation(val::object());
	outputAutoCorrelation.set("autoCorrelation", output_autoCorrelation);
	return outputAutoCorrelation;
}
void AutoCorrelation::reset() {
_autocorrelation->reset();
}
// END AutoCorrelation definitions

// START BFCC definitions
// check https://essentia.upf.edu/reference/std_BFCC.html
BFCC::BFCC(const int dctType, const float highFrequencyBound, const int inputSize, const int liftering, const std::string& logType, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const int numberCoefficients, const float sampleRate, const std::string& type, const std::string& weighting) {
	_bfcc = AlgorithmFactory::create("BFCC", "dctType", dctType, "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "liftering", liftering, "logType", logType, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "numberCoefficients", numberCoefficients, "sampleRate", sampleRate, "type", type, "weighting", weighting);
}
BFCC::~BFCC() {
	if (_bfcc) delete _bfcc;
}
void BFCC::configure(const int dctType, const float highFrequencyBound, const int inputSize, const int liftering, const std::string& logType, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const int numberCoefficients, const float sampleRate, const std::string& type, const std::string& weighting) {
	_bfcc->configure("dctType", dctType, "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "liftering", liftering, "logType", logType, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "numberCoefficients", numberCoefficients, "sampleRate", sampleRate, "type", type, "weighting", weighting);
}
val BFCC::compute(std::vector<float>& input_spectrum) {
	_bfcc->input("spectrum").set(input_spectrum);
	std::vector<float> output_bands;
	std::vector<float> output_bfcc;
	_bfcc->output("bands").set(output_bands);
	_bfcc->output("bfcc").set(output_bfcc);
	_bfcc->compute();
	val outputBFCC(val::object());
	outputBFCC.set("bands", output_bands);
	outputBFCC.set("bfcc", output_bfcc);
	return outputBFCC;
}
void BFCC::reset() {
_bfcc->reset();
}
// END BFCC definitions

// START BPF definitions
// check https://essentia.upf.edu/reference/std_BPF.html
BPF::BPF(const std::vector<float>& xPoints, const std::vector<float>& yPoints) {
	_bpf = AlgorithmFactory::create("BPF", "xPoints", xPoints, "yPoints", yPoints);
}
BPF::~BPF() {
	if (_bpf) delete _bpf;
}
void BPF::configure(const std::vector<float>& xPoints, const std::vector<float>& yPoints) {
	_bpf->configure("xPoints", xPoints, "yPoints", yPoints);
}
val BPF::compute(float input_x) {
	_bpf->input("x").set(input_x);
	float output_y;
	_bpf->output("y").set(output_y);
	_bpf->compute();
	val outputBPF(val::object());
	outputBPF.set("y", output_y);
	return outputBPF;
}
void BPF::reset() {
_bpf->reset();
}
// END BPF definitions

// START BandPass definitions
// check https://essentia.upf.edu/reference/std_BandPass.html
BandPass::BandPass(const float bandwidth, const float cutoffFrequency, const float sampleRate) {
	_bandpass = AlgorithmFactory::create("BandPass", "bandwidth", bandwidth, "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
}
BandPass::~BandPass() {
	if (_bandpass) delete _bandpass;
}
void BandPass::configure(const float bandwidth, const float cutoffFrequency, const float sampleRate) {
	_bandpass->configure("bandwidth", bandwidth, "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
}
val BandPass::compute(std::vector<float>& input_signal) {
	_bandpass->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_bandpass->output("signal").set(output_signal);
	_bandpass->compute();
	val outputBandPass(val::object());
	outputBandPass.set("signal", output_signal);
	return outputBandPass;
}
void BandPass::reset() {
_bandpass->reset();
}
// END BandPass definitions

// START BandReject definitions
// check https://essentia.upf.edu/reference/std_BandReject.html
BandReject::BandReject(const float bandwidth, const float cutoffFrequency, const float sampleRate) {
	_bandreject = AlgorithmFactory::create("BandReject", "bandwidth", bandwidth, "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
}
BandReject::~BandReject() {
	if (_bandreject) delete _bandreject;
}
void BandReject::configure(const float bandwidth, const float cutoffFrequency, const float sampleRate) {
	_bandreject->configure("bandwidth", bandwidth, "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
}
val BandReject::compute(std::vector<float>& input_signal) {
	_bandreject->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_bandreject->output("signal").set(output_signal);
	_bandreject->compute();
	val outputBandReject(val::object());
	outputBandReject.set("signal", output_signal);
	return outputBandReject;
}
void BandReject::reset() {
_bandreject->reset();
}
// END BandReject definitions

// START BarkBands definitions
// check https://essentia.upf.edu/reference/std_BarkBands.html
BarkBands::BarkBands(const int numberBands, const float sampleRate) {
	_barkbands = AlgorithmFactory::create("BarkBands", "numberBands", numberBands, "sampleRate", sampleRate);
}
BarkBands::~BarkBands() {
	if (_barkbands) delete _barkbands;
}
void BarkBands::configure(const int numberBands, const float sampleRate) {
	_barkbands->configure("numberBands", numberBands, "sampleRate", sampleRate);
}
val BarkBands::compute(std::vector<float>& input_spectrum) {
	_barkbands->input("spectrum").set(input_spectrum);
	std::vector<float> output_bands;
	_barkbands->output("bands").set(output_bands);
	_barkbands->compute();
	val outputBarkBands(val::object());
	outputBarkBands.set("bands", output_bands);
	return outputBarkBands;
}
void BarkBands::reset() {
_barkbands->reset();
}
// END BarkBands definitions

// START BeatTrackerDegara definitions
// check https://essentia.upf.edu/reference/std_BeatTrackerDegara.html
BeatTrackerDegara::BeatTrackerDegara(const int maxTempo, const int minTempo) {
	_beattrackerdegara = AlgorithmFactory::create("BeatTrackerDegara", "maxTempo", maxTempo, "minTempo", minTempo);
}
BeatTrackerDegara::~BeatTrackerDegara() {
	if (_beattrackerdegara) delete _beattrackerdegara;
}
void BeatTrackerDegara::configure(const int maxTempo, const int minTempo) {
	_beattrackerdegara->configure("maxTempo", maxTempo, "minTempo", minTempo);
}
val BeatTrackerDegara::compute(std::vector<float>& input_signal) {
	_beattrackerdegara->input("signal").set(input_signal);
	std::vector<float> output_ticks;
	_beattrackerdegara->output("ticks").set(output_ticks);
	_beattrackerdegara->compute();
	val outputBeatTrackerDegara(val::object());
	outputBeatTrackerDegara.set("ticks", output_ticks);
	return outputBeatTrackerDegara;
}
void BeatTrackerDegara::reset() {
_beattrackerdegara->reset();
}
// END BeatTrackerDegara definitions

// START BeatTrackerMultiFeature definitions
// check https://essentia.upf.edu/reference/std_BeatTrackerMultiFeature.html
BeatTrackerMultiFeature::BeatTrackerMultiFeature(const int maxTempo, const int minTempo) {
	_beattrackermultifeature = AlgorithmFactory::create("BeatTrackerMultiFeature", "maxTempo", maxTempo, "minTempo", minTempo);
}
BeatTrackerMultiFeature::~BeatTrackerMultiFeature() {
	if (_beattrackermultifeature) delete _beattrackermultifeature;
}
void BeatTrackerMultiFeature::configure(const int maxTempo, const int minTempo) {
	_beattrackermultifeature->configure("maxTempo", maxTempo, "minTempo", minTempo);
}
val BeatTrackerMultiFeature::compute(std::vector<float>& input_signal) {
	_beattrackermultifeature->input("signal").set(input_signal);
	std::vector<float> output_ticks;
	float output_confidence;
	_beattrackermultifeature->output("ticks").set(output_ticks);
	_beattrackermultifeature->output("confidence").set(output_confidence);
	_beattrackermultifeature->compute();
	val outputBeatTrackerMultiFeature(val::object());
	outputBeatTrackerMultiFeature.set("ticks", output_ticks);
	outputBeatTrackerMultiFeature.set("confidence", output_confidence);
	return outputBeatTrackerMultiFeature;
}
void BeatTrackerMultiFeature::reset() {
_beattrackermultifeature->reset();
}
// END BeatTrackerMultiFeature definitions

// START Beatogram definitions
// check https://essentia.upf.edu/reference/std_Beatogram.html
Beatogram::Beatogram(const int size) {
	_beatogram = AlgorithmFactory::create("Beatogram", "size", size);
}
Beatogram::~Beatogram() {
	if (_beatogram) delete _beatogram;
}
void Beatogram::configure(const int size) {
	_beatogram->configure("size", size);
}
val Beatogram::compute(std::vector<float>& input_loudness, std::vector<std::vector<float> >& input_loudnessBandRatio) {
	_beatogram->input("loudness").set(input_loudness);
	_beatogram->input("loudnessBandRatio").set(input_loudnessBandRatio);
	std::vector<std::vector<float> > output_beatogram;
	_beatogram->output("beatogram").set(output_beatogram);
	_beatogram->compute();
	val outputBeatogram(val::object());
	outputBeatogram.set("beatogram", output_beatogram);
	return outputBeatogram;
}
void Beatogram::reset() {
_beatogram->reset();
}
// END Beatogram definitions

// START BeatsLoudness definitions
// check https://essentia.upf.edu/reference/std_BeatsLoudness.html
BeatsLoudness::BeatsLoudness(const float beatDuration, const float beatWindowDuration, const std::vector<float>& beats, const std::vector<float>& frequencyBands, const float sampleRate) {
	_beatsloudness = AlgorithmFactory::create("BeatsLoudness", "beatDuration", beatDuration, "beatWindowDuration", beatWindowDuration, "beats", beats, "frequencyBands", frequencyBands, "sampleRate", sampleRate);
}
BeatsLoudness::~BeatsLoudness() {
	if (_beatsloudness) delete _beatsloudness;
}
void BeatsLoudness::configure(const float beatDuration, const float beatWindowDuration, const std::vector<float>& beats, const std::vector<float>& frequencyBands, const float sampleRate) {
	_beatsloudness->configure("beatDuration", beatDuration, "beatWindowDuration", beatWindowDuration, "beats", beats, "frequencyBands", frequencyBands, "sampleRate", sampleRate);
}
val BeatsLoudness::compute(std::vector<float>& input_signal) {
	_beatsloudness->input("signal").set(input_signal);
	std::vector<float> output_loudness;
	std::vector<std::vector<float> > output_loudnessBandRatio;
	_beatsloudness->output("loudness").set(output_loudness);
	_beatsloudness->output("loudnessBandRatio").set(output_loudnessBandRatio);
	_beatsloudness->compute();
	val outputBeatsLoudness(val::object());
	outputBeatsLoudness.set("loudness", output_loudness);
	outputBeatsLoudness.set("loudnessBandRatio", output_loudnessBandRatio);
	return outputBeatsLoudness;
}
void BeatsLoudness::reset() {
_beatsloudness->reset();
}
// END BeatsLoudness definitions

// START BinaryOperator definitions
// check https://essentia.upf.edu/reference/std_BinaryOperator.html
BinaryOperator::BinaryOperator(const std::string& type) {
	_binaryoperator = AlgorithmFactory::create("BinaryOperator", "type", type);
}
BinaryOperator::~BinaryOperator() {
	if (_binaryoperator) delete _binaryoperator;
}
void BinaryOperator::configure(const std::string& type) {
	_binaryoperator->configure("type", type);
}
val BinaryOperator::compute(std::vector<float>& input_array1, std::vector<float>& input_array2) {
	_binaryoperator->input("array1").set(input_array1);
	_binaryoperator->input("array2").set(input_array2);
	std::vector<float> output_array;
	_binaryoperator->output("array").set(output_array);
	_binaryoperator->compute();
	val outputBinaryOperator(val::object());
	outputBinaryOperator.set("array", output_array);
	return outputBinaryOperator;
}
void BinaryOperator::reset() {
_binaryoperator->reset();
}
// END BinaryOperator definitions

// START BinaryOperatorStream definitions
// check https://essentia.upf.edu/reference/std_BinaryOperatorStream.html
BinaryOperatorStream::BinaryOperatorStream(const std::string& type) {
	_binaryoperatorstream = AlgorithmFactory::create("BinaryOperatorStream", "type", type);
}
BinaryOperatorStream::~BinaryOperatorStream() {
	if (_binaryoperatorstream) delete _binaryoperatorstream;
}
void BinaryOperatorStream::configure(const std::string& type) {
	_binaryoperatorstream->configure("type", type);
}
val BinaryOperatorStream::compute(std::vector<float>& input_array1, std::vector<float>& input_array2) {
	_binaryoperatorstream->input("array1").set(input_array1);
	_binaryoperatorstream->input("array2").set(input_array2);
	std::vector<float> output_array;
	_binaryoperatorstream->output("array").set(output_array);
	_binaryoperatorstream->compute();
	val outputBinaryOperatorStream(val::object());
	outputBinaryOperatorStream.set("array", output_array);
	return outputBinaryOperatorStream;
}
void BinaryOperatorStream::reset() {
_binaryoperatorstream->reset();
}
// END BinaryOperatorStream definitions

// START BpmHistogramDescriptors definitions
// check https://essentia.upf.edu/reference/std_BpmHistogramDescriptors.html
BpmHistogramDescriptors::BpmHistogramDescriptors() {
	_bpmhistogramdescriptors = AlgorithmFactory::create("BpmHistogramDescriptors");
}
BpmHistogramDescriptors::~BpmHistogramDescriptors() {
	if (_bpmhistogramdescriptors) delete _bpmhistogramdescriptors;
}
void BpmHistogramDescriptors::configure() {
	_bpmhistogramdescriptors->configure();
}
val BpmHistogramDescriptors::compute(std::vector<float>& input_bpmIntervals) {
	_bpmhistogramdescriptors->input("bpmIntervals").set(input_bpmIntervals);
	float output_firstPeakBPM;
	float output_firstPeakWeight;
	float output_firstPeakSpread;
	float output_secondPeakBPM;
	float output_secondPeakWeight;
	float output_secondPeakSpread;
	std::vector<float> output_histogram;
	_bpmhistogramdescriptors->output("firstPeakBPM").set(output_firstPeakBPM);
	_bpmhistogramdescriptors->output("firstPeakWeight").set(output_firstPeakWeight);
	_bpmhistogramdescriptors->output("firstPeakSpread").set(output_firstPeakSpread);
	_bpmhistogramdescriptors->output("secondPeakBPM").set(output_secondPeakBPM);
	_bpmhistogramdescriptors->output("secondPeakWeight").set(output_secondPeakWeight);
	_bpmhistogramdescriptors->output("secondPeakSpread").set(output_secondPeakSpread);
	_bpmhistogramdescriptors->output("histogram").set(output_histogram);
	_bpmhistogramdescriptors->compute();
	val outputBpmHistogramDescriptors(val::object());
	outputBpmHistogramDescriptors.set("firstPeakBPM", output_firstPeakBPM);
	outputBpmHistogramDescriptors.set("firstPeakWeight", output_firstPeakWeight);
	outputBpmHistogramDescriptors.set("firstPeakSpread", output_firstPeakSpread);
	outputBpmHistogramDescriptors.set("secondPeakBPM", output_secondPeakBPM);
	outputBpmHistogramDescriptors.set("secondPeakWeight", output_secondPeakWeight);
	outputBpmHistogramDescriptors.set("secondPeakSpread", output_secondPeakSpread);
	outputBpmHistogramDescriptors.set("histogram", output_histogram);
	return outputBpmHistogramDescriptors;
}
void BpmHistogramDescriptors::reset() {
_bpmhistogramdescriptors->reset();
}
// END BpmHistogramDescriptors definitions

// START BpmRubato definitions
// check https://essentia.upf.edu/reference/std_BpmRubato.html
BpmRubato::BpmRubato(const float longRegionsPruningTime, const float shortRegionsMergingTime, const float tolerance) {
	_bpmrubato = AlgorithmFactory::create("BpmRubato", "longRegionsPruningTime", longRegionsPruningTime, "shortRegionsMergingTime", shortRegionsMergingTime, "tolerance", tolerance);
}
BpmRubato::~BpmRubato() {
	if (_bpmrubato) delete _bpmrubato;
}
void BpmRubato::configure(const float longRegionsPruningTime, const float shortRegionsMergingTime, const float tolerance) {
	_bpmrubato->configure("longRegionsPruningTime", longRegionsPruningTime, "shortRegionsMergingTime", shortRegionsMergingTime, "tolerance", tolerance);
}
val BpmRubato::compute(std::vector<float>& input_beats) {
	_bpmrubato->input("beats").set(input_beats);
	std::vector<float> output_rubatoStart;
	std::vector<float> output_rubatoStop;
	int output_rubatoNumber;
	_bpmrubato->output("rubatoStart").set(output_rubatoStart);
	_bpmrubato->output("rubatoStop").set(output_rubatoStop);
	_bpmrubato->output("rubatoNumber").set(output_rubatoNumber);
	_bpmrubato->compute();
	val outputBpmRubato(val::object());
	outputBpmRubato.set("rubatoStart", output_rubatoStart);
	outputBpmRubato.set("rubatoStop", output_rubatoStop);
	outputBpmRubato.set("rubatoNumber", output_rubatoNumber);
	return outputBpmRubato;
}
void BpmRubato::reset() {
_bpmrubato->reset();
}
// END BpmRubato definitions

// START CentralMoments definitions
// check https://essentia.upf.edu/reference/std_CentralMoments.html
CentralMoments::CentralMoments(const std::string& mode, const float range) {
	_centralmoments = AlgorithmFactory::create("CentralMoments", "mode", mode, "range", range);
}
CentralMoments::~CentralMoments() {
	if (_centralmoments) delete _centralmoments;
}
void CentralMoments::configure(const std::string& mode, const float range) {
	_centralmoments->configure("mode", mode, "range", range);
}
val CentralMoments::compute(std::vector<float>& input_array) {
	_centralmoments->input("array").set(input_array);
	std::vector<float> output_centralMoments;
	_centralmoments->output("centralMoments").set(output_centralMoments);
	_centralmoments->compute();
	val outputCentralMoments(val::object());
	outputCentralMoments.set("centralMoments", output_centralMoments);
	return outputCentralMoments;
}
void CentralMoments::reset() {
_centralmoments->reset();
}
// END CentralMoments definitions

// START Centroid definitions
// check https://essentia.upf.edu/reference/std_Centroid.html
Centroid::Centroid(const float range) {
	_centroid = AlgorithmFactory::create("Centroid", "range", range);
}
Centroid::~Centroid() {
	if (_centroid) delete _centroid;
}
void Centroid::configure(const float range) {
	_centroid->configure("range", range);
}
val Centroid::compute(std::vector<float>& input_array) {
	_centroid->input("array").set(input_array);
	float output_centroid;
	_centroid->output("centroid").set(output_centroid);
	_centroid->compute();
	val outputCentroid(val::object());
	outputCentroid.set("centroid", output_centroid);
	return outputCentroid;
}
void Centroid::reset() {
_centroid->reset();
}
// END Centroid definitions

// START ChordsDescriptors definitions
// check https://essentia.upf.edu/reference/std_ChordsDescriptors.html
ChordsDescriptors::ChordsDescriptors() {
	_chordsdescriptors = AlgorithmFactory::create("ChordsDescriptors");
}
ChordsDescriptors::~ChordsDescriptors() {
	if (_chordsdescriptors) delete _chordsdescriptors;
}
void ChordsDescriptors::configure() {
	_chordsdescriptors->configure();
}
val ChordsDescriptors::compute(std::vector<std::string> input_chords, std::string input_key, std::string input_scale) {
	_chordsdescriptors->input("chords").set(input_chords);
	_chordsdescriptors->input("key").set(input_key);
	_chordsdescriptors->input("scale").set(input_scale);
	std::vector<float> output_chordsHistogram;
	float output_chordsNumberRate;
	float output_chordsChangesRate;
	std::string output_chordsKey;
	std::string output_chordsScale;
	_chordsdescriptors->output("chordsHistogram").set(output_chordsHistogram);
	_chordsdescriptors->output("chordsNumberRate").set(output_chordsNumberRate);
	_chordsdescriptors->output("chordsChangesRate").set(output_chordsChangesRate);
	_chordsdescriptors->output("chordsKey").set(output_chordsKey);
	_chordsdescriptors->output("chordsScale").set(output_chordsScale);
	_chordsdescriptors->compute();
	val outputChordsDescriptors(val::object());
	outputChordsDescriptors.set("chordsHistogram", output_chordsHistogram);
	outputChordsDescriptors.set("chordsNumberRate", output_chordsNumberRate);
	outputChordsDescriptors.set("chordsChangesRate", output_chordsChangesRate);
	outputChordsDescriptors.set("chordsKey", output_chordsKey);
	outputChordsDescriptors.set("chordsScale", output_chordsScale);
	return outputChordsDescriptors;
}
void ChordsDescriptors::reset() {
_chordsdescriptors->reset();
}
// END ChordsDescriptors definitions

// START ChordsDetection definitions
// check https://essentia.upf.edu/reference/std_ChordsDetection.html
ChordsDetection::ChordsDetection(const int hopSize, const float sampleRate, const float windowSize) {
	_chordsdetection = AlgorithmFactory::create("ChordsDetection", "hopSize", hopSize, "sampleRate", sampleRate, "windowSize", windowSize);
}
ChordsDetection::~ChordsDetection() {
	if (_chordsdetection) delete _chordsdetection;
}
void ChordsDetection::configure(const int hopSize, const float sampleRate, const float windowSize) {
	_chordsdetection->configure("hopSize", hopSize, "sampleRate", sampleRate, "windowSize", windowSize);
}
val ChordsDetection::compute(std::vector<std::vector<float> >& input_pcp) {
	_chordsdetection->input("pcp").set(input_pcp);
	std::vector<std::string> output_chords;
	std::vector<float> output_strength;
	_chordsdetection->output("chords").set(output_chords);
	_chordsdetection->output("strength").set(output_strength);
	_chordsdetection->compute();
	val outputChordsDetection(val::object());
	outputChordsDetection.set("chords", output_chords);
	outputChordsDetection.set("strength", output_strength);
	return outputChordsDetection;
}
void ChordsDetection::reset() {
_chordsdetection->reset();
}
// END ChordsDetection definitions

// START ChordsDetectionBeats definitions
// check https://essentia.upf.edu/reference/std_ChordsDetectionBeats.html
ChordsDetectionBeats::ChordsDetectionBeats(const std::string& chromaPick, const int hopSize, const float sampleRate) {
	_chordsdetectionbeats = AlgorithmFactory::create("ChordsDetectionBeats", "chromaPick", chromaPick, "hopSize", hopSize, "sampleRate", sampleRate);
}
ChordsDetectionBeats::~ChordsDetectionBeats() {
	if (_chordsdetectionbeats) delete _chordsdetectionbeats;
}
void ChordsDetectionBeats::configure(const std::string& chromaPick, const int hopSize, const float sampleRate) {
	_chordsdetectionbeats->configure("chromaPick", chromaPick, "hopSize", hopSize, "sampleRate", sampleRate);
}
val ChordsDetectionBeats::compute(std::vector<std::vector<float> >& input_pcp, std::vector<float>& input_ticks) {
	_chordsdetectionbeats->input("pcp").set(input_pcp);
	_chordsdetectionbeats->input("ticks").set(input_ticks);
	std::vector<std::string> output_chords;
	std::vector<float> output_strength;
	_chordsdetectionbeats->output("chords").set(output_chords);
	_chordsdetectionbeats->output("strength").set(output_strength);
	_chordsdetectionbeats->compute();
	val outputChordsDetectionBeats(val::object());
	outputChordsDetectionBeats.set("chords", output_chords);
	outputChordsDetectionBeats.set("strength", output_strength);
	return outputChordsDetectionBeats;
}
void ChordsDetectionBeats::reset() {
_chordsdetectionbeats->reset();
}
// END ChordsDetectionBeats definitions

// START ChromaCrossSimilarity definitions
// check https://essentia.upf.edu/reference/std_ChromaCrossSimilarity.html
ChromaCrossSimilarity::ChromaCrossSimilarity(const float binarizePercentile, const int frameStackSize, const int frameStackStride, const int noti, const bool oti, const bool otiBinary, const bool streaming) {
	_chromacrosssimilarity = AlgorithmFactory::create("ChromaCrossSimilarity", "binarizePercentile", binarizePercentile, "frameStackSize", frameStackSize, "frameStackStride", frameStackStride, "noti", noti, "oti", oti, "otiBinary", otiBinary, "streaming", streaming);
}
ChromaCrossSimilarity::~ChromaCrossSimilarity() {
	if (_chromacrosssimilarity) delete _chromacrosssimilarity;
}
void ChromaCrossSimilarity::configure(const float binarizePercentile, const int frameStackSize, const int frameStackStride, const int noti, const bool oti, const bool otiBinary, const bool streaming) {
	_chromacrosssimilarity->configure("binarizePercentile", binarizePercentile, "frameStackSize", frameStackSize, "frameStackStride", frameStackStride, "noti", noti, "oti", oti, "otiBinary", otiBinary, "streaming", streaming);
}
val ChromaCrossSimilarity::compute(std::vector<std::vector<float> >& input_queryFeature, std::vector<std::vector<float> >& input_referenceFeature) {
	_chromacrosssimilarity->input("queryFeature").set(input_queryFeature);
	_chromacrosssimilarity->input("referenceFeature").set(input_referenceFeature);
	std::vector<std::vector<float> > output_csm;
	_chromacrosssimilarity->output("csm").set(output_csm);
	_chromacrosssimilarity->compute();
	val outputChromaCrossSimilarity(val::object());
	outputChromaCrossSimilarity.set("csm", output_csm);
	return outputChromaCrossSimilarity;
}
void ChromaCrossSimilarity::reset() {
_chromacrosssimilarity->reset();
}
// END ChromaCrossSimilarity definitions

// START Chromagram definitions
// check https://essentia.upf.edu/reference/std_Chromagram.html
Chromagram::Chromagram(const int binsPerOctave, const float minFrequency, const int minimumKernelSize, const std::string& normalizeType, const int numberBins, const float sampleRate, const float scale, const float threshold, const std::string& windowType, const bool zeroPhase) {
	_chromagram = AlgorithmFactory::create("Chromagram", "binsPerOctave", binsPerOctave, "minFrequency", minFrequency, "minimumKernelSize", minimumKernelSize, "normalizeType", normalizeType, "numberBins", numberBins, "sampleRate", sampleRate, "scale", scale, "threshold", threshold, "windowType", windowType, "zeroPhase", zeroPhase);
}
Chromagram::~Chromagram() {
	if (_chromagram) delete _chromagram;
}
void Chromagram::configure(const int binsPerOctave, const float minFrequency, const int minimumKernelSize, const std::string& normalizeType, const int numberBins, const float sampleRate, const float scale, const float threshold, const std::string& windowType, const bool zeroPhase) {
	_chromagram->configure("binsPerOctave", binsPerOctave, "minFrequency", minFrequency, "minimumKernelSize", minimumKernelSize, "normalizeType", normalizeType, "numberBins", numberBins, "sampleRate", sampleRate, "scale", scale, "threshold", threshold, "windowType", windowType, "zeroPhase", zeroPhase);
}
val Chromagram::compute(std::vector<float>& input_frame) {
	_chromagram->input("frame").set(input_frame);
	std::vector<float> output_chromagram;
	_chromagram->output("chromagram").set(output_chromagram);
	_chromagram->compute();
	val outputChromagram(val::object());
	outputChromagram.set("chromagram", output_chromagram);
	return outputChromagram;
}
void Chromagram::reset() {
_chromagram->reset();
}
// END Chromagram definitions

// START ClickDetector definitions
// check https://essentia.upf.edu/reference/std_ClickDetector.html
ClickDetector::ClickDetector(const float detectionThreshold, const int frameSize, const int hopSize, const int order, const int powerEstimationThreshold, const float sampleRate, const int silenceThreshold) {
	_clickdetector = AlgorithmFactory::create("ClickDetector", "detectionThreshold", detectionThreshold, "frameSize", frameSize, "hopSize", hopSize, "order", order, "powerEstimationThreshold", powerEstimationThreshold, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold);
}
ClickDetector::~ClickDetector() {
	if (_clickdetector) delete _clickdetector;
}
void ClickDetector::configure(const float detectionThreshold, const int frameSize, const int hopSize, const int order, const int powerEstimationThreshold, const float sampleRate, const int silenceThreshold) {
	_clickdetector->configure("detectionThreshold", detectionThreshold, "frameSize", frameSize, "hopSize", hopSize, "order", order, "powerEstimationThreshold", powerEstimationThreshold, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold);
}
val ClickDetector::compute(std::vector<float>& input_frame) {
	_clickdetector->input("frame").set(input_frame);
	std::vector<float> output_starts;
	std::vector<float> output_ends;
	_clickdetector->output("starts").set(output_starts);
	_clickdetector->output("ends").set(output_ends);
	_clickdetector->compute();
	val outputClickDetector(val::object());
	outputClickDetector.set("starts", output_starts);
	outputClickDetector.set("ends", output_ends);
	return outputClickDetector;
}
void ClickDetector::reset() {
_clickdetector->reset();
}
// END ClickDetector definitions

// START Clipper definitions
// check https://essentia.upf.edu/reference/std_Clipper.html
Clipper::Clipper(const float max, const float min) {
	_clipper = AlgorithmFactory::create("Clipper", "max", max, "min", min);
}
Clipper::~Clipper() {
	if (_clipper) delete _clipper;
}
void Clipper::configure(const float max, const float min) {
	_clipper->configure("max", max, "min", min);
}
val Clipper::compute(std::vector<float>& input_signal) {
	_clipper->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_clipper->output("signal").set(output_signal);
	_clipper->compute();
	val outputClipper(val::object());
	outputClipper.set("signal", output_signal);
	return outputClipper;
}
void Clipper::reset() {
_clipper->reset();
}
// END Clipper definitions

// START CoverSongSimilarity definitions
// check https://essentia.upf.edu/reference/std_CoverSongSimilarity.html
CoverSongSimilarity::CoverSongSimilarity(const std::string& alignmentType, const float disExtension, const float disOnset, const std::string& distanceType) {
	_coversongsimilarity = AlgorithmFactory::create("CoverSongSimilarity", "alignmentType", alignmentType, "disExtension", disExtension, "disOnset", disOnset, "distanceType", distanceType);
}
CoverSongSimilarity::~CoverSongSimilarity() {
	if (_coversongsimilarity) delete _coversongsimilarity;
}
void CoverSongSimilarity::configure(const std::string& alignmentType, const float disExtension, const float disOnset, const std::string& distanceType) {
	_coversongsimilarity->configure("alignmentType", alignmentType, "disExtension", disExtension, "disOnset", disOnset, "distanceType", distanceType);
}
val CoverSongSimilarity::compute(std::vector<std::vector<float> >& input_inputArray) {
	_coversongsimilarity->input("inputArray").set(input_inputArray);
	std::vector<std::vector<float> > output_scoreMatrix;
	float output_distance;
	_coversongsimilarity->output("scoreMatrix").set(output_scoreMatrix);
	_coversongsimilarity->output("distance").set(output_distance);
	_coversongsimilarity->compute();
	val outputCoverSongSimilarity(val::object());
	outputCoverSongSimilarity.set("scoreMatrix", output_scoreMatrix);
	outputCoverSongSimilarity.set("distance", output_distance);
	return outputCoverSongSimilarity;
}
void CoverSongSimilarity::reset() {
_coversongsimilarity->reset();
}
// END CoverSongSimilarity definitions

// START Crest definitions
// check https://essentia.upf.edu/reference/std_Crest.html
Crest::Crest() {
	_crest = AlgorithmFactory::create("Crest");
}
Crest::~Crest() {
	if (_crest) delete _crest;
}
void Crest::configure() {
	_crest->configure();
}
val Crest::compute(std::vector<float>& input_array) {
	_crest->input("array").set(input_array);
	float output_crest;
	_crest->output("crest").set(output_crest);
	_crest->compute();
	val outputCrest(val::object());
	outputCrest.set("crest", output_crest);
	return outputCrest;
}
void Crest::reset() {
_crest->reset();
}
// END Crest definitions

// START CrossCorrelation definitions
// check https://essentia.upf.edu/reference/std_CrossCorrelation.html
CrossCorrelation::CrossCorrelation(const int maxLag, const int minLag) {
	_crosscorrelation = AlgorithmFactory::create("CrossCorrelation", "maxLag", maxLag, "minLag", minLag);
}
CrossCorrelation::~CrossCorrelation() {
	if (_crosscorrelation) delete _crosscorrelation;
}
void CrossCorrelation::configure(const int maxLag, const int minLag) {
	_crosscorrelation->configure("maxLag", maxLag, "minLag", minLag);
}
val CrossCorrelation::compute(std::vector<float>& input_arrayX, std::vector<float>& input_arrayY) {
	_crosscorrelation->input("arrayX").set(input_arrayX);
	_crosscorrelation->input("arrayY").set(input_arrayY);
	std::vector<float> output_crossCorrelation;
	_crosscorrelation->output("crossCorrelation").set(output_crossCorrelation);
	_crosscorrelation->compute();
	val outputCrossCorrelation(val::object());
	outputCrossCorrelation.set("crossCorrelation", output_crossCorrelation);
	return outputCrossCorrelation;
}
void CrossCorrelation::reset() {
_crosscorrelation->reset();
}
// END CrossCorrelation definitions

// START CrossSimilarityMatrix definitions
// check https://essentia.upf.edu/reference/std_CrossSimilarityMatrix.html
CrossSimilarityMatrix::CrossSimilarityMatrix(const bool binarize, const float binarizePercentile, const int frameStackSize, const int frameStackStride) {
	_crosssimilaritymatrix = AlgorithmFactory::create("CrossSimilarityMatrix", "binarize", binarize, "binarizePercentile", binarizePercentile, "frameStackSize", frameStackSize, "frameStackStride", frameStackStride);
}
CrossSimilarityMatrix::~CrossSimilarityMatrix() {
	if (_crosssimilaritymatrix) delete _crosssimilaritymatrix;
}
void CrossSimilarityMatrix::configure(const bool binarize, const float binarizePercentile, const int frameStackSize, const int frameStackStride) {
	_crosssimilaritymatrix->configure("binarize", binarize, "binarizePercentile", binarizePercentile, "frameStackSize", frameStackSize, "frameStackStride", frameStackStride);
}
val CrossSimilarityMatrix::compute(std::vector<std::vector<float> >& input_queryFeature, std::vector<std::vector<float> >& input_referenceFeature) {
	_crosssimilaritymatrix->input("queryFeature").set(input_queryFeature);
	_crosssimilaritymatrix->input("referenceFeature").set(input_referenceFeature);
	std::vector<std::vector<float> > output_csm;
	_crosssimilaritymatrix->output("csm").set(output_csm);
	_crosssimilaritymatrix->compute();
	val outputCrossSimilarityMatrix(val::object());
	outputCrossSimilarityMatrix.set("csm", output_csm);
	return outputCrossSimilarityMatrix;
}
void CrossSimilarityMatrix::reset() {
_crosssimilaritymatrix->reset();
}
// END CrossSimilarityMatrix definitions

// START CubicSpline definitions
// check https://essentia.upf.edu/reference/std_CubicSpline.html
CubicSpline::CubicSpline(const int leftBoundaryFlag, const float leftBoundaryValue, const int rightBoundaryFlag, const float rightBoundaryValue, const std::vector<float>& xPoints, const std::vector<float>& yPoints) {
	_cubicspline = AlgorithmFactory::create("CubicSpline", "leftBoundaryFlag", leftBoundaryFlag, "leftBoundaryValue", leftBoundaryValue, "rightBoundaryFlag", rightBoundaryFlag, "rightBoundaryValue", rightBoundaryValue, "xPoints", xPoints, "yPoints", yPoints);
}
CubicSpline::~CubicSpline() {
	if (_cubicspline) delete _cubicspline;
}
void CubicSpline::configure(const int leftBoundaryFlag, const float leftBoundaryValue, const int rightBoundaryFlag, const float rightBoundaryValue, const std::vector<float>& xPoints, const std::vector<float>& yPoints) {
	_cubicspline->configure("leftBoundaryFlag", leftBoundaryFlag, "leftBoundaryValue", leftBoundaryValue, "rightBoundaryFlag", rightBoundaryFlag, "rightBoundaryValue", rightBoundaryValue, "xPoints", xPoints, "yPoints", yPoints);
}
val CubicSpline::compute(float input_x) {
	_cubicspline->input("x").set(input_x);
	float output_y;
	float output_dy;
	float output_ddy;
	_cubicspline->output("y").set(output_y);
	_cubicspline->output("dy").set(output_dy);
	_cubicspline->output("ddy").set(output_ddy);
	_cubicspline->compute();
	val outputCubicSpline(val::object());
	outputCubicSpline.set("y", output_y);
	outputCubicSpline.set("dy", output_dy);
	outputCubicSpline.set("ddy", output_ddy);
	return outputCubicSpline;
}
void CubicSpline::reset() {
_cubicspline->reset();
}
// END CubicSpline definitions

// START DCRemoval definitions
// check https://essentia.upf.edu/reference/std_DCRemoval.html
DCRemoval::DCRemoval(const float cutoffFrequency, const float sampleRate) {
	_dcremoval = AlgorithmFactory::create("DCRemoval", "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
}
DCRemoval::~DCRemoval() {
	if (_dcremoval) delete _dcremoval;
}
void DCRemoval::configure(const float cutoffFrequency, const float sampleRate) {
	_dcremoval->configure("cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
}
val DCRemoval::compute(std::vector<float>& input_signal) {
	_dcremoval->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_dcremoval->output("signal").set(output_signal);
	_dcremoval->compute();
	val outputDCRemoval(val::object());
	outputDCRemoval.set("signal", output_signal);
	return outputDCRemoval;
}
void DCRemoval::reset() {
_dcremoval->reset();
}
// END DCRemoval definitions

// START DCT definitions
// check https://essentia.upf.edu/reference/std_DCT.html
DCT::DCT(const int dctType, const int inputSize, const int liftering, const int outputSize) {
	_dct = AlgorithmFactory::create("DCT", "dctType", dctType, "inputSize", inputSize, "liftering", liftering, "outputSize", outputSize);
}
DCT::~DCT() {
	if (_dct) delete _dct;
}
void DCT::configure(const int dctType, const int inputSize, const int liftering, const int outputSize) {
	_dct->configure("dctType", dctType, "inputSize", inputSize, "liftering", liftering, "outputSize", outputSize);
}
val DCT::compute(std::vector<float>& input_array) {
	_dct->input("array").set(input_array);
	std::vector<float> output_dct;
	_dct->output("dct").set(output_dct);
	_dct->compute();
	val outputDCT(val::object());
	outputDCT.set("dct", output_dct);
	return outputDCT;
}
void DCT::reset() {
_dct->reset();
}
// END DCT definitions

// START Danceability definitions
// check https://essentia.upf.edu/reference/std_Danceability.html
Danceability::Danceability(const float maxTau, const float minTau, const float sampleRate, const float tauMultiplier) {
	_danceability = AlgorithmFactory::create("Danceability", "maxTau", maxTau, "minTau", minTau, "sampleRate", sampleRate, "tauMultiplier", tauMultiplier);
}
Danceability::~Danceability() {
	if (_danceability) delete _danceability;
}
void Danceability::configure(const float maxTau, const float minTau, const float sampleRate, const float tauMultiplier) {
	_danceability->configure("maxTau", maxTau, "minTau", minTau, "sampleRate", sampleRate, "tauMultiplier", tauMultiplier);
}
val Danceability::compute(std::vector<float>& input_signal) {
	_danceability->input("signal").set(input_signal);
	float output_danceability;
	std::vector<float> output_dfa;
	_danceability->output("danceability").set(output_danceability);
	_danceability->output("dfa").set(output_dfa);
	_danceability->compute();
	val outputDanceability(val::object());
	outputDanceability.set("danceability", output_danceability);
	outputDanceability.set("dfa", output_dfa);
	return outputDanceability;
}
void Danceability::reset() {
_danceability->reset();
}
// END Danceability definitions

// START Decrease definitions
// check https://essentia.upf.edu/reference/std_Decrease.html
Decrease::Decrease(const float range) {
	_decrease = AlgorithmFactory::create("Decrease", "range", range);
}
Decrease::~Decrease() {
	if (_decrease) delete _decrease;
}
void Decrease::configure(const float range) {
	_decrease->configure("range", range);
}
val Decrease::compute(std::vector<float>& input_array) {
	_decrease->input("array").set(input_array);
	float output_decrease;
	_decrease->output("decrease").set(output_decrease);
	_decrease->compute();
	val outputDecrease(val::object());
	outputDecrease.set("decrease", output_decrease);
	return outputDecrease;
}
void Decrease::reset() {
_decrease->reset();
}
// END Decrease definitions

// START Derivative definitions
// check https://essentia.upf.edu/reference/std_Derivative.html
Derivative::Derivative() {
	_derivative = AlgorithmFactory::create("Derivative");
}
Derivative::~Derivative() {
	if (_derivative) delete _derivative;
}
void Derivative::configure() {
	_derivative->configure();
}
val Derivative::compute(std::vector<float>& input_signal) {
	_derivative->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_derivative->output("signal").set(output_signal);
	_derivative->compute();
	val outputDerivative(val::object());
	outputDerivative.set("signal", output_signal);
	return outputDerivative;
}
void Derivative::reset() {
_derivative->reset();
}
// END Derivative definitions

// START DerivativeSFX definitions
// check https://essentia.upf.edu/reference/std_DerivativeSFX.html
DerivativeSFX::DerivativeSFX() {
	_derivativesfx = AlgorithmFactory::create("DerivativeSFX");
}
DerivativeSFX::~DerivativeSFX() {
	if (_derivativesfx) delete _derivativesfx;
}
void DerivativeSFX::configure() {
	_derivativesfx->configure();
}
val DerivativeSFX::compute(std::vector<float>& input_envelope) {
	_derivativesfx->input("envelope").set(input_envelope);
	float output_derAvAfterMax;
	float output_maxDerBeforeMax;
	_derivativesfx->output("derAvAfterMax").set(output_derAvAfterMax);
	_derivativesfx->output("maxDerBeforeMax").set(output_maxDerBeforeMax);
	_derivativesfx->compute();
	val outputDerivativeSFX(val::object());
	outputDerivativeSFX.set("derAvAfterMax", output_derAvAfterMax);
	outputDerivativeSFX.set("maxDerBeforeMax", output_maxDerBeforeMax);
	return outputDerivativeSFX;
}
void DerivativeSFX::reset() {
_derivativesfx->reset();
}
// END DerivativeSFX definitions

// START DiscontinuityDetector definitions
// check https://essentia.upf.edu/reference/std_DiscontinuityDetector.html
DiscontinuityDetector::DiscontinuityDetector(const float detectionThreshold, const float energyThreshold, const int frameSize, const int hopSize, const int kernelSize, const int order, const int silenceThreshold, const int subFrameSize) {
	_discontinuitydetector = AlgorithmFactory::create("DiscontinuityDetector", "detectionThreshold", detectionThreshold, "energyThreshold", energyThreshold, "frameSize", frameSize, "hopSize", hopSize, "kernelSize", kernelSize, "order", order, "silenceThreshold", silenceThreshold, "subFrameSize", subFrameSize);
}
DiscontinuityDetector::~DiscontinuityDetector() {
	if (_discontinuitydetector) delete _discontinuitydetector;
}
void DiscontinuityDetector::configure(const float detectionThreshold, const float energyThreshold, const int frameSize, const int hopSize, const int kernelSize, const int order, const int silenceThreshold, const int subFrameSize) {
	_discontinuitydetector->configure("detectionThreshold", detectionThreshold, "energyThreshold", energyThreshold, "frameSize", frameSize, "hopSize", hopSize, "kernelSize", kernelSize, "order", order, "silenceThreshold", silenceThreshold, "subFrameSize", subFrameSize);
}
val DiscontinuityDetector::compute(std::vector<float>& input_frame) {
	_discontinuitydetector->input("frame").set(input_frame);
	std::vector<float> output_discontinuityLocations;
	std::vector<float> output_discontinuityAmplitudes;
	_discontinuitydetector->output("discontinuityLocations").set(output_discontinuityLocations);
	_discontinuitydetector->output("discontinuityAmplitudes").set(output_discontinuityAmplitudes);
	_discontinuitydetector->compute();
	val outputDiscontinuityDetector(val::object());
	outputDiscontinuityDetector.set("discontinuityLocations", output_discontinuityLocations);
	outputDiscontinuityDetector.set("discontinuityAmplitudes", output_discontinuityAmplitudes);
	return outputDiscontinuityDetector;
}
void DiscontinuityDetector::reset() {
_discontinuitydetector->reset();
}
// END DiscontinuityDetector definitions

// START Dissonance definitions
// check https://essentia.upf.edu/reference/std_Dissonance.html
Dissonance::Dissonance() {
	_dissonance = AlgorithmFactory::create("Dissonance");
}
Dissonance::~Dissonance() {
	if (_dissonance) delete _dissonance;
}
void Dissonance::configure() {
	_dissonance->configure();
}
val Dissonance::compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
	_dissonance->input("frequencies").set(input_frequencies);
	_dissonance->input("magnitudes").set(input_magnitudes);
	float output_dissonance;
	_dissonance->output("dissonance").set(output_dissonance);
	_dissonance->compute();
	val outputDissonance(val::object());
	outputDissonance.set("dissonance", output_dissonance);
	return outputDissonance;
}
void Dissonance::reset() {
_dissonance->reset();
}
// END Dissonance definitions

// START DistributionShape definitions
// check https://essentia.upf.edu/reference/std_DistributionShape.html
DistributionShape::DistributionShape() {
	_distributionshape = AlgorithmFactory::create("DistributionShape");
}
DistributionShape::~DistributionShape() {
	if (_distributionshape) delete _distributionshape;
}
void DistributionShape::configure() {
	_distributionshape->configure();
}
val DistributionShape::compute(std::vector<float>& input_centralMoments) {
	_distributionshape->input("centralMoments").set(input_centralMoments);
	float output_spread;
	float output_skewness;
	float output_kurtosis;
	_distributionshape->output("spread").set(output_spread);
	_distributionshape->output("skewness").set(output_skewness);
	_distributionshape->output("kurtosis").set(output_kurtosis);
	_distributionshape->compute();
	val outputDistributionShape(val::object());
	outputDistributionShape.set("spread", output_spread);
	outputDistributionShape.set("skewness", output_skewness);
	outputDistributionShape.set("kurtosis", output_kurtosis);
	return outputDistributionShape;
}
void DistributionShape::reset() {
_distributionshape->reset();
}
// END DistributionShape definitions

// START Duration definitions
// check https://essentia.upf.edu/reference/std_Duration.html
Duration::Duration(const float sampleRate) {
	_duration = AlgorithmFactory::create("Duration", "sampleRate", sampleRate);
}
Duration::~Duration() {
	if (_duration) delete _duration;
}
void Duration::configure(const float sampleRate) {
	_duration->configure("sampleRate", sampleRate);
}
val Duration::compute(std::vector<float>& input_signal) {
	_duration->input("signal").set(input_signal);
	float output_duration;
	_duration->output("duration").set(output_duration);
	_duration->compute();
	val outputDuration(val::object());
	outputDuration.set("duration", output_duration);
	return outputDuration;
}
void Duration::reset() {
_duration->reset();
}
// END Duration definitions

// START DynamicComplexity definitions
// check https://essentia.upf.edu/reference/std_DynamicComplexity.html
DynamicComplexity::DynamicComplexity(const float frameSize, const float sampleRate) {
	_dynamiccomplexity = AlgorithmFactory::create("DynamicComplexity", "frameSize", frameSize, "sampleRate", sampleRate);
}
DynamicComplexity::~DynamicComplexity() {
	if (_dynamiccomplexity) delete _dynamiccomplexity;
}
void DynamicComplexity::configure(const float frameSize, const float sampleRate) {
	_dynamiccomplexity->configure("frameSize", frameSize, "sampleRate", sampleRate);
}
val DynamicComplexity::compute(std::vector<float>& input_signal) {
	_dynamiccomplexity->input("signal").set(input_signal);
	float output_dynamicComplexity;
	float output_loudness;
	_dynamiccomplexity->output("dynamicComplexity").set(output_dynamicComplexity);
	_dynamiccomplexity->output("loudness").set(output_loudness);
	_dynamiccomplexity->compute();
	val outputDynamicComplexity(val::object());
	outputDynamicComplexity.set("dynamicComplexity", output_dynamicComplexity);
	outputDynamicComplexity.set("loudness", output_loudness);
	return outputDynamicComplexity;
}
void DynamicComplexity::reset() {
_dynamiccomplexity->reset();
}
// END DynamicComplexity definitions

// START ERBBands definitions
// check https://essentia.upf.edu/reference/std_ERBBands.html
ERBBands::ERBBands(const float highFrequencyBound, const int inputSize, const float lowFrequencyBound, const int numberBands, const float sampleRate, const std::string& type, const float width) {
	_erbbands = AlgorithmFactory::create("ERBBands", "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "lowFrequencyBound", lowFrequencyBound, "numberBands", numberBands, "sampleRate", sampleRate, "type", type, "width", width);
}
ERBBands::~ERBBands() {
	if (_erbbands) delete _erbbands;
}
void ERBBands::configure(const float highFrequencyBound, const int inputSize, const float lowFrequencyBound, const int numberBands, const float sampleRate, const std::string& type, const float width) {
	_erbbands->configure("highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "lowFrequencyBound", lowFrequencyBound, "numberBands", numberBands, "sampleRate", sampleRate, "type", type, "width", width);
}
val ERBBands::compute(std::vector<float>& input_spectrum) {
	_erbbands->input("spectrum").set(input_spectrum);
	std::vector<float> output_bands;
	_erbbands->output("bands").set(output_bands);
	_erbbands->compute();
	val outputERBBands(val::object());
	outputERBBands.set("bands", output_bands);
	return outputERBBands;
}
void ERBBands::reset() {
_erbbands->reset();
}
// END ERBBands definitions

// START EffectiveDuration definitions
// check https://essentia.upf.edu/reference/std_EffectiveDuration.html
EffectiveDuration::EffectiveDuration(const float sampleRate, const float thresholdRatio) {
	_effectiveduration = AlgorithmFactory::create("EffectiveDuration", "sampleRate", sampleRate, "thresholdRatio", thresholdRatio);
}
EffectiveDuration::~EffectiveDuration() {
	if (_effectiveduration) delete _effectiveduration;
}
void EffectiveDuration::configure(const float sampleRate, const float thresholdRatio) {
	_effectiveduration->configure("sampleRate", sampleRate, "thresholdRatio", thresholdRatio);
}
val EffectiveDuration::compute(std::vector<float>& input_signal) {
	_effectiveduration->input("signal").set(input_signal);
	float output_effectiveDuration;
	_effectiveduration->output("effectiveDuration").set(output_effectiveDuration);
	_effectiveduration->compute();
	val outputEffectiveDuration(val::object());
	outputEffectiveDuration.set("effectiveDuration", output_effectiveDuration);
	return outputEffectiveDuration;
}
void EffectiveDuration::reset() {
_effectiveduration->reset();
}
// END EffectiveDuration definitions

// START Energy definitions
// check https://essentia.upf.edu/reference/std_Energy.html
Energy::Energy() {
	_energy = AlgorithmFactory::create("Energy");
}
Energy::~Energy() {
	if (_energy) delete _energy;
}
void Energy::configure() {
	_energy->configure();
}
val Energy::compute(std::vector<float>& input_array) {
	_energy->input("array").set(input_array);
	float output_energy;
	_energy->output("energy").set(output_energy);
	_energy->compute();
	val outputEnergy(val::object());
	outputEnergy.set("energy", output_energy);
	return outputEnergy;
}
void Energy::reset() {
_energy->reset();
}
// END Energy definitions

// START EnergyBand definitions
// check https://essentia.upf.edu/reference/std_EnergyBand.html
EnergyBand::EnergyBand(const float sampleRate, const float startCutoffFrequency, const float stopCutoffFrequency) {
	_energyband = AlgorithmFactory::create("EnergyBand", "sampleRate", sampleRate, "startCutoffFrequency", startCutoffFrequency, "stopCutoffFrequency", stopCutoffFrequency);
}
EnergyBand::~EnergyBand() {
	if (_energyband) delete _energyband;
}
void EnergyBand::configure(const float sampleRate, const float startCutoffFrequency, const float stopCutoffFrequency) {
	_energyband->configure("sampleRate", sampleRate, "startCutoffFrequency", startCutoffFrequency, "stopCutoffFrequency", stopCutoffFrequency);
}
val EnergyBand::compute(std::vector<float>& input_spectrum) {
	_energyband->input("spectrum").set(input_spectrum);
	float output_energyBand;
	_energyband->output("energyBand").set(output_energyBand);
	_energyband->compute();
	val outputEnergyBand(val::object());
	outputEnergyBand.set("energyBand", output_energyBand);
	return outputEnergyBand;
}
void EnergyBand::reset() {
_energyband->reset();
}
// END EnergyBand definitions

// START EnergyBandRatio definitions
// check https://essentia.upf.edu/reference/std_EnergyBandRatio.html
EnergyBandRatio::EnergyBandRatio(const float sampleRate, const float startFrequency, const float stopFrequency) {
	_energybandratio = AlgorithmFactory::create("EnergyBandRatio", "sampleRate", sampleRate, "startFrequency", startFrequency, "stopFrequency", stopFrequency);
}
EnergyBandRatio::~EnergyBandRatio() {
	if (_energybandratio) delete _energybandratio;
}
void EnergyBandRatio::configure(const float sampleRate, const float startFrequency, const float stopFrequency) {
	_energybandratio->configure("sampleRate", sampleRate, "startFrequency", startFrequency, "stopFrequency", stopFrequency);
}
val EnergyBandRatio::compute(std::vector<float>& input_spectrum) {
	_energybandratio->input("spectrum").set(input_spectrum);
	float output_energyBandRatio;
	_energybandratio->output("energyBandRatio").set(output_energyBandRatio);
	_energybandratio->compute();
	val outputEnergyBandRatio(val::object());
	outputEnergyBandRatio.set("energyBandRatio", output_energyBandRatio);
	return outputEnergyBandRatio;
}
void EnergyBandRatio::reset() {
_energybandratio->reset();
}
// END EnergyBandRatio definitions

// START Entropy definitions
// check https://essentia.upf.edu/reference/std_Entropy.html
Entropy::Entropy() {
	_entropy = AlgorithmFactory::create("Entropy");
}
Entropy::~Entropy() {
	if (_entropy) delete _entropy;
}
void Entropy::configure() {
	_entropy->configure();
}
val Entropy::compute(std::vector<float>& input_array) {
	_entropy->input("array").set(input_array);
	float output_entropy;
	_entropy->output("entropy").set(output_entropy);
	_entropy->compute();
	val outputEntropy(val::object());
	outputEntropy.set("entropy", output_entropy);
	return outputEntropy;
}
void Entropy::reset() {
_entropy->reset();
}
// END Entropy definitions

// START Envelope definitions
// check https://essentia.upf.edu/reference/std_Envelope.html
Envelope::Envelope(const bool applyRectification, const float attackTime, const float releaseTime, const float sampleRate) {
	_envelope = AlgorithmFactory::create("Envelope", "applyRectification", applyRectification, "attackTime", attackTime, "releaseTime", releaseTime, "sampleRate", sampleRate);
}
Envelope::~Envelope() {
	if (_envelope) delete _envelope;
}
void Envelope::configure(const bool applyRectification, const float attackTime, const float releaseTime, const float sampleRate) {
	_envelope->configure("applyRectification", applyRectification, "attackTime", attackTime, "releaseTime", releaseTime, "sampleRate", sampleRate);
}
val Envelope::compute(std::vector<float>& input_signal) {
	_envelope->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_envelope->output("signal").set(output_signal);
	_envelope->compute();
	val outputEnvelope(val::object());
	outputEnvelope.set("signal", output_signal);
	return outputEnvelope;
}
void Envelope::reset() {
_envelope->reset();
}
// END Envelope definitions

// START EqualLoudness definitions
// check https://essentia.upf.edu/reference/std_EqualLoudness.html
EqualLoudness::EqualLoudness(const float sampleRate) {
	_equalloudness = AlgorithmFactory::create("EqualLoudness", "sampleRate", sampleRate);
}
EqualLoudness::~EqualLoudness() {
	if (_equalloudness) delete _equalloudness;
}
void EqualLoudness::configure(const float sampleRate) {
	_equalloudness->configure("sampleRate", sampleRate);
}
val EqualLoudness::compute(std::vector<float>& input_signal) {
	_equalloudness->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_equalloudness->output("signal").set(output_signal);
	_equalloudness->compute();
	val outputEqualLoudness(val::object());
	outputEqualLoudness.set("signal", output_signal);
	return outputEqualLoudness;
}
void EqualLoudness::reset() {
_equalloudness->reset();
}
// END EqualLoudness definitions

// START Flatness definitions
// check https://essentia.upf.edu/reference/std_Flatness.html
Flatness::Flatness() {
	_flatness = AlgorithmFactory::create("Flatness");
}
Flatness::~Flatness() {
	if (_flatness) delete _flatness;
}
void Flatness::configure() {
	_flatness->configure();
}
val Flatness::compute(std::vector<float>& input_array) {
	_flatness->input("array").set(input_array);
	float output_flatness;
	_flatness->output("flatness").set(output_flatness);
	_flatness->compute();
	val outputFlatness(val::object());
	outputFlatness.set("flatness", output_flatness);
	return outputFlatness;
}
void Flatness::reset() {
_flatness->reset();
}
// END Flatness definitions

// START FlatnessDB definitions
// check https://essentia.upf.edu/reference/std_FlatnessDB.html
FlatnessDB::FlatnessDB() {
	_flatnessdb = AlgorithmFactory::create("FlatnessDB");
}
FlatnessDB::~FlatnessDB() {
	if (_flatnessdb) delete _flatnessdb;
}
void FlatnessDB::configure() {
	_flatnessdb->configure();
}
val FlatnessDB::compute(std::vector<float>& input_array) {
	_flatnessdb->input("array").set(input_array);
	float output_flatnessDB;
	_flatnessdb->output("flatnessDB").set(output_flatnessDB);
	_flatnessdb->compute();
	val outputFlatnessDB(val::object());
	outputFlatnessDB.set("flatnessDB", output_flatnessDB);
	return outputFlatnessDB;
}
void FlatnessDB::reset() {
_flatnessdb->reset();
}
// END FlatnessDB definitions

// START FlatnessSFX definitions
// check https://essentia.upf.edu/reference/std_FlatnessSFX.html
FlatnessSFX::FlatnessSFX() {
	_flatnesssfx = AlgorithmFactory::create("FlatnessSFX");
}
FlatnessSFX::~FlatnessSFX() {
	if (_flatnesssfx) delete _flatnesssfx;
}
void FlatnessSFX::configure() {
	_flatnesssfx->configure();
}
val FlatnessSFX::compute(std::vector<float>& input_envelope) {
	_flatnesssfx->input("envelope").set(input_envelope);
	float output_flatness;
	_flatnesssfx->output("flatness").set(output_flatness);
	_flatnesssfx->compute();
	val outputFlatnessSFX(val::object());
	outputFlatnessSFX.set("flatness", output_flatness);
	return outputFlatnessSFX;
}
void FlatnessSFX::reset() {
_flatnesssfx->reset();
}
// END FlatnessSFX definitions

// START Flux definitions
// check https://essentia.upf.edu/reference/std_Flux.html
Flux::Flux(const bool halfRectify, const std::string& norm) {
	_flux = AlgorithmFactory::create("Flux", "halfRectify", halfRectify, "norm", norm);
}
Flux::~Flux() {
	if (_flux) delete _flux;
}
void Flux::configure(const bool halfRectify, const std::string& norm) {
	_flux->configure("halfRectify", halfRectify, "norm", norm);
}
val Flux::compute(std::vector<float>& input_spectrum) {
	_flux->input("spectrum").set(input_spectrum);
	float output_flux;
	_flux->output("flux").set(output_flux);
	_flux->compute();
	val outputFlux(val::object());
	outputFlux.set("flux", output_flux);
	return outputFlux;
}
void Flux::reset() {
_flux->reset();
}
// END Flux definitions

// START FrameCutter definitions
// check https://essentia.upf.edu/reference/std_FrameCutter.html
FrameCutter::FrameCutter(const int frameSize, const int hopSize, const bool lastFrameToEndOfFile, const bool startFromZero, const float validFrameThresholdRatio) {
	_framecutter = AlgorithmFactory::create("FrameCutter", "frameSize", frameSize, "hopSize", hopSize, "lastFrameToEndOfFile", lastFrameToEndOfFile, "startFromZero", startFromZero, "validFrameThresholdRatio", validFrameThresholdRatio);
}
FrameCutter::~FrameCutter() {
	if (_framecutter) delete _framecutter;
}
void FrameCutter::configure(const int frameSize, const int hopSize, const bool lastFrameToEndOfFile, const bool startFromZero, const float validFrameThresholdRatio) {
	_framecutter->configure("frameSize", frameSize, "hopSize", hopSize, "lastFrameToEndOfFile", lastFrameToEndOfFile, "startFromZero", startFromZero, "validFrameThresholdRatio", validFrameThresholdRatio);
}
val FrameCutter::compute(std::vector<float>& input_signal) {
	_framecutter->input("signal").set(input_signal);
	std::vector<float> output_frame;
	_framecutter->output("frame").set(output_frame);
	_framecutter->compute();
	val outputFrameCutter(val::object());
	outputFrameCutter.set("frame", output_frame);
	return outputFrameCutter;
}
void FrameCutter::reset() {
_framecutter->reset();
}
// END FrameCutter definitions

// START FrameToReal definitions
// check https://essentia.upf.edu/reference/std_FrameToReal.html
FrameToReal::FrameToReal(const int frameSize, const int hopSize) {
	_frametoreal = AlgorithmFactory::create("FrameToReal", "frameSize", frameSize, "hopSize", hopSize);
}
FrameToReal::~FrameToReal() {
	if (_frametoreal) delete _frametoreal;
}
void FrameToReal::configure(const int frameSize, const int hopSize) {
	_frametoreal->configure("frameSize", frameSize, "hopSize", hopSize);
}
val FrameToReal::compute(std::vector<float>& input_signal) {
	_frametoreal->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_frametoreal->output("signal").set(output_signal);
	_frametoreal->compute();
	val outputFrameToReal(val::object());
	outputFrameToReal.set("signal", output_signal);
	return outputFrameToReal;
}
void FrameToReal::reset() {
_frametoreal->reset();
}
// END FrameToReal definitions

// START FrequencyBands definitions
// check https://essentia.upf.edu/reference/std_FrequencyBands.html
FrequencyBands::FrequencyBands(const std::vector<float>& frequencyBands, const float sampleRate) {
	_frequencybands = AlgorithmFactory::create("FrequencyBands", "frequencyBands", frequencyBands, "sampleRate", sampleRate);
}
FrequencyBands::~FrequencyBands() {
	if (_frequencybands) delete _frequencybands;
}
void FrequencyBands::configure(const std::vector<float>& frequencyBands, const float sampleRate) {
	_frequencybands->configure("frequencyBands", frequencyBands, "sampleRate", sampleRate);
}
val FrequencyBands::compute(std::vector<float>& input_spectrum) {
	_frequencybands->input("spectrum").set(input_spectrum);
	std::vector<float> output_bands;
	_frequencybands->output("bands").set(output_bands);
	_frequencybands->compute();
	val outputFrequencyBands(val::object());
	outputFrequencyBands.set("bands", output_bands);
	return outputFrequencyBands;
}
void FrequencyBands::reset() {
_frequencybands->reset();
}
// END FrequencyBands definitions

// START GFCC definitions
// check https://essentia.upf.edu/reference/std_GFCC.html
GFCC::GFCC(const int dctType, const float highFrequencyBound, const int inputSize, const std::string& logType, const float lowFrequencyBound, const int numberBands, const int numberCoefficients, const float sampleRate, const float silenceThreshold, const std::string& type) {
	_gfcc = AlgorithmFactory::create("GFCC", "dctType", dctType, "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "logType", logType, "lowFrequencyBound", lowFrequencyBound, "numberBands", numberBands, "numberCoefficients", numberCoefficients, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold, "type", type);
}
GFCC::~GFCC() {
	if (_gfcc) delete _gfcc;
}
void GFCC::configure(const int dctType, const float highFrequencyBound, const int inputSize, const std::string& logType, const float lowFrequencyBound, const int numberBands, const int numberCoefficients, const float sampleRate, const float silenceThreshold, const std::string& type) {
	_gfcc->configure("dctType", dctType, "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "logType", logType, "lowFrequencyBound", lowFrequencyBound, "numberBands", numberBands, "numberCoefficients", numberCoefficients, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold, "type", type);
}
val GFCC::compute(std::vector<float>& input_spectrum) {
	_gfcc->input("spectrum").set(input_spectrum);
	std::vector<float> output_bands;
	std::vector<float> output_gfcc;
	_gfcc->output("bands").set(output_bands);
	_gfcc->output("gfcc").set(output_gfcc);
	_gfcc->compute();
	val outputGFCC(val::object());
	outputGFCC.set("bands", output_bands);
	outputGFCC.set("gfcc", output_gfcc);
	return outputGFCC;
}
void GFCC::reset() {
_gfcc->reset();
}
// END GFCC definitions

// START GapsDetector definitions
// check https://essentia.upf.edu/reference/std_GapsDetector.html
GapsDetector::GapsDetector(const float attackTime, const int frameSize, const int hopSize, const int kernelSize, const float maximumTime, const float minimumTime, const float postpowerTime, const float prepowerThreshold, const float prepowerTime, const float releaseTime, const float sampleRate, const float silenceThreshold) {
	_gapsdetector = AlgorithmFactory::create("GapsDetector", "attackTime", attackTime, "frameSize", frameSize, "hopSize", hopSize, "kernelSize", kernelSize, "maximumTime", maximumTime, "minimumTime", minimumTime, "postpowerTime", postpowerTime, "prepowerThreshold", prepowerThreshold, "prepowerTime", prepowerTime, "releaseTime", releaseTime, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold);
}
GapsDetector::~GapsDetector() {
	if (_gapsdetector) delete _gapsdetector;
}
void GapsDetector::configure(const float attackTime, const int frameSize, const int hopSize, const int kernelSize, const float maximumTime, const float minimumTime, const float postpowerTime, const float prepowerThreshold, const float prepowerTime, const float releaseTime, const float sampleRate, const float silenceThreshold) {
	_gapsdetector->configure("attackTime", attackTime, "frameSize", frameSize, "hopSize", hopSize, "kernelSize", kernelSize, "maximumTime", maximumTime, "minimumTime", minimumTime, "postpowerTime", postpowerTime, "prepowerThreshold", prepowerThreshold, "prepowerTime", prepowerTime, "releaseTime", releaseTime, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold);
}
val GapsDetector::compute(std::vector<float>& input_frame) {
	_gapsdetector->input("frame").set(input_frame);
	std::vector<float> output_starts;
	std::vector<float> output_ends;
	_gapsdetector->output("starts").set(output_starts);
	_gapsdetector->output("ends").set(output_ends);
	_gapsdetector->compute();
	val outputGapsDetector(val::object());
	outputGapsDetector.set("starts", output_starts);
	outputGapsDetector.set("ends", output_ends);
	return outputGapsDetector;
}
void GapsDetector::reset() {
_gapsdetector->reset();
}
// END GapsDetector definitions

// START GeometricMean definitions
// check https://essentia.upf.edu/reference/std_GeometricMean.html
GeometricMean::GeometricMean() {
	_geometricmean = AlgorithmFactory::create("GeometricMean");
}
GeometricMean::~GeometricMean() {
	if (_geometricmean) delete _geometricmean;
}
void GeometricMean::configure() {
	_geometricmean->configure();
}
val GeometricMean::compute(std::vector<float>& input_array) {
	_geometricmean->input("array").set(input_array);
	float output_geometricMean;
	_geometricmean->output("geometricMean").set(output_geometricMean);
	_geometricmean->compute();
	val outputGeometricMean(val::object());
	outputGeometricMean.set("geometricMean", output_geometricMean);
	return outputGeometricMean;
}
void GeometricMean::reset() {
_geometricmean->reset();
}
// END GeometricMean definitions

// START HFC definitions
// check https://essentia.upf.edu/reference/std_HFC.html
HFC::HFC(const float sampleRate, const std::string& type) {
	_hfc = AlgorithmFactory::create("HFC", "sampleRate", sampleRate, "type", type);
}
HFC::~HFC() {
	if (_hfc) delete _hfc;
}
void HFC::configure(const float sampleRate, const std::string& type) {
	_hfc->configure("sampleRate", sampleRate, "type", type);
}
val HFC::compute(std::vector<float>& input_spectrum) {
	_hfc->input("spectrum").set(input_spectrum);
	float output_hfc;
	_hfc->output("hfc").set(output_hfc);
	_hfc->compute();
	val outputHFC(val::object());
	outputHFC.set("hfc", output_hfc);
	return outputHFC;
}
void HFC::reset() {
_hfc->reset();
}
// END HFC definitions

// START HPCP definitions
// check https://essentia.upf.edu/reference/std_HPCP.html
HPCP::HPCP(const bool bandPreset, const float bandSplitFrequency, const int harmonics, const float maxFrequency, const bool maxShifted, const float minFrequency, const bool nonLinear, const std::string& normalized, const float referenceFrequency, const float sampleRate, const int size, const std::string& weightType, const float windowSize) {
	_hpcp = AlgorithmFactory::create("HPCP", "bandPreset", bandPreset, "bandSplitFrequency", bandSplitFrequency, "harmonics", harmonics, "maxFrequency", maxFrequency, "maxShifted", maxShifted, "minFrequency", minFrequency, "nonLinear", nonLinear, "normalized", normalized, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "size", size, "weightType", weightType, "windowSize", windowSize);
}
HPCP::~HPCP() {
	if (_hpcp) delete _hpcp;
}
void HPCP::configure(const bool bandPreset, const float bandSplitFrequency, const int harmonics, const float maxFrequency, const bool maxShifted, const float minFrequency, const bool nonLinear, const std::string& normalized, const float referenceFrequency, const float sampleRate, const int size, const std::string& weightType, const float windowSize) {
	_hpcp->configure("bandPreset", bandPreset, "bandSplitFrequency", bandSplitFrequency, "harmonics", harmonics, "maxFrequency", maxFrequency, "maxShifted", maxShifted, "minFrequency", minFrequency, "nonLinear", nonLinear, "normalized", normalized, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "size", size, "weightType", weightType, "windowSize", windowSize);
}
val HPCP::compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
	_hpcp->input("frequencies").set(input_frequencies);
	_hpcp->input("magnitudes").set(input_magnitudes);
	std::vector<float> output_hpcp;
	_hpcp->output("hpcp").set(output_hpcp);
	_hpcp->compute();
	val outputHPCP(val::object());
	outputHPCP.set("hpcp", output_hpcp);
	return outputHPCP;
}
void HPCP::reset() {
_hpcp->reset();
}
// END HPCP definitions

// START HarmonicBpm definitions
// check https://essentia.upf.edu/reference/std_HarmonicBpm.html
HarmonicBpm::HarmonicBpm(const float bpm, const float threshold, const float tolerance) {
	_harmonicbpm = AlgorithmFactory::create("HarmonicBpm", "bpm", bpm, "threshold", threshold, "tolerance", tolerance);
}
HarmonicBpm::~HarmonicBpm() {
	if (_harmonicbpm) delete _harmonicbpm;
}
void HarmonicBpm::configure(const float bpm, const float threshold, const float tolerance) {
	_harmonicbpm->configure("bpm", bpm, "threshold", threshold, "tolerance", tolerance);
}
val HarmonicBpm::compute(std::vector<float>& input_bpms) {
	_harmonicbpm->input("bpms").set(input_bpms);
	std::vector<float> output_harmonicBpms;
	_harmonicbpm->output("harmonicBpms").set(output_harmonicBpms);
	_harmonicbpm->compute();
	val outputHarmonicBpm(val::object());
	outputHarmonicBpm.set("harmonicBpms", output_harmonicBpms);
	return outputHarmonicBpm;
}
void HarmonicBpm::reset() {
_harmonicbpm->reset();
}
// END HarmonicBpm definitions

// START HarmonicPeaks definitions
// check https://essentia.upf.edu/reference/std_HarmonicPeaks.html
HarmonicPeaks::HarmonicPeaks(const int maxHarmonics, const float tolerance) {
	_harmonicpeaks = AlgorithmFactory::create("HarmonicPeaks", "maxHarmonics", maxHarmonics, "tolerance", tolerance);
}
HarmonicPeaks::~HarmonicPeaks() {
	if (_harmonicpeaks) delete _harmonicpeaks;
}
void HarmonicPeaks::configure(const int maxHarmonics, const float tolerance) {
	_harmonicpeaks->configure("maxHarmonics", maxHarmonics, "tolerance", tolerance);
}
val HarmonicPeaks::compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, float input_pitch) {
	_harmonicpeaks->input("frequencies").set(input_frequencies);
	_harmonicpeaks->input("magnitudes").set(input_magnitudes);
	_harmonicpeaks->input("pitch").set(input_pitch);
	std::vector<float> output_harmonicFrequencies;
	std::vector<float> output_harmonicMagnitudes;
	_harmonicpeaks->output("harmonicFrequencies").set(output_harmonicFrequencies);
	_harmonicpeaks->output("harmonicMagnitudes").set(output_harmonicMagnitudes);
	_harmonicpeaks->compute();
	val outputHarmonicPeaks(val::object());
	outputHarmonicPeaks.set("harmonicFrequencies", output_harmonicFrequencies);
	outputHarmonicPeaks.set("harmonicMagnitudes", output_harmonicMagnitudes);
	return outputHarmonicPeaks;
}
void HarmonicPeaks::reset() {
_harmonicpeaks->reset();
}
// END HarmonicPeaks definitions

// START HighPass definitions
// check https://essentia.upf.edu/reference/std_HighPass.html
HighPass::HighPass(const float cutoffFrequency, const float sampleRate) {
	_highpass = AlgorithmFactory::create("HighPass", "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
}
HighPass::~HighPass() {
	if (_highpass) delete _highpass;
}
void HighPass::configure(const float cutoffFrequency, const float sampleRate) {
	_highpass->configure("cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
}
val HighPass::compute(std::vector<float>& input_signal) {
	_highpass->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_highpass->output("signal").set(output_signal);
	_highpass->compute();
	val outputHighPass(val::object());
	outputHighPass.set("signal", output_signal);
	return outputHighPass;
}
void HighPass::reset() {
_highpass->reset();
}
// END HighPass definitions

// START HighResolutionFeatures definitions
// check https://essentia.upf.edu/reference/std_HighResolutionFeatures.html
HighResolutionFeatures::HighResolutionFeatures(const int maxPeaks) {
	_highresolutionfeatures = AlgorithmFactory::create("HighResolutionFeatures", "maxPeaks", maxPeaks);
}
HighResolutionFeatures::~HighResolutionFeatures() {
	if (_highresolutionfeatures) delete _highresolutionfeatures;
}
void HighResolutionFeatures::configure(const int maxPeaks) {
	_highresolutionfeatures->configure("maxPeaks", maxPeaks);
}
val HighResolutionFeatures::compute(std::vector<float>& input_hpcp) {
	_highresolutionfeatures->input("hpcp").set(input_hpcp);
	float output_equalTemperedDeviation;
	float output_nonTemperedEnergyRatio;
	float output_nonTemperedPeaksEnergyRatio;
	_highresolutionfeatures->output("equalTemperedDeviation").set(output_equalTemperedDeviation);
	_highresolutionfeatures->output("nonTemperedEnergyRatio").set(output_nonTemperedEnergyRatio);
	_highresolutionfeatures->output("nonTemperedPeaksEnergyRatio").set(output_nonTemperedPeaksEnergyRatio);
	_highresolutionfeatures->compute();
	val outputHighResolutionFeatures(val::object());
	outputHighResolutionFeatures.set("equalTemperedDeviation", output_equalTemperedDeviation);
	outputHighResolutionFeatures.set("nonTemperedEnergyRatio", output_nonTemperedEnergyRatio);
	outputHighResolutionFeatures.set("nonTemperedPeaksEnergyRatio", output_nonTemperedPeaksEnergyRatio);
	return outputHighResolutionFeatures;
}
void HighResolutionFeatures::reset() {
_highresolutionfeatures->reset();
}
// END HighResolutionFeatures definitions

// START Histogram definitions
// check https://essentia.upf.edu/reference/std_Histogram.html
Histogram::Histogram(const float maxValue, const float minValue, const std::string& normalize, const int numberBins) {
	_histogram = AlgorithmFactory::create("Histogram", "maxValue", maxValue, "minValue", minValue, "normalize", normalize, "numberBins", numberBins);
}
Histogram::~Histogram() {
	if (_histogram) delete _histogram;
}
void Histogram::configure(const float maxValue, const float minValue, const std::string& normalize, const int numberBins) {
	_histogram->configure("maxValue", maxValue, "minValue", minValue, "normalize", normalize, "numberBins", numberBins);
}
val Histogram::compute(std::vector<float>& input_array) {
	_histogram->input("array").set(input_array);
	std::vector<float> output_histogram;
	std::vector<float> output_binEdges;
	_histogram->output("histogram").set(output_histogram);
	_histogram->output("binEdges").set(output_binEdges);
	_histogram->compute();
	val outputHistogram(val::object());
	outputHistogram.set("histogram", output_histogram);
	outputHistogram.set("binEdges", output_binEdges);
	return outputHistogram;
}
void Histogram::reset() {
_histogram->reset();
}
// END Histogram definitions

// START HprModelAnal definitions
// check https://essentia.upf.edu/reference/std_HprModelAnal.html
HprModelAnal::HprModelAnal(const int fftSize, const int freqDevOffset, const float freqDevSlope, const float harmDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const int nHarmonics, const std::string& orderBy, const float sampleRate, const float stocf) {
	_hprmodelanal = AlgorithmFactory::create("HprModelAnal", "fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "harmDevSlope", harmDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "nHarmonics", nHarmonics, "orderBy", orderBy, "sampleRate", sampleRate, "stocf", stocf);
}
HprModelAnal::~HprModelAnal() {
	if (_hprmodelanal) delete _hprmodelanal;
}
void HprModelAnal::configure(const int fftSize, const int freqDevOffset, const float freqDevSlope, const float harmDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const int nHarmonics, const std::string& orderBy, const float sampleRate, const float stocf) {
	_hprmodelanal->configure("fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "harmDevSlope", harmDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "nHarmonics", nHarmonics, "orderBy", orderBy, "sampleRate", sampleRate, "stocf", stocf);
}
val HprModelAnal::compute(std::vector<float>& input_frame, float input_pitch) {
	_hprmodelanal->input("frame").set(input_frame);
	_hprmodelanal->input("pitch").set(input_pitch);
	std::vector<float> output_frequencies;
	std::vector<float> output_magnitudes;
	std::vector<float> output_phases;
	std::vector<float> output_res;
	_hprmodelanal->output("frequencies").set(output_frequencies);
	_hprmodelanal->output("magnitudes").set(output_magnitudes);
	_hprmodelanal->output("phases").set(output_phases);
	_hprmodelanal->output("res").set(output_res);
	_hprmodelanal->compute();
	val outputHprModelAnal(val::object());
	outputHprModelAnal.set("frequencies", output_frequencies);
	outputHprModelAnal.set("magnitudes", output_magnitudes);
	outputHprModelAnal.set("phases", output_phases);
	outputHprModelAnal.set("res", output_res);
	return outputHprModelAnal;
}
void HprModelAnal::reset() {
_hprmodelanal->reset();
}
// END HprModelAnal definitions

// START HpsModelAnal definitions
// check https://essentia.upf.edu/reference/std_HpsModelAnal.html
HpsModelAnal::HpsModelAnal(const int fftSize, const int freqDevOffset, const float freqDevSlope, const float harmDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const int nHarmonics, const std::string& orderBy, const float sampleRate, const float stocf) {
	_hpsmodelanal = AlgorithmFactory::create("HpsModelAnal", "fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "harmDevSlope", harmDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "nHarmonics", nHarmonics, "orderBy", orderBy, "sampleRate", sampleRate, "stocf", stocf);
}
HpsModelAnal::~HpsModelAnal() {
	if (_hpsmodelanal) delete _hpsmodelanal;
}
void HpsModelAnal::configure(const int fftSize, const int freqDevOffset, const float freqDevSlope, const float harmDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const int nHarmonics, const std::string& orderBy, const float sampleRate, const float stocf) {
	_hpsmodelanal->configure("fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "harmDevSlope", harmDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "nHarmonics", nHarmonics, "orderBy", orderBy, "sampleRate", sampleRate, "stocf", stocf);
}
val HpsModelAnal::compute(std::vector<float>& input_frame, float input_pitch) {
	_hpsmodelanal->input("frame").set(input_frame);
	_hpsmodelanal->input("pitch").set(input_pitch);
	std::vector<float> output_frequencies;
	std::vector<float> output_magnitudes;
	std::vector<float> output_phases;
	std::vector<float> output_stocenv;
	_hpsmodelanal->output("frequencies").set(output_frequencies);
	_hpsmodelanal->output("magnitudes").set(output_magnitudes);
	_hpsmodelanal->output("phases").set(output_phases);
	_hpsmodelanal->output("stocenv").set(output_stocenv);
	_hpsmodelanal->compute();
	val outputHpsModelAnal(val::object());
	outputHpsModelAnal.set("frequencies", output_frequencies);
	outputHpsModelAnal.set("magnitudes", output_magnitudes);
	outputHpsModelAnal.set("phases", output_phases);
	outputHpsModelAnal.set("stocenv", output_stocenv);
	return outputHpsModelAnal;
}
void HpsModelAnal::reset() {
_hpsmodelanal->reset();
}
// END HpsModelAnal definitions

// START IDCT definitions
// check https://essentia.upf.edu/reference/std_IDCT.html
IDCT::IDCT(const int dctType, const int inputSize, const int liftering, const int outputSize) {
	_idct = AlgorithmFactory::create("IDCT", "dctType", dctType, "inputSize", inputSize, "liftering", liftering, "outputSize", outputSize);
}
IDCT::~IDCT() {
	if (_idct) delete _idct;
}
void IDCT::configure(const int dctType, const int inputSize, const int liftering, const int outputSize) {
	_idct->configure("dctType", dctType, "inputSize", inputSize, "liftering", liftering, "outputSize", outputSize);
}
val IDCT::compute(std::vector<float>& input_dct) {
	_idct->input("dct").set(input_dct);
	std::vector<float> output_idct;
	_idct->output("idct").set(output_idct);
	_idct->compute();
	val outputIDCT(val::object());
	outputIDCT.set("idct", output_idct);
	return outputIDCT;
}
void IDCT::reset() {
_idct->reset();
}
// END IDCT definitions

// START IIR definitions
// check https://essentia.upf.edu/reference/std_IIR.html
IIR::IIR(const std::vector<float>& denominator, const std::vector<float>& numerator) {
	_iir = AlgorithmFactory::create("IIR", "denominator", denominator, "numerator", numerator);
}
IIR::~IIR() {
	if (_iir) delete _iir;
}
void IIR::configure(const std::vector<float>& denominator, const std::vector<float>& numerator) {
	_iir->configure("denominator", denominator, "numerator", numerator);
}
val IIR::compute(std::vector<float>& input_signal) {
	_iir->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_iir->output("signal").set(output_signal);
	_iir->compute();
	val outputIIR(val::object());
	outputIIR.set("signal", output_signal);
	return outputIIR;
}
void IIR::reset() {
_iir->reset();
}
// END IIR definitions

// START Inharmonicity definitions
// check https://essentia.upf.edu/reference/std_Inharmonicity.html
Inharmonicity::Inharmonicity() {
	_inharmonicity = AlgorithmFactory::create("Inharmonicity");
}
Inharmonicity::~Inharmonicity() {
	if (_inharmonicity) delete _inharmonicity;
}
void Inharmonicity::configure() {
	_inharmonicity->configure();
}
val Inharmonicity::compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
	_inharmonicity->input("frequencies").set(input_frequencies);
	_inharmonicity->input("magnitudes").set(input_magnitudes);
	float output_inharmonicity;
	_inharmonicity->output("inharmonicity").set(output_inharmonicity);
	_inharmonicity->compute();
	val outputInharmonicity(val::object());
	outputInharmonicity.set("inharmonicity", output_inharmonicity);
	return outputInharmonicity;
}
void Inharmonicity::reset() {
_inharmonicity->reset();
}
// END Inharmonicity definitions

// START InstantPower definitions
// check https://essentia.upf.edu/reference/std_InstantPower.html
InstantPower::InstantPower() {
	_instantpower = AlgorithmFactory::create("InstantPower");
}
InstantPower::~InstantPower() {
	if (_instantpower) delete _instantpower;
}
void InstantPower::configure() {
	_instantpower->configure();
}
val InstantPower::compute(std::vector<float>& input_array) {
	_instantpower->input("array").set(input_array);
	float output_power;
	_instantpower->output("power").set(output_power);
	_instantpower->compute();
	val outputInstantPower(val::object());
	outputInstantPower.set("power", output_power);
	return outputInstantPower;
}
void InstantPower::reset() {
_instantpower->reset();
}
// END InstantPower definitions

// START Intensity definitions
// check https://essentia.upf.edu/reference/std_Intensity.html
Intensity::Intensity(const float sampleRate) {
	_intensity = AlgorithmFactory::create("Intensity", "sampleRate", sampleRate);
}
Intensity::~Intensity() {
	if (_intensity) delete _intensity;
}
void Intensity::configure(const float sampleRate) {
	_intensity->configure("sampleRate", sampleRate);
}
val Intensity::compute(std::vector<float>& input_signal) {
	_intensity->input("signal").set(input_signal);
	int output_intensity;
	_intensity->output("intensity").set(output_intensity);
	_intensity->compute();
	val outputIntensity(val::object());
	outputIntensity.set("intensity", output_intensity);
	return outputIntensity;
}
void Intensity::reset() {
_intensity->reset();
}
// END Intensity definitions

// START Key definitions
// check https://essentia.upf.edu/reference/std_Key.html
Key::Key(const int numHarmonics, const int pcpSize, const std::string& profileType, const float slope, const bool useMajMin, const bool usePolyphony, const bool useThreeChords) {
	_key = AlgorithmFactory::create("Key", "numHarmonics", numHarmonics, "pcpSize", pcpSize, "profileType", profileType, "slope", slope, "useMajMin", useMajMin, "usePolyphony", usePolyphony, "useThreeChords", useThreeChords);
}
Key::~Key() {
	if (_key) delete _key;
}
void Key::configure(const int numHarmonics, const int pcpSize, const std::string& profileType, const float slope, const bool useMajMin, const bool usePolyphony, const bool useThreeChords) {
	_key->configure("numHarmonics", numHarmonics, "pcpSize", pcpSize, "profileType", profileType, "slope", slope, "useMajMin", useMajMin, "usePolyphony", usePolyphony, "useThreeChords", useThreeChords);
}
val Key::compute(std::vector<float>& input_pcp) {
	_key->input("pcp").set(input_pcp);
	std::string output_key;
	std::string output_scale;
	float output_strength;
	float output_firstToSecondRelativeStrength;
	_key->output("key").set(output_key);
	_key->output("scale").set(output_scale);
	_key->output("strength").set(output_strength);
	_key->output("firstToSecondRelativeStrength").set(output_firstToSecondRelativeStrength);
	_key->compute();
	val outputKey(val::object());
	outputKey.set("key", output_key);
	outputKey.set("scale", output_scale);
	outputKey.set("strength", output_strength);
	outputKey.set("firstToSecondRelativeStrength", output_firstToSecondRelativeStrength);
	return outputKey;
}
void Key::reset() {
_key->reset();
}
// END Key definitions

// START KeyExtractor definitions
// check https://essentia.upf.edu/reference/std_KeyExtractor.html
KeyExtractor::KeyExtractor(const bool averageDetuningCorrection, const int frameSize, const int hopSize, const int hpcpSize, const float maxFrequency, const int maximumSpectralPeaks, const float minFrequency, const float pcpThreshold, const std::string& profileType, const float sampleRate, const float spectralPeaksThreshold, const float tuningFrequency, const std::string& weightType, const std::string& windowType) {
	_keyextractor = AlgorithmFactory::create("KeyExtractor", "averageDetuningCorrection", averageDetuningCorrection, "frameSize", frameSize, "hopSize", hopSize, "hpcpSize", hpcpSize, "maxFrequency", maxFrequency, "maximumSpectralPeaks", maximumSpectralPeaks, "minFrequency", minFrequency, "pcpThreshold", pcpThreshold, "profileType", profileType, "sampleRate", sampleRate, "spectralPeaksThreshold", spectralPeaksThreshold, "tuningFrequency", tuningFrequency, "weightType", weightType, "windowType", windowType);
}
KeyExtractor::~KeyExtractor() {
	if (_keyextractor) delete _keyextractor;
}
void KeyExtractor::configure(const bool averageDetuningCorrection, const int frameSize, const int hopSize, const int hpcpSize, const float maxFrequency, const int maximumSpectralPeaks, const float minFrequency, const float pcpThreshold, const std::string& profileType, const float sampleRate, const float spectralPeaksThreshold, const float tuningFrequency, const std::string& weightType, const std::string& windowType) {
	_keyextractor->configure("averageDetuningCorrection", averageDetuningCorrection, "frameSize", frameSize, "hopSize", hopSize, "hpcpSize", hpcpSize, "maxFrequency", maxFrequency, "maximumSpectralPeaks", maximumSpectralPeaks, "minFrequency", minFrequency, "pcpThreshold", pcpThreshold, "profileType", profileType, "sampleRate", sampleRate, "spectralPeaksThreshold", spectralPeaksThreshold, "tuningFrequency", tuningFrequency, "weightType", weightType, "windowType", windowType);
}
val KeyExtractor::compute(std::vector<float>& input_audio) {
	_keyextractor->input("audio").set(input_audio);
	std::string output_key;
	std::string output_scale;
	float output_strength;
	_keyextractor->output("key").set(output_key);
	_keyextractor->output("scale").set(output_scale);
	_keyextractor->output("strength").set(output_strength);
	_keyextractor->compute();
	val outputKeyExtractor(val::object());
	outputKeyExtractor.set("key", output_key);
	outputKeyExtractor.set("scale", output_scale);
	outputKeyExtractor.set("strength", output_strength);
	return outputKeyExtractor;
}
void KeyExtractor::reset() {
_keyextractor->reset();
}
// END KeyExtractor definitions

// START LPC definitions
// check https://essentia.upf.edu/reference/std_LPC.html
LPC::LPC(const int order, const float sampleRate, const std::string& type) {
	_lpc = AlgorithmFactory::create("LPC", "order", order, "sampleRate", sampleRate, "type", type);
}
LPC::~LPC() {
	if (_lpc) delete _lpc;
}
void LPC::configure(const int order, const float sampleRate, const std::string& type) {
	_lpc->configure("order", order, "sampleRate", sampleRate, "type", type);
}
val LPC::compute(std::vector<float>& input_frame) {
	_lpc->input("frame").set(input_frame);
	std::vector<float> output_lpc;
	std::vector<float> output_reflection;
	_lpc->output("lpc").set(output_lpc);
	_lpc->output("reflection").set(output_reflection);
	_lpc->compute();
	val outputLPC(val::object());
	outputLPC.set("lpc", output_lpc);
	outputLPC.set("reflection", output_reflection);
	return outputLPC;
}
void LPC::reset() {
_lpc->reset();
}
// END LPC definitions

// START Larm definitions
// check https://essentia.upf.edu/reference/std_Larm.html
Larm::Larm(const float attackTime, const float power, const float releaseTime, const float sampleRate) {
	_larm = AlgorithmFactory::create("Larm", "attackTime", attackTime, "power", power, "releaseTime", releaseTime, "sampleRate", sampleRate);
}
Larm::~Larm() {
	if (_larm) delete _larm;
}
void Larm::configure(const float attackTime, const float power, const float releaseTime, const float sampleRate) {
	_larm->configure("attackTime", attackTime, "power", power, "releaseTime", releaseTime, "sampleRate", sampleRate);
}
val Larm::compute(std::vector<float>& input_signal) {
	_larm->input("signal").set(input_signal);
	float output_larm;
	_larm->output("larm").set(output_larm);
	_larm->compute();
	val outputLarm(val::object());
	outputLarm.set("larm", output_larm);
	return outputLarm;
}
void Larm::reset() {
_larm->reset();
}
// END Larm definitions

// START Leq definitions
// check https://essentia.upf.edu/reference/std_Leq.html
Leq::Leq() {
	_leq = AlgorithmFactory::create("Leq");
}
Leq::~Leq() {
	if (_leq) delete _leq;
}
void Leq::configure() {
	_leq->configure();
}
val Leq::compute(std::vector<float>& input_signal) {
	_leq->input("signal").set(input_signal);
	float output_leq;
	_leq->output("leq").set(output_leq);
	_leq->compute();
	val outputLeq(val::object());
	outputLeq.set("leq", output_leq);
	return outputLeq;
}
void Leq::reset() {
_leq->reset();
}
// END Leq definitions

// START LevelExtractor definitions
// check https://essentia.upf.edu/reference/std_LevelExtractor.html
LevelExtractor::LevelExtractor(const int frameSize, const int hopSize) {
	_levelextractor = AlgorithmFactory::create("LevelExtractor", "frameSize", frameSize, "hopSize", hopSize);
}
LevelExtractor::~LevelExtractor() {
	if (_levelextractor) delete _levelextractor;
}
void LevelExtractor::configure(const int frameSize, const int hopSize) {
	_levelextractor->configure("frameSize", frameSize, "hopSize", hopSize);
}
val LevelExtractor::compute(std::vector<float>& input_signal) {
	_levelextractor->input("signal").set(input_signal);
	std::vector<float> output_loudness;
	_levelextractor->output("loudness").set(output_loudness);
	_levelextractor->compute();
	val outputLevelExtractor(val::object());
	outputLevelExtractor.set("loudness", output_loudness);
	return outputLevelExtractor;
}
void LevelExtractor::reset() {
_levelextractor->reset();
}
// END LevelExtractor definitions

// START LogAttackTime definitions
// check https://essentia.upf.edu/reference/std_LogAttackTime.html
LogAttackTime::LogAttackTime(const float sampleRate, const float startAttackThreshold, const float stopAttackThreshold) {
	_logattacktime = AlgorithmFactory::create("LogAttackTime", "sampleRate", sampleRate, "startAttackThreshold", startAttackThreshold, "stopAttackThreshold", stopAttackThreshold);
}
LogAttackTime::~LogAttackTime() {
	if (_logattacktime) delete _logattacktime;
}
void LogAttackTime::configure(const float sampleRate, const float startAttackThreshold, const float stopAttackThreshold) {
	_logattacktime->configure("sampleRate", sampleRate, "startAttackThreshold", startAttackThreshold, "stopAttackThreshold", stopAttackThreshold);
}
val LogAttackTime::compute(std::vector<float>& input_signal) {
	_logattacktime->input("signal").set(input_signal);
	float output_logAttackTime;
	float output_attackStart;
	float output_attackStop;
	_logattacktime->output("logAttackTime").set(output_logAttackTime);
	_logattacktime->output("attackStart").set(output_attackStart);
	_logattacktime->output("attackStop").set(output_attackStop);
	_logattacktime->compute();
	val outputLogAttackTime(val::object());
	outputLogAttackTime.set("logAttackTime", output_logAttackTime);
	outputLogAttackTime.set("attackStart", output_attackStart);
	outputLogAttackTime.set("attackStop", output_attackStop);
	return outputLogAttackTime;
}
void LogAttackTime::reset() {
_logattacktime->reset();
}
// END LogAttackTime definitions

// START LogSpectrum definitions
// check https://essentia.upf.edu/reference/std_LogSpectrum.html
LogSpectrum::LogSpectrum(const float binsPerSemitone, const int frameSize, const int nOctave, const float rollOn, const float sampleRate) {
	_logspectrum = AlgorithmFactory::create("LogSpectrum", "binsPerSemitone", binsPerSemitone, "frameSize", frameSize, "nOctave", nOctave, "rollOn", rollOn, "sampleRate", sampleRate);
}
LogSpectrum::~LogSpectrum() {
	if (_logspectrum) delete _logspectrum;
}
void LogSpectrum::configure(const float binsPerSemitone, const int frameSize, const int nOctave, const float rollOn, const float sampleRate) {
	_logspectrum->configure("binsPerSemitone", binsPerSemitone, "frameSize", frameSize, "nOctave", nOctave, "rollOn", rollOn, "sampleRate", sampleRate);
}
val LogSpectrum::compute(std::vector<float>& input_spectrum) {
	_logspectrum->input("spectrum").set(input_spectrum);
	std::vector<float> output_logFreqSpectrum;
	std::vector<float> output_meanTuning;
	float output_localTuning;
	_logspectrum->output("logFreqSpectrum").set(output_logFreqSpectrum);
	_logspectrum->output("meanTuning").set(output_meanTuning);
	_logspectrum->output("localTuning").set(output_localTuning);
	_logspectrum->compute();
	val outputLogSpectrum(val::object());
	outputLogSpectrum.set("logFreqSpectrum", output_logFreqSpectrum);
	outputLogSpectrum.set("meanTuning", output_meanTuning);
	outputLogSpectrum.set("localTuning", output_localTuning);
	return outputLogSpectrum;
}
void LogSpectrum::reset() {
_logspectrum->reset();
}
// END LogSpectrum definitions

// START LoopBpmConfidence definitions
// check https://essentia.upf.edu/reference/std_LoopBpmConfidence.html
LoopBpmConfidence::LoopBpmConfidence(const float sampleRate) {
	_loopbpmconfidence = AlgorithmFactory::create("LoopBpmConfidence", "sampleRate", sampleRate);
}
LoopBpmConfidence::~LoopBpmConfidence() {
	if (_loopbpmconfidence) delete _loopbpmconfidence;
}
void LoopBpmConfidence::configure(const float sampleRate) {
	_loopbpmconfidence->configure("sampleRate", sampleRate);
}
val LoopBpmConfidence::compute(std::vector<float>& input_signal, float input_bpmEstimate) {
	_loopbpmconfidence->input("signal").set(input_signal);
	_loopbpmconfidence->input("bpmEstimate").set(input_bpmEstimate);
	float output_confidence;
	_loopbpmconfidence->output("confidence").set(output_confidence);
	_loopbpmconfidence->compute();
	val outputLoopBpmConfidence(val::object());
	outputLoopBpmConfidence.set("confidence", output_confidence);
	return outputLoopBpmConfidence;
}
void LoopBpmConfidence::reset() {
_loopbpmconfidence->reset();
}
// END LoopBpmConfidence definitions

// START LoopBpmEstimator definitions
// check https://essentia.upf.edu/reference/std_LoopBpmEstimator.html
LoopBpmEstimator::LoopBpmEstimator(const float confidenceThreshold) {
	_loopbpmestimator = AlgorithmFactory::create("LoopBpmEstimator", "confidenceThreshold", confidenceThreshold);
}
LoopBpmEstimator::~LoopBpmEstimator() {
	if (_loopbpmestimator) delete _loopbpmestimator;
}
void LoopBpmEstimator::configure(const float confidenceThreshold) {
	_loopbpmestimator->configure("confidenceThreshold", confidenceThreshold);
}
val LoopBpmEstimator::compute(std::vector<float>& input_signal) {
	_loopbpmestimator->input("signal").set(input_signal);
	float output_bpm;
	_loopbpmestimator->output("bpm").set(output_bpm);
	_loopbpmestimator->compute();
	val outputLoopBpmEstimator(val::object());
	outputLoopBpmEstimator.set("bpm", output_bpm);
	return outputLoopBpmEstimator;
}
void LoopBpmEstimator::reset() {
_loopbpmestimator->reset();
}
// END LoopBpmEstimator definitions

// START Loudness definitions
// check https://essentia.upf.edu/reference/std_Loudness.html
Loudness::Loudness() {
	_loudness = AlgorithmFactory::create("Loudness");
}
Loudness::~Loudness() {
	if (_loudness) delete _loudness;
}
void Loudness::configure() {
	_loudness->configure();
}
val Loudness::compute(std::vector<float>& input_signal) {
	_loudness->input("signal").set(input_signal);
	float output_loudness;
	_loudness->output("loudness").set(output_loudness);
	_loudness->compute();
	val outputLoudness(val::object());
	outputLoudness.set("loudness", output_loudness);
	return outputLoudness;
}
void Loudness::reset() {
_loudness->reset();
}
// END Loudness definitions

// START LoudnessVickers definitions
// check https://essentia.upf.edu/reference/std_LoudnessVickers.html
LoudnessVickers::LoudnessVickers(const float sampleRate) {
	_loudnessvickers = AlgorithmFactory::create("LoudnessVickers", "sampleRate", sampleRate);
}
LoudnessVickers::~LoudnessVickers() {
	if (_loudnessvickers) delete _loudnessvickers;
}
void LoudnessVickers::configure(const float sampleRate) {
	_loudnessvickers->configure("sampleRate", sampleRate);
}
val LoudnessVickers::compute(std::vector<float>& input_signal) {
	_loudnessvickers->input("signal").set(input_signal);
	float output_loudness;
	_loudnessvickers->output("loudness").set(output_loudness);
	_loudnessvickers->compute();
	val outputLoudnessVickers(val::object());
	outputLoudnessVickers.set("loudness", output_loudness);
	return outputLoudnessVickers;
}
void LoudnessVickers::reset() {
_loudnessvickers->reset();
}
// END LoudnessVickers definitions

// START LowLevelSpectralEqloudExtractor definitions
// check https://essentia.upf.edu/reference/std_LowLevelSpectralEqloudExtractor.html
LowLevelSpectralEqloudExtractor::LowLevelSpectralEqloudExtractor(const int frameSize, const int hopSize, const float sampleRate) {
	_lowlevelspectraleqloudextractor = AlgorithmFactory::create("LowLevelSpectralEqloudExtractor", "frameSize", frameSize, "hopSize", hopSize, "sampleRate", sampleRate);
}
LowLevelSpectralEqloudExtractor::~LowLevelSpectralEqloudExtractor() {
	if (_lowlevelspectraleqloudextractor) delete _lowlevelspectraleqloudextractor;
}
void LowLevelSpectralEqloudExtractor::configure(const int frameSize, const int hopSize, const float sampleRate) {
	_lowlevelspectraleqloudextractor->configure("frameSize", frameSize, "hopSize", hopSize, "sampleRate", sampleRate);
}
val LowLevelSpectralEqloudExtractor::compute(std::vector<float>& input_signal) {
	_lowlevelspectraleqloudextractor->input("signal").set(input_signal);
	std::vector<float> output_dissonance;
	std::vector<std::vector<float> > output_sccoeffs;
	std::vector<std::vector<float> > output_scvalleys;
	std::vector<float> output_spectral_centroid;
	std::vector<float> output_spectral_kurtosis;
	std::vector<float> output_spectral_skewness;
	std::vector<float> output_spectral_spread;
	_lowlevelspectraleqloudextractor->output("dissonance").set(output_dissonance);
	_lowlevelspectraleqloudextractor->output("sccoeffs").set(output_sccoeffs);
	_lowlevelspectraleqloudextractor->output("scvalleys").set(output_scvalleys);
	_lowlevelspectraleqloudextractor->output("spectral_centroid").set(output_spectral_centroid);
	_lowlevelspectraleqloudextractor->output("spectral_kurtosis").set(output_spectral_kurtosis);
	_lowlevelspectraleqloudextractor->output("spectral_skewness").set(output_spectral_skewness);
	_lowlevelspectraleqloudextractor->output("spectral_spread").set(output_spectral_spread);
	_lowlevelspectraleqloudextractor->compute();
	val outputLowLevelSpectralEqloudExtractor(val::object());
	outputLowLevelSpectralEqloudExtractor.set("dissonance", output_dissonance);
	outputLowLevelSpectralEqloudExtractor.set("sccoeffs", output_sccoeffs);
	outputLowLevelSpectralEqloudExtractor.set("scvalleys", output_scvalleys);
	outputLowLevelSpectralEqloudExtractor.set("spectral_centroid", output_spectral_centroid);
	outputLowLevelSpectralEqloudExtractor.set("spectral_kurtosis", output_spectral_kurtosis);
	outputLowLevelSpectralEqloudExtractor.set("spectral_skewness", output_spectral_skewness);
	outputLowLevelSpectralEqloudExtractor.set("spectral_spread", output_spectral_spread);
	return outputLowLevelSpectralEqloudExtractor;
}
void LowLevelSpectralEqloudExtractor::reset() {
_lowlevelspectraleqloudextractor->reset();
}
// END LowLevelSpectralEqloudExtractor definitions

// START LowLevelSpectralExtractor definitions
// check https://essentia.upf.edu/reference/std_LowLevelSpectralExtractor.html
LowLevelSpectralExtractor::LowLevelSpectralExtractor(const int frameSize, const int hopSize, const float sampleRate) {
	_lowlevelspectralextractor = AlgorithmFactory::create("LowLevelSpectralExtractor", "frameSize", frameSize, "hopSize", hopSize, "sampleRate", sampleRate);
}
LowLevelSpectralExtractor::~LowLevelSpectralExtractor() {
	if (_lowlevelspectralextractor) delete _lowlevelspectralextractor;
}
void LowLevelSpectralExtractor::configure(const int frameSize, const int hopSize, const float sampleRate) {
	_lowlevelspectralextractor->configure("frameSize", frameSize, "hopSize", hopSize, "sampleRate", sampleRate);
}
val LowLevelSpectralExtractor::compute(std::vector<float>& input_signal) {
	_lowlevelspectralextractor->input("signal").set(input_signal);
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
	_lowlevelspectralextractor->output("barkbands").set(output_barkbands);
	_lowlevelspectralextractor->output("barkbands_kurtosis").set(output_barkbands_kurtosis);
	_lowlevelspectralextractor->output("barkbands_skewness").set(output_barkbands_skewness);
	_lowlevelspectralextractor->output("barkbands_spread").set(output_barkbands_spread);
	_lowlevelspectralextractor->output("hfc").set(output_hfc);
	_lowlevelspectralextractor->output("mfcc").set(output_mfcc);
	_lowlevelspectralextractor->output("pitch").set(output_pitch);
	_lowlevelspectralextractor->output("pitch_instantaneous_confidence").set(output_pitch_instantaneous_confidence);
	_lowlevelspectralextractor->output("pitch_salience").set(output_pitch_salience);
	_lowlevelspectralextractor->output("silence_rate_20dB").set(output_silence_rate_20dB);
	_lowlevelspectralextractor->output("silence_rate_30dB").set(output_silence_rate_30dB);
	_lowlevelspectralextractor->output("silence_rate_60dB").set(output_silence_rate_60dB);
	_lowlevelspectralextractor->output("spectral_complexity").set(output_spectral_complexity);
	_lowlevelspectralextractor->output("spectral_crest").set(output_spectral_crest);
	_lowlevelspectralextractor->output("spectral_decrease").set(output_spectral_decrease);
	_lowlevelspectralextractor->output("spectral_energy").set(output_spectral_energy);
	_lowlevelspectralextractor->output("spectral_energyband_low").set(output_spectral_energyband_low);
	_lowlevelspectralextractor->output("spectral_energyband_middle_low").set(output_spectral_energyband_middle_low);
	_lowlevelspectralextractor->output("spectral_energyband_middle_high").set(output_spectral_energyband_middle_high);
	_lowlevelspectralextractor->output("spectral_energyband_high").set(output_spectral_energyband_high);
	_lowlevelspectralextractor->output("spectral_flatness_db").set(output_spectral_flatness_db);
	_lowlevelspectralextractor->output("spectral_flux").set(output_spectral_flux);
	_lowlevelspectralextractor->output("spectral_rms").set(output_spectral_rms);
	_lowlevelspectralextractor->output("spectral_rolloff").set(output_spectral_rolloff);
	_lowlevelspectralextractor->output("spectral_strongpeak").set(output_spectral_strongpeak);
	_lowlevelspectralextractor->output("zerocrossingrate").set(output_zerocrossingrate);
	_lowlevelspectralextractor->output("inharmonicity").set(output_inharmonicity);
	_lowlevelspectralextractor->output("tristimulus").set(output_tristimulus);
	_lowlevelspectralextractor->output("oddtoevenharmonicenergyratio").set(output_oddtoevenharmonicenergyratio);
	_lowlevelspectralextractor->compute();
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
	return outputLowLevelSpectralExtractor;
}
void LowLevelSpectralExtractor::reset() {
_lowlevelspectralextractor->reset();
}
// END LowLevelSpectralExtractor definitions

// START LowPass definitions
// check https://essentia.upf.edu/reference/std_LowPass.html
LowPass::LowPass(const float cutoffFrequency, const float sampleRate) {
	_lowpass = AlgorithmFactory::create("LowPass", "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
}
LowPass::~LowPass() {
	if (_lowpass) delete _lowpass;
}
void LowPass::configure(const float cutoffFrequency, const float sampleRate) {
	_lowpass->configure("cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
}
val LowPass::compute(std::vector<float>& input_signal) {
	_lowpass->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_lowpass->output("signal").set(output_signal);
	_lowpass->compute();
	val outputLowPass(val::object());
	outputLowPass.set("signal", output_signal);
	return outputLowPass;
}
void LowPass::reset() {
_lowpass->reset();
}
// END LowPass definitions

// START MFCC definitions
// check https://essentia.upf.edu/reference/std_MFCC.html
MFCC::MFCC(const int dctType, const float highFrequencyBound, const int inputSize, const int liftering, const std::string& logType, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const int numberCoefficients, const float sampleRate, const float silenceThreshold, const std::string& type, const std::string& warpingFormula, const std::string& weighting) {
	_mfcc = AlgorithmFactory::create("MFCC", "dctType", dctType, "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "liftering", liftering, "logType", logType, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "numberCoefficients", numberCoefficients, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold, "type", type, "warpingFormula", warpingFormula, "weighting", weighting);
}
MFCC::~MFCC() {
	if (_mfcc) delete _mfcc;
}
void MFCC::configure(const int dctType, const float highFrequencyBound, const int inputSize, const int liftering, const std::string& logType, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const int numberCoefficients, const float sampleRate, const float silenceThreshold, const std::string& type, const std::string& warpingFormula, const std::string& weighting) {
	_mfcc->configure("dctType", dctType, "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "liftering", liftering, "logType", logType, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "numberCoefficients", numberCoefficients, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold, "type", type, "warpingFormula", warpingFormula, "weighting", weighting);
}
val MFCC::compute(std::vector<float>& input_spectrum) {
	_mfcc->input("spectrum").set(input_spectrum);
	std::vector<float> output_bands;
	std::vector<float> output_mfcc;
	_mfcc->output("bands").set(output_bands);
	_mfcc->output("mfcc").set(output_mfcc);
	_mfcc->compute();
	val outputMFCC(val::object());
	outputMFCC.set("bands", output_bands);
	outputMFCC.set("mfcc", output_mfcc);
	return outputMFCC;
}
void MFCC::reset() {
_mfcc->reset();
}
// END MFCC definitions

// START MaxFilter definitions
// check https://essentia.upf.edu/reference/std_MaxFilter.html
MaxFilter::MaxFilter(const bool causal, const int width) {
	_maxfilter = AlgorithmFactory::create("MaxFilter", "causal", causal, "width", width);
}
MaxFilter::~MaxFilter() {
	if (_maxfilter) delete _maxfilter;
}
void MaxFilter::configure(const bool causal, const int width) {
	_maxfilter->configure("causal", causal, "width", width);
}
val MaxFilter::compute(std::vector<float>& input_signal) {
	_maxfilter->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_maxfilter->output("signal").set(output_signal);
	_maxfilter->compute();
	val outputMaxFilter(val::object());
	outputMaxFilter.set("signal", output_signal);
	return outputMaxFilter;
}
void MaxFilter::reset() {
_maxfilter->reset();
}
// END MaxFilter definitions

// START MaxMagFreq definitions
// check https://essentia.upf.edu/reference/std_MaxMagFreq.html
MaxMagFreq::MaxMagFreq(const float sampleRate) {
	_maxmagfreq = AlgorithmFactory::create("MaxMagFreq", "sampleRate", sampleRate);
}
MaxMagFreq::~MaxMagFreq() {
	if (_maxmagfreq) delete _maxmagfreq;
}
void MaxMagFreq::configure(const float sampleRate) {
	_maxmagfreq->configure("sampleRate", sampleRate);
}
val MaxMagFreq::compute(std::vector<float>& input_spectrum) {
	_maxmagfreq->input("spectrum").set(input_spectrum);
	float output_maxMagFreq;
	_maxmagfreq->output("maxMagFreq").set(output_maxMagFreq);
	_maxmagfreq->compute();
	val outputMaxMagFreq(val::object());
	outputMaxMagFreq.set("maxMagFreq", output_maxMagFreq);
	return outputMaxMagFreq;
}
void MaxMagFreq::reset() {
_maxmagfreq->reset();
}
// END MaxMagFreq definitions

// START MaxToTotal definitions
// check https://essentia.upf.edu/reference/std_MaxToTotal.html
MaxToTotal::MaxToTotal() {
	_maxtototal = AlgorithmFactory::create("MaxToTotal");
}
MaxToTotal::~MaxToTotal() {
	if (_maxtototal) delete _maxtototal;
}
void MaxToTotal::configure() {
	_maxtototal->configure();
}
val MaxToTotal::compute(std::vector<float>& input_envelope) {
	_maxtototal->input("envelope").set(input_envelope);
	float output_maxToTotal;
	_maxtototal->output("maxToTotal").set(output_maxToTotal);
	_maxtototal->compute();
	val outputMaxToTotal(val::object());
	outputMaxToTotal.set("maxToTotal", output_maxToTotal);
	return outputMaxToTotal;
}
void MaxToTotal::reset() {
_maxtototal->reset();
}
// END MaxToTotal definitions

// START Mean definitions
// check https://essentia.upf.edu/reference/std_Mean.html
Mean::Mean() {
	_mean = AlgorithmFactory::create("Mean");
}
Mean::~Mean() {
	if (_mean) delete _mean;
}
void Mean::configure() {
	_mean->configure();
}
val Mean::compute(std::vector<float>& input_array) {
	_mean->input("array").set(input_array);
	float output_mean;
	_mean->output("mean").set(output_mean);
	_mean->compute();
	val outputMean(val::object());
	outputMean.set("mean", output_mean);
	return outputMean;
}
void Mean::reset() {
_mean->reset();
}
// END Mean definitions

// START Median definitions
// check https://essentia.upf.edu/reference/std_Median.html
Median::Median() {
	_median = AlgorithmFactory::create("Median");
}
Median::~Median() {
	if (_median) delete _median;
}
void Median::configure() {
	_median->configure();
}
val Median::compute(std::vector<float>& input_array) {
	_median->input("array").set(input_array);
	float output_median;
	_median->output("median").set(output_median);
	_median->compute();
	val outputMedian(val::object());
	outputMedian.set("median", output_median);
	return outputMedian;
}
void Median::reset() {
_median->reset();
}
// END Median definitions

// START MedianFilter definitions
// check https://essentia.upf.edu/reference/std_MedianFilter.html
MedianFilter::MedianFilter(const int kernelSize) {
	_medianfilter = AlgorithmFactory::create("MedianFilter", "kernelSize", kernelSize);
}
MedianFilter::~MedianFilter() {
	if (_medianfilter) delete _medianfilter;
}
void MedianFilter::configure(const int kernelSize) {
	_medianfilter->configure("kernelSize", kernelSize);
}
val MedianFilter::compute(std::vector<float>& input_array) {
	_medianfilter->input("array").set(input_array);
	std::vector<float> output_filteredArray;
	_medianfilter->output("filteredArray").set(output_filteredArray);
	_medianfilter->compute();
	val outputMedianFilter(val::object());
	outputMedianFilter.set("filteredArray", output_filteredArray);
	return outputMedianFilter;
}
void MedianFilter::reset() {
_medianfilter->reset();
}
// END MedianFilter definitions

// START MelBands definitions
// check https://essentia.upf.edu/reference/std_MelBands.html
MelBands::MelBands(const float highFrequencyBound, const int inputSize, const bool log, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const float sampleRate, const std::string& type, const std::string& warpingFormula, const std::string& weighting) {
	_melbands = AlgorithmFactory::create("MelBands", "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "log", log, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "sampleRate", sampleRate, "type", type, "warpingFormula", warpingFormula, "weighting", weighting);
}
MelBands::~MelBands() {
	if (_melbands) delete _melbands;
}
void MelBands::configure(const float highFrequencyBound, const int inputSize, const bool log, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const float sampleRate, const std::string& type, const std::string& warpingFormula, const std::string& weighting) {
	_melbands->configure("highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "log", log, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "sampleRate", sampleRate, "type", type, "warpingFormula", warpingFormula, "weighting", weighting);
}
val MelBands::compute(std::vector<float>& input_spectrum) {
	_melbands->input("spectrum").set(input_spectrum);
	std::vector<float> output_bands;
	_melbands->output("bands").set(output_bands);
	_melbands->compute();
	val outputMelBands(val::object());
	outputMelBands.set("bands", output_bands);
	return outputMelBands;
}
void MelBands::reset() {
_melbands->reset();
}
// END MelBands definitions

// START Meter definitions
// check https://essentia.upf.edu/reference/std_Meter.html
Meter::Meter() {
	_meter = AlgorithmFactory::create("Meter");
}
Meter::~Meter() {
	if (_meter) delete _meter;
}
void Meter::configure() {
	_meter->configure();
}
val Meter::compute(std::vector<std::vector<float> >& input_beatogram) {
	_meter->input("beatogram").set(input_beatogram);
	float output_meter;
	_meter->output("meter").set(output_meter);
	_meter->compute();
	val outputMeter(val::object());
	outputMeter.set("meter", output_meter);
	return outputMeter;
}
void Meter::reset() {
_meter->reset();
}
// END Meter definitions

// START MinMax definitions
// check https://essentia.upf.edu/reference/std_MinMax.html
MinMax::MinMax(const std::string& type) {
	_minmax = AlgorithmFactory::create("MinMax", "type", type);
}
MinMax::~MinMax() {
	if (_minmax) delete _minmax;
}
void MinMax::configure(const std::string& type) {
	_minmax->configure("type", type);
}
val MinMax::compute(std::vector<float>& input_array) {
	_minmax->input("array").set(input_array);
	float output_real;
	int output_int;
	_minmax->output("real").set(output_real);
	_minmax->output("int").set(output_int);
	_minmax->compute();
	val outputMinMax(val::object());
	outputMinMax.set("real", output_real);
	outputMinMax.set("int", output_int);
	return outputMinMax;
}
void MinMax::reset() {
_minmax->reset();
}
// END MinMax definitions

// START MinToTotal definitions
// check https://essentia.upf.edu/reference/std_MinToTotal.html
MinToTotal::MinToTotal() {
	_mintototal = AlgorithmFactory::create("MinToTotal");
}
MinToTotal::~MinToTotal() {
	if (_mintototal) delete _mintototal;
}
void MinToTotal::configure() {
	_mintototal->configure();
}
val MinToTotal::compute(std::vector<float>& input_envelope) {
	_mintototal->input("envelope").set(input_envelope);
	float output_minToTotal;
	_mintototal->output("minToTotal").set(output_minToTotal);
	_mintototal->compute();
	val outputMinToTotal(val::object());
	outputMinToTotal.set("minToTotal", output_minToTotal);
	return outputMinToTotal;
}
void MinToTotal::reset() {
_mintototal->reset();
}
// END MinToTotal definitions

// START MovingAverage definitions
// check https://essentia.upf.edu/reference/std_MovingAverage.html
MovingAverage::MovingAverage(const int size) {
	_movingaverage = AlgorithmFactory::create("MovingAverage", "size", size);
}
MovingAverage::~MovingAverage() {
	if (_movingaverage) delete _movingaverage;
}
void MovingAverage::configure(const int size) {
	_movingaverage->configure("size", size);
}
val MovingAverage::compute(std::vector<float>& input_signal) {
	_movingaverage->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_movingaverage->output("signal").set(output_signal);
	_movingaverage->compute();
	val outputMovingAverage(val::object());
	outputMovingAverage.set("signal", output_signal);
	return outputMovingAverage;
}
void MovingAverage::reset() {
_movingaverage->reset();
}
// END MovingAverage definitions

// START MultiPitchKlapuri definitions
// check https://essentia.upf.edu/reference/std_MultiPitchKlapuri.html
MultiPitchKlapuri::MultiPitchKlapuri(const float binResolution, const int frameSize, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const int magnitudeThreshold, const float maxFrequency, const float minFrequency, const int numberHarmonics, const float referenceFrequency, const float sampleRate) {
	_multipitchklapuri = AlgorithmFactory::create("MultiPitchKlapuri", "binResolution", binResolution, "frameSize", frameSize, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "numberHarmonics", numberHarmonics, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate);
}
MultiPitchKlapuri::~MultiPitchKlapuri() {
	if (_multipitchklapuri) delete _multipitchklapuri;
}
void MultiPitchKlapuri::configure(const float binResolution, const int frameSize, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const int magnitudeThreshold, const float maxFrequency, const float minFrequency, const int numberHarmonics, const float referenceFrequency, const float sampleRate) {
	_multipitchklapuri->configure("binResolution", binResolution, "frameSize", frameSize, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "numberHarmonics", numberHarmonics, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate);
}
val MultiPitchKlapuri::compute(std::vector<float>& input_signal) {
	_multipitchklapuri->input("signal").set(input_signal);
	std::vector<std::vector<float> > output_pitch;
	_multipitchklapuri->output("pitch").set(output_pitch);
	_multipitchklapuri->compute();
	val outputMultiPitchKlapuri(val::object());
	outputMultiPitchKlapuri.set("pitch", output_pitch);
	return outputMultiPitchKlapuri;
}
void MultiPitchKlapuri::reset() {
_multipitchklapuri->reset();
}
// END MultiPitchKlapuri definitions

// START MultiPitchMelodia definitions
// check https://essentia.upf.edu/reference/std_MultiPitchMelodia.html
MultiPitchMelodia::MultiPitchMelodia(const float binResolution, const int filterIterations, const int frameSize, const bool guessUnvoiced, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const int magnitudeThreshold, const float maxFrequency, const int minDuration, const float minFrequency, const int numberHarmonics, const float peakDistributionThreshold, const float peakFrameThreshold, const float pitchContinuity, const float referenceFrequency, const float sampleRate, const int timeContinuity) {
	_multipitchmelodia = AlgorithmFactory::create("MultiPitchMelodia", "binResolution", binResolution, "filterIterations", filterIterations, "frameSize", frameSize, "guessUnvoiced", guessUnvoiced, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "minDuration", minDuration, "minFrequency", minFrequency, "numberHarmonics", numberHarmonics, "peakDistributionThreshold", peakDistributionThreshold, "peakFrameThreshold", peakFrameThreshold, "pitchContinuity", pitchContinuity, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "timeContinuity", timeContinuity);
}
MultiPitchMelodia::~MultiPitchMelodia() {
	if (_multipitchmelodia) delete _multipitchmelodia;
}
void MultiPitchMelodia::configure(const float binResolution, const int filterIterations, const int frameSize, const bool guessUnvoiced, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const int magnitudeThreshold, const float maxFrequency, const int minDuration, const float minFrequency, const int numberHarmonics, const float peakDistributionThreshold, const float peakFrameThreshold, const float pitchContinuity, const float referenceFrequency, const float sampleRate, const int timeContinuity) {
	if (_multipitchmelodia) delete _multipitchmelodia;
	_multipitchmelodia = AlgorithmFactory::create("MultiPitchMelodia", "binResolution", binResolution, "filterIterations", filterIterations, "frameSize", frameSize, "guessUnvoiced", guessUnvoiced, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "minDuration", minDuration, "minFrequency", minFrequency, "numberHarmonics", numberHarmonics, "peakDistributionThreshold", peakDistributionThreshold, "peakFrameThreshold", peakFrameThreshold, "pitchContinuity", pitchContinuity, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "timeContinuity", timeContinuity);
}
val MultiPitchMelodia::compute(std::vector<float>& input_signal) {
	_multipitchmelodia->input("signal").set(input_signal);
	std::vector<std::vector<float> > output_pitch;
	_multipitchmelodia->output("pitch").set(output_pitch);
	_multipitchmelodia->compute();
	val outputMultiPitchMelodia(val::object());
	outputMultiPitchMelodia.set("pitch", output_pitch);
	return outputMultiPitchMelodia;
}
void MultiPitchMelodia::reset() {
_multipitchmelodia->reset();
}
// END MultiPitchMelodia definitions

// START Multiplexer definitions
// check https://essentia.upf.edu/reference/std_Multiplexer.html
Multiplexer::Multiplexer(const int numberRealInputs, const int numberVectorRealInputs) {
	_multiplexer = AlgorithmFactory::create("Multiplexer", "numberRealInputs", numberRealInputs, "numberVectorRealInputs", numberVectorRealInputs);
}
Multiplexer::~Multiplexer() {
	if (_multiplexer) delete _multiplexer;
}
void Multiplexer::configure(const int numberRealInputs, const int numberVectorRealInputs) {
	_multiplexer->configure("numberRealInputs", numberRealInputs, "numberVectorRealInputs", numberVectorRealInputs);
}
val Multiplexer::compute() {
	std::vector<std::vector<float> > output_data;
	_multiplexer->output("data").set(output_data);
	_multiplexer->compute();
	val outputMultiplexer(val::object());
	outputMultiplexer.set("data", output_data);
	return outputMultiplexer;
}
void Multiplexer::reset() {
_multiplexer->reset();
}
// END Multiplexer definitions

// START NNLSChroma definitions
// check https://essentia.upf.edu/reference/std_NNLSChroma.html
NNLSChroma::NNLSChroma(const std::string& chromaNormalization, const int frameSize, const float sampleRate, const float spectralShape, const float spectralWhitening, const std::string& tuningMode, const bool useNNLS) {
	_nnlschroma = AlgorithmFactory::create("NNLSChroma", "chromaNormalization", chromaNormalization, "frameSize", frameSize, "sampleRate", sampleRate, "spectralShape", spectralShape, "spectralWhitening", spectralWhitening, "tuningMode", tuningMode, "useNNLS", useNNLS);
}
NNLSChroma::~NNLSChroma() {
	if (_nnlschroma) delete _nnlschroma;
}
void NNLSChroma::configure(const std::string& chromaNormalization, const int frameSize, const float sampleRate, const float spectralShape, const float spectralWhitening, const std::string& tuningMode, const bool useNNLS) {
	_nnlschroma->configure("chromaNormalization", chromaNormalization, "frameSize", frameSize, "sampleRate", sampleRate, "spectralShape", spectralShape, "spectralWhitening", spectralWhitening, "tuningMode", tuningMode, "useNNLS", useNNLS);
}
val NNLSChroma::compute(std::vector<std::vector<float> >& input_logSpectrogram, std::vector<float>& input_meanTuning, std::vector<float>& input_localTuning) {
	_nnlschroma->input("logSpectrogram").set(input_logSpectrogram);
	_nnlschroma->input("meanTuning").set(input_meanTuning);
	_nnlschroma->input("localTuning").set(input_localTuning);
	std::vector<std::vector<float> > output_tunedLogfreqSpectrum;
	std::vector<std::vector<float> > output_semitoneSpectrum;
	std::vector<std::vector<float> > output_bassChromagram;
	std::vector<std::vector<float> > output_chromagram;
	_nnlschroma->output("tunedLogfreqSpectrum").set(output_tunedLogfreqSpectrum);
	_nnlschroma->output("semitoneSpectrum").set(output_semitoneSpectrum);
	_nnlschroma->output("bassChromagram").set(output_bassChromagram);
	_nnlschroma->output("chromagram").set(output_chromagram);
	_nnlschroma->compute();
	val outputNNLSChroma(val::object());
	outputNNLSChroma.set("tunedLogfreqSpectrum", output_tunedLogfreqSpectrum);
	outputNNLSChroma.set("semitoneSpectrum", output_semitoneSpectrum);
	outputNNLSChroma.set("bassChromagram", output_bassChromagram);
	outputNNLSChroma.set("chromagram", output_chromagram);
	return outputNNLSChroma;
}
void NNLSChroma::reset() {
_nnlschroma->reset();
}
// END NNLSChroma definitions

// START NoiseAdder definitions
// check https://essentia.upf.edu/reference/std_NoiseAdder.html
NoiseAdder::NoiseAdder(const bool fixSeed, const int level) {
	_noiseadder = AlgorithmFactory::create("NoiseAdder", "fixSeed", fixSeed, "level", level);
}
NoiseAdder::~NoiseAdder() {
	if (_noiseadder) delete _noiseadder;
}
void NoiseAdder::configure(const bool fixSeed, const int level) {
	_noiseadder->configure("fixSeed", fixSeed, "level", level);
}
val NoiseAdder::compute(std::vector<float>& input_signal) {
	_noiseadder->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_noiseadder->output("signal").set(output_signal);
	_noiseadder->compute();
	val outputNoiseAdder(val::object());
	outputNoiseAdder.set("signal", output_signal);
	return outputNoiseAdder;
}
void NoiseAdder::reset() {
_noiseadder->reset();
}
// END NoiseAdder definitions

// START NoiseBurstDetector definitions
// check https://essentia.upf.edu/reference/std_NoiseBurstDetector.html
NoiseBurstDetector::NoiseBurstDetector(const float alpha, const int silenceThreshold, const int threshold) {
	_noiseburstdetector = AlgorithmFactory::create("NoiseBurstDetector", "alpha", alpha, "silenceThreshold", silenceThreshold, "threshold", threshold);
}
NoiseBurstDetector::~NoiseBurstDetector() {
	if (_noiseburstdetector) delete _noiseburstdetector;
}
void NoiseBurstDetector::configure(const float alpha, const int silenceThreshold, const int threshold) {
	_noiseburstdetector->configure("alpha", alpha, "silenceThreshold", silenceThreshold, "threshold", threshold);
}
val NoiseBurstDetector::compute(std::vector<float>& input_frame) {
	_noiseburstdetector->input("frame").set(input_frame);
	std::vector<float> output_indexes;
	_noiseburstdetector->output("indexes").set(output_indexes);
	_noiseburstdetector->compute();
	val outputNoiseBurstDetector(val::object());
	outputNoiseBurstDetector.set("indexes", output_indexes);
	return outputNoiseBurstDetector;
}
void NoiseBurstDetector::reset() {
_noiseburstdetector->reset();
}
// END NoiseBurstDetector definitions

// START NoveltyCurve definitions
// check https://essentia.upf.edu/reference/std_NoveltyCurve.html
NoveltyCurve::NoveltyCurve(const float frameRate, const bool normalize, const std::vector<float>& weightCurve, const std::string& weightCurveType) {
	_noveltycurve = AlgorithmFactory::create("NoveltyCurve", "frameRate", frameRate, "normalize", normalize, "weightCurve", weightCurve, "weightCurveType", weightCurveType);
}
NoveltyCurve::~NoveltyCurve() {
	if (_noveltycurve) delete _noveltycurve;
}
void NoveltyCurve::configure(const float frameRate, const bool normalize, const std::vector<float>& weightCurve, const std::string& weightCurveType) {
	_noveltycurve->configure("frameRate", frameRate, "normalize", normalize, "weightCurve", weightCurve, "weightCurveType", weightCurveType);
}
val NoveltyCurve::compute(std::vector<std::vector<float> >& input_frequencyBands) {
	_noveltycurve->input("frequencyBands").set(input_frequencyBands);
	std::vector<float> output_novelty;
	_noveltycurve->output("novelty").set(output_novelty);
	_noveltycurve->compute();
	val outputNoveltyCurve(val::object());
	outputNoveltyCurve.set("novelty", output_novelty);
	return outputNoveltyCurve;
}
void NoveltyCurve::reset() {
_noveltycurve->reset();
}
// END NoveltyCurve definitions

// START NoveltyCurveFixedBpmEstimator definitions
// check https://essentia.upf.edu/reference/std_NoveltyCurveFixedBpmEstimator.html
NoveltyCurveFixedBpmEstimator::NoveltyCurveFixedBpmEstimator(const int hopSize, const float maxBpm, const float minBpm, const float sampleRate, const float tolerance) {
	_noveltycurvefixedbpmestimator = AlgorithmFactory::create("NoveltyCurveFixedBpmEstimator", "hopSize", hopSize, "maxBpm", maxBpm, "minBpm", minBpm, "sampleRate", sampleRate, "tolerance", tolerance);
}
NoveltyCurveFixedBpmEstimator::~NoveltyCurveFixedBpmEstimator() {
	if (_noveltycurvefixedbpmestimator) delete _noveltycurvefixedbpmestimator;
}
void NoveltyCurveFixedBpmEstimator::configure(const int hopSize, const float maxBpm, const float minBpm, const float sampleRate, const float tolerance) {
	_noveltycurvefixedbpmestimator->configure("hopSize", hopSize, "maxBpm", maxBpm, "minBpm", minBpm, "sampleRate", sampleRate, "tolerance", tolerance);
}
val NoveltyCurveFixedBpmEstimator::compute(std::vector<float>& input_novelty) {
	_noveltycurvefixedbpmestimator->input("novelty").set(input_novelty);
	std::vector<float> output_bpms;
	std::vector<float> output_amplitudes;
	_noveltycurvefixedbpmestimator->output("bpms").set(output_bpms);
	_noveltycurvefixedbpmestimator->output("amplitudes").set(output_amplitudes);
	_noveltycurvefixedbpmestimator->compute();
	val outputNoveltyCurveFixedBpmEstimator(val::object());
	outputNoveltyCurveFixedBpmEstimator.set("bpms", output_bpms);
	outputNoveltyCurveFixedBpmEstimator.set("amplitudes", output_amplitudes);
	return outputNoveltyCurveFixedBpmEstimator;
}
void NoveltyCurveFixedBpmEstimator::reset() {
_noveltycurvefixedbpmestimator->reset();
}
// END NoveltyCurveFixedBpmEstimator definitions

// START OddToEvenHarmonicEnergyRatio definitions
// check https://essentia.upf.edu/reference/std_OddToEvenHarmonicEnergyRatio.html
OddToEvenHarmonicEnergyRatio::OddToEvenHarmonicEnergyRatio() {
	_oddtoevenharmonicenergyratio = AlgorithmFactory::create("OddToEvenHarmonicEnergyRatio");
}
OddToEvenHarmonicEnergyRatio::~OddToEvenHarmonicEnergyRatio() {
	if (_oddtoevenharmonicenergyratio) delete _oddtoevenharmonicenergyratio;
}
void OddToEvenHarmonicEnergyRatio::configure() {
	_oddtoevenharmonicenergyratio->configure();
}
val OddToEvenHarmonicEnergyRatio::compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
	_oddtoevenharmonicenergyratio->input("frequencies").set(input_frequencies);
	_oddtoevenharmonicenergyratio->input("magnitudes").set(input_magnitudes);
	float output_oddToEvenHarmonicEnergyRatio;
	_oddtoevenharmonicenergyratio->output("oddToEvenHarmonicEnergyRatio").set(output_oddToEvenHarmonicEnergyRatio);
	_oddtoevenharmonicenergyratio->compute();
	val outputOddToEvenHarmonicEnergyRatio(val::object());
	outputOddToEvenHarmonicEnergyRatio.set("oddToEvenHarmonicEnergyRatio", output_oddToEvenHarmonicEnergyRatio);
	return outputOddToEvenHarmonicEnergyRatio;
}
void OddToEvenHarmonicEnergyRatio::reset() {
_oddtoevenharmonicenergyratio->reset();
}
// END OddToEvenHarmonicEnergyRatio definitions

// START OnsetDetection definitions
// check https://essentia.upf.edu/reference/std_OnsetDetection.html
OnsetDetection::OnsetDetection(const std::string& method, const float sampleRate) {
	_onsetdetection = AlgorithmFactory::create("OnsetDetection", "method", method, "sampleRate", sampleRate);
}
OnsetDetection::~OnsetDetection() {
	if (_onsetdetection) delete _onsetdetection;
}
void OnsetDetection::configure(const std::string& method, const float sampleRate) {
	_onsetdetection->configure("method", method, "sampleRate", sampleRate);
}
val OnsetDetection::compute(std::vector<float>& input_spectrum, std::vector<float>& input_phase) {
	_onsetdetection->input("spectrum").set(input_spectrum);
	_onsetdetection->input("phase").set(input_phase);
	float output_onsetDetection;
	_onsetdetection->output("onsetDetection").set(output_onsetDetection);
	_onsetdetection->compute();
	val outputOnsetDetection(val::object());
	outputOnsetDetection.set("onsetDetection", output_onsetDetection);
	return outputOnsetDetection;
}
void OnsetDetection::reset() {
_onsetdetection->reset();
}
// END OnsetDetection definitions

// START OnsetDetectionGlobal definitions
// check https://essentia.upf.edu/reference/std_OnsetDetectionGlobal.html
OnsetDetectionGlobal::OnsetDetectionGlobal(const int frameSize, const int hopSize, const std::string& method, const float sampleRate) {
	_onsetdetectionglobal = AlgorithmFactory::create("OnsetDetectionGlobal", "frameSize", frameSize, "hopSize", hopSize, "method", method, "sampleRate", sampleRate);
}
OnsetDetectionGlobal::~OnsetDetectionGlobal() {
	if (_onsetdetectionglobal) delete _onsetdetectionglobal;
}
void OnsetDetectionGlobal::configure(const int frameSize, const int hopSize, const std::string& method, const float sampleRate) {
	_onsetdetectionglobal->configure("frameSize", frameSize, "hopSize", hopSize, "method", method, "sampleRate", sampleRate);
}
val OnsetDetectionGlobal::compute(std::vector<float>& input_signal) {
	_onsetdetectionglobal->input("signal").set(input_signal);
	std::vector<float> output_onsetDetections;
	_onsetdetectionglobal->output("onsetDetections").set(output_onsetDetections);
	_onsetdetectionglobal->compute();
	val outputOnsetDetectionGlobal(val::object());
	outputOnsetDetectionGlobal.set("onsetDetections", output_onsetDetections);
	return outputOnsetDetectionGlobal;
}
void OnsetDetectionGlobal::reset() {
_onsetdetectionglobal->reset();
}
// END OnsetDetectionGlobal definitions

// START OnsetRate definitions
// check https://essentia.upf.edu/reference/std_OnsetRate.html
OnsetRate::OnsetRate() {
	_onsetrate = AlgorithmFactory::create("OnsetRate");
}
OnsetRate::~OnsetRate() {
	if (_onsetrate) delete _onsetrate;
}
void OnsetRate::configure() {
	_onsetrate->configure();
}
val OnsetRate::compute(std::vector<float>& input_signal) {
	_onsetrate->input("signal").set(input_signal);
	std::vector<float> output_onsets;
	float output_onsetRate;
	_onsetrate->output("onsets").set(output_onsets);
	_onsetrate->output("onsetRate").set(output_onsetRate);
	_onsetrate->compute();
	val outputOnsetRate(val::object());
	outputOnsetRate.set("onsets", output_onsets);
	outputOnsetRate.set("onsetRate", output_onsetRate);
	return outputOnsetRate;
}
void OnsetRate::reset() {
_onsetrate->reset();
}
// END OnsetRate definitions

// START OverlapAdd definitions
// check https://essentia.upf.edu/reference/std_OverlapAdd.html
OverlapAdd::OverlapAdd(const int frameSize, const float gain, const int hopSize) {
	_overlapadd = AlgorithmFactory::create("OverlapAdd", "frameSize", frameSize, "gain", gain, "hopSize", hopSize);
}
OverlapAdd::~OverlapAdd() {
	if (_overlapadd) delete _overlapadd;
}
void OverlapAdd::configure(const int frameSize, const float gain, const int hopSize) {
	_overlapadd->configure("frameSize", frameSize, "gain", gain, "hopSize", hopSize);
}
val OverlapAdd::compute(std::vector<float>& input_signal) {
	_overlapadd->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_overlapadd->output("signal").set(output_signal);
	_overlapadd->compute();
	val outputOverlapAdd(val::object());
	outputOverlapAdd.set("signal", output_signal);
	return outputOverlapAdd;
}
void OverlapAdd::reset() {
_overlapadd->reset();
}
// END OverlapAdd definitions

// START PeakDetection definitions
// check https://essentia.upf.edu/reference/std_PeakDetection.html
PeakDetection::PeakDetection(const bool interpolate, const int maxPeaks, const float maxPosition, const float minPeakDistance, const float minPosition, const std::string& orderBy, const float range, const float threshold) {
	_peakdetection = AlgorithmFactory::create("PeakDetection", "interpolate", interpolate, "maxPeaks", maxPeaks, "maxPosition", maxPosition, "minPeakDistance", minPeakDistance, "minPosition", minPosition, "orderBy", orderBy, "range", range, "threshold", threshold);
}
PeakDetection::~PeakDetection() {
	if (_peakdetection) delete _peakdetection;
}
void PeakDetection::configure(const bool interpolate, const int maxPeaks, const float maxPosition, const float minPeakDistance, const float minPosition, const std::string& orderBy, const float range, const float threshold) {
	_peakdetection->configure("interpolate", interpolate, "maxPeaks", maxPeaks, "maxPosition", maxPosition, "minPeakDistance", minPeakDistance, "minPosition", minPosition, "orderBy", orderBy, "range", range, "threshold", threshold);
}
val PeakDetection::compute(std::vector<float>& input_array) {
	_peakdetection->input("array").set(input_array);
	std::vector<float> output_positions;
	std::vector<float> output_amplitudes;
	_peakdetection->output("positions").set(output_positions);
	_peakdetection->output("amplitudes").set(output_amplitudes);
	_peakdetection->compute();
	val outputPeakDetection(val::object());
	outputPeakDetection.set("positions", output_positions);
	outputPeakDetection.set("amplitudes", output_amplitudes);
	return outputPeakDetection;
}
void PeakDetection::reset() {
_peakdetection->reset();
}
// END PeakDetection definitions

// START PercivalBpmEstimator definitions
// check https://essentia.upf.edu/reference/std_PercivalBpmEstimator.html
PercivalBpmEstimator::PercivalBpmEstimator(const int frameSize, const int frameSizeOSS, const int hopSize, const int hopSizeOSS, const int maxBPM, const int minBPM, const int sampleRate) {
	_percivalbpmestimator = AlgorithmFactory::create("PercivalBpmEstimator", "frameSize", frameSize, "frameSizeOSS", frameSizeOSS, "hopSize", hopSize, "hopSizeOSS", hopSizeOSS, "maxBPM", maxBPM, "minBPM", minBPM, "sampleRate", sampleRate);
}
PercivalBpmEstimator::~PercivalBpmEstimator() {
	if (_percivalbpmestimator) delete _percivalbpmestimator;
}
void PercivalBpmEstimator::configure(const int frameSize, const int frameSizeOSS, const int hopSize, const int hopSizeOSS, const int maxBPM, const int minBPM, const int sampleRate) {
	_percivalbpmestimator->configure("frameSize", frameSize, "frameSizeOSS", frameSizeOSS, "hopSize", hopSize, "hopSizeOSS", hopSizeOSS, "maxBPM", maxBPM, "minBPM", minBPM, "sampleRate", sampleRate);
}
val PercivalBpmEstimator::compute(std::vector<float>& input_signal) {
	_percivalbpmestimator->input("signal").set(input_signal);
	float output_bpm;
	_percivalbpmestimator->output("bpm").set(output_bpm);
	_percivalbpmestimator->compute();
	val outputPercivalBpmEstimator(val::object());
	outputPercivalBpmEstimator.set("bpm", output_bpm);
	return outputPercivalBpmEstimator;
}
void PercivalBpmEstimator::reset() {
_percivalbpmestimator->reset();
}
// END PercivalBpmEstimator definitions

// START PercivalEnhanceHarmonics definitions
// check https://essentia.upf.edu/reference/std_PercivalEnhanceHarmonics.html
PercivalEnhanceHarmonics::PercivalEnhanceHarmonics() {
	_percivalenhanceharmonics = AlgorithmFactory::create("PercivalEnhanceHarmonics");
}
PercivalEnhanceHarmonics::~PercivalEnhanceHarmonics() {
	if (_percivalenhanceharmonics) delete _percivalenhanceharmonics;
}
void PercivalEnhanceHarmonics::configure() {
	_percivalenhanceharmonics->configure();
}
val PercivalEnhanceHarmonics::compute(std::vector<float>& input_array) {
	_percivalenhanceharmonics->input("array").set(input_array);
	std::vector<float> output_array;
	_percivalenhanceharmonics->output("array").set(output_array);
	_percivalenhanceharmonics->compute();
	val outputPercivalEnhanceHarmonics(val::object());
	outputPercivalEnhanceHarmonics.set("array", output_array);
	return outputPercivalEnhanceHarmonics;
}
void PercivalEnhanceHarmonics::reset() {
_percivalenhanceharmonics->reset();
}
// END PercivalEnhanceHarmonics definitions

// START PercivalEvaluatePulseTrains definitions
// check https://essentia.upf.edu/reference/std_PercivalEvaluatePulseTrains.html
PercivalEvaluatePulseTrains::PercivalEvaluatePulseTrains() {
	_percivalevaluatepulsetrains = AlgorithmFactory::create("PercivalEvaluatePulseTrains");
}
PercivalEvaluatePulseTrains::~PercivalEvaluatePulseTrains() {
	if (_percivalevaluatepulsetrains) delete _percivalevaluatepulsetrains;
}
void PercivalEvaluatePulseTrains::configure() {
	_percivalevaluatepulsetrains->configure();
}
val PercivalEvaluatePulseTrains::compute(std::vector<float>& input_oss, std::vector<float>& input_positions) {
	_percivalevaluatepulsetrains->input("oss").set(input_oss);
	_percivalevaluatepulsetrains->input("positions").set(input_positions);
	float output_lag;
	_percivalevaluatepulsetrains->output("lag").set(output_lag);
	_percivalevaluatepulsetrains->compute();
	val outputPercivalEvaluatePulseTrains(val::object());
	outputPercivalEvaluatePulseTrains.set("lag", output_lag);
	return outputPercivalEvaluatePulseTrains;
}
void PercivalEvaluatePulseTrains::reset() {
_percivalevaluatepulsetrains->reset();
}
// END PercivalEvaluatePulseTrains definitions

// START PitchContourSegmentation definitions
// check https://essentia.upf.edu/reference/std_PitchContourSegmentation.html
PitchContourSegmentation::PitchContourSegmentation(const int hopSize, const float minDuration, const int pitchDistanceThreshold, const int rmsThreshold, const int sampleRate, const int tuningFrequency) {
	_pitchcontoursegmentation = AlgorithmFactory::create("PitchContourSegmentation", "hopSize", hopSize, "minDuration", minDuration, "pitchDistanceThreshold", pitchDistanceThreshold, "rmsThreshold", rmsThreshold, "sampleRate", sampleRate, "tuningFrequency", tuningFrequency);
}
PitchContourSegmentation::~PitchContourSegmentation() {
	if (_pitchcontoursegmentation) delete _pitchcontoursegmentation;
}
void PitchContourSegmentation::configure(const int hopSize, const float minDuration, const int pitchDistanceThreshold, const int rmsThreshold, const int sampleRate, const int tuningFrequency) {
	_pitchcontoursegmentation->configure("hopSize", hopSize, "minDuration", minDuration, "pitchDistanceThreshold", pitchDistanceThreshold, "rmsThreshold", rmsThreshold, "sampleRate", sampleRate, "tuningFrequency", tuningFrequency);
}
val PitchContourSegmentation::compute(std::vector<float>& input_pitch, std::vector<float>& input_signal) {
	_pitchcontoursegmentation->input("pitch").set(input_pitch);
	_pitchcontoursegmentation->input("signal").set(input_signal);
	std::vector<float> output_onset;
	std::vector<float> output_duration;
	std::vector<float> output_MIDIpitch;
	_pitchcontoursegmentation->output("onset").set(output_onset);
	_pitchcontoursegmentation->output("duration").set(output_duration);
	_pitchcontoursegmentation->output("MIDIpitch").set(output_MIDIpitch);
	_pitchcontoursegmentation->compute();
	val outputPitchContourSegmentation(val::object());
	outputPitchContourSegmentation.set("onset", output_onset);
	outputPitchContourSegmentation.set("duration", output_duration);
	outputPitchContourSegmentation.set("MIDIpitch", output_MIDIpitch);
	return outputPitchContourSegmentation;
}
void PitchContourSegmentation::reset() {
_pitchcontoursegmentation->reset();
}
// END PitchContourSegmentation definitions

// START PitchContours definitions
// check https://essentia.upf.edu/reference/std_PitchContours.html
PitchContours::PitchContours(const float binResolution, const int hopSize, const float minDuration, const float peakDistributionThreshold, const float peakFrameThreshold, const float pitchContinuity, const float sampleRate, const float timeContinuity) {
	_pitchcontours = AlgorithmFactory::create("PitchContours", "binResolution", binResolution, "hopSize", hopSize, "minDuration", minDuration, "peakDistributionThreshold", peakDistributionThreshold, "peakFrameThreshold", peakFrameThreshold, "pitchContinuity", pitchContinuity, "sampleRate", sampleRate, "timeContinuity", timeContinuity);
}
PitchContours::~PitchContours() {
	if (_pitchcontours) delete _pitchcontours;
}
void PitchContours::configure(const float binResolution, const int hopSize, const float minDuration, const float peakDistributionThreshold, const float peakFrameThreshold, const float pitchContinuity, const float sampleRate, const float timeContinuity) {
	_pitchcontours->configure("binResolution", binResolution, "hopSize", hopSize, "minDuration", minDuration, "peakDistributionThreshold", peakDistributionThreshold, "peakFrameThreshold", peakFrameThreshold, "pitchContinuity", pitchContinuity, "sampleRate", sampleRate, "timeContinuity", timeContinuity);
}
val PitchContours::compute(std::vector<std::vector<float> >& input_peakBins, std::vector<std::vector<float> >& input_peakSaliences) {
	_pitchcontours->input("peakBins").set(input_peakBins);
	_pitchcontours->input("peakSaliences").set(input_peakSaliences);
	std::vector<std::vector<float> > output_contoursBins;
	std::vector<std::vector<float> > output_contoursSaliences;
	std::vector<float> output_contoursStartTimes;
	float output_duration;
	_pitchcontours->output("contoursBins").set(output_contoursBins);
	_pitchcontours->output("contoursSaliences").set(output_contoursSaliences);
	_pitchcontours->output("contoursStartTimes").set(output_contoursStartTimes);
	_pitchcontours->output("duration").set(output_duration);
	_pitchcontours->compute();
	val outputPitchContours(val::object());
	outputPitchContours.set("contoursBins", output_contoursBins);
	outputPitchContours.set("contoursSaliences", output_contoursSaliences);
	outputPitchContours.set("contoursStartTimes", output_contoursStartTimes);
	outputPitchContours.set("duration", output_duration);
	return outputPitchContours;
}
void PitchContours::reset() {
_pitchcontours->reset();
}
// END PitchContours definitions

// START PitchContoursMelody definitions
// check https://essentia.upf.edu/reference/std_PitchContoursMelody.html
PitchContoursMelody::PitchContoursMelody(const float binResolution, const int filterIterations, const bool guessUnvoiced, const int hopSize, const float maxFrequency, const float minFrequency, const float referenceFrequency, const float sampleRate, const bool voiceVibrato, const float voicingTolerance) {
	_pitchcontoursmelody = AlgorithmFactory::create("PitchContoursMelody", "binResolution", binResolution, "filterIterations", filterIterations, "guessUnvoiced", guessUnvoiced, "hopSize", hopSize, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "voiceVibrato", voiceVibrato, "voicingTolerance", voicingTolerance);
}
PitchContoursMelody::~PitchContoursMelody() {
	if (_pitchcontoursmelody) delete _pitchcontoursmelody;
}
void PitchContoursMelody::configure(const float binResolution, const int filterIterations, const bool guessUnvoiced, const int hopSize, const float maxFrequency, const float minFrequency, const float referenceFrequency, const float sampleRate, const bool voiceVibrato, const float voicingTolerance) {
	_pitchcontoursmelody->configure("binResolution", binResolution, "filterIterations", filterIterations, "guessUnvoiced", guessUnvoiced, "hopSize", hopSize, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "voiceVibrato", voiceVibrato, "voicingTolerance", voicingTolerance);
}
val PitchContoursMelody::compute(std::vector<std::vector<float> >& input_contoursBins, std::vector<std::vector<float> >& input_contoursSaliences, std::vector<float>& input_contoursStartTimes, float input_duration) {
	_pitchcontoursmelody->input("contoursBins").set(input_contoursBins);
	_pitchcontoursmelody->input("contoursSaliences").set(input_contoursSaliences);
	_pitchcontoursmelody->input("contoursStartTimes").set(input_contoursStartTimes);
	_pitchcontoursmelody->input("duration").set(input_duration);
	std::vector<float> output_pitch;
	std::vector<float> output_pitchConfidence;
	_pitchcontoursmelody->output("pitch").set(output_pitch);
	_pitchcontoursmelody->output("pitchConfidence").set(output_pitchConfidence);
	_pitchcontoursmelody->compute();
	val outputPitchContoursMelody(val::object());
	outputPitchContoursMelody.set("pitch", output_pitch);
	outputPitchContoursMelody.set("pitchConfidence", output_pitchConfidence);
	return outputPitchContoursMelody;
}
void PitchContoursMelody::reset() {
_pitchcontoursmelody->reset();
}
// END PitchContoursMelody definitions

// START PitchContoursMonoMelody definitions
// check https://essentia.upf.edu/reference/std_PitchContoursMonoMelody.html
PitchContoursMonoMelody::PitchContoursMonoMelody(const float binResolution, const int filterIterations, const bool guessUnvoiced, const int hopSize, const float maxFrequency, const float minFrequency, const float referenceFrequency, const float sampleRate) {
	_pitchcontoursmonomelody = AlgorithmFactory::create("PitchContoursMonoMelody", "binResolution", binResolution, "filterIterations", filterIterations, "guessUnvoiced", guessUnvoiced, "hopSize", hopSize, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate);
}
PitchContoursMonoMelody::~PitchContoursMonoMelody() {
	if (_pitchcontoursmonomelody) delete _pitchcontoursmonomelody;
}
void PitchContoursMonoMelody::configure(const float binResolution, const int filterIterations, const bool guessUnvoiced, const int hopSize, const float maxFrequency, const float minFrequency, const float referenceFrequency, const float sampleRate) {
	_pitchcontoursmonomelody->configure("binResolution", binResolution, "filterIterations", filterIterations, "guessUnvoiced", guessUnvoiced, "hopSize", hopSize, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate);
}
val PitchContoursMonoMelody::compute(std::vector<std::vector<float> >& input_contoursBins, std::vector<std::vector<float> >& input_contoursSaliences, std::vector<float>& input_contoursStartTimes, float input_duration) {
	_pitchcontoursmonomelody->input("contoursBins").set(input_contoursBins);
	_pitchcontoursmonomelody->input("contoursSaliences").set(input_contoursSaliences);
	_pitchcontoursmonomelody->input("contoursStartTimes").set(input_contoursStartTimes);
	_pitchcontoursmonomelody->input("duration").set(input_duration);
	std::vector<float> output_pitch;
	std::vector<float> output_pitchConfidence;
	_pitchcontoursmonomelody->output("pitch").set(output_pitch);
	_pitchcontoursmonomelody->output("pitchConfidence").set(output_pitchConfidence);
	_pitchcontoursmonomelody->compute();
	val outputPitchContoursMonoMelody(val::object());
	outputPitchContoursMonoMelody.set("pitch", output_pitch);
	outputPitchContoursMonoMelody.set("pitchConfidence", output_pitchConfidence);
	return outputPitchContoursMonoMelody;
}
void PitchContoursMonoMelody::reset() {
_pitchcontoursmonomelody->reset();
}
// END PitchContoursMonoMelody definitions

// START PitchContoursMultiMelody definitions
// check https://essentia.upf.edu/reference/std_PitchContoursMultiMelody.html
PitchContoursMultiMelody::PitchContoursMultiMelody(const float binResolution, const int filterIterations, const bool guessUnvoiced, const int hopSize, const float maxFrequency, const float minFrequency, const float referenceFrequency, const float sampleRate) {
	_pitchcontoursmultimelody = AlgorithmFactory::create("PitchContoursMultiMelody", "binResolution", binResolution, "filterIterations", filterIterations, "guessUnvoiced", guessUnvoiced, "hopSize", hopSize, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate);
}
PitchContoursMultiMelody::~PitchContoursMultiMelody() {
	if (_pitchcontoursmultimelody) delete _pitchcontoursmultimelody;
}
void PitchContoursMultiMelody::configure(const float binResolution, const int filterIterations, const bool guessUnvoiced, const int hopSize, const float maxFrequency, const float minFrequency, const float referenceFrequency, const float sampleRate) {
	_pitchcontoursmultimelody->configure("binResolution", binResolution, "filterIterations", filterIterations, "guessUnvoiced", guessUnvoiced, "hopSize", hopSize, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate);
}
val PitchContoursMultiMelody::compute(std::vector<std::vector<float> >& input_contoursBins, std::vector<std::vector<float> >& input_contoursSaliences, std::vector<float>& input_contoursStartTimes, float input_duration) {
	_pitchcontoursmultimelody->input("contoursBins").set(input_contoursBins);
	_pitchcontoursmultimelody->input("contoursSaliences").set(input_contoursSaliences);
	_pitchcontoursmultimelody->input("contoursStartTimes").set(input_contoursStartTimes);
	_pitchcontoursmultimelody->input("duration").set(input_duration);
	std::vector<std::vector<float> > output_pitch;
	_pitchcontoursmultimelody->output("pitch").set(output_pitch);
	_pitchcontoursmultimelody->compute();
	val outputPitchContoursMultiMelody(val::object());
	outputPitchContoursMultiMelody.set("pitch", output_pitch);
	return outputPitchContoursMultiMelody;
}
void PitchContoursMultiMelody::reset() {
_pitchcontoursmultimelody->reset();
}
// END PitchContoursMultiMelody definitions

// START PitchFilter definitions
// check https://essentia.upf.edu/reference/std_PitchFilter.html
PitchFilter::PitchFilter(const int confidenceThreshold, const int minChunkSize, const bool useAbsolutePitchConfidence) {
	_pitchfilter = AlgorithmFactory::create("PitchFilter", "confidenceThreshold", confidenceThreshold, "minChunkSize", minChunkSize, "useAbsolutePitchConfidence", useAbsolutePitchConfidence);
}
PitchFilter::~PitchFilter() {
	if (_pitchfilter) delete _pitchfilter;
}
void PitchFilter::configure(const int confidenceThreshold, const int minChunkSize, const bool useAbsolutePitchConfidence) {
	_pitchfilter->configure("confidenceThreshold", confidenceThreshold, "minChunkSize", minChunkSize, "useAbsolutePitchConfidence", useAbsolutePitchConfidence);
}
val PitchFilter::compute(std::vector<float>& input_pitch, std::vector<float>& input_pitchConfidence) {
	_pitchfilter->input("pitch").set(input_pitch);
	_pitchfilter->input("pitchConfidence").set(input_pitchConfidence);
	std::vector<float> output_pitchFiltered;
	_pitchfilter->output("pitchFiltered").set(output_pitchFiltered);
	_pitchfilter->compute();
	val outputPitchFilter(val::object());
	outputPitchFilter.set("pitchFiltered", output_pitchFiltered);
	return outputPitchFilter;
}
void PitchFilter::reset() {
_pitchfilter->reset();
}
// END PitchFilter definitions

// START PitchMelodia definitions
// check https://essentia.upf.edu/reference/std_PitchMelodia.html
PitchMelodia::PitchMelodia(const float binResolution, const int filterIterations, const int frameSize, const bool guessUnvoiced, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const int magnitudeThreshold, const float maxFrequency, const int minDuration, const float minFrequency, const int numberHarmonics, const float peakDistributionThreshold, const float peakFrameThreshold, const float pitchContinuity, const float referenceFrequency, const float sampleRate, const int timeContinuity) {
	_pitchmelodia = AlgorithmFactory::create("PitchMelodia", "binResolution", binResolution, "filterIterations", filterIterations, "frameSize", frameSize, "guessUnvoiced", guessUnvoiced, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "minDuration", minDuration, "minFrequency", minFrequency, "numberHarmonics", numberHarmonics, "peakDistributionThreshold", peakDistributionThreshold, "peakFrameThreshold", peakFrameThreshold, "pitchContinuity", pitchContinuity, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "timeContinuity", timeContinuity);
}
PitchMelodia::~PitchMelodia() {
	if (_pitchmelodia) delete _pitchmelodia;
}
void PitchMelodia::configure(const float binResolution, const int filterIterations, const int frameSize, const bool guessUnvoiced, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const int magnitudeThreshold, const float maxFrequency, const int minDuration, const float minFrequency, const int numberHarmonics, const float peakDistributionThreshold, const float peakFrameThreshold, const float pitchContinuity, const float referenceFrequency, const float sampleRate, const int timeContinuity) {
	if (_pitchmelodia) delete _pitchmelodia;
	_pitchmelodia = AlgorithmFactory::create("PitchMelodia", "binResolution", binResolution, "filterIterations", filterIterations, "frameSize", frameSize, "guessUnvoiced", guessUnvoiced, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "minDuration", minDuration, "minFrequency", minFrequency, "numberHarmonics", numberHarmonics, "peakDistributionThreshold", peakDistributionThreshold, "peakFrameThreshold", peakFrameThreshold, "pitchContinuity", pitchContinuity, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "timeContinuity", timeContinuity);
}
val PitchMelodia::compute(std::vector<float>& input_signal) {
	_pitchmelodia->input("signal").set(input_signal);
	std::vector<float> output_pitch;
	std::vector<float> output_pitchConfidence;
	_pitchmelodia->output("pitch").set(output_pitch);
	_pitchmelodia->output("pitchConfidence").set(output_pitchConfidence);
	_pitchmelodia->compute();
	val outputPitchMelodia(val::object());
	outputPitchMelodia.set("pitch", output_pitch);
	outputPitchMelodia.set("pitchConfidence", output_pitchConfidence);
	return outputPitchMelodia;
}
void PitchMelodia::reset() {
_pitchmelodia->reset();
}
// END PitchMelodia definitions

// START PitchSalience definitions
// check https://essentia.upf.edu/reference/std_PitchSalience.html
PitchSalience::PitchSalience(const float highBoundary, const float lowBoundary, const float sampleRate) {
	_pitchsalience = AlgorithmFactory::create("PitchSalience", "highBoundary", highBoundary, "lowBoundary", lowBoundary, "sampleRate", sampleRate);
}
PitchSalience::~PitchSalience() {
	if (_pitchsalience) delete _pitchsalience;
}
void PitchSalience::configure(const float highBoundary, const float lowBoundary, const float sampleRate) {
	_pitchsalience->configure("highBoundary", highBoundary, "lowBoundary", lowBoundary, "sampleRate", sampleRate);
}
val PitchSalience::compute(std::vector<float>& input_spectrum) {
	_pitchsalience->input("spectrum").set(input_spectrum);
	float output_pitchSalience;
	_pitchsalience->output("pitchSalience").set(output_pitchSalience);
	_pitchsalience->compute();
	val outputPitchSalience(val::object());
	outputPitchSalience.set("pitchSalience", output_pitchSalience);
	return outputPitchSalience;
}
void PitchSalience::reset() {
_pitchsalience->reset();
}
// END PitchSalience definitions

// START PitchSalienceFunction definitions
// check https://essentia.upf.edu/reference/std_PitchSalienceFunction.html
PitchSalienceFunction::PitchSalienceFunction(const float binResolution, const float harmonicWeight, const float magnitudeCompression, const float magnitudeThreshold, const int numberHarmonics, const float referenceFrequency) {
	_pitchsaliencefunction = AlgorithmFactory::create("PitchSalienceFunction", "binResolution", binResolution, "harmonicWeight", harmonicWeight, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "numberHarmonics", numberHarmonics, "referenceFrequency", referenceFrequency);
}
PitchSalienceFunction::~PitchSalienceFunction() {
	if (_pitchsaliencefunction) delete _pitchsaliencefunction;
}
void PitchSalienceFunction::configure(const float binResolution, const float harmonicWeight, const float magnitudeCompression, const float magnitudeThreshold, const int numberHarmonics, const float referenceFrequency) {
	_pitchsaliencefunction->configure("binResolution", binResolution, "harmonicWeight", harmonicWeight, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "numberHarmonics", numberHarmonics, "referenceFrequency", referenceFrequency);
}
val PitchSalienceFunction::compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
	_pitchsaliencefunction->input("frequencies").set(input_frequencies);
	_pitchsaliencefunction->input("magnitudes").set(input_magnitudes);
	std::vector<float> output_salienceFunction;
	_pitchsaliencefunction->output("salienceFunction").set(output_salienceFunction);
	_pitchsaliencefunction->compute();
	val outputPitchSalienceFunction(val::object());
	outputPitchSalienceFunction.set("salienceFunction", output_salienceFunction);
	return outputPitchSalienceFunction;
}
void PitchSalienceFunction::reset() {
_pitchsaliencefunction->reset();
}
// END PitchSalienceFunction definitions

// START PitchSalienceFunctionPeaks definitions
// check https://essentia.upf.edu/reference/std_PitchSalienceFunctionPeaks.html
PitchSalienceFunctionPeaks::PitchSalienceFunctionPeaks(const float binResolution, const float maxFrequency, const float minFrequency, const float referenceFrequency) {
	_pitchsaliencefunctionpeaks = AlgorithmFactory::create("PitchSalienceFunctionPeaks", "binResolution", binResolution, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency);
}
PitchSalienceFunctionPeaks::~PitchSalienceFunctionPeaks() {
	if (_pitchsaliencefunctionpeaks) delete _pitchsaliencefunctionpeaks;
}
void PitchSalienceFunctionPeaks::configure(const float binResolution, const float maxFrequency, const float minFrequency, const float referenceFrequency) {
	_pitchsaliencefunctionpeaks->configure("binResolution", binResolution, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency);
}
val PitchSalienceFunctionPeaks::compute(std::vector<float>& input_salienceFunction) {
	_pitchsaliencefunctionpeaks->input("salienceFunction").set(input_salienceFunction);
	std::vector<float> output_salienceBins;
	std::vector<float> output_salienceValues;
	_pitchsaliencefunctionpeaks->output("salienceBins").set(output_salienceBins);
	_pitchsaliencefunctionpeaks->output("salienceValues").set(output_salienceValues);
	_pitchsaliencefunctionpeaks->compute();
	val outputPitchSalienceFunctionPeaks(val::object());
	outputPitchSalienceFunctionPeaks.set("salienceBins", output_salienceBins);
	outputPitchSalienceFunctionPeaks.set("salienceValues", output_salienceValues);
	return outputPitchSalienceFunctionPeaks;
}
void PitchSalienceFunctionPeaks::reset() {
_pitchsaliencefunctionpeaks->reset();
}
// END PitchSalienceFunctionPeaks definitions

// START PitchYin definitions
// check https://essentia.upf.edu/reference/std_PitchYin.html
PitchYin::PitchYin(const int frameSize, const bool interpolate, const float maxFrequency, const float minFrequency, const float sampleRate, const float tolerance) {
	_pitchyin = AlgorithmFactory::create("PitchYin", "frameSize", frameSize, "interpolate", interpolate, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "sampleRate", sampleRate, "tolerance", tolerance);
}
PitchYin::~PitchYin() {
	if (_pitchyin) delete _pitchyin;
}
void PitchYin::configure(const int frameSize, const bool interpolate, const float maxFrequency, const float minFrequency, const float sampleRate, const float tolerance) {
	_pitchyin->configure("frameSize", frameSize, "interpolate", interpolate, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "sampleRate", sampleRate, "tolerance", tolerance);
}
val PitchYin::compute(std::vector<float>& input_signal) {
	_pitchyin->input("signal").set(input_signal);
	float output_pitch;
	float output_pitchConfidence;
	_pitchyin->output("pitch").set(output_pitch);
	_pitchyin->output("pitchConfidence").set(output_pitchConfidence);
	_pitchyin->compute();
	val outputPitchYin(val::object());
	outputPitchYin.set("pitch", output_pitch);
	outputPitchYin.set("pitchConfidence", output_pitchConfidence);
	return outputPitchYin;
}
void PitchYin::reset() {
_pitchyin->reset();
}
// END PitchYin definitions

// START PitchYinFFT definitions
// check https://essentia.upf.edu/reference/std_PitchYinFFT.html
PitchYinFFT::PitchYinFFT(const int frameSize, const bool interpolate, const float maxFrequency, const float minFrequency, const float sampleRate, const float tolerance) {
	_pitchyinfft = AlgorithmFactory::create("PitchYinFFT", "frameSize", frameSize, "interpolate", interpolate, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "sampleRate", sampleRate, "tolerance", tolerance);
}
PitchYinFFT::~PitchYinFFT() {
	if (_pitchyinfft) delete _pitchyinfft;
}
void PitchYinFFT::configure(const int frameSize, const bool interpolate, const float maxFrequency, const float minFrequency, const float sampleRate, const float tolerance) {
	_pitchyinfft->configure("frameSize", frameSize, "interpolate", interpolate, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "sampleRate", sampleRate, "tolerance", tolerance);
}
val PitchYinFFT::compute(std::vector<float>& input_spectrum) {
	_pitchyinfft->input("spectrum").set(input_spectrum);
	float output_pitch;
	float output_pitchConfidence;
	_pitchyinfft->output("pitch").set(output_pitch);
	_pitchyinfft->output("pitchConfidence").set(output_pitchConfidence);
	_pitchyinfft->compute();
	val outputPitchYinFFT(val::object());
	outputPitchYinFFT.set("pitch", output_pitch);
	outputPitchYinFFT.set("pitchConfidence", output_pitchConfidence);
	return outputPitchYinFFT;
}
void PitchYinFFT::reset() {
_pitchyinfft->reset();
}
// END PitchYinFFT definitions

// START PitchYinProbabilistic definitions
// check https://essentia.upf.edu/reference/std_PitchYinProbabilistic.html
PitchYinProbabilistic::PitchYinProbabilistic(const int frameSize, const int hopSize, const float lowRMSThreshold, const std::string& outputUnvoiced, const bool preciseTime, const float sampleRate) {
	_pitchyinprobabilistic = AlgorithmFactory::create("PitchYinProbabilistic", "frameSize", frameSize, "hopSize", hopSize, "lowRMSThreshold", lowRMSThreshold, "outputUnvoiced", outputUnvoiced, "preciseTime", preciseTime, "sampleRate", sampleRate);
}
PitchYinProbabilistic::~PitchYinProbabilistic() {
	if (_pitchyinprobabilistic) delete _pitchyinprobabilistic;
}
void PitchYinProbabilistic::configure(const int frameSize, const int hopSize, const float lowRMSThreshold, const std::string& outputUnvoiced, const bool preciseTime, const float sampleRate) {
	_pitchyinprobabilistic->configure("frameSize", frameSize, "hopSize", hopSize, "lowRMSThreshold", lowRMSThreshold, "outputUnvoiced", outputUnvoiced, "preciseTime", preciseTime, "sampleRate", sampleRate);
}
val PitchYinProbabilistic::compute(std::vector<float>& input_signal) {
	_pitchyinprobabilistic->input("signal").set(input_signal);
	std::vector<float> output_pitch;
	std::vector<float> output_voicedProbabilities;
	_pitchyinprobabilistic->output("pitch").set(output_pitch);
	_pitchyinprobabilistic->output("voicedProbabilities").set(output_voicedProbabilities);
	_pitchyinprobabilistic->compute();
	val outputPitchYinProbabilistic(val::object());
	outputPitchYinProbabilistic.set("pitch", output_pitch);
	outputPitchYinProbabilistic.set("voicedProbabilities", output_voicedProbabilities);
	return outputPitchYinProbabilistic;
}
void PitchYinProbabilistic::reset() {
_pitchyinprobabilistic->reset();
}
// END PitchYinProbabilistic definitions

// START PitchYinProbabilities definitions
// check https://essentia.upf.edu/reference/std_PitchYinProbabilities.html
PitchYinProbabilities::PitchYinProbabilities(const int frameSize, const float lowAmp, const bool preciseTime, const float sampleRate) {
	_pitchyinprobabilities = AlgorithmFactory::create("PitchYinProbabilities", "frameSize", frameSize, "lowAmp", lowAmp, "preciseTime", preciseTime, "sampleRate", sampleRate);
}
PitchYinProbabilities::~PitchYinProbabilities() {
	if (_pitchyinprobabilities) delete _pitchyinprobabilities;
}
void PitchYinProbabilities::configure(const int frameSize, const float lowAmp, const bool preciseTime, const float sampleRate) {
	_pitchyinprobabilities->configure("frameSize", frameSize, "lowAmp", lowAmp, "preciseTime", preciseTime, "sampleRate", sampleRate);
}
val PitchYinProbabilities::compute(std::vector<float>& input_signal) {
	_pitchyinprobabilities->input("signal").set(input_signal);
	std::vector<float> output_pitch;
	std::vector<float> output_probabilities;
	float output_RMS;
	_pitchyinprobabilities->output("pitch").set(output_pitch);
	_pitchyinprobabilities->output("probabilities").set(output_probabilities);
	_pitchyinprobabilities->output("RMS").set(output_RMS);
	_pitchyinprobabilities->compute();
	val outputPitchYinProbabilities(val::object());
	outputPitchYinProbabilities.set("pitch", output_pitch);
	outputPitchYinProbabilities.set("probabilities", output_probabilities);
	outputPitchYinProbabilities.set("RMS", output_RMS);
	return outputPitchYinProbabilities;
}
void PitchYinProbabilities::reset() {
_pitchyinprobabilities->reset();
}
// END PitchYinProbabilities definitions

// START PitchYinProbabilitiesHMM definitions
// check https://essentia.upf.edu/reference/std_PitchYinProbabilitiesHMM.html
PitchYinProbabilitiesHMM::PitchYinProbabilitiesHMM(const float minFrequency, const int numberBinsPerSemitone, const float selfTransition, const float yinTrust) {
	_pitchyinprobabilitieshmm = AlgorithmFactory::create("PitchYinProbabilitiesHMM", "minFrequency", minFrequency, "numberBinsPerSemitone", numberBinsPerSemitone, "selfTransition", selfTransition, "yinTrust", yinTrust);
}
PitchYinProbabilitiesHMM::~PitchYinProbabilitiesHMM() {
	if (_pitchyinprobabilitieshmm) delete _pitchyinprobabilitieshmm;
}
void PitchYinProbabilitiesHMM::configure(const float minFrequency, const int numberBinsPerSemitone, const float selfTransition, const float yinTrust) {
	_pitchyinprobabilitieshmm->configure("minFrequency", minFrequency, "numberBinsPerSemitone", numberBinsPerSemitone, "selfTransition", selfTransition, "yinTrust", yinTrust);
}
val PitchYinProbabilitiesHMM::compute(std::vector<std::vector<float> >& input_pitchCandidates, std::vector<std::vector<float> >& input_probabilities) {
	_pitchyinprobabilitieshmm->input("pitchCandidates").set(input_pitchCandidates);
	_pitchyinprobabilitieshmm->input("probabilities").set(input_probabilities);
	std::vector<float> output_pitch;
	_pitchyinprobabilitieshmm->output("pitch").set(output_pitch);
	_pitchyinprobabilitieshmm->compute();
	val outputPitchYinProbabilitiesHMM(val::object());
	outputPitchYinProbabilitiesHMM.set("pitch", output_pitch);
	return outputPitchYinProbabilitiesHMM;
}
void PitchYinProbabilitiesHMM::reset() {
_pitchyinprobabilitieshmm->reset();
}
// END PitchYinProbabilitiesHMM definitions

// START PowerMean definitions
// check https://essentia.upf.edu/reference/std_PowerMean.html
PowerMean::PowerMean(const float power) {
	_powermean = AlgorithmFactory::create("PowerMean", "power", power);
}
PowerMean::~PowerMean() {
	if (_powermean) delete _powermean;
}
void PowerMean::configure(const float power) {
	_powermean->configure("power", power);
}
val PowerMean::compute(std::vector<float>& input_array) {
	_powermean->input("array").set(input_array);
	float output_powerMean;
	_powermean->output("powerMean").set(output_powerMean);
	_powermean->compute();
	val outputPowerMean(val::object());
	outputPowerMean.set("powerMean", output_powerMean);
	return outputPowerMean;
}
void PowerMean::reset() {
_powermean->reset();
}
// END PowerMean definitions

// START PowerSpectrum definitions
// check https://essentia.upf.edu/reference/std_PowerSpectrum.html
PowerSpectrum::PowerSpectrum(const int size) {
	_powerspectrum = AlgorithmFactory::create("PowerSpectrum", "size", size);
}
PowerSpectrum::~PowerSpectrum() {
	if (_powerspectrum) delete _powerspectrum;
}
void PowerSpectrum::configure(const int size) {
	_powerspectrum->configure("size", size);
}
val PowerSpectrum::compute(std::vector<float>& input_signal) {
	_powerspectrum->input("signal").set(input_signal);
	std::vector<float> output_powerSpectrum;
	_powerspectrum->output("powerSpectrum").set(output_powerSpectrum);
	_powerspectrum->compute();
	val outputPowerSpectrum(val::object());
	outputPowerSpectrum.set("powerSpectrum", output_powerSpectrum);
	return outputPowerSpectrum;
}
void PowerSpectrum::reset() {
_powerspectrum->reset();
}
// END PowerSpectrum definitions

// START PredominantPitchMelodia definitions
// check https://essentia.upf.edu/reference/std_PredominantPitchMelodia.html
PredominantPitchMelodia::PredominantPitchMelodia(const float binResolution, const int filterIterations, const int frameSize, const bool guessUnvoiced, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const int magnitudeThreshold, const float maxFrequency, const int minDuration, const float minFrequency, const int numberHarmonics, const float peakDistributionThreshold, const float peakFrameThreshold, const float pitchContinuity, const float referenceFrequency, const float sampleRate, const int timeContinuity, const bool voiceVibrato, const float voicingTolerance) {
	_predominantpitchmelodia = AlgorithmFactory::create("PredominantPitchMelodia", "binResolution", binResolution, "filterIterations", filterIterations, "frameSize", frameSize, "guessUnvoiced", guessUnvoiced, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "minDuration", minDuration, "minFrequency", minFrequency, "numberHarmonics", numberHarmonics, "peakDistributionThreshold", peakDistributionThreshold, "peakFrameThreshold", peakFrameThreshold, "pitchContinuity", pitchContinuity, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "timeContinuity", timeContinuity, "voiceVibrato", voiceVibrato, "voicingTolerance", voicingTolerance);
}
PredominantPitchMelodia::~PredominantPitchMelodia() {
	if (_predominantpitchmelodia) delete _predominantpitchmelodia;
}
void PredominantPitchMelodia::configure(const float binResolution, const int filterIterations, const int frameSize, const bool guessUnvoiced, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const int magnitudeThreshold, const float maxFrequency, const int minDuration, const float minFrequency, const int numberHarmonics, const float peakDistributionThreshold, const float peakFrameThreshold, const float pitchContinuity, const float referenceFrequency, const float sampleRate, const int timeContinuity, const bool voiceVibrato, const float voicingTolerance) {
	if (_predominantpitchmelodia) delete _predominantpitchmelodia;
	_predominantpitchmelodia = AlgorithmFactory::create("PredominantPitchMelodia", "binResolution", binResolution, "filterIterations", filterIterations, "frameSize", frameSize, "guessUnvoiced", guessUnvoiced, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "minDuration", minDuration, "minFrequency", minFrequency, "numberHarmonics", numberHarmonics, "peakDistributionThreshold", peakDistributionThreshold, "peakFrameThreshold", peakFrameThreshold, "pitchContinuity", pitchContinuity, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "timeContinuity", timeContinuity, "voiceVibrato", voiceVibrato, "voicingTolerance", voicingTolerance);
}
val PredominantPitchMelodia::compute(std::vector<float>& input_signal) {
	_predominantpitchmelodia->input("signal").set(input_signal);
	std::vector<float> output_pitch;
	std::vector<float> output_pitchConfidence;
	_predominantpitchmelodia->output("pitch").set(output_pitch);
	_predominantpitchmelodia->output("pitchConfidence").set(output_pitchConfidence);
	_predominantpitchmelodia->compute();
	val outputPredominantPitchMelodia(val::object());
	outputPredominantPitchMelodia.set("pitch", output_pitch);
	outputPredominantPitchMelodia.set("pitchConfidence", output_pitchConfidence);
	return outputPredominantPitchMelodia;
}
void PredominantPitchMelodia::reset() {
_predominantpitchmelodia->reset();
}
// END PredominantPitchMelodia definitions

// START RMS definitions
// check https://essentia.upf.edu/reference/std_RMS.html
RMS::RMS() {
	_rms = AlgorithmFactory::create("RMS");
}
RMS::~RMS() {
	if (_rms) delete _rms;
}
void RMS::configure() {
	_rms->configure();
}
val RMS::compute(std::vector<float>& input_array) {
	_rms->input("array").set(input_array);
	float output_rms;
	_rms->output("rms").set(output_rms);
	_rms->compute();
	val outputRMS(val::object());
	outputRMS.set("rms", output_rms);
	return outputRMS;
}
void RMS::reset() {
_rms->reset();
}
// END RMS definitions

// START RawMoments definitions
// check https://essentia.upf.edu/reference/std_RawMoments.html
RawMoments::RawMoments(const float range) {
	_rawmoments = AlgorithmFactory::create("RawMoments", "range", range);
}
RawMoments::~RawMoments() {
	if (_rawmoments) delete _rawmoments;
}
void RawMoments::configure(const float range) {
	_rawmoments->configure("range", range);
}
val RawMoments::compute(std::vector<float>& input_array) {
	_rawmoments->input("array").set(input_array);
	std::vector<float> output_rawMoments;
	_rawmoments->output("rawMoments").set(output_rawMoments);
	_rawmoments->compute();
	val outputRawMoments(val::object());
	outputRawMoments.set("rawMoments", output_rawMoments);
	return outputRawMoments;
}
void RawMoments::reset() {
_rawmoments->reset();
}
// END RawMoments definitions

// START ReplayGain definitions
// check https://essentia.upf.edu/reference/std_ReplayGain.html
ReplayGain::ReplayGain(const float sampleRate) {
	_replaygain = AlgorithmFactory::create("ReplayGain", "sampleRate", sampleRate);
}
ReplayGain::~ReplayGain() {
	if (_replaygain) delete _replaygain;
}
void ReplayGain::configure(const float sampleRate) {
	_replaygain->configure("sampleRate", sampleRate);
}
val ReplayGain::compute(std::vector<float>& input_signal) {
	_replaygain->input("signal").set(input_signal);
	float output_replayGain;
	_replaygain->output("replayGain").set(output_replayGain);
	_replaygain->compute();
	val outputReplayGain(val::object());
	outputReplayGain.set("replayGain", output_replayGain);
	return outputReplayGain;
}
void ReplayGain::reset() {
_replaygain->reset();
}
// END ReplayGain definitions

// START Resample definitions
// check https://essentia.upf.edu/reference/std_Resample.html
Resample::Resample(const float inputSampleRate, const float outputSampleRate, const int quality) {
	_resample = AlgorithmFactory::create("Resample", "inputSampleRate", inputSampleRate, "outputSampleRate", outputSampleRate, "quality", quality);
}
Resample::~Resample() {
	if (_resample) delete _resample;
}
void Resample::configure(const float inputSampleRate, const float outputSampleRate, const int quality) {
	_resample->configure("inputSampleRate", inputSampleRate, "outputSampleRate", outputSampleRate, "quality", quality);
}
val Resample::compute(std::vector<float>& input_signal) {
	_resample->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_resample->output("signal").set(output_signal);
	_resample->compute();
	val outputResample(val::object());
	outputResample.set("signal", output_signal);
	return outputResample;
}
void Resample::reset() {
_resample->reset();
}
// END Resample definitions

// START ResampleFFT definitions
// check https://essentia.upf.edu/reference/std_ResampleFFT.html
ResampleFFT::ResampleFFT(const int inSize, const int outSize) {
	_resamplefft = AlgorithmFactory::create("ResampleFFT", "inSize", inSize, "outSize", outSize);
}
ResampleFFT::~ResampleFFT() {
	if (_resamplefft) delete _resamplefft;
}
void ResampleFFT::configure(const int inSize, const int outSize) {
	_resamplefft->configure("inSize", inSize, "outSize", outSize);
}
val ResampleFFT::compute(std::vector<float>& input_input) {
	_resamplefft->input("input").set(input_input);
	std::vector<float> output_output;
	_resamplefft->output("output").set(output_output);
	_resamplefft->compute();
	val outputResampleFFT(val::object());
	outputResampleFFT.set("output", output_output);
	return outputResampleFFT;
}
void ResampleFFT::reset() {
_resamplefft->reset();
}
// END ResampleFFT definitions

// START RhythmDescriptors definitions
// check https://essentia.upf.edu/reference/std_RhythmDescriptors.html
RhythmDescriptors::RhythmDescriptors() {
	_rhythmdescriptors = AlgorithmFactory::create("RhythmDescriptors");
}
RhythmDescriptors::~RhythmDescriptors() {
	if (_rhythmdescriptors) delete _rhythmdescriptors;
}
void RhythmDescriptors::configure() {
	_rhythmdescriptors->configure();
}
val RhythmDescriptors::compute(std::vector<float>& input_signal) {
	_rhythmdescriptors->input("signal").set(input_signal);
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
	_rhythmdescriptors->output("beats_position").set(output_beats_position);
	_rhythmdescriptors->output("confidence").set(output_confidence);
	_rhythmdescriptors->output("bpm").set(output_bpm);
	_rhythmdescriptors->output("bpm_estimates").set(output_bpm_estimates);
	_rhythmdescriptors->output("bpm_intervals").set(output_bpm_intervals);
	_rhythmdescriptors->output("first_peak_bpm").set(output_first_peak_bpm);
	_rhythmdescriptors->output("first_peak_spread").set(output_first_peak_spread);
	_rhythmdescriptors->output("first_peak_weight").set(output_first_peak_weight);
	_rhythmdescriptors->output("second_peak_bpm").set(output_second_peak_bpm);
	_rhythmdescriptors->output("second_peak_spread").set(output_second_peak_spread);
	_rhythmdescriptors->output("second_peak_weight").set(output_second_peak_weight);
	_rhythmdescriptors->output("histogram").set(output_histogram);
	_rhythmdescriptors->compute();
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
	return outputRhythmDescriptors;
}
void RhythmDescriptors::reset() {
_rhythmdescriptors->reset();
}
// END RhythmDescriptors definitions

// START RhythmExtractor definitions
// check https://essentia.upf.edu/reference/std_RhythmExtractor.html
RhythmExtractor::RhythmExtractor(const int frameHop, const int frameSize, const int hopSize, const float lastBeatInterval, const int maxTempo, const int minTempo, const int numberFrames, const float sampleRate, const std::vector<float>& tempoHints, const float tolerance, const bool useBands, const bool useOnset) {
	_rhythmextractor = AlgorithmFactory::create("RhythmExtractor", "frameHop", frameHop, "frameSize", frameSize, "hopSize", hopSize, "lastBeatInterval", lastBeatInterval, "maxTempo", maxTempo, "minTempo", minTempo, "numberFrames", numberFrames, "sampleRate", sampleRate, "tempoHints", tempoHints, "tolerance", tolerance, "useBands", useBands, "useOnset", useOnset);
}
RhythmExtractor::~RhythmExtractor() {
	if (_rhythmextractor) delete _rhythmextractor;
}
void RhythmExtractor::configure(const int frameHop, const int frameSize, const int hopSize, const float lastBeatInterval, const int maxTempo, const int minTempo, const int numberFrames, const float sampleRate, const std::vector<float>& tempoHints, const float tolerance, const bool useBands, const bool useOnset) {
	_rhythmextractor->configure("frameHop", frameHop, "frameSize", frameSize, "hopSize", hopSize, "lastBeatInterval", lastBeatInterval, "maxTempo", maxTempo, "minTempo", minTempo, "numberFrames", numberFrames, "sampleRate", sampleRate, "tempoHints", tempoHints, "tolerance", tolerance, "useBands", useBands, "useOnset", useOnset);
}
val RhythmExtractor::compute(std::vector<float>& input_signal) {
	_rhythmextractor->input("signal").set(input_signal);
	float output_bpm;
	std::vector<float> output_ticks;
	std::vector<float> output_estimates;
	std::vector<float> output_bpmIntervals;
	_rhythmextractor->output("bpm").set(output_bpm);
	_rhythmextractor->output("ticks").set(output_ticks);
	_rhythmextractor->output("estimates").set(output_estimates);
	_rhythmextractor->output("bpmIntervals").set(output_bpmIntervals);
	_rhythmextractor->compute();
	val outputRhythmExtractor(val::object());
	outputRhythmExtractor.set("bpm", output_bpm);
	outputRhythmExtractor.set("ticks", output_ticks);
	outputRhythmExtractor.set("estimates", output_estimates);
	outputRhythmExtractor.set("bpmIntervals", output_bpmIntervals);
	return outputRhythmExtractor;
}
void RhythmExtractor::reset() {
_rhythmextractor->reset();
}
// END RhythmExtractor definitions

// START RhythmExtractor2013 definitions
// check https://essentia.upf.edu/reference/std_RhythmExtractor2013.html
RhythmExtractor2013::RhythmExtractor2013(const int maxTempo, const std::string& method, const int minTempo) {
	_rhythmextractor2013 = AlgorithmFactory::create("RhythmExtractor2013", "maxTempo", maxTempo, "method", method, "minTempo", minTempo);
}
RhythmExtractor2013::~RhythmExtractor2013() {
	if (_rhythmextractor2013) delete _rhythmextractor2013;
}
void RhythmExtractor2013::configure(const int maxTempo, const std::string& method, const int minTempo) {
	_rhythmextractor2013->configure("maxTempo", maxTempo, "method", method, "minTempo", minTempo);
}
val RhythmExtractor2013::compute(std::vector<float>& input_signal) {
	_rhythmextractor2013->input("signal").set(input_signal);
	float output_bpm;
	std::vector<float> output_ticks;
	float output_confidence;
	std::vector<float> output_estimates;
	std::vector<float> output_bpmIntervals;
	_rhythmextractor2013->output("bpm").set(output_bpm);
	_rhythmextractor2013->output("ticks").set(output_ticks);
	_rhythmextractor2013->output("confidence").set(output_confidence);
	_rhythmextractor2013->output("estimates").set(output_estimates);
	_rhythmextractor2013->output("bpmIntervals").set(output_bpmIntervals);
	_rhythmextractor2013->compute();
	val outputRhythmExtractor2013(val::object());
	outputRhythmExtractor2013.set("bpm", output_bpm);
	outputRhythmExtractor2013.set("ticks", output_ticks);
	outputRhythmExtractor2013.set("confidence", output_confidence);
	outputRhythmExtractor2013.set("estimates", output_estimates);
	outputRhythmExtractor2013.set("bpmIntervals", output_bpmIntervals);
	return outputRhythmExtractor2013;
}
void RhythmExtractor2013::reset() {
_rhythmextractor2013->reset();
}
// END RhythmExtractor2013 definitions

// START RhythmTransform definitions
// check https://essentia.upf.edu/reference/std_RhythmTransform.html
RhythmTransform::RhythmTransform(const int frameSize, const int hopSize) {
	_rhythmtransform = AlgorithmFactory::create("RhythmTransform", "frameSize", frameSize, "hopSize", hopSize);
}
RhythmTransform::~RhythmTransform() {
	if (_rhythmtransform) delete _rhythmtransform;
}
void RhythmTransform::configure(const int frameSize, const int hopSize) {
	_rhythmtransform->configure("frameSize", frameSize, "hopSize", hopSize);
}
val RhythmTransform::compute(std::vector<std::vector<float> >& input_melBands) {
	_rhythmtransform->input("melBands").set(input_melBands);
	std::vector<std::vector<float> > output_rhythm;
	_rhythmtransform->output("rhythm").set(output_rhythm);
	_rhythmtransform->compute();
	val outputRhythmTransform(val::object());
	outputRhythmTransform.set("rhythm", output_rhythm);
	return outputRhythmTransform;
}
void RhythmTransform::reset() {
_rhythmtransform->reset();
}
// END RhythmTransform definitions

// START RollOff definitions
// check https://essentia.upf.edu/reference/std_RollOff.html
RollOff::RollOff(const float cutoff, const float sampleRate) {
	_rolloff = AlgorithmFactory::create("RollOff", "cutoff", cutoff, "sampleRate", sampleRate);
}
RollOff::~RollOff() {
	if (_rolloff) delete _rolloff;
}
void RollOff::configure(const float cutoff, const float sampleRate) {
	_rolloff->configure("cutoff", cutoff, "sampleRate", sampleRate);
}
val RollOff::compute(std::vector<float>& input_spectrum) {
	_rolloff->input("spectrum").set(input_spectrum);
	float output_rollOff;
	_rolloff->output("rollOff").set(output_rollOff);
	_rolloff->compute();
	val outputRollOff(val::object());
	outputRollOff.set("rollOff", output_rollOff);
	return outputRollOff;
}
void RollOff::reset() {
_rolloff->reset();
}
// END RollOff definitions

// START SNR definitions
// check https://essentia.upf.edu/reference/std_SNR.html
SNR::SNR(const float MAAlpha, const float MMSEAlpha, const float NoiseAlpha, const int frameSize, const float noiseThreshold, const float sampleRate, const bool useBroadbadNoiseCorrection) {
	_snr = AlgorithmFactory::create("SNR", "MAAlpha", MAAlpha, "MMSEAlpha", MMSEAlpha, "NoiseAlpha", NoiseAlpha, "frameSize", frameSize, "noiseThreshold", noiseThreshold, "sampleRate", sampleRate, "useBroadbadNoiseCorrection", useBroadbadNoiseCorrection);
}
SNR::~SNR() {
	if (_snr) delete _snr;
}
void SNR::configure(const float MAAlpha, const float MMSEAlpha, const float NoiseAlpha, const int frameSize, const float noiseThreshold, const float sampleRate, const bool useBroadbadNoiseCorrection) {
	_snr->configure("MAAlpha", MAAlpha, "MMSEAlpha", MMSEAlpha, "NoiseAlpha", NoiseAlpha, "frameSize", frameSize, "noiseThreshold", noiseThreshold, "sampleRate", sampleRate, "useBroadbadNoiseCorrection", useBroadbadNoiseCorrection);
}
val SNR::compute(std::vector<float>& input_frame) {
	_snr->input("frame").set(input_frame);
	float output_instantSNR;
	float output_averagedSNR;
	std::vector<float> output_spectralSNR;
	_snr->output("instantSNR").set(output_instantSNR);
	_snr->output("averagedSNR").set(output_averagedSNR);
	_snr->output("spectralSNR").set(output_spectralSNR);
	_snr->compute();
	val outputSNR(val::object());
	outputSNR.set("instantSNR", output_instantSNR);
	outputSNR.set("averagedSNR", output_averagedSNR);
	outputSNR.set("spectralSNR", output_spectralSNR);
	return outputSNR;
}
void SNR::reset() {
_snr->reset();
}
// END SNR definitions

// START SaturationDetector definitions
// check https://essentia.upf.edu/reference/std_SaturationDetector.html
SaturationDetector::SaturationDetector(const float differentialThreshold, const float energyThreshold, const int frameSize, const int hopSize, const float minimumDuration, const float sampleRate) {
	_saturationdetector = AlgorithmFactory::create("SaturationDetector", "differentialThreshold", differentialThreshold, "energyThreshold", energyThreshold, "frameSize", frameSize, "hopSize", hopSize, "minimumDuration", minimumDuration, "sampleRate", sampleRate);
}
SaturationDetector::~SaturationDetector() {
	if (_saturationdetector) delete _saturationdetector;
}
void SaturationDetector::configure(const float differentialThreshold, const float energyThreshold, const int frameSize, const int hopSize, const float minimumDuration, const float sampleRate) {
	_saturationdetector->configure("differentialThreshold", differentialThreshold, "energyThreshold", energyThreshold, "frameSize", frameSize, "hopSize", hopSize, "minimumDuration", minimumDuration, "sampleRate", sampleRate);
}
val SaturationDetector::compute(std::vector<float>& input_frame) {
	_saturationdetector->input("frame").set(input_frame);
	std::vector<float> output_starts;
	std::vector<float> output_ends;
	_saturationdetector->output("starts").set(output_starts);
	_saturationdetector->output("ends").set(output_ends);
	_saturationdetector->compute();
	val outputSaturationDetector(val::object());
	outputSaturationDetector.set("starts", output_starts);
	outputSaturationDetector.set("ends", output_ends);
	return outputSaturationDetector;
}
void SaturationDetector::reset() {
_saturationdetector->reset();
}
// END SaturationDetector definitions

// START Scale definitions
// check https://essentia.upf.edu/reference/std_Scale.html
Scale::Scale(const bool clipping, const float factor, const float maxAbsValue) {
	_scale = AlgorithmFactory::create("Scale", "clipping", clipping, "factor", factor, "maxAbsValue", maxAbsValue);
}
Scale::~Scale() {
	if (_scale) delete _scale;
}
void Scale::configure(const bool clipping, const float factor, const float maxAbsValue) {
	_scale->configure("clipping", clipping, "factor", factor, "maxAbsValue", maxAbsValue);
}
val Scale::compute(std::vector<float>& input_signal) {
	_scale->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_scale->output("signal").set(output_signal);
	_scale->compute();
	val outputScale(val::object());
	outputScale.set("signal", output_signal);
	return outputScale;
}
void Scale::reset() {
_scale->reset();
}
// END Scale definitions

// START SineSubtraction definitions
// check https://essentia.upf.edu/reference/std_SineSubtraction.html
SineSubtraction::SineSubtraction(const int fftSize, const int hopSize, const float sampleRate) {
	_sinesubtraction = AlgorithmFactory::create("SineSubtraction", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate);
}
SineSubtraction::~SineSubtraction() {
	if (_sinesubtraction) delete _sinesubtraction;
}
void SineSubtraction::configure(const int fftSize, const int hopSize, const float sampleRate) {
	_sinesubtraction->configure("fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate);
}
val SineSubtraction::compute(std::vector<float>& input_frame, std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases) {
	_sinesubtraction->input("frame").set(input_frame);
	_sinesubtraction->input("magnitudes").set(input_magnitudes);
	_sinesubtraction->input("frequencies").set(input_frequencies);
	_sinesubtraction->input("phases").set(input_phases);
	std::vector<float> output_frame;
	_sinesubtraction->output("frame").set(output_frame);
	_sinesubtraction->compute();
	val outputSineSubtraction(val::object());
	outputSineSubtraction.set("frame", output_frame);
	return outputSineSubtraction;
}
void SineSubtraction::reset() {
_sinesubtraction->reset();
}
// END SineSubtraction definitions

// START SingleBeatLoudness definitions
// check https://essentia.upf.edu/reference/std_SingleBeatLoudness.html
SingleBeatLoudness::SingleBeatLoudness(const float beatDuration, const float beatWindowDuration, const std::vector<float>& frequencyBands, const std::string& onsetStart, const float sampleRate) {
	_singlebeatloudness = AlgorithmFactory::create("SingleBeatLoudness", "beatDuration", beatDuration, "beatWindowDuration", beatWindowDuration, "frequencyBands", frequencyBands, "onsetStart", onsetStart, "sampleRate", sampleRate);
}
SingleBeatLoudness::~SingleBeatLoudness() {
	if (_singlebeatloudness) delete _singlebeatloudness;
}
void SingleBeatLoudness::configure(const float beatDuration, const float beatWindowDuration, const std::vector<float>& frequencyBands, const std::string& onsetStart, const float sampleRate) {
	_singlebeatloudness->configure("beatDuration", beatDuration, "beatWindowDuration", beatWindowDuration, "frequencyBands", frequencyBands, "onsetStart", onsetStart, "sampleRate", sampleRate);
}
val SingleBeatLoudness::compute(std::vector<float>& input_beat) {
	_singlebeatloudness->input("beat").set(input_beat);
	float output_loudness;
	std::vector<float> output_loudnessBandRatio;
	_singlebeatloudness->output("loudness").set(output_loudness);
	_singlebeatloudness->output("loudnessBandRatio").set(output_loudnessBandRatio);
	_singlebeatloudness->compute();
	val outputSingleBeatLoudness(val::object());
	outputSingleBeatLoudness.set("loudness", output_loudness);
	outputSingleBeatLoudness.set("loudnessBandRatio", output_loudnessBandRatio);
	return outputSingleBeatLoudness;
}
void SingleBeatLoudness::reset() {
_singlebeatloudness->reset();
}
// END SingleBeatLoudness definitions

// START Slicer definitions
// check https://essentia.upf.edu/reference/std_Slicer.html
Slicer::Slicer(const std::vector<float>& endTimes, const float sampleRate, const std::vector<float>& startTimes, const std::string& timeUnits) {
	_slicer = AlgorithmFactory::create("Slicer", "endTimes", endTimes, "sampleRate", sampleRate, "startTimes", startTimes, "timeUnits", timeUnits);
}
Slicer::~Slicer() {
	if (_slicer) delete _slicer;
}
void Slicer::configure(const std::vector<float>& endTimes, const float sampleRate, const std::vector<float>& startTimes, const std::string& timeUnits) {
	_slicer->configure("endTimes", endTimes, "sampleRate", sampleRate, "startTimes", startTimes, "timeUnits", timeUnits);
}
val Slicer::compute(std::vector<float>& input_audio) {
	_slicer->input("audio").set(input_audio);
	std::vector<std::vector<float> > output_frame;
	_slicer->output("frame").set(output_frame);
	_slicer->compute();
	val outputSlicer(val::object());
	outputSlicer.set("frame", output_frame);
	return outputSlicer;
}
void Slicer::reset() {
_slicer->reset();
}
// END Slicer definitions

// START SpectralCentroidTime definitions
// check https://essentia.upf.edu/reference/std_SpectralCentroidTime.html
SpectralCentroidTime::SpectralCentroidTime(const float sampleRate) {
	_spectralcentroidtime = AlgorithmFactory::create("SpectralCentroidTime", "sampleRate", sampleRate);
}
SpectralCentroidTime::~SpectralCentroidTime() {
	if (_spectralcentroidtime) delete _spectralcentroidtime;
}
void SpectralCentroidTime::configure(const float sampleRate) {
	_spectralcentroidtime->configure("sampleRate", sampleRate);
}
val SpectralCentroidTime::compute(std::vector<float>& input_array) {
	_spectralcentroidtime->input("array").set(input_array);
	float output_centroid;
	_spectralcentroidtime->output("centroid").set(output_centroid);
	_spectralcentroidtime->compute();
	val outputSpectralCentroidTime(val::object());
	outputSpectralCentroidTime.set("centroid", output_centroid);
	return outputSpectralCentroidTime;
}
void SpectralCentroidTime::reset() {
_spectralcentroidtime->reset();
}
// END SpectralCentroidTime definitions

// START SpectralComplexity definitions
// check https://essentia.upf.edu/reference/std_SpectralComplexity.html
SpectralComplexity::SpectralComplexity(const float magnitudeThreshold, const float sampleRate) {
	_spectralcomplexity = AlgorithmFactory::create("SpectralComplexity", "magnitudeThreshold", magnitudeThreshold, "sampleRate", sampleRate);
}
SpectralComplexity::~SpectralComplexity() {
	if (_spectralcomplexity) delete _spectralcomplexity;
}
void SpectralComplexity::configure(const float magnitudeThreshold, const float sampleRate) {
	_spectralcomplexity->configure("magnitudeThreshold", magnitudeThreshold, "sampleRate", sampleRate);
}
val SpectralComplexity::compute(std::vector<float>& input_spectrum) {
	_spectralcomplexity->input("spectrum").set(input_spectrum);
	float output_spectralComplexity;
	_spectralcomplexity->output("spectralComplexity").set(output_spectralComplexity);
	_spectralcomplexity->compute();
	val outputSpectralComplexity(val::object());
	outputSpectralComplexity.set("spectralComplexity", output_spectralComplexity);
	return outputSpectralComplexity;
}
void SpectralComplexity::reset() {
_spectralcomplexity->reset();
}
// END SpectralComplexity definitions

// START SpectralContrast definitions
// check https://essentia.upf.edu/reference/std_SpectralContrast.html
SpectralContrast::SpectralContrast(const int frameSize, const float highFrequencyBound, const float lowFrequencyBound, const float neighbourRatio, const int numberBands, const float sampleRate, const float staticDistribution) {
	_spectralcontrast = AlgorithmFactory::create("SpectralContrast", "frameSize", frameSize, "highFrequencyBound", highFrequencyBound, "lowFrequencyBound", lowFrequencyBound, "neighbourRatio", neighbourRatio, "numberBands", numberBands, "sampleRate", sampleRate, "staticDistribution", staticDistribution);
}
SpectralContrast::~SpectralContrast() {
	if (_spectralcontrast) delete _spectralcontrast;
}
void SpectralContrast::configure(const int frameSize, const float highFrequencyBound, const float lowFrequencyBound, const float neighbourRatio, const int numberBands, const float sampleRate, const float staticDistribution) {
	_spectralcontrast->configure("frameSize", frameSize, "highFrequencyBound", highFrequencyBound, "lowFrequencyBound", lowFrequencyBound, "neighbourRatio", neighbourRatio, "numberBands", numberBands, "sampleRate", sampleRate, "staticDistribution", staticDistribution);
}
val SpectralContrast::compute(std::vector<float>& input_spectrum) {
	_spectralcontrast->input("spectrum").set(input_spectrum);
	std::vector<float> output_spectralContrast;
	std::vector<float> output_spectralValley;
	_spectralcontrast->output("spectralContrast").set(output_spectralContrast);
	_spectralcontrast->output("spectralValley").set(output_spectralValley);
	_spectralcontrast->compute();
	val outputSpectralContrast(val::object());
	outputSpectralContrast.set("spectralContrast", output_spectralContrast);
	outputSpectralContrast.set("spectralValley", output_spectralValley);
	return outputSpectralContrast;
}
void SpectralContrast::reset() {
_spectralcontrast->reset();
}
// END SpectralContrast definitions

// START SpectralPeaks definitions
// check https://essentia.upf.edu/reference/std_SpectralPeaks.html
SpectralPeaks::SpectralPeaks(const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const float minFrequency, const std::string& orderBy, const float sampleRate) {
	_spectralpeaks = AlgorithmFactory::create("SpectralPeaks", "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "minFrequency", minFrequency, "orderBy", orderBy, "sampleRate", sampleRate);
}
SpectralPeaks::~SpectralPeaks() {
	if (_spectralpeaks) delete _spectralpeaks;
}
void SpectralPeaks::configure(const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const float minFrequency, const std::string& orderBy, const float sampleRate) {
	_spectralpeaks->configure("magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "minFrequency", minFrequency, "orderBy", orderBy, "sampleRate", sampleRate);
}
val SpectralPeaks::compute(std::vector<float>& input_spectrum) {
	_spectralpeaks->input("spectrum").set(input_spectrum);
	std::vector<float> output_frequencies;
	std::vector<float> output_magnitudes;
	_spectralpeaks->output("frequencies").set(output_frequencies);
	_spectralpeaks->output("magnitudes").set(output_magnitudes);
	_spectralpeaks->compute();
	val outputSpectralPeaks(val::object());
	outputSpectralPeaks.set("frequencies", output_frequencies);
	outputSpectralPeaks.set("magnitudes", output_magnitudes);
	return outputSpectralPeaks;
}
void SpectralPeaks::reset() {
_spectralpeaks->reset();
}
// END SpectralPeaks definitions

// START SpectralWhitening definitions
// check https://essentia.upf.edu/reference/std_SpectralWhitening.html
SpectralWhitening::SpectralWhitening(const float maxFrequency, const float sampleRate) {
	_spectralwhitening = AlgorithmFactory::create("SpectralWhitening", "maxFrequency", maxFrequency, "sampleRate", sampleRate);
}
SpectralWhitening::~SpectralWhitening() {
	if (_spectralwhitening) delete _spectralwhitening;
}
void SpectralWhitening::configure(const float maxFrequency, const float sampleRate) {
	_spectralwhitening->configure("maxFrequency", maxFrequency, "sampleRate", sampleRate);
}
val SpectralWhitening::compute(std::vector<float>& input_spectrum, std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
	_spectralwhitening->input("spectrum").set(input_spectrum);
	_spectralwhitening->input("frequencies").set(input_frequencies);
	_spectralwhitening->input("magnitudes").set(input_magnitudes);
	std::vector<float> output_magnitudes;
	_spectralwhitening->output("magnitudes").set(output_magnitudes);
	_spectralwhitening->compute();
	val outputSpectralWhitening(val::object());
	outputSpectralWhitening.set("magnitudes", output_magnitudes);
	return outputSpectralWhitening;
}
void SpectralWhitening::reset() {
_spectralwhitening->reset();
}
// END SpectralWhitening definitions

// START Spectrum definitions
// check https://essentia.upf.edu/reference/std_Spectrum.html
Spectrum::Spectrum(const int size) {
	_spectrum = AlgorithmFactory::create("Spectrum", "size", size);
}
Spectrum::~Spectrum() {
	if (_spectrum) delete _spectrum;
}
void Spectrum::configure(const int size) {
	_spectrum->configure("size", size);
}
val Spectrum::compute(std::vector<float>& input_frame) {
	_spectrum->input("frame").set(input_frame);
	std::vector<float> output_spectrum;
	_spectrum->output("spectrum").set(output_spectrum);
	_spectrum->compute();
	val outputSpectrum(val::object());
	outputSpectrum.set("spectrum", output_spectrum);
	return outputSpectrum;
}
void Spectrum::reset() {
_spectrum->reset();
}
// END Spectrum definitions

// START SpectrumCQ definitions
// check https://essentia.upf.edu/reference/std_SpectrumCQ.html
SpectrumCQ::SpectrumCQ(const int binsPerOctave, const float minFrequency, const int minimumKernelSize, const int numberBins, const float sampleRate, const float scale, const float threshold, const std::string& windowType, const bool zeroPhase) {
	_spectrumcq = AlgorithmFactory::create("SpectrumCQ", "binsPerOctave", binsPerOctave, "minFrequency", minFrequency, "minimumKernelSize", minimumKernelSize, "numberBins", numberBins, "sampleRate", sampleRate, "scale", scale, "threshold", threshold, "windowType", windowType, "zeroPhase", zeroPhase);
}
SpectrumCQ::~SpectrumCQ() {
	if (_spectrumcq) delete _spectrumcq;
}
void SpectrumCQ::configure(const int binsPerOctave, const float minFrequency, const int minimumKernelSize, const int numberBins, const float sampleRate, const float scale, const float threshold, const std::string& windowType, const bool zeroPhase) {
	_spectrumcq->configure("binsPerOctave", binsPerOctave, "minFrequency", minFrequency, "minimumKernelSize", minimumKernelSize, "numberBins", numberBins, "sampleRate", sampleRate, "scale", scale, "threshold", threshold, "windowType", windowType, "zeroPhase", zeroPhase);
}
val SpectrumCQ::compute(std::vector<float>& input_frame) {
	_spectrumcq->input("frame").set(input_frame);
	std::vector<float> output_spectrumCQ;
	_spectrumcq->output("spectrumCQ").set(output_spectrumCQ);
	_spectrumcq->compute();
	val outputSpectrumCQ(val::object());
	outputSpectrumCQ.set("spectrumCQ", output_spectrumCQ);
	return outputSpectrumCQ;
}
void SpectrumCQ::reset() {
_spectrumcq->reset();
}
// END SpectrumCQ definitions

// START SpectrumToCent definitions
// check https://essentia.upf.edu/reference/std_SpectrumToCent.html
SpectrumToCent::SpectrumToCent(const int bands, const float centBinResolution, const int inputSize, const bool log, const float minimumFrequency, const std::string& normalize, const float sampleRate, const std::string& type) {
	_spectrumtocent = AlgorithmFactory::create("SpectrumToCent", "bands", bands, "centBinResolution", centBinResolution, "inputSize", inputSize, "log", log, "minimumFrequency", minimumFrequency, "normalize", normalize, "sampleRate", sampleRate, "type", type);
}
SpectrumToCent::~SpectrumToCent() {
	if (_spectrumtocent) delete _spectrumtocent;
}
void SpectrumToCent::configure(const int bands, const float centBinResolution, const int inputSize, const bool log, const float minimumFrequency, const std::string& normalize, const float sampleRate, const std::string& type) {
	_spectrumtocent->configure("bands", bands, "centBinResolution", centBinResolution, "inputSize", inputSize, "log", log, "minimumFrequency", minimumFrequency, "normalize", normalize, "sampleRate", sampleRate, "type", type);
}
val SpectrumToCent::compute(std::vector<float>& input_spectrum) {
	_spectrumtocent->input("spectrum").set(input_spectrum);
	std::vector<float> output_bands;
	std::vector<float> output_frequencies;
	_spectrumtocent->output("bands").set(output_bands);
	_spectrumtocent->output("frequencies").set(output_frequencies);
	_spectrumtocent->compute();
	val outputSpectrumToCent(val::object());
	outputSpectrumToCent.set("bands", output_bands);
	outputSpectrumToCent.set("frequencies", output_frequencies);
	return outputSpectrumToCent;
}
void SpectrumToCent::reset() {
_spectrumtocent->reset();
}
// END SpectrumToCent definitions

// START Spline definitions
// check https://essentia.upf.edu/reference/std_Spline.html
Spline::Spline(const float beta1, const float beta2, const std::string& type, const std::vector<float>& xPoints, const std::vector<float>& yPoints) {
	_spline = AlgorithmFactory::create("Spline", "beta1", beta1, "beta2", beta2, "type", type, "xPoints", xPoints, "yPoints", yPoints);
}
Spline::~Spline() {
	if (_spline) delete _spline;
}
void Spline::configure(const float beta1, const float beta2, const std::string& type, const std::vector<float>& xPoints, const std::vector<float>& yPoints) {
	_spline->configure("beta1", beta1, "beta2", beta2, "type", type, "xPoints", xPoints, "yPoints", yPoints);
}
val Spline::compute(float input_x) {
	_spline->input("x").set(input_x);
	float output_y;
	_spline->output("y").set(output_y);
	_spline->compute();
	val outputSpline(val::object());
	outputSpline.set("y", output_y);
	return outputSpline;
}
void Spline::reset() {
_spline->reset();
}
// END Spline definitions

// START SprModelAnal definitions
// check https://essentia.upf.edu/reference/std_SprModelAnal.html
SprModelAnal::SprModelAnal(const int fftSize, const int freqDevOffset, const float freqDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const std::string& orderBy, const float sampleRate) {
	_sprmodelanal = AlgorithmFactory::create("SprModelAnal", "fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "orderBy", orderBy, "sampleRate", sampleRate);
}
SprModelAnal::~SprModelAnal() {
	if (_sprmodelanal) delete _sprmodelanal;
}
void SprModelAnal::configure(const int fftSize, const int freqDevOffset, const float freqDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const std::string& orderBy, const float sampleRate) {
	_sprmodelanal->configure("fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "orderBy", orderBy, "sampleRate", sampleRate);
}
val SprModelAnal::compute(std::vector<float>& input_frame) {
	_sprmodelanal->input("frame").set(input_frame);
	std::vector<float> output_frequencies;
	std::vector<float> output_magnitudes;
	std::vector<float> output_phases;
	std::vector<float> output_res;
	_sprmodelanal->output("frequencies").set(output_frequencies);
	_sprmodelanal->output("magnitudes").set(output_magnitudes);
	_sprmodelanal->output("phases").set(output_phases);
	_sprmodelanal->output("res").set(output_res);
	_sprmodelanal->compute();
	val outputSprModelAnal(val::object());
	outputSprModelAnal.set("frequencies", output_frequencies);
	outputSprModelAnal.set("magnitudes", output_magnitudes);
	outputSprModelAnal.set("phases", output_phases);
	outputSprModelAnal.set("res", output_res);
	return outputSprModelAnal;
}
void SprModelAnal::reset() {
_sprmodelanal->reset();
}
// END SprModelAnal definitions

// START SprModelSynth definitions
// check https://essentia.upf.edu/reference/std_SprModelSynth.html
SprModelSynth::SprModelSynth(const int fftSize, const int hopSize, const float sampleRate) {
	_sprmodelsynth = AlgorithmFactory::create("SprModelSynth", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate);
}
SprModelSynth::~SprModelSynth() {
	if (_sprmodelsynth) delete _sprmodelsynth;
}
void SprModelSynth::configure(const int fftSize, const int hopSize, const float sampleRate) {
	_sprmodelsynth->configure("fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate);
}
val SprModelSynth::compute(std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases, std::vector<float>& input_res) {
	_sprmodelsynth->input("magnitudes").set(input_magnitudes);
	_sprmodelsynth->input("frequencies").set(input_frequencies);
	_sprmodelsynth->input("phases").set(input_phases);
	_sprmodelsynth->input("res").set(input_res);
	std::vector<float> output_frame;
	std::vector<float> output_sineframe;
	std::vector<float> output_resframe;
	_sprmodelsynth->output("frame").set(output_frame);
	_sprmodelsynth->output("sineframe").set(output_sineframe);
	_sprmodelsynth->output("resframe").set(output_resframe);
	_sprmodelsynth->compute();
	val outputSprModelSynth(val::object());
	outputSprModelSynth.set("frame", output_frame);
	outputSprModelSynth.set("sineframe", output_sineframe);
	outputSprModelSynth.set("resframe", output_resframe);
	return outputSprModelSynth;
}
void SprModelSynth::reset() {
_sprmodelsynth->reset();
}
// END SprModelSynth definitions

// START SpsModelAnal definitions
// check https://essentia.upf.edu/reference/std_SpsModelAnal.html
SpsModelAnal::SpsModelAnal(const int fftSize, const int freqDevOffset, const float freqDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const std::string& orderBy, const float sampleRate, const float stocf) {
	_spsmodelanal = AlgorithmFactory::create("SpsModelAnal", "fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "orderBy", orderBy, "sampleRate", sampleRate, "stocf", stocf);
}
SpsModelAnal::~SpsModelAnal() {
	if (_spsmodelanal) delete _spsmodelanal;
}
void SpsModelAnal::configure(const int fftSize, const int freqDevOffset, const float freqDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const std::string& orderBy, const float sampleRate, const float stocf) {
	_spsmodelanal->configure("fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "orderBy", orderBy, "sampleRate", sampleRate, "stocf", stocf);
}
val SpsModelAnal::compute(std::vector<float>& input_frame) {
	_spsmodelanal->input("frame").set(input_frame);
	std::vector<float> output_frequencies;
	std::vector<float> output_magnitudes;
	std::vector<float> output_phases;
	std::vector<float> output_stocenv;
	_spsmodelanal->output("frequencies").set(output_frequencies);
	_spsmodelanal->output("magnitudes").set(output_magnitudes);
	_spsmodelanal->output("phases").set(output_phases);
	_spsmodelanal->output("stocenv").set(output_stocenv);
	_spsmodelanal->compute();
	val outputSpsModelAnal(val::object());
	outputSpsModelAnal.set("frequencies", output_frequencies);
	outputSpsModelAnal.set("magnitudes", output_magnitudes);
	outputSpsModelAnal.set("phases", output_phases);
	outputSpsModelAnal.set("stocenv", output_stocenv);
	return outputSpsModelAnal;
}
void SpsModelAnal::reset() {
_spsmodelanal->reset();
}
// END SpsModelAnal definitions

// START SpsModelSynth definitions
// check https://essentia.upf.edu/reference/std_SpsModelSynth.html
SpsModelSynth::SpsModelSynth(const int fftSize, const int hopSize, const float sampleRate, const float stocf) {
	_spsmodelsynth = AlgorithmFactory::create("SpsModelSynth", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate, "stocf", stocf);
}
SpsModelSynth::~SpsModelSynth() {
	if (_spsmodelsynth) delete _spsmodelsynth;
}
void SpsModelSynth::configure(const int fftSize, const int hopSize, const float sampleRate, const float stocf) {
	_spsmodelsynth->configure("fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate, "stocf", stocf);
}
val SpsModelSynth::compute(std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases, std::vector<float>& input_stocenv) {
	_spsmodelsynth->input("magnitudes").set(input_magnitudes);
	_spsmodelsynth->input("frequencies").set(input_frequencies);
	_spsmodelsynth->input("phases").set(input_phases);
	_spsmodelsynth->input("stocenv").set(input_stocenv);
	std::vector<float> output_frame;
	std::vector<float> output_sineframe;
	std::vector<float> output_stocframe;
	_spsmodelsynth->output("frame").set(output_frame);
	_spsmodelsynth->output("sineframe").set(output_sineframe);
	_spsmodelsynth->output("stocframe").set(output_stocframe);
	_spsmodelsynth->compute();
	val outputSpsModelSynth(val::object());
	outputSpsModelSynth.set("frame", output_frame);
	outputSpsModelSynth.set("sineframe", output_sineframe);
	outputSpsModelSynth.set("stocframe", output_stocframe);
	return outputSpsModelSynth;
}
void SpsModelSynth::reset() {
_spsmodelsynth->reset();
}
// END SpsModelSynth definitions

// START StartStopCut definitions
// check https://essentia.upf.edu/reference/std_StartStopCut.html
StartStopCut::StartStopCut(const int frameSize, const int hopSize, const float maximumStartTime, const float maximumStopTime, const float sampleRate, const int threshold) {
	_startstopcut = AlgorithmFactory::create("StartStopCut", "frameSize", frameSize, "hopSize", hopSize, "maximumStartTime", maximumStartTime, "maximumStopTime", maximumStopTime, "sampleRate", sampleRate, "threshold", threshold);
}
StartStopCut::~StartStopCut() {
	if (_startstopcut) delete _startstopcut;
}
void StartStopCut::configure(const int frameSize, const int hopSize, const float maximumStartTime, const float maximumStopTime, const float sampleRate, const int threshold) {
	_startstopcut->configure("frameSize", frameSize, "hopSize", hopSize, "maximumStartTime", maximumStartTime, "maximumStopTime", maximumStopTime, "sampleRate", sampleRate, "threshold", threshold);
}
val StartStopCut::compute(std::vector<float>& input_audio) {
	_startstopcut->input("audio").set(input_audio);
	int output_startCut;
	int output_stopCut;
	_startstopcut->output("startCut").set(output_startCut);
	_startstopcut->output("stopCut").set(output_stopCut);
	_startstopcut->compute();
	val outputStartStopCut(val::object());
	outputStartStopCut.set("startCut", output_startCut);
	outputStartStopCut.set("stopCut", output_stopCut);
	return outputStartStopCut;
}
void StartStopCut::reset() {
_startstopcut->reset();
}
// END StartStopCut definitions

// START StartStopSilence definitions
// check https://essentia.upf.edu/reference/std_StartStopSilence.html
StartStopSilence::StartStopSilence(const int threshold) {
	_startstopsilence = AlgorithmFactory::create("StartStopSilence", "threshold", threshold);
}
StartStopSilence::~StartStopSilence() {
	if (_startstopsilence) delete _startstopsilence;
}
void StartStopSilence::configure(const int threshold) {
	_startstopsilence->configure("threshold", threshold);
}
val StartStopSilence::compute(std::vector<float>& input_frame) {
	_startstopsilence->input("frame").set(input_frame);
	int output_startFrame;
	int output_stopFrame;
	_startstopsilence->output("startFrame").set(output_startFrame);
	_startstopsilence->output("stopFrame").set(output_stopFrame);
	_startstopsilence->compute();
	val outputStartStopSilence(val::object());
	outputStartStopSilence.set("startFrame", output_startFrame);
	outputStartStopSilence.set("stopFrame", output_stopFrame);
	return outputStartStopSilence;
}
void StartStopSilence::reset() {
_startstopsilence->reset();
}
// END StartStopSilence definitions

// START StochasticModelAnal definitions
// check https://essentia.upf.edu/reference/std_StochasticModelAnal.html
StochasticModelAnal::StochasticModelAnal(const int fftSize, const int hopSize, const float sampleRate, const float stocf) {
	_stochasticmodelanal = AlgorithmFactory::create("StochasticModelAnal", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate, "stocf", stocf);
}
StochasticModelAnal::~StochasticModelAnal() {
	if (_stochasticmodelanal) delete _stochasticmodelanal;
}
void StochasticModelAnal::configure(const int fftSize, const int hopSize, const float sampleRate, const float stocf) {
	_stochasticmodelanal->configure("fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate, "stocf", stocf);
}
val StochasticModelAnal::compute(std::vector<float>& input_frame) {
	_stochasticmodelanal->input("frame").set(input_frame);
	std::vector<float> output_stocenv;
	_stochasticmodelanal->output("stocenv").set(output_stocenv);
	_stochasticmodelanal->compute();
	val outputStochasticModelAnal(val::object());
	outputStochasticModelAnal.set("stocenv", output_stocenv);
	return outputStochasticModelAnal;
}
void StochasticModelAnal::reset() {
_stochasticmodelanal->reset();
}
// END StochasticModelAnal definitions

// START StochasticModelSynth definitions
// check https://essentia.upf.edu/reference/std_StochasticModelSynth.html
StochasticModelSynth::StochasticModelSynth(const int fftSize, const int hopSize, const float sampleRate, const float stocf) {
	_stochasticmodelsynth = AlgorithmFactory::create("StochasticModelSynth", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate, "stocf", stocf);
}
StochasticModelSynth::~StochasticModelSynth() {
	if (_stochasticmodelsynth) delete _stochasticmodelsynth;
}
void StochasticModelSynth::configure(const int fftSize, const int hopSize, const float sampleRate, const float stocf) {
	_stochasticmodelsynth->configure("fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate, "stocf", stocf);
}
val StochasticModelSynth::compute(std::vector<float>& input_stocenv) {
	_stochasticmodelsynth->input("stocenv").set(input_stocenv);
	std::vector<float> output_frame;
	_stochasticmodelsynth->output("frame").set(output_frame);
	_stochasticmodelsynth->compute();
	val outputStochasticModelSynth(val::object());
	outputStochasticModelSynth.set("frame", output_frame);
	return outputStochasticModelSynth;
}
void StochasticModelSynth::reset() {
_stochasticmodelsynth->reset();
}
// END StochasticModelSynth definitions

// START StrongDecay definitions
// check https://essentia.upf.edu/reference/std_StrongDecay.html
StrongDecay::StrongDecay(const float sampleRate) {
	_strongdecay = AlgorithmFactory::create("StrongDecay", "sampleRate", sampleRate);
}
StrongDecay::~StrongDecay() {
	if (_strongdecay) delete _strongdecay;
}
void StrongDecay::configure(const float sampleRate) {
	_strongdecay->configure("sampleRate", sampleRate);
}
val StrongDecay::compute(std::vector<float>& input_signal) {
	_strongdecay->input("signal").set(input_signal);
	float output_strongDecay;
	_strongdecay->output("strongDecay").set(output_strongDecay);
	_strongdecay->compute();
	val outputStrongDecay(val::object());
	outputStrongDecay.set("strongDecay", output_strongDecay);
	return outputStrongDecay;
}
void StrongDecay::reset() {
_strongdecay->reset();
}
// END StrongDecay definitions

// START StrongPeak definitions
// check https://essentia.upf.edu/reference/std_StrongPeak.html
StrongPeak::StrongPeak() {
	_strongpeak = AlgorithmFactory::create("StrongPeak");
}
StrongPeak::~StrongPeak() {
	if (_strongpeak) delete _strongpeak;
}
void StrongPeak::configure() {
	_strongpeak->configure();
}
val StrongPeak::compute(std::vector<float>& input_spectrum) {
	_strongpeak->input("spectrum").set(input_spectrum);
	float output_strongPeak;
	_strongpeak->output("strongPeak").set(output_strongPeak);
	_strongpeak->compute();
	val outputStrongPeak(val::object());
	outputStrongPeak.set("strongPeak", output_strongPeak);
	return outputStrongPeak;
}
void StrongPeak::reset() {
_strongpeak->reset();
}
// END StrongPeak definitions

// START SuperFluxExtractor definitions
// check https://essentia.upf.edu/reference/std_SuperFluxExtractor.html
SuperFluxExtractor::SuperFluxExtractor(const float combine, const int frameSize, const int hopSize, const float ratioThreshold, const float sampleRate, const float threshold) {
	_superfluxextractor = AlgorithmFactory::create("SuperFluxExtractor", "combine", combine, "frameSize", frameSize, "hopSize", hopSize, "ratioThreshold", ratioThreshold, "sampleRate", sampleRate, "threshold", threshold);
}
SuperFluxExtractor::~SuperFluxExtractor() {
	if (_superfluxextractor) delete _superfluxextractor;
}
void SuperFluxExtractor::configure(const float combine, const int frameSize, const int hopSize, const float ratioThreshold, const float sampleRate, const float threshold) {
	_superfluxextractor->configure("combine", combine, "frameSize", frameSize, "hopSize", hopSize, "ratioThreshold", ratioThreshold, "sampleRate", sampleRate, "threshold", threshold);
}
val SuperFluxExtractor::compute(std::vector<float>& input_signal) {
	_superfluxextractor->input("signal").set(input_signal);
	std::vector<float> output_onsets;
	_superfluxextractor->output("onsets").set(output_onsets);
	_superfluxextractor->compute();
	val outputSuperFluxExtractor(val::object());
	outputSuperFluxExtractor.set("onsets", output_onsets);
	return outputSuperFluxExtractor;
}
void SuperFluxExtractor::reset() {
_superfluxextractor->reset();
}
// END SuperFluxExtractor definitions

// START SuperFluxNovelty definitions
// check https://essentia.upf.edu/reference/std_SuperFluxNovelty.html
SuperFluxNovelty::SuperFluxNovelty(const int binWidth, const int frameWidth) {
	_superfluxnovelty = AlgorithmFactory::create("SuperFluxNovelty", "binWidth", binWidth, "frameWidth", frameWidth);
}
SuperFluxNovelty::~SuperFluxNovelty() {
	if (_superfluxnovelty) delete _superfluxnovelty;
}
void SuperFluxNovelty::configure(const int binWidth, const int frameWidth) {
	_superfluxnovelty->configure("binWidth", binWidth, "frameWidth", frameWidth);
}
val SuperFluxNovelty::compute(std::vector<std::vector<float> >& input_bands) {
	_superfluxnovelty->input("bands").set(input_bands);
	float output_differences;
	_superfluxnovelty->output("differences").set(output_differences);
	_superfluxnovelty->compute();
	val outputSuperFluxNovelty(val::object());
	outputSuperFluxNovelty.set("differences", output_differences);
	return outputSuperFluxNovelty;
}
void SuperFluxNovelty::reset() {
_superfluxnovelty->reset();
}
// END SuperFluxNovelty definitions

// START SuperFluxPeaks definitions
// check https://essentia.upf.edu/reference/std_SuperFluxPeaks.html
SuperFluxPeaks::SuperFluxPeaks(const float combine, const float frameRate, const float pre_avg, const float pre_max, const float ratioThreshold, const float threshold) {
	_superfluxpeaks = AlgorithmFactory::create("SuperFluxPeaks", "combine", combine, "frameRate", frameRate, "pre_avg", pre_avg, "pre_max", pre_max, "ratioThreshold", ratioThreshold, "threshold", threshold);
}
SuperFluxPeaks::~SuperFluxPeaks() {
	if (_superfluxpeaks) delete _superfluxpeaks;
}
void SuperFluxPeaks::configure(const float combine, const float frameRate, const float pre_avg, const float pre_max, const float ratioThreshold, const float threshold) {
	_superfluxpeaks->configure("combine", combine, "frameRate", frameRate, "pre_avg", pre_avg, "pre_max", pre_max, "ratioThreshold", ratioThreshold, "threshold", threshold);
}
val SuperFluxPeaks::compute(std::vector<float>& input_novelty) {
	_superfluxpeaks->input("novelty").set(input_novelty);
	std::vector<float> output_peaks;
	_superfluxpeaks->output("peaks").set(output_peaks);
	_superfluxpeaks->compute();
	val outputSuperFluxPeaks(val::object());
	outputSuperFluxPeaks.set("peaks", output_peaks);
	return outputSuperFluxPeaks;
}
void SuperFluxPeaks::reset() {
_superfluxpeaks->reset();
}
// END SuperFluxPeaks definitions

// START TCToTotal definitions
// check https://essentia.upf.edu/reference/std_TCToTotal.html
TCToTotal::TCToTotal() {
	_tctototal = AlgorithmFactory::create("TCToTotal");
}
TCToTotal::~TCToTotal() {
	if (_tctototal) delete _tctototal;
}
void TCToTotal::configure() {
	_tctototal->configure();
}
val TCToTotal::compute(std::vector<float>& input_envelope) {
	_tctototal->input("envelope").set(input_envelope);
	float output_TCToTotal;
	_tctototal->output("TCToTotal").set(output_TCToTotal);
	_tctototal->compute();
	val outputTCToTotal(val::object());
	outputTCToTotal.set("TCToTotal", output_TCToTotal);
	return outputTCToTotal;
}
void TCToTotal::reset() {
_tctototal->reset();
}
// END TCToTotal definitions

// START TempoScaleBands definitions
// check https://essentia.upf.edu/reference/std_TempoScaleBands.html
TempoScaleBands::TempoScaleBands(const std::vector<float>& bandsGain, const float frameTime) {
	_temposcalebands = AlgorithmFactory::create("TempoScaleBands", "bandsGain", bandsGain, "frameTime", frameTime);
}
TempoScaleBands::~TempoScaleBands() {
	if (_temposcalebands) delete _temposcalebands;
}
void TempoScaleBands::configure(const std::vector<float>& bandsGain, const float frameTime) {
	_temposcalebands->configure("bandsGain", bandsGain, "frameTime", frameTime);
}
val TempoScaleBands::compute(std::vector<float>& input_bands) {
	_temposcalebands->input("bands").set(input_bands);
	std::vector<float> output_scaledBands;
	float output_cumulativeBands;
	_temposcalebands->output("scaledBands").set(output_scaledBands);
	_temposcalebands->output("cumulativeBands").set(output_cumulativeBands);
	_temposcalebands->compute();
	val outputTempoScaleBands(val::object());
	outputTempoScaleBands.set("scaledBands", output_scaledBands);
	outputTempoScaleBands.set("cumulativeBands", output_cumulativeBands);
	return outputTempoScaleBands;
}
void TempoScaleBands::reset() {
_temposcalebands->reset();
}
// END TempoScaleBands definitions

// START TempoTap definitions
// check https://essentia.upf.edu/reference/std_TempoTap.html
TempoTap::TempoTap(const int frameHop, const int frameSize, const int maxTempo, const int minTempo, const int numberFrames, const float sampleRate, const std::vector<float>& tempoHints) {
	_tempotap = AlgorithmFactory::create("TempoTap", "frameHop", frameHop, "frameSize", frameSize, "maxTempo", maxTempo, "minTempo", minTempo, "numberFrames", numberFrames, "sampleRate", sampleRate, "tempoHints", tempoHints);
}
TempoTap::~TempoTap() {
	if (_tempotap) delete _tempotap;
}
void TempoTap::configure(const int frameHop, const int frameSize, const int maxTempo, const int minTempo, const int numberFrames, const float sampleRate, const std::vector<float>& tempoHints) {
	_tempotap->configure("frameHop", frameHop, "frameSize", frameSize, "maxTempo", maxTempo, "minTempo", minTempo, "numberFrames", numberFrames, "sampleRate", sampleRate, "tempoHints", tempoHints);
}
val TempoTap::compute(std::vector<float>& input_featuresFrame) {
	_tempotap->input("featuresFrame").set(input_featuresFrame);
	std::vector<float> output_periods;
	std::vector<float> output_phases;
	_tempotap->output("periods").set(output_periods);
	_tempotap->output("phases").set(output_phases);
	_tempotap->compute();
	val outputTempoTap(val::object());
	outputTempoTap.set("periods", output_periods);
	outputTempoTap.set("phases", output_phases);
	return outputTempoTap;
}
void TempoTap::reset() {
_tempotap->reset();
}
// END TempoTap definitions

// START TempoTapDegara definitions
// check https://essentia.upf.edu/reference/std_TempoTapDegara.html
TempoTapDegara::TempoTapDegara(const int maxTempo, const int minTempo, const std::string& resample, const float sampleRateODF) {
	_tempotapdegara = AlgorithmFactory::create("TempoTapDegara", "maxTempo", maxTempo, "minTempo", minTempo, "resample", resample, "sampleRateODF", sampleRateODF);
}
TempoTapDegara::~TempoTapDegara() {
	if (_tempotapdegara) delete _tempotapdegara;
}
void TempoTapDegara::configure(const int maxTempo, const int minTempo, const std::string& resample, const float sampleRateODF) {
	_tempotapdegara->configure("maxTempo", maxTempo, "minTempo", minTempo, "resample", resample, "sampleRateODF", sampleRateODF);
}
val TempoTapDegara::compute(std::vector<float>& input_onsetDetections) {
	_tempotapdegara->input("onsetDetections").set(input_onsetDetections);
	std::vector<float> output_ticks;
	_tempotapdegara->output("ticks").set(output_ticks);
	_tempotapdegara->compute();
	val outputTempoTapDegara(val::object());
	outputTempoTapDegara.set("ticks", output_ticks);
	return outputTempoTapDegara;
}
void TempoTapDegara::reset() {
_tempotapdegara->reset();
}
// END TempoTapDegara definitions

// START TempoTapMaxAgreement definitions
// check https://essentia.upf.edu/reference/std_TempoTapMaxAgreement.html
TempoTapMaxAgreement::TempoTapMaxAgreement() {
	_tempotapmaxagreement = AlgorithmFactory::create("TempoTapMaxAgreement");
}
TempoTapMaxAgreement::~TempoTapMaxAgreement() {
	if (_tempotapmaxagreement) delete _tempotapmaxagreement;
}
void TempoTapMaxAgreement::configure() {
	_tempotapmaxagreement->configure();
}
val TempoTapMaxAgreement::compute(std::vector<std::vector<float> >& input_tickCandidates) {
	_tempotapmaxagreement->input("tickCandidates").set(input_tickCandidates);
	std::vector<float> output_ticks;
	float output_confidence;
	_tempotapmaxagreement->output("ticks").set(output_ticks);
	_tempotapmaxagreement->output("confidence").set(output_confidence);
	_tempotapmaxagreement->compute();
	val outputTempoTapMaxAgreement(val::object());
	outputTempoTapMaxAgreement.set("ticks", output_ticks);
	outputTempoTapMaxAgreement.set("confidence", output_confidence);
	return outputTempoTapMaxAgreement;
}
void TempoTapMaxAgreement::reset() {
_tempotapmaxagreement->reset();
}
// END TempoTapMaxAgreement definitions

// START TempoTapTicks definitions
// check https://essentia.upf.edu/reference/std_TempoTapTicks.html
TempoTapTicks::TempoTapTicks(const int frameHop, const int hopSize, const float sampleRate) {
	_tempotapticks = AlgorithmFactory::create("TempoTapTicks", "frameHop", frameHop, "hopSize", hopSize, "sampleRate", sampleRate);
}
TempoTapTicks::~TempoTapTicks() {
	if (_tempotapticks) delete _tempotapticks;
}
void TempoTapTicks::configure(const int frameHop, const int hopSize, const float sampleRate) {
	_tempotapticks->configure("frameHop", frameHop, "hopSize", hopSize, "sampleRate", sampleRate);
}
val TempoTapTicks::compute(std::vector<float>& input_periods, std::vector<float>& input_phases) {
	_tempotapticks->input("periods").set(input_periods);
	_tempotapticks->input("phases").set(input_phases);
	std::vector<float> output_ticks;
	std::vector<float> output_matchingPeriods;
	_tempotapticks->output("ticks").set(output_ticks);
	_tempotapticks->output("matchingPeriods").set(output_matchingPeriods);
	_tempotapticks->compute();
	val outputTempoTapTicks(val::object());
	outputTempoTapTicks.set("ticks", output_ticks);
	outputTempoTapTicks.set("matchingPeriods", output_matchingPeriods);
	return outputTempoTapTicks;
}
void TempoTapTicks::reset() {
_tempotapticks->reset();
}
// END TempoTapTicks definitions

// START TensorflowInputFSDSINet definitions
// check https://essentia.upf.edu/reference/std_TensorflowInputFSDSINet.html
TensorflowInputFSDSINet::TensorflowInputFSDSINet() {
	_tensorflowinputfsdsinet = AlgorithmFactory::create("TensorflowInputFSDSINet");
}
TensorflowInputFSDSINet::~TensorflowInputFSDSINet() {
	if (_tensorflowinputfsdsinet) delete _tensorflowinputfsdsinet;
}
void TensorflowInputFSDSINet::configure() {
	_tensorflowinputfsdsinet->configure();
}
val TensorflowInputFSDSINet::compute(std::vector<float>& input_frame) {
	_tensorflowinputfsdsinet->input("frame").set(input_frame);
	std::vector<float> output_bands;
	_tensorflowinputfsdsinet->output("bands").set(output_bands);
	_tensorflowinputfsdsinet->compute();
	val outputTensorflowInputFSDSINet(val::object());
	outputTensorflowInputFSDSINet.set("bands", output_bands);
	return outputTensorflowInputFSDSINet;
}
void TensorflowInputFSDSINet::reset() {
_tensorflowinputfsdsinet->reset();
}
// END TensorflowInputFSDSINet definitions

// START TensorflowInputMusiCNN definitions
// check https://essentia.upf.edu/reference/std_TensorflowInputMusiCNN.html
TensorflowInputMusiCNN::TensorflowInputMusiCNN() {
	_tensorflowinputmusicnn = AlgorithmFactory::create("TensorflowInputMusiCNN");
}
TensorflowInputMusiCNN::~TensorflowInputMusiCNN() {
	if (_tensorflowinputmusicnn) delete _tensorflowinputmusicnn;
}
void TensorflowInputMusiCNN::configure() {
	_tensorflowinputmusicnn->configure();
}
val TensorflowInputMusiCNN::compute(std::vector<float>& input_frame) {
	_tensorflowinputmusicnn->input("frame").set(input_frame);
	std::vector<float> output_bands;
	_tensorflowinputmusicnn->output("bands").set(output_bands);
	_tensorflowinputmusicnn->compute();
	val outputTensorflowInputMusiCNN(val::object());
	outputTensorflowInputMusiCNN.set("bands", output_bands);
	return outputTensorflowInputMusiCNN;
}
void TensorflowInputMusiCNN::reset() {
_tensorflowinputmusicnn->reset();
}
// END TensorflowInputMusiCNN definitions

// START TensorflowInputTempoCNN definitions
// check https://essentia.upf.edu/reference/std_TensorflowInputTempoCNN.html
TensorflowInputTempoCNN::TensorflowInputTempoCNN() {
	_tensorflowinputtempocnn = AlgorithmFactory::create("TensorflowInputTempoCNN");
}
TensorflowInputTempoCNN::~TensorflowInputTempoCNN() {
	if (_tensorflowinputtempocnn) delete _tensorflowinputtempocnn;
}
void TensorflowInputTempoCNN::configure() {
	_tensorflowinputtempocnn->configure();
}
val TensorflowInputTempoCNN::compute(std::vector<float>& input_frame) {
	_tensorflowinputtempocnn->input("frame").set(input_frame);
	std::vector<float> output_bands;
	_tensorflowinputtempocnn->output("bands").set(output_bands);
	_tensorflowinputtempocnn->compute();
	val outputTensorflowInputTempoCNN(val::object());
	outputTensorflowInputTempoCNN.set("bands", output_bands);
	return outputTensorflowInputTempoCNN;
}
void TensorflowInputTempoCNN::reset() {
_tensorflowinputtempocnn->reset();
}
// END TensorflowInputTempoCNN definitions

// START TensorflowInputVGGish definitions
// check https://essentia.upf.edu/reference/std_TensorflowInputVGGish.html
TensorflowInputVGGish::TensorflowInputVGGish() {
	_tensorflowinputvggish = AlgorithmFactory::create("TensorflowInputVGGish");
}
TensorflowInputVGGish::~TensorflowInputVGGish() {
	if (_tensorflowinputvggish) delete _tensorflowinputvggish;
}
void TensorflowInputVGGish::configure() {
	_tensorflowinputvggish->configure();
}
val TensorflowInputVGGish::compute(std::vector<float>& input_frame) {
	_tensorflowinputvggish->input("frame").set(input_frame);
	std::vector<float> output_bands;
	_tensorflowinputvggish->output("bands").set(output_bands);
	_tensorflowinputvggish->compute();
	val outputTensorflowInputVGGish(val::object());
	outputTensorflowInputVGGish.set("bands", output_bands);
	return outputTensorflowInputVGGish;
}
void TensorflowInputVGGish::reset() {
_tensorflowinputvggish->reset();
}
// END TensorflowInputVGGish definitions

// START TonalExtractor definitions
// check https://essentia.upf.edu/reference/std_TonalExtractor.html
TonalExtractor::TonalExtractor(const int frameSize, const int hopSize, const float tuningFrequency) {
	_tonalextractor = AlgorithmFactory::create("TonalExtractor", "frameSize", frameSize, "hopSize", hopSize, "tuningFrequency", tuningFrequency);
}
TonalExtractor::~TonalExtractor() {
	if (_tonalextractor) delete _tonalextractor;
}
void TonalExtractor::configure(const int frameSize, const int hopSize, const float tuningFrequency) {
	_tonalextractor->configure("frameSize", frameSize, "hopSize", hopSize, "tuningFrequency", tuningFrequency);
}
val TonalExtractor::compute(std::vector<float>& input_signal) {
	_tonalextractor->input("signal").set(input_signal);
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
	_tonalextractor->output("chords_changes_rate").set(output_chords_changes_rate);
	_tonalextractor->output("chords_histogram").set(output_chords_histogram);
	_tonalextractor->output("chords_key").set(output_chords_key);
	_tonalextractor->output("chords_number_rate").set(output_chords_number_rate);
	_tonalextractor->output("chords_progression").set(output_chords_progression);
	_tonalextractor->output("chords_scale").set(output_chords_scale);
	_tonalextractor->output("chords_strength").set(output_chords_strength);
	_tonalextractor->output("hpcp").set(output_hpcp);
	_tonalextractor->output("hpcp_highres").set(output_hpcp_highres);
	_tonalextractor->output("key_key").set(output_key_key);
	_tonalextractor->output("key_scale").set(output_key_scale);
	_tonalextractor->output("key_strength").set(output_key_strength);
	_tonalextractor->compute();
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
	return outputTonalExtractor;
}
void TonalExtractor::reset() {
_tonalextractor->reset();
}
// END TonalExtractor definitions

// START TonicIndianArtMusic definitions
// check https://essentia.upf.edu/reference/std_TonicIndianArtMusic.html
TonicIndianArtMusic::TonicIndianArtMusic(const float binResolution, const int frameSize, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const float magnitudeThreshold, const float maxTonicFrequency, const float minTonicFrequency, const int numberHarmonics, const int numberSaliencePeaks, const float referenceFrequency, const float sampleRate) {
	_tonicindianartmusic = AlgorithmFactory::create("TonicIndianArtMusic", "binResolution", binResolution, "frameSize", frameSize, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxTonicFrequency", maxTonicFrequency, "minTonicFrequency", minTonicFrequency, "numberHarmonics", numberHarmonics, "numberSaliencePeaks", numberSaliencePeaks, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate);
}
TonicIndianArtMusic::~TonicIndianArtMusic() {
	if (_tonicindianartmusic) delete _tonicindianartmusic;
}
void TonicIndianArtMusic::configure(const float binResolution, const int frameSize, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const float magnitudeThreshold, const float maxTonicFrequency, const float minTonicFrequency, const int numberHarmonics, const int numberSaliencePeaks, const float referenceFrequency, const float sampleRate) {
	_tonicindianartmusic->configure("binResolution", binResolution, "frameSize", frameSize, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxTonicFrequency", maxTonicFrequency, "minTonicFrequency", minTonicFrequency, "numberHarmonics", numberHarmonics, "numberSaliencePeaks", numberSaliencePeaks, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate);
}
val TonicIndianArtMusic::compute(std::vector<float>& input_signal) {
	_tonicindianartmusic->input("signal").set(input_signal);
	float output_tonic;
	_tonicindianartmusic->output("tonic").set(output_tonic);
	_tonicindianartmusic->compute();
	val outputTonicIndianArtMusic(val::object());
	outputTonicIndianArtMusic.set("tonic", output_tonic);
	return outputTonicIndianArtMusic;
}
void TonicIndianArtMusic::reset() {
_tonicindianartmusic->reset();
}
// END TonicIndianArtMusic definitions

// START TriangularBands definitions
// check https://essentia.upf.edu/reference/std_TriangularBands.html
TriangularBands::TriangularBands(const std::vector<float>& frequencyBands, const int inputSize, const bool log, const std::string& normalize, const float sampleRate, const std::string& type, const std::string& weighting) {
	_triangularbands = AlgorithmFactory::create("TriangularBands", "frequencyBands", frequencyBands, "inputSize", inputSize, "log", log, "normalize", normalize, "sampleRate", sampleRate, "type", type, "weighting", weighting);
}
TriangularBands::~TriangularBands() {
	if (_triangularbands) delete _triangularbands;
}
void TriangularBands::configure(const std::vector<float>& frequencyBands, const int inputSize, const bool log, const std::string& normalize, const float sampleRate, const std::string& type, const std::string& weighting) {
	_triangularbands->configure("frequencyBands", frequencyBands, "inputSize", inputSize, "log", log, "normalize", normalize, "sampleRate", sampleRate, "type", type, "weighting", weighting);
}
val TriangularBands::compute(std::vector<float>& input_spectrum) {
	_triangularbands->input("spectrum").set(input_spectrum);
	std::vector<float> output_bands;
	_triangularbands->output("bands").set(output_bands);
	_triangularbands->compute();
	val outputTriangularBands(val::object());
	outputTriangularBands.set("bands", output_bands);
	return outputTriangularBands;
}
void TriangularBands::reset() {
_triangularbands->reset();
}
// END TriangularBands definitions

// START TriangularBarkBands definitions
// check https://essentia.upf.edu/reference/std_TriangularBarkBands.html
TriangularBarkBands::TriangularBarkBands(const float highFrequencyBound, const int inputSize, const bool log, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const float sampleRate, const std::string& type, const std::string& weighting) {
	_triangularbarkbands = AlgorithmFactory::create("TriangularBarkBands", "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "log", log, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "sampleRate", sampleRate, "type", type, "weighting", weighting);
}
TriangularBarkBands::~TriangularBarkBands() {
	if (_triangularbarkbands) delete _triangularbarkbands;
}
void TriangularBarkBands::configure(const float highFrequencyBound, const int inputSize, const bool log, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const float sampleRate, const std::string& type, const std::string& weighting) {
	_triangularbarkbands->configure("highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "log", log, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "sampleRate", sampleRate, "type", type, "weighting", weighting);
}
val TriangularBarkBands::compute(std::vector<float>& input_spectrum) {
	_triangularbarkbands->input("spectrum").set(input_spectrum);
	std::vector<float> output_bands;
	_triangularbarkbands->output("bands").set(output_bands);
	_triangularbarkbands->compute();
	val outputTriangularBarkBands(val::object());
	outputTriangularBarkBands.set("bands", output_bands);
	return outputTriangularBarkBands;
}
void TriangularBarkBands::reset() {
_triangularbarkbands->reset();
}
// END TriangularBarkBands definitions

// START Trimmer definitions
// check https://essentia.upf.edu/reference/std_Trimmer.html
Trimmer::Trimmer(const bool checkRange, const float endTime, const float sampleRate, const float startTime) {
	_trimmer = AlgorithmFactory::create("Trimmer", "checkRange", checkRange, "endTime", endTime, "sampleRate", sampleRate, "startTime", startTime);
}
Trimmer::~Trimmer() {
	if (_trimmer) delete _trimmer;
}
void Trimmer::configure(const bool checkRange, const float endTime, const float sampleRate, const float startTime) {
	_trimmer->configure("checkRange", checkRange, "endTime", endTime, "sampleRate", sampleRate, "startTime", startTime);
}
val Trimmer::compute(std::vector<float>& input_signal) {
	_trimmer->input("signal").set(input_signal);
	std::vector<float> output_signal;
	_trimmer->output("signal").set(output_signal);
	_trimmer->compute();
	val outputTrimmer(val::object());
	outputTrimmer.set("signal", output_signal);
	return outputTrimmer;
}
void Trimmer::reset() {
_trimmer->reset();
}
// END Trimmer definitions

// START Tristimulus definitions
// check https://essentia.upf.edu/reference/std_Tristimulus.html
Tristimulus::Tristimulus() {
	_tristimulus = AlgorithmFactory::create("Tristimulus");
}
Tristimulus::~Tristimulus() {
	if (_tristimulus) delete _tristimulus;
}
void Tristimulus::configure() {
	_tristimulus->configure();
}
val Tristimulus::compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
	_tristimulus->input("frequencies").set(input_frequencies);
	_tristimulus->input("magnitudes").set(input_magnitudes);
	std::vector<float> output_tristimulus;
	_tristimulus->output("tristimulus").set(output_tristimulus);
	_tristimulus->compute();
	val outputTristimulus(val::object());
	outputTristimulus.set("tristimulus", output_tristimulus);
	return outputTristimulus;
}
void Tristimulus::reset() {
_tristimulus->reset();
}
// END Tristimulus definitions

// START TruePeakDetector definitions
// check https://essentia.upf.edu/reference/std_TruePeakDetector.html
TruePeakDetector::TruePeakDetector(const bool blockDC, const bool emphasise, const int oversamplingFactor, const int quality, const float sampleRate, const float threshold, const int version) {
	_truepeakdetector = AlgorithmFactory::create("TruePeakDetector", "blockDC", blockDC, "emphasise", emphasise, "oversamplingFactor", oversamplingFactor, "quality", quality, "sampleRate", sampleRate, "threshold", threshold, "version", version);
}
TruePeakDetector::~TruePeakDetector() {
	if (_truepeakdetector) delete _truepeakdetector;
}
void TruePeakDetector::configure(const bool blockDC, const bool emphasise, const int oversamplingFactor, const int quality, const float sampleRate, const float threshold, const int version) {
	_truepeakdetector->configure("blockDC", blockDC, "emphasise", emphasise, "oversamplingFactor", oversamplingFactor, "quality", quality, "sampleRate", sampleRate, "threshold", threshold, "version", version);
}
val TruePeakDetector::compute(std::vector<float>& input_signal) {
	_truepeakdetector->input("signal").set(input_signal);
	std::vector<float> output_peakLocations;
	std::vector<float> output_output;
	_truepeakdetector->output("peakLocations").set(output_peakLocations);
	_truepeakdetector->output("output").set(output_output);
	_truepeakdetector->compute();
	val outputTruePeakDetector(val::object());
	outputTruePeakDetector.set("peakLocations", output_peakLocations);
	outputTruePeakDetector.set("output", output_output);
	return outputTruePeakDetector;
}
void TruePeakDetector::reset() {
_truepeakdetector->reset();
}
// END TruePeakDetector definitions

// START TuningFrequency definitions
// check https://essentia.upf.edu/reference/std_TuningFrequency.html
TuningFrequency::TuningFrequency(const float resolution) {
	_tuningfrequency = AlgorithmFactory::create("TuningFrequency", "resolution", resolution);
}
TuningFrequency::~TuningFrequency() {
	if (_tuningfrequency) delete _tuningfrequency;
}
void TuningFrequency::configure(const float resolution) {
	_tuningfrequency->configure("resolution", resolution);
}
val TuningFrequency::compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
	_tuningfrequency->input("frequencies").set(input_frequencies);
	_tuningfrequency->input("magnitudes").set(input_magnitudes);
	float output_tuningFrequency;
	float output_tuningCents;
	_tuningfrequency->output("tuningFrequency").set(output_tuningFrequency);
	_tuningfrequency->output("tuningCents").set(output_tuningCents);
	_tuningfrequency->compute();
	val outputTuningFrequency(val::object());
	outputTuningFrequency.set("tuningFrequency", output_tuningFrequency);
	outputTuningFrequency.set("tuningCents", output_tuningCents);
	return outputTuningFrequency;
}
void TuningFrequency::reset() {
_tuningfrequency->reset();
}
// END TuningFrequency definitions

// START TuningFrequencyExtractor definitions
// check https://essentia.upf.edu/reference/std_TuningFrequencyExtractor.html
TuningFrequencyExtractor::TuningFrequencyExtractor(const int frameSize, const int hopSize) {
	_tuningfrequencyextractor = AlgorithmFactory::create("TuningFrequencyExtractor", "frameSize", frameSize, "hopSize", hopSize);
}
TuningFrequencyExtractor::~TuningFrequencyExtractor() {
	if (_tuningfrequencyextractor) delete _tuningfrequencyextractor;
}
void TuningFrequencyExtractor::configure(const int frameSize, const int hopSize) {
	_tuningfrequencyextractor->configure("frameSize", frameSize, "hopSize", hopSize);
}
val TuningFrequencyExtractor::compute(std::vector<float>& input_signal) {
	_tuningfrequencyextractor->input("signal").set(input_signal);
	std::vector<float> output_tuningFrequency;
	_tuningfrequencyextractor->output("tuningFrequency").set(output_tuningFrequency);
	_tuningfrequencyextractor->compute();
	val outputTuningFrequencyExtractor(val::object());
	outputTuningFrequencyExtractor.set("tuningFrequency", output_tuningFrequency);
	return outputTuningFrequencyExtractor;
}
void TuningFrequencyExtractor::reset() {
_tuningfrequencyextractor->reset();
}
// END TuningFrequencyExtractor definitions

// START UnaryOperator definitions
// check https://essentia.upf.edu/reference/std_UnaryOperator.html
UnaryOperator::UnaryOperator(const float scale, const float shift, const std::string& type) {
	_unaryoperator = AlgorithmFactory::create("UnaryOperator", "scale", scale, "shift", shift, "type", type);
}
UnaryOperator::~UnaryOperator() {
	if (_unaryoperator) delete _unaryoperator;
}
void UnaryOperator::configure(const float scale, const float shift, const std::string& type) {
	_unaryoperator->configure("scale", scale, "shift", shift, "type", type);
}
val UnaryOperator::compute(std::vector<float>& input_array) {
	_unaryoperator->input("array").set(input_array);
	std::vector<float> output_array;
	_unaryoperator->output("array").set(output_array);
	_unaryoperator->compute();
	val outputUnaryOperator(val::object());
	outputUnaryOperator.set("array", output_array);
	return outputUnaryOperator;
}
void UnaryOperator::reset() {
_unaryoperator->reset();
}
// END UnaryOperator definitions

// START UnaryOperatorStream definitions
// check https://essentia.upf.edu/reference/std_UnaryOperatorStream.html
UnaryOperatorStream::UnaryOperatorStream(const float scale, const float shift, const std::string& type) {
	_unaryoperatorstream = AlgorithmFactory::create("UnaryOperatorStream", "scale", scale, "shift", shift, "type", type);
}
UnaryOperatorStream::~UnaryOperatorStream() {
	if (_unaryoperatorstream) delete _unaryoperatorstream;
}
void UnaryOperatorStream::configure(const float scale, const float shift, const std::string& type) {
	_unaryoperatorstream->configure("scale", scale, "shift", shift, "type", type);
}
val UnaryOperatorStream::compute(std::vector<float>& input_array) {
	_unaryoperatorstream->input("array").set(input_array);
	std::vector<float> output_array;
	_unaryoperatorstream->output("array").set(output_array);
	_unaryoperatorstream->compute();
	val outputUnaryOperatorStream(val::object());
	outputUnaryOperatorStream.set("array", output_array);
	return outputUnaryOperatorStream;
}
void UnaryOperatorStream::reset() {
_unaryoperatorstream->reset();
}
// END UnaryOperatorStream definitions

// START Variance definitions
// check https://essentia.upf.edu/reference/std_Variance.html
Variance::Variance() {
	_variance = AlgorithmFactory::create("Variance");
}
Variance::~Variance() {
	if (_variance) delete _variance;
}
void Variance::configure() {
	_variance->configure();
}
val Variance::compute(std::vector<float>& input_array) {
	_variance->input("array").set(input_array);
	float output_variance;
	_variance->output("variance").set(output_variance);
	_variance->compute();
	val outputVariance(val::object());
	outputVariance.set("variance", output_variance);
	return outputVariance;
}
void Variance::reset() {
_variance->reset();
}
// END Variance definitions

// START Vibrato definitions
// check https://essentia.upf.edu/reference/std_Vibrato.html
Vibrato::Vibrato(const float maxExtend, const float maxFrequency, const float minExtend, const float minFrequency, const float sampleRate) {
	_vibrato = AlgorithmFactory::create("Vibrato", "maxExtend", maxExtend, "maxFrequency", maxFrequency, "minExtend", minExtend, "minFrequency", minFrequency, "sampleRate", sampleRate);
}
Vibrato::~Vibrato() {
	if (_vibrato) delete _vibrato;
}
void Vibrato::configure(const float maxExtend, const float maxFrequency, const float minExtend, const float minFrequency, const float sampleRate) {
	_vibrato->configure("maxExtend", maxExtend, "maxFrequency", maxFrequency, "minExtend", minExtend, "minFrequency", minFrequency, "sampleRate", sampleRate);
}
val Vibrato::compute(std::vector<float>& input_pitch) {
	_vibrato->input("pitch").set(input_pitch);
	std::vector<float> output_vibratoFrequency;
	std::vector<float> output_vibratoExtend;
	_vibrato->output("vibratoFrequency").set(output_vibratoFrequency);
	_vibrato->output("vibratoExtend").set(output_vibratoExtend);
	_vibrato->compute();
	val outputVibrato(val::object());
	outputVibrato.set("vibratoFrequency", output_vibratoFrequency);
	outputVibrato.set("vibratoExtend", output_vibratoExtend);
	return outputVibrato;
}
void Vibrato::reset() {
_vibrato->reset();
}
// END Vibrato definitions

// START WarpedAutoCorrelation definitions
// check https://essentia.upf.edu/reference/std_WarpedAutoCorrelation.html
WarpedAutoCorrelation::WarpedAutoCorrelation(const int maxLag, const float sampleRate) {
	_warpedautocorrelation = AlgorithmFactory::create("WarpedAutoCorrelation", "maxLag", maxLag, "sampleRate", sampleRate);
}
WarpedAutoCorrelation::~WarpedAutoCorrelation() {
	if (_warpedautocorrelation) delete _warpedautocorrelation;
}
void WarpedAutoCorrelation::configure(const int maxLag, const float sampleRate) {
	_warpedautocorrelation->configure("maxLag", maxLag, "sampleRate", sampleRate);
}
val WarpedAutoCorrelation::compute(std::vector<float>& input_array) {
	_warpedautocorrelation->input("array").set(input_array);
	std::vector<float> output_warpedAutoCorrelation;
	_warpedautocorrelation->output("warpedAutoCorrelation").set(output_warpedAutoCorrelation);
	_warpedautocorrelation->compute();
	val outputWarpedAutoCorrelation(val::object());
	outputWarpedAutoCorrelation.set("warpedAutoCorrelation", output_warpedAutoCorrelation);
	return outputWarpedAutoCorrelation;
}
void WarpedAutoCorrelation::reset() {
_warpedautocorrelation->reset();
}
// END WarpedAutoCorrelation definitions

// START Welch definitions
// check https://essentia.upf.edu/reference/std_Welch.html
Welch::Welch(const int averagingFrames, const int fftSize, const int frameSize, const float sampleRate, const std::string& scaling, const std::string& windowType) {
	_welch = AlgorithmFactory::create("Welch", "averagingFrames", averagingFrames, "fftSize", fftSize, "frameSize", frameSize, "sampleRate", sampleRate, "scaling", scaling, "windowType", windowType);
}
Welch::~Welch() {
	if (_welch) delete _welch;
}
void Welch::configure(const int averagingFrames, const int fftSize, const int frameSize, const float sampleRate, const std::string& scaling, const std::string& windowType) {
	_welch->configure("averagingFrames", averagingFrames, "fftSize", fftSize, "frameSize", frameSize, "sampleRate", sampleRate, "scaling", scaling, "windowType", windowType);
}
val Welch::compute(std::vector<float>& input_frame) {
	_welch->input("frame").set(input_frame);
	std::vector<float> output_psd;
	_welch->output("psd").set(output_psd);
	_welch->compute();
	val outputWelch(val::object());
	outputWelch.set("psd", output_psd);
	return outputWelch;
}
void Welch::reset() {
_welch->reset();
}
// END Welch definitions

// START Windowing definitions
// check https://essentia.upf.edu/reference/std_Windowing.html
Windowing::Windowing(const int constantsDecimals, const bool normalized, const int size, const bool splitPadding, const bool symmetric, const std::string& type, const int zeroPadding, const bool zeroPhase) {
	_windowing = AlgorithmFactory::create("Windowing", "constantsDecimals", constantsDecimals, "normalized", normalized, "size", size, "splitPadding", splitPadding, "symmetric", symmetric, "type", type, "zeroPadding", zeroPadding, "zeroPhase", zeroPhase);
}
Windowing::~Windowing() {
	if (_windowing) delete _windowing;
}
void Windowing::configure(const int constantsDecimals, const bool normalized, const int size, const bool splitPadding, const bool symmetric, const std::string& type, const int zeroPadding, const bool zeroPhase) {
	_windowing->configure("constantsDecimals", constantsDecimals, "normalized", normalized, "size", size, "splitPadding", splitPadding, "symmetric", symmetric, "type", type, "zeroPadding", zeroPadding, "zeroPhase", zeroPhase);
}
val Windowing::compute(std::vector<float>& input_frame) {
	_windowing->input("frame").set(input_frame);
	std::vector<float> output_frame;
	_windowing->output("frame").set(output_frame);
	_windowing->compute();
	val outputWindowing(val::object());
	outputWindowing.set("frame", output_frame);
	return outputWindowing;
}
void Windowing::reset() {
_windowing->reset();
}
// END Windowing definitions

// START ZeroCrossingRate definitions
// check https://essentia.upf.edu/reference/std_ZeroCrossingRate.html
ZeroCrossingRate::ZeroCrossingRate(const float threshold) {
	_zerocrossingrate = AlgorithmFactory::create("ZeroCrossingRate", "threshold", threshold);
}
ZeroCrossingRate::~ZeroCrossingRate() {
	if (_zerocrossingrate) delete _zerocrossingrate;
}
void ZeroCrossingRate::configure(const float threshold) {
	_zerocrossingrate->configure("threshold", threshold);
}
val ZeroCrossingRate::compute(std::vector<float>& input_signal) {
	_zerocrossingrate->input("signal").set(input_signal);
	float output_zeroCrossingRate;
	_zerocrossingrate->output("zeroCrossingRate").set(output_zeroCrossingRate);
	_zerocrossingrate->compute();
	val outputZeroCrossingRate(val::object());
	outputZeroCrossingRate.set("zeroCrossingRate", output_zeroCrossingRate);
	return outputZeroCrossingRate;
}
void ZeroCrossingRate::reset() {
_zerocrossingrate->reset();
}
// END ZeroCrossingRate definitions
