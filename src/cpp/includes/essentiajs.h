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
#include <emscripten/bind.h>

using namespace emscripten;

class EssentiaJS {
  public:
    // property to store the current essentia library version
    std::string essentiaVersion;
    // constructor for instantiating the essentia algo registry with an optional argument to enable debug mode 
    EssentiaJS(bool debugger=false);
    ~EssentiaJS(){};
    // method for shutdown essentia instance
    void shutdown();
    // method for generating frames from a given audio signal
    std::vector<std::vector<float> > FrameGenerator(std::vector<float>& signal, int frameSize, int hopSize);
    // NOTE: The following code snippets are machine generated. Do not edit.    
     
    // class property which stores all the list of essentia algorithm names available in essentia.js
    std::string algorithmNames = "['AfterMaxToBeforeMaxEnergyRatio', 'AllPass', 'AudioOnsetsMarker', 'AutoCorrelation', 'BFCC', 'BPF', 'BandPass', 'BandReject', 'BarkBands', 'BeatTrackerDegara', 'BeatTrackerMultiFeature', 'Beatogram', 'BeatsLoudness', 'BinaryOperator', 'BinaryOperatorStream', 'BpmHistogram', 'BpmHistogramDescriptors', 'BpmRubato', 'CartesianToPolar', 'CentralMoments', 'Centroid', 'ChordsDescriptors', 'ChordsDetection', 'ChordsDetectionBeats', 'ChromaCrossSimilarity', 'Chromagram', 'Chromaprinter', 'ClickDetector', 'Clipper', 'ConstantQ', 'CoverSongSimilarity', 'Crest', 'CrossCorrelation', 'CrossSimilarityMatrix', 'CubicSpline', 'DCRemoval', 'DCT', 'Danceability', 'Decrease', 'Derivative', 'DerivativeSFX', 'DiscontinuityDetector', 'Dissonance', 'DistributionShape', 'Duration', 'DynamicComplexity', 'ERBBands', 'EffectiveDuration', 'Energy', 'EnergyBand', 'EnergyBandRatio', 'Entropy', 'Envelope', 'EqualLoudness', 'FFT', 'FFTC', 'FadeDetection', 'FalseStereoDetector', 'Flatness', 'FlatnessDB', 'FlatnessSFX', 'Flux', 'FrameCutter', 'FrameToReal', 'FrequencyBands', 'GFCC', 'GapsDetector', 'GeometricMean', 'HFC', 'HPCP', 'HarmonicBpm', 'HarmonicMask', 'HarmonicModelAnal', 'HarmonicPeaks', 'HighPass', 'HighResolutionFeatures', 'Histogram', 'HprModelAnal', 'HpsModelAnal', 'HumDetector', 'IDCT', 'IFFT', 'IFFTC', 'IIR', 'Inharmonicity', 'InstantPower', 'Intensity', 'Key', 'KeyExtractor', 'LPC', 'Larm', 'Leq', 'LevelExtractor', 'LogAttackTime', 'LogSpectrum', 'LoopBpmConfidence', 'LoopBpmEstimator', 'Loudness', 'LoudnessEBUR128', 'LoudnessVickers', 'LowLevelSpectralEqloudExtractor', 'LowLevelSpectralExtractor', 'LowPass', 'MFCC', 'Magnitude', 'MaxFilter', 'MaxMagFreq', 'MaxToTotal', 'Mean', 'Median', 'MedianFilter', 'MelBands', 'Meter', 'MinMax', 'MinToTotal', 'MovingAverage', 'Multiplexer', 'NNLSChroma', 'NSGConstantQ', 'NSGIConstantQ', 'NoiseAdder', 'NoiseBurstDetector', 'NoveltyCurve', 'NoveltyCurveFixedBpmEstimator', 'OddToEvenHarmonicEnergyRatio', 'OnsetDetection', 'OnsetDetectionGlobal', 'OnsetRate', 'Onsets', 'OverlapAdd', 'Panning', 'PeakDetection', 'PercivalBpmEstimator', 'PercivalEnhanceHarmonics', 'PercivalEvaluatePulseTrains', 'PitchContourSegmentation', 'PitchContours', 'PitchContoursMelody', 'PitchContoursMonoMelody', 'PitchContoursMultiMelody', 'PitchFilter', 'PitchSalience', 'PitchSalienceFunction', 'PitchSalienceFunctionPeaks', 'PitchYin', 'PitchYinFFT', 'PitchYinProbabilistic', 'PitchYinProbabilities', 'PitchYinProbabilitiesHMM', 'PolarToCartesian', 'PowerMean', 'PowerSpectrum', 'RMS', 'RawMoments', 'ReplayGain', 'Resample', 'ResampleFFT', 'RhythmDescriptors', 'RhythmExtractor', 'RhythmExtractor2013', 'RhythmTransform', 'RollOff', 'SBic', 'SNR', 'SaturationDetector', 'Scale', 'SineModelAnal', 'SineModelSynth', 'SineSubtraction', 'SingleBeatLoudness', 'SingleGaussian', 'Slicer', 'SpectralCentroidTime', 'SpectralComplexity', 'SpectralContrast', 'SpectralPeaks', 'SpectralWhitening', 'Spectrum', 'SpectrumCQ', 'SpectrumToCent', 'Spline', 'SprModelAnal', 'SprModelSynth', 'SpsModelAnal', 'SpsModelSynth', 'StartStopCut', 'StartStopSilence', 'StereoDemuxer', 'StereoMuxer', 'StereoTrimmer', 'StochasticModelAnal', 'StochasticModelSynth', 'StrongDecay', 'StrongPeak', 'SuperFluxExtractor', 'SuperFluxNovelty', 'SuperFluxPeaks', 'TCToTotal', 'TempoScaleBands', 'TempoTap', 'TempoTapDegara', 'TempoTapMaxAgreement', 'TempoTapTicks', 'TonalExtractor', 'TonicIndianArtMusic', 'TriangularBands', 'TriangularBarkBands', 'Trimmer', 'Tristimulus', 'TruePeakDetector', 'TuningFrequency', 'TuningFrequencyExtractor', 'UnaryOperator', 'UnaryOperatorStream', 'Variance', 'Vibrato', 'WarpedAutoCorrelation', 'Welch', 'Windowing', 'ZeroCrossingRate']";
    // class methods to call various essentia algorithms
    val AfterMaxToBeforeMaxEnergyRatio(std::vector<float>& input_pitch);
    val AllPass(std::vector<float>& input_signal, const float bandwidth=500, const float cutoffFrequency=1500, const int order=1, const float sampleRate=44100);
    val AudioOnsetsMarker(std::vector<float>& input_signal, const std::vector<float>& onsets=std::vector<float>(), const float sampleRate=44100, const std::string& type="beep");
    val AutoCorrelation(std::vector<float>& input_array, const float frequencyDomainCompression=0.5, const bool generalized=false, const std::string& normalization="standard");
    val BFCC(std::vector<float>& input_spectrum, const int dctType=2, const float highFrequencyBound=11000, const int inputSize=1025, const int liftering=0, const std::string& logType="dbamp", const float lowFrequencyBound=0, const std::string& normalize="unit_sum", const int numberBands=40, const int numberCoefficients=13, const float sampleRate=44100, const std::string& type="power", const std::string& weighting="warping");
    val BPF(float input_x, const std::vector<float>& xPoints=std::vector<float>{0, 1}, const std::vector<float>& yPoints=std::vector<float>{0, 1});
    val BandPass(std::vector<float>& input_signal, const float bandwidth=500, const float cutoffFrequency=1500, const float sampleRate=44100);
    val BandReject(std::vector<float>& input_signal, const float bandwidth=500, const float cutoffFrequency=1500, const float sampleRate=44100);
    val BarkBands(std::vector<float>& input_spectrum, const int numberBands=27, const float sampleRate=44100);
    val BeatTrackerDegara(std::vector<float>& input_signal, const int maxTempo=208, const int minTempo=40);
    val BeatTrackerMultiFeature(std::vector<float>& input_signal, const int maxTempo=208, const int minTempo=40);
    val Beatogram(std::vector<float>& input_loudness, std::vector<std::vector<float> >& input_loudnessBandRatio, const int size=16);
    val BeatsLoudness(std::vector<float>& input_signal, const float beatDuration=0.05, const float beatWindowDuration=0.1, const std::vector<float>& beats=std::vector<float>(), const std::vector<float>& frequencyBands=std::vector<float>{20, 150, 400, 3200, 7000, 22000}, const float sampleRate=44100);
    val BinaryOperator(std::vector<float>& input_array1, std::vector<float>& input_array2, const std::string& type="add");
    val BinaryOperatorStream(std::vector<float>& input_array1, std::vector<float>& input_array2, const std::string& type="add");
    val BpmHistogram(std::vector<float>& input_novelty, const float bpm=0, const bool constantTempo=false, const float frameRate=86.1328, const float frameSize=4, const float maxBpm=560, const int maxPeaks=50, const float minBpm=30, const int overlap=16, const float tempoChange=5, const bool weightByMagnitude=true, const std::string& windowType="hann", const int zeroPadding=0);
    val BpmHistogramDescriptors(std::vector<float>& input_bpmIntervals);
    val BpmRubato(std::vector<float>& input_beats, const float longRegionsPruningTime=20, const float shortRegionsMergingTime=4, const float tolerance=0.08);
    val CartesianToPolar(std::vector<float>& input_complex);
    val CentralMoments(std::vector<float>& input_array, const std::string& mode="pdf", const float range=1);
    val Centroid(std::vector<float>& input_array, const float range=1);
    val ChordsDescriptors(std::vector<std::string> input_chords, std::string input_key, std::string input_scale);
    val ChordsDetection(std::vector<std::vector<float> >& input_pcp, const int hopSize=2048, const float sampleRate=44100, const float windowSize=2);
    val ChordsDetectionBeats(std::vector<std::vector<float> >& input_pcp, std::vector<float>& input_ticks, const std::string& chromaPick="interbeat_median", const int hopSize=2048, const float sampleRate=44100);
    val ChromaCrossSimilarity(std::vector<std::vector<float> >& input_queryFeature, std::vector<std::vector<float> >& input_referenceFeature, const float binarizePercentile=0.095, const int frameStackSize=9, const int frameStackStride=1, const int noti=12, const bool oti=true, const bool otiBinary=false, const bool streaming=false);
    val Chromagram(std::vector<float>& input_frame, const int binsPerOctave=12, const float minFrequency=32.7, const int minimumKernelSize=4, const std::string& normalizeType="unit_max", const int numberBins=84, const float sampleRate=44100, const float scale=1, const float threshold=0.01, const std::string& windowType="hann", const bool zeroPhase=true);
    val Chromaprinter(std::vector<float>& input_signal, const float maxLength=0, const float sampleRate=44100);
    val ClickDetector(std::vector<float>& input_frame, const float detectionThreshold=30, const int frameSize=512, const int hopSize=256, const int order=12, const int powerEstimationThreshold=10, const float sampleRate=44100, const int silenceThreshold=-50);
    val Clipper(std::vector<float>& input_signal, const float max=1, const float min=-1);
    val ConstantQ(std::vector<float>& input_frame, const int binsPerOctave=12, const float minFrequency=32.7, const int minimumKernelSize=4, const int numberBins=84, const float sampleRate=44100, const float scale=1, const float threshold=0.01, const std::string& windowType="hann", const bool zeroPhase=true);
    val CoverSongSimilarity(std::vector<std::vector<float> >& input_inputArray, const std::string& alignmentType="serra09", const float disExtension=0.5, const float disOnset=0.5, const std::string& distanceType="asymmetric");
    val Crest(std::vector<float>& input_array);
    val CrossCorrelation(std::vector<float>& input_arrayX, std::vector<float>& input_arrayY, const int maxLag=1, const int minLag=0);
    val CrossSimilarityMatrix(std::vector<std::vector<float> >& input_queryFeature, std::vector<std::vector<float> >& input_referenceFeature, const bool binarize=false, const float binarizePercentile=0.095, const int frameStackSize=1, const int frameStackStride=1);
    val CubicSpline(float input_x, const int leftBoundaryFlag=0, const float leftBoundaryValue=0, const int rightBoundaryFlag=0, const float rightBoundaryValue=0, const std::vector<float>& xPoints=std::vector<float>{0, 1}, const std::vector<float>& yPoints=std::vector<float>{0, 1});
    val DCRemoval(std::vector<float>& input_signal, const float cutoffFrequency=40, const float sampleRate=44100);
    val DCT(std::vector<float>& input_array, const int dctType=2, const int inputSize=10, const int liftering=0, const int outputSize=10);
    val Danceability(std::vector<float>& input_signal, const float maxTau=8800, const float minTau=310, const float sampleRate=44100, const float tauMultiplier=1.1);
    val Decrease(std::vector<float>& input_array, const float range=1);
    val Derivative(std::vector<float>& input_signal);
    val DerivativeSFX(std::vector<float>& input_envelope);
    val DiscontinuityDetector(std::vector<float>& input_frame, const float detectionThreshold=8, const float energyThreshold=-60, const int frameSize=512, const int hopSize=256, const int kernelSize=7, const int order=3, const int silenceThreshold=-50, const int subFrameSize=32);
    val Dissonance(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes);
    val DistributionShape(std::vector<float>& input_centralMoments);
    val Duration(std::vector<float>& input_signal, const float sampleRate=44100);
    val DynamicComplexity(std::vector<float>& input_signal, const float frameSize=0.2, const float sampleRate=44100);
    val ERBBands(std::vector<float>& input_spectrum, const float highFrequencyBound=22050, const int inputSize=1025, const float lowFrequencyBound=50, const int numberBands=40, const float sampleRate=44100, const std::string& type="power", const float width=1);
    val EffectiveDuration(std::vector<float>& input_signal, const float sampleRate=44100, const float thresholdRatio=0.4);
    val Energy(std::vector<float>& input_array);
    val EnergyBand(std::vector<float>& input_spectrum, const float sampleRate=44100, const float startCutoffFrequency=0, const float stopCutoffFrequency=100);
    val EnergyBandRatio(std::vector<float>& input_spectrum, const float sampleRate=44100, const float startFrequency=0, const float stopFrequency=100);
    val Entropy(std::vector<float>& input_array);
    val Envelope(std::vector<float>& input_signal, const bool applyRectification=true, const float attackTime=10, const float releaseTime=1500, const float sampleRate=44100);
    val EqualLoudness(std::vector<float>& input_signal, const float sampleRate=44100);
    val FFT(std::vector<float>& input_frame, const int size=1024);
    val FFTC(std::vector<float>& input_frame, const bool negativeFrequencies=false, const int size=1024);
    val FadeDetection(std::vector<float>& input_rms, const float cutoffHigh=0.85, const float cutoffLow=0.2, const float frameRate=4, const float minLength=3);
    val FalseStereoDetector(std::vector<std::vector<float> >& input_frame, const float correlationThreshold=0.9995, const int silenceThreshold=-70);
    val Flatness(std::vector<float>& input_array);
    val FlatnessDB(std::vector<float>& input_array);
    val FlatnessSFX(std::vector<float>& input_envelope);
    val Flux(std::vector<float>& input_spectrum, const bool halfRectify=false, const std::string& norm="L2");
    val FrameCutter(std::vector<float>& input_signal, const int frameSize=1024, const int hopSize=512, const bool lastFrameToEndOfFile=false, const bool startFromZero=false, const float validFrameThresholdRatio=0);
    val FrameToReal(std::vector<float>& input_signal, const int frameSize=2048, const int hopSize=128);
    val FrequencyBands(std::vector<float>& input_spectrum, const std::vector<float>& frequencyBands=std::vector<float>{0, 50, 100, 150, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320, 2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 20500, 27000}, const float sampleRate=44100);
    val GFCC(std::vector<float>& input_spectrum, const int dctType=2, const float highFrequencyBound=22050, const int inputSize=1025, const std::string& logType="dbamp", const float lowFrequencyBound=40, const int numberBands=40, const int numberCoefficients=13, const float sampleRate=44100, const float silenceThreshold=1e-10, const std::string& type="power");
    val GapsDetector(std::vector<float>& input_frame, const float attackTime=0.05, const int frameSize=2048, const int hopSize=1024, const int kernelSize=11, const float maximumTime=3500, const float minimumTime=10, const float postpowerTime=40, const float prepowerThreshold=-30, const float prepowerTime=40, const float releaseTime=0.05, const float sampleRate=44100, const float silenceThreshold=-50);
    val GeometricMean(std::vector<float>& input_array);
    val HFC(std::vector<float>& input_spectrum, const float sampleRate=44100, const std::string& type="Masri");
    val HPCP(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, const bool bandPreset=true, const float bandSplitFrequency=500, const int harmonics=0, const float maxFrequency=5000, const bool maxShifted=false, const float minFrequency=40, const bool nonLinear=false, const std::string& normalized="unitMax", const float referenceFrequency=440, const float sampleRate=44100, const int size=12, const std::string& weightType="squaredCosine", const float windowSize=1);
    val HarmonicBpm(std::vector<float>& input_bpms, const int bpm=60, const float threshold=20, const float tolerance=5);
    val HarmonicMask(std::vector<float>& input_fft, float input_pitch, const float attenuation=-200, const int binWidth=4, const float sampleRate=44100);
    val HarmonicModelAnal(std::vector<float>& input_fft, float input_pitch, const float freqDevOffset=20, const float freqDevSlope=0.01, const float harmDevSlope=0.01, const int hopSize=512, const float magnitudeThreshold=-74, const float maxFrequency=5000, const int maxPeaks=100, const int maxnSines=100, const float minFrequency=20, const int nHarmonics=100, const std::string& orderBy="frequency", const float sampleRate=44100);
    val HarmonicPeaks(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, float input_pitch, const int maxHarmonics=20, const float tolerance=0.2);
    val HighPass(std::vector<float>& input_signal, const float cutoffFrequency=1500, const float sampleRate=44100);
    val HighResolutionFeatures(std::vector<float>& input_hpcp, const int maxPeaks=24);
    val Histogram(std::vector<float>& input_array, const float maxValue=1, const float minValue=0, const std::string& normalize="none", const int numberBins=10);
    val HprModelAnal(std::vector<float>& input_frame, float input_pitch, const int fftSize=2048, const int freqDevOffset=20, const float freqDevSlope=0.01, const float harmDevSlope=0.01, const int hopSize=512, const float magnitudeThreshold=0, const float maxFrequency=5000, const int maxPeaks=100, const int maxnSines=100, const float minFrequency=20, const int nHarmonics=100, const std::string& orderBy="frequency", const float sampleRate=44100, const float stocf=0.2);
    val HpsModelAnal(std::vector<float>& input_frame, float input_pitch, const int fftSize=2048, const int freqDevOffset=20, const float freqDevSlope=0.01, const float harmDevSlope=0.01, const int hopSize=512, const float magnitudeThreshold=0, const float maxFrequency=5000, const int maxPeaks=100, const int maxnSines=100, const float minFrequency=20, const int nHarmonics=100, const std::string& orderBy="frequency", const float sampleRate=44100, const float stocf=0.2);
    val HumDetector(std::vector<float>& input_signal, const float Q0=0.1, const float Q1=0.55, const float detectionThreshold=5, const float frameSize=0.4, const float hopSize=0.2, const float maximumFrequency=400, const float minimumDuration=2, const float minimumFrequency=22.5, const int numberHarmonics=1, const float sampleRate=44100, const float timeContinuity=10, const float timeWindow=10);
    val IDCT(std::vector<float>& input_dct, const int dctType=2, const int inputSize=10, const int liftering=0, const int outputSize=10);
    val IFFT(std::vector<float>& input_fft, const bool normalize=true, const int size=1024);
    val IFFTC(std::vector<float>& input_fft, const bool normalize=true, const int size=1024);
    val IIR(std::vector<float>& input_signal, const std::vector<float>& denominator=std::vector<float>{1}, const std::vector<float>& numerator=std::vector<float>{1});
    val Inharmonicity(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes);
    val InstantPower(std::vector<float>& input_array);
    val Intensity(std::vector<float>& input_signal, const float sampleRate=44100);
    val Key(std::vector<float>& input_pcp, const int numHarmonics=4, const int pcpSize=36, const std::string& profileType="bgate", const float slope=0.6, const bool useMajMin=false, const bool usePolyphony=true, const bool useThreeChords=true);
    val KeyExtractor(std::vector<float>& input_audio, const bool averageDetuningCorrection=true, const int frameSize=4096, const int hopSize=4096, const int hpcpSize=12, const float maxFrequency=3500, const int maximumSpectralPeaks=60, const float minFrequency=25, const float pcpThreshold=0.2, const std::string& profileType="bgate", const float sampleRate=44100, const float spectralPeaksThreshold=0.0001, const float tuningFrequency=440, const std::string& weightType="cosine", const std::string& windowType="hann");
    val LPC(std::vector<float>& input_frame, const int order=10, const float sampleRate=44100, const std::string& type="regular");
    val Larm(std::vector<float>& input_signal, const float attackTime=10, const float power=1.5, const float releaseTime=1500, const float sampleRate=44100);
    val Leq(std::vector<float>& input_signal);
    val LevelExtractor(std::vector<float>& input_signal, const int frameSize=88200, const int hopSize=44100);
    val LogAttackTime(std::vector<float>& input_signal, const float sampleRate=44100, const float startAttackThreshold=0.2, const float stopAttackThreshold=0.9);
    val LogSpectrum(std::vector<float>& input_spectrum, const float binsPerSemitone=3, const int frameSize=1025, const float rollOn=0, const float sampleRate=44100);
    val LoopBpmConfidence(std::vector<float>& input_signal, float input_bpmEstimate, const float sampleRate=44100);
    val LoopBpmEstimator(std::vector<float>& input_signal, const float confidenceThreshold=0.95);
    val Loudness(std::vector<float>& input_signal);
    val LoudnessEBUR128(std::vector<std::vector<float> >& input_signal, const float hopSize=0.1, const float sampleRate=44100, const bool startAtZero=false);
    val LoudnessVickers(std::vector<float>& input_signal, const float sampleRate=44100);
    val LowLevelSpectralEqloudExtractor(std::vector<float>& input_signal, const int frameSize=2048, const int hopSize=1024, const float sampleRate=44100);
    val LowLevelSpectralExtractor(std::vector<float>& input_signal, const int frameSize=2048, const int hopSize=1024, const float sampleRate=44100);
    val LowPass(std::vector<float>& input_signal, const float cutoffFrequency=1500, const float sampleRate=44100);
    val MFCC(std::vector<float>& input_spectrum, const int dctType=2, const float highFrequencyBound=11000, const int inputSize=1025, const int liftering=0, const std::string& logType="dbamp", const float lowFrequencyBound=0, const std::string& normalize="unit_sum", const int numberBands=40, const int numberCoefficients=13, const float sampleRate=44100, const float silenceThreshold=1e-10, const std::string& type="power", const std::string& warpingFormula="htkMel", const std::string& weighting="warping");
    val Magnitude(std::vector<float>& input_complex);
    val MaxFilter(std::vector<float>& input_signal, const bool causal=true, const int width=3);
    val MaxMagFreq(std::vector<float>& input_spectrum, const float sampleRate=44100);
    val MaxToTotal(std::vector<float>& input_envelope);
    val Mean(std::vector<float>& input_array);
    val Median(std::vector<float>& input_array);
    val MedianFilter(std::vector<float>& input_array, const int kernelSize=11);
    val MelBands(std::vector<float>& input_spectrum, const float highFrequencyBound=22050, const int inputSize=1025, const bool log=false, const float lowFrequencyBound=0, const std::string& normalize="unit_sum", const int numberBands=24, const float sampleRate=44100, const std::string& type="power", const std::string& warpingFormula="htkMel", const std::string& weighting="warping");
    val Meter(std::vector<std::vector<float> >& input_beatogram);
    val MinMax(std::vector<float>& input_array, const std::string& type="min");
    val MinToTotal(std::vector<float>& input_envelope);
    val MovingAverage(std::vector<float>& input_signal, const int size=6);
    val Multiplexer(const int numberRealInputs=0, const int numberVectorRealInputs=0);
    val NNLSChroma(std::vector<std::vector<float> >& input_logSpectrogram, std::vector<float>& input_meanTuning, std::vector<float>& input_localTuning, const std::string& chromaNormalization="none", const int frameSize=1025, const float sampleRate=44100, const float spectralShape=0.7, const float spectralWhitening=1, const std::string& tuningMode="global", const bool useNNLS=true);
    val NSGConstantQ(std::vector<float>& input_frame, const int binsPerOctave=48, const int gamma=0, const int inputSize=4096, const float maxFrequency=7040, const float minFrequency=27.5, const int minimumWindow=4, const std::string& normalize="none", const std::string& phaseMode="global", const std::string& rasterize="full", const float sampleRate=44100, const std::string& window="hannnsgcq", const int windowSizeFactor=1);
    val NSGIConstantQ(std::vector<std::vector<float> >& input_constantq, std::vector<float>& input_constantqdc, std::vector<float>& input_constantqnf, const int binsPerOctave=48, const int gamma=0, const int inputSize=4096, const float maxFrequency=7040, const float minFrequency=27.5, const int minimumWindow=4, const std::string& normalize="none", const std::string& phaseMode="global", const std::string& rasterize="full", const float sampleRate=44100, const std::string& window="hannnsgcq", const int windowSizeFactor=1);
    val NoiseAdder(std::vector<float>& input_signal, const bool fixSeed=false, const int level=-100);
    val NoiseBurstDetector(std::vector<float>& input_frame, const float alpha=0.9, const int silenceThreshold=-50, const int threshold=8);
    val NoveltyCurve(std::vector<std::vector<float> >& input_frequencyBands, const float frameRate=344.531, const bool normalize=false, const std::vector<float>& weightCurve=std::vector<float>(), const std::string& weightCurveType="hybrid");
    val NoveltyCurveFixedBpmEstimator(std::vector<float>& input_novelty, const int hopSize=512, const float maxBpm=560, const float minBpm=30, const float sampleRate=44100, const float tolerance=3);
    val OddToEvenHarmonicEnergyRatio(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes);
    val OnsetDetection(std::vector<float>& input_spectrum, std::vector<float>& input_phase, const std::string& method="hfc", const float sampleRate=44100);
    val OnsetDetectionGlobal(std::vector<float>& input_signal, const int frameSize=2048, const int hopSize=512, const std::string& method="infogain", const float sampleRate=44100);
    val OnsetRate(std::vector<float>& input_signal);
    val Onsets(std::vector<float>& input_detections, std::vector<float>& input_weights, const float alpha=0.1, const int delay=5, const float frameRate=86.1328, const float silenceThreshold=0.02);
    val OverlapAdd(std::vector<float>& input_signal, const int frameSize=2048, const float gain=1, const int hopSize=128);
    val Panning(std::vector<float>& input_spectrumLeft, std::vector<float>& input_spectrumRight, const int averageFrames=43, const int numBands=1, const int numCoeffs=20, const int panningBins=512, const float sampleRate=44100, const bool warpedPanorama=true);
    val PeakDetection(std::vector<float>& input_array, const bool interpolate=true, const int maxPeaks=100, const float maxPosition=1, const float minPeakDistance=0, const float minPosition=0, const std::string& orderBy="position", const float range=1, const float threshold=-1e+06);
    val PercivalBpmEstimator(std::vector<float>& input_signal, const int frameSize=1024, const int frameSizeOSS=2048, const int hopSize=128, const int hopSizeOSS=128, const int maxBPM=210, const int minBPM=50, const int sampleRate=44100);
    val PercivalEnhanceHarmonics(std::vector<float>& input_array);
    val PercivalEvaluatePulseTrains(std::vector<float>& input_oss, std::vector<float>& input_positions);
    val PitchContourSegmentation(std::vector<float>& input_pitch, std::vector<float>& input_signal, const int hopSize=128, const float minDuration=0.1, const int pitchDistanceThreshold=60, const int rmsThreshold=-2, const int sampleRate=44100, const int tuningFrequency=440);
    val PitchContours(std::vector<std::vector<float> >& input_peakBins, std::vector<std::vector<float> >& input_peakSaliences, const float binResolution=10, const int hopSize=128, const float minDuration=100, const float peakDistributionThreshold=0.9, const float peakFrameThreshold=0.9, const float pitchContinuity=27.5625, const float sampleRate=44100, const float timeContinuity=100);
    val PitchContoursMelody(std::vector<std::vector<float> >& input_contoursBins, std::vector<std::vector<float> >& input_contoursSaliences, std::vector<float>& input_contoursStartTimes, float input_duration, const float binResolution=10, const int filterIterations=3, const bool guessUnvoiced=false, const int hopSize=128, const float maxFrequency=20000, const float minFrequency=80, const float referenceFrequency=55, const float sampleRate=44100, const bool voiceVibrato=false, const float voicingTolerance=0.2);
    val PitchContoursMonoMelody(std::vector<std::vector<float> >& input_contoursBins, std::vector<std::vector<float> >& input_contoursSaliences, std::vector<float>& input_contoursStartTimes, float input_duration, const float binResolution=10, const int filterIterations=3, const bool guessUnvoiced=false, const int hopSize=128, const float maxFrequency=20000, const float minFrequency=80, const float referenceFrequency=55, const float sampleRate=44100);
    val PitchContoursMultiMelody(std::vector<std::vector<float> >& input_contoursBins, std::vector<std::vector<float> >& input_contoursSaliences, std::vector<float>& input_contoursStartTimes, float input_duration, const float binResolution=10, const int filterIterations=3, const bool guessUnvoiced=false, const int hopSize=128, const float maxFrequency=20000, const float minFrequency=80, const float referenceFrequency=55, const float sampleRate=44100);
    val PitchFilter(std::vector<float>& input_pitch, std::vector<float>& input_pitchConfidence, const int confidenceThreshold=36, const int minChunkSize=30, const bool useAbsolutePitchConfidence=false);
    val PitchSalience(std::vector<float>& input_spectrum, const float highBoundary=5000, const float lowBoundary=100, const float sampleRate=44100);
    val PitchSalienceFunction(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, const float binResolution=10, const float harmonicWeight=0.8, const float magnitudeCompression=1, const float magnitudeThreshold=40, const int numberHarmonics=20, const float referenceFrequency=55);
    val PitchSalienceFunctionPeaks(std::vector<float>& input_salienceFunction, const float binResolution=10, const float maxFrequency=1760, const float minFrequency=55, const float referenceFrequency=55);
    val PitchYin(std::vector<float>& input_signal, const int frameSize=2048, const bool interpolate=true, const float maxFrequency=22050, const float minFrequency=20, const float sampleRate=44100, const float tolerance=0.15);
    val PitchYinFFT(std::vector<float>& input_spectrum, const int frameSize=2048, const bool interpolate=true, const float maxFrequency=22050, const float minFrequency=20, const float sampleRate=44100, const float tolerance=1);
    val PitchYinProbabilistic(std::vector<float>& input_signal, const int frameSize=2048, const int hopSize=256, const float lowRMSThreshold=0.1, const std::string& outputUnvoiced="negative", const bool preciseTime=false, const float sampleRate=44100);
    val PitchYinProbabilities(std::vector<float>& input_signal, const int frameSize=2048, const float lowAmp=0.1, const bool preciseTime=false, const float sampleRate=44100);
    val PitchYinProbabilitiesHMM(std::vector<std::vector<float> >& input_pitchCandidates, std::vector<std::vector<float> >& input_probabilities, const float minFrequency=61.735, const int numberBinsPerSemitone=5, const float selfTransition=0.99, const float yinTrust=0.5);
    val PolarToCartesian(std::vector<float>& input_magnitude, std::vector<float>& input_phase);
    val PowerMean(std::vector<float>& input_array, const float power=1);
    val PowerSpectrum(std::vector<float>& input_signal, const int size=2048);
    val RMS(std::vector<float>& input_array);
    val RawMoments(std::vector<float>& input_array, const float range=22050);
    val ReplayGain(std::vector<float>& input_signal, const float sampleRate=44100);
    val Resample(std::vector<float>& input_signal, const float inputSampleRate=44100, const float outputSampleRate=44100, const int quality=1);
    val ResampleFFT(std::vector<float>& input_input, const int inSize=128, const int outSize=128);
    val RhythmDescriptors(std::vector<float>& input_signal);
    val RhythmExtractor(std::vector<float>& input_signal, const int frameHop=1024, const int frameSize=1024, const int hopSize=256, const float lastBeatInterval=0.1, const int maxTempo=208, const int minTempo=40, const int numberFrames=1024, const float sampleRate=44100, const std::vector<float>& tempoHints=std::vector<float>(), const float tolerance=0.24, const bool useBands=true, const bool useOnset=true);
    val RhythmExtractor2013(std::vector<float>& input_signal, const int maxTempo=208, const std::string& method="multifeature", const int minTempo=40);
    val RhythmTransform(std::vector<std::vector<float> >& input_melBands, const int frameSize=256, const int hopSize=32);
    val RollOff(std::vector<float>& input_spectrum, const float cutoff=0.85, const float sampleRate=44100);
    val SBic(std::vector<float>& input_features, const float cpw=1.5, const int inc1=60, const int inc2=20, const int minLength=10, const int size1=300, const int size2=200);
    val SNR(std::vector<float>& input_frame, const float MAAlpha=0.95, const float MMSEAlpha=0.98, const float NoiseAlpha=0.9, const int frameSize=512, const float noiseThreshold=-40, const float sampleRate=44100, const bool useBroadbadNoiseCorrection=true);
    val SaturationDetector(std::vector<float>& input_frame, const float differentialThreshold=0.001, const float energyThreshold=-1, const int frameSize=512, const int hopSize=256, const float minimumDuration=0.005, const float sampleRate=44100);
    val Scale(std::vector<float>& input_signal, const bool clipping=true, const float factor=10, const float maxAbsValue=1);
    val SineModelAnal(std::vector<float>& input_fft, const float freqDevOffset=20, const float freqDevSlope=0.01, const float magnitudeThreshold=-74, const float maxFrequency=22050, const int maxPeaks=250, const int maxnSines=100, const float minFrequency=0, const std::string& orderBy="frequency", const float sampleRate=44100);
    val SineModelSynth(std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases, const int fftSize=2048, const int hopSize=512, const float sampleRate=44100);
    val SineSubtraction(std::vector<float>& input_frame, std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases, const int fftSize=512, const int hopSize=128, const float sampleRate=44100);
    val SingleBeatLoudness(std::vector<float>& input_beat, const float beatDuration=0.05, const float beatWindowDuration=0.1, const std::vector<float>& frequencyBands=std::vector<float>{0, 200, 400, 800, 1600, 3200, 22000}, const std::string& onsetStart="sumEnergy", const float sampleRate=44100);
    val SingleGaussian(std::vector<float>& input_matrix);
    val Slicer(std::vector<float>& input_audio, const std::vector<float>& endTimes=std::vector<float>(), const float sampleRate=44100, const std::vector<float>& startTimes=std::vector<float>(), const std::string& timeUnits="seconds");
    val SpectralCentroidTime(std::vector<float>& input_array, const float sampleRate=44100);
    val SpectralComplexity(std::vector<float>& input_spectrum, const float magnitudeThreshold=0.005, const float sampleRate=44100);
    val SpectralContrast(std::vector<float>& input_spectrum, const int frameSize=2048, const float highFrequencyBound=11000, const float lowFrequencyBound=20, const float neighbourRatio=0.4, const int numberBands=6, const float sampleRate=22050, const float staticDistribution=0.15);
    val SpectralPeaks(std::vector<float>& input_spectrum, const float magnitudeThreshold=0, const float maxFrequency=5000, const int maxPeaks=100, const float minFrequency=0, const std::string& orderBy="frequency", const float sampleRate=44100);
    val SpectralWhitening(std::vector<float>& input_spectrum, std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, const float maxFrequency=5000, const float sampleRate=44100);
    val Spectrum(std::vector<float>& input_frame, const int size=2048);
    val SpectrumCQ(std::vector<float>& input_frame, const int binsPerOctave=12, const float minFrequency=32.7, const int minimumKernelSize=4, const int numberBins=84, const float sampleRate=44100, const float scale=1, const float threshold=0.01, const std::string& windowType="hann", const bool zeroPhase=true);
    val SpectrumToCent(std::vector<float>& input_spectrum, const int bands=720, const float centBinResolution=10, const int inputSize=32768, const bool log=true, const float minimumFrequency=164, const std::string& normalize="unit_sum", const float sampleRate=44100, const std::string& type="power");
    val Spline(float input_x, const float beta1=1, const float beta2=0, const std::string& type="b", const std::vector<float>& xPoints=std::vector<float>{0, 1}, const std::vector<float>& yPoints=std::vector<float>{0, 1});
    val SprModelAnal(std::vector<float>& input_frame, const int fftSize=2048, const int freqDevOffset=20, const float freqDevSlope=0.01, const int hopSize=512, const float magnitudeThreshold=0, const float maxFrequency=5000, const int maxPeaks=100, const int maxnSines=100, const float minFrequency=0, const std::string& orderBy="frequency", const float sampleRate=44100);
    val SprModelSynth(std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases, std::vector<float>& input_res, const int fftSize=2048, const int hopSize=512, const float sampleRate=44100);
    val SpsModelAnal(std::vector<float>& input_frame, const int fftSize=2048, const int freqDevOffset=20, const float freqDevSlope=0.01, const int hopSize=512, const float magnitudeThreshold=0, const float maxFrequency=5000, const int maxPeaks=100, const int maxnSines=100, const float minFrequency=0, const std::string& orderBy="frequency", const float sampleRate=44100, const float stocf=0.2);
    val SpsModelSynth(std::vector<float>& input_magnitudes, std::vector<float>& input_frequencies, std::vector<float>& input_phases, std::vector<float>& input_stocenv, const int fftSize=2048, const int hopSize=512, const float sampleRate=44100, const float stocf=0.2);
    val StartStopCut(std::vector<float>& input_audio, const int frameSize=256, const int hopSize=256, const float maximumStartTime=10, const float maximumStopTime=10, const float sampleRate=44100, const int threshold=-60);
    val StartStopSilence(std::vector<float>& input_frame, const int threshold=-60);
    val StereoDemuxer(std::vector<std::vector<float> >& input_audio);
    val StereoMuxer(std::vector<float>& input_left, std::vector<float>& input_right);
    val StereoTrimmer(std::vector<std::vector<float> >& input_signal, const bool checkRange=false, const float endTime=1e+06, const float sampleRate=44100, const float startTime=0);
    val StochasticModelAnal(std::vector<float>& input_frame, const int fftSize=2048, const int hopSize=512, const float sampleRate=44100, const float stocf=0.2);
    val StochasticModelSynth(std::vector<float>& input_stocenv, const int fftSize=2048, const int hopSize=512, const float sampleRate=44100, const float stocf=0.2);
    val StrongDecay(std::vector<float>& input_signal, const float sampleRate=44100);
    val StrongPeak(std::vector<float>& input_spectrum);
    val SuperFluxExtractor(std::vector<float>& input_signal, const float combine=20, const int frameSize=2048, const int hopSize=256, const float ratioThreshold=16, const float sampleRate=44100, const float threshold=0.05);
    val SuperFluxNovelty(std::vector<std::vector<float> >& input_bands, const int binWidth=3, const int frameWidth=2);
    val SuperFluxPeaks(std::vector<float>& input_novelty, const float combine=30, const float frameRate=172, const float pre_avg=100, const float pre_max=30, const float ratioThreshold=16, const float threshold=0.05);
    val TCToTotal(std::vector<float>& input_envelope);
    val TempoScaleBands(std::vector<float>& input_bands, const std::vector<float>& bandsGain=std::vector<float>{2, 3, 2, 1, 1.20000004768, 2, 3, 2.5}, const float frameTime=512);
    val TempoTap(std::vector<float>& input_featuresFrame, const int frameHop=1024, const int frameSize=256, const int maxTempo=208, const int minTempo=40, const int numberFrames=1024, const float sampleRate=44100, const std::vector<float>& tempoHints=std::vector<float>());
    val TempoTapDegara(std::vector<float>& input_onsetDetections, const int maxTempo=208, const int minTempo=40, const std::string& resample="none", const float sampleRateODF=86.1328);
    val TempoTapMaxAgreement(std::vector<std::vector<float> >& input_tickCandidates);
    val TempoTapTicks(std::vector<float>& input_periods, std::vector<float>& input_phases, const int frameHop=512, const int hopSize=256, const float sampleRate=44100);
    val TonalExtractor(std::vector<float>& input_signal, const int frameSize=4096, const int hopSize=2048, const float tuningFrequency=440);
    val TonicIndianArtMusic(std::vector<float>& input_signal, const float binResolution=10, const int frameSize=2048, const float harmonicWeight=0.85, const int hopSize=512, const float magnitudeCompression=1, const float magnitudeThreshold=40, const float maxTonicFrequency=375, const float minTonicFrequency=100, const int numberHarmonics=20, const int numberSaliencePeaks=5, const float referenceFrequency=55, const float sampleRate=44100);
    val TriangularBands(std::vector<float>& input_spectrum, const std::vector<float>& frequencyBands=std::vector<float>{21.533203125, 43.06640625, 64.599609375, 86.1328125, 107.666015625, 129.19921875, 150.732421875, 172.265625, 193.798828125, 215.33203125, 236.865234375, 258.3984375, 279.931640625, 301.46484375, 322.998046875, 344.53125, 366.064453125, 387.59765625, 409.130859375, 430.6640625, 452.197265625, 473.73046875, 495.263671875, 516.796875, 538.330078125, 559.86328125, 581.396484375, 602.9296875, 624.462890625, 645.99609375, 667.529296875, 689.0625, 710.595703125, 732.12890625, 753.662109375, 775.1953125, 796.728515625, 839.794921875, 861.328125, 882.861328125, 904.39453125, 925.927734375, 968.994140625, 990.52734375, 1012.06054688, 1055.12695312, 1076.66015625, 1098.19335938, 1141.25976562, 1184.32617188, 1205.859375, 1248.92578125, 1270.45898438, 1313.52539062, 1356.59179688, 1399.65820312, 1442.72460938, 1485.79101562, 1528.85742188, 1571.92382812, 1614.99023438, 1658.05664062, 1701.12304688, 1765.72265625, 1808.7890625, 1873.38867188, 1916.45507812, 1981.0546875, 2024.12109375, 2088.72070312, 2153.3203125, 2217.91992188, 2282.51953125, 2347.11914062, 2411.71875, 2497.8515625, 2562.45117188, 2627.05078125, 2713.18359375, 2799.31640625, 2885.44921875, 2950.04882812, 3036.18164062, 3143.84765625, 3229.98046875, 3316.11328125, 3423.77929688, 3509.91210938, 3617.578125, 3725.24414062, 3832.91015625, 3940.57617188, 4069.77539062, 4177.44140625, 4306.640625, 4435.83984375, 4565.0390625, 4694.23828125, 4844.97070312, 4974.16992188, 5124.90234375, 5275.63476562, 5426.3671875, 5577.09960938, 5749.36523438, 5921.63085938, 6093.89648438, 6266.16210938, 6459.9609375, 6653.75976562, 6847.55859375, 7041.35742188, 7256.68945312, 7450.48828125, 7687.35351562, 7902.68554688, 8139.55078125, 8376.41601562, 8613.28125, 8871.6796875, 9130.078125, 9388.4765625, 9668.40820312, 9948.33984375, 10249.8046875, 10551.2695312, 10852.734375, 11175.7324219, 11498.7304688, 11843.2617188, 12187.7929688, 12553.8574219, 12919.921875, 13285.9863281, 13673.5839844, 14082.7148438, 14491.8457031, 14922.5097656, 15353.1738281, 15805.3710938, 16257.5683594}, const int inputSize=1025, const bool log=true, const std::string& normalize="unit_sum", const float sampleRate=44100, const std::string& type="power", const std::string& weighting="linear");
    val TriangularBarkBands(std::vector<float>& input_spectrum, const float highFrequencyBound=22050, const int inputSize=1025, const bool log=false, const float lowFrequencyBound=0, const std::string& normalize="unit_sum", const int numberBands=24, const float sampleRate=44100, const std::string& type="power", const std::string& weighting="warping");
    val Trimmer(std::vector<float>& input_signal, const bool checkRange=false, const float endTime=1e+06, const float sampleRate=44100, const float startTime=0);
    val Tristimulus(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes);
    val TruePeakDetector(std::vector<float>& input_signal, const bool blockDC=false, const bool emphasise=false, const int oversamplingFactor=4, const int quality=1, const float sampleRate=44100, const float threshold=-0.0002, const int version=4);
    val TuningFrequency(std::vector<float>& input_frequencies, std::vector<float>& input_magnitudes, const float resolution=1);
    val TuningFrequencyExtractor(std::vector<float>& input_signal, const int frameSize=4096, const int hopSize=2048);
    val UnaryOperator(std::vector<float>& input_array, const float scale=1, const float shift=0, const std::string& type="identity");
    val UnaryOperatorStream(std::vector<float>& input_array, const float scale=1, const float shift=0, const std::string& type="identity");
    val Variance(std::vector<float>& input_array);
    val Vibrato(std::vector<float>& input_pitch, const float maxExtend=250, const float maxFrequency=8, const float minExtend=50, const float minFrequency=4, const float sampleRate=344.531);
    val WarpedAutoCorrelation(std::vector<float>& input_array, const int maxLag=1, const float sampleRate=44100);
    val Welch(std::vector<float>& input_frame, const int averagingFrames=10, const int fftSize=1024, const int frameSize=512, const float sampleRate=44100, const std::string& scaling="density", const std::string& windowType="hann");
    val Windowing(std::vector<float>& input_frame, const bool normalized=true, const int size=1024, const std::string& type="hann", const int zeroPadding=0, const bool zeroPhase=true);
    val ZeroCrossingRate(std::vector<float>& input_signal, const float threshold=0);
};

#endif  // ESSENTIAJS_H