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

#include "essentia_custom_extractor.h"


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
LogMelSpectrogramExtractor::LogMelSpectrogramExtractor(const int frameSize, const int hopSize, const int numBands, const std::string& windowType) {
  configure(frameSize, hopSize, numBands, windowType);
};


// method to configure algorithm settings used in your extractor
void LogMelSpectrogramExtractor::configure(const int frameSize, const int hopSize, const int numBands, const std::string& windowType) {

  essentia::init();
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();

  // we want to compute the MFCC of a input signal: we need the create the following algorithm chain:
  // audioSignal -> framecutter -> windowing -> FFT -> MFCC
      
  _frameCut = factory.create("FrameCutter",
                            "frameSize", frameSize,
                            "hopSize", hopSize,
                            "startFromZero", true);

  _window = factory.create("Windowing",
                          "type", windowType,
                          "zeroPadding", frameSize);

  _spect = factory.create("Spectrum",
                        "size", frameSize);

  _melBand = factory.create("MelBands",
                          "numberBands", numBands,
                          "type", "magnitude");

  _logNorm = factory.create("UnaryOperator",
                          "type", "log");

};


// compute method for your extractor
std::vector<float> LogMelSpectrogramExtractor::compute(const val& audioData) {

  // convert JS Float32 typed array into std::vector<float>
  // eg. getChannelData output from the Web Audio API AudioContext instance
  std::vector<float> audioSignal = float32ArrayToVector(audioData);

  // audioSignal -> framecutter -> windowing -> FFT -> MFCC

  _frameCut->input("signal").set(audioSignal);
  // FrameCutter -> Windowing -> Spectrum
  std::vector<Real> frame, windowedFrame;
  _frameCut->output("frame").set(frame);
  _window->input("frame").set(frame);
  _window->output("frame").set(windowedFrame);
  _spect->input("frame").set(windowedFrame);
  // Spectrum -> MFCC
  std::vector<Real> spectrum, mfccBands, melBandsOut;
  _spect->output("spectrum").set(spectrum);
  _melBand->input("spectrum").set(spectrum);
  _melBand->output("bands").set(mfccBands);
  _logNorm->input("array").set(mfccBands);
  _logNorm->output("array").set(melBandsOut);
  while (true) {
    // compute a frame
    _frameCut->compute();
    // if it was the last one (ie: it was empty), then we're done.
    if (!frame.size()) {
      break;
    }
    // if the frame is silent, just drop it and go on processing
    if (isSilent(frame)) continue;
    _window->compute();
    _spect->compute();
     _melBand->compute();
    _logNorm->compute();
  }
  return melBandsOut;
};


// method for resetting the internal states used in your extractor
void LogMelSpectrogramExtractor::reset() {
  _frameCut->reset();
  _window->reset();
  _spect->reset();
  _melBand->reset();
  _logNorm->reset();
};


// method for deleting the algorithms used in the extractor after it's use
void LogMelSpectrogramExtractor::shutdown() {
  delete _frameCut;
  delete _window;
  delete _spect;
  delete _melBand;
  delete _logNorm;
  essentia::shutdown();
};

