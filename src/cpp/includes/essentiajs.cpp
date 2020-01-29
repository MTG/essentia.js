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

// NOTE: This source code is auto-generated.

#include <stdio.h>
#include <essentia/algorithmfactory.h>
#include <essentia/essentiamath.h>
#include <essentia/pool.h>
#include "essentiajs.h"

using namespace essentia;
using namespace essentia::standard;


// instantiating the essentia algo registry with an optional argument to enable debug mode 
EssentiaJS::EssentiaJS(bool debugger) {
  if (debugger) {
    // if true sets essentia debugger active
    // EAll is a special value in essentia that contains all modules
    setDebugLevel(EAll); 
    unsetDebugLevel(EMemory | EConnectors);
    // activate warnings
    essentia::warningLevelActive = true; 
    // activate info
    essentia::infoLevelActive = true;
    // activate error level    
    essentia::errorLevelActive = true;    
  }
  essentia::init();
  essentiaVersion = essentia::version;
}

// shutdown essentia instance
EssentiaJS::~EssentiaJS() {
  essentia::shutdown();
}

// Method for frameCutting the given audio signal
std::vector<std::vector<float> > EssentiaJS::frameGenerator(std::vector<float>& signal, int frameSize, int hopSize) {
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

// NOTE: The following code snippets are machine generated. Do not edit.
 
// check https://essentia.upf.edu/reference/std_AfterMaxToBeforeMaxEnergyRatio.html
float EssentiaJS::AfterMaxToBeforeMaxEnergyRatio(std::vector<float>& input_pitch) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoAfterMaxToBeforeMaxEnergyRatio = factory.create("AfterMaxToBeforeMaxEnergyRatio");
  algoAfterMaxToBeforeMaxEnergyRatio->input("pitch").set(input_pitch);
  float output_afterMaxToBeforeMaxEnergyRatio;
  algoAfterMaxToBeforeMaxEnergyRatio->output("afterMaxToBeforeMaxEnergyRatio").set(output_afterMaxToBeforeMaxEnergyRatio);
  algoAfterMaxToBeforeMaxEnergyRatio->compute();
  delete algoAfterMaxToBeforeMaxEnergyRatio;
  return output_afterMaxToBeforeMaxEnergyRatio;
}
 
// check https://essentia.upf.edu/reference/std_AllPass.html
std::vector<float> EssentiaJS::AllPass(std::vector<float>& input_signal, const float bandwidth, const float cutoffFrequency, const int order, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoAllPass = factory.create("AllPass", "bandwidth", bandwidth, "cutoffFrequency", cutoffFrequency, "order", order, "sampleRate", sampleRate);
  algoAllPass->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoAllPass->output("signal").set(output_signal);
  algoAllPass->compute();
  delete algoAllPass;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_AudioOnsetsMarker.html
std::vector<float> EssentiaJS::AudioOnsetsMarker(std::vector<float>& input_signal, const std::vector<float>& onsets, const float sampleRate, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoAudioOnsetsMarker = factory.create("AudioOnsetsMarker", "onsets", onsets, "sampleRate", sampleRate, "type", type);
  algoAudioOnsetsMarker->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoAudioOnsetsMarker->output("signal").set(output_signal);
  algoAudioOnsetsMarker->compute();
  delete algoAudioOnsetsMarker;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_AutoCorrelation.html
std::vector<float> EssentiaJS::AutoCorrelation(std::vector<float>& input_array, const float frequencyDomainCompression, const bool generalized, const std::string& normalization) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoAutoCorrelation = factory.create("AutoCorrelation", "frequencyDomainCompression", frequencyDomainCompression, "generalized", generalized, "normalization", normalization);
  algoAutoCorrelation->input("array").set(input_array);
  std::vector<float> output_autoCorrelation;
  algoAutoCorrelation->output("autoCorrelation").set(output_autoCorrelation);
  algoAutoCorrelation->compute();
  delete algoAutoCorrelation;
  return output_autoCorrelation;
}
 
// check https://essentia.upf.edu/reference/std_BFCC.html
void EssentiaJS::BFCC(std::vector<float>& input_spectrum, std::vector<float>& output_bands, std::vector<float>& output_bfcc, const int dctType, const float highFrequencyBound, const int inputSize, const int liftering, const std::string& logType, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const int numberCoefficients, const float sampleRate, const std::string& type, const std::string& weighting) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBFCC = factory.create("BFCC", "dctType", dctType, "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "liftering", liftering, "logType", logType, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "numberCoefficients", numberCoefficients, "sampleRate", sampleRate, "type", type, "weighting", weighting);
  algoBFCC->input("spectrum").set(input_spectrum);
  algoBFCC->output("bands").set(output_bands);
  algoBFCC->output("bfcc").set(output_bfcc);
  algoBFCC->compute();
  delete algoBFCC;
}
 
// check https://essentia.upf.edu/reference/std_BPF.html
float EssentiaJS::BPF(float input_x, const std::vector<float>& xPoints, const std::vector<float>& yPoints) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBPF = factory.create("BPF", "xPoints", xPoints, "yPoints", yPoints);
  algoBPF->input("x").set(input_x);
  float output_y;
  algoBPF->output("y").set(output_y);
  algoBPF->compute();
  delete algoBPF;
  return output_y;
}
 
// check https://essentia.upf.edu/reference/std_BandPass.html
std::vector<float> EssentiaJS::BandPass(std::vector<float>& input_signal, const float bandwidth, const float cutoffFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBandPass = factory.create("BandPass", "bandwidth", bandwidth, "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
  algoBandPass->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoBandPass->output("signal").set(output_signal);
  algoBandPass->compute();
  delete algoBandPass;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_BandReject.html
std::vector<float> EssentiaJS::BandReject(std::vector<float>& input_signal, const float bandwidth, const float cutoffFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBandReject = factory.create("BandReject", "bandwidth", bandwidth, "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
  algoBandReject->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoBandReject->output("signal").set(output_signal);
  algoBandReject->compute();
  delete algoBandReject;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_BarkBands.html
std::vector<float> EssentiaJS::BarkBands(std::vector<float>& input_spectrum, const int numberBands, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBarkBands = factory.create("BarkBands", "numberBands", numberBands, "sampleRate", sampleRate);
  algoBarkBands->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  algoBarkBands->output("bands").set(output_bands);
  algoBarkBands->compute();
  delete algoBarkBands;
  return output_bands;
}
 
// check https://essentia.upf.edu/reference/std_BeatTrackerDegara.html
std::vector<float> EssentiaJS::BeatTrackerDegara(std::vector<float>& input_signal, const int maxTempo, const int minTempo) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBeatTrackerDegara = factory.create("BeatTrackerDegara", "maxTempo", maxTempo, "minTempo", minTempo);
  algoBeatTrackerDegara->input("signal").set(input_signal);
  std::vector<float> output_ticks;
  algoBeatTrackerDegara->output("ticks").set(output_ticks);
  algoBeatTrackerDegara->compute();
  delete algoBeatTrackerDegara;
  return output_ticks;
}
 
// check https://essentia.upf.edu/reference/std_BeatTrackerMultiFeature.html
void EssentiaJS::BeatTrackerMultiFeature(std::vector<float>& input_signal, std::vector<float>& output_ticks, float output_confidence, const int maxTempo, const int minTempo) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBeatTrackerMultiFeature = factory.create("BeatTrackerMultiFeature", "maxTempo", maxTempo, "minTempo", minTempo);
  algoBeatTrackerMultiFeature->input("signal").set(input_signal);
  algoBeatTrackerMultiFeature->output("ticks").set(output_ticks);
  algoBeatTrackerMultiFeature->output("confidence").set(output_confidence);
  algoBeatTrackerMultiFeature->compute();
  delete algoBeatTrackerMultiFeature;
}
 
// check https://essentia.upf.edu/reference/std_Beatogram.html
std::vector<std::vector<float> > EssentiaJS::Beatogram(std::vector<float>& input_loudness, std::vector<std::vector<float> >& input_loudnessBandRatio, const int size) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBeatogram = factory.create("Beatogram", "size", size);
  algoBeatogram->input("loudness").set(input_loudness);
  algoBeatogram->input("loudnessBandRatio").set(input_loudnessBandRatio);
  std::vector<std::vector<float> > output_beatogram;
  algoBeatogram->output("beatogram").set(output_beatogram);
  algoBeatogram->compute();
  delete algoBeatogram;
  return output_beatogram;
}
 
// check https://essentia.upf.edu/reference/std_BeatsLoudness.html
void EssentiaJS::BeatsLoudness(std::vector<float>& input_signal, std::vector<float>& output_loudness, std::vector<std::vector<float> >& output_loudnessBandRatio, const float beatDuration, const float beatWindowDuration, const std::vector<float>& beats, const std::vector<float>& frequencyBands, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBeatsLoudness = factory.create("BeatsLoudness", "beatDuration", beatDuration, "beatWindowDuration", beatWindowDuration, "beats", beats, "frequencyBands", frequencyBands, "sampleRate", sampleRate);
  algoBeatsLoudness->input("signal").set(input_signal);
  algoBeatsLoudness->output("loudness").set(output_loudness);
  algoBeatsLoudness->output("loudnessBandRatio").set(output_loudnessBandRatio);
  algoBeatsLoudness->compute();
  delete algoBeatsLoudness;
}
 
// check https://essentia.upf.edu/reference/std_BinaryOperator.html
std::vector<float> EssentiaJS::BinaryOperator(std::vector<float>& input_array1, std::vector<float>& input_array2, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBinaryOperator = factory.create("BinaryOperator", "type", type);
  algoBinaryOperator->input("array1").set(input_array1);
  algoBinaryOperator->input("array2").set(input_array2);
  std::vector<float> output_array;
  algoBinaryOperator->output("array").set(output_array);
  algoBinaryOperator->compute();
  delete algoBinaryOperator;
  return output_array;
}
 
// check https://essentia.upf.edu/reference/std_BinaryOperatorStream.html
std::vector<float> EssentiaJS::BinaryOperatorStream(std::vector<float>& input_array1, std::vector<float>& input_array2, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBinaryOperatorStream = factory.create("BinaryOperatorStream", "type", type);
  algoBinaryOperatorStream->input("array1").set(input_array1);
  algoBinaryOperatorStream->input("array2").set(input_array2);
  std::vector<float> output_array;
  algoBinaryOperatorStream->output("array").set(output_array);
  algoBinaryOperatorStream->compute();
  delete algoBinaryOperatorStream;
  return output_array;
}
 
// check https://essentia.upf.edu/reference/std_BpmHistogram.html
void EssentiaJS::BpmHistogram(std::vector<float>& input_novelty, float output_bpm, std::vector<float>& output_bpmCandidates, std::vector<float>& output_bpmMagnitudes, std::vector<float>& output_tempogram, std::vector<float>& output_frameBpms, std::vector<float>& output_ticks, std::vector<float>& output_ticksMagnitude, std::vector<float>& output_sinusoid, const float bpm, const bool constantTempo, const float frameRate, const float frameSize, const float maxBpm, const int maxPeaks, const float minBpm, const int overlap, const float tempoChange, const bool weightByMagnitude, const std::string& windowType, const int zeroPadding) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBpmHistogram = factory.create("BpmHistogram", "bpm", bpm, "constantTempo", constantTempo, "frameRate", frameRate, "frameSize", frameSize, "maxBpm", maxBpm, "maxPeaks", maxPeaks, "minBpm", minBpm, "overlap", overlap, "tempoChange", tempoChange, "weightByMagnitude", weightByMagnitude, "windowType", windowType, "zeroPadding", zeroPadding);
  algoBpmHistogram->input("novelty").set(input_novelty);
  algoBpmHistogram->output("bpm").set(output_bpm);
  algoBpmHistogram->output("bpmCandidates").set(output_bpmCandidates);
  algoBpmHistogram->output("bpmMagnitudes").set(output_bpmMagnitudes);
  algoBpmHistogram->output("tempogram").set(output_tempogram);
  algoBpmHistogram->output("frameBpms").set(output_frameBpms);
  algoBpmHistogram->output("ticks").set(output_ticks);
  algoBpmHistogram->output("ticksMagnitude").set(output_ticksMagnitude);
  algoBpmHistogram->output("sinusoid").set(output_sinusoid);
  algoBpmHistogram->compute();
  delete algoBpmHistogram;
}
 
// check https://essentia.upf.edu/reference/std_BpmHistogramDescriptors.html
void EssentiaJS::BpmHistogramDescriptors(std::vector<float>& input_bpmIntervals, float output_firstPeakBPM, float output_firstPeakWeight, float output_firstPeakSpread, float output_secondPeakBPM, float output_secondPeakWeight, float output_secondPeakSpread, std::vector<float>& output_histogram) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBpmHistogramDescriptors = factory.create("BpmHistogramDescriptors");
  algoBpmHistogramDescriptors->input("bpmIntervals").set(input_bpmIntervals);
  algoBpmHistogramDescriptors->output("firstPeakBPM").set(output_firstPeakBPM);
  algoBpmHistogramDescriptors->output("firstPeakWeight").set(output_firstPeakWeight);
  algoBpmHistogramDescriptors->output("firstPeakSpread").set(output_firstPeakSpread);
  algoBpmHistogramDescriptors->output("secondPeakBPM").set(output_secondPeakBPM);
  algoBpmHistogramDescriptors->output("secondPeakWeight").set(output_secondPeakWeight);
  algoBpmHistogramDescriptors->output("secondPeakSpread").set(output_secondPeakSpread);
  algoBpmHistogramDescriptors->output("histogram").set(output_histogram);
  algoBpmHistogramDescriptors->compute();
  delete algoBpmHistogramDescriptors;
}
 
// check https://essentia.upf.edu/reference/std_BpmRubato.html
void EssentiaJS::BpmRubato(std::vector<float>& input_beats, std::vector<float>& output_rubatoStart, std::vector<float>& output_rubatoStop, int output_rubatoNumber, const float longRegionsPruningTime, const float shortRegionsMergingTime, const float tolerance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoBpmRubato = factory.create("BpmRubato", "longRegionsPruningTime", longRegionsPruningTime, "shortRegionsMergingTime", shortRegionsMergingTime, "tolerance", tolerance);
  algoBpmRubato->input("beats").set(input_beats);
  algoBpmRubato->output("rubatoStart").set(output_rubatoStart);
  algoBpmRubato->output("rubatoStop").set(output_rubatoStop);
  algoBpmRubato->output("rubatoNumber").set(output_rubatoNumber);
  algoBpmRubato->compute();
  delete algoBpmRubato;
}
 
// check https://essentia.upf.edu/reference/std_CartesianToPolar.html
void EssentiaJS::CartesianToPolar(std::vector<float>& input_complex, std::vector<float>& output_magnitude, std::vector<float>& output_phase) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoCartesianToPolar = factory.create("CartesianToPolar");
  algoCartesianToPolar->input("complex").set(input_complex);
  algoCartesianToPolar->output("magnitude").set(output_magnitude);
  algoCartesianToPolar->output("phase").set(output_phase);
  algoCartesianToPolar->compute();
  delete algoCartesianToPolar;
}
 
// check https://essentia.upf.edu/reference/std_CentralMoments.html
std::vector<float> EssentiaJS::CentralMoments(std::vector<float>& input_array, const std::string& mode, const float range) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoCentralMoments = factory.create("CentralMoments", "mode", mode, "range", range);
  algoCentralMoments->input("array").set(input_array);
  std::vector<float> output_centralMoments;
  algoCentralMoments->output("centralMoments").set(output_centralMoments);
  algoCentralMoments->compute();
  delete algoCentralMoments;
  return output_centralMoments;
}
 
// check https://essentia.upf.edu/reference/std_Centroid.html
float EssentiaJS::Centroid(std::vector<float>& input_array, const float range) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoCentroid = factory.create("Centroid", "range", range);
  algoCentroid->input("array").set(input_array);
  float output_centroid;
  algoCentroid->output("centroid").set(output_centroid);
  algoCentroid->compute();
  delete algoCentroid;
  return output_centroid;
}
 
// check https://essentia.upf.edu/reference/std_ChordsDescriptors.html
void EssentiaJS::ChordsDescriptors(std::vector<std::string> input_chords, std::string input_key, std::string input_scale, std::vector<float>& output_chordsHistogram, float output_chordsNumberRate, float output_chordsChangesRate, std::string output_chordsKey, std::string output_chordsScale) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoChordsDescriptors = factory.create("ChordsDescriptors");
  algoChordsDescriptors->input("chords").set(input_chords);
  algoChordsDescriptors->input("key").set(input_key);
  algoChordsDescriptors->input("scale").set(input_scale);
  algoChordsDescriptors->output("chordsHistogram").set(output_chordsHistogram);
  algoChordsDescriptors->output("chordsNumberRate").set(output_chordsNumberRate);
  algoChordsDescriptors->output("chordsChangesRate").set(output_chordsChangesRate);
  algoChordsDescriptors->output("chordsKey").set(output_chordsKey);
  algoChordsDescriptors->output("chordsScale").set(output_chordsScale);
  algoChordsDescriptors->compute();
  delete algoChordsDescriptors;
}
 
// check https://essentia.upf.edu/reference/std_ChordsDetection.html
void EssentiaJS::ChordsDetection(std::vector<std::vector<float> >& input_pcp, std::vector<std::string> output_chords, std::vector<float>& output_strength, const int hopSize, const float sampleRate, const float windowSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoChordsDetection = factory.create("ChordsDetection", "hopSize", hopSize, "sampleRate", sampleRate, "windowSize", windowSize);
  algoChordsDetection->input("pcp").set(input_pcp);
  algoChordsDetection->output("chords").set(output_chords);
  algoChordsDetection->output("strength").set(output_strength);
  algoChordsDetection->compute();
  delete algoChordsDetection;
}
 
// check https://essentia.upf.edu/reference/std_ChordsDetectionBeats.html
void EssentiaJS::ChordsDetectionBeats(std::vector<std::vector<float> >& input_pcp, std::vector<float>& input_ticks, std::vector<std::string> output_chords, std::vector<float>& output_strength, const std::string& chromaPick, const int hopSize, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoChordsDetectionBeats = factory.create("ChordsDetectionBeats", "chromaPick", chromaPick, "hopSize", hopSize, "sampleRate", sampleRate);
  algoChordsDetectionBeats->input("pcp").set(input_pcp);
  algoChordsDetectionBeats->input("ticks").set(input_ticks);
  algoChordsDetectionBeats->output("chords").set(output_chords);
  algoChordsDetectionBeats->output("strength").set(output_strength);
  algoChordsDetectionBeats->compute();
  delete algoChordsDetectionBeats;
}
 
// check https://essentia.upf.edu/reference/std_ChromaCrossSimilarity.html
std::vector<std::vector<float> > EssentiaJS::ChromaCrossSimilarity(std::vector<std::vector<float> >& input_queryFeature, std::vector<std::vector<float> >& input_referenceFeature, const float binarizePercentile, const int frameStackSize, const int frameStackStride, const int noti, const bool oti, const bool otiBinary, const bool streaming) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoChromaCrossSimilarity = factory.create("ChromaCrossSimilarity", "binarizePercentile", binarizePercentile, "frameStackSize", frameStackSize, "frameStackStride", frameStackStride, "noti", noti, "oti", oti, "otiBinary", otiBinary, "streaming", streaming);
  algoChromaCrossSimilarity->input("queryFeature").set(input_queryFeature);
  algoChromaCrossSimilarity->input("referenceFeature").set(input_referenceFeature);
  std::vector<std::vector<float> > output_csm;
  algoChromaCrossSimilarity->output("csm").set(output_csm);
  algoChromaCrossSimilarity->compute();
  delete algoChromaCrossSimilarity;
  return output_csm;
}
 
// check https://essentia.upf.edu/reference/std_Chromagram.html
std::vector<float> EssentiaJS::Chromagram(std::vector<float>& input_frame, const int binsPerOctave, const float minFrequency, const int minimumKernelSize, const std::string& normalizeType, const int numberBins, const float sampleRate, const float scale, const float threshold, const std::string& windowType, const bool zeroPhase) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoChromagram = factory.create("Chromagram", "binsPerOctave", binsPerOctave, "minFrequency", minFrequency, "minimumKernelSize", minimumKernelSize, "normalizeType", normalizeType, "numberBins", numberBins, "sampleRate", sampleRate, "scale", scale, "threshold", threshold, "windowType", windowType, "zeroPhase", zeroPhase);
  algoChromagram->input("frame").set(input_frame);
  std::vector<float> output_chromagram;
  algoChromagram->output("chromagram").set(output_chromagram);
  algoChromagram->compute();
  delete algoChromagram;
  return output_chromagram;
}
 
// check https://essentia.upf.edu/reference/std_Chromaprinter.html
std::string EssentiaJS::Chromaprinter(std::vector<float>& input_signal, const float maxLength, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoChromaprinter = factory.create("Chromaprinter", "maxLength", maxLength, "sampleRate", sampleRate);
  algoChromaprinter->input("signal").set(input_signal);
  std::string output_fingerprint;
  algoChromaprinter->output("fingerprint").set(output_fingerprint);
  algoChromaprinter->compute();
  delete algoChromaprinter;
  return output_fingerprint;
}
 
// check https://essentia.upf.edu/reference/std_ClickDetector.html
void EssentiaJS::ClickDetector(std::vector<float>& input_frame, std::vector<float>& output_starts, std::vector<float>& output_ends, const float detectionThreshold, const int frameSize, const int hopSize, const int order, const int powerEstimationThreshold, const float sampleRate, const int silenceThreshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoClickDetector = factory.create("ClickDetector", "detectionThreshold", detectionThreshold, "frameSize", frameSize, "hopSize", hopSize, "order", order, "powerEstimationThreshold", powerEstimationThreshold, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold);
  algoClickDetector->input("frame").set(input_frame);
  algoClickDetector->output("starts").set(output_starts);
  algoClickDetector->output("ends").set(output_ends);
  algoClickDetector->compute();
  delete algoClickDetector;
}
 
// check https://essentia.upf.edu/reference/std_Clipper.html
std::vector<float> EssentiaJS::Clipper(std::vector<float>& input_signal, const float max, const float min) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoClipper = factory.create("Clipper", "max", max, "min", min);
  algoClipper->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoClipper->output("signal").set(output_signal);
  algoClipper->compute();
  delete algoClipper;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_ConstantQ.html
std::vector<float> EssentiaJS::ConstantQ(std::vector<float>& input_frame, const int binsPerOctave, const float minFrequency, const int minimumKernelSize, const int numberBins, const float sampleRate, const float scale, const float threshold, const std::string& windowType, const bool zeroPhase) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoConstantQ = factory.create("ConstantQ", "binsPerOctave", binsPerOctave, "minFrequency", minFrequency, "minimumKernelSize", minimumKernelSize, "numberBins", numberBins, "sampleRate", sampleRate, "scale", scale, "threshold", threshold, "windowType", windowType, "zeroPhase", zeroPhase);
  algoConstantQ->input("frame").set(input_frame);
  std::vector<float> output_constantq;
  algoConstantQ->output("constantq").set(output_constantq);
  algoConstantQ->compute();
  delete algoConstantQ;
  return output_constantq;
}
 
// check https://essentia.upf.edu/reference/std_CoverSongSimilarity.html
void EssentiaJS::CoverSongSimilarity(std::vector<std::vector<float> >& input_inputArray, std::vector<std::vector<float> >& output_scoreMatrix, float output_distance, const std::string& alignmentType, const float disExtension, const float disOnset, const std::string& distanceType) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoCoverSongSimilarity = factory.create("CoverSongSimilarity", "alignmentType", alignmentType, "disExtension", disExtension, "disOnset", disOnset, "distanceType", distanceType);
  algoCoverSongSimilarity->input("inputArray").set(input_inputArray);
  algoCoverSongSimilarity->output("scoreMatrix").set(output_scoreMatrix);
  algoCoverSongSimilarity->output("distance").set(output_distance);
  algoCoverSongSimilarity->compute();
  delete algoCoverSongSimilarity;
}
 
// check https://essentia.upf.edu/reference/std_Crest.html
float EssentiaJS::Crest(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoCrest = factory.create("Crest");
  algoCrest->input("array").set(input_array);
  float output_crest;
  algoCrest->output("crest").set(output_crest);
  algoCrest->compute();
  delete algoCrest;
  return output_crest;
}
 
// check https://essentia.upf.edu/reference/std_CrossCorrelation.html
std::vector<float> EssentiaJS::CrossCorrelation(std::vector<float>& input_arrayX, std::vector<float>& input_arrayY, const int maxLag, const int minLag) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoCrossCorrelation = factory.create("CrossCorrelation", "maxLag", maxLag, "minLag", minLag);
  algoCrossCorrelation->input("arrayX").set(input_arrayX);
  algoCrossCorrelation->input("arrayY").set(input_arrayY);
  std::vector<float> output_crossCorrelation;
  algoCrossCorrelation->output("crossCorrelation").set(output_crossCorrelation);
  algoCrossCorrelation->compute();
  delete algoCrossCorrelation;
  return output_crossCorrelation;
}
 
// check https://essentia.upf.edu/reference/std_CrossSimilarityMatrix.html
std::vector<std::vector<float> > EssentiaJS::CrossSimilarityMatrix(std::vector<std::vector<float> >& input_queryFeature, std::vector<std::vector<float> >& input_referenceFeature, const bool binarize, const float binarizePercentile, const int frameStackSize, const int frameStackStride) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoCrossSimilarityMatrix = factory.create("CrossSimilarityMatrix", "binarize", binarize, "binarizePercentile", binarizePercentile, "frameStackSize", frameStackSize, "frameStackStride", frameStackStride);
  algoCrossSimilarityMatrix->input("queryFeature").set(input_queryFeature);
  algoCrossSimilarityMatrix->input("referenceFeature").set(input_referenceFeature);
  std::vector<std::vector<float> > output_csm;
  algoCrossSimilarityMatrix->output("csm").set(output_csm);
  algoCrossSimilarityMatrix->compute();
  delete algoCrossSimilarityMatrix;
  return output_csm;
}
 
// check https://essentia.upf.edu/reference/std_CubicSpline.html
void EssentiaJS::CubicSpline(float input_x, float output_y, float output_dy, float output_ddy, const int leftBoundaryFlag, const float leftBoundaryValue, const int rightBoundaryFlag, const float rightBoundaryValue, const std::vector<float>& xPoints, const std::vector<float>& yPoints) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoCubicSpline = factory.create("CubicSpline", "leftBoundaryFlag", leftBoundaryFlag, "leftBoundaryValue", leftBoundaryValue, "rightBoundaryFlag", rightBoundaryFlag, "rightBoundaryValue", rightBoundaryValue, "xPoints", xPoints, "yPoints", yPoints);
  algoCubicSpline->input("x").set(input_x);
  algoCubicSpline->output("y").set(output_y);
  algoCubicSpline->output("dy").set(output_dy);
  algoCubicSpline->output("ddy").set(output_ddy);
  algoCubicSpline->compute();
  delete algoCubicSpline;
}
 
// check https://essentia.upf.edu/reference/std_DCRemoval.html
std::vector<float> EssentiaJS::DCRemoval(std::vector<float>& input_signal, const float cutoffFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDCRemoval = factory.create("DCRemoval", "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
  algoDCRemoval->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoDCRemoval->output("signal").set(output_signal);
  algoDCRemoval->compute();
  delete algoDCRemoval;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_DCT.html
std::vector<float> EssentiaJS::DCT(std::vector<float>& input_array, const int dctType, const int inputSize, const int liftering, const int outputSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDCT = factory.create("DCT", "dctType", dctType, "inputSize", inputSize, "liftering", liftering, "outputSize", outputSize);
  algoDCT->input("array").set(input_array);
  std::vector<float> output_dct;
  algoDCT->output("dct").set(output_dct);
  algoDCT->compute();
  delete algoDCT;
  return output_dct;
}
 
// check https://essentia.upf.edu/reference/std_Danceability.html
void EssentiaJS::Danceability(std::vector<float>& input_signal, float output_danceability, std::vector<float>& output_dfa, const float maxTau, const float minTau, const float sampleRate, const float tauMultiplier) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDanceability = factory.create("Danceability", "maxTau", maxTau, "minTau", minTau, "sampleRate", sampleRate, "tauMultiplier", tauMultiplier);
  algoDanceability->input("signal").set(input_signal);
  algoDanceability->output("danceability").set(output_danceability);
  algoDanceability->output("dfa").set(output_dfa);
  algoDanceability->compute();
  delete algoDanceability;
}
 
// check https://essentia.upf.edu/reference/std_Decrease.html
float EssentiaJS::Decrease(std::vector<float>& input_array, const float range) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDecrease = factory.create("Decrease", "range", range);
  algoDecrease->input("array").set(input_array);
  float output_decrease;
  algoDecrease->output("decrease").set(output_decrease);
  algoDecrease->compute();
  delete algoDecrease;
  return output_decrease;
}
 
// check https://essentia.upf.edu/reference/std_Derivative.html
std::vector<float> EssentiaJS::Derivative(std::vector<float>& input_signal) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDerivative = factory.create("Derivative");
  algoDerivative->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoDerivative->output("signal").set(output_signal);
  algoDerivative->compute();
  delete algoDerivative;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_DerivativeSFX.html
void EssentiaJS::DerivativeSFX(std::vector<float>& input_envelope, float output_derAvAfterMax, float output_maxDerBeforeMax) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDerivativeSFX = factory.create("DerivativeSFX");
  algoDerivativeSFX->input("envelope").set(input_envelope);
  algoDerivativeSFX->output("derAvAfterMax").set(output_derAvAfterMax);
  algoDerivativeSFX->output("maxDerBeforeMax").set(output_maxDerBeforeMax);
  algoDerivativeSFX->compute();
  delete algoDerivativeSFX;
}
 
// check https://essentia.upf.edu/reference/std_DiscontinuityDetector.html
void EssentiaJS::DiscontinuityDetector(std::vector<float>& input_frame, std::vector<float>& output_discontinuityLocations, std::vector<float>& output_discontinuityAmplitudes, const float detectionThreshold, const float energyThreshold, const int frameSize, const int hopSize, const int kernelSize, const int order, const int silenceThreshold, const int subFrameSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDiscontinuityDetector = factory.create("DiscontinuityDetector", "detectionThreshold", detectionThreshold, "energyThreshold", energyThreshold, "frameSize", frameSize, "hopSize", hopSize, "kernelSize", kernelSize, "order", order, "silenceThreshold", silenceThreshold, "subFrameSize", subFrameSize);
  algoDiscontinuityDetector->input("frame").set(input_frame);
  algoDiscontinuityDetector->output("discontinuityLocations").set(output_discontinuityLocations);
  algoDiscontinuityDetector->output("discontinuityAmplitudes").set(output_discontinuityAmplitudes);
  algoDiscontinuityDetector->compute();
  delete algoDiscontinuityDetector;
}
 
// check https://essentia.upf.edu/reference/std_Dissonance.html
float EssentiaJS::Dissonance(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDissonance = factory.create("Dissonance");
  algoDissonance->input("frequencies").set(input_frequencies);
  algoDissonance->input("magnitudes").set(input_magnitudes);
  float output_dissonance;
  algoDissonance->output("dissonance").set(output_dissonance);
  algoDissonance->compute();
  delete algoDissonance;
  return output_dissonance;
}
 
// check https://essentia.upf.edu/reference/std_DistributionShape.html
void EssentiaJS::DistributionShape(std::vector<float>& input_centralMoments, float output_spread, float output_skewness, float output_kurtosis) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDistributionShape = factory.create("DistributionShape");
  algoDistributionShape->input("centralMoments").set(input_centralMoments);
  algoDistributionShape->output("spread").set(output_spread);
  algoDistributionShape->output("skewness").set(output_skewness);
  algoDistributionShape->output("kurtosis").set(output_kurtosis);
  algoDistributionShape->compute();
  delete algoDistributionShape;
}
 
// check https://essentia.upf.edu/reference/std_Duration.html
float EssentiaJS::Duration(std::vector<float>& input_signal, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDuration = factory.create("Duration", "sampleRate", sampleRate);
  algoDuration->input("signal").set(input_signal);
  float output_duration;
  algoDuration->output("duration").set(output_duration);
  algoDuration->compute();
  delete algoDuration;
  return output_duration;
}
 
// check https://essentia.upf.edu/reference/std_DynamicComplexity.html
void EssentiaJS::DynamicComplexity(std::vector<float>& input_signal, float output_dynamicComplexity, float output_loudness, const float frameSize, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoDynamicComplexity = factory.create("DynamicComplexity", "frameSize", frameSize, "sampleRate", sampleRate);
  algoDynamicComplexity->input("signal").set(input_signal);
  algoDynamicComplexity->output("dynamicComplexity").set(output_dynamicComplexity);
  algoDynamicComplexity->output("loudness").set(output_loudness);
  algoDynamicComplexity->compute();
  delete algoDynamicComplexity;
}
 
// check https://essentia.upf.edu/reference/std_ERBBands.html
std::vector<float> EssentiaJS::ERBBands(std::vector<float>& input_spectrum, const float highFrequencyBound, const int inputSize, const float lowFrequencyBound, const int numberBands, const float sampleRate, const std::string& type, const float width) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoERBBands = factory.create("ERBBands", "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "lowFrequencyBound", lowFrequencyBound, "numberBands", numberBands, "sampleRate", sampleRate, "type", type, "width", width);
  algoERBBands->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  algoERBBands->output("bands").set(output_bands);
  algoERBBands->compute();
  delete algoERBBands;
  return output_bands;
}
 
// check https://essentia.upf.edu/reference/std_EffectiveDuration.html
float EssentiaJS::EffectiveDuration(std::vector<float>& input_signal, const float sampleRate, const float thresholdRatio) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoEffectiveDuration = factory.create("EffectiveDuration", "sampleRate", sampleRate, "thresholdRatio", thresholdRatio);
  algoEffectiveDuration->input("signal").set(input_signal);
  float output_effectiveDuration;
  algoEffectiveDuration->output("effectiveDuration").set(output_effectiveDuration);
  algoEffectiveDuration->compute();
  delete algoEffectiveDuration;
  return output_effectiveDuration;
}
 
// check https://essentia.upf.edu/reference/std_Energy.html
float EssentiaJS::Energy(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoEnergy = factory.create("Energy");
  algoEnergy->input("array").set(input_array);
  float output_energy;
  algoEnergy->output("energy").set(output_energy);
  algoEnergy->compute();
  delete algoEnergy;
  return output_energy;
}
 
// check https://essentia.upf.edu/reference/std_EnergyBand.html
float EssentiaJS::EnergyBand(std::vector<float>& input_spectrum, const float sampleRate, const float startCutoffFrequency, const float stopCutoffFrequency) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoEnergyBand = factory.create("EnergyBand", "sampleRate", sampleRate, "startCutoffFrequency", startCutoffFrequency, "stopCutoffFrequency", stopCutoffFrequency);
  algoEnergyBand->input("spectrum").set(input_spectrum);
  float output_energyBand;
  algoEnergyBand->output("energyBand").set(output_energyBand);
  algoEnergyBand->compute();
  delete algoEnergyBand;
  return output_energyBand;
}
 
// check https://essentia.upf.edu/reference/std_EnergyBandRatio.html
float EssentiaJS::EnergyBandRatio(std::vector<float>& input_spectrum, const float sampleRate, const float startFrequency, const float stopFrequency) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoEnergyBandRatio = factory.create("EnergyBandRatio", "sampleRate", sampleRate, "startFrequency", startFrequency, "stopFrequency", stopFrequency);
  algoEnergyBandRatio->input("spectrum").set(input_spectrum);
  float output_energyBandRatio;
  algoEnergyBandRatio->output("energyBandRatio").set(output_energyBandRatio);
  algoEnergyBandRatio->compute();
  delete algoEnergyBandRatio;
  return output_energyBandRatio;
}
 
// check https://essentia.upf.edu/reference/std_Entropy.html
float EssentiaJS::Entropy(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoEntropy = factory.create("Entropy");
  algoEntropy->input("array").set(input_array);
  float output_entropy;
  algoEntropy->output("entropy").set(output_entropy);
  algoEntropy->compute();
  delete algoEntropy;
  return output_entropy;
}
 
// check https://essentia.upf.edu/reference/std_Envelope.html
std::vector<float> EssentiaJS::Envelope(std::vector<float>& input_signal, const bool applyRectification, const float attackTime, const float releaseTime, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoEnvelope = factory.create("Envelope", "applyRectification", applyRectification, "attackTime", attackTime, "releaseTime", releaseTime, "sampleRate", sampleRate);
  algoEnvelope->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoEnvelope->output("signal").set(output_signal);
  algoEnvelope->compute();
  delete algoEnvelope;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_EqualLoudness.html
std::vector<float> EssentiaJS::EqualLoudness(std::vector<float>& input_signal, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoEqualLoudness = factory.create("EqualLoudness", "sampleRate", sampleRate);
  algoEqualLoudness->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoEqualLoudness->output("signal").set(output_signal);
  algoEqualLoudness->compute();
  delete algoEqualLoudness;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_FFT.html
std::vector<float> EssentiaJS::FFT(std::vector<float>& input_frame, const int size) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFFT = factory.create("FFT", "size", size);
  algoFFT->input("frame").set(input_frame);
  std::vector<float> output_fft;
  algoFFT->output("fft").set(output_fft);
  algoFFT->compute();
  delete algoFFT;
  return output_fft;
}
 
// check https://essentia.upf.edu/reference/std_FFTC.html
std::vector<float> EssentiaJS::FFTC(std::vector<float>& input_frame, const bool negativeFrequencies, const int size) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFFTC = factory.create("FFTC", "negativeFrequencies", negativeFrequencies, "size", size);
  algoFFTC->input("frame").set(input_frame);
  std::vector<float> output_fft;
  algoFFTC->output("fft").set(output_fft);
  algoFFTC->compute();
  delete algoFFTC;
  return output_fft;
}
 
// check https://essentia.upf.edu/reference/std_FadeDetection.html
void EssentiaJS::FadeDetection(std::vector<float>& input_rms, std::vector<float>& output_fadeIn, std::vector<float>& output_fadeOut, const float cutoffHigh, const float cutoffLow, const float frameRate, const float minLength) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFadeDetection = factory.create("FadeDetection", "cutoffHigh", cutoffHigh, "cutoffLow", cutoffLow, "frameRate", frameRate, "minLength", minLength);
  algoFadeDetection->input("rms").set(input_rms);
  algoFadeDetection->output("fadeIn").set(output_fadeIn);
  algoFadeDetection->output("fadeOut").set(output_fadeOut);
  algoFadeDetection->compute();
  delete algoFadeDetection;
}
 
// check https://essentia.upf.edu/reference/std_FalseStereoDetector.html
void EssentiaJS::FalseStereoDetector(std::vector<std::vector<float> >& input_frame, int output_isFalseStereo, float output_correlation, const float correlationThreshold, const int silenceThreshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFalseStereoDetector = factory.create("FalseStereoDetector", "correlationThreshold", correlationThreshold, "silenceThreshold", silenceThreshold);
  algoFalseStereoDetector->input("frame").set(input_frame);
  algoFalseStereoDetector->output("isFalseStereo").set(output_isFalseStereo);
  algoFalseStereoDetector->output("correlation").set(output_correlation);
  algoFalseStereoDetector->compute();
  delete algoFalseStereoDetector;
}
 
// check https://essentia.upf.edu/reference/std_Flatness.html
float EssentiaJS::Flatness(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFlatness = factory.create("Flatness");
  algoFlatness->input("array").set(input_array);
  float output_flatness;
  algoFlatness->output("flatness").set(output_flatness);
  algoFlatness->compute();
  delete algoFlatness;
  return output_flatness;
}
 
// check https://essentia.upf.edu/reference/std_FlatnessDB.html
float EssentiaJS::FlatnessDB(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFlatnessDB = factory.create("FlatnessDB");
  algoFlatnessDB->input("array").set(input_array);
  float output_flatnessDB;
  algoFlatnessDB->output("flatnessDB").set(output_flatnessDB);
  algoFlatnessDB->compute();
  delete algoFlatnessDB;
  return output_flatnessDB;
}
 
// check https://essentia.upf.edu/reference/std_FlatnessSFX.html
float EssentiaJS::FlatnessSFX(std::vector<float>& input_envelope) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFlatnessSFX = factory.create("FlatnessSFX");
  algoFlatnessSFX->input("envelope").set(input_envelope);
  float output_flatness;
  algoFlatnessSFX->output("flatness").set(output_flatness);
  algoFlatnessSFX->compute();
  delete algoFlatnessSFX;
  return output_flatness;
}
 
// check https://essentia.upf.edu/reference/std_Flux.html
float EssentiaJS::Flux(std::vector<float>& input_spectrum, const bool halfRectify, const std::string& norm) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFlux = factory.create("Flux", "halfRectify", halfRectify, "norm", norm);
  algoFlux->input("spectrum").set(input_spectrum);
  float output_flux;
  algoFlux->output("flux").set(output_flux);
  algoFlux->compute();
  delete algoFlux;
  return output_flux;
}
 
// check https://essentia.upf.edu/reference/std_FrameCutter.html
std::vector<float> EssentiaJS::FrameCutter(std::vector<float>& input_signal, const int frameSize, const int hopSize, const bool lastFrameToEndOfFile, const bool startFromZero, const float validFrameThresholdRatio) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFrameCutter = factory.create("FrameCutter", "frameSize", frameSize, "hopSize", hopSize, "lastFrameToEndOfFile", lastFrameToEndOfFile, "startFromZero", startFromZero, "validFrameThresholdRatio", validFrameThresholdRatio);
  algoFrameCutter->input("signal").set(input_signal);
  std::vector<float> output_frame;
  algoFrameCutter->output("frame").set(output_frame);
  algoFrameCutter->compute();
  delete algoFrameCutter;
  return output_frame;
}
 
// check https://essentia.upf.edu/reference/std_FrameToReal.html
std::vector<float> EssentiaJS::FrameToReal(std::vector<float>& input_signal, const int frameSize, const int hopSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFrameToReal = factory.create("FrameToReal", "frameSize", frameSize, "hopSize", hopSize);
  algoFrameToReal->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoFrameToReal->output("signal").set(output_signal);
  algoFrameToReal->compute();
  delete algoFrameToReal;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_FrequencyBands.html
std::vector<float> EssentiaJS::FrequencyBands(std::vector<float>& input_spectrum, const std::vector<float>& frequencyBands, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoFrequencyBands = factory.create("FrequencyBands", "frequencyBands", frequencyBands, "sampleRate", sampleRate);
  algoFrequencyBands->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  algoFrequencyBands->output("bands").set(output_bands);
  algoFrequencyBands->compute();
  delete algoFrequencyBands;
  return output_bands;
}
 
// check https://essentia.upf.edu/reference/std_GFCC.html
void EssentiaJS::GFCC(std::vector<float>& input_spectrum, std::vector<float>& output_bands, std::vector<float>& output_gfcc, const int dctType, const float highFrequencyBound, const int inputSize, const std::string& logType, const float lowFrequencyBound, const int numberBands, const int numberCoefficients, const float sampleRate, const float silenceThreshold, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoGFCC = factory.create("GFCC", "dctType", dctType, "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "logType", logType, "lowFrequencyBound", lowFrequencyBound, "numberBands", numberBands, "numberCoefficients", numberCoefficients, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold, "type", type);
  algoGFCC->input("spectrum").set(input_spectrum);
  algoGFCC->output("bands").set(output_bands);
  algoGFCC->output("gfcc").set(output_gfcc);
  algoGFCC->compute();
  delete algoGFCC;
}
 
// check https://essentia.upf.edu/reference/std_GapsDetector.html
void EssentiaJS::GapsDetector(std::vector<float>& input_frame, std::vector<float>& output_starts, std::vector<float>& output_ends, const float attackTime, const int frameSize, const int hopSize, const int kernelSize, const float maximumTime, const float minimumTime, const float postpowerTime, const float prepowerThreshold, const float prepowerTime, const float releaseTime, const float sampleRate, const float silenceThreshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoGapsDetector = factory.create("GapsDetector", "attackTime", attackTime, "frameSize", frameSize, "hopSize", hopSize, "kernelSize", kernelSize, "maximumTime", maximumTime, "minimumTime", minimumTime, "postpowerTime", postpowerTime, "prepowerThreshold", prepowerThreshold, "prepowerTime", prepowerTime, "releaseTime", releaseTime, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold);
  algoGapsDetector->input("frame").set(input_frame);
  algoGapsDetector->output("starts").set(output_starts);
  algoGapsDetector->output("ends").set(output_ends);
  algoGapsDetector->compute();
  delete algoGapsDetector;
}
 
// check https://essentia.upf.edu/reference/std_GeometricMean.html
float EssentiaJS::GeometricMean(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoGeometricMean = factory.create("GeometricMean");
  algoGeometricMean->input("array").set(input_array);
  float output_geometricMean;
  algoGeometricMean->output("geometricMean").set(output_geometricMean);
  algoGeometricMean->compute();
  delete algoGeometricMean;
  return output_geometricMean;
}
 
// check https://essentia.upf.edu/reference/std_HFC.html
float EssentiaJS::HFC(std::vector<float>& input_spectrum, const float sampleRate, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHFC = factory.create("HFC", "sampleRate", sampleRate, "type", type);
  algoHFC->input("spectrum").set(input_spectrum);
  float output_hfc;
  algoHFC->output("hfc").set(output_hfc);
  algoHFC->compute();
  delete algoHFC;
  return output_hfc;
}
 
// check https://essentia.upf.edu/reference/std_HPCP.html
std::vector<float> EssentiaJS::HPCP(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, const bool bandPreset, const float bandSplitFrequency, const int harmonics, const float maxFrequency, const bool maxShifted, const float minFrequency, const bool nonLinear, const std::string& normalized, const float referenceFrequency, const float sampleRate, const int size, const std::string& weightType, const float windowSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHPCP = factory.create("HPCP", "bandPreset", bandPreset, "bandSplitFrequency", bandSplitFrequency, "harmonics", harmonics, "maxFrequency", maxFrequency, "maxShifted", maxShifted, "minFrequency", minFrequency, "nonLinear", nonLinear, "normalized", normalized, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "size", size, "weightType", weightType, "windowSize", windowSize);
  algoHPCP->input("frequencies").set(input_frequencies);
  algoHPCP->input("magnitudes").set(input_magnitudes);
  std::vector<float> output_hpcp;
  algoHPCP->output("hpcp").set(output_hpcp);
  algoHPCP->compute();
  delete algoHPCP;
  return output_hpcp;
}
 
// check https://essentia.upf.edu/reference/std_HarmonicBpm.html
std::vector<float> EssentiaJS::HarmonicBpm(std::vector<float>& input_bpms, const int bpm, const float threshold, const float tolerance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHarmonicBpm = factory.create("HarmonicBpm", "bpm", bpm, "threshold", threshold, "tolerance", tolerance);
  algoHarmonicBpm->input("bpms").set(input_bpms);
  std::vector<float> output_harmonicBpms;
  algoHarmonicBpm->output("harmonicBpms").set(output_harmonicBpms);
  algoHarmonicBpm->compute();
  delete algoHarmonicBpm;
  return output_harmonicBpms;
}
 
// check https://essentia.upf.edu/reference/std_HarmonicMask.html
std::vector<float> EssentiaJS::HarmonicMask(std::vector<float>& input_fft, float input_pitch, const float attenuation, const int binWidth, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHarmonicMask = factory.create("HarmonicMask", "attenuation", attenuation, "binWidth", binWidth, "sampleRate", sampleRate);
  algoHarmonicMask->input("fft").set(input_fft);
  algoHarmonicMask->input("pitch").set(input_pitch);
  std::vector<float> output_fft;
  algoHarmonicMask->output("fft").set(output_fft);
  algoHarmonicMask->compute();
  delete algoHarmonicMask;
  return output_fft;
}
 
// check https://essentia.upf.edu/reference/std_HarmonicModelAnal.html
void EssentiaJS::HarmonicModelAnal(std::vector<float>& input_fft, float input_pitch, std::vector<float>& output_frequencies, std::vector<float>& output_magnitudes, std::vector<float>& output_phases, const float freqDevOffset, const float freqDevSlope, const float harmDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const int nHarmonics, const std::string& orderBy, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHarmonicModelAnal = factory.create("HarmonicModelAnal", "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "harmDevSlope", harmDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "nHarmonics", nHarmonics, "orderBy", orderBy, "sampleRate", sampleRate);
  algoHarmonicModelAnal->input("fft").set(input_fft);
  algoHarmonicModelAnal->input("pitch").set(input_pitch);
  algoHarmonicModelAnal->output("frequencies").set(output_frequencies);
  algoHarmonicModelAnal->output("magnitudes").set(output_magnitudes);
  algoHarmonicModelAnal->output("phases").set(output_phases);
  algoHarmonicModelAnal->compute();
  delete algoHarmonicModelAnal;
}
 
// check https://essentia.upf.edu/reference/std_HarmonicPeaks.html
void EssentiaJS::HarmonicPeaks(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, float input_pitch, std::vector<float>& output_harmonicFrequencies, std::vector<float>& output_harmonicMagnitudes, const int maxHarmonics, const float tolerance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHarmonicPeaks = factory.create("HarmonicPeaks", "maxHarmonics", maxHarmonics, "tolerance", tolerance);
  algoHarmonicPeaks->input("frequencies").set(input_frequencies);
  algoHarmonicPeaks->input("magnitudes").set(input_magnitudes);
  algoHarmonicPeaks->input("pitch").set(input_pitch);
  algoHarmonicPeaks->output("harmonicFrequencies").set(output_harmonicFrequencies);
  algoHarmonicPeaks->output("harmonicMagnitudes").set(output_harmonicMagnitudes);
  algoHarmonicPeaks->compute();
  delete algoHarmonicPeaks;
}
 
// check https://essentia.upf.edu/reference/std_HighPass.html
std::vector<float> EssentiaJS::HighPass(std::vector<float>& input_signal, const float cutoffFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHighPass = factory.create("HighPass", "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
  algoHighPass->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoHighPass->output("signal").set(output_signal);
  algoHighPass->compute();
  delete algoHighPass;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_HighResolutionFeatures.html
void EssentiaJS::HighResolutionFeatures(std::vector<float>& input_hpcp, float output_equalTemperedDeviation, float output_nonTemperedEnergyRatio, float output_nonTemperedPeaksEnergyRatio, const int maxPeaks) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHighResolutionFeatures = factory.create("HighResolutionFeatures", "maxPeaks", maxPeaks);
  algoHighResolutionFeatures->input("hpcp").set(input_hpcp);
  algoHighResolutionFeatures->output("equalTemperedDeviation").set(output_equalTemperedDeviation);
  algoHighResolutionFeatures->output("nonTemperedEnergyRatio").set(output_nonTemperedEnergyRatio);
  algoHighResolutionFeatures->output("nonTemperedPeaksEnergyRatio").set(output_nonTemperedPeaksEnergyRatio);
  algoHighResolutionFeatures->compute();
  delete algoHighResolutionFeatures;
}
 
// check https://essentia.upf.edu/reference/std_Histogram.html
void EssentiaJS::Histogram(std::vector<float>& input_array, std::vector<float>& output_histogram, std::vector<float>& output_binEdges, const float maxValue, const float minValue, const std::string& normalize, const int numberBins) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHistogram = factory.create("Histogram", "maxValue", maxValue, "minValue", minValue, "normalize", normalize, "numberBins", numberBins);
  algoHistogram->input("array").set(input_array);
  algoHistogram->output("histogram").set(output_histogram);
  algoHistogram->output("binEdges").set(output_binEdges);
  algoHistogram->compute();
  delete algoHistogram;
}
 
// check https://essentia.upf.edu/reference/std_HprModelAnal.html
void EssentiaJS::HprModelAnal(std::vector<float>& input_frame, float input_pitch, std::vector<float>& output_frequencies, std::vector<float>& output_magnitudes, std::vector<float>& output_phases, std::vector<float>& output_res, const int fftSize, const int freqDevOffset, const float freqDevSlope, const float harmDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const int nHarmonics, const std::string& orderBy, const float sampleRate, const float stocf) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHprModelAnal = factory.create("HprModelAnal", "fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "harmDevSlope", harmDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "nHarmonics", nHarmonics, "orderBy", orderBy, "sampleRate", sampleRate, "stocf", stocf);
  algoHprModelAnal->input("frame").set(input_frame);
  algoHprModelAnal->input("pitch").set(input_pitch);
  algoHprModelAnal->output("frequencies").set(output_frequencies);
  algoHprModelAnal->output("magnitudes").set(output_magnitudes);
  algoHprModelAnal->output("phases").set(output_phases);
  algoHprModelAnal->output("res").set(output_res);
  algoHprModelAnal->compute();
  delete algoHprModelAnal;
}
 
// check https://essentia.upf.edu/reference/std_HpsModelAnal.html
void EssentiaJS::HpsModelAnal(std::vector<float>& input_frame, float input_pitch, std::vector<float>& output_frequencies, std::vector<float>& output_magnitudes, std::vector<float>& output_phases, std::vector<float>& output_stocenv, const int fftSize, const int freqDevOffset, const float freqDevSlope, const float harmDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const int nHarmonics, const std::string& orderBy, const float sampleRate, const float stocf) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHpsModelAnal = factory.create("HpsModelAnal", "fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "harmDevSlope", harmDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "nHarmonics", nHarmonics, "orderBy", orderBy, "sampleRate", sampleRate, "stocf", stocf);
  algoHpsModelAnal->input("frame").set(input_frame);
  algoHpsModelAnal->input("pitch").set(input_pitch);
  algoHpsModelAnal->output("frequencies").set(output_frequencies);
  algoHpsModelAnal->output("magnitudes").set(output_magnitudes);
  algoHpsModelAnal->output("phases").set(output_phases);
  algoHpsModelAnal->output("stocenv").set(output_stocenv);
  algoHpsModelAnal->compute();
  delete algoHpsModelAnal;
}
 
// check https://essentia.upf.edu/reference/std_HumDetector.html
void EssentiaJS::HumDetector(std::vector<float>& input_signal, std::vector<float>& output_r, std::vector<float>& output_frequencies, std::vector<float>& output_saliences, std::vector<float>& output_starts, std::vector<float>& output_ends, const float Q0, const float Q1, const float detectionThreshold, const float frameSize, const float hopSize, const float maximumFrequency, const float minimumDuration, const float minimumFrequency, const int numberHarmonics, const float sampleRate, const float timeContinuity, const float timeWindow) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoHumDetector = factory.create("HumDetector", "Q0", Q0, "Q1", Q1, "detectionThreshold", detectionThreshold, "frameSize", frameSize, "hopSize", hopSize, "maximumFrequency", maximumFrequency, "minimumDuration", minimumDuration, "minimumFrequency", minimumFrequency, "numberHarmonics", numberHarmonics, "sampleRate", sampleRate, "timeContinuity", timeContinuity, "timeWindow", timeWindow);
  algoHumDetector->input("signal").set(input_signal);
  algoHumDetector->output("r").set(output_r);
  algoHumDetector->output("frequencies").set(output_frequencies);
  algoHumDetector->output("saliences").set(output_saliences);
  algoHumDetector->output("starts").set(output_starts);
  algoHumDetector->output("ends").set(output_ends);
  algoHumDetector->compute();
  delete algoHumDetector;
}
 
// check https://essentia.upf.edu/reference/std_IDCT.html
std::vector<float> EssentiaJS::IDCT(std::vector<float>& input_dct, const int dctType, const int inputSize, const int liftering, const int outputSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoIDCT = factory.create("IDCT", "dctType", dctType, "inputSize", inputSize, "liftering", liftering, "outputSize", outputSize);
  algoIDCT->input("dct").set(input_dct);
  std::vector<float> output_idct;
  algoIDCT->output("idct").set(output_idct);
  algoIDCT->compute();
  delete algoIDCT;
  return output_idct;
}
 
// check https://essentia.upf.edu/reference/std_IFFT.html
std::vector<float> EssentiaJS::IFFT(std::vector<float>& input_fft, const bool normalize, const int size) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoIFFT = factory.create("IFFT", "normalize", normalize, "size", size);
  algoIFFT->input("fft").set(input_fft);
  std::vector<float> output_frame;
  algoIFFT->output("frame").set(output_frame);
  algoIFFT->compute();
  delete algoIFFT;
  return output_frame;
}
 
// check https://essentia.upf.edu/reference/std_IFFTC.html
std::vector<float> EssentiaJS::IFFTC(std::vector<float>& input_fft, const bool normalize, const int size) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoIFFTC = factory.create("IFFTC", "normalize", normalize, "size", size);
  algoIFFTC->input("fft").set(input_fft);
  std::vector<float> output_frame;
  algoIFFTC->output("frame").set(output_frame);
  algoIFFTC->compute();
  delete algoIFFTC;
  return output_frame;
}
 
// check https://essentia.upf.edu/reference/std_IIR.html
std::vector<float> EssentiaJS::IIR(std::vector<float>& input_signal, const std::vector<float>& denominator, const std::vector<float>& numerator) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoIIR = factory.create("IIR", "denominator", denominator, "numerator", numerator);
  algoIIR->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoIIR->output("signal").set(output_signal);
  algoIIR->compute();
  delete algoIIR;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_Inharmonicity.html
float EssentiaJS::Inharmonicity(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoInharmonicity = factory.create("Inharmonicity");
  algoInharmonicity->input("frequencies").set(input_frequencies);
  algoInharmonicity->input("magnitudes").set(input_magnitudes);
  float output_inharmonicity;
  algoInharmonicity->output("inharmonicity").set(output_inharmonicity);
  algoInharmonicity->compute();
  delete algoInharmonicity;
  return output_inharmonicity;
}
 
// check https://essentia.upf.edu/reference/std_InstantPower.html
float EssentiaJS::InstantPower(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoInstantPower = factory.create("InstantPower");
  algoInstantPower->input("array").set(input_array);
  float output_power;
  algoInstantPower->output("power").set(output_power);
  algoInstantPower->compute();
  delete algoInstantPower;
  return output_power;
}
 
// check https://essentia.upf.edu/reference/std_Intensity.html
int EssentiaJS::Intensity(std::vector<float>& input_signal, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoIntensity = factory.create("Intensity", "sampleRate", sampleRate);
  algoIntensity->input("signal").set(input_signal);
  int output_intensity;
  algoIntensity->output("intensity").set(output_intensity);
  algoIntensity->compute();
  delete algoIntensity;
  return output_intensity;
}
 
// check https://essentia.upf.edu/reference/std_Key.html
void EssentiaJS::Key(std::vector<float>& input_pcp, std::string output_key, std::string output_scale, float output_strength, float output_firstToSecondRelativeStrength, const int numHarmonics, const int pcpSize, const std::string& profileType, const float slope, const bool useMajMin, const bool usePolyphony, const bool useThreeChords) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoKey = factory.create("Key", "numHarmonics", numHarmonics, "pcpSize", pcpSize, "profileType", profileType, "slope", slope, "useMajMin", useMajMin, "usePolyphony", usePolyphony, "useThreeChords", useThreeChords);
  algoKey->input("pcp").set(input_pcp);
  algoKey->output("key").set(output_key);
  algoKey->output("scale").set(output_scale);
  algoKey->output("strength").set(output_strength);
  algoKey->output("firstToSecondRelativeStrength").set(output_firstToSecondRelativeStrength);
  algoKey->compute();
  delete algoKey;
}
 
// check https://essentia.upf.edu/reference/std_KeyExtractor.html
void EssentiaJS::KeyExtractor(std::vector<float>& input_audio, std::string output_key, std::string output_scale, float output_strength, const bool averageDetuningCorrection, const int frameSize, const int hopSize, const int hpcpSize, const float maxFrequency, const int maximumSpectralPeaks, const float minFrequency, const float pcpThreshold, const std::string& profileType, const float sampleRate, const float spectralPeaksThreshold, const float tuningFrequency, const std::string& weightType, const std::string& windowType) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoKeyExtractor = factory.create("KeyExtractor", "averageDetuningCorrection", averageDetuningCorrection, "frameSize", frameSize, "hopSize", hopSize, "hpcpSize", hpcpSize, "maxFrequency", maxFrequency, "maximumSpectralPeaks", maximumSpectralPeaks, "minFrequency", minFrequency, "pcpThreshold", pcpThreshold, "profileType", profileType, "sampleRate", sampleRate, "spectralPeaksThreshold", spectralPeaksThreshold, "tuningFrequency", tuningFrequency, "weightType", weightType, "windowType", windowType);
  algoKeyExtractor->input("audio").set(input_audio);
  algoKeyExtractor->output("key").set(output_key);
  algoKeyExtractor->output("scale").set(output_scale);
  algoKeyExtractor->output("strength").set(output_strength);
  algoKeyExtractor->compute();
  delete algoKeyExtractor;
}
 
// check https://essentia.upf.edu/reference/std_LPC.html
void EssentiaJS::LPC(std::vector<float>& input_frame, std::vector<float>& output_lpc, std::vector<float>& output_reflection, const int order, const float sampleRate, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLPC = factory.create("LPC", "order", order, "sampleRate", sampleRate, "type", type);
  algoLPC->input("frame").set(input_frame);
  algoLPC->output("lpc").set(output_lpc);
  algoLPC->output("reflection").set(output_reflection);
  algoLPC->compute();
  delete algoLPC;
}
 
// check https://essentia.upf.edu/reference/std_Larm.html
float EssentiaJS::Larm(std::vector<float>& input_signal, const float attackTime, const float power, const float releaseTime, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLarm = factory.create("Larm", "attackTime", attackTime, "power", power, "releaseTime", releaseTime, "sampleRate", sampleRate);
  algoLarm->input("signal").set(input_signal);
  float output_larm;
  algoLarm->output("larm").set(output_larm);
  algoLarm->compute();
  delete algoLarm;
  return output_larm;
}
 
// check https://essentia.upf.edu/reference/std_Leq.html
float EssentiaJS::Leq(std::vector<float>& input_signal) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLeq = factory.create("Leq");
  algoLeq->input("signal").set(input_signal);
  float output_leq;
  algoLeq->output("leq").set(output_leq);
  algoLeq->compute();
  delete algoLeq;
  return output_leq;
}
 
// check https://essentia.upf.edu/reference/std_LevelExtractor.html
std::vector<float> EssentiaJS::LevelExtractor(std::vector<float>& input_signal, const int frameSize, const int hopSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLevelExtractor = factory.create("LevelExtractor", "frameSize", frameSize, "hopSize", hopSize);
  algoLevelExtractor->input("signal").set(input_signal);
  std::vector<float> output_loudness;
  algoLevelExtractor->output("loudness").set(output_loudness);
  algoLevelExtractor->compute();
  delete algoLevelExtractor;
  return output_loudness;
}
 
// check https://essentia.upf.edu/reference/std_LogAttackTime.html
void EssentiaJS::LogAttackTime(std::vector<float>& input_signal, float output_logAttackTime, float output_attackStart, float output_attackStop, const float sampleRate, const float startAttackThreshold, const float stopAttackThreshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLogAttackTime = factory.create("LogAttackTime", "sampleRate", sampleRate, "startAttackThreshold", startAttackThreshold, "stopAttackThreshold", stopAttackThreshold);
  algoLogAttackTime->input("signal").set(input_signal);
  algoLogAttackTime->output("logAttackTime").set(output_logAttackTime);
  algoLogAttackTime->output("attackStart").set(output_attackStart);
  algoLogAttackTime->output("attackStop").set(output_attackStop);
  algoLogAttackTime->compute();
  delete algoLogAttackTime;
}
 
// check https://essentia.upf.edu/reference/std_LogSpectrum.html
void EssentiaJS::LogSpectrum(std::vector<float>& input_spectrum, std::vector<float>& output_logFreqSpectrum, std::vector<float>& output_meanTuning, float output_localTuning, const float binsPerSemitone, const int frameSize, const float rollOn, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLogSpectrum = factory.create("LogSpectrum", "binsPerSemitone", binsPerSemitone, "frameSize", frameSize, "rollOn", rollOn, "sampleRate", sampleRate);
  algoLogSpectrum->input("spectrum").set(input_spectrum);
  algoLogSpectrum->output("logFreqSpectrum").set(output_logFreqSpectrum);
  algoLogSpectrum->output("meanTuning").set(output_meanTuning);
  algoLogSpectrum->output("localTuning").set(output_localTuning);
  algoLogSpectrum->compute();
  delete algoLogSpectrum;
}
 
// check https://essentia.upf.edu/reference/std_LoopBpmConfidence.html
float EssentiaJS::LoopBpmConfidence(std::vector<float>& input_signal, float input_bpmEstimate, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLoopBpmConfidence = factory.create("LoopBpmConfidence", "sampleRate", sampleRate);
  algoLoopBpmConfidence->input("signal").set(input_signal);
  algoLoopBpmConfidence->input("bpmEstimate").set(input_bpmEstimate);
  float output_confidence;
  algoLoopBpmConfidence->output("confidence").set(output_confidence);
  algoLoopBpmConfidence->compute();
  delete algoLoopBpmConfidence;
  return output_confidence;
}
 
// check https://essentia.upf.edu/reference/std_LoopBpmEstimator.html
float EssentiaJS::LoopBpmEstimator(std::vector<float>& input_signal, const float confidenceThreshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLoopBpmEstimator = factory.create("LoopBpmEstimator", "confidenceThreshold", confidenceThreshold);
  algoLoopBpmEstimator->input("signal").set(input_signal);
  float output_bpm;
  algoLoopBpmEstimator->output("bpm").set(output_bpm);
  algoLoopBpmEstimator->compute();
  delete algoLoopBpmEstimator;
  return output_bpm;
}
 
// check https://essentia.upf.edu/reference/std_Loudness.html
float EssentiaJS::Loudness(std::vector<float>& input_signal) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLoudness = factory.create("Loudness");
  algoLoudness->input("signal").set(input_signal);
  float output_loudness;
  algoLoudness->output("loudness").set(output_loudness);
  algoLoudness->compute();
  delete algoLoudness;
  return output_loudness;
}
 
// check https://essentia.upf.edu/reference/std_LoudnessEBUR128.html
void EssentiaJS::LoudnessEBUR128(std::vector<std::vector<float> >& input_signal, std::vector<float>& output_momentaryLoudness, std::vector<float>& output_shortTermLoudness, float output_integratedLoudness, float output_loudnessRange, const float hopSize, const float sampleRate, const bool startAtZero) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLoudnessEBUR128 = factory.create("LoudnessEBUR128", "hopSize", hopSize, "sampleRate", sampleRate, "startAtZero", startAtZero);
  algoLoudnessEBUR128->input("signal").set(input_signal);
  algoLoudnessEBUR128->output("momentaryLoudness").set(output_momentaryLoudness);
  algoLoudnessEBUR128->output("shortTermLoudness").set(output_shortTermLoudness);
  algoLoudnessEBUR128->output("integratedLoudness").set(output_integratedLoudness);
  algoLoudnessEBUR128->output("loudnessRange").set(output_loudnessRange);
  algoLoudnessEBUR128->compute();
  delete algoLoudnessEBUR128;
}
 
// check https://essentia.upf.edu/reference/std_LoudnessVickers.html
float EssentiaJS::LoudnessVickers(std::vector<float>& input_signal, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLoudnessVickers = factory.create("LoudnessVickers", "sampleRate", sampleRate);
  algoLoudnessVickers->input("signal").set(input_signal);
  float output_loudness;
  algoLoudnessVickers->output("loudness").set(output_loudness);
  algoLoudnessVickers->compute();
  delete algoLoudnessVickers;
  return output_loudness;
}
 
// check https://essentia.upf.edu/reference/std_LowLevelSpectralEqloudExtractor.html
void EssentiaJS::LowLevelSpectralEqloudExtractor(std::vector<float>& input_signal, std::vector<float>& output_dissonance, std::vector<std::vector<float> >& output_sccoeffs, std::vector<std::vector<float> >& output_scvalleys, std::vector<float>& output_spectral_centroid, std::vector<float>& output_spectral_kurtosis, std::vector<float>& output_spectral_skewness, std::vector<float>& output_spectral_spread, const int frameSize, const int hopSize, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLowLevelSpectralEqloudExtractor = factory.create("LowLevelSpectralEqloudExtractor", "frameSize", frameSize, "hopSize", hopSize, "sampleRate", sampleRate);
  algoLowLevelSpectralEqloudExtractor->input("signal").set(input_signal);
  algoLowLevelSpectralEqloudExtractor->output("dissonance").set(output_dissonance);
  algoLowLevelSpectralEqloudExtractor->output("sccoeffs").set(output_sccoeffs);
  algoLowLevelSpectralEqloudExtractor->output("scvalleys").set(output_scvalleys);
  algoLowLevelSpectralEqloudExtractor->output("spectral_centroid").set(output_spectral_centroid);
  algoLowLevelSpectralEqloudExtractor->output("spectral_kurtosis").set(output_spectral_kurtosis);
  algoLowLevelSpectralEqloudExtractor->output("spectral_skewness").set(output_spectral_skewness);
  algoLowLevelSpectralEqloudExtractor->output("spectral_spread").set(output_spectral_spread);
  algoLowLevelSpectralEqloudExtractor->compute();
  delete algoLowLevelSpectralEqloudExtractor;
}
 
// check https://essentia.upf.edu/reference/std_LowLevelSpectralExtractor.html
void EssentiaJS::LowLevelSpectralExtractor(std::vector<float>& input_signal, std::vector<std::vector<float> >& output_barkbands, std::vector<float>& output_barkbands_kurtosis, std::vector<float>& output_barkbands_skewness, std::vector<float>& output_barkbands_spread, std::vector<float>& output_hfc, std::vector<std::vector<float> >& output_mfcc, std::vector<float>& output_pitch, std::vector<float>& output_pitch_instantaneous_confidence, std::vector<float>& output_pitch_salience, std::vector<float>& output_silence_rate_20dB, std::vector<float>& output_silence_rate_30dB, std::vector<float>& output_silence_rate_60dB, std::vector<float>& output_spectral_complexity, std::vector<float>& output_spectral_crest, std::vector<float>& output_spectral_decrease, std::vector<float>& output_spectral_energy, std::vector<float>& output_spectral_energyband_low, std::vector<float>& output_spectral_energyband_middle_low, std::vector<float>& output_spectral_energyband_middle_high, std::vector<float>& output_spectral_energyband_high, std::vector<float>& output_spectral_flatness_db, std::vector<float>& output_spectral_flux, std::vector<float>& output_spectral_rms, std::vector<float>& output_spectral_rolloff, std::vector<float>& output_spectral_strongpeak, std::vector<float>& output_zerocrossingrate, std::vector<float>& output_inharmonicity, std::vector<std::vector<float> >& output_tristimulus, std::vector<float>& output_oddtoevenharmonicenergyratio, const int frameSize, const int hopSize, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLowLevelSpectralExtractor = factory.create("LowLevelSpectralExtractor", "frameSize", frameSize, "hopSize", hopSize, "sampleRate", sampleRate);
  algoLowLevelSpectralExtractor->input("signal").set(input_signal);
  algoLowLevelSpectralExtractor->output("barkbands").set(output_barkbands);
  algoLowLevelSpectralExtractor->output("barkbands_kurtosis").set(output_barkbands_kurtosis);
  algoLowLevelSpectralExtractor->output("barkbands_skewness").set(output_barkbands_skewness);
  algoLowLevelSpectralExtractor->output("barkbands_spread").set(output_barkbands_spread);
  algoLowLevelSpectralExtractor->output("hfc").set(output_hfc);
  algoLowLevelSpectralExtractor->output("mfcc").set(output_mfcc);
  algoLowLevelSpectralExtractor->output("pitch").set(output_pitch);
  algoLowLevelSpectralExtractor->output("pitch_instantaneous_confidence").set(output_pitch_instantaneous_confidence);
  algoLowLevelSpectralExtractor->output("pitch_salience").set(output_pitch_salience);
  algoLowLevelSpectralExtractor->output("silence_rate_20dB").set(output_silence_rate_20dB);
  algoLowLevelSpectralExtractor->output("silence_rate_30dB").set(output_silence_rate_30dB);
  algoLowLevelSpectralExtractor->output("silence_rate_60dB").set(output_silence_rate_60dB);
  algoLowLevelSpectralExtractor->output("spectral_complexity").set(output_spectral_complexity);
  algoLowLevelSpectralExtractor->output("spectral_crest").set(output_spectral_crest);
  algoLowLevelSpectralExtractor->output("spectral_decrease").set(output_spectral_decrease);
  algoLowLevelSpectralExtractor->output("spectral_energy").set(output_spectral_energy);
  algoLowLevelSpectralExtractor->output("spectral_energyband_low").set(output_spectral_energyband_low);
  algoLowLevelSpectralExtractor->output("spectral_energyband_middle_low").set(output_spectral_energyband_middle_low);
  algoLowLevelSpectralExtractor->output("spectral_energyband_middle_high").set(output_spectral_energyband_middle_high);
  algoLowLevelSpectralExtractor->output("spectral_energyband_high").set(output_spectral_energyband_high);
  algoLowLevelSpectralExtractor->output("spectral_flatness_db").set(output_spectral_flatness_db);
  algoLowLevelSpectralExtractor->output("spectral_flux").set(output_spectral_flux);
  algoLowLevelSpectralExtractor->output("spectral_rms").set(output_spectral_rms);
  algoLowLevelSpectralExtractor->output("spectral_rolloff").set(output_spectral_rolloff);
  algoLowLevelSpectralExtractor->output("spectral_strongpeak").set(output_spectral_strongpeak);
  algoLowLevelSpectralExtractor->output("zerocrossingrate").set(output_zerocrossingrate);
  algoLowLevelSpectralExtractor->output("inharmonicity").set(output_inharmonicity);
  algoLowLevelSpectralExtractor->output("tristimulus").set(output_tristimulus);
  algoLowLevelSpectralExtractor->output("oddtoevenharmonicenergyratio").set(output_oddtoevenharmonicenergyratio);
  algoLowLevelSpectralExtractor->compute();
  delete algoLowLevelSpectralExtractor;
}
 
// check https://essentia.upf.edu/reference/std_LowPass.html
std::vector<float> EssentiaJS::LowPass(std::vector<float>& input_signal, const float cutoffFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoLowPass = factory.create("LowPass", "cutoffFrequency", cutoffFrequency, "sampleRate", sampleRate);
  algoLowPass->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoLowPass->output("signal").set(output_signal);
  algoLowPass->compute();
  delete algoLowPass;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_MFCC.html
void EssentiaJS::MFCC(std::vector<float>& input_spectrum, std::vector<float>& output_bands, std::vector<float>& output_mfcc, const int dctType, const float highFrequencyBound, const int inputSize, const int liftering, const std::string& logType, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const int numberCoefficients, const float sampleRate, const float silenceThreshold, const std::string& type, const std::string& warpingFormula, const std::string& weighting) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMFCC = factory.create("MFCC", "dctType", dctType, "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "liftering", liftering, "logType", logType, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "numberCoefficients", numberCoefficients, "sampleRate", sampleRate, "silenceThreshold", silenceThreshold, "type", type, "warpingFormula", warpingFormula, "weighting", weighting);
  algoMFCC->input("spectrum").set(input_spectrum);
  algoMFCC->output("bands").set(output_bands);
  algoMFCC->output("mfcc").set(output_mfcc);
  algoMFCC->compute();
  delete algoMFCC;
}
 
// check https://essentia.upf.edu/reference/std_Magnitude.html
std::vector<float> EssentiaJS::Magnitude(std::vector<float>& input_complex) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMagnitude = factory.create("Magnitude");
  algoMagnitude->input("complex").set(input_complex);
  std::vector<float> output_magnitude;
  algoMagnitude->output("magnitude").set(output_magnitude);
  algoMagnitude->compute();
  delete algoMagnitude;
  return output_magnitude;
}
 
// check https://essentia.upf.edu/reference/std_MaxFilter.html
std::vector<float> EssentiaJS::MaxFilter(std::vector<float>& input_signal, const bool causal, const int width) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMaxFilter = factory.create("MaxFilter", "causal", causal, "width", width);
  algoMaxFilter->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoMaxFilter->output("signal").set(output_signal);
  algoMaxFilter->compute();
  delete algoMaxFilter;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_MaxMagFreq.html
float EssentiaJS::MaxMagFreq(std::vector<float>& input_spectrum, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMaxMagFreq = factory.create("MaxMagFreq", "sampleRate", sampleRate);
  algoMaxMagFreq->input("spectrum").set(input_spectrum);
  float output_maxMagFreq;
  algoMaxMagFreq->output("maxMagFreq").set(output_maxMagFreq);
  algoMaxMagFreq->compute();
  delete algoMaxMagFreq;
  return output_maxMagFreq;
}
 
// check https://essentia.upf.edu/reference/std_MaxToTotal.html
float EssentiaJS::MaxToTotal(std::vector<float>& input_envelope) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMaxToTotal = factory.create("MaxToTotal");
  algoMaxToTotal->input("envelope").set(input_envelope);
  float output_maxToTotal;
  algoMaxToTotal->output("maxToTotal").set(output_maxToTotal);
  algoMaxToTotal->compute();
  delete algoMaxToTotal;
  return output_maxToTotal;
}
 
// check https://essentia.upf.edu/reference/std_Mean.html
float EssentiaJS::Mean(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMean = factory.create("Mean");
  algoMean->input("array").set(input_array);
  float output_mean;
  algoMean->output("mean").set(output_mean);
  algoMean->compute();
  delete algoMean;
  return output_mean;
}
 
// check https://essentia.upf.edu/reference/std_Median.html
float EssentiaJS::Median(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMedian = factory.create("Median");
  algoMedian->input("array").set(input_array);
  float output_median;
  algoMedian->output("median").set(output_median);
  algoMedian->compute();
  delete algoMedian;
  return output_median;
}
 
// check https://essentia.upf.edu/reference/std_MedianFilter.html
std::vector<float> EssentiaJS::MedianFilter(std::vector<float>& input_array, const int kernelSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMedianFilter = factory.create("MedianFilter", "kernelSize", kernelSize);
  algoMedianFilter->input("array").set(input_array);
  std::vector<float> output_filteredArray;
  algoMedianFilter->output("filteredArray").set(output_filteredArray);
  algoMedianFilter->compute();
  delete algoMedianFilter;
  return output_filteredArray;
}
 
// check https://essentia.upf.edu/reference/std_MelBands.html
std::vector<float> EssentiaJS::MelBands(std::vector<float>& input_spectrum, const float highFrequencyBound, const int inputSize, const bool log, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const float sampleRate, const std::string& type, const std::string& warpingFormula, const std::string& weighting) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMelBands = factory.create("MelBands", "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "log", log, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "sampleRate", sampleRate, "type", type, "warpingFormula", warpingFormula, "weighting", weighting);
  algoMelBands->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  algoMelBands->output("bands").set(output_bands);
  algoMelBands->compute();
  delete algoMelBands;
  return output_bands;
}
 
// check https://essentia.upf.edu/reference/std_Meter.html
float EssentiaJS::Meter(std::vector<std::vector<float> >& input_beatogram) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMeter = factory.create("Meter");
  algoMeter->input("beatogram").set(input_beatogram);
  float output_meter;
  algoMeter->output("meter").set(output_meter);
  algoMeter->compute();
  delete algoMeter;
  return output_meter;
}
 
// check https://essentia.upf.edu/reference/std_MinMax.html
void EssentiaJS::MinMax(std::vector<float>& input_array, float output_real, int output_int, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMinMax = factory.create("MinMax", "type", type);
  algoMinMax->input("array").set(input_array);
  algoMinMax->output("real").set(output_real);
  algoMinMax->output("int").set(output_int);
  algoMinMax->compute();
  delete algoMinMax;
}
 
// check https://essentia.upf.edu/reference/std_MinToTotal.html
float EssentiaJS::MinToTotal(std::vector<float>& input_envelope) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMinToTotal = factory.create("MinToTotal");
  algoMinToTotal->input("envelope").set(input_envelope);
  float output_minToTotal;
  algoMinToTotal->output("minToTotal").set(output_minToTotal);
  algoMinToTotal->compute();
  delete algoMinToTotal;
  return output_minToTotal;
}
 
// check https://essentia.upf.edu/reference/std_MovingAverage.html
std::vector<float> EssentiaJS::MovingAverage(std::vector<float>& input_signal, const int size) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMovingAverage = factory.create("MovingAverage", "size", size);
  algoMovingAverage->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoMovingAverage->output("signal").set(output_signal);
  algoMovingAverage->compute();
  delete algoMovingAverage;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_Multiplexer.html
std::vector<std::vector<float> > EssentiaJS::Multiplexer(const int numberRealInputs, const int numberVectorRealInputs) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoMultiplexer = factory.create("Multiplexer", "numberRealInputs", numberRealInputs, "numberVectorRealInputs", numberVectorRealInputs);
  std::vector<std::vector<float> > output_data;
  algoMultiplexer->output("data").set(output_data);
  algoMultiplexer->compute();
  delete algoMultiplexer;
  return output_data;
}
 
// check https://essentia.upf.edu/reference/std_NNLSChroma.html
void EssentiaJS::NNLSChroma(std::vector<std::vector<float> >& input_logSpectrogram, std::vector<float>& input_meanTuning, std::vector<float>& input_localTuning, std::vector<std::vector<float> >& output_tunedLogfreqSpectrum, std::vector<std::vector<float> >& output_semitoneSpectrum, std::vector<std::vector<float> >& output_bassChromagram, std::vector<std::vector<float> >& output_chromagram, const std::string& chromaNormalization, const int frameSize, const float sampleRate, const float spectralShape, const float spectralWhitening, const std::string& tuningMode, const bool useNNLS) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoNNLSChroma = factory.create("NNLSChroma", "chromaNormalization", chromaNormalization, "frameSize", frameSize, "sampleRate", sampleRate, "spectralShape", spectralShape, "spectralWhitening", spectralWhitening, "tuningMode", tuningMode, "useNNLS", useNNLS);
  algoNNLSChroma->input("logSpectrogram").set(input_logSpectrogram);
  algoNNLSChroma->input("meanTuning").set(input_meanTuning);
  algoNNLSChroma->input("localTuning").set(input_localTuning);
  algoNNLSChroma->output("tunedLogfreqSpectrum").set(output_tunedLogfreqSpectrum);
  algoNNLSChroma->output("semitoneSpectrum").set(output_semitoneSpectrum);
  algoNNLSChroma->output("bassChromagram").set(output_bassChromagram);
  algoNNLSChroma->output("chromagram").set(output_chromagram);
  algoNNLSChroma->compute();
  delete algoNNLSChroma;
}
 
// check https://essentia.upf.edu/reference/std_NSGConstantQ.html
void EssentiaJS::NSGConstantQ(std::vector<float>& input_frame, std::vector<std::vector<float> >& output_constantq, std::vector<float>& output_constantqdc, std::vector<float>& output_constantqnf, const int binsPerOctave, const int gamma, const int inputSize, const float maxFrequency, const float minFrequency, const int minimumWindow, const std::string& normalize, const std::string& phaseMode, const std::string& rasterize, const float sampleRate, const std::string& window, const int windowSizeFactor) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoNSGConstantQ = factory.create("NSGConstantQ", "binsPerOctave", binsPerOctave, "gamma", gamma, "inputSize", inputSize, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "minimumWindow", minimumWindow, "normalize", normalize, "phaseMode", phaseMode, "rasterize", rasterize, "sampleRate", sampleRate, "window", window, "windowSizeFactor", windowSizeFactor);
  algoNSGConstantQ->input("frame").set(input_frame);
  algoNSGConstantQ->output("constantq").set(output_constantq);
  algoNSGConstantQ->output("constantqdc").set(output_constantqdc);
  algoNSGConstantQ->output("constantqnf").set(output_constantqnf);
  algoNSGConstantQ->compute();
  delete algoNSGConstantQ;
}
 
// check https://essentia.upf.edu/reference/std_NSGIConstantQ.html
std::vector<float> EssentiaJS::NSGIConstantQ(std::vector<std::vector<float> >& input_constantq, std::vector<float>& input_constantqdc, std::vector<float>& input_constantqnf, const int binsPerOctave, const int gamma, const int inputSize, const float maxFrequency, const float minFrequency, const int minimumWindow, const std::string& normalize, const std::string& phaseMode, const std::string& rasterize, const float sampleRate, const std::string& window, const int windowSizeFactor) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoNSGIConstantQ = factory.create("NSGIConstantQ", "binsPerOctave", binsPerOctave, "gamma", gamma, "inputSize", inputSize, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "minimumWindow", minimumWindow, "normalize", normalize, "phaseMode", phaseMode, "rasterize", rasterize, "sampleRate", sampleRate, "window", window, "windowSizeFactor", windowSizeFactor);
  algoNSGIConstantQ->input("constantq").set(input_constantq);
  algoNSGIConstantQ->input("constantqdc").set(input_constantqdc);
  algoNSGIConstantQ->input("constantqnf").set(input_constantqnf);
  std::vector<float> output_frame;
  algoNSGIConstantQ->output("frame").set(output_frame);
  algoNSGIConstantQ->compute();
  delete algoNSGIConstantQ;
  return output_frame;
}
 
// check https://essentia.upf.edu/reference/std_NoiseAdder.html
std::vector<float> EssentiaJS::NoiseAdder(std::vector<float>& input_signal, const bool fixSeed, const int level) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoNoiseAdder = factory.create("NoiseAdder", "fixSeed", fixSeed, "level", level);
  algoNoiseAdder->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoNoiseAdder->output("signal").set(output_signal);
  algoNoiseAdder->compute();
  delete algoNoiseAdder;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_NoiseBurstDetector.html
std::vector<float> EssentiaJS::NoiseBurstDetector(std::vector<float>& input_frame, const float alpha, const int silenceThreshold, const int threshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoNoiseBurstDetector = factory.create("NoiseBurstDetector", "alpha", alpha, "silenceThreshold", silenceThreshold, "threshold", threshold);
  algoNoiseBurstDetector->input("frame").set(input_frame);
  std::vector<float> output_indexes;
  algoNoiseBurstDetector->output("indexes").set(output_indexes);
  algoNoiseBurstDetector->compute();
  delete algoNoiseBurstDetector;
  return output_indexes;
}
 
// check https://essentia.upf.edu/reference/std_NoveltyCurve.html
std::vector<float> EssentiaJS::NoveltyCurve(std::vector<std::vector<float> >& input_frequencyBands, const float frameRate, const bool normalize, const std::vector<float>& weightCurve, const std::string& weightCurveType) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoNoveltyCurve = factory.create("NoveltyCurve", "frameRate", frameRate, "normalize", normalize, "weightCurve", weightCurve, "weightCurveType", weightCurveType);
  algoNoveltyCurve->input("frequencyBands").set(input_frequencyBands);
  std::vector<float> output_novelty;
  algoNoveltyCurve->output("novelty").set(output_novelty);
  algoNoveltyCurve->compute();
  delete algoNoveltyCurve;
  return output_novelty;
}
 
// check https://essentia.upf.edu/reference/std_NoveltyCurveFixedBpmEstimator.html
void EssentiaJS::NoveltyCurveFixedBpmEstimator(std::vector<float>& input_novelty, std::vector<float>& output_bpms, std::vector<float>& output_amplitudes, const int hopSize, const float maxBpm, const float minBpm, const float sampleRate, const float tolerance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoNoveltyCurveFixedBpmEstimator = factory.create("NoveltyCurveFixedBpmEstimator", "hopSize", hopSize, "maxBpm", maxBpm, "minBpm", minBpm, "sampleRate", sampleRate, "tolerance", tolerance);
  algoNoveltyCurveFixedBpmEstimator->input("novelty").set(input_novelty);
  algoNoveltyCurveFixedBpmEstimator->output("bpms").set(output_bpms);
  algoNoveltyCurveFixedBpmEstimator->output("amplitudes").set(output_amplitudes);
  algoNoveltyCurveFixedBpmEstimator->compute();
  delete algoNoveltyCurveFixedBpmEstimator;
}
 
// check https://essentia.upf.edu/reference/std_OddToEvenHarmonicEnergyRatio.html
float EssentiaJS::OddToEvenHarmonicEnergyRatio(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoOddToEvenHarmonicEnergyRatio = factory.create("OddToEvenHarmonicEnergyRatio");
  algoOddToEvenHarmonicEnergyRatio->input("frequencies").set(input_frequencies);
  algoOddToEvenHarmonicEnergyRatio->input("magnitudes").set(input_magnitudes);
  float output_oddToEvenHarmonicEnergyRatio;
  algoOddToEvenHarmonicEnergyRatio->output("oddToEvenHarmonicEnergyRatio").set(output_oddToEvenHarmonicEnergyRatio);
  algoOddToEvenHarmonicEnergyRatio->compute();
  delete algoOddToEvenHarmonicEnergyRatio;
  return output_oddToEvenHarmonicEnergyRatio;
}
 
// check https://essentia.upf.edu/reference/std_OnsetDetection.html
float EssentiaJS::OnsetDetection(std::vector<float>& input_spectrum, std::vector<float>& input_phase, const std::string& method, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoOnsetDetection = factory.create("OnsetDetection", "method", method, "sampleRate", sampleRate);
  algoOnsetDetection->input("spectrum").set(input_spectrum);
  algoOnsetDetection->input("phase").set(input_phase);
  float output_onsetDetection;
  algoOnsetDetection->output("onsetDetection").set(output_onsetDetection);
  algoOnsetDetection->compute();
  delete algoOnsetDetection;
  return output_onsetDetection;
}
 
// check https://essentia.upf.edu/reference/std_OnsetDetectionGlobal.html
std::vector<float> EssentiaJS::OnsetDetectionGlobal(std::vector<float>& input_signal, const int frameSize, const int hopSize, const std::string& method, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoOnsetDetectionGlobal = factory.create("OnsetDetectionGlobal", "frameSize", frameSize, "hopSize", hopSize, "method", method, "sampleRate", sampleRate);
  algoOnsetDetectionGlobal->input("signal").set(input_signal);
  std::vector<float> output_onsetDetections;
  algoOnsetDetectionGlobal->output("onsetDetections").set(output_onsetDetections);
  algoOnsetDetectionGlobal->compute();
  delete algoOnsetDetectionGlobal;
  return output_onsetDetections;
}
 
// check https://essentia.upf.edu/reference/std_OnsetRate.html
void EssentiaJS::OnsetRate(std::vector<float>& input_signal, std::vector<float>& output_onsets, float output_onsetRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoOnsetRate = factory.create("OnsetRate");
  algoOnsetRate->input("signal").set(input_signal);
  algoOnsetRate->output("onsets").set(output_onsets);
  algoOnsetRate->output("onsetRate").set(output_onsetRate);
  algoOnsetRate->compute();
  delete algoOnsetRate;
}
 
// check https://essentia.upf.edu/reference/std_Onsets.html
std::vector<float> EssentiaJS::Onsets(std::vector<float>& input_detections, std::vector<float>& input_weights, const float alpha, const int delay, const float frameRate, const float silenceThreshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoOnsets = factory.create("Onsets", "alpha", alpha, "delay", delay, "frameRate", frameRate, "silenceThreshold", silenceThreshold);
  algoOnsets->input("detections").set(input_detections);
  algoOnsets->input("weights").set(input_weights);
  std::vector<float> output_onsets;
  algoOnsets->output("onsets").set(output_onsets);
  algoOnsets->compute();
  delete algoOnsets;
  return output_onsets;
}
 
// check https://essentia.upf.edu/reference/std_OverlapAdd.html
std::vector<float> EssentiaJS::OverlapAdd(std::vector<float>& input_signal, const int frameSize, const float gain, const int hopSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoOverlapAdd = factory.create("OverlapAdd", "frameSize", frameSize, "gain", gain, "hopSize", hopSize);
  algoOverlapAdd->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoOverlapAdd->output("signal").set(output_signal);
  algoOverlapAdd->compute();
  delete algoOverlapAdd;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_Panning.html
std::vector<float> EssentiaJS::Panning(std::vector<float>& input_spectrumLeft, std::vector<float>& input_spectrumRight, const int averageFrames, const int numBands, const int numCoeffs, const int panningBins, const float sampleRate, const bool warpedPanorama) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPanning = factory.create("Panning", "averageFrames", averageFrames, "numBands", numBands, "numCoeffs", numCoeffs, "panningBins", panningBins, "sampleRate", sampleRate, "warpedPanorama", warpedPanorama);
  algoPanning->input("spectrumLeft").set(input_spectrumLeft);
  algoPanning->input("spectrumRight").set(input_spectrumRight);
  std::vector<float> output_panningCoeffs;
  algoPanning->output("panningCoeffs").set(output_panningCoeffs);
  algoPanning->compute();
  delete algoPanning;
  return output_panningCoeffs;
}
 
// check https://essentia.upf.edu/reference/std_PeakDetection.html
void EssentiaJS::PeakDetection(std::vector<float>& input_array, std::vector<float>& output_positions, std::vector<float>& output_amplitudes, const bool interpolate, const int maxPeaks, const float maxPosition, const float minPeakDistance, const float minPosition, const std::string& orderBy, const float range, const float threshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPeakDetection = factory.create("PeakDetection", "interpolate", interpolate, "maxPeaks", maxPeaks, "maxPosition", maxPosition, "minPeakDistance", minPeakDistance, "minPosition", minPosition, "orderBy", orderBy, "range", range, "threshold", threshold);
  algoPeakDetection->input("array").set(input_array);
  algoPeakDetection->output("positions").set(output_positions);
  algoPeakDetection->output("amplitudes").set(output_amplitudes);
  algoPeakDetection->compute();
  delete algoPeakDetection;
}
 
// check https://essentia.upf.edu/reference/std_PercivalBpmEstimator.html
float EssentiaJS::PercivalBpmEstimator(std::vector<float>& input_signal, const int frameSize, const int frameSizeOSS, const int hopSize, const int hopSizeOSS, const int maxBPM, const int minBPM, const int sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPercivalBpmEstimator = factory.create("PercivalBpmEstimator", "frameSize", frameSize, "frameSizeOSS", frameSizeOSS, "hopSize", hopSize, "hopSizeOSS", hopSizeOSS, "maxBPM", maxBPM, "minBPM", minBPM, "sampleRate", sampleRate);
  algoPercivalBpmEstimator->input("signal").set(input_signal);
  float output_bpm;
  algoPercivalBpmEstimator->output("bpm").set(output_bpm);
  algoPercivalBpmEstimator->compute();
  delete algoPercivalBpmEstimator;
  return output_bpm;
}
 
// check https://essentia.upf.edu/reference/std_PercivalEnhanceHarmonics.html
std::vector<float> EssentiaJS::PercivalEnhanceHarmonics(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPercivalEnhanceHarmonics = factory.create("PercivalEnhanceHarmonics");
  algoPercivalEnhanceHarmonics->input("array").set(input_array);
  std::vector<float> output_array;
  algoPercivalEnhanceHarmonics->output("array").set(output_array);
  algoPercivalEnhanceHarmonics->compute();
  delete algoPercivalEnhanceHarmonics;
  return output_array;
}
 
// check https://essentia.upf.edu/reference/std_PercivalEvaluatePulseTrains.html
float EssentiaJS::PercivalEvaluatePulseTrains(std::vector<float>& input_oss, std::vector<float>& input_positions) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPercivalEvaluatePulseTrains = factory.create("PercivalEvaluatePulseTrains");
  algoPercivalEvaluatePulseTrains->input("oss").set(input_oss);
  algoPercivalEvaluatePulseTrains->input("positions").set(input_positions);
  float output_lag;
  algoPercivalEvaluatePulseTrains->output("lag").set(output_lag);
  algoPercivalEvaluatePulseTrains->compute();
  delete algoPercivalEvaluatePulseTrains;
  return output_lag;
}
 
// check https://essentia.upf.edu/reference/std_PitchContourSegmentation.html
void EssentiaJS::PitchContourSegmentation(std::vector<float>& input_pitch, std::vector<float>& input_signal, std::vector<float>& output_onset, std::vector<float>& output_duration, std::vector<float>& output_MIDIpitch, const int hopSize, const float minDuration, const int pitchDistanceThreshold, const int rmsThreshold, const int sampleRate, const int tuningFrequency) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchContourSegmentation = factory.create("PitchContourSegmentation", "hopSize", hopSize, "minDuration", minDuration, "pitchDistanceThreshold", pitchDistanceThreshold, "rmsThreshold", rmsThreshold, "sampleRate", sampleRate, "tuningFrequency", tuningFrequency);
  algoPitchContourSegmentation->input("pitch").set(input_pitch);
  algoPitchContourSegmentation->input("signal").set(input_signal);
  algoPitchContourSegmentation->output("onset").set(output_onset);
  algoPitchContourSegmentation->output("duration").set(output_duration);
  algoPitchContourSegmentation->output("MIDIpitch").set(output_MIDIpitch);
  algoPitchContourSegmentation->compute();
  delete algoPitchContourSegmentation;
}
 
// check https://essentia.upf.edu/reference/std_PitchContours.html
void EssentiaJS::PitchContours(std::vector<std::vector<float> >& input_peakBins, std::vector<std::vector<float> >& input_peakSaliences, std::vector<std::vector<float> >& output_contoursBins, std::vector<std::vector<float> >& output_contoursSaliences, std::vector<float>& output_contoursStartTimes, float output_duration, const float binResolution, const int hopSize, const float minDuration, const float peakDistributionThreshold, const float peakFrameThreshold, const float pitchContinuity, const float sampleRate, const float timeContinuity) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchContours = factory.create("PitchContours", "binResolution", binResolution, "hopSize", hopSize, "minDuration", minDuration, "peakDistributionThreshold", peakDistributionThreshold, "peakFrameThreshold", peakFrameThreshold, "pitchContinuity", pitchContinuity, "sampleRate", sampleRate, "timeContinuity", timeContinuity);
  algoPitchContours->input("peakBins").set(input_peakBins);
  algoPitchContours->input("peakSaliences").set(input_peakSaliences);
  algoPitchContours->output("contoursBins").set(output_contoursBins);
  algoPitchContours->output("contoursSaliences").set(output_contoursSaliences);
  algoPitchContours->output("contoursStartTimes").set(output_contoursStartTimes);
  algoPitchContours->output("duration").set(output_duration);
  algoPitchContours->compute();
  delete algoPitchContours;
}
 
// check https://essentia.upf.edu/reference/std_PitchContoursMelody.html
void EssentiaJS::PitchContoursMelody(std::vector<std::vector<float> >& input_contoursBins, std::vector<std::vector<float> >& input_contoursSaliences, std::vector<float>& input_contoursStartTimes, float input_duration, std::vector<float>& output_pitch, std::vector<float>& output_pitchConfidence, const float binResolution, const int filterIterations, const bool guessUnvoiced, const int hopSize, const float maxFrequency, const float minFrequency, const float referenceFrequency, const float sampleRate, const bool voiceVibrato, const float voicingTolerance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchContoursMelody = factory.create("PitchContoursMelody", "binResolution", binResolution, "filterIterations", filterIterations, "guessUnvoiced", guessUnvoiced, "hopSize", hopSize, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate, "voiceVibrato", voiceVibrato, "voicingTolerance", voicingTolerance);
  algoPitchContoursMelody->input("contoursBins").set(input_contoursBins);
  algoPitchContoursMelody->input("contoursSaliences").set(input_contoursSaliences);
  algoPitchContoursMelody->input("contoursStartTimes").set(input_contoursStartTimes);
  algoPitchContoursMelody->input("duration").set(input_duration);
  algoPitchContoursMelody->output("pitch").set(output_pitch);
  algoPitchContoursMelody->output("pitchConfidence").set(output_pitchConfidence);
  algoPitchContoursMelody->compute();
  delete algoPitchContoursMelody;
}
 
// check https://essentia.upf.edu/reference/std_PitchContoursMonoMelody.html
void EssentiaJS::PitchContoursMonoMelody(std::vector<std::vector<float> >& input_contoursBins, std::vector<std::vector<float> >& input_contoursSaliences, std::vector<float>& input_contoursStartTimes, float input_duration, std::vector<float>& output_pitch, std::vector<float>& output_pitchConfidence, const float binResolution, const int filterIterations, const bool guessUnvoiced, const int hopSize, const float maxFrequency, const float minFrequency, const float referenceFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchContoursMonoMelody = factory.create("PitchContoursMonoMelody", "binResolution", binResolution, "filterIterations", filterIterations, "guessUnvoiced", guessUnvoiced, "hopSize", hopSize, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate);
  algoPitchContoursMonoMelody->input("contoursBins").set(input_contoursBins);
  algoPitchContoursMonoMelody->input("contoursSaliences").set(input_contoursSaliences);
  algoPitchContoursMonoMelody->input("contoursStartTimes").set(input_contoursStartTimes);
  algoPitchContoursMonoMelody->input("duration").set(input_duration);
  algoPitchContoursMonoMelody->output("pitch").set(output_pitch);
  algoPitchContoursMonoMelody->output("pitchConfidence").set(output_pitchConfidence);
  algoPitchContoursMonoMelody->compute();
  delete algoPitchContoursMonoMelody;
}
 
// check https://essentia.upf.edu/reference/std_PitchContoursMultiMelody.html
std::vector<std::vector<float> > EssentiaJS::PitchContoursMultiMelody(std::vector<std::vector<float> >& input_contoursBins, std::vector<std::vector<float> >& input_contoursSaliences, std::vector<float>& input_contoursStartTimes, float input_duration, const float binResolution, const int filterIterations, const bool guessUnvoiced, const int hopSize, const float maxFrequency, const float minFrequency, const float referenceFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchContoursMultiMelody = factory.create("PitchContoursMultiMelody", "binResolution", binResolution, "filterIterations", filterIterations, "guessUnvoiced", guessUnvoiced, "hopSize", hopSize, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate);
  algoPitchContoursMultiMelody->input("contoursBins").set(input_contoursBins);
  algoPitchContoursMultiMelody->input("contoursSaliences").set(input_contoursSaliences);
  algoPitchContoursMultiMelody->input("contoursStartTimes").set(input_contoursStartTimes);
  algoPitchContoursMultiMelody->input("duration").set(input_duration);
  std::vector<std::vector<float> > output_pitch;
  algoPitchContoursMultiMelody->output("pitch").set(output_pitch);
  algoPitchContoursMultiMelody->compute();
  delete algoPitchContoursMultiMelody;
  return output_pitch;
}
 
// check https://essentia.upf.edu/reference/std_PitchFilter.html
std::vector<float> EssentiaJS::PitchFilter(std::vector<float>& input_pitch, std::vector<float>& input_pitchConfidence, const int confidenceThreshold, const int minChunkSize, const bool useAbsolutePitchConfidence) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchFilter = factory.create("PitchFilter", "confidenceThreshold", confidenceThreshold, "minChunkSize", minChunkSize, "useAbsolutePitchConfidence", useAbsolutePitchConfidence);
  algoPitchFilter->input("pitch").set(input_pitch);
  algoPitchFilter->input("pitchConfidence").set(input_pitchConfidence);
  std::vector<float> output_pitchFiltered;
  algoPitchFilter->output("pitchFiltered").set(output_pitchFiltered);
  algoPitchFilter->compute();
  delete algoPitchFilter;
  return output_pitchFiltered;
}
 
// check https://essentia.upf.edu/reference/std_PitchSalience.html
float EssentiaJS::PitchSalience(std::vector<float>& input_spectrum, const float highBoundary, const float lowBoundary, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchSalience = factory.create("PitchSalience", "highBoundary", highBoundary, "lowBoundary", lowBoundary, "sampleRate", sampleRate);
  algoPitchSalience->input("spectrum").set(input_spectrum);
  float output_pitchSalience;
  algoPitchSalience->output("pitchSalience").set(output_pitchSalience);
  algoPitchSalience->compute();
  delete algoPitchSalience;
  return output_pitchSalience;
}
 
// check https://essentia.upf.edu/reference/std_PitchSalienceFunction.html
std::vector<float> EssentiaJS::PitchSalienceFunction(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, const float binResolution, const float harmonicWeight, const float magnitudeCompression, const float magnitudeThreshold, const int numberHarmonics, const float referenceFrequency) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchSalienceFunction = factory.create("PitchSalienceFunction", "binResolution", binResolution, "harmonicWeight", harmonicWeight, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "numberHarmonics", numberHarmonics, "referenceFrequency", referenceFrequency);
  algoPitchSalienceFunction->input("frequencies").set(input_frequencies);
  algoPitchSalienceFunction->input("magnitudes").set(input_magnitudes);
  std::vector<float> output_salienceFunction;
  algoPitchSalienceFunction->output("salienceFunction").set(output_salienceFunction);
  algoPitchSalienceFunction->compute();
  delete algoPitchSalienceFunction;
  return output_salienceFunction;
}
 
// check https://essentia.upf.edu/reference/std_PitchSalienceFunctionPeaks.html
void EssentiaJS::PitchSalienceFunctionPeaks(std::vector<float>& input_salienceFunction, std::vector<float>& output_salienceBins, std::vector<float>& output_salienceValues, const float binResolution, const float maxFrequency, const float minFrequency, const float referenceFrequency) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchSalienceFunctionPeaks = factory.create("PitchSalienceFunctionPeaks", "binResolution", binResolution, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "referenceFrequency", referenceFrequency);
  algoPitchSalienceFunctionPeaks->input("salienceFunction").set(input_salienceFunction);
  algoPitchSalienceFunctionPeaks->output("salienceBins").set(output_salienceBins);
  algoPitchSalienceFunctionPeaks->output("salienceValues").set(output_salienceValues);
  algoPitchSalienceFunctionPeaks->compute();
  delete algoPitchSalienceFunctionPeaks;
}
 
// check https://essentia.upf.edu/reference/std_PitchYin.html
void EssentiaJS::PitchYin(std::vector<float>& input_signal, float output_pitch, float output_pitchConfidence, const int frameSize, const bool interpolate, const float maxFrequency, const float minFrequency, const float sampleRate, const float tolerance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchYin = factory.create("PitchYin", "frameSize", frameSize, "interpolate", interpolate, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "sampleRate", sampleRate, "tolerance", tolerance);
  algoPitchYin->input("signal").set(input_signal);
  algoPitchYin->output("pitch").set(output_pitch);
  algoPitchYin->output("pitchConfidence").set(output_pitchConfidence);
  algoPitchYin->compute();
  delete algoPitchYin;
}
 
// check https://essentia.upf.edu/reference/std_PitchYinFFT.html
void EssentiaJS::PitchYinFFT(std::vector<float>& input_spectrum, float output_pitch, float output_pitchConfidence, const int frameSize, const bool interpolate, const float maxFrequency, const float minFrequency, const float sampleRate, const float tolerance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchYinFFT = factory.create("PitchYinFFT", "frameSize", frameSize, "interpolate", interpolate, "maxFrequency", maxFrequency, "minFrequency", minFrequency, "sampleRate", sampleRate, "tolerance", tolerance);
  algoPitchYinFFT->input("spectrum").set(input_spectrum);
  algoPitchYinFFT->output("pitch").set(output_pitch);
  algoPitchYinFFT->output("pitchConfidence").set(output_pitchConfidence);
  algoPitchYinFFT->compute();
  delete algoPitchYinFFT;
}
 
// check https://essentia.upf.edu/reference/std_PitchYinProbabilistic.html
void EssentiaJS::PitchYinProbabilistic(std::vector<float>& input_signal, std::vector<float>& output_pitch, std::vector<float>& output_voicedProbabilities, const int frameSize, const int hopSize, const float lowRMSThreshold, const std::string& outputUnvoiced, const bool preciseTime, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchYinProbabilistic = factory.create("PitchYinProbabilistic", "frameSize", frameSize, "hopSize", hopSize, "lowRMSThreshold", lowRMSThreshold, "outputUnvoiced", outputUnvoiced, "preciseTime", preciseTime, "sampleRate", sampleRate);
  algoPitchYinProbabilistic->input("signal").set(input_signal);
  algoPitchYinProbabilistic->output("pitch").set(output_pitch);
  algoPitchYinProbabilistic->output("voicedProbabilities").set(output_voicedProbabilities);
  algoPitchYinProbabilistic->compute();
  delete algoPitchYinProbabilistic;
}
 
// check https://essentia.upf.edu/reference/std_PitchYinProbabilities.html
void EssentiaJS::PitchYinProbabilities(std::vector<float>& input_signal, std::vector<float>& output_pitch, std::vector<float>& output_probabilities, float output_RMS, const int frameSize, const float lowAmp, const bool preciseTime, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchYinProbabilities = factory.create("PitchYinProbabilities", "frameSize", frameSize, "lowAmp", lowAmp, "preciseTime", preciseTime, "sampleRate", sampleRate);
  algoPitchYinProbabilities->input("signal").set(input_signal);
  algoPitchYinProbabilities->output("pitch").set(output_pitch);
  algoPitchYinProbabilities->output("probabilities").set(output_probabilities);
  algoPitchYinProbabilities->output("RMS").set(output_RMS);
  algoPitchYinProbabilities->compute();
  delete algoPitchYinProbabilities;
}
 
// check https://essentia.upf.edu/reference/std_PitchYinProbabilitiesHMM.html
std::vector<float> EssentiaJS::PitchYinProbabilitiesHMM(std::vector<std::vector<float> >& input_pitchCandidates, std::vector<std::vector<float> >& input_probabilities, const float minFrequency, const int numberBinsPerSemitone, const float selfTransition, const float yinTrust) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPitchYinProbabilitiesHMM = factory.create("PitchYinProbabilitiesHMM", "minFrequency", minFrequency, "numberBinsPerSemitone", numberBinsPerSemitone, "selfTransition", selfTransition, "yinTrust", yinTrust);
  algoPitchYinProbabilitiesHMM->input("pitchCandidates").set(input_pitchCandidates);
  algoPitchYinProbabilitiesHMM->input("probabilities").set(input_probabilities);
  std::vector<float> output_pitch;
  algoPitchYinProbabilitiesHMM->output("pitch").set(output_pitch);
  algoPitchYinProbabilitiesHMM->compute();
  delete algoPitchYinProbabilitiesHMM;
  return output_pitch;
}
 
// check https://essentia.upf.edu/reference/std_PolarToCartesian.html
std::vector<float> EssentiaJS::PolarToCartesian(std::vector<float>& input_magnitude, std::vector<float>& input_phase) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPolarToCartesian = factory.create("PolarToCartesian");
  algoPolarToCartesian->input("magnitude").set(input_magnitude);
  algoPolarToCartesian->input("phase").set(input_phase);
  std::vector<float> output_complex;
  algoPolarToCartesian->output("complex").set(output_complex);
  algoPolarToCartesian->compute();
  delete algoPolarToCartesian;
  return output_complex;
}
 
// check https://essentia.upf.edu/reference/std_PowerMean.html
float EssentiaJS::PowerMean(std::vector<float>& input_array, const float power) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPowerMean = factory.create("PowerMean", "power", power);
  algoPowerMean->input("array").set(input_array);
  float output_powerMean;
  algoPowerMean->output("powerMean").set(output_powerMean);
  algoPowerMean->compute();
  delete algoPowerMean;
  return output_powerMean;
}
 
// check https://essentia.upf.edu/reference/std_PowerSpectrum.html
std::vector<float> EssentiaJS::PowerSpectrum(std::vector<float>& input_signal, const int size) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoPowerSpectrum = factory.create("PowerSpectrum", "size", size);
  algoPowerSpectrum->input("signal").set(input_signal);
  std::vector<float> output_powerSpectrum;
  algoPowerSpectrum->output("powerSpectrum").set(output_powerSpectrum);
  algoPowerSpectrum->compute();
  delete algoPowerSpectrum;
  return output_powerSpectrum;
}
 
// check https://essentia.upf.edu/reference/std_RMS.html
float EssentiaJS::RMS(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoRMS = factory.create("RMS");
  algoRMS->input("array").set(input_array);
  float output_rms;
  algoRMS->output("rms").set(output_rms);
  algoRMS->compute();
  delete algoRMS;
  return output_rms;
}
 
// check https://essentia.upf.edu/reference/std_RawMoments.html
std::vector<float> EssentiaJS::RawMoments(std::vector<float>& input_array, const float range) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoRawMoments = factory.create("RawMoments", "range", range);
  algoRawMoments->input("array").set(input_array);
  std::vector<float> output_rawMoments;
  algoRawMoments->output("rawMoments").set(output_rawMoments);
  algoRawMoments->compute();
  delete algoRawMoments;
  return output_rawMoments;
}
 
// check https://essentia.upf.edu/reference/std_ReplayGain.html
float EssentiaJS::ReplayGain(std::vector<float>& input_signal, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoReplayGain = factory.create("ReplayGain", "sampleRate", sampleRate);
  algoReplayGain->input("signal").set(input_signal);
  float output_replayGain;
  algoReplayGain->output("replayGain").set(output_replayGain);
  algoReplayGain->compute();
  delete algoReplayGain;
  return output_replayGain;
}
 
// check https://essentia.upf.edu/reference/std_ResampleFFT.html
std::vector<float> EssentiaJS::ResampleFFT(std::vector<float>& input_input, const int inSize, const int outSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoResampleFFT = factory.create("ResampleFFT", "inSize", inSize, "outSize", outSize);
  algoResampleFFT->input("input").set(input_input);
  std::vector<float> output_output;
  algoResampleFFT->output("output").set(output_output);
  algoResampleFFT->compute();
  delete algoResampleFFT;
  return output_output;
}
 
// check https://essentia.upf.edu/reference/std_RhythmDescriptors.html
void EssentiaJS::RhythmDescriptors(std::vector<float>& input_signal, std::vector<float>& output_beats_position, float output_confidence, float output_bpm, std::vector<float>& output_bpm_estimates, std::vector<float>& output_bpm_intervals, float output_first_peak_bpm, float output_first_peak_spread, float output_first_peak_weight, float output_second_peak_bpm, float output_second_peak_spread, float output_second_peak_weight, std::vector<float>& output_histogram) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoRhythmDescriptors = factory.create("RhythmDescriptors");
  algoRhythmDescriptors->input("signal").set(input_signal);
  algoRhythmDescriptors->output("beats_position").set(output_beats_position);
  algoRhythmDescriptors->output("confidence").set(output_confidence);
  algoRhythmDescriptors->output("bpm").set(output_bpm);
  algoRhythmDescriptors->output("bpm_estimates").set(output_bpm_estimates);
  algoRhythmDescriptors->output("bpm_intervals").set(output_bpm_intervals);
  algoRhythmDescriptors->output("first_peak_bpm").set(output_first_peak_bpm);
  algoRhythmDescriptors->output("first_peak_spread").set(output_first_peak_spread);
  algoRhythmDescriptors->output("first_peak_weight").set(output_first_peak_weight);
  algoRhythmDescriptors->output("second_peak_bpm").set(output_second_peak_bpm);
  algoRhythmDescriptors->output("second_peak_spread").set(output_second_peak_spread);
  algoRhythmDescriptors->output("second_peak_weight").set(output_second_peak_weight);
  algoRhythmDescriptors->output("histogram").set(output_histogram);
  algoRhythmDescriptors->compute();
  delete algoRhythmDescriptors;
}
 
// check https://essentia.upf.edu/reference/std_RhythmExtractor.html
void EssentiaJS::RhythmExtractor(std::vector<float>& input_signal, float output_bpm, std::vector<float>& output_ticks, std::vector<float>& output_estimates, std::vector<float>& output_bpmIntervals, const int frameHop, const int frameSize, const int hopSize, const float lastBeatInterval, const int maxTempo, const int minTempo, const int numberFrames, const float sampleRate, const std::vector<float>& tempoHints, const float tolerance, const bool useBands, const bool useOnset) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoRhythmExtractor = factory.create("RhythmExtractor", "frameHop", frameHop, "frameSize", frameSize, "hopSize", hopSize, "lastBeatInterval", lastBeatInterval, "maxTempo", maxTempo, "minTempo", minTempo, "numberFrames", numberFrames, "sampleRate", sampleRate, "tempoHints", tempoHints, "tolerance", tolerance, "useBands", useBands, "useOnset", useOnset);
  algoRhythmExtractor->input("signal").set(input_signal);
  algoRhythmExtractor->output("bpm").set(output_bpm);
  algoRhythmExtractor->output("ticks").set(output_ticks);
  algoRhythmExtractor->output("estimates").set(output_estimates);
  algoRhythmExtractor->output("bpmIntervals").set(output_bpmIntervals);
  algoRhythmExtractor->compute();
  delete algoRhythmExtractor;
}
 
// check https://essentia.upf.edu/reference/std_RhythmExtractor2013.html
void EssentiaJS::RhythmExtractor2013(std::vector<float>& input_signal, float output_bpm, std::vector<float>& output_ticks, float output_confidence, std::vector<float>& output_estimates, std::vector<float>& output_bpmIntervals, const int maxTempo, const std::string& method, const int minTempo) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoRhythmExtractor2013 = factory.create("RhythmExtractor2013", "maxTempo", maxTempo, "method", method, "minTempo", minTempo);
  algoRhythmExtractor2013->input("signal").set(input_signal);
  algoRhythmExtractor2013->output("bpm").set(output_bpm);
  algoRhythmExtractor2013->output("ticks").set(output_ticks);
  algoRhythmExtractor2013->output("confidence").set(output_confidence);
  algoRhythmExtractor2013->output("estimates").set(output_estimates);
  algoRhythmExtractor2013->output("bpmIntervals").set(output_bpmIntervals);
  algoRhythmExtractor2013->compute();
  delete algoRhythmExtractor2013;
}
 
// check https://essentia.upf.edu/reference/std_RhythmTransform.html
std::vector<std::vector<float> > EssentiaJS::RhythmTransform(std::vector<std::vector<float> >& input_melBands, const int frameSize, const int hopSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoRhythmTransform = factory.create("RhythmTransform", "frameSize", frameSize, "hopSize", hopSize);
  algoRhythmTransform->input("melBands").set(input_melBands);
  std::vector<std::vector<float> > output_rhythm;
  algoRhythmTransform->output("rhythm").set(output_rhythm);
  algoRhythmTransform->compute();
  delete algoRhythmTransform;
  return output_rhythm;
}
 
// check https://essentia.upf.edu/reference/std_RollOff.html
float EssentiaJS::RollOff(std::vector<float>& input_spectrum, const float cutoff, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoRollOff = factory.create("RollOff", "cutoff", cutoff, "sampleRate", sampleRate);
  algoRollOff->input("spectrum").set(input_spectrum);
  float output_rollOff;
  algoRollOff->output("rollOff").set(output_rollOff);
  algoRollOff->compute();
  delete algoRollOff;
  return output_rollOff;
}
 
// check https://essentia.upf.edu/reference/std_SBic.html
std::vector<float> EssentiaJS::SBic(std::vector<float>& input_features, const float cpw, const int inc1, const int inc2, const int minLength, const int size1, const int size2) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSBic = factory.create("SBic", "cpw", cpw, "inc1", inc1, "inc2", inc2, "minLength", minLength, "size1", size1, "size2", size2);
  algoSBic->input("features").set(input_features);
  std::vector<float> output_segmentation;
  algoSBic->output("segmentation").set(output_segmentation);
  algoSBic->compute();
  delete algoSBic;
  return output_segmentation;
}
 
// check https://essentia.upf.edu/reference/std_SNR.html
void EssentiaJS::SNR(std::vector<float>& input_frame, float output_instantSNR, float output_averagedSNR, std::vector<float>& output_spectralSNR, const float MAAlpha, const float MMSEAlpha, const float NoiseAlpha, const int frameSize, const float noiseThreshold, const float sampleRate, const bool useBroadbadNoiseCorrection) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSNR = factory.create("SNR", "MAAlpha", MAAlpha, "MMSEAlpha", MMSEAlpha, "NoiseAlpha", NoiseAlpha, "frameSize", frameSize, "noiseThreshold", noiseThreshold, "sampleRate", sampleRate, "useBroadbadNoiseCorrection", useBroadbadNoiseCorrection);
  algoSNR->input("frame").set(input_frame);
  algoSNR->output("instantSNR").set(output_instantSNR);
  algoSNR->output("averagedSNR").set(output_averagedSNR);
  algoSNR->output("spectralSNR").set(output_spectralSNR);
  algoSNR->compute();
  delete algoSNR;
}
 
// check https://essentia.upf.edu/reference/std_SaturationDetector.html
void EssentiaJS::SaturationDetector(std::vector<float>& input_frame, std::vector<float>& output_starts, std::vector<float>& output_ends, const float differentialThreshold, const float energyThreshold, const int frameSize, const int hopSize, const float minimumDuration, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSaturationDetector = factory.create("SaturationDetector", "differentialThreshold", differentialThreshold, "energyThreshold", energyThreshold, "frameSize", frameSize, "hopSize", hopSize, "minimumDuration", minimumDuration, "sampleRate", sampleRate);
  algoSaturationDetector->input("frame").set(input_frame);
  algoSaturationDetector->output("starts").set(output_starts);
  algoSaturationDetector->output("ends").set(output_ends);
  algoSaturationDetector->compute();
  delete algoSaturationDetector;
}
 
// check https://essentia.upf.edu/reference/std_Scale.html
std::vector<float> EssentiaJS::Scale(std::vector<float>& input_signal, const bool clipping, const float factor, const float maxAbsValue) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoScale = factory.create("Scale", "clipping", clipping, "factor", factor, "maxAbsValue", maxAbsValue);
  algoScale->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoScale->output("signal").set(output_signal);
  algoScale->compute();
  delete algoScale;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_SineModelAnal.html
void EssentiaJS::SineModelAnal(std::vector<float>& input_fft, std::vector<float>& output_frequencies, std::vector<float>& output_magnitudes, std::vector<float>& output_phases, const float freqDevOffset, const float freqDevSlope, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const std::string& orderBy, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSineModelAnal = factory.create("SineModelAnal", "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "orderBy", orderBy, "sampleRate", sampleRate);
  algoSineModelAnal->input("fft").set(input_fft);
  algoSineModelAnal->output("frequencies").set(output_frequencies);
  algoSineModelAnal->output("magnitudes").set(output_magnitudes);
  algoSineModelAnal->output("phases").set(output_phases);
  algoSineModelAnal->compute();
  delete algoSineModelAnal;
}
 
// check https://essentia.upf.edu/reference/std_SineModelSynth.html
std::vector<float> EssentiaJS::SineModelSynth(std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases, const int fftSize, const int hopSize, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSineModelSynth = factory.create("SineModelSynth", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate);
  algoSineModelSynth->input("magnitudes").set(input_magnitudes);
  algoSineModelSynth->input("frequencies").set(input_frequencies);
  algoSineModelSynth->input("phases").set(input_phases);
  std::vector<float> output_fft;
  algoSineModelSynth->output("fft").set(output_fft);
  algoSineModelSynth->compute();
  delete algoSineModelSynth;
  return output_fft;
}
 
// check https://essentia.upf.edu/reference/std_SineSubtraction.html
std::vector<float> EssentiaJS::SineSubtraction(std::vector<float>& input_frame, std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases, const int fftSize, const int hopSize, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSineSubtraction = factory.create("SineSubtraction", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate);
  algoSineSubtraction->input("frame").set(input_frame);
  algoSineSubtraction->input("magnitudes").set(input_magnitudes);
  algoSineSubtraction->input("frequencies").set(input_frequencies);
  algoSineSubtraction->input("phases").set(input_phases);
  std::vector<float> output_frame;
  algoSineSubtraction->output("frame").set(output_frame);
  algoSineSubtraction->compute();
  delete algoSineSubtraction;
  return output_frame;
}
 
// check https://essentia.upf.edu/reference/std_SingleBeatLoudness.html
void EssentiaJS::SingleBeatLoudness(std::vector<float>& input_beat, float output_loudness, std::vector<float>& output_loudnessBandRatio, const float beatDuration, const float beatWindowDuration, const std::vector<float>& frequencyBands, const std::string& onsetStart, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSingleBeatLoudness = factory.create("SingleBeatLoudness", "beatDuration", beatDuration, "beatWindowDuration", beatWindowDuration, "frequencyBands", frequencyBands, "onsetStart", onsetStart, "sampleRate", sampleRate);
  algoSingleBeatLoudness->input("beat").set(input_beat);
  algoSingleBeatLoudness->output("loudness").set(output_loudness);
  algoSingleBeatLoudness->output("loudnessBandRatio").set(output_loudnessBandRatio);
  algoSingleBeatLoudness->compute();
  delete algoSingleBeatLoudness;
}
 
// check https://essentia.upf.edu/reference/std_SingleGaussian.html
void EssentiaJS::SingleGaussian(std::vector<float>& input_matrix, std::vector<float>& output_mean, std::vector<float>& output_covariance, std::vector<float>& output_inverseCovariance) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSingleGaussian = factory.create("SingleGaussian");
  algoSingleGaussian->input("matrix").set(input_matrix);
  algoSingleGaussian->output("mean").set(output_mean);
  algoSingleGaussian->output("covariance").set(output_covariance);
  algoSingleGaussian->output("inverseCovariance").set(output_inverseCovariance);
  algoSingleGaussian->compute();
  delete algoSingleGaussian;
}
 
// check https://essentia.upf.edu/reference/std_Slicer.html
std::vector<std::vector<float> > EssentiaJS::Slicer(std::vector<float>& input_audio, const std::vector<float>& endTimes, const float sampleRate, const std::vector<float>& startTimes, const std::string& timeUnits) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSlicer = factory.create("Slicer", "endTimes", endTimes, "sampleRate", sampleRate, "startTimes", startTimes, "timeUnits", timeUnits);
  algoSlicer->input("audio").set(input_audio);
  std::vector<std::vector<float> > output_frame;
  algoSlicer->output("frame").set(output_frame);
  algoSlicer->compute();
  delete algoSlicer;
  return output_frame;
}
 
// check https://essentia.upf.edu/reference/std_SpectralCentroidTime.html
float EssentiaJS::SpectralCentroidTime(std::vector<float>& input_array, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectralCentroidTime = factory.create("SpectralCentroidTime", "sampleRate", sampleRate);
  algoSpectralCentroidTime->input("array").set(input_array);
  float output_centroid;
  algoSpectralCentroidTime->output("centroid").set(output_centroid);
  algoSpectralCentroidTime->compute();
  delete algoSpectralCentroidTime;
  return output_centroid;
}
 
// check https://essentia.upf.edu/reference/std_SpectralComplexity.html
float EssentiaJS::SpectralComplexity(std::vector<float>& input_spectrum, const float magnitudeThreshold, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectralComplexity = factory.create("SpectralComplexity", "magnitudeThreshold", magnitudeThreshold, "sampleRate", sampleRate);
  algoSpectralComplexity->input("spectrum").set(input_spectrum);
  float output_spectralComplexity;
  algoSpectralComplexity->output("spectralComplexity").set(output_spectralComplexity);
  algoSpectralComplexity->compute();
  delete algoSpectralComplexity;
  return output_spectralComplexity;
}
 
// check https://essentia.upf.edu/reference/std_SpectralContrast.html
void EssentiaJS::SpectralContrast(std::vector<float>& input_spectrum, std::vector<float>& output_spectralContrast, std::vector<float>& output_spectralValley, const int frameSize, const float highFrequencyBound, const float lowFrequencyBound, const float neighbourRatio, const int numberBands, const float sampleRate, const float staticDistribution) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectralContrast = factory.create("SpectralContrast", "frameSize", frameSize, "highFrequencyBound", highFrequencyBound, "lowFrequencyBound", lowFrequencyBound, "neighbourRatio", neighbourRatio, "numberBands", numberBands, "sampleRate", sampleRate, "staticDistribution", staticDistribution);
  algoSpectralContrast->input("spectrum").set(input_spectrum);
  algoSpectralContrast->output("spectralContrast").set(output_spectralContrast);
  algoSpectralContrast->output("spectralValley").set(output_spectralValley);
  algoSpectralContrast->compute();
  delete algoSpectralContrast;
}
 
// check https://essentia.upf.edu/reference/std_SpectralPeaks.html
void EssentiaJS::SpectralPeaks(std::vector<float>& input_spectrum, std::vector<float>& output_frequencies, std::vector<float>& output_magnitudes, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const float minFrequency, const std::string& orderBy, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectralPeaks = factory.create("SpectralPeaks", "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "minFrequency", minFrequency, "orderBy", orderBy, "sampleRate", sampleRate);
  algoSpectralPeaks->input("spectrum").set(input_spectrum);
  algoSpectralPeaks->output("frequencies").set(output_frequencies);
  algoSpectralPeaks->output("magnitudes").set(output_magnitudes);
  algoSpectralPeaks->compute();
  delete algoSpectralPeaks;
}
 
// check https://essentia.upf.edu/reference/std_SpectralWhitening.html
std::vector<float> EssentiaJS::SpectralWhitening(std::vector<float>& input_spectrum, std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, const float maxFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectralWhitening = factory.create("SpectralWhitening", "maxFrequency", maxFrequency, "sampleRate", sampleRate);
  algoSpectralWhitening->input("spectrum").set(input_spectrum);
  algoSpectralWhitening->input("frequencies").set(input_frequencies);
  algoSpectralWhitening->input("magnitudes").set(input_magnitudes);
  std::vector<float> output_magnitudes;
  algoSpectralWhitening->output("magnitudes").set(output_magnitudes);
  algoSpectralWhitening->compute();
  delete algoSpectralWhitening;
  return output_magnitudes;
}
 
// check https://essentia.upf.edu/reference/std_Spectrum.html
std::vector<float> EssentiaJS::Spectrum(std::vector<float>& input_frame, const int size) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectrum = factory.create("Spectrum", "size", size);
  algoSpectrum->input("frame").set(input_frame);
  std::vector<float> output_spectrum;
  algoSpectrum->output("spectrum").set(output_spectrum);
  algoSpectrum->compute();
  delete algoSpectrum;
  return output_spectrum;
}
 
// check https://essentia.upf.edu/reference/std_SpectrumCQ.html
std::vector<float> EssentiaJS::SpectrumCQ(std::vector<float>& input_frame, const int binsPerOctave, const float minFrequency, const int minimumKernelSize, const int numberBins, const float sampleRate, const float scale, const float threshold, const std::string& windowType, const bool zeroPhase) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectrumCQ = factory.create("SpectrumCQ", "binsPerOctave", binsPerOctave, "minFrequency", minFrequency, "minimumKernelSize", minimumKernelSize, "numberBins", numberBins, "sampleRate", sampleRate, "scale", scale, "threshold", threshold, "windowType", windowType, "zeroPhase", zeroPhase);
  algoSpectrumCQ->input("frame").set(input_frame);
  std::vector<float> output_spectrumCQ;
  algoSpectrumCQ->output("spectrumCQ").set(output_spectrumCQ);
  algoSpectrumCQ->compute();
  delete algoSpectrumCQ;
  return output_spectrumCQ;
}
 
// check https://essentia.upf.edu/reference/std_SpectrumToCent.html
void EssentiaJS::SpectrumToCent(std::vector<float>& input_spectrum, std::vector<float>& output_bands, std::vector<float>& output_frequencies, const int bands, const float centBinResolution, const int inputSize, const bool log, const float minimumFrequency, const std::string& normalize, const float sampleRate, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpectrumToCent = factory.create("SpectrumToCent", "bands", bands, "centBinResolution", centBinResolution, "inputSize", inputSize, "log", log, "minimumFrequency", minimumFrequency, "normalize", normalize, "sampleRate", sampleRate, "type", type);
  algoSpectrumToCent->input("spectrum").set(input_spectrum);
  algoSpectrumToCent->output("bands").set(output_bands);
  algoSpectrumToCent->output("frequencies").set(output_frequencies);
  algoSpectrumToCent->compute();
  delete algoSpectrumToCent;
}
 
// check https://essentia.upf.edu/reference/std_Spline.html
float EssentiaJS::Spline(float input_x, const float beta1, const float beta2, const std::string& type, const std::vector<float>& xPoints, const std::vector<float>& yPoints) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpline = factory.create("Spline", "beta1", beta1, "beta2", beta2, "type", type, "xPoints", xPoints, "yPoints", yPoints);
  algoSpline->input("x").set(input_x);
  float output_y;
  algoSpline->output("y").set(output_y);
  algoSpline->compute();
  delete algoSpline;
  return output_y;
}
 
// check https://essentia.upf.edu/reference/std_SprModelAnal.html
void EssentiaJS::SprModelAnal(std::vector<float>& input_frame, std::vector<float>& output_frequencies, std::vector<float>& output_magnitudes, std::vector<float>& output_phases, std::vector<float>& output_res, const int fftSize, const int freqDevOffset, const float freqDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const std::string& orderBy, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSprModelAnal = factory.create("SprModelAnal", "fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "orderBy", orderBy, "sampleRate", sampleRate);
  algoSprModelAnal->input("frame").set(input_frame);
  algoSprModelAnal->output("frequencies").set(output_frequencies);
  algoSprModelAnal->output("magnitudes").set(output_magnitudes);
  algoSprModelAnal->output("phases").set(output_phases);
  algoSprModelAnal->output("res").set(output_res);
  algoSprModelAnal->compute();
  delete algoSprModelAnal;
}
 
// check https://essentia.upf.edu/reference/std_SprModelSynth.html
void EssentiaJS::SprModelSynth(std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases, std::vector<float>& input_res, std::vector<float>& output_frame, std::vector<float>& output_sineframe, std::vector<float>& output_resframe, const int fftSize, const int hopSize, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSprModelSynth = factory.create("SprModelSynth", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate);
  algoSprModelSynth->input("magnitudes").set(input_magnitudes);
  algoSprModelSynth->input("frequencies").set(input_frequencies);
  algoSprModelSynth->input("phases").set(input_phases);
  algoSprModelSynth->input("res").set(input_res);
  algoSprModelSynth->output("frame").set(output_frame);
  algoSprModelSynth->output("sineframe").set(output_sineframe);
  algoSprModelSynth->output("resframe").set(output_resframe);
  algoSprModelSynth->compute();
  delete algoSprModelSynth;
}
 
// check https://essentia.upf.edu/reference/std_SpsModelAnal.html
void EssentiaJS::SpsModelAnal(std::vector<float>& input_frame, std::vector<float>& output_frequencies, std::vector<float>& output_magnitudes, std::vector<float>& output_phases, std::vector<float>& output_stocenv, const int fftSize, const int freqDevOffset, const float freqDevSlope, const int hopSize, const float magnitudeThreshold, const float maxFrequency, const int maxPeaks, const int maxnSines, const float minFrequency, const std::string& orderBy, const float sampleRate, const float stocf) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpsModelAnal = factory.create("SpsModelAnal", "fftSize", fftSize, "freqDevOffset", freqDevOffset, "freqDevSlope", freqDevSlope, "hopSize", hopSize, "magnitudeThreshold", magnitudeThreshold, "maxFrequency", maxFrequency, "maxPeaks", maxPeaks, "maxnSines", maxnSines, "minFrequency", minFrequency, "orderBy", orderBy, "sampleRate", sampleRate, "stocf", stocf);
  algoSpsModelAnal->input("frame").set(input_frame);
  algoSpsModelAnal->output("frequencies").set(output_frequencies);
  algoSpsModelAnal->output("magnitudes").set(output_magnitudes);
  algoSpsModelAnal->output("phases").set(output_phases);
  algoSpsModelAnal->output("stocenv").set(output_stocenv);
  algoSpsModelAnal->compute();
  delete algoSpsModelAnal;
}
 
// check https://essentia.upf.edu/reference/std_SpsModelSynth.html
void EssentiaJS::SpsModelSynth(std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases, std::vector<float>& input_stocenv, std::vector<float>& output_frame, std::vector<float>& output_sineframe, std::vector<float>& output_stocframe, const int fftSize, const int hopSize, const float sampleRate, const float stocf) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSpsModelSynth = factory.create("SpsModelSynth", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate, "stocf", stocf);
  algoSpsModelSynth->input("magnitudes").set(input_magnitudes);
  algoSpsModelSynth->input("frequencies").set(input_frequencies);
  algoSpsModelSynth->input("phases").set(input_phases);
  algoSpsModelSynth->input("stocenv").set(input_stocenv);
  algoSpsModelSynth->output("frame").set(output_frame);
  algoSpsModelSynth->output("sineframe").set(output_sineframe);
  algoSpsModelSynth->output("stocframe").set(output_stocframe);
  algoSpsModelSynth->compute();
  delete algoSpsModelSynth;
}
 
// check https://essentia.upf.edu/reference/std_StartStopCut.html
void EssentiaJS::StartStopCut(std::vector<float>& input_audio, int output_startCut, int output_stopCut, const int frameSize, const int hopSize, const float maximumStartTime, const float maximumStopTime, const float sampleRate, const int threshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoStartStopCut = factory.create("StartStopCut", "frameSize", frameSize, "hopSize", hopSize, "maximumStartTime", maximumStartTime, "maximumStopTime", maximumStopTime, "sampleRate", sampleRate, "threshold", threshold);
  algoStartStopCut->input("audio").set(input_audio);
  algoStartStopCut->output("startCut").set(output_startCut);
  algoStartStopCut->output("stopCut").set(output_stopCut);
  algoStartStopCut->compute();
  delete algoStartStopCut;
}
 
// check https://essentia.upf.edu/reference/std_StartStopSilence.html
void EssentiaJS::StartStopSilence(std::vector<float>& input_frame, int output_startFrame, int output_stopFrame, const int threshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoStartStopSilence = factory.create("StartStopSilence", "threshold", threshold);
  algoStartStopSilence->input("frame").set(input_frame);
  algoStartStopSilence->output("startFrame").set(output_startFrame);
  algoStartStopSilence->output("stopFrame").set(output_stopFrame);
  algoStartStopSilence->compute();
  delete algoStartStopSilence;
}
 
// check https://essentia.upf.edu/reference/std_StereoDemuxer.html
void EssentiaJS::StereoDemuxer(std::vector<std::vector<float> >& input_audio, std::vector<float>& output_left, std::vector<float>& output_right) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoStereoDemuxer = factory.create("StereoDemuxer");
  algoStereoDemuxer->input("audio").set(input_audio);
  algoStereoDemuxer->output("left").set(output_left);
  algoStereoDemuxer->output("right").set(output_right);
  algoStereoDemuxer->compute();
  delete algoStereoDemuxer;
}
 
// check https://essentia.upf.edu/reference/std_StereoMuxer.html
std::vector<std::vector<float> > EssentiaJS::StereoMuxer(std::vector<float>& input_left, std::vector<float>& input_right) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoStereoMuxer = factory.create("StereoMuxer");
  algoStereoMuxer->input("left").set(input_left);
  algoStereoMuxer->input("right").set(input_right);
  std::vector<std::vector<float> > output_audio;
  algoStereoMuxer->output("audio").set(output_audio);
  algoStereoMuxer->compute();
  delete algoStereoMuxer;
  return output_audio;
}
 
// check https://essentia.upf.edu/reference/std_StereoTrimmer.html
std::vector<std::vector<float> > EssentiaJS::StereoTrimmer(std::vector<std::vector<float> >& input_signal, const bool checkRange, const float endTime, const float sampleRate, const float startTime) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoStereoTrimmer = factory.create("StereoTrimmer", "checkRange", checkRange, "endTime", endTime, "sampleRate", sampleRate, "startTime", startTime);
  algoStereoTrimmer->input("signal").set(input_signal);
  std::vector<std::vector<float> > output_signal;
  algoStereoTrimmer->output("signal").set(output_signal);
  algoStereoTrimmer->compute();
  delete algoStereoTrimmer;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_StochasticModelAnal.html
std::vector<float> EssentiaJS::StochasticModelAnal(std::vector<float>& input_frame, const int fftSize, const int hopSize, const float sampleRate, const float stocf) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoStochasticModelAnal = factory.create("StochasticModelAnal", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate, "stocf", stocf);
  algoStochasticModelAnal->input("frame").set(input_frame);
  std::vector<float> output_stocenv;
  algoStochasticModelAnal->output("stocenv").set(output_stocenv);
  algoStochasticModelAnal->compute();
  delete algoStochasticModelAnal;
  return output_stocenv;
}
 
// check https://essentia.upf.edu/reference/std_StochasticModelSynth.html
std::vector<float> EssentiaJS::StochasticModelSynth(std::vector<float>& input_stocenv, const int fftSize, const int hopSize, const float sampleRate, const float stocf) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoStochasticModelSynth = factory.create("StochasticModelSynth", "fftSize", fftSize, "hopSize", hopSize, "sampleRate", sampleRate, "stocf", stocf);
  algoStochasticModelSynth->input("stocenv").set(input_stocenv);
  std::vector<float> output_frame;
  algoStochasticModelSynth->output("frame").set(output_frame);
  algoStochasticModelSynth->compute();
  delete algoStochasticModelSynth;
  return output_frame;
}
 
// check https://essentia.upf.edu/reference/std_StrongDecay.html
float EssentiaJS::StrongDecay(std::vector<float>& input_signal, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoStrongDecay = factory.create("StrongDecay", "sampleRate", sampleRate);
  algoStrongDecay->input("signal").set(input_signal);
  float output_strongDecay;
  algoStrongDecay->output("strongDecay").set(output_strongDecay);
  algoStrongDecay->compute();
  delete algoStrongDecay;
  return output_strongDecay;
}
 
// check https://essentia.upf.edu/reference/std_StrongPeak.html
float EssentiaJS::StrongPeak(std::vector<float>& input_spectrum) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoStrongPeak = factory.create("StrongPeak");
  algoStrongPeak->input("spectrum").set(input_spectrum);
  float output_strongPeak;
  algoStrongPeak->output("strongPeak").set(output_strongPeak);
  algoStrongPeak->compute();
  delete algoStrongPeak;
  return output_strongPeak;
}
 
// check https://essentia.upf.edu/reference/std_SuperFluxExtractor.html
std::vector<float> EssentiaJS::SuperFluxExtractor(std::vector<float>& input_signal, const float combine, const int frameSize, const int hopSize, const float ratioThreshold, const float sampleRate, const float threshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSuperFluxExtractor = factory.create("SuperFluxExtractor", "combine", combine, "frameSize", frameSize, "hopSize", hopSize, "ratioThreshold", ratioThreshold, "sampleRate", sampleRate, "threshold", threshold);
  algoSuperFluxExtractor->input("signal").set(input_signal);
  std::vector<float> output_onsets;
  algoSuperFluxExtractor->output("onsets").set(output_onsets);
  algoSuperFluxExtractor->compute();
  delete algoSuperFluxExtractor;
  return output_onsets;
}
 
// check https://essentia.upf.edu/reference/std_SuperFluxNovelty.html
float EssentiaJS::SuperFluxNovelty(std::vector<std::vector<float> >& input_bands, const int binWidth, const int frameWidth) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSuperFluxNovelty = factory.create("SuperFluxNovelty", "binWidth", binWidth, "frameWidth", frameWidth);
  algoSuperFluxNovelty->input("bands").set(input_bands);
  float output_differences;
  algoSuperFluxNovelty->output("differences").set(output_differences);
  algoSuperFluxNovelty->compute();
  delete algoSuperFluxNovelty;
  return output_differences;
}
 
// check https://essentia.upf.edu/reference/std_SuperFluxPeaks.html
std::vector<float> EssentiaJS::SuperFluxPeaks(std::vector<float>& input_novelty, const float combine, const float frameRate, const float pre_avg, const float pre_max, const float ratioThreshold, const float threshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoSuperFluxPeaks = factory.create("SuperFluxPeaks", "combine", combine, "frameRate", frameRate, "pre_avg", pre_avg, "pre_max", pre_max, "ratioThreshold", ratioThreshold, "threshold", threshold);
  algoSuperFluxPeaks->input("novelty").set(input_novelty);
  std::vector<float> output_peaks;
  algoSuperFluxPeaks->output("peaks").set(output_peaks);
  algoSuperFluxPeaks->compute();
  delete algoSuperFluxPeaks;
  return output_peaks;
}
 
// check https://essentia.upf.edu/reference/std_TCToTotal.html
float EssentiaJS::TCToTotal(std::vector<float>& input_envelope) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTCToTotal = factory.create("TCToTotal");
  algoTCToTotal->input("envelope").set(input_envelope);
  float output_TCToTotal;
  algoTCToTotal->output("TCToTotal").set(output_TCToTotal);
  algoTCToTotal->compute();
  delete algoTCToTotal;
  return output_TCToTotal;
}
 
// check https://essentia.upf.edu/reference/std_TempoScaleBands.html
void EssentiaJS::TempoScaleBands(std::vector<float>& input_bands, std::vector<float>& output_scaledBands, float output_cumulativeBands, const std::vector<float>& bandsGain, const float frameTime) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTempoScaleBands = factory.create("TempoScaleBands", "bandsGain", bandsGain, "frameTime", frameTime);
  algoTempoScaleBands->input("bands").set(input_bands);
  algoTempoScaleBands->output("scaledBands").set(output_scaledBands);
  algoTempoScaleBands->output("cumulativeBands").set(output_cumulativeBands);
  algoTempoScaleBands->compute();
  delete algoTempoScaleBands;
}
 
// check https://essentia.upf.edu/reference/std_TempoTap.html
void EssentiaJS::TempoTap(std::vector<float>& input_featuresFrame, std::vector<float>& output_periods, std::vector<float>& output_phases, const int frameHop, const int frameSize, const int maxTempo, const int minTempo, const int numberFrames, const float sampleRate, const std::vector<float>& tempoHints) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTempoTap = factory.create("TempoTap", "frameHop", frameHop, "frameSize", frameSize, "maxTempo", maxTempo, "minTempo", minTempo, "numberFrames", numberFrames, "sampleRate", sampleRate, "tempoHints", tempoHints);
  algoTempoTap->input("featuresFrame").set(input_featuresFrame);
  algoTempoTap->output("periods").set(output_periods);
  algoTempoTap->output("phases").set(output_phases);
  algoTempoTap->compute();
  delete algoTempoTap;
}
 
// check https://essentia.upf.edu/reference/std_TempoTapDegara.html
std::vector<float> EssentiaJS::TempoTapDegara(std::vector<float>& input_onsetDetections, const int maxTempo, const int minTempo, const std::string& resample, const float sampleRateODF) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTempoTapDegara = factory.create("TempoTapDegara", "maxTempo", maxTempo, "minTempo", minTempo, "resample", resample, "sampleRateODF", sampleRateODF);
  algoTempoTapDegara->input("onsetDetections").set(input_onsetDetections);
  std::vector<float> output_ticks;
  algoTempoTapDegara->output("ticks").set(output_ticks);
  algoTempoTapDegara->compute();
  delete algoTempoTapDegara;
  return output_ticks;
}
 
// check https://essentia.upf.edu/reference/std_TempoTapMaxAgreement.html
void EssentiaJS::TempoTapMaxAgreement(std::vector<std::vector<float> >& input_tickCandidates, std::vector<float>& output_ticks, float output_confidence) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTempoTapMaxAgreement = factory.create("TempoTapMaxAgreement");
  algoTempoTapMaxAgreement->input("tickCandidates").set(input_tickCandidates);
  algoTempoTapMaxAgreement->output("ticks").set(output_ticks);
  algoTempoTapMaxAgreement->output("confidence").set(output_confidence);
  algoTempoTapMaxAgreement->compute();
  delete algoTempoTapMaxAgreement;
}
 
// check https://essentia.upf.edu/reference/std_TempoTapTicks.html
void EssentiaJS::TempoTapTicks(std::vector<float>& input_periods, std::vector<float>& input_phases, std::vector<float>& output_ticks, std::vector<float>& output_matchingPeriods, const int frameHop, const int hopSize, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTempoTapTicks = factory.create("TempoTapTicks", "frameHop", frameHop, "hopSize", hopSize, "sampleRate", sampleRate);
  algoTempoTapTicks->input("periods").set(input_periods);
  algoTempoTapTicks->input("phases").set(input_phases);
  algoTempoTapTicks->output("ticks").set(output_ticks);
  algoTempoTapTicks->output("matchingPeriods").set(output_matchingPeriods);
  algoTempoTapTicks->compute();
  delete algoTempoTapTicks;
}
 
// check https://essentia.upf.edu/reference/std_TensorflowInputMusiCNN.html
std::vector<float> EssentiaJS::TensorflowInputMusiCNN(std::vector<float>& input_frame) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTensorflowInputMusiCNN = factory.create("TensorflowInputMusiCNN");
  algoTensorflowInputMusiCNN->input("frame").set(input_frame);
  std::vector<float> output_bands;
  algoTensorflowInputMusiCNN->output("bands").set(output_bands);
  algoTensorflowInputMusiCNN->compute();
  delete algoTensorflowInputMusiCNN;
  return output_bands;
}
 
// check https://essentia.upf.edu/reference/std_TensorflowInputVGGish.html
std::vector<float> EssentiaJS::TensorflowInputVGGish(std::vector<float>& input_frame) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTensorflowInputVGGish = factory.create("TensorflowInputVGGish");
  algoTensorflowInputVGGish->input("frame").set(input_frame);
  std::vector<float> output_bands;
  algoTensorflowInputVGGish->output("bands").set(output_bands);
  algoTensorflowInputVGGish->compute();
  delete algoTensorflowInputVGGish;
  return output_bands;
}
 
// check https://essentia.upf.edu/reference/std_TonalExtractor.html
void EssentiaJS::TonalExtractor(std::vector<float>& input_signal, float output_chords_changes_rate, std::vector<float>& output_chords_histogram, std::string output_chords_key, float output_chords_number_rate, std::vector<std::string> output_chords_progression, std::string output_chords_scale, std::vector<float>& output_chords_strength, std::vector<std::vector<float> >& output_hpcp, std::vector<std::vector<float> >& output_hpcp_highres, std::string output_key_key, std::string output_key_scale, float output_key_strength, const int frameSize, const int hopSize, const float tuningFrequency) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTonalExtractor = factory.create("TonalExtractor", "frameSize", frameSize, "hopSize", hopSize, "tuningFrequency", tuningFrequency);
  algoTonalExtractor->input("signal").set(input_signal);
  algoTonalExtractor->output("chords_changes_rate").set(output_chords_changes_rate);
  algoTonalExtractor->output("chords_histogram").set(output_chords_histogram);
  algoTonalExtractor->output("chords_key").set(output_chords_key);
  algoTonalExtractor->output("chords_number_rate").set(output_chords_number_rate);
  algoTonalExtractor->output("chords_progression").set(output_chords_progression);
  algoTonalExtractor->output("chords_scale").set(output_chords_scale);
  algoTonalExtractor->output("chords_strength").set(output_chords_strength);
  algoTonalExtractor->output("hpcp").set(output_hpcp);
  algoTonalExtractor->output("hpcp_highres").set(output_hpcp_highres);
  algoTonalExtractor->output("key_key").set(output_key_key);
  algoTonalExtractor->output("key_scale").set(output_key_scale);
  algoTonalExtractor->output("key_strength").set(output_key_strength);
  algoTonalExtractor->compute();
  delete algoTonalExtractor;
}
 
// check https://essentia.upf.edu/reference/std_TonicIndianArtMusic.html
float EssentiaJS::TonicIndianArtMusic(std::vector<float>& input_signal, const float binResolution, const int frameSize, const float harmonicWeight, const int hopSize, const float magnitudeCompression, const float magnitudeThreshold, const float maxTonicFrequency, const float minTonicFrequency, const int numberHarmonics, const int numberSaliencePeaks, const float referenceFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTonicIndianArtMusic = factory.create("TonicIndianArtMusic", "binResolution", binResolution, "frameSize", frameSize, "harmonicWeight", harmonicWeight, "hopSize", hopSize, "magnitudeCompression", magnitudeCompression, "magnitudeThreshold", magnitudeThreshold, "maxTonicFrequency", maxTonicFrequency, "minTonicFrequency", minTonicFrequency, "numberHarmonics", numberHarmonics, "numberSaliencePeaks", numberSaliencePeaks, "referenceFrequency", referenceFrequency, "sampleRate", sampleRate);
  algoTonicIndianArtMusic->input("signal").set(input_signal);
  float output_tonic;
  algoTonicIndianArtMusic->output("tonic").set(output_tonic);
  algoTonicIndianArtMusic->compute();
  delete algoTonicIndianArtMusic;
  return output_tonic;
}
 
// check https://essentia.upf.edu/reference/std_TriangularBands.html
std::vector<float> EssentiaJS::TriangularBands(std::vector<float>& input_spectrum, const std::vector<float>& frequencyBands, const int inputSize, const bool log, const std::string& normalize, const float sampleRate, const std::string& type, const std::string& weighting) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTriangularBands = factory.create("TriangularBands", "frequencyBands", frequencyBands, "inputSize", inputSize, "log", log, "normalize", normalize, "sampleRate", sampleRate, "type", type, "weighting", weighting);
  algoTriangularBands->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  algoTriangularBands->output("bands").set(output_bands);
  algoTriangularBands->compute();
  delete algoTriangularBands;
  return output_bands;
}
 
// check https://essentia.upf.edu/reference/std_TriangularBarkBands.html
std::vector<float> EssentiaJS::TriangularBarkBands(std::vector<float>& input_spectrum, const float highFrequencyBound, const int inputSize, const bool log, const float lowFrequencyBound, const std::string& normalize, const int numberBands, const float sampleRate, const std::string& type, const std::string& weighting) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTriangularBarkBands = factory.create("TriangularBarkBands", "highFrequencyBound", highFrequencyBound, "inputSize", inputSize, "log", log, "lowFrequencyBound", lowFrequencyBound, "normalize", normalize, "numberBands", numberBands, "sampleRate", sampleRate, "type", type, "weighting", weighting);
  algoTriangularBarkBands->input("spectrum").set(input_spectrum);
  std::vector<float> output_bands;
  algoTriangularBarkBands->output("bands").set(output_bands);
  algoTriangularBarkBands->compute();
  delete algoTriangularBarkBands;
  return output_bands;
}
 
// check https://essentia.upf.edu/reference/std_Trimmer.html
std::vector<float> EssentiaJS::Trimmer(std::vector<float>& input_signal, const bool checkRange, const float endTime, const float sampleRate, const float startTime) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTrimmer = factory.create("Trimmer", "checkRange", checkRange, "endTime", endTime, "sampleRate", sampleRate, "startTime", startTime);
  algoTrimmer->input("signal").set(input_signal);
  std::vector<float> output_signal;
  algoTrimmer->output("signal").set(output_signal);
  algoTrimmer->compute();
  delete algoTrimmer;
  return output_signal;
}
 
// check https://essentia.upf.edu/reference/std_Tristimulus.html
std::vector<float> EssentiaJS::Tristimulus(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTristimulus = factory.create("Tristimulus");
  algoTristimulus->input("frequencies").set(input_frequencies);
  algoTristimulus->input("magnitudes").set(input_magnitudes);
  std::vector<float> output_tristimulus;
  algoTristimulus->output("tristimulus").set(output_tristimulus);
  algoTristimulus->compute();
  delete algoTristimulus;
  return output_tristimulus;
}
 
// check https://essentia.upf.edu/reference/std_TruePeakDetector.html
void EssentiaJS::TruePeakDetector(std::vector<float>& input_signal, std::vector<float>& output_peakLocations, std::vector<float>& output_output, const bool blockDC, const bool emphasise, const int oversamplingFactor, const int quality, const float sampleRate, const float threshold, const int version) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTruePeakDetector = factory.create("TruePeakDetector", "blockDC", blockDC, "emphasise", emphasise, "oversamplingFactor", oversamplingFactor, "quality", quality, "sampleRate", sampleRate, "threshold", threshold, "version", version);
  algoTruePeakDetector->input("signal").set(input_signal);
  algoTruePeakDetector->output("peakLocations").set(output_peakLocations);
  algoTruePeakDetector->output("output").set(output_output);
  algoTruePeakDetector->compute();
  delete algoTruePeakDetector;
}
 
// check https://essentia.upf.edu/reference/std_TuningFrequency.html
void EssentiaJS::TuningFrequency(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, float output_tuningFrequency, float output_tuningCents, const float resolution) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTuningFrequency = factory.create("TuningFrequency", "resolution", resolution);
  algoTuningFrequency->input("frequencies").set(input_frequencies);
  algoTuningFrequency->input("magnitudes").set(input_magnitudes);
  algoTuningFrequency->output("tuningFrequency").set(output_tuningFrequency);
  algoTuningFrequency->output("tuningCents").set(output_tuningCents);
  algoTuningFrequency->compute();
  delete algoTuningFrequency;
}
 
// check https://essentia.upf.edu/reference/std_TuningFrequencyExtractor.html
std::vector<float> EssentiaJS::TuningFrequencyExtractor(std::vector<float>& input_signal, const int frameSize, const int hopSize) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoTuningFrequencyExtractor = factory.create("TuningFrequencyExtractor", "frameSize", frameSize, "hopSize", hopSize);
  algoTuningFrequencyExtractor->input("signal").set(input_signal);
  std::vector<float> output_tuningFrequency;
  algoTuningFrequencyExtractor->output("tuningFrequency").set(output_tuningFrequency);
  algoTuningFrequencyExtractor->compute();
  delete algoTuningFrequencyExtractor;
  return output_tuningFrequency;
}
 
// check https://essentia.upf.edu/reference/std_UnaryOperator.html
std::vector<float> EssentiaJS::UnaryOperator(std::vector<float>& input_array, const float scale, const float shift, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoUnaryOperator = factory.create("UnaryOperator", "scale", scale, "shift", shift, "type", type);
  algoUnaryOperator->input("array").set(input_array);
  std::vector<float> output_array;
  algoUnaryOperator->output("array").set(output_array);
  algoUnaryOperator->compute();
  delete algoUnaryOperator;
  return output_array;
}
 
// check https://essentia.upf.edu/reference/std_UnaryOperatorStream.html
std::vector<float> EssentiaJS::UnaryOperatorStream(std::vector<float>& input_array, const float scale, const float shift, const std::string& type) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoUnaryOperatorStream = factory.create("UnaryOperatorStream", "scale", scale, "shift", shift, "type", type);
  algoUnaryOperatorStream->input("array").set(input_array);
  std::vector<float> output_array;
  algoUnaryOperatorStream->output("array").set(output_array);
  algoUnaryOperatorStream->compute();
  delete algoUnaryOperatorStream;
  return output_array;
}
 
// check https://essentia.upf.edu/reference/std_Variance.html
float EssentiaJS::Variance(std::vector<float>& input_array) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoVariance = factory.create("Variance");
  algoVariance->input("array").set(input_array);
  float output_variance;
  algoVariance->output("variance").set(output_variance);
  algoVariance->compute();
  delete algoVariance;
  return output_variance;
}
 
// check https://essentia.upf.edu/reference/std_Vibrato.html
void EssentiaJS::Vibrato(std::vector<float>& input_pitch, std::vector<float>& output_vibratoFrequency, std::vector<float>& output_vibratoExtend, const float maxExtend, const float maxFrequency, const float minExtend, const float minFrequency, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoVibrato = factory.create("Vibrato", "maxExtend", maxExtend, "maxFrequency", maxFrequency, "minExtend", minExtend, "minFrequency", minFrequency, "sampleRate", sampleRate);
  algoVibrato->input("pitch").set(input_pitch);
  algoVibrato->output("vibratoFrequency").set(output_vibratoFrequency);
  algoVibrato->output("vibratoExtend").set(output_vibratoExtend);
  algoVibrato->compute();
  delete algoVibrato;
}
 
// check https://essentia.upf.edu/reference/std_WarpedAutoCorrelation.html
std::vector<float> EssentiaJS::WarpedAutoCorrelation(std::vector<float>& input_array, const int maxLag, const float sampleRate) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoWarpedAutoCorrelation = factory.create("WarpedAutoCorrelation", "maxLag", maxLag, "sampleRate", sampleRate);
  algoWarpedAutoCorrelation->input("array").set(input_array);
  std::vector<float> output_warpedAutoCorrelation;
  algoWarpedAutoCorrelation->output("warpedAutoCorrelation").set(output_warpedAutoCorrelation);
  algoWarpedAutoCorrelation->compute();
  delete algoWarpedAutoCorrelation;
  return output_warpedAutoCorrelation;
}
 
// check https://essentia.upf.edu/reference/std_Welch.html
std::vector<float> EssentiaJS::Welch(std::vector<float>& input_frame, const int averagingFrames, const int fftSize, const int frameSize, const float sampleRate, const std::string& scaling, const std::string& windowType) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoWelch = factory.create("Welch", "averagingFrames", averagingFrames, "fftSize", fftSize, "frameSize", frameSize, "sampleRate", sampleRate, "scaling", scaling, "windowType", windowType);
  algoWelch->input("frame").set(input_frame);
  std::vector<float> output_psd;
  algoWelch->output("psd").set(output_psd);
  algoWelch->compute();
  delete algoWelch;
  return output_psd;
}
 
// check https://essentia.upf.edu/reference/std_Windowing.html
std::vector<float> EssentiaJS::Windowing(std::vector<float>& input_frame, const bool normalized, const int size, const std::string& type, const int zeroPadding, const bool zeroPhase) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoWindowing = factory.create("Windowing", "normalized", normalized, "size", size, "type", type, "zeroPadding", zeroPadding, "zeroPhase", zeroPhase);
  algoWindowing->input("frame").set(input_frame);
  std::vector<float> output_frame;
  algoWindowing->output("frame").set(output_frame);
  algoWindowing->compute();
  delete algoWindowing;
  return output_frame;
}
 
// check https://essentia.upf.edu/reference/std_ZeroCrossingRate.html
float EssentiaJS::ZeroCrossingRate(std::vector<float>& input_signal, const float threshold) {
  AlgorithmFactory& factory = standard::AlgorithmFactory::instance();
  Algorithm* algoZeroCrossingRate = factory.create("ZeroCrossingRate", "threshold", threshold);
  algoZeroCrossingRate->input("signal").set(input_signal);
  float output_zeroCrossingRate;
  algoZeroCrossingRate->output("zeroCrossingRate").set(output_zeroCrossingRate);
  algoZeroCrossingRate->compute();
  delete algoZeroCrossingRate;
  return output_zeroCrossingRate;
}
