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

#ifndef __SNR_H__   
#define __SNR_H__ 

#include <vector>
#include <essentia/algorithmfactory.h>
#include <essentia/essentiamath.h>
#include <emscripten/bind.h>

using namespace essentia;
using namespace essentia::standard;
using namespace emscripten;

void bootEssentia();

class SNR {

  public:
    std::string essentiaVersion = essentia::version;

    SNR(const float MAAlpha=0.95, const float MMSEAlpha=0.98, const float NoiseAlpha=0.9, const int frameSize=512, const float noiseThreshold=-40, const float sampleRate=44100, const bool useBroadbadNoiseCorrection=true);

    // SNR(const float MAAlpha=0.95, const float MMSEAlpha=0.98, const float NoiseAlpha=0.9, const int frameSize=512, const float noiseThreshold=-40, const float sampleRate=44100, const bool useBroadbadNoiseCorrection=true);

    ~SNR();

    void configure(const float MAAlpha=0.95, const float MMSEAlpha=0.98, const float NoiseAlpha=0.9, const int frameSize=512, const float noiseThreshold=-40, const float sampleRate=44100, const bool useBroadbadNoiseCorrection=true);

    val compute(std::vector<float>& input_frame);

    void reset();

    void shutdown();

  private:
    Algorithm* _snr;

};

class FrameGenerator {
  public:
    FrameGenerator(int frameSize, int hopSize);
    ~FrameGenerator();
    void configure(int frameSize, int hopSize);
    std::vector< std::vector<float> > compute(const val& signalArray);
    void reset();
    void shutdown();

  private:
    Algorithm* _framecutter;
};

// convert a Float32 JS typed array into std::vector<float>
std::vector<float> float32ArrayToVector(const val &arr);

#endif // __EXTRACTOR_EXAMPLE_H__