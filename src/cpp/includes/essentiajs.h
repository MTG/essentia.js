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

// NOTE: This source code is machine-generated.

#ifndef ESSENTIAJS_H
#define ESSENTIAJS_H

#include <vector>
#include <essentia/algorithmfactory.h>
#include <essentia/essentiamath.h>
#include <emscripten/bind.h>

using namespace essentia;
using namespace essentia::standard;
using namespace emscripten;

void _initEssentia(bool debugger=false);

// method for generating frames from a given audio signal
class FrameGenerator {
  public:
    FrameGenerator(int frameSize=1024, int hopSize=512);
    ~FrameGenerator();
    void configure(int frameSize=1024, int hopSize=512);
    std::vector< std::vector<float> > compute(const val& signalArray);
    void reset();
  private:
    Algorithm* _framecutter;
};

// val MonoMixer(std::vector<float>& left_channel, std::vector<float>& right_channel);
// val LoudnessEBUR128();
class LoudnessEBUR128 {
  public:
    LoudnessEBUR128(const float hopSize=0.1, const float sampleRate=44100, const bool startAtZero=false);
    ~LoudnessEBUR128();
    void configure(const float hopSize=0.1, const float sampleRate=44100, const bool startAtZero=false);
    val compute(std::vector<float>& left_channel, std::vector<float>& right_channel);
    void reset();
  private:
    Algorithm* _algoStereoMuxer;
    Algorithm* _algoLoudnessEBUR128;
};
// NOTE: The following code snippets are machine generated. Do not edit.    
 
// class property which stores all the list of essentia algorithm names available in essentia.js
const std::string ALGORITHM_NAMES = "['AfterMaxToBeforeMaxEnergyRatio', 'AllPass', 'AudioOnsetsMarker', 'AutoCorrelation', 'BFCC', 'BPF', 'BandPass', 'BandReject', 'BarkBands', 'BeatTrackerDegara', 'BeatTrackerMultiFeature', 'Beatogram', 'BeatsLoudness', 'BinaryOperator', 'BinaryOperatorStream', 'BpmHistogramDescriptors', 'BpmRubato', 'CentralMoments', 'Centroid', 'ChordsDescriptors', 'ChordsDetection', 'ChordsDetectionBeats', 'ChromaCrossSimilarity', 'Chromagram', 'ClickDetector', 'Clipper', 'CoverSongSimilarity', 'Crest', 'CrossCorrelation', 'CrossSimilarityMatrix', 'CubicSpline', 'DCRemoval', 'DCT', 'Danceability', 'Decrease', 'Derivative', 'DerivativeSFX', 'DiscontinuityDetector', 'Dissonance', 'DistributionShape', 'Duration', 'DynamicComplexity', 'ERBBands', 'EffectiveDuration', 'Energy', 'EnergyBand', 'EnergyBandRatio', 'Entropy', 'Envelope', 'EqualLoudness', 'Flatness', 'FlatnessDB', 'FlatnessSFX', 'Flux', 'FrameCutter', 'FrameToReal', 'FrequencyBands', 'GFCC', 'GapsDetector', 'GeometricMean', 'HFC', 'HPCP', 'HarmonicBpm', 'HarmonicPeaks', 'HighPass', 'HighResolutionFeatures', 'Histogram', 'HprModelAnal', 'HpsModelAnal', 'IDCT', 'IIR', 'Inharmonicity', 'InstantPower', 'Intensity', 'Key', 'KeyExtractor', 'LPC', 'Larm', 'Leq', 'LevelExtractor', 'LogAttackTime', 'LogSpectrum', 'LoopBpmConfidence', 'LoopBpmEstimator', 'Loudness', 'LoudnessVickers', 'LowLevelSpectralEqloudExtractor', 'LowLevelSpectralExtractor', 'LowPass', 'MFCC', 'MaxFilter', 'MaxMagFreq', 'MaxToTotal', 'Mean', 'Median', 'MedianFilter', 'MelBands', 'Meter', 'MinMax', 'MinToTotal', 'MovingAverage', 'MultiPitchKlapuri', 'MultiPitchMelodia', 'Multiplexer', 'NNLSChroma', 'NoiseAdder', 'NoiseBurstDetector', 'NoveltyCurve', 'NoveltyCurveFixedBpmEstimator', 'OddToEvenHarmonicEnergyRatio', 'OnsetDetection', 'OnsetDetectionGlobal', 'OnsetRate', 'OverlapAdd', 'PeakDetection', 'PercivalBpmEstimator', 'PercivalEnhanceHarmonics', 'PercivalEvaluatePulseTrains', 'PitchContourSegmentation', 'PitchContours', 'PitchContoursMelody', 'PitchContoursMonoMelody', 'PitchContoursMultiMelody', 'PitchFilter', 'PitchMelodia', 'PitchSalience', 'PitchSalienceFunction', 'PitchSalienceFunctionPeaks', 'PitchYin', 'PitchYinFFT', 'PitchYinProbabilistic', 'PitchYinProbabilities', 'PitchYinProbabilitiesHMM', 'PowerMean', 'PowerSpectrum', 'PredominantPitchMelodia', 'RMS', 'RawMoments', 'ReplayGain', 'Resample', 'ResampleFFT', 'RhythmDescriptors', 'RhythmExtractor', 'RhythmExtractor2013', 'RhythmTransform', 'RollOff', 'SNR', 'SaturationDetector', 'Scale', 'SineSubtraction', 'SingleBeatLoudness', 'Slicer', 'SpectralCentroidTime', 'SpectralComplexity', 'SpectralContrast', 'SpectralPeaks', 'SpectralWhitening', 'Spectrum', 'SpectrumCQ', 'SpectrumToCent', 'Spline', 'SprModelAnal', 'SprModelSynth', 'SpsModelAnal', 'SpsModelSynth', 'StartStopCut', 'StartStopSilence', 'StochasticModelAnal', 'StochasticModelSynth', 'StrongDecay', 'StrongPeak', 'SuperFluxExtractor', 'SuperFluxNovelty', 'SuperFluxPeaks', 'TCToTotal', 'TempoScaleBands', 'TempoTap', 'TempoTapDegara', 'TempoTapMaxAgreement', 'TempoTapTicks', 'TensorflowInputFSDSINet', 'TensorflowInputMusiCNN', 'TensorflowInputTempoCNN', 'TensorflowInputVGGish', 'TonalExtractor', 'TonicIndianArtMusic', 'TriangularBands', 'TriangularBarkBands', 'Trimmer', 'Tristimulus', 'TruePeakDetector', 'TuningFrequency', 'TuningFrequencyExtractor', 'UnaryOperator', 'UnaryOperatorStream', 'Variance', 'Vibrato', 'WarpedAutoCorrelation', 'Welch', 'Windowing', 'ZeroCrossingRate']";
// class methods to call various essentia algorithms

class AfterMaxToBeforeMaxEnergyRatio {
	public:
		AfterMaxToBeforeMaxEnergyRatio();
		~AfterMaxToBeforeMaxEnergyRatio();
		void configure();
		val compute(std::vector<float>& input_pitch);
		void reset();
	private:
		Algorithm* _aftermaxtobeforemaxenergyratio;
};

class AllPass {
	public:
		AllPass(const float bandwidth=500, const float cutoffFrequency=1500, const int order=1, const float sampleRate=44100);
		~AllPass();
		void configure(const float bandwidth=500, const float cutoffFrequency=1500, const int order=1, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _allpass;
};

class AudioOnsetsMarker {
	public:
		AudioOnsetsMarker(const std::vector<float>& onsets=std::vector<float>(), const float sampleRate=44100, const std::string& type="beep");
		~AudioOnsetsMarker();
		void configure(const std::vector<float>& onsets=std::vector<float>(), const float sampleRate=44100, const std::string& type="beep");
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _audioonsetsmarker;
};

class AutoCorrelation {
	public:
		AutoCorrelation(const float frequencyDomainCompression=0.5, const bool generalized=false, const std::string& normalization="standard");
		~AutoCorrelation();
		void configure(const float frequencyDomainCompression=0.5, const bool generalized=false, const std::string& normalization="standard");
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _autocorrelation;
};

class BFCC {
	public:
		BFCC(const int dctType=2, const float highFrequencyBound=11000, const int inputSize=1025, const int liftering=0, const std::string& logType="dbamp", const float lowFrequencyBound=0, const std::string& normalize="unit_sum", const int numberBands=40, const int numberCoefficients=13, const float sampleRate=44100, const std::string& type="power", const std::string& weighting="warping");
		~BFCC();
		void configure(const int dctType=2, const float highFrequencyBound=11000, const int inputSize=1025, const int liftering=0, const std::string& logType="dbamp", const float lowFrequencyBound=0, const std::string& normalize="unit_sum", const int numberBands=40, const int numberCoefficients=13, const float sampleRate=44100, const std::string& type="power", const std::string& weighting="warping");
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _bfcc;
};

class BPF {
	public:
		BPF(const std::vector<float>& xPoints=std::vector<float>{0, 1}, const std::vector<float>& yPoints=std::vector<float>{0, 1});
		~BPF();
		void configure(const std::vector<float>& xPoints=std::vector<float>{0, 1}, const std::vector<float>& yPoints=std::vector<float>{0, 1});
		val compute(float input_x);
		void reset();
	private:
		Algorithm* _bpf;
};

class BandPass {
	public:
		BandPass(const float bandwidth=500, const float cutoffFrequency=1500, const float sampleRate=44100);
		~BandPass();
		void configure(const float bandwidth=500, const float cutoffFrequency=1500, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _bandpass;
};

class BandReject {
	public:
		BandReject(const float bandwidth=500, const float cutoffFrequency=1500, const float sampleRate=44100);
		~BandReject();
		void configure(const float bandwidth=500, const float cutoffFrequency=1500, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _bandreject;
};

class BarkBands {
	public:
		BarkBands(const int numberBands=27, const float sampleRate=44100);
		~BarkBands();
		void configure(const int numberBands=27, const float sampleRate=44100);
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _barkbands;
};

class BeatTrackerDegara {
	public:
		BeatTrackerDegara(const int maxTempo=208, const int minTempo=40);
		~BeatTrackerDegara();
		void configure(const int maxTempo=208, const int minTempo=40);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _beattrackerdegara;
};

class BeatTrackerMultiFeature {
	public:
		BeatTrackerMultiFeature(const int maxTempo=208, const int minTempo=40);
		~BeatTrackerMultiFeature();
		void configure(const int maxTempo=208, const int minTempo=40);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _beattrackermultifeature;
};

class Beatogram {
	public:
		Beatogram(const int size=16);
		~Beatogram();
		void configure(const int size=16);
		val compute(std::vector<float>& input_loudness, std::vector<std::vector<float> >& input_loudnessBandRatio);
		void reset();
	private:
		Algorithm* _beatogram;
};

class BeatsLoudness {
	public:
		BeatsLoudness(const float beatDuration=0.05, const float beatWindowDuration=0.1, const std::vector<float>& beats=std::vector<float>(), const std::vector<float>& frequencyBands=std::vector<float>{20, 150, 400, 3200, 7000, 22000}, const float sampleRate=44100);
		~BeatsLoudness();
		void configure(const float beatDuration=0.05, const float beatWindowDuration=0.1, const std::vector<float>& beats=std::vector<float>(), const std::vector<float>& frequencyBands=std::vector<float>{20, 150, 400, 3200, 7000, 22000}, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _beatsloudness;
};

class BinaryOperator {
	public:
		BinaryOperator(const std::string& type="add");
		~BinaryOperator();
		void configure(const std::string& type="add");
		val compute(std::vector<float>& input_array1, std::vector<float>& input_array2);
		void reset();
	private:
		Algorithm* _binaryoperator;
};

class BinaryOperatorStream {
	public:
		BinaryOperatorStream(const std::string& type="add");
		~BinaryOperatorStream();
		void configure(const std::string& type="add");
		val compute(std::vector<float>& input_array1, std::vector<float>& input_array2);
		void reset();
	private:
		Algorithm* _binaryoperatorstream;
};

class BpmHistogramDescriptors {
	public:
		BpmHistogramDescriptors();
		~BpmHistogramDescriptors();
		void configure();
		val compute(std::vector<float>& input_bpmIntervals);
		void reset();
	private:
		Algorithm* _bpmhistogramdescriptors;
};

class BpmRubato {
	public:
		BpmRubato(const float longRegionsPruningTime=20, const float shortRegionsMergingTime=4, const float tolerance=0.08);
		~BpmRubato();
		void configure(const float longRegionsPruningTime=20, const float shortRegionsMergingTime=4, const float tolerance=0.08);
		val compute(std::vector<float>& input_beats);
		void reset();
	private:
		Algorithm* _bpmrubato;
};

class CentralMoments {
	public:
		CentralMoments(const std::string& mode="pdf", const float range=1);
		~CentralMoments();
		void configure(const std::string& mode="pdf", const float range=1);
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _centralmoments;
};

class Centroid {
	public:
		Centroid(const float range=1);
		~Centroid();
		void configure(const float range=1);
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _centroid;
};

class ChordsDescriptors {
	public:
		ChordsDescriptors();
		~ChordsDescriptors();
		void configure();
		val compute(std::vector<std::string> input_chords, std::string input_key, std::string input_scale);
		void reset();
	private:
		Algorithm* _chordsdescriptors;
};

class ChordsDetection {
	public:
		ChordsDetection(const int hopSize=2048, const float sampleRate=44100, const float windowSize=2);
		~ChordsDetection();
		void configure(const int hopSize=2048, const float sampleRate=44100, const float windowSize=2);
		val compute(std::vector<std::vector<float> >& input_pcp);
		void reset();
	private:
		Algorithm* _chordsdetection;
};

class ChordsDetectionBeats {
	public:
		ChordsDetectionBeats(const std::string& chromaPick="interbeat_median", const int hopSize=2048, const float sampleRate=44100);
		~ChordsDetectionBeats();
		void configure(const std::string& chromaPick="interbeat_median", const int hopSize=2048, const float sampleRate=44100);
		val compute(std::vector<std::vector<float> >& input_pcp, std::vector<float>& input_ticks);
		void reset();
	private:
		Algorithm* _chordsdetectionbeats;
};

class ChromaCrossSimilarity {
	public:
		ChromaCrossSimilarity(const float binarizePercentile=0.095, const int frameStackSize=9, const int frameStackStride=1, const int noti=12, const bool oti=true, const bool otiBinary=false, const bool streaming=false);
		~ChromaCrossSimilarity();
		void configure(const float binarizePercentile=0.095, const int frameStackSize=9, const int frameStackStride=1, const int noti=12, const bool oti=true, const bool otiBinary=false, const bool streaming=false);
		val compute(std::vector<std::vector<float> >& input_queryFeature, std::vector<std::vector<float> >& input_referenceFeature);
		void reset();
	private:
		Algorithm* _chromacrosssimilarity;
};

class Chromagram {
	public:
		Chromagram(const int binsPerOctave=12, const float minFrequency=32.7, const int minimumKernelSize=4, const std::string& normalizeType="unit_max", const int numberBins=84, const float sampleRate=44100, const float scale=1, const float threshold=0.01, const std::string& windowType="hann", const bool zeroPhase=true);
		~Chromagram();
		void configure(const int binsPerOctave=12, const float minFrequency=32.7, const int minimumKernelSize=4, const std::string& normalizeType="unit_max", const int numberBins=84, const float sampleRate=44100, const float scale=1, const float threshold=0.01, const std::string& windowType="hann", const bool zeroPhase=true);
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _chromagram;
};

class ClickDetector {
	public:
		ClickDetector(const float detectionThreshold=30, const int frameSize=512, const int hopSize=256, const int order=12, const int powerEstimationThreshold=10, const float sampleRate=44100, const int silenceThreshold=-50);
		~ClickDetector();
		void configure(const float detectionThreshold=30, const int frameSize=512, const int hopSize=256, const int order=12, const int powerEstimationThreshold=10, const float sampleRate=44100, const int silenceThreshold=-50);
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _clickdetector;
};

class Clipper {
	public:
		Clipper(const float max=1, const float min=-1);
		~Clipper();
		void configure(const float max=1, const float min=-1);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _clipper;
};

class CoverSongSimilarity {
	public:
		CoverSongSimilarity(const std::string& alignmentType="serra09", const float disExtension=0.5, const float disOnset=0.5, const std::string& distanceType="asymmetric");
		~CoverSongSimilarity();
		void configure(const std::string& alignmentType="serra09", const float disExtension=0.5, const float disOnset=0.5, const std::string& distanceType="asymmetric");
		val compute(std::vector<std::vector<float> >& input_inputArray);
		void reset();
	private:
		Algorithm* _coversongsimilarity;
};

class Crest {
	public:
		Crest();
		~Crest();
		void configure();
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _crest;
};

class CrossCorrelation {
	public:
		CrossCorrelation(const int maxLag=1, const int minLag=0);
		~CrossCorrelation();
		void configure(const int maxLag=1, const int minLag=0);
		val compute(std::vector<float>& input_arrayX, std::vector<float>& input_arrayY);
		void reset();
	private:
		Algorithm* _crosscorrelation;
};

class CrossSimilarityMatrix {
	public:
		CrossSimilarityMatrix(const bool binarize=false, const float binarizePercentile=0.095, const int frameStackSize=1, const int frameStackStride=1);
		~CrossSimilarityMatrix();
		void configure(const bool binarize=false, const float binarizePercentile=0.095, const int frameStackSize=1, const int frameStackStride=1);
		val compute(std::vector<std::vector<float> >& input_queryFeature, std::vector<std::vector<float> >& input_referenceFeature);
		void reset();
	private:
		Algorithm* _crosssimilaritymatrix;
};

class CubicSpline {
	public:
		CubicSpline(const int leftBoundaryFlag=0, const float leftBoundaryValue=0, const int rightBoundaryFlag=0, const float rightBoundaryValue=0, const std::vector<float>& xPoints=std::vector<float>{0, 1}, const std::vector<float>& yPoints=std::vector<float>{0, 1});
		~CubicSpline();
		void configure(const int leftBoundaryFlag=0, const float leftBoundaryValue=0, const int rightBoundaryFlag=0, const float rightBoundaryValue=0, const std::vector<float>& xPoints=std::vector<float>{0, 1}, const std::vector<float>& yPoints=std::vector<float>{0, 1});
		val compute(float input_x);
		void reset();
	private:
		Algorithm* _cubicspline;
};

class DCRemoval {
	public:
		DCRemoval(const float cutoffFrequency=40, const float sampleRate=44100);
		~DCRemoval();
		void configure(const float cutoffFrequency=40, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _dcremoval;
};

class DCT {
	public:
		DCT(const int dctType=2, const int inputSize=10, const int liftering=0, const int outputSize=10);
		~DCT();
		void configure(const int dctType=2, const int inputSize=10, const int liftering=0, const int outputSize=10);
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _dct;
};

class Danceability {
	public:
		Danceability(const float maxTau=8800, const float minTau=310, const float sampleRate=44100, const float tauMultiplier=1.1);
		~Danceability();
		void configure(const float maxTau=8800, const float minTau=310, const float sampleRate=44100, const float tauMultiplier=1.1);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _danceability;
};

class Decrease {
	public:
		Decrease(const float range=1);
		~Decrease();
		void configure(const float range=1);
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _decrease;
};

class Derivative {
	public:
		Derivative();
		~Derivative();
		void configure();
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _derivative;
};

class DerivativeSFX {
	public:
		DerivativeSFX();
		~DerivativeSFX();
		void configure();
		val compute(std::vector<float>& input_envelope);
		void reset();
	private:
		Algorithm* _derivativesfx;
};

class DiscontinuityDetector {
	public:
		DiscontinuityDetector(const float detectionThreshold=8, const float energyThreshold=-60, const int frameSize=512, const int hopSize=256, const int kernelSize=7, const int order=3, const int silenceThreshold=-50, const int subFrameSize=32);
		~DiscontinuityDetector();
		void configure(const float detectionThreshold=8, const float energyThreshold=-60, const int frameSize=512, const int hopSize=256, const int kernelSize=7, const int order=3, const int silenceThreshold=-50, const int subFrameSize=32);
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _discontinuitydetector;
};

class Dissonance {
	public:
		Dissonance();
		~Dissonance();
		void configure();
		val compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes);
		void reset();
	private:
		Algorithm* _dissonance;
};

class DistributionShape {
	public:
		DistributionShape();
		~DistributionShape();
		void configure();
		val compute(std::vector<float>& input_centralMoments);
		void reset();
	private:
		Algorithm* _distributionshape;
};

class Duration {
	public:
		Duration(const float sampleRate=44100);
		~Duration();
		void configure(const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _duration;
};

class DynamicComplexity {
	public:
		DynamicComplexity(const float frameSize=0.2, const float sampleRate=44100);
		~DynamicComplexity();
		void configure(const float frameSize=0.2, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _dynamiccomplexity;
};

class ERBBands {
	public:
		ERBBands(const float highFrequencyBound=22050, const int inputSize=1025, const float lowFrequencyBound=50, const int numberBands=40, const float sampleRate=44100, const std::string& type="power", const float width=1);
		~ERBBands();
		void configure(const float highFrequencyBound=22050, const int inputSize=1025, const float lowFrequencyBound=50, const int numberBands=40, const float sampleRate=44100, const std::string& type="power", const float width=1);
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _erbbands;
};

class EffectiveDuration {
	public:
		EffectiveDuration(const float sampleRate=44100, const float thresholdRatio=0.4);
		~EffectiveDuration();
		void configure(const float sampleRate=44100, const float thresholdRatio=0.4);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _effectiveduration;
};

class Energy {
	public:
		Energy();
		~Energy();
		void configure();
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _energy;
};

class EnergyBand {
	public:
		EnergyBand(const float sampleRate=44100, const float startCutoffFrequency=0, const float stopCutoffFrequency=100);
		~EnergyBand();
		void configure(const float sampleRate=44100, const float startCutoffFrequency=0, const float stopCutoffFrequency=100);
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _energyband;
};

class EnergyBandRatio {
	public:
		EnergyBandRatio(const float sampleRate=44100, const float startFrequency=0, const float stopFrequency=100);
		~EnergyBandRatio();
		void configure(const float sampleRate=44100, const float startFrequency=0, const float stopFrequency=100);
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _energybandratio;
};

class Entropy {
	public:
		Entropy();
		~Entropy();
		void configure();
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _entropy;
};

class Envelope {
	public:
		Envelope(const bool applyRectification=true, const float attackTime=10, const float releaseTime=1500, const float sampleRate=44100);
		~Envelope();
		void configure(const bool applyRectification=true, const float attackTime=10, const float releaseTime=1500, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _envelope;
};

class EqualLoudness {
	public:
		EqualLoudness(const float sampleRate=44100);
		~EqualLoudness();
		void configure(const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _equalloudness;
};

class Flatness {
	public:
		Flatness();
		~Flatness();
		void configure();
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _flatness;
};

class FlatnessDB {
	public:
		FlatnessDB();
		~FlatnessDB();
		void configure();
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _flatnessdb;
};

class FlatnessSFX {
	public:
		FlatnessSFX();
		~FlatnessSFX();
		void configure();
		val compute(std::vector<float>& input_envelope);
		void reset();
	private:
		Algorithm* _flatnesssfx;
};

class Flux {
	public:
		Flux(const bool halfRectify=false, const std::string& norm="L2");
		~Flux();
		void configure(const bool halfRectify=false, const std::string& norm="L2");
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _flux;
};

class FrameCutter {
	public:
		FrameCutter(const int frameSize=1024, const int hopSize=512, const bool lastFrameToEndOfFile=false, const bool startFromZero=false, const float validFrameThresholdRatio=0);
		~FrameCutter();
		void configure(const int frameSize=1024, const int hopSize=512, const bool lastFrameToEndOfFile=false, const bool startFromZero=false, const float validFrameThresholdRatio=0);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _framecutter;
};

class FrameToReal {
	public:
		FrameToReal(const int frameSize=2048, const int hopSize=128);
		~FrameToReal();
		void configure(const int frameSize=2048, const int hopSize=128);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _frametoreal;
};

class FrequencyBands {
	public:
		FrequencyBands(const std::vector<float>& frequencyBands=std::vector<float>{0, 50, 100, 150, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320, 2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 20500, 27000}, const float sampleRate=44100);
		~FrequencyBands();
		void configure(const std::vector<float>& frequencyBands=std::vector<float>{0, 50, 100, 150, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320, 2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 20500, 27000}, const float sampleRate=44100);
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _frequencybands;
};

class GFCC {
	public:
		GFCC(const int dctType=2, const float highFrequencyBound=22050, const int inputSize=1025, const std::string& logType="dbamp", const float lowFrequencyBound=40, const int numberBands=40, const int numberCoefficients=13, const float sampleRate=44100, const float silenceThreshold=1e-10, const std::string& type="power");
		~GFCC();
		void configure(const int dctType=2, const float highFrequencyBound=22050, const int inputSize=1025, const std::string& logType="dbamp", const float lowFrequencyBound=40, const int numberBands=40, const int numberCoefficients=13, const float sampleRate=44100, const float silenceThreshold=1e-10, const std::string& type="power");
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _gfcc;
};

class GapsDetector {
	public:
		GapsDetector(const float attackTime=0.05, const int frameSize=2048, const int hopSize=1024, const int kernelSize=11, const float maximumTime=3500, const float minimumTime=10, const float postpowerTime=40, const float prepowerThreshold=-30, const float prepowerTime=40, const float releaseTime=0.05, const float sampleRate=44100, const float silenceThreshold=-50);
		~GapsDetector();
		void configure(const float attackTime=0.05, const int frameSize=2048, const int hopSize=1024, const int kernelSize=11, const float maximumTime=3500, const float minimumTime=10, const float postpowerTime=40, const float prepowerThreshold=-30, const float prepowerTime=40, const float releaseTime=0.05, const float sampleRate=44100, const float silenceThreshold=-50);
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _gapsdetector;
};

class GeometricMean {
	public:
		GeometricMean();
		~GeometricMean();
		void configure();
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _geometricmean;
};

class HFC {
	public:
		HFC(const float sampleRate=44100, const std::string& type="Masri");
		~HFC();
		void configure(const float sampleRate=44100, const std::string& type="Masri");
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _hfc;
};

class HPCP {
	public:
		HPCP(const bool bandPreset=true, const float bandSplitFrequency=500, const int harmonics=0, const float maxFrequency=5000, const bool maxShifted=false, const float minFrequency=40, const bool nonLinear=false, const std::string& normalized="unitMax", const float referenceFrequency=440, const float sampleRate=44100, const int size=12, const std::string& weightType="squaredCosine", const float windowSize=1);
		~HPCP();
		void configure(const bool bandPreset=true, const float bandSplitFrequency=500, const int harmonics=0, const float maxFrequency=5000, const bool maxShifted=false, const float minFrequency=40, const bool nonLinear=false, const std::string& normalized="unitMax", const float referenceFrequency=440, const float sampleRate=44100, const int size=12, const std::string& weightType="squaredCosine", const float windowSize=1);
		val compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes);
		void reset();
	private:
		Algorithm* _hpcp;
};

class HarmonicBpm {
	public:
		HarmonicBpm(const float bpm=60, const float threshold=20, const float tolerance=5);
		~HarmonicBpm();
		void configure(const float bpm=60, const float threshold=20, const float tolerance=5);
		val compute(std::vector<float>& input_bpms);
		void reset();
	private:
		Algorithm* _harmonicbpm;
};

class HarmonicPeaks {
	public:
		HarmonicPeaks(const int maxHarmonics=20, const float tolerance=0.2);
		~HarmonicPeaks();
		void configure(const int maxHarmonics=20, const float tolerance=0.2);
		val compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, float input_pitch);
		void reset();
	private:
		Algorithm* _harmonicpeaks;
};

class HighPass {
	public:
		HighPass(const float cutoffFrequency=1500, const float sampleRate=44100);
		~HighPass();
		void configure(const float cutoffFrequency=1500, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _highpass;
};

class HighResolutionFeatures {
	public:
		HighResolutionFeatures(const int maxPeaks=24);
		~HighResolutionFeatures();
		void configure(const int maxPeaks=24);
		val compute(std::vector<float>& input_hpcp);
		void reset();
	private:
		Algorithm* _highresolutionfeatures;
};

class Histogram {
	public:
		Histogram(const float maxValue=1, const float minValue=0, const std::string& normalize="none", const int numberBins=10);
		~Histogram();
		void configure(const float maxValue=1, const float minValue=0, const std::string& normalize="none", const int numberBins=10);
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _histogram;
};

class HprModelAnal {
	public:
		HprModelAnal(const int fftSize=2048, const int freqDevOffset=20, const float freqDevSlope=0.01, const float harmDevSlope=0.01, const int hopSize=512, const float magnitudeThreshold=0, const float maxFrequency=5000, const int maxPeaks=100, const int maxnSines=100, const float minFrequency=20, const int nHarmonics=100, const std::string& orderBy="frequency", const float sampleRate=44100, const float stocf=0.2);
		~HprModelAnal();
		void configure(const int fftSize=2048, const int freqDevOffset=20, const float freqDevSlope=0.01, const float harmDevSlope=0.01, const int hopSize=512, const float magnitudeThreshold=0, const float maxFrequency=5000, const int maxPeaks=100, const int maxnSines=100, const float minFrequency=20, const int nHarmonics=100, const std::string& orderBy="frequency", const float sampleRate=44100, const float stocf=0.2);
		val compute(std::vector<float>& input_frame, float input_pitch);
		void reset();
	private:
		Algorithm* _hprmodelanal;
};

class HpsModelAnal {
	public:
		HpsModelAnal(const int fftSize=2048, const int freqDevOffset=20, const float freqDevSlope=0.01, const float harmDevSlope=0.01, const int hopSize=512, const float magnitudeThreshold=0, const float maxFrequency=5000, const int maxPeaks=100, const int maxnSines=100, const float minFrequency=20, const int nHarmonics=100, const std::string& orderBy="frequency", const float sampleRate=44100, const float stocf=0.2);
		~HpsModelAnal();
		void configure(const int fftSize=2048, const int freqDevOffset=20, const float freqDevSlope=0.01, const float harmDevSlope=0.01, const int hopSize=512, const float magnitudeThreshold=0, const float maxFrequency=5000, const int maxPeaks=100, const int maxnSines=100, const float minFrequency=20, const int nHarmonics=100, const std::string& orderBy="frequency", const float sampleRate=44100, const float stocf=0.2);
		val compute(std::vector<float>& input_frame, float input_pitch);
		void reset();
	private:
		Algorithm* _hpsmodelanal;
};

class IDCT {
	public:
		IDCT(const int dctType=2, const int inputSize=10, const int liftering=0, const int outputSize=10);
		~IDCT();
		void configure(const int dctType=2, const int inputSize=10, const int liftering=0, const int outputSize=10);
		val compute(std::vector<float>& input_dct);
		void reset();
	private:
		Algorithm* _idct;
};

class IIR {
	public:
		IIR(const std::vector<float>& denominator=std::vector<float>{1}, const std::vector<float>& numerator=std::vector<float>{1});
		~IIR();
		void configure(const std::vector<float>& denominator=std::vector<float>{1}, const std::vector<float>& numerator=std::vector<float>{1});
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _iir;
};

class Inharmonicity {
	public:
		Inharmonicity();
		~Inharmonicity();
		void configure();
		val compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes);
		void reset();
	private:
		Algorithm* _inharmonicity;
};

class InstantPower {
	public:
		InstantPower();
		~InstantPower();
		void configure();
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _instantpower;
};

class Intensity {
	public:
		Intensity(const float sampleRate=44100);
		~Intensity();
		void configure(const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _intensity;
};

class Key {
	public:
		Key(const int numHarmonics=4, const int pcpSize=36, const std::string& profileType="bgate", const float slope=0.6, const bool useMajMin=false, const bool usePolyphony=true, const bool useThreeChords=true);
		~Key();
		void configure(const int numHarmonics=4, const int pcpSize=36, const std::string& profileType="bgate", const float slope=0.6, const bool useMajMin=false, const bool usePolyphony=true, const bool useThreeChords=true);
		val compute(std::vector<float>& input_pcp);
		void reset();
	private:
		Algorithm* _key;
};

class KeyExtractor {
	public:
		KeyExtractor(const bool averageDetuningCorrection=true, const int frameSize=4096, const int hopSize=4096, const int hpcpSize=12, const float maxFrequency=3500, const int maximumSpectralPeaks=60, const float minFrequency=25, const float pcpThreshold=0.2, const std::string& profileType="bgate", const float sampleRate=44100, const float spectralPeaksThreshold=0.0001, const float tuningFrequency=440, const std::string& weightType="cosine", const std::string& windowType="hann");
		~KeyExtractor();
		void configure(const bool averageDetuningCorrection=true, const int frameSize=4096, const int hopSize=4096, const int hpcpSize=12, const float maxFrequency=3500, const int maximumSpectralPeaks=60, const float minFrequency=25, const float pcpThreshold=0.2, const std::string& profileType="bgate", const float sampleRate=44100, const float spectralPeaksThreshold=0.0001, const float tuningFrequency=440, const std::string& weightType="cosine", const std::string& windowType="hann");
		val compute(std::vector<float>& input_audio);
		void reset();
	private:
		Algorithm* _keyextractor;
};

class LPC {
	public:
		LPC(const int order=10, const float sampleRate=44100, const std::string& type="regular");
		~LPC();
		void configure(const int order=10, const float sampleRate=44100, const std::string& type="regular");
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _lpc;
};

class Larm {
	public:
		Larm(const float attackTime=10, const float power=1.5, const float releaseTime=1500, const float sampleRate=44100);
		~Larm();
		void configure(const float attackTime=10, const float power=1.5, const float releaseTime=1500, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _larm;
};

class Leq {
	public:
		Leq();
		~Leq();
		void configure();
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _leq;
};

class LevelExtractor {
	public:
		LevelExtractor(const int frameSize=88200, const int hopSize=44100);
		~LevelExtractor();
		void configure(const int frameSize=88200, const int hopSize=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _levelextractor;
};

class LogAttackTime {
	public:
		LogAttackTime(const float sampleRate=44100, const float startAttackThreshold=0.2, const float stopAttackThreshold=0.9);
		~LogAttackTime();
		void configure(const float sampleRate=44100, const float startAttackThreshold=0.2, const float stopAttackThreshold=0.9);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _logattacktime;
};

class LogSpectrum {
	public:
		LogSpectrum(const float binsPerSemitone=3, const int frameSize=1025, const int nOctave=7, const float rollOn=0, const float sampleRate=44100);
		~LogSpectrum();
		void configure(const float binsPerSemitone=3, const int frameSize=1025, const int nOctave=7, const float rollOn=0, const float sampleRate=44100);
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _logspectrum;
};

class LoopBpmConfidence {
	public:
		LoopBpmConfidence(const float sampleRate=44100);
		~LoopBpmConfidence();
		void configure(const float sampleRate=44100);
		val compute(std::vector<float>& input_signal, float input_bpmEstimate);
		void reset();
	private:
		Algorithm* _loopbpmconfidence;
};

class LoopBpmEstimator {
	public:
		LoopBpmEstimator(const float confidenceThreshold=0.95);
		~LoopBpmEstimator();
		void configure(const float confidenceThreshold=0.95);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _loopbpmestimator;
};

class Loudness {
	public:
		Loudness();
		~Loudness();
		void configure();
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _loudness;
};

class LoudnessVickers {
	public:
		LoudnessVickers(const float sampleRate=44100);
		~LoudnessVickers();
		void configure(const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _loudnessvickers;
};

class LowLevelSpectralEqloudExtractor {
	public:
		LowLevelSpectralEqloudExtractor(const int frameSize=2048, const int hopSize=1024, const float sampleRate=44100);
		~LowLevelSpectralEqloudExtractor();
		void configure(const int frameSize=2048, const int hopSize=1024, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _lowlevelspectraleqloudextractor;
};

class LowLevelSpectralExtractor {
	public:
		LowLevelSpectralExtractor(const int frameSize=2048, const int hopSize=1024, const float sampleRate=44100);
		~LowLevelSpectralExtractor();
		void configure(const int frameSize=2048, const int hopSize=1024, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _lowlevelspectralextractor;
};

class LowPass {
	public:
		LowPass(const float cutoffFrequency=1500, const float sampleRate=44100);
		~LowPass();
		void configure(const float cutoffFrequency=1500, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _lowpass;
};

class MFCC {
	public:
		MFCC(const int dctType=2, const float highFrequencyBound=11000, const int inputSize=1025, const int liftering=0, const std::string& logType="dbamp", const float lowFrequencyBound=0, const std::string& normalize="unit_sum", const int numberBands=40, const int numberCoefficients=13, const float sampleRate=44100, const float silenceThreshold=1e-10, const std::string& type="power", const std::string& warpingFormula="htkMel", const std::string& weighting="warping");
		~MFCC();
		void configure(const int dctType=2, const float highFrequencyBound=11000, const int inputSize=1025, const int liftering=0, const std::string& logType="dbamp", const float lowFrequencyBound=0, const std::string& normalize="unit_sum", const int numberBands=40, const int numberCoefficients=13, const float sampleRate=44100, const float silenceThreshold=1e-10, const std::string& type="power", const std::string& warpingFormula="htkMel", const std::string& weighting="warping");
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _mfcc;
};

class MaxFilter {
	public:
		MaxFilter(const bool causal=true, const int width=3);
		~MaxFilter();
		void configure(const bool causal=true, const int width=3);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _maxfilter;
};

class MaxMagFreq {
	public:
		MaxMagFreq(const float sampleRate=44100);
		~MaxMagFreq();
		void configure(const float sampleRate=44100);
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _maxmagfreq;
};

class MaxToTotal {
	public:
		MaxToTotal();
		~MaxToTotal();
		void configure();
		val compute(std::vector<float>& input_envelope);
		void reset();
	private:
		Algorithm* _maxtototal;
};

class Mean {
	public:
		Mean();
		~Mean();
		void configure();
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _mean;
};

class Median {
	public:
		Median();
		~Median();
		void configure();
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _median;
};

class MedianFilter {
	public:
		MedianFilter(const int kernelSize=11);
		~MedianFilter();
		void configure(const int kernelSize=11);
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _medianfilter;
};

class MelBands {
	public:
		MelBands(const float highFrequencyBound=22050, const int inputSize=1025, const bool log=false, const float lowFrequencyBound=0, const std::string& normalize="unit_sum", const int numberBands=24, const float sampleRate=44100, const std::string& type="power", const std::string& warpingFormula="htkMel", const std::string& weighting="warping");
		~MelBands();
		void configure(const float highFrequencyBound=22050, const int inputSize=1025, const bool log=false, const float lowFrequencyBound=0, const std::string& normalize="unit_sum", const int numberBands=24, const float sampleRate=44100, const std::string& type="power", const std::string& warpingFormula="htkMel", const std::string& weighting="warping");
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _melbands;
};

class Meter {
	public:
		Meter();
		~Meter();
		void configure();
		val compute(std::vector<std::vector<float> >& input_beatogram);
		void reset();
	private:
		Algorithm* _meter;
};

class MinMax {
	public:
		MinMax(const std::string& type="min");
		~MinMax();
		void configure(const std::string& type="min");
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _minmax;
};

class MinToTotal {
	public:
		MinToTotal();
		~MinToTotal();
		void configure();
		val compute(std::vector<float>& input_envelope);
		void reset();
	private:
		Algorithm* _mintototal;
};

class MovingAverage {
	public:
		MovingAverage(const int size=6);
		~MovingAverage();
		void configure(const int size=6);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _movingaverage;
};

class MultiPitchKlapuri {
	public:
		MultiPitchKlapuri(const float binResolution=10, const int frameSize=2048, const float harmonicWeight=0.8, const int hopSize=128, const float magnitudeCompression=1, const int magnitudeThreshold=40, const float maxFrequency=1760, const float minFrequency=80, const int numberHarmonics=10, const float referenceFrequency=55, const float sampleRate=44100);
		~MultiPitchKlapuri();
		void configure(const float binResolution=10, const int frameSize=2048, const float harmonicWeight=0.8, const int hopSize=128, const float magnitudeCompression=1, const int magnitudeThreshold=40, const float maxFrequency=1760, const float minFrequency=80, const int numberHarmonics=10, const float referenceFrequency=55, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _multipitchklapuri;
};

class MultiPitchMelodia {
	public:
		MultiPitchMelodia(const float binResolution=10, const int filterIterations=3, const int frameSize=2048, const bool guessUnvoiced=false, const float harmonicWeight=0.8, const int hopSize=128, const float magnitudeCompression=1, const int magnitudeThreshold=40, const float maxFrequency=20000, const int minDuration=100, const float minFrequency=40, const int numberHarmonics=20, const float peakDistributionThreshold=0.9, const float peakFrameThreshold=0.9, const float pitchContinuity=27.5625, const float referenceFrequency=55, const float sampleRate=44100, const int timeContinuity=100);
		~MultiPitchMelodia();
		void configure(const float binResolution=10, const int filterIterations=3, const int frameSize=2048, const bool guessUnvoiced=false, const float harmonicWeight=0.8, const int hopSize=128, const float magnitudeCompression=1, const int magnitudeThreshold=40, const float maxFrequency=20000, const int minDuration=100, const float minFrequency=40, const int numberHarmonics=20, const float peakDistributionThreshold=0.9, const float peakFrameThreshold=0.9, const float pitchContinuity=27.5625, const float referenceFrequency=55, const float sampleRate=44100, const int timeContinuity=100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _multipitchmelodia;
};

class Multiplexer {
	public:
		Multiplexer(const int numberRealInputs=0, const int numberVectorRealInputs=0);
		~Multiplexer();
		void configure(const int numberRealInputs=0, const int numberVectorRealInputs=0);
		val compute();
		void reset();
	private:
		Algorithm* _multiplexer;
};

class NNLSChroma {
	public:
		NNLSChroma(const std::string& chromaNormalization="none", const int frameSize=1025, const float sampleRate=44100, const float spectralShape=0.7, const float spectralWhitening=1, const std::string& tuningMode="global", const bool useNNLS=true);
		~NNLSChroma();
		void configure(const std::string& chromaNormalization="none", const int frameSize=1025, const float sampleRate=44100, const float spectralShape=0.7, const float spectralWhitening=1, const std::string& tuningMode="global", const bool useNNLS=true);
		val compute(std::vector<std::vector<float> >& input_logSpectrogram, std::vector<float>& input_meanTuning, std::vector<float>& input_localTuning);
		void reset();
	private:
		Algorithm* _nnlschroma;
};

class NoiseAdder {
	public:
		NoiseAdder(const bool fixSeed=false, const int level=-100);
		~NoiseAdder();
		void configure(const bool fixSeed=false, const int level=-100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _noiseadder;
};

class NoiseBurstDetector {
	public:
		NoiseBurstDetector(const float alpha=0.9, const int silenceThreshold=-50, const int threshold=8);
		~NoiseBurstDetector();
		void configure(const float alpha=0.9, const int silenceThreshold=-50, const int threshold=8);
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _noiseburstdetector;
};

class NoveltyCurve {
	public:
		NoveltyCurve(const float frameRate=344.531, const bool normalize=false, const std::vector<float>& weightCurve=std::vector<float>(), const std::string& weightCurveType="hybrid");
		~NoveltyCurve();
		void configure(const float frameRate=344.531, const bool normalize=false, const std::vector<float>& weightCurve=std::vector<float>(), const std::string& weightCurveType="hybrid");
		val compute(std::vector<std::vector<float> >& input_frequencyBands);
		void reset();
	private:
		Algorithm* _noveltycurve;
};

class NoveltyCurveFixedBpmEstimator {
	public:
		NoveltyCurveFixedBpmEstimator(const int hopSize=512, const float maxBpm=560, const float minBpm=30, const float sampleRate=44100, const float tolerance=3);
		~NoveltyCurveFixedBpmEstimator();
		void configure(const int hopSize=512, const float maxBpm=560, const float minBpm=30, const float sampleRate=44100, const float tolerance=3);
		val compute(std::vector<float>& input_novelty);
		void reset();
	private:
		Algorithm* _noveltycurvefixedbpmestimator;
};

class OddToEvenHarmonicEnergyRatio {
	public:
		OddToEvenHarmonicEnergyRatio();
		~OddToEvenHarmonicEnergyRatio();
		void configure();
		val compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes);
		void reset();
	private:
		Algorithm* _oddtoevenharmonicenergyratio;
};

class OnsetDetection {
	public:
		OnsetDetection(const std::string& method="hfc", const float sampleRate=44100);
		~OnsetDetection();
		void configure(const std::string& method="hfc", const float sampleRate=44100);
		val compute(std::vector<float>& input_spectrum, std::vector<float>& input_phase);
		void reset();
	private:
		Algorithm* _onsetdetection;
};

class OnsetDetectionGlobal {
	public:
		OnsetDetectionGlobal(const int frameSize=2048, const int hopSize=512, const std::string& method="infogain", const float sampleRate=44100);
		~OnsetDetectionGlobal();
		void configure(const int frameSize=2048, const int hopSize=512, const std::string& method="infogain", const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _onsetdetectionglobal;
};

class OnsetRate {
	public:
		OnsetRate();
		~OnsetRate();
		void configure();
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _onsetrate;
};

class OverlapAdd {
	public:
		OverlapAdd(const int frameSize=2048, const float gain=1, const int hopSize=128);
		~OverlapAdd();
		void configure(const int frameSize=2048, const float gain=1, const int hopSize=128);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _overlapadd;
};

class PeakDetection {
	public:
		PeakDetection(const bool interpolate=true, const int maxPeaks=100, const float maxPosition=1, const float minPeakDistance=0, const float minPosition=0, const std::string& orderBy="position", const float range=1, const float threshold=-1e+06);
		~PeakDetection();
		void configure(const bool interpolate=true, const int maxPeaks=100, const float maxPosition=1, const float minPeakDistance=0, const float minPosition=0, const std::string& orderBy="position", const float range=1, const float threshold=-1e+06);
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _peakdetection;
};

class PercivalBpmEstimator {
	public:
		PercivalBpmEstimator(const int frameSize=1024, const int frameSizeOSS=2048, const int hopSize=128, const int hopSizeOSS=128, const int maxBPM=210, const int minBPM=50, const int sampleRate=44100);
		~PercivalBpmEstimator();
		void configure(const int frameSize=1024, const int frameSizeOSS=2048, const int hopSize=128, const int hopSizeOSS=128, const int maxBPM=210, const int minBPM=50, const int sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _percivalbpmestimator;
};

class PercivalEnhanceHarmonics {
	public:
		PercivalEnhanceHarmonics();
		~PercivalEnhanceHarmonics();
		void configure();
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _percivalenhanceharmonics;
};

class PercivalEvaluatePulseTrains {
	public:
		PercivalEvaluatePulseTrains();
		~PercivalEvaluatePulseTrains();
		void configure();
		val compute(std::vector<float>& input_oss, std::vector<float>& input_positions);
		void reset();
	private:
		Algorithm* _percivalevaluatepulsetrains;
};

class PitchContourSegmentation {
	public:
		PitchContourSegmentation(const int hopSize=128, const float minDuration=0.1, const int pitchDistanceThreshold=60, const int rmsThreshold=-2, const int sampleRate=44100, const int tuningFrequency=440);
		~PitchContourSegmentation();
		void configure(const int hopSize=128, const float minDuration=0.1, const int pitchDistanceThreshold=60, const int rmsThreshold=-2, const int sampleRate=44100, const int tuningFrequency=440);
		val compute(std::vector<float>& input_pitch, std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _pitchcontoursegmentation;
};

class PitchContours {
	public:
		PitchContours(const float binResolution=10, const int hopSize=128, const float minDuration=100, const float peakDistributionThreshold=0.9, const float peakFrameThreshold=0.9, const float pitchContinuity=27.5625, const float sampleRate=44100, const float timeContinuity=100);
		~PitchContours();
		void configure(const float binResolution=10, const int hopSize=128, const float minDuration=100, const float peakDistributionThreshold=0.9, const float peakFrameThreshold=0.9, const float pitchContinuity=27.5625, const float sampleRate=44100, const float timeContinuity=100);
		val compute(std::vector<std::vector<float> >& input_peakBins, std::vector<std::vector<float> >& input_peakSaliences);
		void reset();
	private:
		Algorithm* _pitchcontours;
};

class PitchContoursMelody {
	public:
		PitchContoursMelody(const float binResolution=10, const int filterIterations=3, const bool guessUnvoiced=false, const int hopSize=128, const float maxFrequency=20000, const float minFrequency=80, const float referenceFrequency=55, const float sampleRate=44100, const bool voiceVibrato=false, const float voicingTolerance=0.2);
		~PitchContoursMelody();
		void configure(const float binResolution=10, const int filterIterations=3, const bool guessUnvoiced=false, const int hopSize=128, const float maxFrequency=20000, const float minFrequency=80, const float referenceFrequency=55, const float sampleRate=44100, const bool voiceVibrato=false, const float voicingTolerance=0.2);
		val compute(std::vector<std::vector<float> >& input_contoursBins, std::vector<std::vector<float> >& input_contoursSaliences, std::vector<float>& input_contoursStartTimes, float input_duration);
		void reset();
	private:
		Algorithm* _pitchcontoursmelody;
};

class PitchContoursMonoMelody {
	public:
		PitchContoursMonoMelody(const float binResolution=10, const int filterIterations=3, const bool guessUnvoiced=false, const int hopSize=128, const float maxFrequency=20000, const float minFrequency=80, const float referenceFrequency=55, const float sampleRate=44100);
		~PitchContoursMonoMelody();
		void configure(const float binResolution=10, const int filterIterations=3, const bool guessUnvoiced=false, const int hopSize=128, const float maxFrequency=20000, const float minFrequency=80, const float referenceFrequency=55, const float sampleRate=44100);
		val compute(std::vector<std::vector<float> >& input_contoursBins, std::vector<std::vector<float> >& input_contoursSaliences, std::vector<float>& input_contoursStartTimes, float input_duration);
		void reset();
	private:
		Algorithm* _pitchcontoursmonomelody;
};

class PitchContoursMultiMelody {
	public:
		PitchContoursMultiMelody(const float binResolution=10, const int filterIterations=3, const bool guessUnvoiced=false, const int hopSize=128, const float maxFrequency=20000, const float minFrequency=80, const float referenceFrequency=55, const float sampleRate=44100);
		~PitchContoursMultiMelody();
		void configure(const float binResolution=10, const int filterIterations=3, const bool guessUnvoiced=false, const int hopSize=128, const float maxFrequency=20000, const float minFrequency=80, const float referenceFrequency=55, const float sampleRate=44100);
		val compute(std::vector<std::vector<float> >& input_contoursBins, std::vector<std::vector<float> >& input_contoursSaliences, std::vector<float>& input_contoursStartTimes, float input_duration);
		void reset();
	private:
		Algorithm* _pitchcontoursmultimelody;
};

class PitchFilter {
	public:
		PitchFilter(const int confidenceThreshold=36, const int minChunkSize=30, const bool useAbsolutePitchConfidence=false);
		~PitchFilter();
		void configure(const int confidenceThreshold=36, const int minChunkSize=30, const bool useAbsolutePitchConfidence=false);
		val compute(std::vector<float>& input_pitch, std::vector<float>& input_pitchConfidence);
		void reset();
	private:
		Algorithm* _pitchfilter;
};

class PitchMelodia {
	public:
		PitchMelodia(const float binResolution=10, const int filterIterations=3, const int frameSize=2048, const bool guessUnvoiced=false, const float harmonicWeight=0.8, const int hopSize=128, const float magnitudeCompression=1, const int magnitudeThreshold=40, const float maxFrequency=20000, const int minDuration=100, const float minFrequency=40, const int numberHarmonics=20, const float peakDistributionThreshold=0.9, const float peakFrameThreshold=0.9, const float pitchContinuity=27.5625, const float referenceFrequency=55, const float sampleRate=44100, const int timeContinuity=100);
		~PitchMelodia();
		void configure(const float binResolution=10, const int filterIterations=3, const int frameSize=2048, const bool guessUnvoiced=false, const float harmonicWeight=0.8, const int hopSize=128, const float magnitudeCompression=1, const int magnitudeThreshold=40, const float maxFrequency=20000, const int minDuration=100, const float minFrequency=40, const int numberHarmonics=20, const float peakDistributionThreshold=0.9, const float peakFrameThreshold=0.9, const float pitchContinuity=27.5625, const float referenceFrequency=55, const float sampleRate=44100, const int timeContinuity=100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _pitchmelodia;
};

class PitchSalience {
	public:
		PitchSalience(const float highBoundary=5000, const float lowBoundary=100, const float sampleRate=44100);
		~PitchSalience();
		void configure(const float highBoundary=5000, const float lowBoundary=100, const float sampleRate=44100);
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _pitchsalience;
};

class PitchSalienceFunction {
	public:
		PitchSalienceFunction(const float binResolution=10, const float harmonicWeight=0.8, const float magnitudeCompression=1, const float magnitudeThreshold=40, const int numberHarmonics=20, const float referenceFrequency=55);
		~PitchSalienceFunction();
		void configure(const float binResolution=10, const float harmonicWeight=0.8, const float magnitudeCompression=1, const float magnitudeThreshold=40, const int numberHarmonics=20, const float referenceFrequency=55);
		val compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes);
		void reset();
	private:
		Algorithm* _pitchsaliencefunction;
};

class PitchSalienceFunctionPeaks {
	public:
		PitchSalienceFunctionPeaks(const float binResolution=10, const float maxFrequency=1760, const float minFrequency=55, const float referenceFrequency=55);
		~PitchSalienceFunctionPeaks();
		void configure(const float binResolution=10, const float maxFrequency=1760, const float minFrequency=55, const float referenceFrequency=55);
		val compute(std::vector<float>& input_salienceFunction);
		void reset();
	private:
		Algorithm* _pitchsaliencefunctionpeaks;
};

class PitchYin {
	public:
		PitchYin(const int frameSize=2048, const bool interpolate=true, const float maxFrequency=22050, const float minFrequency=20, const float sampleRate=44100, const float tolerance=0.15);
		~PitchYin();
		void configure(const int frameSize=2048, const bool interpolate=true, const float maxFrequency=22050, const float minFrequency=20, const float sampleRate=44100, const float tolerance=0.15);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _pitchyin;
};

class PitchYinFFT {
	public:
		PitchYinFFT(const int frameSize=2048, const bool interpolate=true, const float maxFrequency=22050, const float minFrequency=20, const float sampleRate=44100, const float tolerance=1);
		~PitchYinFFT();
		void configure(const int frameSize=2048, const bool interpolate=true, const float maxFrequency=22050, const float minFrequency=20, const float sampleRate=44100, const float tolerance=1);
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _pitchyinfft;
};

class PitchYinProbabilistic {
	public:
		PitchYinProbabilistic(const int frameSize=2048, const int hopSize=256, const float lowRMSThreshold=0.1, const std::string& outputUnvoiced="negative", const bool preciseTime=false, const float sampleRate=44100);
		~PitchYinProbabilistic();
		void configure(const int frameSize=2048, const int hopSize=256, const float lowRMSThreshold=0.1, const std::string& outputUnvoiced="negative", const bool preciseTime=false, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _pitchyinprobabilistic;
};

class PitchYinProbabilities {
	public:
		PitchYinProbabilities(const int frameSize=2048, const float lowAmp=0.1, const bool preciseTime=false, const float sampleRate=44100);
		~PitchYinProbabilities();
		void configure(const int frameSize=2048, const float lowAmp=0.1, const bool preciseTime=false, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _pitchyinprobabilities;
};

class PitchYinProbabilitiesHMM {
	public:
		PitchYinProbabilitiesHMM(const float minFrequency=61.735, const int numberBinsPerSemitone=5, const float selfTransition=0.99, const float yinTrust=0.5);
		~PitchYinProbabilitiesHMM();
		void configure(const float minFrequency=61.735, const int numberBinsPerSemitone=5, const float selfTransition=0.99, const float yinTrust=0.5);
		val compute(std::vector<std::vector<float> >& input_pitchCandidates, std::vector<std::vector<float> >& input_probabilities);
		void reset();
	private:
		Algorithm* _pitchyinprobabilitieshmm;
};

class PowerMean {
	public:
		PowerMean(const float power=1);
		~PowerMean();
		void configure(const float power=1);
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _powermean;
};

class PowerSpectrum {
	public:
		PowerSpectrum(const int size=2048);
		~PowerSpectrum();
		void configure(const int size=2048);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _powerspectrum;
};

class PredominantPitchMelodia {
	public:
		PredominantPitchMelodia(const float binResolution=10, const int filterIterations=3, const int frameSize=2048, const bool guessUnvoiced=false, const float harmonicWeight=0.8, const int hopSize=128, const float magnitudeCompression=1, const int magnitudeThreshold=40, const float maxFrequency=20000, const int minDuration=100, const float minFrequency=80, const int numberHarmonics=20, const float peakDistributionThreshold=0.9, const float peakFrameThreshold=0.9, const float pitchContinuity=27.5625, const float referenceFrequency=55, const float sampleRate=44100, const int timeContinuity=100, const bool voiceVibrato=false, const float voicingTolerance=0.2);
		~PredominantPitchMelodia();
		void configure(const float binResolution=10, const int filterIterations=3, const int frameSize=2048, const bool guessUnvoiced=false, const float harmonicWeight=0.8, const int hopSize=128, const float magnitudeCompression=1, const int magnitudeThreshold=40, const float maxFrequency=20000, const int minDuration=100, const float minFrequency=80, const int numberHarmonics=20, const float peakDistributionThreshold=0.9, const float peakFrameThreshold=0.9, const float pitchContinuity=27.5625, const float referenceFrequency=55, const float sampleRate=44100, const int timeContinuity=100, const bool voiceVibrato=false, const float voicingTolerance=0.2);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _predominantpitchmelodia;
};

class RMS {
	public:
		RMS();
		~RMS();
		void configure();
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _rms;
};

class RawMoments {
	public:
		RawMoments(const float range=22050);
		~RawMoments();
		void configure(const float range=22050);
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _rawmoments;
};

class ReplayGain {
	public:
		ReplayGain(const float sampleRate=44100);
		~ReplayGain();
		void configure(const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _replaygain;
};

class Resample {
	public:
		Resample(const float inputSampleRate=44100, const float outputSampleRate=44100, const int quality=1);
		~Resample();
		void configure(const float inputSampleRate=44100, const float outputSampleRate=44100, const int quality=1);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _resample;
};

class ResampleFFT {
	public:
		ResampleFFT(const int inSize=128, const int outSize=128);
		~ResampleFFT();
		void configure(const int inSize=128, const int outSize=128);
		val compute(std::vector<float>& input_input);
		void reset();
	private:
		Algorithm* _resamplefft;
};

class RhythmDescriptors {
	public:
		RhythmDescriptors();
		~RhythmDescriptors();
		void configure();
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _rhythmdescriptors;
};

class RhythmExtractor {
	public:
		RhythmExtractor(const int frameHop=1024, const int frameSize=1024, const int hopSize=256, const float lastBeatInterval=0.1, const int maxTempo=208, const int minTempo=40, const int numberFrames=1024, const float sampleRate=44100, const std::vector<float>& tempoHints=std::vector<float>(), const float tolerance=0.24, const bool useBands=true, const bool useOnset=true);
		~RhythmExtractor();
		void configure(const int frameHop=1024, const int frameSize=1024, const int hopSize=256, const float lastBeatInterval=0.1, const int maxTempo=208, const int minTempo=40, const int numberFrames=1024, const float sampleRate=44100, const std::vector<float>& tempoHints=std::vector<float>(), const float tolerance=0.24, const bool useBands=true, const bool useOnset=true);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _rhythmextractor;
};

class RhythmExtractor2013 {
	public:
		RhythmExtractor2013(const int maxTempo=208, const std::string& method="multifeature", const int minTempo=40);
		~RhythmExtractor2013();
		void configure(const int maxTempo=208, const std::string& method="multifeature", const int minTempo=40);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _rhythmextractor2013;
};

class RhythmTransform {
	public:
		RhythmTransform(const int frameSize=256, const int hopSize=32);
		~RhythmTransform();
		void configure(const int frameSize=256, const int hopSize=32);
		val compute(std::vector<std::vector<float> >& input_melBands);
		void reset();
	private:
		Algorithm* _rhythmtransform;
};

class RollOff {
	public:
		RollOff(const float cutoff=0.85, const float sampleRate=44100);
		~RollOff();
		void configure(const float cutoff=0.85, const float sampleRate=44100);
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _rolloff;
};

class SNR {
	public:
		SNR(const float MAAlpha=0.95, const float MMSEAlpha=0.98, const float NoiseAlpha=0.9, const int frameSize=512, const float noiseThreshold=-40, const float sampleRate=44100, const bool useBroadbadNoiseCorrection=true);
		~SNR();
		void configure(const float MAAlpha=0.95, const float MMSEAlpha=0.98, const float NoiseAlpha=0.9, const int frameSize=512, const float noiseThreshold=-40, const float sampleRate=44100, const bool useBroadbadNoiseCorrection=true);
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _snr;
};

class SaturationDetector {
	public:
		SaturationDetector(const float differentialThreshold=0.001, const float energyThreshold=-1, const int frameSize=512, const int hopSize=256, const float minimumDuration=0.005, const float sampleRate=44100);
		~SaturationDetector();
		void configure(const float differentialThreshold=0.001, const float energyThreshold=-1, const int frameSize=512, const int hopSize=256, const float minimumDuration=0.005, const float sampleRate=44100);
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _saturationdetector;
};

class Scale {
	public:
		Scale(const bool clipping=true, const float factor=10, const float maxAbsValue=1);
		~Scale();
		void configure(const bool clipping=true, const float factor=10, const float maxAbsValue=1);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _scale;
};

class SineSubtraction {
	public:
		SineSubtraction(const int fftSize=512, const int hopSize=128, const float sampleRate=44100);
		~SineSubtraction();
		void configure(const int fftSize=512, const int hopSize=128, const float sampleRate=44100);
		val compute(std::vector<float>& input_frame, std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases);
		void reset();
	private:
		Algorithm* _sinesubtraction;
};

class SingleBeatLoudness {
	public:
		SingleBeatLoudness(const float beatDuration=0.05, const float beatWindowDuration=0.1, const std::vector<float>& frequencyBands=std::vector<float>{0, 200, 400, 800, 1600, 3200, 22000}, const std::string& onsetStart="sumEnergy", const float sampleRate=44100);
		~SingleBeatLoudness();
		void configure(const float beatDuration=0.05, const float beatWindowDuration=0.1, const std::vector<float>& frequencyBands=std::vector<float>{0, 200, 400, 800, 1600, 3200, 22000}, const std::string& onsetStart="sumEnergy", const float sampleRate=44100);
		val compute(std::vector<float>& input_beat);
		void reset();
	private:
		Algorithm* _singlebeatloudness;
};

class Slicer {
	public:
		Slicer(const std::vector<float>& endTimes=std::vector<float>(), const float sampleRate=44100, const std::vector<float>& startTimes=std::vector<float>(), const std::string& timeUnits="seconds");
		~Slicer();
		void configure(const std::vector<float>& endTimes=std::vector<float>(), const float sampleRate=44100, const std::vector<float>& startTimes=std::vector<float>(), const std::string& timeUnits="seconds");
		val compute(std::vector<float>& input_audio);
		void reset();
	private:
		Algorithm* _slicer;
};

class SpectralCentroidTime {
	public:
		SpectralCentroidTime(const float sampleRate=44100);
		~SpectralCentroidTime();
		void configure(const float sampleRate=44100);
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _spectralcentroidtime;
};

class SpectralComplexity {
	public:
		SpectralComplexity(const float magnitudeThreshold=0.005, const float sampleRate=44100);
		~SpectralComplexity();
		void configure(const float magnitudeThreshold=0.005, const float sampleRate=44100);
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _spectralcomplexity;
};

class SpectralContrast {
	public:
		SpectralContrast(const int frameSize=2048, const float highFrequencyBound=11000, const float lowFrequencyBound=20, const float neighbourRatio=0.4, const int numberBands=6, const float sampleRate=22050, const float staticDistribution=0.15);
		~SpectralContrast();
		void configure(const int frameSize=2048, const float highFrequencyBound=11000, const float lowFrequencyBound=20, const float neighbourRatio=0.4, const int numberBands=6, const float sampleRate=22050, const float staticDistribution=0.15);
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _spectralcontrast;
};

class SpectralPeaks {
	public:
		SpectralPeaks(const float magnitudeThreshold=0, const float maxFrequency=5000, const int maxPeaks=100, const float minFrequency=0, const std::string& orderBy="frequency", const float sampleRate=44100);
		~SpectralPeaks();
		void configure(const float magnitudeThreshold=0, const float maxFrequency=5000, const int maxPeaks=100, const float minFrequency=0, const std::string& orderBy="frequency", const float sampleRate=44100);
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _spectralpeaks;
};

class SpectralWhitening {
	public:
		SpectralWhitening(const float maxFrequency=5000, const float sampleRate=44100);
		~SpectralWhitening();
		void configure(const float maxFrequency=5000, const float sampleRate=44100);
		val compute(std::vector<float>& input_spectrum, std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes);
		void reset();
	private:
		Algorithm* _spectralwhitening;
};

class Spectrum {
	public:
		Spectrum(const int size=2048);
		~Spectrum();
		void configure(const int size=2048);
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _spectrum;
};

class SpectrumCQ {
	public:
		SpectrumCQ(const int binsPerOctave=12, const float minFrequency=32.7, const int minimumKernelSize=4, const int numberBins=84, const float sampleRate=44100, const float scale=1, const float threshold=0.01, const std::string& windowType="hann", const bool zeroPhase=true);
		~SpectrumCQ();
		void configure(const int binsPerOctave=12, const float minFrequency=32.7, const int minimumKernelSize=4, const int numberBins=84, const float sampleRate=44100, const float scale=1, const float threshold=0.01, const std::string& windowType="hann", const bool zeroPhase=true);
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _spectrumcq;
};

class SpectrumToCent {
	public:
		SpectrumToCent(const int bands=720, const float centBinResolution=10, const int inputSize=32768, const bool log=true, const float minimumFrequency=164, const std::string& normalize="unit_sum", const float sampleRate=44100, const std::string& type="power");
		~SpectrumToCent();
		void configure(const int bands=720, const float centBinResolution=10, const int inputSize=32768, const bool log=true, const float minimumFrequency=164, const std::string& normalize="unit_sum", const float sampleRate=44100, const std::string& type="power");
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _spectrumtocent;
};

class Spline {
	public:
		Spline(const float beta1=1, const float beta2=0, const std::string& type="b", const std::vector<float>& xPoints=std::vector<float>{0, 1}, const std::vector<float>& yPoints=std::vector<float>{0, 1});
		~Spline();
		void configure(const float beta1=1, const float beta2=0, const std::string& type="b", const std::vector<float>& xPoints=std::vector<float>{0, 1}, const std::vector<float>& yPoints=std::vector<float>{0, 1});
		val compute(float input_x);
		void reset();
	private:
		Algorithm* _spline;
};

class SprModelAnal {
	public:
		SprModelAnal(const int fftSize=2048, const int freqDevOffset=20, const float freqDevSlope=0.01, const int hopSize=512, const float magnitudeThreshold=0, const float maxFrequency=5000, const int maxPeaks=100, const int maxnSines=100, const float minFrequency=0, const std::string& orderBy="frequency", const float sampleRate=44100);
		~SprModelAnal();
		void configure(const int fftSize=2048, const int freqDevOffset=20, const float freqDevSlope=0.01, const int hopSize=512, const float magnitudeThreshold=0, const float maxFrequency=5000, const int maxPeaks=100, const int maxnSines=100, const float minFrequency=0, const std::string& orderBy="frequency", const float sampleRate=44100);
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _sprmodelanal;
};

class SprModelSynth {
	public:
		SprModelSynth(const int fftSize=2048, const int hopSize=512, const float sampleRate=44100);
		~SprModelSynth();
		void configure(const int fftSize=2048, const int hopSize=512, const float sampleRate=44100);
		val compute(std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases, std::vector<float>& input_res);
		void reset();
	private:
		Algorithm* _sprmodelsynth;
};

class SpsModelAnal {
	public:
		SpsModelAnal(const int fftSize=2048, const int freqDevOffset=20, const float freqDevSlope=0.01, const int hopSize=512, const float magnitudeThreshold=0, const float maxFrequency=5000, const int maxPeaks=100, const int maxnSines=100, const float minFrequency=0, const std::string& orderBy="frequency", const float sampleRate=44100, const float stocf=0.2);
		~SpsModelAnal();
		void configure(const int fftSize=2048, const int freqDevOffset=20, const float freqDevSlope=0.01, const int hopSize=512, const float magnitudeThreshold=0, const float maxFrequency=5000, const int maxPeaks=100, const int maxnSines=100, const float minFrequency=0, const std::string& orderBy="frequency", const float sampleRate=44100, const float stocf=0.2);
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _spsmodelanal;
};

class SpsModelSynth {
	public:
		SpsModelSynth(const int fftSize=2048, const int hopSize=512, const float sampleRate=44100, const float stocf=0.2);
		~SpsModelSynth();
		void configure(const int fftSize=2048, const int hopSize=512, const float sampleRate=44100, const float stocf=0.2);
		val compute(std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases, std::vector<float>& input_stocenv);
		void reset();
	private:
		Algorithm* _spsmodelsynth;
};

class StartStopCut {
	public:
		StartStopCut(const int frameSize=256, const int hopSize=256, const float maximumStartTime=10, const float maximumStopTime=10, const float sampleRate=44100, const int threshold=-60);
		~StartStopCut();
		void configure(const int frameSize=256, const int hopSize=256, const float maximumStartTime=10, const float maximumStopTime=10, const float sampleRate=44100, const int threshold=-60);
		val compute(std::vector<float>& input_audio);
		void reset();
	private:
		Algorithm* _startstopcut;
};

class StartStopSilence {
	public:
		StartStopSilence(const int threshold=-60);
		~StartStopSilence();
		void configure(const int threshold=-60);
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _startstopsilence;
};

class StochasticModelAnal {
	public:
		StochasticModelAnal(const int fftSize=2048, const int hopSize=512, const float sampleRate=44100, const float stocf=0.2);
		~StochasticModelAnal();
		void configure(const int fftSize=2048, const int hopSize=512, const float sampleRate=44100, const float stocf=0.2);
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _stochasticmodelanal;
};

class StochasticModelSynth {
	public:
		StochasticModelSynth(const int fftSize=2048, const int hopSize=512, const float sampleRate=44100, const float stocf=0.2);
		~StochasticModelSynth();
		void configure(const int fftSize=2048, const int hopSize=512, const float sampleRate=44100, const float stocf=0.2);
		val compute(std::vector<float>& input_stocenv);
		void reset();
	private:
		Algorithm* _stochasticmodelsynth;
};

class StrongDecay {
	public:
		StrongDecay(const float sampleRate=44100);
		~StrongDecay();
		void configure(const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _strongdecay;
};

class StrongPeak {
	public:
		StrongPeak();
		~StrongPeak();
		void configure();
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _strongpeak;
};

class SuperFluxExtractor {
	public:
		SuperFluxExtractor(const float combine=20, const int frameSize=2048, const int hopSize=256, const float ratioThreshold=16, const float sampleRate=44100, const float threshold=0.05);
		~SuperFluxExtractor();
		void configure(const float combine=20, const int frameSize=2048, const int hopSize=256, const float ratioThreshold=16, const float sampleRate=44100, const float threshold=0.05);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _superfluxextractor;
};

class SuperFluxNovelty {
	public:
		SuperFluxNovelty(const int binWidth=3, const int frameWidth=2);
		~SuperFluxNovelty();
		void configure(const int binWidth=3, const int frameWidth=2);
		val compute(std::vector<std::vector<float> >& input_bands);
		void reset();
	private:
		Algorithm* _superfluxnovelty;
};

class SuperFluxPeaks {
	public:
		SuperFluxPeaks(const float combine=30, const float frameRate=172, const float pre_avg=100, const float pre_max=30, const float ratioThreshold=16, const float threshold=0.05);
		~SuperFluxPeaks();
		void configure(const float combine=30, const float frameRate=172, const float pre_avg=100, const float pre_max=30, const float ratioThreshold=16, const float threshold=0.05);
		val compute(std::vector<float>& input_novelty);
		void reset();
	private:
		Algorithm* _superfluxpeaks;
};

class TCToTotal {
	public:
		TCToTotal();
		~TCToTotal();
		void configure();
		val compute(std::vector<float>& input_envelope);
		void reset();
	private:
		Algorithm* _tctototal;
};

class TempoScaleBands {
	public:
		TempoScaleBands(const std::vector<float>& bandsGain=std::vector<float>{2, 3, 2, 1, 1.20000004768, 2, 3, 2.5}, const float frameTime=512);
		~TempoScaleBands();
		void configure(const std::vector<float>& bandsGain=std::vector<float>{2, 3, 2, 1, 1.20000004768, 2, 3, 2.5}, const float frameTime=512);
		val compute(std::vector<float>& input_bands);
		void reset();
	private:
		Algorithm* _temposcalebands;
};

class TempoTap {
	public:
		TempoTap(const int frameHop=1024, const int frameSize=256, const int maxTempo=208, const int minTempo=40, const int numberFrames=1024, const float sampleRate=44100, const std::vector<float>& tempoHints=std::vector<float>());
		~TempoTap();
		void configure(const int frameHop=1024, const int frameSize=256, const int maxTempo=208, const int minTempo=40, const int numberFrames=1024, const float sampleRate=44100, const std::vector<float>& tempoHints=std::vector<float>());
		val compute(std::vector<float>& input_featuresFrame);
		void reset();
	private:
		Algorithm* _tempotap;
};

class TempoTapDegara {
	public:
		TempoTapDegara(const int maxTempo=208, const int minTempo=40, const std::string& resample="none", const float sampleRateODF=86.1328);
		~TempoTapDegara();
		void configure(const int maxTempo=208, const int minTempo=40, const std::string& resample="none", const float sampleRateODF=86.1328);
		val compute(std::vector<float>& input_onsetDetections);
		void reset();
	private:
		Algorithm* _tempotapdegara;
};

class TempoTapMaxAgreement {
	public:
		TempoTapMaxAgreement();
		~TempoTapMaxAgreement();
		void configure();
		val compute(std::vector<std::vector<float> >& input_tickCandidates);
		void reset();
	private:
		Algorithm* _tempotapmaxagreement;
};

class TempoTapTicks {
	public:
		TempoTapTicks(const int frameHop=512, const int hopSize=256, const float sampleRate=44100);
		~TempoTapTicks();
		void configure(const int frameHop=512, const int hopSize=256, const float sampleRate=44100);
		val compute(std::vector<float>& input_periods, std::vector<float>& input_phases);
		void reset();
	private:
		Algorithm* _tempotapticks;
};

class TensorflowInputFSDSINet {
	public:
		TensorflowInputFSDSINet();
		~TensorflowInputFSDSINet();
		void configure();
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _tensorflowinputfsdsinet;
};

class TensorflowInputMusiCNN {
	public:
		TensorflowInputMusiCNN();
		~TensorflowInputMusiCNN();
		void configure();
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _tensorflowinputmusicnn;
};

class TensorflowInputTempoCNN {
	public:
		TensorflowInputTempoCNN();
		~TensorflowInputTempoCNN();
		void configure();
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _tensorflowinputtempocnn;
};

class TensorflowInputVGGish {
	public:
		TensorflowInputVGGish();
		~TensorflowInputVGGish();
		void configure();
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _tensorflowinputvggish;
};

class TonalExtractor {
	public:
		TonalExtractor(const int frameSize=4096, const int hopSize=2048, const float tuningFrequency=440);
		~TonalExtractor();
		void configure(const int frameSize=4096, const int hopSize=2048, const float tuningFrequency=440);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _tonalextractor;
};

class TonicIndianArtMusic {
	public:
		TonicIndianArtMusic(const float binResolution=10, const int frameSize=2048, const float harmonicWeight=0.85, const int hopSize=512, const float magnitudeCompression=1, const float magnitudeThreshold=40, const float maxTonicFrequency=375, const float minTonicFrequency=100, const int numberHarmonics=20, const int numberSaliencePeaks=5, const float referenceFrequency=55, const float sampleRate=44100);
		~TonicIndianArtMusic();
		void configure(const float binResolution=10, const int frameSize=2048, const float harmonicWeight=0.85, const int hopSize=512, const float magnitudeCompression=1, const float magnitudeThreshold=40, const float maxTonicFrequency=375, const float minTonicFrequency=100, const int numberHarmonics=20, const int numberSaliencePeaks=5, const float referenceFrequency=55, const float sampleRate=44100);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _tonicindianartmusic;
};

class TriangularBands {
	public:
		TriangularBands(const std::vector<float>& frequencyBands=std::vector<float>{21.533203125, 43.06640625, 64.599609375, 86.1328125, 107.666015625, 129.19921875, 150.732421875, 172.265625, 193.798828125, 215.33203125, 236.865234375, 258.3984375, 279.931640625, 301.46484375, 322.998046875, 344.53125, 366.064453125, 387.59765625, 409.130859375, 430.6640625, 452.197265625, 473.73046875, 495.263671875, 516.796875, 538.330078125, 559.86328125, 581.396484375, 602.9296875, 624.462890625, 645.99609375, 667.529296875, 689.0625, 710.595703125, 732.12890625, 753.662109375, 775.1953125, 796.728515625, 839.794921875, 861.328125, 882.861328125, 904.39453125, 925.927734375, 968.994140625, 990.52734375, 1012.06054688, 1055.12695312, 1076.66015625, 1098.19335938, 1141.25976562, 1184.32617188, 1205.859375, 1248.92578125, 1270.45898438, 1313.52539062, 1356.59179688, 1399.65820312, 1442.72460938, 1485.79101562, 1528.85742188, 1571.92382812, 1614.99023438, 1658.05664062, 1701.12304688, 1765.72265625, 1808.7890625, 1873.38867188, 1916.45507812, 1981.0546875, 2024.12109375, 2088.72070312, 2153.3203125, 2217.91992188, 2282.51953125, 2347.11914062, 2411.71875, 2497.8515625, 2562.45117188, 2627.05078125, 2713.18359375, 2799.31640625, 2885.44921875, 2950.04882812, 3036.18164062, 3143.84765625, 3229.98046875, 3316.11328125, 3423.77929688, 3509.91210938, 3617.578125, 3725.24414062, 3832.91015625, 3940.57617188, 4069.77539062, 4177.44140625, 4306.640625, 4435.83984375, 4565.0390625, 4694.23828125, 4844.97070312, 4974.16992188, 5124.90234375, 5275.63476562, 5426.3671875, 5577.09960938, 5749.36523438, 5921.63085938, 6093.89648438, 6266.16210938, 6459.9609375, 6653.75976562, 6847.55859375, 7041.35742188, 7256.68945312, 7450.48828125, 7687.35351562, 7902.68554688, 8139.55078125, 8376.41601562, 8613.28125, 8871.6796875, 9130.078125, 9388.4765625, 9668.40820312, 9948.33984375, 10249.8046875, 10551.2695312, 10852.734375, 11175.7324219, 11498.7304688, 11843.2617188, 12187.7929688, 12553.8574219, 12919.921875, 13285.9863281, 13673.5839844, 14082.7148438, 14491.8457031, 14922.5097656, 15353.1738281, 15805.3710938, 16257.5683594}, const int inputSize=1025, const bool log=true, const std::string& normalize="unit_sum", const float sampleRate=44100, const std::string& type="power", const std::string& weighting="linear");
		~TriangularBands();
		void configure(const std::vector<float>& frequencyBands=std::vector<float>{21.533203125, 43.06640625, 64.599609375, 86.1328125, 107.666015625, 129.19921875, 150.732421875, 172.265625, 193.798828125, 215.33203125, 236.865234375, 258.3984375, 279.931640625, 301.46484375, 322.998046875, 344.53125, 366.064453125, 387.59765625, 409.130859375, 430.6640625, 452.197265625, 473.73046875, 495.263671875, 516.796875, 538.330078125, 559.86328125, 581.396484375, 602.9296875, 624.462890625, 645.99609375, 667.529296875, 689.0625, 710.595703125, 732.12890625, 753.662109375, 775.1953125, 796.728515625, 839.794921875, 861.328125, 882.861328125, 904.39453125, 925.927734375, 968.994140625, 990.52734375, 1012.06054688, 1055.12695312, 1076.66015625, 1098.19335938, 1141.25976562, 1184.32617188, 1205.859375, 1248.92578125, 1270.45898438, 1313.52539062, 1356.59179688, 1399.65820312, 1442.72460938, 1485.79101562, 1528.85742188, 1571.92382812, 1614.99023438, 1658.05664062, 1701.12304688, 1765.72265625, 1808.7890625, 1873.38867188, 1916.45507812, 1981.0546875, 2024.12109375, 2088.72070312, 2153.3203125, 2217.91992188, 2282.51953125, 2347.11914062, 2411.71875, 2497.8515625, 2562.45117188, 2627.05078125, 2713.18359375, 2799.31640625, 2885.44921875, 2950.04882812, 3036.18164062, 3143.84765625, 3229.98046875, 3316.11328125, 3423.77929688, 3509.91210938, 3617.578125, 3725.24414062, 3832.91015625, 3940.57617188, 4069.77539062, 4177.44140625, 4306.640625, 4435.83984375, 4565.0390625, 4694.23828125, 4844.97070312, 4974.16992188, 5124.90234375, 5275.63476562, 5426.3671875, 5577.09960938, 5749.36523438, 5921.63085938, 6093.89648438, 6266.16210938, 6459.9609375, 6653.75976562, 6847.55859375, 7041.35742188, 7256.68945312, 7450.48828125, 7687.35351562, 7902.68554688, 8139.55078125, 8376.41601562, 8613.28125, 8871.6796875, 9130.078125, 9388.4765625, 9668.40820312, 9948.33984375, 10249.8046875, 10551.2695312, 10852.734375, 11175.7324219, 11498.7304688, 11843.2617188, 12187.7929688, 12553.8574219, 12919.921875, 13285.9863281, 13673.5839844, 14082.7148438, 14491.8457031, 14922.5097656, 15353.1738281, 15805.3710938, 16257.5683594}, const int inputSize=1025, const bool log=true, const std::string& normalize="unit_sum", const float sampleRate=44100, const std::string& type="power", const std::string& weighting="linear");
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _triangularbands;
};

class TriangularBarkBands {
	public:
		TriangularBarkBands(const float highFrequencyBound=22050, const int inputSize=1025, const bool log=false, const float lowFrequencyBound=0, const std::string& normalize="unit_sum", const int numberBands=24, const float sampleRate=44100, const std::string& type="power", const std::string& weighting="warping");
		~TriangularBarkBands();
		void configure(const float highFrequencyBound=22050, const int inputSize=1025, const bool log=false, const float lowFrequencyBound=0, const std::string& normalize="unit_sum", const int numberBands=24, const float sampleRate=44100, const std::string& type="power", const std::string& weighting="warping");
		val compute(std::vector<float>& input_spectrum);
		void reset();
	private:
		Algorithm* _triangularbarkbands;
};

class Trimmer {
	public:
		Trimmer(const bool checkRange=false, const float endTime=1e+06, const float sampleRate=44100, const float startTime=0);
		~Trimmer();
		void configure(const bool checkRange=false, const float endTime=1e+06, const float sampleRate=44100, const float startTime=0);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _trimmer;
};

class Tristimulus {
	public:
		Tristimulus();
		~Tristimulus();
		void configure();
		val compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes);
		void reset();
	private:
		Algorithm* _tristimulus;
};

class TruePeakDetector {
	public:
		TruePeakDetector(const bool blockDC=false, const bool emphasise=false, const int oversamplingFactor=4, const int quality=1, const float sampleRate=44100, const float threshold=-0.0002, const int version=4);
		~TruePeakDetector();
		void configure(const bool blockDC=false, const bool emphasise=false, const int oversamplingFactor=4, const int quality=1, const float sampleRate=44100, const float threshold=-0.0002, const int version=4);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _truepeakdetector;
};

class TuningFrequency {
	public:
		TuningFrequency(const float resolution=1);
		~TuningFrequency();
		void configure(const float resolution=1);
		val compute(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes);
		void reset();
	private:
		Algorithm* _tuningfrequency;
};

class TuningFrequencyExtractor {
	public:
		TuningFrequencyExtractor(const int frameSize=4096, const int hopSize=2048);
		~TuningFrequencyExtractor();
		void configure(const int frameSize=4096, const int hopSize=2048);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _tuningfrequencyextractor;
};

class UnaryOperator {
	public:
		UnaryOperator(const float scale=1, const float shift=0, const std::string& type="identity");
		~UnaryOperator();
		void configure(const float scale=1, const float shift=0, const std::string& type="identity");
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _unaryoperator;
};

class UnaryOperatorStream {
	public:
		UnaryOperatorStream(const float scale=1, const float shift=0, const std::string& type="identity");
		~UnaryOperatorStream();
		void configure(const float scale=1, const float shift=0, const std::string& type="identity");
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _unaryoperatorstream;
};

class Variance {
	public:
		Variance();
		~Variance();
		void configure();
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _variance;
};

class Vibrato {
	public:
		Vibrato(const float maxExtend=250, const float maxFrequency=8, const float minExtend=50, const float minFrequency=4, const float sampleRate=344.531);
		~Vibrato();
		void configure(const float maxExtend=250, const float maxFrequency=8, const float minExtend=50, const float minFrequency=4, const float sampleRate=344.531);
		val compute(std::vector<float>& input_pitch);
		void reset();
	private:
		Algorithm* _vibrato;
};

class WarpedAutoCorrelation {
	public:
		WarpedAutoCorrelation(const int maxLag=1, const float sampleRate=44100);
		~WarpedAutoCorrelation();
		void configure(const int maxLag=1, const float sampleRate=44100);
		val compute(std::vector<float>& input_array);
		void reset();
	private:
		Algorithm* _warpedautocorrelation;
};

class Welch {
	public:
		Welch(const int averagingFrames=10, const int fftSize=1024, const int frameSize=512, const float sampleRate=44100, const std::string& scaling="density", const std::string& windowType="hann");
		~Welch();
		void configure(const int averagingFrames=10, const int fftSize=1024, const int frameSize=512, const float sampleRate=44100, const std::string& scaling="density", const std::string& windowType="hann");
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _welch;
};

class Windowing {
	public:
		Windowing(const int constantsDecimals=5, const bool normalized=true, const int size=1024, const bool splitPadding=false, const bool symmetric=true, const std::string& type="hann", const int zeroPadding=0, const bool zeroPhase=true);
		~Windowing();
		void configure(const int constantsDecimals=5, const bool normalized=true, const int size=1024, const bool splitPadding=false, const bool symmetric=true, const std::string& type="hann", const int zeroPadding=0, const bool zeroPhase=true);
		val compute(std::vector<float>& input_frame);
		void reset();
	private:
		Algorithm* _windowing;
};

class ZeroCrossingRate {
	public:
		ZeroCrossingRate(const float threshold=0);
		~ZeroCrossingRate();
		void configure(const float threshold=0);
		val compute(std::vector<float>& input_signal);
		void reset();
	private:
		Algorithm* _zerocrossingrate;
};

// convert a Float32 JS typed array into std::vector<float>
std::vector<float> float32ArrayToVector(const val &arr);

#endif  // ESSENTIAJS_H