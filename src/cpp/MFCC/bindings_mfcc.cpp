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

#include <emscripten/bind.h>
#include "mfcc.h"

// expose the extractor class to js using embind templates
EMSCRIPTEN_BINDINGS(Class_Extractor) {
  function("bootEssentia", &bootEssentia);
  class_<MFCC>("MFCC")
    .constructor<>()
    // .constructor<int, float, int, int, std::string, float, std::string, int, int, float, float, std::string, std::string, std::string>()
    .property("version", &MFCC::essentiaVersion)
    .function("configure", &MFCC::configure)
    .function("compute", &MFCC::compute)
    .function("reset", &MFCC::reset)
    .function("shutdown", &MFCC::shutdown)
    ;
  class_<Spectrum>("Spectrum")
    .constructor<int>()
    .function("configure", &Spectrum::configure)
    .function("compute", &Spectrum::compute)
    .function("reset", &Spectrum::reset)
    .function("shutdown", &Spectrum::shutdown)
    ;
  class_<FrameGenerator>("FrameGenerator")
    .constructor<int, int>()
    .function("configure", &FrameGenerator::configure)
    .function("compute", &FrameGenerator::compute)
    .function("reset", &FrameGenerator::reset)
    .function("shutdown", &FrameGenerator::shutdown)
    ;
  function("arrayToVector", &float32ArrayToVector);
  register_vector<float>("VectorFloat");
  register_vector<std::vector<float>>("VectorVectorFloat");
};
