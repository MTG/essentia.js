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

#include "onsets.h"


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


TNT::Array2D<Real> float32ArrayToMatrix(const val& v) {
  const int nRows = v["length"].as<int>();
  const int nCols = v[0]["length"].as<int>(); // get cols from 1st float32Array length

  TNT::Array2D<Real> rm { TNT::Array2D<Real>(nRows, nCols) };

  for (int i = 0; i < nRows; ++i) {
    for (int j = 0; j < nCols; ++j) {
      rm[i][j] = v[i][j].as<Real>();
    }
  }

  return rm;
}


// class constructor to call the configure method
Onsets::Onsets(const float alpha, const int delay, const float frameRate, const float silenceThreshold) {
  configure(alpha, delay, frameRate, silenceThreshold);
};


// method to configure algorithm settings used in your extractor
void Onsets::configure(const float alpha, const int delay, const float frameRate, const float silenceThreshold) {

  essentia::init();
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
      
  _onsets = factory.create("Onsets",
                            "alpha", alpha,
                            "delay", delay,
                            "frameRate", frameRate,
                            "silenceThreshold", silenceThreshold);

};


// compute method for your extractor
val Onsets::compute(const val& detections, const val& odfWeights) {

  TNT::Array2D<Real> odfMatrix = float32ArrayToMatrix(detections);
  // convert JS Float32 typed array into std::vector<float>
  std::vector<float> weights = float32ArrayToVector(odfWeights);

  std::vector<float> onsetsOut;
  _onsets->input("detections").set(odfMatrix);
  _onsets->input("weights").set(weights);
  _onsets->output("onsets").set(onsetsOut);

  _onsets->compute();

  val outputOnsets(val::object());
  outputOnsets.set("positions", onsetsOut);
  return outputOnsets;
};


// method for resetting the internal states used in your extractor
void Onsets::reset() {
  _onsets->reset();
};


// method for deleting the algorithms used in the extractor after it's use
void Onsets::shutdown() {
  delete _onsets;
  essentia::shutdown();
};

