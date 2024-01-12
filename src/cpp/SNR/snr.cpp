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
#include "snr.h"

void bootEssentia() {
  essentia::init();
}

// SNR definitions
// class constructor to call the configure method
SNR::SNR(const float MAAlpha, const float MMSEAlpha, const float NoiseAlpha, const int frameSize, const float noiseThreshold, const float sampleRate, const bool useBroadbadNoiseCorrection) {
  configure(MAAlpha, MMSEAlpha, NoiseAlpha, frameSize, noiseThreshold, sampleRate, useBroadbadNoiseCorrection);
}

// SNR::SNR(const int dctType, const float highFrequencyBound, const int inputSize, const int liftering, const std::string& logType, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const int numberCoefficients, const float sampleRate, const float silenceThreshold, const std::string& type, const std::string& warpingFormula, const std::string& weighting) {
//   configure(dctType, highFrequencyBound, inputSize, liftering, logType, lowFrequencyBound, normalize, numberBands, numberCoefficients, sampleRate, silenceThreshold, type, warpingFormula, weighting);
// };

SNR::~SNR() {
  shutdown();
}


// method to configure algorithm settings used in your extractor
void SNR::configure(const float MAAlpha, const float MMSEAlpha, const float NoiseAlpha, const int frameSize, const float noiseThreshold, const float sampleRate, const bool useBroadbadNoiseCorrection) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  _snr = factory.create("SNR", "MAAlpha", MAAlpha, "MMSEAlpha", MMSEAlpha, "NoiseAlpha", NoiseAlpha, "frameSize", frameSize, "noiseThreshold", noiseThreshold, "sampleRate", sampleRate, "useBroadbadNoiseCorrection", useBroadbadNoiseCorrection);
};


// compute method for your extractor
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
};


// method for resetting the internal states used in your extractor
void SNR::reset() {
  _snr->reset();
};


// method for deleting the algorithms used in the extractor after it's use
void SNR::shutdown() {
  delete _snr;
  essentia::shutdown();
}; // SNR definitions end



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
