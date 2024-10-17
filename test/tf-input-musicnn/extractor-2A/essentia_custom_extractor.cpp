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

val vectorToFloat32Array(std::vector<float> &vec) {
  val outMemoryView{emscripten::typed_memory_view(vec.size(), vec.data())};
  val float32Array = val::global("Float32Array").new_(vec.size());
  float32Array.call<void>("set", outMemoryView);
  
  return float32Array;
}

// compute method for your extractor
val FullSignalTFInputMusiCNN::compute(const val& audioData, const int frameSize, const int hopSize) {

  std::vector<float> audioSignal = float32ArrayToVector(audioData);

  essentia::init();
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
      
  Algorithm* frameCut = factory.create("FrameCutter",
                            "frameSize", frameSize,
                            "hopSize", hopSize,
                            "startFromZero", true);

  std::vector<Real> frame, bands;

  frameCut->input("signal").set(audioSignal);
  frameCut->output("frame").set(frame);

  val bandsOut = val::array();

  while (true) {
    // compute a frame
    frameCut->compute();
    // if it was the last one (ie: it was empty), then we're done.
    if (!frame.size()) {
      break;
    }
    // if the frame is silent, just drop it and go on processing
    if (isSilent(frame)) continue;

    Algorithm* tfInputMusiCNN = factory.create("TensorflowInputMusiCNN");

    tfInputMusiCNN->input("frame").set(frame);
    tfInputMusiCNN->output("bands").set(bands);

    tfInputMusiCNN->compute();

    bandsOut.call<void>("push", vectorToFloat32Array(bands));
    delete tfInputMusiCNN;
  }

  delete frameCut;

  return bandsOut;
};


// method for deleting the algorithms used in the extractor after it's use
void FullSignalTFInputMusiCNN::shutdown() {
  essentia::shutdown();
};

