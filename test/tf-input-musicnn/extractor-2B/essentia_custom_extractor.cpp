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
#include <essentia/pool.h>


void initEssentia() {
  essentia::init();
}

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

ObjectOrientedTFInputMusiCNN::ObjectOrientedTFInputMusiCNN() {
  configure();
}

void ObjectOrientedTFInputMusiCNN::configure() {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  _tfInputMusiCNN = factory.create("TensorflowInputMusiCNN");

}

// compute method for your extractor
std::vector<float> ObjectOrientedTFInputMusiCNN::compute(std::vector<float> &frame) {

  std::vector<Real> bands;

  _tfInputMusiCNN->input("frame").set(frame);
  _tfInputMusiCNN->output("bands").set(bands);

  _tfInputMusiCNN->compute();

  return bands;
};

void ObjectOrientedTFInputMusiCNN::reset() {
  _tfInputMusiCNN->reset();
}

// method for deleting the algorithms used in the extractor after it's use
void ObjectOrientedTFInputMusiCNN::shutdown() {
  delete _tfInputMusiCNN;
  essentia::shutdown();
};


// Method for frameCutting the given audio signal
std::vector<std::vector<float>> FrameGenerator(const val& signalArray, int frameSize, int hopSize) {
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

