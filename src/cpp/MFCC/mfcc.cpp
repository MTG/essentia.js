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

#include <essentia/pool.h>
#include "mfcc.h"

void bootEssentia() {
  essentia::init();
}

// MFCC definitions
// class constructor to call the configure method
MFCC::MFCC() {
  configure();
}

// MFCC::MFCC(const int dctType, const float highFrequencyBound, const int inputSize, const int liftering, const std::string& logType, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const int numberCoefficients, const float sampleRate, const float silenceThreshold, const std::string& type, const std::string& warpingFormula, const std::string& weighting) {
//   configure(dctType, highFrequencyBound, inputSize, liftering, logType, lowFrequencyBound, normalize, numberBands, numberCoefficients, sampleRate, silenceThreshold, type, warpingFormula, weighting);
// };

MFCC::~MFCC() {
  shutdown();
}


// method to configure algorithm settings used in your extractor
void MFCC::configure(const int dctType, const float highFrequencyBound, const int inputSize, const int liftering, const std::string& logType, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const int numberCoefficients, const float sampleRate, const float silenceThreshold, const std::string& type, const std::string& warpingFormula, const std::string& weighting) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  _mfcc = factory.create("MFCC", "dctType", dctType, "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "liftering", liftering, "logType", logType, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "numberCoefficients", numberCoefficients, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold, "type", type, "warpingFormula", warpingFormula, "weighting", weighting);
};


// compute method for your extractor
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
};


// method for resetting the internal states used in your extractor
void MFCC::reset() {
  _mfcc->reset();
};


// method for deleting the algorithms used in the extractor after it's use
void MFCC::shutdown() {
  delete _mfcc;
  essentia::shutdown();
}; // MFCC definitions end



// FrameGenerator definitions
FrameGenerator::FrameGenerator(int frameSize, int hopSize) {
  configure(frameSize, hopSize);
}

FrameGenerator::~FrameGenerator() {
  shutdown();
}

void FrameGenerator::configure(int frameSize, int hopSize) {
    // create algorithm instances
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  _framecutter = factory.create("FrameCutter",
                  "frameSize", frameSize,
                  "hopSize", hopSize);
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

void FrameGenerator::shutdown() {
  delete _framecutter;
  essentia::shutdown();
} // FrameGenerator definitions end



// Spectrum definitions
Spectrum::Spectrum(const int size) {
  configure(size);
}

Spectrum::~Spectrum() {
  shutdown();
}

void Spectrum::configure(const int size) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  _spectrum = factory.create("Spectrum", "size", size);
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

void Spectrum::shutdown() {
  delete _spectrum;
  essentia::shutdown();
}


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
