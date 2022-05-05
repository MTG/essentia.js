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

#include "spectralProfile.h"


// Util function to convert a Float32 JS typed array into std::vector<float>
// https://github.com/emscripten-core/emscripten/issues/5519#issuecomment-624775352
std::vector<float> float32ArrayToVector(const val& v) {
  std::vector<float> rv;
  const auto l = v["length"].as<unsigned>();
  rv.resize(l);
  emscripten::val memoryView{emscripten::typed_memory_view(l, rv.data())};
  memoryView.call<void>("set", v);
  return rv;
}

// class constructor to call the configure method
SpectralProfile::SpectralProfile(const int frameSize, const int hopSize, const std::string& averageType) {
  configure(frameSize, hopSize, averageType);
};


// method to configure algorithm settings used in your extractor
void SpectralProfile::configure(const int frameSize, const int hopSize, const std::string& averageType) {

  if (averageType != "median" && averageType != "mean") {
    E_ERROR("Wrong averageType provided, please use one of the valid options ['mean', 'median']");
  }

  essentia::init();
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

  _fc = factory.create("FrameCutter", "frameSize", frameSize,
                        "hopSize", hopSize, "startFromZero", true);
  _windowing = factory.create("Windowing");
  _spectrum = factory.create("Spectrum", "size", frameSize);

  _aggregatorStats = {averageType.c_str()};
  _averaging = factory.create("PoolAggregator", 
                              "defaultStats", arrayToVector<std::string>(_aggregatorStats));
};


// compute method for your extractor
val SpectralProfile::compute(std::vector<float>& audioSignal) {

  _fc->input("signal").set(audioSignal);
  // FrameCutter -> Windowing -> Spectrum
  std::vector<Real> frame, windowedFrame;
  _fc->output("frame").set(frame);
  _windowing->input("frame").set(frame);
  _windowing->output("frame").set(windowedFrame);
  _spectrum->input("frame").set(windowedFrame);
  // Spectrum -> Reshape Frames<bin> into Bins<frame> -> Average
  std::vector<Real> spectrum;
  _spectrum->output("spectrum").set(spectrum);
  
  Pool spectralFramesPool, averageSpectrumPool;

  while (true) {
    // compute a frame
    _fc->compute();
    // if it was the last one (ie: it was empty), then we're done.
    if (!frame.size()) {
      break;
    }
    // if the frame is silent, just drop it and go on processing
    if (isSilent(frame)) continue;
    _windowing->compute();
    _spectrum->compute();
    spectralFramesPool.add("frames", spectrum);
  }

  _averaging->input("input").set(spectralFramesPool);
  _averaging->output("output").set(averageSpectrumPool);
  _averaging->compute();

  // std::vector<std::string>> averageDescriptorNames = averageSpectrumPool.descriptorNames();
  return averageSpectrumPool.value<std::vector<float>>();
};


// method for resetting the internal states used in your extractor
void SpectralProfile::reset() {
  _fc->reset();
  _windowing->reset();
  _spectrum->reset();
  _averaging->reset();
};


// method for deleting the algorithms used in the extractor after it's use
void SpectralProfile::shutdown() {
  delete _fc;
  delete _windowing;
  delete _spectrum;
  delete _averaging;
  essentia::shutdown();
};

