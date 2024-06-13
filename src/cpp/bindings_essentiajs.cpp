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
#include <emscripten/bind.h>
#include "./includes/essentiajs.h"

// expose essentiajs class to js using embind wrappers
EMSCRIPTEN_BINDINGS(CLASS_EssentiaJS) {
  function("init", &_initEssentia);
  constant("algorithmNames", ALGORITHM_NAMES);
  class_<FrameGenerator>("FrameGenerator")
    .constructor<int, int>()
    .function("configure", &FrameGenerator::configure)
    .function("compute", &FrameGenerator::compute)
    .function("reset", &FrameGenerator::reset)
    ;
  class_<LoudnessEBUR128>("LoudnessEBUR128")
    .constructor<float, float, bool>()
    .function("configure", &LoudnessEBUR128::configure)
    .function("compute", &LoudnessEBUR128::compute)
    .function("reset", &LoudnessEBUR128::reset)
    ;
  // NOTE: The following code snippets are machine generated. Do not edit.

  class_<AfterMaxToBeforeMaxEnergyRatio>("AfterMaxToBeforeMaxEnergyRatio")
  	.constructor<>()
  	.function("configure", &AfterMaxToBeforeMaxEnergyRatio::configure)
  	.function("compute", &AfterMaxToBeforeMaxEnergyRatio::compute)
  	.function("reset", &AfterMaxToBeforeMaxEnergyRatio::reset)
  	;

  class_<AllPass>("AllPass")
  	.constructor<float, float, int, float>()
  	.function("configure", &AllPass::configure)
  	.function("compute", &AllPass::compute)
  	.function("reset", &AllPass::reset)
  	;

  class_<AudioOnsetsMarker>("AudioOnsetsMarker")
  	.constructor<std::vector<float>&, float, std::string>()
  	.function("configure", &AudioOnsetsMarker::configure)
  	.function("compute", &AudioOnsetsMarker::compute)
  	.function("reset", &AudioOnsetsMarker::reset)
  	;

  class_<AutoCorrelation>("AutoCorrelation")
  	.constructor<float, bool, std::string>()
  	.function("configure", &AutoCorrelation::configure)
  	.function("compute", &AutoCorrelation::compute)
  	.function("reset", &AutoCorrelation::reset)
  	;

  class_<BFCC>("BFCC")
  	.constructor<int, float, int, int, std::string, float, std::string, int, int, float, std::string, std::string>()
  	.function("configure", &BFCC::configure)
  	.function("compute", &BFCC::compute)
  	.function("reset", &BFCC::reset)
  	;

  class_<BPF>("BPF")
  	.constructor<std::vector<float>&, std::vector<float>&>()
  	.function("configure", &BPF::configure)
  	.function("compute", &BPF::compute)
  	.function("reset", &BPF::reset)
  	;

  class_<BandPass>("BandPass")
  	.constructor<float, float, float>()
  	.function("configure", &BandPass::configure)
  	.function("compute", &BandPass::compute)
  	.function("reset", &BandPass::reset)
  	;

  class_<BandReject>("BandReject")
  	.constructor<float, float, float>()
  	.function("configure", &BandReject::configure)
  	.function("compute", &BandReject::compute)
  	.function("reset", &BandReject::reset)
  	;

  class_<BarkBands>("BarkBands")
  	.constructor<int, float>()
  	.function("configure", &BarkBands::configure)
  	.function("compute", &BarkBands::compute)
  	.function("reset", &BarkBands::reset)
  	;

  class_<BeatTrackerDegara>("BeatTrackerDegara")
  	.constructor<int, int>()
  	.function("configure", &BeatTrackerDegara::configure)
  	.function("compute", &BeatTrackerDegara::compute)
  	.function("reset", &BeatTrackerDegara::reset)
  	;

  class_<BeatTrackerMultiFeature>("BeatTrackerMultiFeature")
  	.constructor<int, int>()
  	.function("configure", &BeatTrackerMultiFeature::configure)
  	.function("compute", &BeatTrackerMultiFeature::compute)
  	.function("reset", &BeatTrackerMultiFeature::reset)
  	;

  class_<Beatogram>("Beatogram")
  	.constructor<int>()
  	.function("configure", &Beatogram::configure)
  	.function("compute", &Beatogram::compute)
  	.function("reset", &Beatogram::reset)
  	;

  class_<BeatsLoudness>("BeatsLoudness")
  	.constructor<float, float, std::vector<float>&, std::vector<float>&, float>()
  	.function("configure", &BeatsLoudness::configure)
  	.function("compute", &BeatsLoudness::compute)
  	.function("reset", &BeatsLoudness::reset)
  	;

  class_<BinaryOperator>("BinaryOperator")
  	.constructor<std::string>()
  	.function("configure", &BinaryOperator::configure)
  	.function("compute", &BinaryOperator::compute)
  	.function("reset", &BinaryOperator::reset)
  	;

  class_<BinaryOperatorStream>("BinaryOperatorStream")
  	.constructor<std::string>()
  	.function("configure", &BinaryOperatorStream::configure)
  	.function("compute", &BinaryOperatorStream::compute)
  	.function("reset", &BinaryOperatorStream::reset)
  	;

  class_<BpmHistogramDescriptors>("BpmHistogramDescriptors")
  	.constructor<>()
  	.function("configure", &BpmHistogramDescriptors::configure)
  	.function("compute", &BpmHistogramDescriptors::compute)
  	.function("reset", &BpmHistogramDescriptors::reset)
  	;

  class_<BpmRubato>("BpmRubato")
  	.constructor<float, float, float>()
  	.function("configure", &BpmRubato::configure)
  	.function("compute", &BpmRubato::compute)
  	.function("reset", &BpmRubato::reset)
  	;

  class_<CentralMoments>("CentralMoments")
  	.constructor<std::string, float>()
  	.function("configure", &CentralMoments::configure)
  	.function("compute", &CentralMoments::compute)
  	.function("reset", &CentralMoments::reset)
  	;

  class_<Centroid>("Centroid")
  	.constructor<float>()
  	.function("configure", &Centroid::configure)
  	.function("compute", &Centroid::compute)
  	.function("reset", &Centroid::reset)
  	;

  class_<ChordsDescriptors>("ChordsDescriptors")
  	.constructor<>()
  	.function("configure", &ChordsDescriptors::configure)
  	.function("compute", &ChordsDescriptors::compute)
  	.function("reset", &ChordsDescriptors::reset)
  	;

  class_<ChordsDetection>("ChordsDetection")
  	.constructor<int, float, float>()
  	.function("configure", &ChordsDetection::configure)
  	.function("compute", &ChordsDetection::compute)
  	.function("reset", &ChordsDetection::reset)
  	;

  class_<ChordsDetectionBeats>("ChordsDetectionBeats")
  	.constructor<std::string, int, float>()
  	.function("configure", &ChordsDetectionBeats::configure)
  	.function("compute", &ChordsDetectionBeats::compute)
  	.function("reset", &ChordsDetectionBeats::reset)
  	;

  class_<ChromaCrossSimilarity>("ChromaCrossSimilarity")
  	.constructor<float, int, int, int, bool, bool, bool>()
  	.function("configure", &ChromaCrossSimilarity::configure)
  	.function("compute", &ChromaCrossSimilarity::compute)
  	.function("reset", &ChromaCrossSimilarity::reset)
  	;

  class_<Chromagram>("Chromagram")
  	.constructor<int, float, int, std::string, int, float, float, float, std::string, bool>()
  	.function("configure", &Chromagram::configure)
  	.function("compute", &Chromagram::compute)
  	.function("reset", &Chromagram::reset)
  	;

  class_<ClickDetector>("ClickDetector")
  	.constructor<float, int, int, int, int, float, int>()
  	.function("configure", &ClickDetector::configure)
  	.function("compute", &ClickDetector::compute)
  	.function("reset", &ClickDetector::reset)
  	;

  class_<Clipper>("Clipper")
  	.constructor<float, float>()
  	.function("configure", &Clipper::configure)
  	.function("compute", &Clipper::compute)
  	.function("reset", &Clipper::reset)
  	;

  class_<CoverSongSimilarity>("CoverSongSimilarity")
  	.constructor<std::string, float, float, std::string>()
  	.function("configure", &CoverSongSimilarity::configure)
  	.function("compute", &CoverSongSimilarity::compute)
  	.function("reset", &CoverSongSimilarity::reset)
  	;

  class_<Crest>("Crest")
  	.constructor<>()
  	.function("configure", &Crest::configure)
  	.function("compute", &Crest::compute)
  	.function("reset", &Crest::reset)
  	;

  class_<CrossCorrelation>("CrossCorrelation")
  	.constructor<int, int>()
  	.function("configure", &CrossCorrelation::configure)
  	.function("compute", &CrossCorrelation::compute)
  	.function("reset", &CrossCorrelation::reset)
  	;

  class_<CrossSimilarityMatrix>("CrossSimilarityMatrix")
  	.constructor<bool, float, int, int>()
  	.function("configure", &CrossSimilarityMatrix::configure)
  	.function("compute", &CrossSimilarityMatrix::compute)
  	.function("reset", &CrossSimilarityMatrix::reset)
  	;

  class_<CubicSpline>("CubicSpline")
  	.constructor<int, float, int, float, std::vector<float>&, std::vector<float>&>()
  	.function("configure", &CubicSpline::configure)
  	.function("compute", &CubicSpline::compute)
  	.function("reset", &CubicSpline::reset)
  	;

  class_<DCRemoval>("DCRemoval")
  	.constructor<float, float>()
  	.function("configure", &DCRemoval::configure)
  	.function("compute", &DCRemoval::compute)
  	.function("reset", &DCRemoval::reset)
  	;

  class_<DCT>("DCT")
  	.constructor<int, int, int, int>()
  	.function("configure", &DCT::configure)
  	.function("compute", &DCT::compute)
  	.function("reset", &DCT::reset)
  	;

  class_<Danceability>("Danceability")
  	.constructor<float, float, float, float>()
  	.function("configure", &Danceability::configure)
  	.function("compute", &Danceability::compute)
  	.function("reset", &Danceability::reset)
  	;

  class_<Decrease>("Decrease")
  	.constructor<float>()
  	.function("configure", &Decrease::configure)
  	.function("compute", &Decrease::compute)
  	.function("reset", &Decrease::reset)
  	;

  class_<Derivative>("Derivative")
  	.constructor<>()
  	.function("configure", &Derivative::configure)
  	.function("compute", &Derivative::compute)
  	.function("reset", &Derivative::reset)
  	;

  class_<DerivativeSFX>("DerivativeSFX")
  	.constructor<>()
  	.function("configure", &DerivativeSFX::configure)
  	.function("compute", &DerivativeSFX::compute)
  	.function("reset", &DerivativeSFX::reset)
  	;

  class_<DiscontinuityDetector>("DiscontinuityDetector")
  	.constructor<float, float, int, int, int, int, int, int>()
  	.function("configure", &DiscontinuityDetector::configure)
  	.function("compute", &DiscontinuityDetector::compute)
  	.function("reset", &DiscontinuityDetector::reset)
  	;

  class_<Dissonance>("Dissonance")
  	.constructor<>()
  	.function("configure", &Dissonance::configure)
  	.function("compute", &Dissonance::compute)
  	.function("reset", &Dissonance::reset)
  	;

  class_<DistributionShape>("DistributionShape")
  	.constructor<>()
  	.function("configure", &DistributionShape::configure)
  	.function("compute", &DistributionShape::compute)
  	.function("reset", &DistributionShape::reset)
  	;

  class_<Duration>("Duration")
  	.constructor<float>()
  	.function("configure", &Duration::configure)
  	.function("compute", &Duration::compute)
  	.function("reset", &Duration::reset)
  	;

  class_<DynamicComplexity>("DynamicComplexity")
  	.constructor<float, float>()
  	.function("configure", &DynamicComplexity::configure)
  	.function("compute", &DynamicComplexity::compute)
  	.function("reset", &DynamicComplexity::reset)
  	;

  class_<ERBBands>("ERBBands")
  	.constructor<float, int, float, int, float, std::string, float>()
  	.function("configure", &ERBBands::configure)
  	.function("compute", &ERBBands::compute)
  	.function("reset", &ERBBands::reset)
  	;

  class_<EffectiveDuration>("EffectiveDuration")
  	.constructor<float, float>()
  	.function("configure", &EffectiveDuration::configure)
  	.function("compute", &EffectiveDuration::compute)
  	.function("reset", &EffectiveDuration::reset)
  	;

  class_<Energy>("Energy")
  	.constructor<>()
  	.function("configure", &Energy::configure)
  	.function("compute", &Energy::compute)
  	.function("reset", &Energy::reset)
  	;

  class_<EnergyBand>("EnergyBand")
  	.constructor<float, float, float>()
  	.function("configure", &EnergyBand::configure)
  	.function("compute", &EnergyBand::compute)
  	.function("reset", &EnergyBand::reset)
  	;

  class_<EnergyBandRatio>("EnergyBandRatio")
  	.constructor<float, float, float>()
  	.function("configure", &EnergyBandRatio::configure)
  	.function("compute", &EnergyBandRatio::compute)
  	.function("reset", &EnergyBandRatio::reset)
  	;

  class_<Entropy>("Entropy")
  	.constructor<>()
  	.function("configure", &Entropy::configure)
  	.function("compute", &Entropy::compute)
  	.function("reset", &Entropy::reset)
  	;

  class_<Envelope>("Envelope")
  	.constructor<bool, float, float, float>()
  	.function("configure", &Envelope::configure)
  	.function("compute", &Envelope::compute)
  	.function("reset", &Envelope::reset)
  	;

  class_<EqualLoudness>("EqualLoudness")
  	.constructor<float>()
  	.function("configure", &EqualLoudness::configure)
  	.function("compute", &EqualLoudness::compute)
  	.function("reset", &EqualLoudness::reset)
  	;

  class_<Flatness>("Flatness")
  	.constructor<>()
  	.function("configure", &Flatness::configure)
  	.function("compute", &Flatness::compute)
  	.function("reset", &Flatness::reset)
  	;

  class_<FlatnessDB>("FlatnessDB")
  	.constructor<>()
  	.function("configure", &FlatnessDB::configure)
  	.function("compute", &FlatnessDB::compute)
  	.function("reset", &FlatnessDB::reset)
  	;

  class_<FlatnessSFX>("FlatnessSFX")
  	.constructor<>()
  	.function("configure", &FlatnessSFX::configure)
  	.function("compute", &FlatnessSFX::compute)
  	.function("reset", &FlatnessSFX::reset)
  	;

  class_<Flux>("Flux")
  	.constructor<bool, std::string>()
  	.function("configure", &Flux::configure)
  	.function("compute", &Flux::compute)
  	.function("reset", &Flux::reset)
  	;

  class_<FrameCutter>("FrameCutter")
  	.constructor<int, int, bool, bool, float>()
  	.function("configure", &FrameCutter::configure)
  	.function("compute", &FrameCutter::compute)
  	.function("reset", &FrameCutter::reset)
  	;

  class_<FrameToReal>("FrameToReal")
  	.constructor<int, int>()
  	.function("configure", &FrameToReal::configure)
  	.function("compute", &FrameToReal::compute)
  	.function("reset", &FrameToReal::reset)
  	;

  class_<FrequencyBands>("FrequencyBands")
  	.constructor<std::vector<float>&, float>()
  	.function("configure", &FrequencyBands::configure)
  	.function("compute", &FrequencyBands::compute)
  	.function("reset", &FrequencyBands::reset)
  	;

  class_<GFCC>("GFCC")
  	.constructor<int, float, int, std::string, float, int, int, float, float, std::string>()
  	.function("configure", &GFCC::configure)
  	.function("compute", &GFCC::compute)
  	.function("reset", &GFCC::reset)
  	;

  class_<GapsDetector>("GapsDetector")
  	.constructor<float, int, int, int, float, float, float, float, float, float, float, float>()
  	.function("configure", &GapsDetector::configure)
  	.function("compute", &GapsDetector::compute)
  	.function("reset", &GapsDetector::reset)
  	;

  class_<GeometricMean>("GeometricMean")
  	.constructor<>()
  	.function("configure", &GeometricMean::configure)
  	.function("compute", &GeometricMean::compute)
  	.function("reset", &GeometricMean::reset)
  	;

  class_<HFC>("HFC")
  	.constructor<float, std::string>()
  	.function("configure", &HFC::configure)
  	.function("compute", &HFC::compute)
  	.function("reset", &HFC::reset)
  	;

  class_<HPCP>("HPCP")
  	.constructor<bool, float, int, float, bool, float, bool, std::string, float, float, int, std::string, float>()
  	.function("configure", &HPCP::configure)
  	.function("compute", &HPCP::compute)
  	.function("reset", &HPCP::reset)
  	;

  class_<HarmonicBpm>("HarmonicBpm")
  	.constructor<float, float, float>()
  	.function("configure", &HarmonicBpm::configure)
  	.function("compute", &HarmonicBpm::compute)
  	.function("reset", &HarmonicBpm::reset)
  	;

  class_<HarmonicPeaks>("HarmonicPeaks")
  	.constructor<int, float>()
  	.function("configure", &HarmonicPeaks::configure)
  	.function("compute", &HarmonicPeaks::compute)
  	.function("reset", &HarmonicPeaks::reset)
  	;

  class_<HighPass>("HighPass")
  	.constructor<float, float>()
  	.function("configure", &HighPass::configure)
  	.function("compute", &HighPass::compute)
  	.function("reset", &HighPass::reset)
  	;

  class_<HighResolutionFeatures>("HighResolutionFeatures")
  	.constructor<int>()
  	.function("configure", &HighResolutionFeatures::configure)
  	.function("compute", &HighResolutionFeatures::compute)
  	.function("reset", &HighResolutionFeatures::reset)
  	;

  class_<Histogram>("Histogram")
  	.constructor<float, float, std::string, int>()
  	.function("configure", &Histogram::configure)
  	.function("compute", &Histogram::compute)
  	.function("reset", &Histogram::reset)
  	;

  class_<HprModelAnal>("HprModelAnal")
  	.constructor<int, int, float, float, int, float, float, int, int, float, int, std::string, float, float>()
  	.function("configure", &HprModelAnal::configure)
  	.function("compute", &HprModelAnal::compute)
  	.function("reset", &HprModelAnal::reset)
  	;

  class_<HpsModelAnal>("HpsModelAnal")
  	.constructor<int, int, float, float, int, float, float, int, int, float, int, std::string, float, float>()
  	.function("configure", &HpsModelAnal::configure)
  	.function("compute", &HpsModelAnal::compute)
  	.function("reset", &HpsModelAnal::reset)
  	;

  class_<IDCT>("IDCT")
  	.constructor<int, int, int, int>()
  	.function("configure", &IDCT::configure)
  	.function("compute", &IDCT::compute)
  	.function("reset", &IDCT::reset)
  	;

  class_<IIR>("IIR")
  	.constructor<std::vector<float>&, std::vector<float>&>()
  	.function("configure", &IIR::configure)
  	.function("compute", &IIR::compute)
  	.function("reset", &IIR::reset)
  	;

  class_<Inharmonicity>("Inharmonicity")
  	.constructor<>()
  	.function("configure", &Inharmonicity::configure)
  	.function("compute", &Inharmonicity::compute)
  	.function("reset", &Inharmonicity::reset)
  	;

  class_<InstantPower>("InstantPower")
  	.constructor<>()
  	.function("configure", &InstantPower::configure)
  	.function("compute", &InstantPower::compute)
  	.function("reset", &InstantPower::reset)
  	;

  class_<Intensity>("Intensity")
  	.constructor<float>()
  	.function("configure", &Intensity::configure)
  	.function("compute", &Intensity::compute)
  	.function("reset", &Intensity::reset)
  	;

  class_<Key>("Key")
  	.constructor<int, int, std::string, float, bool, bool, bool>()
  	.function("configure", &Key::configure)
  	.function("compute", &Key::compute)
  	.function("reset", &Key::reset)
  	;

  class_<KeyExtractor>("KeyExtractor")
  	.constructor<bool, int, int, int, float, int, float, float, std::string, float, float, float, std::string, std::string>()
  	.function("configure", &KeyExtractor::configure)
  	.function("compute", &KeyExtractor::compute)
  	.function("reset", &KeyExtractor::reset)
  	;

  class_<LPC>("LPC")
  	.constructor<int, float, std::string>()
  	.function("configure", &LPC::configure)
  	.function("compute", &LPC::compute)
  	.function("reset", &LPC::reset)
  	;

  class_<Larm>("Larm")
  	.constructor<float, float, float, float>()
  	.function("configure", &Larm::configure)
  	.function("compute", &Larm::compute)
  	.function("reset", &Larm::reset)
  	;

  class_<Leq>("Leq")
  	.constructor<>()
  	.function("configure", &Leq::configure)
  	.function("compute", &Leq::compute)
  	.function("reset", &Leq::reset)
  	;

  class_<LevelExtractor>("LevelExtractor")
  	.constructor<int, int>()
  	.function("configure", &LevelExtractor::configure)
  	.function("compute", &LevelExtractor::compute)
  	.function("reset", &LevelExtractor::reset)
  	;

  class_<LogAttackTime>("LogAttackTime")
  	.constructor<float, float, float>()
  	.function("configure", &LogAttackTime::configure)
  	.function("compute", &LogAttackTime::compute)
  	.function("reset", &LogAttackTime::reset)
  	;

  class_<LogSpectrum>("LogSpectrum")
  	.constructor<float, int, int, float, float>()
  	.function("configure", &LogSpectrum::configure)
  	.function("compute", &LogSpectrum::compute)
  	.function("reset", &LogSpectrum::reset)
  	;

  class_<LoopBpmConfidence>("LoopBpmConfidence")
  	.constructor<float>()
  	.function("configure", &LoopBpmConfidence::configure)
  	.function("compute", &LoopBpmConfidence::compute)
  	.function("reset", &LoopBpmConfidence::reset)
  	;

  class_<LoopBpmEstimator>("LoopBpmEstimator")
  	.constructor<float>()
  	.function("configure", &LoopBpmEstimator::configure)
  	.function("compute", &LoopBpmEstimator::compute)
  	.function("reset", &LoopBpmEstimator::reset)
  	;

  class_<Loudness>("Loudness")
  	.constructor<>()
  	.function("configure", &Loudness::configure)
  	.function("compute", &Loudness::compute)
  	.function("reset", &Loudness::reset)
  	;

  class_<LoudnessVickers>("LoudnessVickers")
  	.constructor<float>()
  	.function("configure", &LoudnessVickers::configure)
  	.function("compute", &LoudnessVickers::compute)
  	.function("reset", &LoudnessVickers::reset)
  	;

  class_<LowLevelSpectralEqloudExtractor>("LowLevelSpectralEqloudExtractor")
  	.constructor<int, int, float>()
  	.function("configure", &LowLevelSpectralEqloudExtractor::configure)
  	.function("compute", &LowLevelSpectralEqloudExtractor::compute)
  	.function("reset", &LowLevelSpectralEqloudExtractor::reset)
  	;

  class_<LowLevelSpectralExtractor>("LowLevelSpectralExtractor")
  	.constructor<int, int, float>()
  	.function("configure", &LowLevelSpectralExtractor::configure)
  	.function("compute", &LowLevelSpectralExtractor::compute)
  	.function("reset", &LowLevelSpectralExtractor::reset)
  	;

  class_<LowPass>("LowPass")
  	.constructor<float, float>()
  	.function("configure", &LowPass::configure)
  	.function("compute", &LowPass::compute)
  	.function("reset", &LowPass::reset)
  	;

  class_<MFCC>("MFCC")
  	.constructor<int, float, int, int, std::string, float, std::string, int, int, float, float, std::string, std::string, std::string>()
  	.function("configure", &MFCC::configure)
  	.function("compute", &MFCC::compute)
  	.function("reset", &MFCC::reset)
  	;

  class_<MaxFilter>("MaxFilter")
  	.constructor<bool, int>()
  	.function("configure", &MaxFilter::configure)
  	.function("compute", &MaxFilter::compute)
  	.function("reset", &MaxFilter::reset)
  	;

  class_<MaxMagFreq>("MaxMagFreq")
  	.constructor<float>()
  	.function("configure", &MaxMagFreq::configure)
  	.function("compute", &MaxMagFreq::compute)
  	.function("reset", &MaxMagFreq::reset)
  	;

  class_<MaxToTotal>("MaxToTotal")
  	.constructor<>()
  	.function("configure", &MaxToTotal::configure)
  	.function("compute", &MaxToTotal::compute)
  	.function("reset", &MaxToTotal::reset)
  	;

  class_<Mean>("Mean")
  	.constructor<>()
  	.function("configure", &Mean::configure)
  	.function("compute", &Mean::compute)
  	.function("reset", &Mean::reset)
  	;

  class_<Median>("Median")
  	.constructor<>()
  	.function("configure", &Median::configure)
  	.function("compute", &Median::compute)
  	.function("reset", &Median::reset)
  	;

  class_<MedianFilter>("MedianFilter")
  	.constructor<int>()
  	.function("configure", &MedianFilter::configure)
  	.function("compute", &MedianFilter::compute)
  	.function("reset", &MedianFilter::reset)
  	;

  class_<MelBands>("MelBands")
  	.constructor<float, int, bool, float, std::string, int, float, std::string, std::string, std::string>()
  	.function("configure", &MelBands::configure)
  	.function("compute", &MelBands::compute)
  	.function("reset", &MelBands::reset)
  	;

  class_<Meter>("Meter")
  	.constructor<>()
  	.function("configure", &Meter::configure)
  	.function("compute", &Meter::compute)
  	.function("reset", &Meter::reset)
  	;

  class_<MinMax>("MinMax")
  	.constructor<std::string>()
  	.function("configure", &MinMax::configure)
  	.function("compute", &MinMax::compute)
  	.function("reset", &MinMax::reset)
  	;

  class_<MinToTotal>("MinToTotal")
  	.constructor<>()
  	.function("configure", &MinToTotal::configure)
  	.function("compute", &MinToTotal::compute)
  	.function("reset", &MinToTotal::reset)
  	;

  class_<MovingAverage>("MovingAverage")
  	.constructor<int>()
  	.function("configure", &MovingAverage::configure)
  	.function("compute", &MovingAverage::compute)
  	.function("reset", &MovingAverage::reset)
  	;

  class_<MultiPitchKlapuri>("MultiPitchKlapuri")
  	.constructor<float, int, float, int, float, int, float, float, int, float, float>()
  	.function("configure", &MultiPitchKlapuri::configure)
  	.function("compute", &MultiPitchKlapuri::compute)
  	.function("reset", &MultiPitchKlapuri::reset)
  	;

  class_<MultiPitchMelodia>("MultiPitchMelodia")
  	.constructor<float, int, int, bool, float, int, float, int, float, int, float, int, float, float, float, float, float, int>()
  	.function("configure", &MultiPitchMelodia::configure)
  	.function("compute", &MultiPitchMelodia::compute)
  	.function("reset", &MultiPitchMelodia::reset)
  	;

  class_<Multiplexer>("Multiplexer")
  	.constructor<int, int>()
  	.function("configure", &Multiplexer::configure)
  	.function("compute", &Multiplexer::compute)
  	.function("reset", &Multiplexer::reset)
  	;

  class_<NNLSChroma>("NNLSChroma")
  	.constructor<std::string, int, float, float, float, std::string, bool>()
  	.function("configure", &NNLSChroma::configure)
  	.function("compute", &NNLSChroma::compute)
  	.function("reset", &NNLSChroma::reset)
  	;

  class_<NoiseAdder>("NoiseAdder")
  	.constructor<bool, int>()
  	.function("configure", &NoiseAdder::configure)
  	.function("compute", &NoiseAdder::compute)
  	.function("reset", &NoiseAdder::reset)
  	;

  class_<NoiseBurstDetector>("NoiseBurstDetector")
  	.constructor<float, int, int>()
  	.function("configure", &NoiseBurstDetector::configure)
  	.function("compute", &NoiseBurstDetector::compute)
  	.function("reset", &NoiseBurstDetector::reset)
  	;

  class_<NoveltyCurve>("NoveltyCurve")
  	.constructor<float, bool, std::vector<float>&, std::string>()
  	.function("configure", &NoveltyCurve::configure)
  	.function("compute", &NoveltyCurve::compute)
  	.function("reset", &NoveltyCurve::reset)
  	;

  class_<NoveltyCurveFixedBpmEstimator>("NoveltyCurveFixedBpmEstimator")
  	.constructor<int, float, float, float, float>()
  	.function("configure", &NoveltyCurveFixedBpmEstimator::configure)
  	.function("compute", &NoveltyCurveFixedBpmEstimator::compute)
  	.function("reset", &NoveltyCurveFixedBpmEstimator::reset)
  	;

  class_<OddToEvenHarmonicEnergyRatio>("OddToEvenHarmonicEnergyRatio")
  	.constructor<>()
  	.function("configure", &OddToEvenHarmonicEnergyRatio::configure)
  	.function("compute", &OddToEvenHarmonicEnergyRatio::compute)
  	.function("reset", &OddToEvenHarmonicEnergyRatio::reset)
  	;

  class_<OnsetDetection>("OnsetDetection")
  	.constructor<std::string, float>()
  	.function("configure", &OnsetDetection::configure)
  	.function("compute", &OnsetDetection::compute)
  	.function("reset", &OnsetDetection::reset)
  	;

  class_<OnsetDetectionGlobal>("OnsetDetectionGlobal")
  	.constructor<int, int, std::string, float>()
  	.function("configure", &OnsetDetectionGlobal::configure)
  	.function("compute", &OnsetDetectionGlobal::compute)
  	.function("reset", &OnsetDetectionGlobal::reset)
  	;

  class_<OnsetRate>("OnsetRate")
  	.constructor<>()
  	.function("configure", &OnsetRate::configure)
  	.function("compute", &OnsetRate::compute)
  	.function("reset", &OnsetRate::reset)
  	;

  class_<OverlapAdd>("OverlapAdd")
  	.constructor<int, float, int>()
  	.function("configure", &OverlapAdd::configure)
  	.function("compute", &OverlapAdd::compute)
  	.function("reset", &OverlapAdd::reset)
  	;

  class_<PeakDetection>("PeakDetection")
  	.constructor<bool, int, float, float, float, std::string, float, float>()
  	.function("configure", &PeakDetection::configure)
  	.function("compute", &PeakDetection::compute)
  	.function("reset", &PeakDetection::reset)
  	;

  class_<PercivalBpmEstimator>("PercivalBpmEstimator")
  	.constructor<int, int, int, int, int, int, int>()
  	.function("configure", &PercivalBpmEstimator::configure)
  	.function("compute", &PercivalBpmEstimator::compute)
  	.function("reset", &PercivalBpmEstimator::reset)
  	;

  class_<PercivalEnhanceHarmonics>("PercivalEnhanceHarmonics")
  	.constructor<>()
  	.function("configure", &PercivalEnhanceHarmonics::configure)
  	.function("compute", &PercivalEnhanceHarmonics::compute)
  	.function("reset", &PercivalEnhanceHarmonics::reset)
  	;

  class_<PercivalEvaluatePulseTrains>("PercivalEvaluatePulseTrains")
  	.constructor<>()
  	.function("configure", &PercivalEvaluatePulseTrains::configure)
  	.function("compute", &PercivalEvaluatePulseTrains::compute)
  	.function("reset", &PercivalEvaluatePulseTrains::reset)
  	;

  class_<PitchContourSegmentation>("PitchContourSegmentation")
  	.constructor<int, float, int, int, int, int>()
  	.function("configure", &PitchContourSegmentation::configure)
  	.function("compute", &PitchContourSegmentation::compute)
  	.function("reset", &PitchContourSegmentation::reset)
  	;

  class_<PitchContours>("PitchContours")
  	.constructor<float, int, float, float, float, float, float, float>()
  	.function("configure", &PitchContours::configure)
  	.function("compute", &PitchContours::compute)
  	.function("reset", &PitchContours::reset)
  	;

  class_<PitchContoursMelody>("PitchContoursMelody")
  	.constructor<float, int, bool, int, float, float, float, float, bool, float>()
  	.function("configure", &PitchContoursMelody::configure)
  	.function("compute", &PitchContoursMelody::compute)
  	.function("reset", &PitchContoursMelody::reset)
  	;

  class_<PitchContoursMonoMelody>("PitchContoursMonoMelody")
  	.constructor<float, int, bool, int, float, float, float, float>()
  	.function("configure", &PitchContoursMonoMelody::configure)
  	.function("compute", &PitchContoursMonoMelody::compute)
  	.function("reset", &PitchContoursMonoMelody::reset)
  	;

  class_<PitchContoursMultiMelody>("PitchContoursMultiMelody")
  	.constructor<float, int, bool, int, float, float, float, float>()
  	.function("configure", &PitchContoursMultiMelody::configure)
  	.function("compute", &PitchContoursMultiMelody::compute)
  	.function("reset", &PitchContoursMultiMelody::reset)
  	;

  class_<PitchFilter>("PitchFilter")
  	.constructor<int, int, bool>()
  	.function("configure", &PitchFilter::configure)
  	.function("compute", &PitchFilter::compute)
  	.function("reset", &PitchFilter::reset)
  	;

  class_<PitchMelodia>("PitchMelodia")
  	.constructor<float, int, int, bool, float, int, float, int, float, int, float, int, float, float, float, float, float, int>()
  	.function("configure", &PitchMelodia::configure)
  	.function("compute", &PitchMelodia::compute)
  	.function("reset", &PitchMelodia::reset)
  	;

  class_<PitchSalience>("PitchSalience")
  	.constructor<float, float, float>()
  	.function("configure", &PitchSalience::configure)
  	.function("compute", &PitchSalience::compute)
  	.function("reset", &PitchSalience::reset)
  	;

  class_<PitchSalienceFunction>("PitchSalienceFunction")
  	.constructor<float, float, float, float, int, float>()
  	.function("configure", &PitchSalienceFunction::configure)
  	.function("compute", &PitchSalienceFunction::compute)
  	.function("reset", &PitchSalienceFunction::reset)
  	;

  class_<PitchSalienceFunctionPeaks>("PitchSalienceFunctionPeaks")
  	.constructor<float, float, float, float>()
  	.function("configure", &PitchSalienceFunctionPeaks::configure)
  	.function("compute", &PitchSalienceFunctionPeaks::compute)
  	.function("reset", &PitchSalienceFunctionPeaks::reset)
  	;

  class_<PitchYin>("PitchYin")
  	.constructor<int, bool, float, float, float, float>()
  	.function("configure", &PitchYin::configure)
  	.function("compute", &PitchYin::compute)
  	.function("reset", &PitchYin::reset)
  	;

  class_<PitchYinFFT>("PitchYinFFT")
  	.constructor<int, bool, float, float, float, float>()
  	.function("configure", &PitchYinFFT::configure)
  	.function("compute", &PitchYinFFT::compute)
  	.function("reset", &PitchYinFFT::reset)
  	;

  class_<PitchYinProbabilistic>("PitchYinProbabilistic")
  	.constructor<int, int, float, std::string, bool, float>()
  	.function("configure", &PitchYinProbabilistic::configure)
  	.function("compute", &PitchYinProbabilistic::compute)
  	.function("reset", &PitchYinProbabilistic::reset)
  	;

  class_<PitchYinProbabilities>("PitchYinProbabilities")
  	.constructor<int, float, bool, float>()
  	.function("configure", &PitchYinProbabilities::configure)
  	.function("compute", &PitchYinProbabilities::compute)
  	.function("reset", &PitchYinProbabilities::reset)
  	;

  class_<PitchYinProbabilitiesHMM>("PitchYinProbabilitiesHMM")
  	.constructor<float, int, float, float>()
  	.function("configure", &PitchYinProbabilitiesHMM::configure)
  	.function("compute", &PitchYinProbabilitiesHMM::compute)
  	.function("reset", &PitchYinProbabilitiesHMM::reset)
  	;

  class_<PowerMean>("PowerMean")
  	.constructor<float>()
  	.function("configure", &PowerMean::configure)
  	.function("compute", &PowerMean::compute)
  	.function("reset", &PowerMean::reset)
  	;

  class_<PowerSpectrum>("PowerSpectrum")
  	.constructor<int>()
  	.function("configure", &PowerSpectrum::configure)
  	.function("compute", &PowerSpectrum::compute)
  	.function("reset", &PowerSpectrum::reset)
  	;

  class_<PredominantPitchMelodia>("PredominantPitchMelodia")
  	.constructor<float, int, int, bool, float, int, float, int, float, int, float, int, float, float, float, float, float, int, bool, float>()
  	.function("configure", &PredominantPitchMelodia::configure)
  	.function("compute", &PredominantPitchMelodia::compute)
  	.function("reset", &PredominantPitchMelodia::reset)
  	;

  class_<RMS>("RMS")
  	.constructor<>()
  	.function("configure", &RMS::configure)
  	.function("compute", &RMS::compute)
  	.function("reset", &RMS::reset)
  	;

  class_<RawMoments>("RawMoments")
  	.constructor<float>()
  	.function("configure", &RawMoments::configure)
  	.function("compute", &RawMoments::compute)
  	.function("reset", &RawMoments::reset)
  	;

  class_<ReplayGain>("ReplayGain")
  	.constructor<float>()
  	.function("configure", &ReplayGain::configure)
  	.function("compute", &ReplayGain::compute)
  	.function("reset", &ReplayGain::reset)
  	;

  class_<Resample>("Resample")
  	.constructor<float, float, int>()
  	.function("configure", &Resample::configure)
  	.function("compute", &Resample::compute)
  	.function("reset", &Resample::reset)
  	;

  class_<ResampleFFT>("ResampleFFT")
  	.constructor<int, int>()
  	.function("configure", &ResampleFFT::configure)
  	.function("compute", &ResampleFFT::compute)
  	.function("reset", &ResampleFFT::reset)
  	;

  class_<RhythmDescriptors>("RhythmDescriptors")
  	.constructor<>()
  	.function("configure", &RhythmDescriptors::configure)
  	.function("compute", &RhythmDescriptors::compute)
  	.function("reset", &RhythmDescriptors::reset)
  	;

  class_<RhythmExtractor>("RhythmExtractor")
  	.constructor<int, int, int, float, int, int, int, float, std::vector<float>&, float, bool, bool>()
  	.function("configure", &RhythmExtractor::configure)
  	.function("compute", &RhythmExtractor::compute)
  	.function("reset", &RhythmExtractor::reset)
  	;

  class_<RhythmExtractor2013>("RhythmExtractor2013")
  	.constructor<int, std::string, int>()
  	.function("configure", &RhythmExtractor2013::configure)
  	.function("compute", &RhythmExtractor2013::compute)
  	.function("reset", &RhythmExtractor2013::reset)
  	;

  class_<RhythmTransform>("RhythmTransform")
  	.constructor<int, int>()
  	.function("configure", &RhythmTransform::configure)
  	.function("compute", &RhythmTransform::compute)
  	.function("reset", &RhythmTransform::reset)
  	;

  class_<RollOff>("RollOff")
  	.constructor<float, float>()
  	.function("configure", &RollOff::configure)
  	.function("compute", &RollOff::compute)
  	.function("reset", &RollOff::reset)
  	;

  class_<SNR>("SNR")
  	.constructor<float, float, float, int, float, float, bool>()
  	.function("configure", &SNR::configure)
  	.function("compute", &SNR::compute)
  	.function("reset", &SNR::reset)
  	;

  class_<SaturationDetector>("SaturationDetector")
  	.constructor<float, float, int, int, float, float>()
  	.function("configure", &SaturationDetector::configure)
  	.function("compute", &SaturationDetector::compute)
  	.function("reset", &SaturationDetector::reset)
  	;

  class_<Scale>("Scale")
  	.constructor<bool, float, float>()
  	.function("configure", &Scale::configure)
  	.function("compute", &Scale::compute)
  	.function("reset", &Scale::reset)
  	;

  class_<SineSubtraction>("SineSubtraction")
  	.constructor<int, int, float>()
  	.function("configure", &SineSubtraction::configure)
  	.function("compute", &SineSubtraction::compute)
  	.function("reset", &SineSubtraction::reset)
  	;

  class_<SingleBeatLoudness>("SingleBeatLoudness")
  	.constructor<float, float, std::vector<float>&, std::string, float>()
  	.function("configure", &SingleBeatLoudness::configure)
  	.function("compute", &SingleBeatLoudness::compute)
  	.function("reset", &SingleBeatLoudness::reset)
  	;

  class_<Slicer>("Slicer")
  	.constructor<std::vector<float>&, float, std::vector<float>&, std::string>()
  	.function("configure", &Slicer::configure)
  	.function("compute", &Slicer::compute)
  	.function("reset", &Slicer::reset)
  	;

  class_<SpectralCentroidTime>("SpectralCentroidTime")
  	.constructor<float>()
  	.function("configure", &SpectralCentroidTime::configure)
  	.function("compute", &SpectralCentroidTime::compute)
  	.function("reset", &SpectralCentroidTime::reset)
  	;

  class_<SpectralComplexity>("SpectralComplexity")
  	.constructor<float, float>()
  	.function("configure", &SpectralComplexity::configure)
  	.function("compute", &SpectralComplexity::compute)
  	.function("reset", &SpectralComplexity::reset)
  	;

  class_<SpectralContrast>("SpectralContrast")
  	.constructor<int, float, float, float, int, float, float>()
  	.function("configure", &SpectralContrast::configure)
  	.function("compute", &SpectralContrast::compute)
  	.function("reset", &SpectralContrast::reset)
  	;

  class_<SpectralPeaks>("SpectralPeaks")
  	.constructor<float, float, int, float, std::string, float>()
  	.function("configure", &SpectralPeaks::configure)
  	.function("compute", &SpectralPeaks::compute)
  	.function("reset", &SpectralPeaks::reset)
  	;

  class_<SpectralWhitening>("SpectralWhitening")
  	.constructor<float, float>()
  	.function("configure", &SpectralWhitening::configure)
  	.function("compute", &SpectralWhitening::compute)
  	.function("reset", &SpectralWhitening::reset)
  	;

  class_<Spectrum>("Spectrum")
  	.constructor<int>()
  	.function("configure", &Spectrum::configure)
  	.function("compute", &Spectrum::compute)
  	.function("reset", &Spectrum::reset)
  	;

  class_<SpectrumCQ>("SpectrumCQ")
  	.constructor<int, float, int, int, float, float, float, std::string, bool>()
  	.function("configure", &SpectrumCQ::configure)
  	.function("compute", &SpectrumCQ::compute)
  	.function("reset", &SpectrumCQ::reset)
  	;

  class_<SpectrumToCent>("SpectrumToCent")
  	.constructor<int, float, int, bool, float, std::string, float, std::string>()
  	.function("configure", &SpectrumToCent::configure)
  	.function("compute", &SpectrumToCent::compute)
  	.function("reset", &SpectrumToCent::reset)
  	;

  class_<Spline>("Spline")
  	.constructor<float, float, std::string, std::vector<float>&, std::vector<float>&>()
  	.function("configure", &Spline::configure)
  	.function("compute", &Spline::compute)
  	.function("reset", &Spline::reset)
  	;

  class_<SprModelAnal>("SprModelAnal")
  	.constructor<int, int, float, int, float, float, int, int, float, std::string, float>()
  	.function("configure", &SprModelAnal::configure)
  	.function("compute", &SprModelAnal::compute)
  	.function("reset", &SprModelAnal::reset)
  	;

  class_<SprModelSynth>("SprModelSynth")
  	.constructor<int, int, float>()
  	.function("configure", &SprModelSynth::configure)
  	.function("compute", &SprModelSynth::compute)
  	.function("reset", &SprModelSynth::reset)
  	;

  class_<SpsModelAnal>("SpsModelAnal")
  	.constructor<int, int, float, int, float, float, int, int, float, std::string, float, float>()
  	.function("configure", &SpsModelAnal::configure)
  	.function("compute", &SpsModelAnal::compute)
  	.function("reset", &SpsModelAnal::reset)
  	;

  class_<SpsModelSynth>("SpsModelSynth")
  	.constructor<int, int, float, float>()
  	.function("configure", &SpsModelSynth::configure)
  	.function("compute", &SpsModelSynth::compute)
  	.function("reset", &SpsModelSynth::reset)
  	;

  class_<StartStopCut>("StartStopCut")
  	.constructor<int, int, float, float, float, int>()
  	.function("configure", &StartStopCut::configure)
  	.function("compute", &StartStopCut::compute)
  	.function("reset", &StartStopCut::reset)
  	;

  class_<StartStopSilence>("StartStopSilence")
  	.constructor<int>()
  	.function("configure", &StartStopSilence::configure)
  	.function("compute", &StartStopSilence::compute)
  	.function("reset", &StartStopSilence::reset)
  	;

  class_<StochasticModelAnal>("StochasticModelAnal")
  	.constructor<int, int, float, float>()
  	.function("configure", &StochasticModelAnal::configure)
  	.function("compute", &StochasticModelAnal::compute)
  	.function("reset", &StochasticModelAnal::reset)
  	;

  class_<StochasticModelSynth>("StochasticModelSynth")
  	.constructor<int, int, float, float>()
  	.function("configure", &StochasticModelSynth::configure)
  	.function("compute", &StochasticModelSynth::compute)
  	.function("reset", &StochasticModelSynth::reset)
  	;

  class_<StrongDecay>("StrongDecay")
  	.constructor<float>()
  	.function("configure", &StrongDecay::configure)
  	.function("compute", &StrongDecay::compute)
  	.function("reset", &StrongDecay::reset)
  	;

  class_<StrongPeak>("StrongPeak")
  	.constructor<>()
  	.function("configure", &StrongPeak::configure)
  	.function("compute", &StrongPeak::compute)
  	.function("reset", &StrongPeak::reset)
  	;

  class_<SuperFluxExtractor>("SuperFluxExtractor")
  	.constructor<float, int, int, float, float, float>()
  	.function("configure", &SuperFluxExtractor::configure)
  	.function("compute", &SuperFluxExtractor::compute)
  	.function("reset", &SuperFluxExtractor::reset)
  	;

  class_<SuperFluxNovelty>("SuperFluxNovelty")
  	.constructor<int, int>()
  	.function("configure", &SuperFluxNovelty::configure)
  	.function("compute", &SuperFluxNovelty::compute)
  	.function("reset", &SuperFluxNovelty::reset)
  	;

  class_<SuperFluxPeaks>("SuperFluxPeaks")
  	.constructor<float, float, float, float, float, float>()
  	.function("configure", &SuperFluxPeaks::configure)
  	.function("compute", &SuperFluxPeaks::compute)
  	.function("reset", &SuperFluxPeaks::reset)
  	;

  class_<TCToTotal>("TCToTotal")
  	.constructor<>()
  	.function("configure", &TCToTotal::configure)
  	.function("compute", &TCToTotal::compute)
  	.function("reset", &TCToTotal::reset)
  	;

  class_<TempoScaleBands>("TempoScaleBands")
  	.constructor<std::vector<float>&, float>()
  	.function("configure", &TempoScaleBands::configure)
  	.function("compute", &TempoScaleBands::compute)
  	.function("reset", &TempoScaleBands::reset)
  	;

  class_<TempoTap>("TempoTap")
  	.constructor<int, int, int, int, int, float, std::vector<float>&>()
  	.function("configure", &TempoTap::configure)
  	.function("compute", &TempoTap::compute)
  	.function("reset", &TempoTap::reset)
  	;

  class_<TempoTapDegara>("TempoTapDegara")
  	.constructor<int, int, std::string, float>()
  	.function("configure", &TempoTapDegara::configure)
  	.function("compute", &TempoTapDegara::compute)
  	.function("reset", &TempoTapDegara::reset)
  	;

  class_<TempoTapMaxAgreement>("TempoTapMaxAgreement")
  	.constructor<>()
  	.function("configure", &TempoTapMaxAgreement::configure)
  	.function("compute", &TempoTapMaxAgreement::compute)
  	.function("reset", &TempoTapMaxAgreement::reset)
  	;

  class_<TempoTapTicks>("TempoTapTicks")
  	.constructor<int, int, float>()
  	.function("configure", &TempoTapTicks::configure)
  	.function("compute", &TempoTapTicks::compute)
  	.function("reset", &TempoTapTicks::reset)
  	;

  class_<TensorflowInputFSDSINet>("TensorflowInputFSDSINet")
  	.constructor<>()
  	.function("configure", &TensorflowInputFSDSINet::configure)
  	.function("compute", &TensorflowInputFSDSINet::compute)
  	.function("reset", &TensorflowInputFSDSINet::reset)
  	;

  class_<TensorflowInputMusiCNN>("TensorflowInputMusiCNN")
  	.constructor<>()
  	.function("configure", &TensorflowInputMusiCNN::configure)
  	.function("compute", &TensorflowInputMusiCNN::compute)
  	.function("reset", &TensorflowInputMusiCNN::reset)
  	;

  class_<TensorflowInputTempoCNN>("TensorflowInputTempoCNN")
  	.constructor<>()
  	.function("configure", &TensorflowInputTempoCNN::configure)
  	.function("compute", &TensorflowInputTempoCNN::compute)
  	.function("reset", &TensorflowInputTempoCNN::reset)
  	;

  class_<TensorflowInputVGGish>("TensorflowInputVGGish")
  	.constructor<>()
  	.function("configure", &TensorflowInputVGGish::configure)
  	.function("compute", &TensorflowInputVGGish::compute)
  	.function("reset", &TensorflowInputVGGish::reset)
  	;

  class_<TonalExtractor>("TonalExtractor")
  	.constructor<int, int, float>()
  	.function("configure", &TonalExtractor::configure)
  	.function("compute", &TonalExtractor::compute)
  	.function("reset", &TonalExtractor::reset)
  	;

  class_<TonicIndianArtMusic>("TonicIndianArtMusic")
  	.constructor<float, int, float, int, float, float, float, float, int, int, float, float>()
  	.function("configure", &TonicIndianArtMusic::configure)
  	.function("compute", &TonicIndianArtMusic::compute)
  	.function("reset", &TonicIndianArtMusic::reset)
  	;

  class_<TriangularBands>("TriangularBands")
  	.constructor<std::vector<float>&, int, bool, std::string, float, std::string, std::string>()
  	.function("configure", &TriangularBands::configure)
  	.function("compute", &TriangularBands::compute)
  	.function("reset", &TriangularBands::reset)
  	;

  class_<TriangularBarkBands>("TriangularBarkBands")
  	.constructor<float, int, bool, float, std::string, int, float, std::string, std::string>()
  	.function("configure", &TriangularBarkBands::configure)
  	.function("compute", &TriangularBarkBands::compute)
  	.function("reset", &TriangularBarkBands::reset)
  	;

  class_<Trimmer>("Trimmer")
  	.constructor<bool, float, float, float>()
  	.function("configure", &Trimmer::configure)
  	.function("compute", &Trimmer::compute)
  	.function("reset", &Trimmer::reset)
  	;

  class_<Tristimulus>("Tristimulus")
  	.constructor<>()
  	.function("configure", &Tristimulus::configure)
  	.function("compute", &Tristimulus::compute)
  	.function("reset", &Tristimulus::reset)
  	;

  class_<TruePeakDetector>("TruePeakDetector")
  	.constructor<bool, bool, int, int, float, float, int>()
  	.function("configure", &TruePeakDetector::configure)
  	.function("compute", &TruePeakDetector::compute)
  	.function("reset", &TruePeakDetector::reset)
  	;

  class_<TuningFrequency>("TuningFrequency")
  	.constructor<float>()
  	.function("configure", &TuningFrequency::configure)
  	.function("compute", &TuningFrequency::compute)
  	.function("reset", &TuningFrequency::reset)
  	;

  class_<TuningFrequencyExtractor>("TuningFrequencyExtractor")
  	.constructor<int, int>()
  	.function("configure", &TuningFrequencyExtractor::configure)
  	.function("compute", &TuningFrequencyExtractor::compute)
  	.function("reset", &TuningFrequencyExtractor::reset)
  	;

  class_<UnaryOperator>("UnaryOperator")
  	.constructor<float, float, std::string>()
  	.function("configure", &UnaryOperator::configure)
  	.function("compute", &UnaryOperator::compute)
  	.function("reset", &UnaryOperator::reset)
  	;

  class_<UnaryOperatorStream>("UnaryOperatorStream")
  	.constructor<float, float, std::string>()
  	.function("configure", &UnaryOperatorStream::configure)
  	.function("compute", &UnaryOperatorStream::compute)
  	.function("reset", &UnaryOperatorStream::reset)
  	;

  class_<Variance>("Variance")
  	.constructor<>()
  	.function("configure", &Variance::configure)
  	.function("compute", &Variance::compute)
  	.function("reset", &Variance::reset)
  	;

  class_<Vibrato>("Vibrato")
  	.constructor<float, float, float, float, float>()
  	.function("configure", &Vibrato::configure)
  	.function("compute", &Vibrato::compute)
  	.function("reset", &Vibrato::reset)
  	;

  class_<WarpedAutoCorrelation>("WarpedAutoCorrelation")
  	.constructor<int, float>()
  	.function("configure", &WarpedAutoCorrelation::configure)
  	.function("compute", &WarpedAutoCorrelation::compute)
  	.function("reset", &WarpedAutoCorrelation::reset)
  	;

  class_<Welch>("Welch")
  	.constructor<int, int, int, float, std::string, std::string>()
  	.function("configure", &Welch::configure)
  	.function("compute", &Welch::compute)
  	.function("reset", &Welch::reset)
  	;

  class_<Windowing>("Windowing")
  	.constructor<int, bool, int, bool, bool, std::string, int, bool>()
  	.function("configure", &Windowing::configure)
  	.function("compute", &Windowing::compute)
  	.function("reset", &Windowing::reset)
  	;

  class_<ZeroCrossingRate>("ZeroCrossingRate")
  	.constructor<float>()
  	.function("configure", &ZeroCrossingRate::configure)
  	.function("compute", &ZeroCrossingRate::compute)
  	.function("reset", &ZeroCrossingRate::reset)
  	;
  // utility function to convert a Float32 JS typed array into std::vector<float>
  function("arrayToVector", &float32ArrayToVector);
  // expose stl datatypes to js
  register_vector<int>("VectorInt");
  register_vector<float>("VectorFloat");
  register_vector<double>("VectorDouble");
  register_vector<std::string>("VectorString");
  register_vector<std::vector<float>>("VectorVectorFloat");
  register_vector<std::vector<double>>("VectorVectorDouble");
}
