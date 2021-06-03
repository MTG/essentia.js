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

#include "polarFFT.h"


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
PolarFFT::PolarFFT(const int frameSize) {
  configure(frameSize);
};


// method to configure algorithm settings used in your extractor
void PolarFFT::configure(const int frameSize) {

  essentia::init();
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
      
  _fft = factory.create("FFT",
                            "size", frameSize);

  _c2p = factory.create("CartesianToPolar");

};


// compute method for your extractor
val PolarFFT::compute(std::vector<float>& frame) {

  // convert JS Float32 typed array into std::vector<float>
  // eg. getChannelData output from the Web Audio API AudioContext instance

  std::vector<std::complex<Real>> fftOut;
  _fft->input("frame").set(frame);
  _fft->output("fft").set(fftOut);

  std::vector<float> magnitude, phase;
  _c2p->input("complex").set(fftOut);
  _c2p->output("magnitude").set(magnitude);
  _c2p->output("phase").set(phase);

  _fft->compute();
  _c2p->compute();

  val outputPolarFFT(val::object());
  outputPolarFFT.set("magnitude", magnitude);
  outputPolarFFT.set("phase", phase);

  return outputPolarFFT;
};


// method for resetting the internal states used in your extractor
void PolarFFT::reset() {
  _fft->reset();
  _c2p->reset();
};


// method for deleting the algorithms used in the extractor after it's use
void PolarFFT::shutdown() {
  delete _fft;
  delete _c2p;
  essentia::shutdown();
};

