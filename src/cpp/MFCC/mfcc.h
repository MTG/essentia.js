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

#ifndef __MFCC_H__   
#define __MFCC_H__ 

#include <vector>
#include <essentia/algorithmfactory.h>
#include <essentia/essentiamath.h>
#include <emscripten/bind.h>

using namespace essentia;
using namespace essentia::standard;
using namespace emscripten;

void bootEssentia();

class MFCC {

  public:
    std::string essentiaVersion = essentia::version;

    MFCC();

    // MFCC(const int dctType=2, const float highFrequencyBound=11000, const int inputSize=1025, const int liftering=0, const std::string& logType="dbamp", const float lowFrequencyBound=0, const std::string& normalize="unit_sum", const int numberBands=40, const int numberCoefficients=13, const float sampleRate=44100, const float silenceThreshold=1e-10, const std::string& type="power", const std::string& warpingFormula="htkMel", const std::string& weighting="warping");

    ~MFCC();

    void configure(const int dctType=2, const float highFrequencyBound=11000, const int inputSize=1025, const int liftering=0, const std::string& logType="dbamp", const float lowFrequencyBound=0, const std::string& normalize="unit_sum", const int numberBands=40, const int numberCoefficients=13, const float sampleRate=44100, const float silenceThreshold=1e-10, const std::string& type="power", const std::string& warpingFormula="htkMel", const std::string& weighting="warping");

    val compute(std::vector<float>& input_spectrum);

    void reset();

    void shutdown();

  private:
    Algorithm* _mfcc;

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

class Spectrum {
  public:
    Spectrum(const int size);
    ~Spectrum();
    void configure(const int size);
    val compute(std::vector<float>& input_frame);
    void reset();
    void shutdown();
  
  private:
    Algorithm* _spectrum;
};

// convert a Float32 JS typed array into std::vector<float>
std::vector<float> float32ArrayToVector(const val &arr);

#endif // __EXTRACTOR_EXAMPLE_H__