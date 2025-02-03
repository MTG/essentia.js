const { expect } = require('chai');
const EssentiaWASM = require('../dist/essentia-wasm.umd.js');
const {
  ready,
  arrayToVector,
  vectorToArray,
  FrameGenerator,
  MonoMixer,
  LoudnessEBUR128,
  AfterMaxToBeforeMaxEnergyRatio,
  AllPass,
  AudioOnsetsMarker,
  AutoCorrelation,
  BFCC,
  BPF,
  BandPass,
  BandReject,
  BarkBands,
  BeatTrackerDegara,
  BeatTrackerMultiFeature,
  Beatogram,
  BeatsLoudness,
  BinaryOperator,
  BinaryOperatorStream,
  BpmHistogramDescriptors,
  BpmRubato,
  CentralMoments,
  Centroid,
  ChordsDescriptors,
  ChordsDetection,
  ChordsDetectionBeats,
  ChromaCrossSimilarity,
  Chromagram,
  ClickDetector,
  Clipper,
  CoverSongSimilarity,
  Crest,
  CrossCorrelation,
  CrossSimilarityMatrix,
  CubicSpline,
  DCRemoval,
  DCT,
  Danceability,
  Decrease,
  Derivative,
  DerivativeSFX,
  DiscontinuityDetector,
  Dissonance,
  DistributionShape,
  Duration,
  DynamicComplexity,
  ERBBands,
  EffectiveDuration,
  Energy,
  EnergyBand,
  EnergyBandRatio,
  Entropy,
  Envelope,
  EqualLoudness,
  Flatness,
  FlatnessDB,
  FlatnessSFX,
  Flux,
  FrameCutter,
  FrameToReal,
  FrequencyBands,
  GFCC,
  GapsDetector,
  GeometricMean,
  HFC,
  HPCP,
  HarmonicBpm,
  HarmonicPeaks,
  HighPass,
  HighResolutionFeatures,
  Histogram,
  HprModelAnal,
  HpsModelAnal,
  IDCT,
  IIR,
  Inharmonicity,
  InstantPower,
  Intensity,
  Key,
  KeyExtractor,
  LPC,
  Larm,
  Leq,
  LevelExtractor,
  LogAttackTime,
  LogSpectrum,
  LoopBpmConfidence,
  LoopBpmEstimator,
  Loudness,
  LoudnessVickers,
  LowLevelSpectralEqloudExtractor,
  LowLevelSpectralExtractor,
  LowPass,
  MFCC,
  MaxFilter,
  MaxMagFreq,
  MaxToTotal,
  Mean,
  Median,
  MedianFilter,
  MelBands,
  Meter,
  MinMax,
  MinToTotal,
  MovingAverage,
  MultiPitchKlapuri,
  MultiPitchMelodia,
  Multiplexer,
  NNLSChroma,
  NoiseAdder,
  NoiseBurstDetector,
  NoveltyCurve,
  NoveltyCurveFixedBpmEstimator,
  OddToEvenHarmonicEnergyRatio,
  OnsetDetection,
  OnsetDetectionGlobal,
  OnsetRate,
  OverlapAdd,
  PeakDetection,
  PercivalBpmEstimator,
  PercivalEnhanceHarmonics,
  PercivalEvaluatePulseTrains,
  PitchContourSegmentation,
  PitchContours,
  PitchContoursMelody,
  PitchContoursMonoMelody,
  PitchContoursMultiMelody,
  PitchFilter,
  PitchMelodia,
  PitchSalience,
  PitchSalienceFunction,
  PitchSalienceFunctionPeaks,
  PitchYin,
  PitchYinFFT,
  PitchYinProbabilistic,
  PitchYinProbabilities,
  PitchYinProbabilitiesHMM,
  PowerMean,
  PowerSpectrum,
  PredominantPitchMelodia,
  RMS,
  RawMoments,
  ReplayGain,
  Resample,
  ResampleFFT,
  RhythmDescriptors,
  RhythmExtractor,
  RhythmExtractor2013,
  RhythmTransform,
  RollOff,
  SNR,
  SaturationDetector,
  Scale,
  SineSubtraction,
  SingleBeatLoudness,
  Slicer,
  SpectralCentroidTime,
  SpectralComplexity,
  SpectralContrast,
  SpectralPeaks,
  SpectralWhitening,
  Spectrum,
  SpectrumCQ,
  SpectrumToCent,
  Spline,
  SprModelAnal,
  SprModelSynth,
  SpsModelAnal,
  SpsModelSynth,
  StartStopCut,
  StartStopSilence,
  StochasticModelAnal,
  StochasticModelSynth,
  StrongDecay,
  StrongPeak,
  SuperFluxExtractor,
  SuperFluxNovelty,
  SuperFluxPeaks,
  TCToTotal,
  TempoScaleBands,
  TempoTap,
  TempoTapDegara,
  TempoTapMaxAgreement,
  TempoTapTicks,
  TensorflowInputFSDSINet,
  TensorflowInputMusiCNN,
  TensorflowInputTempoCNN,
  TensorflowInputVGGish,
  TonalExtractor,
  TonicIndianArtMusic,
  TriangularBands,
  TriangularBarkBands,
  Trimmer,
  Tristimulus,
  TruePeakDetector,
  TuningFrequency,
  TuningFrequencyExtractor,
  UnaryOperator,
  UnaryOperatorStream,
  Variance,
  Vibrato,
  WarpedAutoCorrelation,
  Welch,
  Windowing,
  ZeroCrossingRate,
} = require('../dist/essentia.js-core.umd.js');

ready(EssentiaWASM);

// NOTE: The following code snippets are machine generated. Do not edit.

	describe('AfterMaxToBeforeMaxEnergyRatio:instantiation', () => {
		let afterMaxToBeforeMaxEnergyRatioInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			afterMaxToBeforeMaxEnergyRatioInstance = new AfterMaxToBeforeMaxEnergyRatio();
			expect(afterMaxToBeforeMaxEnergyRatioInstance).to.be.instanceOf(AfterMaxToBeforeMaxEnergyRatio);
		});
		it('should delete instance', function () {
			if (!afterMaxToBeforeMaxEnergyRatioInstance) this.skip();
			afterMaxToBeforeMaxEnergyRatioInstance.delete();
		});
	});

	describe('AfterMaxToBeforeMaxEnergyRatio:functionality', () => {
		let afterMaxToBeforeMaxEnergyRatioInstance;
		let AfterMaxToBeforeMaxEnergyRatioValidInput;
		let AfterMaxToBeforeMaxEnergyRatioValidInputVector;

		before(() => {
			afterMaxToBeforeMaxEnergyRatioInstance = new AfterMaxToBeforeMaxEnergyRatio();
			AfterMaxToBeforeMaxEnergyRatioValidInput = Array(1028).fill(0).map( _ => Math.random() );
			AfterMaxToBeforeMaxEnergyRatioValidInputVector = arrayToVector(AfterMaxToBeforeMaxEnergyRatioValidInput)
		});
		after(() => {
			afterMaxToBeforeMaxEnergyRatioInstance.delete();
			AfterMaxToBeforeMaxEnergyRatioValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				afterMaxToBeforeMaxEnergyRatioInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = afterMaxToBeforeMaxEnergyRatioInstance.compute(AfterMaxToBeforeMaxEnergyRatioValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('afterMaxToBeforeMaxEnergyRatio');
		});
	});
	



	describe('AllPass:instantiation', () => {
		let allPassInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			allPassInstance = new AllPass();
			expect(allPassInstance).to.be.instanceOf(AllPass);
		});
		it('should delete instance', function () {
			if (!allPassInstance) this.skip();
			allPassInstance.delete();
		});
	});

	describe('AllPass:functionality', () => {
		let allPassInstance;
		let AllPassValidInput;
		let AllPassValidInputVector;

		before(() => {
			allPassInstance = new AllPass();
			AllPassValidInput = Array(1028).fill(0).map( _ => Math.random() );
			AllPassValidInputVector = arrayToVector(AllPassValidInput)
		});
		after(() => {
			allPassInstance.delete();
			AllPassValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				allPassInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = allPassInstance.compute(AllPassValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('AudioOnsetsMarker:instantiation', () => {
		let audioOnsetsMarkerInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			audioOnsetsMarkerInstance = new AudioOnsetsMarker();
			expect(audioOnsetsMarkerInstance).to.be.instanceOf(AudioOnsetsMarker);
		});
		it('should delete instance', function () {
			if (!audioOnsetsMarkerInstance) this.skip();
			audioOnsetsMarkerInstance.delete();
		});
	});

	describe('AudioOnsetsMarker:functionality', () => {
		let audioOnsetsMarkerInstance;
		let AudioOnsetsMarkerValidInput;
		let AudioOnsetsMarkerValidInputVector;

		before(() => {
			audioOnsetsMarkerInstance = new AudioOnsetsMarker();
			AudioOnsetsMarkerValidInput = Array(1028).fill(0).map( _ => Math.random() );
			AudioOnsetsMarkerValidInputVector = arrayToVector(AudioOnsetsMarkerValidInput)
		});
		after(() => {
			audioOnsetsMarkerInstance.delete();
			AudioOnsetsMarkerValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				audioOnsetsMarkerInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = audioOnsetsMarkerInstance.compute(AudioOnsetsMarkerValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('AutoCorrelation:instantiation', () => {
		let autoCorrelationInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			autoCorrelationInstance = new AutoCorrelation();
			expect(autoCorrelationInstance).to.be.instanceOf(AutoCorrelation);
		});
		it('should delete instance', function () {
			if (!autoCorrelationInstance) this.skip();
			autoCorrelationInstance.delete();
		});
	});

	describe('AutoCorrelation:functionality', () => {
		let autoCorrelationInstance;
		let AutoCorrelationValidInput;
		let AutoCorrelationValidInputVector;

		before(() => {
			autoCorrelationInstance = new AutoCorrelation();
			AutoCorrelationValidInput = Array(1028).fill(0).map( _ => Math.random() );
			AutoCorrelationValidInputVector = arrayToVector(AutoCorrelationValidInput)
		});
		after(() => {
			autoCorrelationInstance.delete();
			AutoCorrelationValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				autoCorrelationInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = autoCorrelationInstance.compute(AutoCorrelationValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('autoCorrelation');
		});
	});
	



	describe('BFCC:instantiation', () => {
		let bFCCInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			bFCCInstance = new BFCC();
			expect(bFCCInstance).to.be.instanceOf(BFCC);
		});
		it('should delete instance', function () {
			if (!bFCCInstance) this.skip();
			bFCCInstance.delete();
		});
	});

	describe('BFCC:functionality', () => {
		let bFCCInstance;
		let BFCCValidInput;
		let BFCCValidInputVector;

		before(() => {
			bFCCInstance = new BFCC();
			BFCCValidInput = Array(1025).fill(0).map( _ => Math.random() );
			BFCCValidInputVector = arrayToVector(BFCCValidInput)
		});
		after(() => {
			bFCCInstance.delete();
			BFCCValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				bFCCInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = bFCCInstance.compute(BFCCValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bands');
expect(result).to.have.property('bfcc');
		});
	});
	



	describe('BPF:instantiation', () => {
		let bPFInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			bPFInstance = new BPF();
			expect(bPFInstance).to.be.instanceOf(BPF);
		});
		it('should delete instance', function () {
			if (!bPFInstance) this.skip();
			bPFInstance.delete();
		});
	});

	describe('BPF:functionality', () => {
		let bPFInstance;
		let BPFValidInput;
		let BPFValidInputVector;

		before(() => {
			bPFInstance = new BPF();
			BPFValidInput = Array(1028).fill(0).map( _ => Math.random() );
			BPFValidInputVector = arrayToVector(BPFValidInput)
		});
		after(() => {
			bPFInstance.delete();
			BPFValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				bPFInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = bPFInstance.compute(BPFValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('y');
		});
	});
	



	describe('BandPass:instantiation', () => {
		let bandPassInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			bandPassInstance = new BandPass();
			expect(bandPassInstance).to.be.instanceOf(BandPass);
		});
		it('should delete instance', function () {
			if (!bandPassInstance) this.skip();
			bandPassInstance.delete();
		});
	});

	describe('BandPass:functionality', () => {
		let bandPassInstance;
		let BandPassValidInput;
		let BandPassValidInputVector;

		before(() => {
			bandPassInstance = new BandPass();
			BandPassValidInput = Array(1028).fill(0).map( _ => Math.random() );
			BandPassValidInputVector = arrayToVector(BandPassValidInput)
		});
		after(() => {
			bandPassInstance.delete();
			BandPassValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				bandPassInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = bandPassInstance.compute(BandPassValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('BandReject:instantiation', () => {
		let bandRejectInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			bandRejectInstance = new BandReject();
			expect(bandRejectInstance).to.be.instanceOf(BandReject);
		});
		it('should delete instance', function () {
			if (!bandRejectInstance) this.skip();
			bandRejectInstance.delete();
		});
	});

	describe('BandReject:functionality', () => {
		let bandRejectInstance;
		let BandRejectValidInput;
		let BandRejectValidInputVector;

		before(() => {
			bandRejectInstance = new BandReject();
			BandRejectValidInput = Array(1028).fill(0).map( _ => Math.random() );
			BandRejectValidInputVector = arrayToVector(BandRejectValidInput)
		});
		after(() => {
			bandRejectInstance.delete();
			BandRejectValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				bandRejectInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = bandRejectInstance.compute(BandRejectValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('BarkBands:instantiation', () => {
		let barkBandsInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			barkBandsInstance = new BarkBands();
			expect(barkBandsInstance).to.be.instanceOf(BarkBands);
		});
		it('should delete instance', function () {
			if (!barkBandsInstance) this.skip();
			barkBandsInstance.delete();
		});
	});

	describe('BarkBands:functionality', () => {
		let barkBandsInstance;
		let BarkBandsValidInput;
		let BarkBandsValidInputVector;

		before(() => {
			barkBandsInstance = new BarkBands();
			BarkBandsValidInput = Array(1028).fill(0).map( _ => Math.random() );
			BarkBandsValidInputVector = arrayToVector(BarkBandsValidInput)
		});
		after(() => {
			barkBandsInstance.delete();
			BarkBandsValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				barkBandsInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = barkBandsInstance.compute(BarkBandsValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bands');
		});
	});
	



	describe('BeatTrackerDegara:instantiation', () => {
		let beatTrackerDegaraInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			beatTrackerDegaraInstance = new BeatTrackerDegara();
			expect(beatTrackerDegaraInstance).to.be.instanceOf(BeatTrackerDegara);
		});
		it('should delete instance', function () {
			if (!beatTrackerDegaraInstance) this.skip();
			beatTrackerDegaraInstance.delete();
		});
	});

	describe('BeatTrackerDegara:functionality', () => {
		let beatTrackerDegaraInstance;
		let BeatTrackerDegaraValidInput;
		let BeatTrackerDegaraValidInputVector;

		before(() => {
			beatTrackerDegaraInstance = new BeatTrackerDegara();
			BeatTrackerDegaraValidInput = Array(1028).fill(0).map( _ => Math.random() );
			BeatTrackerDegaraValidInputVector = arrayToVector(BeatTrackerDegaraValidInput)
		});
		after(() => {
			beatTrackerDegaraInstance.delete();
			BeatTrackerDegaraValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				beatTrackerDegaraInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = beatTrackerDegaraInstance.compute(BeatTrackerDegaraValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('ticks');
		});
	});
	



	describe('BeatTrackerMultiFeature:instantiation', () => {
		let beatTrackerMultiFeatureInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			beatTrackerMultiFeatureInstance = new BeatTrackerMultiFeature();
			expect(beatTrackerMultiFeatureInstance).to.be.instanceOf(BeatTrackerMultiFeature);
		});
		it('should delete instance', function () {
			if (!beatTrackerMultiFeatureInstance) this.skip();
			beatTrackerMultiFeatureInstance.delete();
		});
	});

	describe('BeatTrackerMultiFeature:functionality', () => {
		let beatTrackerMultiFeatureInstance;
		let BeatTrackerMultiFeatureValidInput;
		let BeatTrackerMultiFeatureValidInputVector;

		before(() => {
			beatTrackerMultiFeatureInstance = new BeatTrackerMultiFeature();
			BeatTrackerMultiFeatureValidInput = Array(1028).fill(0).map( _ => Math.random() );
			BeatTrackerMultiFeatureValidInputVector = arrayToVector(BeatTrackerMultiFeatureValidInput)
		});
		after(() => {
			beatTrackerMultiFeatureInstance.delete();
			BeatTrackerMultiFeatureValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				beatTrackerMultiFeatureInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = beatTrackerMultiFeatureInstance.compute(BeatTrackerMultiFeatureValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('ticks');
expect(result).to.have.property('confidence');
		});
	});
	



	describe('Beatogram:instantiation', () => {
		let beatogramInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			beatogramInstance = new Beatogram();
			expect(beatogramInstance).to.be.instanceOf(Beatogram);
		});
		it('should delete instance', function () {
			if (!beatogramInstance) this.skip();
			beatogramInstance.delete();
		});
	});

	describe('Beatogram:functionality', () => {
		let beatogramInstance;
		let BeatogramValidInput;
		let BeatogramValidInputVector;

		before(() => {
			beatogramInstance = new Beatogram();
			BeatogramValidInput = Array(1028).fill(0).map( _ => Math.random() );
			BeatogramValidInputVector = arrayToVector(BeatogramValidInput)
		});
		after(() => {
			beatogramInstance.delete();
			BeatogramValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				beatogramInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = beatogramInstance.compute(BeatogramValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('beatogram');
		});
	});
	



	describe('BeatsLoudness:instantiation', () => {
		let beatsLoudnessInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			beatsLoudnessInstance = new BeatsLoudness();
			expect(beatsLoudnessInstance).to.be.instanceOf(BeatsLoudness);
		});
		it('should delete instance', function () {
			if (!beatsLoudnessInstance) this.skip();
			beatsLoudnessInstance.delete();
		});
	});

	describe('BeatsLoudness:functionality', () => {
		let beatsLoudnessInstance;
		let BeatsLoudnessValidInput;
		let BeatsLoudnessValidInputVector;

		before(() => {
			beatsLoudnessInstance = new BeatsLoudness();
			BeatsLoudnessValidInput = Array(1028).fill(0).map( _ => Math.random() );
			BeatsLoudnessValidInputVector = arrayToVector(BeatsLoudnessValidInput)
		});
		after(() => {
			beatsLoudnessInstance.delete();
			BeatsLoudnessValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				beatsLoudnessInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = beatsLoudnessInstance.compute(BeatsLoudnessValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('loudness');
expect(result).to.have.property('loudnessBandRatio');
		});
	});
	



	describe('BinaryOperator:instantiation', () => {
		let binaryOperatorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			binaryOperatorInstance = new BinaryOperator();
			expect(binaryOperatorInstance).to.be.instanceOf(BinaryOperator);
		});
		it('should delete instance', function () {
			if (!binaryOperatorInstance) this.skip();
			binaryOperatorInstance.delete();
		});
	});

	describe('BinaryOperator:functionality', () => {
		let binaryOperatorInstance;
		let BinaryOperatorValidInput;
		let BinaryOperatorValidInputVector;

		before(() => {
			binaryOperatorInstance = new BinaryOperator();
			BinaryOperatorValidInput = Array(1028).fill(0).map( _ => Math.random() );
			BinaryOperatorValidInputVector = arrayToVector(BinaryOperatorValidInput)
		});
		after(() => {
			binaryOperatorInstance.delete();
			BinaryOperatorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				binaryOperatorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = binaryOperatorInstance.compute(BinaryOperatorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('array');
		});
	});
	



	describe('BinaryOperatorStream:instantiation', () => {
		let binaryOperatorStreamInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			binaryOperatorStreamInstance = new BinaryOperatorStream();
			expect(binaryOperatorStreamInstance).to.be.instanceOf(BinaryOperatorStream);
		});
		it('should delete instance', function () {
			if (!binaryOperatorStreamInstance) this.skip();
			binaryOperatorStreamInstance.delete();
		});
	});

	describe('BinaryOperatorStream:functionality', () => {
		let binaryOperatorStreamInstance;
		let BinaryOperatorStreamValidInput;
		let BinaryOperatorStreamValidInputVector;

		before(() => {
			binaryOperatorStreamInstance = new BinaryOperatorStream();
			BinaryOperatorStreamValidInput = Array(1028).fill(0).map( _ => Math.random() );
			BinaryOperatorStreamValidInputVector = arrayToVector(BinaryOperatorStreamValidInput)
		});
		after(() => {
			binaryOperatorStreamInstance.delete();
			BinaryOperatorStreamValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				binaryOperatorStreamInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = binaryOperatorStreamInstance.compute(BinaryOperatorStreamValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('array');
		});
	});
	



	describe('BpmHistogramDescriptors:instantiation', () => {
		let bpmHistogramDescriptorsInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			bpmHistogramDescriptorsInstance = new BpmHistogramDescriptors();
			expect(bpmHistogramDescriptorsInstance).to.be.instanceOf(BpmHistogramDescriptors);
		});
		it('should delete instance', function () {
			if (!bpmHistogramDescriptorsInstance) this.skip();
			bpmHistogramDescriptorsInstance.delete();
		});
	});

	describe('BpmHistogramDescriptors:functionality', () => {
		let bpmHistogramDescriptorsInstance;
		let BpmHistogramDescriptorsValidInput;
		let BpmHistogramDescriptorsValidInputVector;

		before(() => {
			bpmHistogramDescriptorsInstance = new BpmHistogramDescriptors();
			BpmHistogramDescriptorsValidInput = Array(1028).fill(0).map( _ => Math.random() );
			BpmHistogramDescriptorsValidInputVector = arrayToVector(BpmHistogramDescriptorsValidInput)
		});
		after(() => {
			bpmHistogramDescriptorsInstance.delete();
			BpmHistogramDescriptorsValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				bpmHistogramDescriptorsInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = bpmHistogramDescriptorsInstance.compute(BpmHistogramDescriptorsValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('firstPeakBPM');
expect(result).to.have.property('firstPeakWeight');
expect(result).to.have.property('firstPeakSpread');
expect(result).to.have.property('secondPeakBPM');
expect(result).to.have.property('secondPeakWeight');
expect(result).to.have.property('secondPeakSpread');
expect(result).to.have.property('histogram');
		});
	});
	



	describe('BpmRubato:instantiation', () => {
		let bpmRubatoInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			bpmRubatoInstance = new BpmRubato();
			expect(bpmRubatoInstance).to.be.instanceOf(BpmRubato);
		});
		it('should delete instance', function () {
			if (!bpmRubatoInstance) this.skip();
			bpmRubatoInstance.delete();
		});
	});

	describe('BpmRubato:functionality', () => {
		let bpmRubatoInstance;
		let BpmRubatoValidInput;
		let BpmRubatoValidInputVector;

		before(() => {
			bpmRubatoInstance = new BpmRubato();
			BpmRubatoValidInput = Array(1028).fill(0).map( _ => Math.random() );
			BpmRubatoValidInputVector = arrayToVector(BpmRubatoValidInput)
		});
		after(() => {
			bpmRubatoInstance.delete();
			BpmRubatoValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				bpmRubatoInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = bpmRubatoInstance.compute(BpmRubatoValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('rubatoStart');
expect(result).to.have.property('rubatoStop');
expect(result).to.have.property('rubatoNumber');
		});
	});
	



	describe('CentralMoments:instantiation', () => {
		let centralMomentsInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			centralMomentsInstance = new CentralMoments();
			expect(centralMomentsInstance).to.be.instanceOf(CentralMoments);
		});
		it('should delete instance', function () {
			if (!centralMomentsInstance) this.skip();
			centralMomentsInstance.delete();
		});
	});

	describe('CentralMoments:functionality', () => {
		let centralMomentsInstance;
		let CentralMomentsValidInput;
		let CentralMomentsValidInputVector;

		before(() => {
			centralMomentsInstance = new CentralMoments();
			CentralMomentsValidInput = Array(1028).fill(0).map( _ => Math.random() );
			CentralMomentsValidInputVector = arrayToVector(CentralMomentsValidInput)
		});
		after(() => {
			centralMomentsInstance.delete();
			CentralMomentsValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				centralMomentsInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = centralMomentsInstance.compute(CentralMomentsValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('centralMoments');
		});
	});
	



	describe('Centroid:instantiation', () => {
		let centroidInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			centroidInstance = new Centroid();
			expect(centroidInstance).to.be.instanceOf(Centroid);
		});
		it('should delete instance', function () {
			if (!centroidInstance) this.skip();
			centroidInstance.delete();
		});
	});

	describe('Centroid:functionality', () => {
		let centroidInstance;
		let CentroidValidInput;
		let CentroidValidInputVector;

		before(() => {
			centroidInstance = new Centroid();
			CentroidValidInput = Array(1028).fill(0).map( _ => Math.random() );
			CentroidValidInputVector = arrayToVector(CentroidValidInput)
		});
		after(() => {
			centroidInstance.delete();
			CentroidValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				centroidInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = centroidInstance.compute(CentroidValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('centroid');
		});
	});
	



	describe('ChordsDescriptors:instantiation', () => {
		let chordsDescriptorsInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			chordsDescriptorsInstance = new ChordsDescriptors();
			expect(chordsDescriptorsInstance).to.be.instanceOf(ChordsDescriptors);
		});
		it('should delete instance', function () {
			if (!chordsDescriptorsInstance) this.skip();
			chordsDescriptorsInstance.delete();
		});
	});

	describe('ChordsDescriptors:functionality', () => {
		let chordsDescriptorsInstance;
		let ChordsDescriptorsValidInput;
		let ChordsDescriptorsValidInputVector;

		before(() => {
			chordsDescriptorsInstance = new ChordsDescriptors();
			ChordsDescriptorsValidInput = Array(1028).fill(0).map( _ => Math.random() );
			ChordsDescriptorsValidInputVector = arrayToVector(ChordsDescriptorsValidInput)
		});
		after(() => {
			chordsDescriptorsInstance.delete();
			ChordsDescriptorsValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				chordsDescriptorsInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = chordsDescriptorsInstance.compute(ChordsDescriptorsValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('chordsHistogram');
expect(result).to.have.property('chordsNumberRate');
expect(result).to.have.property('chordsChangesRate');
expect(result).to.have.property('chordsKey');
expect(result).to.have.property('chordsScale');
		});
	});
	



	describe('ChordsDetection:instantiation', () => {
		let chordsDetectionInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			chordsDetectionInstance = new ChordsDetection();
			expect(chordsDetectionInstance).to.be.instanceOf(ChordsDetection);
		});
		it('should delete instance', function () {
			if (!chordsDetectionInstance) this.skip();
			chordsDetectionInstance.delete();
		});
	});

	describe('ChordsDetection:functionality', () => {
		let chordsDetectionInstance;
		let ChordsDetectionValidInput;
		let ChordsDetectionValidInputVector;

		before(() => {
			chordsDetectionInstance = new ChordsDetection();
			ChordsDetectionValidInput = Array(1028).fill(0).map( _ => Math.random() );
			ChordsDetectionValidInputVector = arrayToVector(ChordsDetectionValidInput)
		});
		after(() => {
			chordsDetectionInstance.delete();
			ChordsDetectionValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				chordsDetectionInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = chordsDetectionInstance.compute(ChordsDetectionValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('chords');
expect(result).to.have.property('strength');
		});
	});
	



	describe('ChordsDetectionBeats:instantiation', () => {
		let chordsDetectionBeatsInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			chordsDetectionBeatsInstance = new ChordsDetectionBeats();
			expect(chordsDetectionBeatsInstance).to.be.instanceOf(ChordsDetectionBeats);
		});
		it('should delete instance', function () {
			if (!chordsDetectionBeatsInstance) this.skip();
			chordsDetectionBeatsInstance.delete();
		});
	});

	describe('ChordsDetectionBeats:functionality', () => {
		let chordsDetectionBeatsInstance;
		let ChordsDetectionBeatsValidInput;
		let ChordsDetectionBeatsValidInputVector;

		before(() => {
			chordsDetectionBeatsInstance = new ChordsDetectionBeats();
			ChordsDetectionBeatsValidInput = Array(1028).fill(0).map( _ => Math.random() );
			ChordsDetectionBeatsValidInputVector = arrayToVector(ChordsDetectionBeatsValidInput)
		});
		after(() => {
			chordsDetectionBeatsInstance.delete();
			ChordsDetectionBeatsValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				chordsDetectionBeatsInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = chordsDetectionBeatsInstance.compute(ChordsDetectionBeatsValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('chords');
expect(result).to.have.property('strength');
		});
	});
	



	describe('ChromaCrossSimilarity:instantiation', () => {
		let chromaCrossSimilarityInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			chromaCrossSimilarityInstance = new ChromaCrossSimilarity();
			expect(chromaCrossSimilarityInstance).to.be.instanceOf(ChromaCrossSimilarity);
		});
		it('should delete instance', function () {
			if (!chromaCrossSimilarityInstance) this.skip();
			chromaCrossSimilarityInstance.delete();
		});
	});

	describe('ChromaCrossSimilarity:functionality', () => {
		let chromaCrossSimilarityInstance;
		let ChromaCrossSimilarityValidInput;
		let ChromaCrossSimilarityValidInputVector;

		before(() => {
			chromaCrossSimilarityInstance = new ChromaCrossSimilarity();
			ChromaCrossSimilarityValidInput = Array(1028).fill(0).map( _ => Math.random() );
			ChromaCrossSimilarityValidInputVector = arrayToVector(ChromaCrossSimilarityValidInput)
		});
		after(() => {
			chromaCrossSimilarityInstance.delete();
			ChromaCrossSimilarityValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				chromaCrossSimilarityInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = chromaCrossSimilarityInstance.compute(ChromaCrossSimilarityValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('csm');
		});
	});
	



	describe('Chromagram:instantiation', () => {
		let chromagramInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			chromagramInstance = new Chromagram();
			expect(chromagramInstance).to.be.instanceOf(Chromagram);
		});
		it('should delete instance', function () {
			if (!chromagramInstance) this.skip();
			chromagramInstance.delete();
		});
	});

	describe('Chromagram:functionality', () => {
		let chromagramInstance;
		let ChromagramValidInput;
		let ChromagramValidInputVector;

		before(() => {
			chromagramInstance = new Chromagram();
			ChromagramValidInput = Array(1028).fill(0).map( _ => Math.random() );
			ChromagramValidInputVector = arrayToVector(ChromagramValidInput)
		});
		after(() => {
			chromagramInstance.delete();
			ChromagramValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				chromagramInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = chromagramInstance.compute(ChromagramValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('chromagram');
		});
	});
	



	describe('ClickDetector:instantiation', () => {
		let clickDetectorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			clickDetectorInstance = new ClickDetector();
			expect(clickDetectorInstance).to.be.instanceOf(ClickDetector);
		});
		it('should delete instance', function () {
			if (!clickDetectorInstance) this.skip();
			clickDetectorInstance.delete();
		});
	});

	describe('ClickDetector:functionality', () => {
		let clickDetectorInstance;
		let ClickDetectorValidInput;
		let ClickDetectorValidInputVector;

		before(() => {
			clickDetectorInstance = new ClickDetector();
			ClickDetectorValidInput = Array(512).fill(0).map( _ => Math.random() );
			ClickDetectorValidInputVector = arrayToVector(ClickDetectorValidInput)
		});
		after(() => {
			clickDetectorInstance.delete();
			ClickDetectorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				clickDetectorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = clickDetectorInstance.compute(ClickDetectorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('starts');
expect(result).to.have.property('ends');
		});
	});
	



	describe('Clipper:instantiation', () => {
		let clipperInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			clipperInstance = new Clipper();
			expect(clipperInstance).to.be.instanceOf(Clipper);
		});
		it('should delete instance', function () {
			if (!clipperInstance) this.skip();
			clipperInstance.delete();
		});
	});

	describe('Clipper:functionality', () => {
		let clipperInstance;
		let ClipperValidInput;
		let ClipperValidInputVector;

		before(() => {
			clipperInstance = new Clipper();
			ClipperValidInput = Array(1028).fill(0).map( _ => Math.random() );
			ClipperValidInputVector = arrayToVector(ClipperValidInput)
		});
		after(() => {
			clipperInstance.delete();
			ClipperValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				clipperInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = clipperInstance.compute(ClipperValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('CoverSongSimilarity:instantiation', () => {
		let coverSongSimilarityInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			coverSongSimilarityInstance = new CoverSongSimilarity();
			expect(coverSongSimilarityInstance).to.be.instanceOf(CoverSongSimilarity);
		});
		it('should delete instance', function () {
			if (!coverSongSimilarityInstance) this.skip();
			coverSongSimilarityInstance.delete();
		});
	});

	describe('CoverSongSimilarity:functionality', () => {
		let coverSongSimilarityInstance;
		let CoverSongSimilarityValidInput;
		let CoverSongSimilarityValidInputVector;

		before(() => {
			coverSongSimilarityInstance = new CoverSongSimilarity();
			CoverSongSimilarityValidInput = Array(1028).fill(0).map( _ => Math.random() );
			CoverSongSimilarityValidInputVector = arrayToVector(CoverSongSimilarityValidInput)
		});
		after(() => {
			coverSongSimilarityInstance.delete();
			CoverSongSimilarityValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				coverSongSimilarityInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = coverSongSimilarityInstance.compute(CoverSongSimilarityValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('scoreMatrix');
expect(result).to.have.property('distance');
		});
	});
	



	describe('Crest:instantiation', () => {
		let crestInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			crestInstance = new Crest();
			expect(crestInstance).to.be.instanceOf(Crest);
		});
		it('should delete instance', function () {
			if (!crestInstance) this.skip();
			crestInstance.delete();
		});
	});

	describe('Crest:functionality', () => {
		let crestInstance;
		let CrestValidInput;
		let CrestValidInputVector;

		before(() => {
			crestInstance = new Crest();
			CrestValidInput = Array(1028).fill(0).map( _ => Math.random() );
			CrestValidInputVector = arrayToVector(CrestValidInput)
		});
		after(() => {
			crestInstance.delete();
			CrestValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				crestInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = crestInstance.compute(CrestValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('crest');
		});
	});
	



	describe('CrossCorrelation:instantiation', () => {
		let crossCorrelationInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			crossCorrelationInstance = new CrossCorrelation();
			expect(crossCorrelationInstance).to.be.instanceOf(CrossCorrelation);
		});
		it('should delete instance', function () {
			if (!crossCorrelationInstance) this.skip();
			crossCorrelationInstance.delete();
		});
	});

	describe('CrossCorrelation:functionality', () => {
		let crossCorrelationInstance;
		let CrossCorrelationValidInput;
		let CrossCorrelationValidInputVector;

		before(() => {
			crossCorrelationInstance = new CrossCorrelation();
			CrossCorrelationValidInput = Array(1028).fill(0).map( _ => Math.random() );
			CrossCorrelationValidInputVector = arrayToVector(CrossCorrelationValidInput)
		});
		after(() => {
			crossCorrelationInstance.delete();
			CrossCorrelationValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				crossCorrelationInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = crossCorrelationInstance.compute(CrossCorrelationValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('crossCorrelation');
		});
	});
	



	describe('CrossSimilarityMatrix:instantiation', () => {
		let crossSimilarityMatrixInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			crossSimilarityMatrixInstance = new CrossSimilarityMatrix();
			expect(crossSimilarityMatrixInstance).to.be.instanceOf(CrossSimilarityMatrix);
		});
		it('should delete instance', function () {
			if (!crossSimilarityMatrixInstance) this.skip();
			crossSimilarityMatrixInstance.delete();
		});
	});

	describe('CrossSimilarityMatrix:functionality', () => {
		let crossSimilarityMatrixInstance;
		let CrossSimilarityMatrixValidInput;
		let CrossSimilarityMatrixValidInputVector;

		before(() => {
			crossSimilarityMatrixInstance = new CrossSimilarityMatrix();
			CrossSimilarityMatrixValidInput = Array(1028).fill(0).map( _ => Math.random() );
			CrossSimilarityMatrixValidInputVector = arrayToVector(CrossSimilarityMatrixValidInput)
		});
		after(() => {
			crossSimilarityMatrixInstance.delete();
			CrossSimilarityMatrixValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				crossSimilarityMatrixInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = crossSimilarityMatrixInstance.compute(CrossSimilarityMatrixValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('csm');
		});
	});
	



	describe('CubicSpline:instantiation', () => {
		let cubicSplineInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			cubicSplineInstance = new CubicSpline();
			expect(cubicSplineInstance).to.be.instanceOf(CubicSpline);
		});
		it('should delete instance', function () {
			if (!cubicSplineInstance) this.skip();
			cubicSplineInstance.delete();
		});
	});

	describe('CubicSpline:functionality', () => {
		let cubicSplineInstance;
		let CubicSplineValidInput;
		let CubicSplineValidInputVector;

		before(() => {
			cubicSplineInstance = new CubicSpline();
			CubicSplineValidInput = Array(1028).fill(0).map( _ => Math.random() );
			CubicSplineValidInputVector = arrayToVector(CubicSplineValidInput)
		});
		after(() => {
			cubicSplineInstance.delete();
			CubicSplineValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				cubicSplineInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = cubicSplineInstance.compute(CubicSplineValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('y');
expect(result).to.have.property('dy');
expect(result).to.have.property('ddy');
		});
	});
	



	describe('DCRemoval:instantiation', () => {
		let dCRemovalInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			dCRemovalInstance = new DCRemoval();
			expect(dCRemovalInstance).to.be.instanceOf(DCRemoval);
		});
		it('should delete instance', function () {
			if (!dCRemovalInstance) this.skip();
			dCRemovalInstance.delete();
		});
	});

	describe('DCRemoval:functionality', () => {
		let dCRemovalInstance;
		let DCRemovalValidInput;
		let DCRemovalValidInputVector;

		before(() => {
			dCRemovalInstance = new DCRemoval();
			DCRemovalValidInput = Array(1028).fill(0).map( _ => Math.random() );
			DCRemovalValidInputVector = arrayToVector(DCRemovalValidInput)
		});
		after(() => {
			dCRemovalInstance.delete();
			DCRemovalValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				dCRemovalInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = dCRemovalInstance.compute(DCRemovalValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('DCT:instantiation', () => {
		let dCTInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			dCTInstance = new DCT();
			expect(dCTInstance).to.be.instanceOf(DCT);
		});
		it('should delete instance', function () {
			if (!dCTInstance) this.skip();
			dCTInstance.delete();
		});
	});

	describe('DCT:functionality', () => {
		let dCTInstance;
		let DCTValidInput;
		let DCTValidInputVector;

		before(() => {
			dCTInstance = new DCT();
			DCTValidInput = Array(10).fill(0).map( _ => Math.random() );
			DCTValidInputVector = arrayToVector(DCTValidInput)
		});
		after(() => {
			dCTInstance.delete();
			DCTValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				dCTInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = dCTInstance.compute(DCTValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('dct');
		});
	});
	



	describe('Danceability:instantiation', () => {
		let danceabilityInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			danceabilityInstance = new Danceability();
			expect(danceabilityInstance).to.be.instanceOf(Danceability);
		});
		it('should delete instance', function () {
			if (!danceabilityInstance) this.skip();
			danceabilityInstance.delete();
		});
	});

	describe('Danceability:functionality', () => {
		let danceabilityInstance;
		let DanceabilityValidInput;
		let DanceabilityValidInputVector;

		before(() => {
			danceabilityInstance = new Danceability();
			DanceabilityValidInput = Array(1028).fill(0).map( _ => Math.random() );
			DanceabilityValidInputVector = arrayToVector(DanceabilityValidInput)
		});
		after(() => {
			danceabilityInstance.delete();
			DanceabilityValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				danceabilityInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = danceabilityInstance.compute(DanceabilityValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('danceability');
expect(result).to.have.property('dfa');
		});
	});
	



	describe('Decrease:instantiation', () => {
		let decreaseInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			decreaseInstance = new Decrease();
			expect(decreaseInstance).to.be.instanceOf(Decrease);
		});
		it('should delete instance', function () {
			if (!decreaseInstance) this.skip();
			decreaseInstance.delete();
		});
	});

	describe('Decrease:functionality', () => {
		let decreaseInstance;
		let DecreaseValidInput;
		let DecreaseValidInputVector;

		before(() => {
			decreaseInstance = new Decrease();
			DecreaseValidInput = Array(1028).fill(0).map( _ => Math.random() );
			DecreaseValidInputVector = arrayToVector(DecreaseValidInput)
		});
		after(() => {
			decreaseInstance.delete();
			DecreaseValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				decreaseInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = decreaseInstance.compute(DecreaseValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('decrease');
		});
	});
	



	describe('Derivative:instantiation', () => {
		let derivativeInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			derivativeInstance = new Derivative();
			expect(derivativeInstance).to.be.instanceOf(Derivative);
		});
		it('should delete instance', function () {
			if (!derivativeInstance) this.skip();
			derivativeInstance.delete();
		});
	});

	describe('Derivative:functionality', () => {
		let derivativeInstance;
		let DerivativeValidInput;
		let DerivativeValidInputVector;

		before(() => {
			derivativeInstance = new Derivative();
			DerivativeValidInput = Array(1028).fill(0).map( _ => Math.random() );
			DerivativeValidInputVector = arrayToVector(DerivativeValidInput)
		});
		after(() => {
			derivativeInstance.delete();
			DerivativeValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				derivativeInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = derivativeInstance.compute(DerivativeValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('DerivativeSFX:instantiation', () => {
		let derivativeSFXInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			derivativeSFXInstance = new DerivativeSFX();
			expect(derivativeSFXInstance).to.be.instanceOf(DerivativeSFX);
		});
		it('should delete instance', function () {
			if (!derivativeSFXInstance) this.skip();
			derivativeSFXInstance.delete();
		});
	});

	describe('DerivativeSFX:functionality', () => {
		let derivativeSFXInstance;
		let DerivativeSFXValidInput;
		let DerivativeSFXValidInputVector;

		before(() => {
			derivativeSFXInstance = new DerivativeSFX();
			DerivativeSFXValidInput = Array(1028).fill(0).map( _ => Math.random() );
			DerivativeSFXValidInputVector = arrayToVector(DerivativeSFXValidInput)
		});
		after(() => {
			derivativeSFXInstance.delete();
			DerivativeSFXValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				derivativeSFXInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = derivativeSFXInstance.compute(DerivativeSFXValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('derAvAfterMax');
expect(result).to.have.property('maxDerBeforeMax');
		});
	});
	



	describe('DiscontinuityDetector:instantiation', () => {
		let discontinuityDetectorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			discontinuityDetectorInstance = new DiscontinuityDetector();
			expect(discontinuityDetectorInstance).to.be.instanceOf(DiscontinuityDetector);
		});
		it('should delete instance', function () {
			if (!discontinuityDetectorInstance) this.skip();
			discontinuityDetectorInstance.delete();
		});
	});

	describe('DiscontinuityDetector:functionality', () => {
		let discontinuityDetectorInstance;
		let DiscontinuityDetectorValidInput;
		let DiscontinuityDetectorValidInputVector;

		before(() => {
			discontinuityDetectorInstance = new DiscontinuityDetector();
			DiscontinuityDetectorValidInput = Array(512).fill(0).map( _ => Math.random() );
			DiscontinuityDetectorValidInputVector = arrayToVector(DiscontinuityDetectorValidInput)
		});
		after(() => {
			discontinuityDetectorInstance.delete();
			DiscontinuityDetectorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				discontinuityDetectorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = discontinuityDetectorInstance.compute(DiscontinuityDetectorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('discontinuityLocations');
expect(result).to.have.property('discontinuityAmplitudes');
		});
	});
	



	describe('Dissonance:instantiation', () => {
		let dissonanceInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			dissonanceInstance = new Dissonance();
			expect(dissonanceInstance).to.be.instanceOf(Dissonance);
		});
		it('should delete instance', function () {
			if (!dissonanceInstance) this.skip();
			dissonanceInstance.delete();
		});
	});

	describe('Dissonance:functionality', () => {
		let dissonanceInstance;
		let DissonanceValidInput;
		let DissonanceValidInputVector;

		before(() => {
			dissonanceInstance = new Dissonance();
			DissonanceValidInput = Array(1028).fill(0).map( _ => Math.random() );
			DissonanceValidInputVector = arrayToVector(DissonanceValidInput)
		});
		after(() => {
			dissonanceInstance.delete();
			DissonanceValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				dissonanceInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = dissonanceInstance.compute(DissonanceValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('dissonance');
		});
	});
	



	describe('DistributionShape:instantiation', () => {
		let distributionShapeInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			distributionShapeInstance = new DistributionShape();
			expect(distributionShapeInstance).to.be.instanceOf(DistributionShape);
		});
		it('should delete instance', function () {
			if (!distributionShapeInstance) this.skip();
			distributionShapeInstance.delete();
		});
	});

	describe('DistributionShape:functionality', () => {
		let distributionShapeInstance;
		let DistributionShapeValidInput;
		let DistributionShapeValidInputVector;

		before(() => {
			distributionShapeInstance = new DistributionShape();
			DistributionShapeValidInput = Array(1028).fill(0).map( _ => Math.random() );
			DistributionShapeValidInputVector = arrayToVector(DistributionShapeValidInput)
		});
		after(() => {
			distributionShapeInstance.delete();
			DistributionShapeValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				distributionShapeInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = distributionShapeInstance.compute(DistributionShapeValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('spread');
expect(result).to.have.property('skewness');
expect(result).to.have.property('kurtosis');
		});
	});
	



	describe('Duration:instantiation', () => {
		let durationInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			durationInstance = new Duration();
			expect(durationInstance).to.be.instanceOf(Duration);
		});
		it('should delete instance', function () {
			if (!durationInstance) this.skip();
			durationInstance.delete();
		});
	});

	describe('Duration:functionality', () => {
		let durationInstance;
		let DurationValidInput;
		let DurationValidInputVector;

		before(() => {
			durationInstance = new Duration();
			DurationValidInput = Array(1028).fill(0).map( _ => Math.random() );
			DurationValidInputVector = arrayToVector(DurationValidInput)
		});
		after(() => {
			durationInstance.delete();
			DurationValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				durationInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = durationInstance.compute(DurationValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('duration');
		});
	});
	



	describe('DynamicComplexity:instantiation', () => {
		let dynamicComplexityInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			dynamicComplexityInstance = new DynamicComplexity();
			expect(dynamicComplexityInstance).to.be.instanceOf(DynamicComplexity);
		});
		it('should delete instance', function () {
			if (!dynamicComplexityInstance) this.skip();
			dynamicComplexityInstance.delete();
		});
	});

	describe('DynamicComplexity:functionality', () => {
		let dynamicComplexityInstance;
		let DynamicComplexityValidInput;
		let DynamicComplexityValidInputVector;

		before(() => {
			dynamicComplexityInstance = new DynamicComplexity();
			DynamicComplexityValidInput = Array(0.2).fill(0).map( _ => Math.random() );
			DynamicComplexityValidInputVector = arrayToVector(DynamicComplexityValidInput)
		});
		after(() => {
			dynamicComplexityInstance.delete();
			DynamicComplexityValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				dynamicComplexityInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = dynamicComplexityInstance.compute(DynamicComplexityValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('dynamicComplexity');
expect(result).to.have.property('loudness');
		});
	});
	



	describe('ERBBands:instantiation', () => {
		let eRBBandsInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			eRBBandsInstance = new ERBBands();
			expect(eRBBandsInstance).to.be.instanceOf(ERBBands);
		});
		it('should delete instance', function () {
			if (!eRBBandsInstance) this.skip();
			eRBBandsInstance.delete();
		});
	});

	describe('ERBBands:functionality', () => {
		let eRBBandsInstance;
		let ERBBandsValidInput;
		let ERBBandsValidInputVector;

		before(() => {
			eRBBandsInstance = new ERBBands();
			ERBBandsValidInput = Array(1025).fill(0).map( _ => Math.random() );
			ERBBandsValidInputVector = arrayToVector(ERBBandsValidInput)
		});
		after(() => {
			eRBBandsInstance.delete();
			ERBBandsValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				eRBBandsInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = eRBBandsInstance.compute(ERBBandsValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bands');
		});
	});
	



	describe('EffectiveDuration:instantiation', () => {
		let effectiveDurationInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			effectiveDurationInstance = new EffectiveDuration();
			expect(effectiveDurationInstance).to.be.instanceOf(EffectiveDuration);
		});
		it('should delete instance', function () {
			if (!effectiveDurationInstance) this.skip();
			effectiveDurationInstance.delete();
		});
	});

	describe('EffectiveDuration:functionality', () => {
		let effectiveDurationInstance;
		let EffectiveDurationValidInput;
		let EffectiveDurationValidInputVector;

		before(() => {
			effectiveDurationInstance = new EffectiveDuration();
			EffectiveDurationValidInput = Array(1028).fill(0).map( _ => Math.random() );
			EffectiveDurationValidInputVector = arrayToVector(EffectiveDurationValidInput)
		});
		after(() => {
			effectiveDurationInstance.delete();
			EffectiveDurationValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				effectiveDurationInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = effectiveDurationInstance.compute(EffectiveDurationValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('effectiveDuration');
		});
	});
	



	describe('Energy:instantiation', () => {
		let energyInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			energyInstance = new Energy();
			expect(energyInstance).to.be.instanceOf(Energy);
		});
		it('should delete instance', function () {
			if (!energyInstance) this.skip();
			energyInstance.delete();
		});
	});

	describe('Energy:functionality', () => {
		let energyInstance;
		let EnergyValidInput;
		let EnergyValidInputVector;

		before(() => {
			energyInstance = new Energy();
			EnergyValidInput = Array(1028).fill(0).map( _ => Math.random() );
			EnergyValidInputVector = arrayToVector(EnergyValidInput)
		});
		after(() => {
			energyInstance.delete();
			EnergyValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				energyInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = energyInstance.compute(EnergyValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('energy');
		});
	});
	



	describe('EnergyBand:instantiation', () => {
		let energyBandInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			energyBandInstance = new EnergyBand();
			expect(energyBandInstance).to.be.instanceOf(EnergyBand);
		});
		it('should delete instance', function () {
			if (!energyBandInstance) this.skip();
			energyBandInstance.delete();
		});
	});

	describe('EnergyBand:functionality', () => {
		let energyBandInstance;
		let EnergyBandValidInput;
		let EnergyBandValidInputVector;

		before(() => {
			energyBandInstance = new EnergyBand();
			EnergyBandValidInput = Array(1028).fill(0).map( _ => Math.random() );
			EnergyBandValidInputVector = arrayToVector(EnergyBandValidInput)
		});
		after(() => {
			energyBandInstance.delete();
			EnergyBandValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				energyBandInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = energyBandInstance.compute(EnergyBandValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('energyBand');
		});
	});
	



	describe('EnergyBandRatio:instantiation', () => {
		let energyBandRatioInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			energyBandRatioInstance = new EnergyBandRatio();
			expect(energyBandRatioInstance).to.be.instanceOf(EnergyBandRatio);
		});
		it('should delete instance', function () {
			if (!energyBandRatioInstance) this.skip();
			energyBandRatioInstance.delete();
		});
	});

	describe('EnergyBandRatio:functionality', () => {
		let energyBandRatioInstance;
		let EnergyBandRatioValidInput;
		let EnergyBandRatioValidInputVector;

		before(() => {
			energyBandRatioInstance = new EnergyBandRatio();
			EnergyBandRatioValidInput = Array(1028).fill(0).map( _ => Math.random() );
			EnergyBandRatioValidInputVector = arrayToVector(EnergyBandRatioValidInput)
		});
		after(() => {
			energyBandRatioInstance.delete();
			EnergyBandRatioValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				energyBandRatioInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = energyBandRatioInstance.compute(EnergyBandRatioValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('energyBandRatio');
		});
	});
	



	describe('Entropy:instantiation', () => {
		let entropyInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			entropyInstance = new Entropy();
			expect(entropyInstance).to.be.instanceOf(Entropy);
		});
		it('should delete instance', function () {
			if (!entropyInstance) this.skip();
			entropyInstance.delete();
		});
	});

	describe('Entropy:functionality', () => {
		let entropyInstance;
		let EntropyValidInput;
		let EntropyValidInputVector;

		before(() => {
			entropyInstance = new Entropy();
			EntropyValidInput = Array(1028).fill(0).map( _ => Math.random() );
			EntropyValidInputVector = arrayToVector(EntropyValidInput)
		});
		after(() => {
			entropyInstance.delete();
			EntropyValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				entropyInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = entropyInstance.compute(EntropyValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('entropy');
		});
	});
	



	describe('Envelope:instantiation', () => {
		let envelopeInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			envelopeInstance = new Envelope();
			expect(envelopeInstance).to.be.instanceOf(Envelope);
		});
		it('should delete instance', function () {
			if (!envelopeInstance) this.skip();
			envelopeInstance.delete();
		});
	});

	describe('Envelope:functionality', () => {
		let envelopeInstance;
		let EnvelopeValidInput;
		let EnvelopeValidInputVector;

		before(() => {
			envelopeInstance = new Envelope();
			EnvelopeValidInput = Array(1028).fill(0).map( _ => Math.random() );
			EnvelopeValidInputVector = arrayToVector(EnvelopeValidInput)
		});
		after(() => {
			envelopeInstance.delete();
			EnvelopeValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				envelopeInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = envelopeInstance.compute(EnvelopeValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('EqualLoudness:instantiation', () => {
		let equalLoudnessInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			equalLoudnessInstance = new EqualLoudness();
			expect(equalLoudnessInstance).to.be.instanceOf(EqualLoudness);
		});
		it('should delete instance', function () {
			if (!equalLoudnessInstance) this.skip();
			equalLoudnessInstance.delete();
		});
	});

	describe('EqualLoudness:functionality', () => {
		let equalLoudnessInstance;
		let EqualLoudnessValidInput;
		let EqualLoudnessValidInputVector;

		before(() => {
			equalLoudnessInstance = new EqualLoudness();
			EqualLoudnessValidInput = Array(1028).fill(0).map( _ => Math.random() );
			EqualLoudnessValidInputVector = arrayToVector(EqualLoudnessValidInput)
		});
		after(() => {
			equalLoudnessInstance.delete();
			EqualLoudnessValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				equalLoudnessInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = equalLoudnessInstance.compute(EqualLoudnessValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('Flatness:instantiation', () => {
		let flatnessInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			flatnessInstance = new Flatness();
			expect(flatnessInstance).to.be.instanceOf(Flatness);
		});
		it('should delete instance', function () {
			if (!flatnessInstance) this.skip();
			flatnessInstance.delete();
		});
	});

	describe('Flatness:functionality', () => {
		let flatnessInstance;
		let FlatnessValidInput;
		let FlatnessValidInputVector;

		before(() => {
			flatnessInstance = new Flatness();
			FlatnessValidInput = Array(1028).fill(0).map( _ => Math.random() );
			FlatnessValidInputVector = arrayToVector(FlatnessValidInput)
		});
		after(() => {
			flatnessInstance.delete();
			FlatnessValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				flatnessInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = flatnessInstance.compute(FlatnessValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('flatness');
		});
	});
	



	describe('FlatnessDB:instantiation', () => {
		let flatnessDBInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			flatnessDBInstance = new FlatnessDB();
			expect(flatnessDBInstance).to.be.instanceOf(FlatnessDB);
		});
		it('should delete instance', function () {
			if (!flatnessDBInstance) this.skip();
			flatnessDBInstance.delete();
		});
	});

	describe('FlatnessDB:functionality', () => {
		let flatnessDBInstance;
		let FlatnessDBValidInput;
		let FlatnessDBValidInputVector;

		before(() => {
			flatnessDBInstance = new FlatnessDB();
			FlatnessDBValidInput = Array(1028).fill(0).map( _ => Math.random() );
			FlatnessDBValidInputVector = arrayToVector(FlatnessDBValidInput)
		});
		after(() => {
			flatnessDBInstance.delete();
			FlatnessDBValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				flatnessDBInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = flatnessDBInstance.compute(FlatnessDBValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('flatnessDB');
		});
	});
	



	describe('FlatnessSFX:instantiation', () => {
		let flatnessSFXInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			flatnessSFXInstance = new FlatnessSFX();
			expect(flatnessSFXInstance).to.be.instanceOf(FlatnessSFX);
		});
		it('should delete instance', function () {
			if (!flatnessSFXInstance) this.skip();
			flatnessSFXInstance.delete();
		});
	});

	describe('FlatnessSFX:functionality', () => {
		let flatnessSFXInstance;
		let FlatnessSFXValidInput;
		let FlatnessSFXValidInputVector;

		before(() => {
			flatnessSFXInstance = new FlatnessSFX();
			FlatnessSFXValidInput = Array(1028).fill(0).map( _ => Math.random() );
			FlatnessSFXValidInputVector = arrayToVector(FlatnessSFXValidInput)
		});
		after(() => {
			flatnessSFXInstance.delete();
			FlatnessSFXValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				flatnessSFXInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = flatnessSFXInstance.compute(FlatnessSFXValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('flatness');
		});
	});
	



	describe('Flux:instantiation', () => {
		let fluxInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			fluxInstance = new Flux();
			expect(fluxInstance).to.be.instanceOf(Flux);
		});
		it('should delete instance', function () {
			if (!fluxInstance) this.skip();
			fluxInstance.delete();
		});
	});

	describe('Flux:functionality', () => {
		let fluxInstance;
		let FluxValidInput;
		let FluxValidInputVector;

		before(() => {
			fluxInstance = new Flux();
			FluxValidInput = Array(1028).fill(0).map( _ => Math.random() );
			FluxValidInputVector = arrayToVector(FluxValidInput)
		});
		after(() => {
			fluxInstance.delete();
			FluxValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				fluxInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = fluxInstance.compute(FluxValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('flux');
		});
	});
	



	describe('FrameCutter:instantiation', () => {
		let frameCutterInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			frameCutterInstance = new FrameCutter();
			expect(frameCutterInstance).to.be.instanceOf(FrameCutter);
		});
		it('should delete instance', function () {
			if (!frameCutterInstance) this.skip();
			frameCutterInstance.delete();
		});
	});

	describe('FrameCutter:functionality', () => {
		let frameCutterInstance;
		let FrameCutterValidInput;
		let FrameCutterValidInputVector;

		before(() => {
			frameCutterInstance = new FrameCutter();
			FrameCutterValidInput = Array(1024).fill(0).map( _ => Math.random() );
			FrameCutterValidInputVector = arrayToVector(FrameCutterValidInput)
		});
		after(() => {
			frameCutterInstance.delete();
			FrameCutterValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				frameCutterInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = frameCutterInstance.compute(FrameCutterValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('frame');
		});
	});
	



	describe('FrameToReal:instantiation', () => {
		let frameToRealInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			frameToRealInstance = new FrameToReal();
			expect(frameToRealInstance).to.be.instanceOf(FrameToReal);
		});
		it('should delete instance', function () {
			if (!frameToRealInstance) this.skip();
			frameToRealInstance.delete();
		});
	});

	describe('FrameToReal:functionality', () => {
		let frameToRealInstance;
		let FrameToRealValidInput;
		let FrameToRealValidInputVector;

		before(() => {
			frameToRealInstance = new FrameToReal();
			FrameToRealValidInput = Array(2048).fill(0).map( _ => Math.random() );
			FrameToRealValidInputVector = arrayToVector(FrameToRealValidInput)
		});
		after(() => {
			frameToRealInstance.delete();
			FrameToRealValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				frameToRealInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = frameToRealInstance.compute(FrameToRealValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('FrequencyBands:instantiation', () => {
		let frequencyBandsInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			frequencyBandsInstance = new FrequencyBands();
			expect(frequencyBandsInstance).to.be.instanceOf(FrequencyBands);
		});
		it('should delete instance', function () {
			if (!frequencyBandsInstance) this.skip();
			frequencyBandsInstance.delete();
		});
	});

	describe('FrequencyBands:functionality', () => {
		let frequencyBandsInstance;
		let FrequencyBandsValidInput;
		let FrequencyBandsValidInputVector;

		before(() => {
			frequencyBandsInstance = new FrequencyBands();
			FrequencyBandsValidInput = Array(1028).fill(0).map( _ => Math.random() );
			FrequencyBandsValidInputVector = arrayToVector(FrequencyBandsValidInput)
		});
		after(() => {
			frequencyBandsInstance.delete();
			FrequencyBandsValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				frequencyBandsInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = frequencyBandsInstance.compute(FrequencyBandsValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bands');
		});
	});
	



	describe('GFCC:instantiation', () => {
		let gFCCInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			gFCCInstance = new GFCC();
			expect(gFCCInstance).to.be.instanceOf(GFCC);
		});
		it('should delete instance', function () {
			if (!gFCCInstance) this.skip();
			gFCCInstance.delete();
		});
	});

	describe('GFCC:functionality', () => {
		let gFCCInstance;
		let GFCCValidInput;
		let GFCCValidInputVector;

		before(() => {
			gFCCInstance = new GFCC();
			GFCCValidInput = Array(1025).fill(0).map( _ => Math.random() );
			GFCCValidInputVector = arrayToVector(GFCCValidInput)
		});
		after(() => {
			gFCCInstance.delete();
			GFCCValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				gFCCInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = gFCCInstance.compute(GFCCValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bands');
expect(result).to.have.property('gfcc');
		});
	});
	



	describe('GapsDetector:instantiation', () => {
		let gapsDetectorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			gapsDetectorInstance = new GapsDetector();
			expect(gapsDetectorInstance).to.be.instanceOf(GapsDetector);
		});
		it('should delete instance', function () {
			if (!gapsDetectorInstance) this.skip();
			gapsDetectorInstance.delete();
		});
	});

	describe('GapsDetector:functionality', () => {
		let gapsDetectorInstance;
		let GapsDetectorValidInput;
		let GapsDetectorValidInputVector;

		before(() => {
			gapsDetectorInstance = new GapsDetector();
			GapsDetectorValidInput = Array(2048).fill(0).map( _ => Math.random() );
			GapsDetectorValidInputVector = arrayToVector(GapsDetectorValidInput)
		});
		after(() => {
			gapsDetectorInstance.delete();
			GapsDetectorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				gapsDetectorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = gapsDetectorInstance.compute(GapsDetectorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('starts');
expect(result).to.have.property('ends');
		});
	});
	



	describe('GeometricMean:instantiation', () => {
		let geometricMeanInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			geometricMeanInstance = new GeometricMean();
			expect(geometricMeanInstance).to.be.instanceOf(GeometricMean);
		});
		it('should delete instance', function () {
			if (!geometricMeanInstance) this.skip();
			geometricMeanInstance.delete();
		});
	});

	describe('GeometricMean:functionality', () => {
		let geometricMeanInstance;
		let GeometricMeanValidInput;
		let GeometricMeanValidInputVector;

		before(() => {
			geometricMeanInstance = new GeometricMean();
			GeometricMeanValidInput = Array(1028).fill(0).map( _ => Math.random() );
			GeometricMeanValidInputVector = arrayToVector(GeometricMeanValidInput)
		});
		after(() => {
			geometricMeanInstance.delete();
			GeometricMeanValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				geometricMeanInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = geometricMeanInstance.compute(GeometricMeanValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('geometricMean');
		});
	});
	



	describe('HFC:instantiation', () => {
		let hFCInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			hFCInstance = new HFC();
			expect(hFCInstance).to.be.instanceOf(HFC);
		});
		it('should delete instance', function () {
			if (!hFCInstance) this.skip();
			hFCInstance.delete();
		});
	});

	describe('HFC:functionality', () => {
		let hFCInstance;
		let HFCValidInput;
		let HFCValidInputVector;

		before(() => {
			hFCInstance = new HFC();
			HFCValidInput = Array(1028).fill(0).map( _ => Math.random() );
			HFCValidInputVector = arrayToVector(HFCValidInput)
		});
		after(() => {
			hFCInstance.delete();
			HFCValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				hFCInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = hFCInstance.compute(HFCValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('hfc');
		});
	});
	



	describe('HPCP:instantiation', () => {
		let hPCPInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			hPCPInstance = new HPCP();
			expect(hPCPInstance).to.be.instanceOf(HPCP);
		});
		it('should delete instance', function () {
			if (!hPCPInstance) this.skip();
			hPCPInstance.delete();
		});
	});

	describe('HPCP:functionality', () => {
		let hPCPInstance;
		let HPCPValidInput;
		let HPCPValidInputVector;

		before(() => {
			hPCPInstance = new HPCP();
			HPCPValidInput = Array(1028).fill(0).map( _ => Math.random() );
			HPCPValidInputVector = arrayToVector(HPCPValidInput)
		});
		after(() => {
			hPCPInstance.delete();
			HPCPValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				hPCPInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = hPCPInstance.compute(HPCPValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('hpcp');
		});
	});
	



	describe('HarmonicBpm:instantiation', () => {
		let harmonicBpmInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			harmonicBpmInstance = new HarmonicBpm();
			expect(harmonicBpmInstance).to.be.instanceOf(HarmonicBpm);
		});
		it('should delete instance', function () {
			if (!harmonicBpmInstance) this.skip();
			harmonicBpmInstance.delete();
		});
	});

	describe('HarmonicBpm:functionality', () => {
		let harmonicBpmInstance;
		let HarmonicBpmValidInput;
		let HarmonicBpmValidInputVector;

		before(() => {
			harmonicBpmInstance = new HarmonicBpm();
			HarmonicBpmValidInput = Array(1028).fill(0).map( _ => Math.random() );
			HarmonicBpmValidInputVector = arrayToVector(HarmonicBpmValidInput)
		});
		after(() => {
			harmonicBpmInstance.delete();
			HarmonicBpmValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				harmonicBpmInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = harmonicBpmInstance.compute(HarmonicBpmValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('harmonicBpms');
		});
	});
	



	describe('HarmonicPeaks:instantiation', () => {
		let harmonicPeaksInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			harmonicPeaksInstance = new HarmonicPeaks();
			expect(harmonicPeaksInstance).to.be.instanceOf(HarmonicPeaks);
		});
		it('should delete instance', function () {
			if (!harmonicPeaksInstance) this.skip();
			harmonicPeaksInstance.delete();
		});
	});

	describe('HarmonicPeaks:functionality', () => {
		let harmonicPeaksInstance;
		let HarmonicPeaksValidInput;
		let HarmonicPeaksValidInputVector;

		before(() => {
			harmonicPeaksInstance = new HarmonicPeaks();
			HarmonicPeaksValidInput = Array(1028).fill(0).map( _ => Math.random() );
			HarmonicPeaksValidInputVector = arrayToVector(HarmonicPeaksValidInput)
		});
		after(() => {
			harmonicPeaksInstance.delete();
			HarmonicPeaksValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				harmonicPeaksInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = harmonicPeaksInstance.compute(HarmonicPeaksValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('harmonicFrequencies');
expect(result).to.have.property('harmonicMagnitudes');
		});
	});
	



	describe('HighPass:instantiation', () => {
		let highPassInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			highPassInstance = new HighPass();
			expect(highPassInstance).to.be.instanceOf(HighPass);
		});
		it('should delete instance', function () {
			if (!highPassInstance) this.skip();
			highPassInstance.delete();
		});
	});

	describe('HighPass:functionality', () => {
		let highPassInstance;
		let HighPassValidInput;
		let HighPassValidInputVector;

		before(() => {
			highPassInstance = new HighPass();
			HighPassValidInput = Array(1028).fill(0).map( _ => Math.random() );
			HighPassValidInputVector = arrayToVector(HighPassValidInput)
		});
		after(() => {
			highPassInstance.delete();
			HighPassValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				highPassInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = highPassInstance.compute(HighPassValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('HighResolutionFeatures:instantiation', () => {
		let highResolutionFeaturesInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			highResolutionFeaturesInstance = new HighResolutionFeatures();
			expect(highResolutionFeaturesInstance).to.be.instanceOf(HighResolutionFeatures);
		});
		it('should delete instance', function () {
			if (!highResolutionFeaturesInstance) this.skip();
			highResolutionFeaturesInstance.delete();
		});
	});

	describe('HighResolutionFeatures:functionality', () => {
		let highResolutionFeaturesInstance;
		let HighResolutionFeaturesValidInput;
		let HighResolutionFeaturesValidInputVector;

		before(() => {
			highResolutionFeaturesInstance = new HighResolutionFeatures();
			HighResolutionFeaturesValidInput = Array(1028).fill(0).map( _ => Math.random() );
			HighResolutionFeaturesValidInputVector = arrayToVector(HighResolutionFeaturesValidInput)
		});
		after(() => {
			highResolutionFeaturesInstance.delete();
			HighResolutionFeaturesValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				highResolutionFeaturesInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = highResolutionFeaturesInstance.compute(HighResolutionFeaturesValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('equalTemperedDeviation');
expect(result).to.have.property('nonTemperedEnergyRatio');
expect(result).to.have.property('nonTemperedPeaksEnergyRatio');
		});
	});
	



	describe('Histogram:instantiation', () => {
		let histogramInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			histogramInstance = new Histogram();
			expect(histogramInstance).to.be.instanceOf(Histogram);
		});
		it('should delete instance', function () {
			if (!histogramInstance) this.skip();
			histogramInstance.delete();
		});
	});

	describe('Histogram:functionality', () => {
		let histogramInstance;
		let HistogramValidInput;
		let HistogramValidInputVector;

		before(() => {
			histogramInstance = new Histogram();
			HistogramValidInput = Array(1028).fill(0).map( _ => Math.random() );
			HistogramValidInputVector = arrayToVector(HistogramValidInput)
		});
		after(() => {
			histogramInstance.delete();
			HistogramValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				histogramInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = histogramInstance.compute(HistogramValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('histogram');
expect(result).to.have.property('binEdges');
		});
	});
	



	describe('HprModelAnal:instantiation', () => {
		let hprModelAnalInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			hprModelAnalInstance = new HprModelAnal();
			expect(hprModelAnalInstance).to.be.instanceOf(HprModelAnal);
		});
		it('should delete instance', function () {
			if (!hprModelAnalInstance) this.skip();
			hprModelAnalInstance.delete();
		});
	});

	describe('HprModelAnal:functionality', () => {
		let hprModelAnalInstance;
		let HprModelAnalValidInput;
		let HprModelAnalValidInputVector;

		before(() => {
			hprModelAnalInstance = new HprModelAnal();
			HprModelAnalValidInput = Array(1028).fill(0).map( _ => Math.random() );
			HprModelAnalValidInputVector = arrayToVector(HprModelAnalValidInput)
		});
		after(() => {
			hprModelAnalInstance.delete();
			HprModelAnalValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				hprModelAnalInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = hprModelAnalInstance.compute(HprModelAnalValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('frequencies');
expect(result).to.have.property('magnitudes');
expect(result).to.have.property('phases');
expect(result).to.have.property('res');
		});
	});
	



	describe('HpsModelAnal:instantiation', () => {
		let hpsModelAnalInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			hpsModelAnalInstance = new HpsModelAnal();
			expect(hpsModelAnalInstance).to.be.instanceOf(HpsModelAnal);
		});
		it('should delete instance', function () {
			if (!hpsModelAnalInstance) this.skip();
			hpsModelAnalInstance.delete();
		});
	});

	describe('HpsModelAnal:functionality', () => {
		let hpsModelAnalInstance;
		let HpsModelAnalValidInput;
		let HpsModelAnalValidInputVector;

		before(() => {
			hpsModelAnalInstance = new HpsModelAnal();
			HpsModelAnalValidInput = Array(1028).fill(0).map( _ => Math.random() );
			HpsModelAnalValidInputVector = arrayToVector(HpsModelAnalValidInput)
		});
		after(() => {
			hpsModelAnalInstance.delete();
			HpsModelAnalValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				hpsModelAnalInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = hpsModelAnalInstance.compute(HpsModelAnalValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('frequencies');
expect(result).to.have.property('magnitudes');
expect(result).to.have.property('phases');
expect(result).to.have.property('stocenv');
		});
	});
	



	describe('IDCT:instantiation', () => {
		let iDCTInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			iDCTInstance = new IDCT();
			expect(iDCTInstance).to.be.instanceOf(IDCT);
		});
		it('should delete instance', function () {
			if (!iDCTInstance) this.skip();
			iDCTInstance.delete();
		});
	});

	describe('IDCT:functionality', () => {
		let iDCTInstance;
		let IDCTValidInput;
		let IDCTValidInputVector;

		before(() => {
			iDCTInstance = new IDCT();
			IDCTValidInput = Array(10).fill(0).map( _ => Math.random() );
			IDCTValidInputVector = arrayToVector(IDCTValidInput)
		});
		after(() => {
			iDCTInstance.delete();
			IDCTValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				iDCTInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = iDCTInstance.compute(IDCTValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('idct');
		});
	});
	



	describe('IIR:instantiation', () => {
		let iIRInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			iIRInstance = new IIR();
			expect(iIRInstance).to.be.instanceOf(IIR);
		});
		it('should delete instance', function () {
			if (!iIRInstance) this.skip();
			iIRInstance.delete();
		});
	});

	describe('IIR:functionality', () => {
		let iIRInstance;
		let IIRValidInput;
		let IIRValidInputVector;

		before(() => {
			iIRInstance = new IIR();
			IIRValidInput = Array(1028).fill(0).map( _ => Math.random() );
			IIRValidInputVector = arrayToVector(IIRValidInput)
		});
		after(() => {
			iIRInstance.delete();
			IIRValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				iIRInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = iIRInstance.compute(IIRValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('Inharmonicity:instantiation', () => {
		let inharmonicityInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			inharmonicityInstance = new Inharmonicity();
			expect(inharmonicityInstance).to.be.instanceOf(Inharmonicity);
		});
		it('should delete instance', function () {
			if (!inharmonicityInstance) this.skip();
			inharmonicityInstance.delete();
		});
	});

	describe('Inharmonicity:functionality', () => {
		let inharmonicityInstance;
		let InharmonicityValidInput;
		let InharmonicityValidInputVector;

		before(() => {
			inharmonicityInstance = new Inharmonicity();
			InharmonicityValidInput = Array(1028).fill(0).map( _ => Math.random() );
			InharmonicityValidInputVector = arrayToVector(InharmonicityValidInput)
		});
		after(() => {
			inharmonicityInstance.delete();
			InharmonicityValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				inharmonicityInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = inharmonicityInstance.compute(InharmonicityValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('inharmonicity');
		});
	});
	



	describe('InstantPower:instantiation', () => {
		let instantPowerInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			instantPowerInstance = new InstantPower();
			expect(instantPowerInstance).to.be.instanceOf(InstantPower);
		});
		it('should delete instance', function () {
			if (!instantPowerInstance) this.skip();
			instantPowerInstance.delete();
		});
	});

	describe('InstantPower:functionality', () => {
		let instantPowerInstance;
		let InstantPowerValidInput;
		let InstantPowerValidInputVector;

		before(() => {
			instantPowerInstance = new InstantPower();
			InstantPowerValidInput = Array(1028).fill(0).map( _ => Math.random() );
			InstantPowerValidInputVector = arrayToVector(InstantPowerValidInput)
		});
		after(() => {
			instantPowerInstance.delete();
			InstantPowerValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				instantPowerInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = instantPowerInstance.compute(InstantPowerValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('power');
		});
	});
	



	describe('Intensity:instantiation', () => {
		let intensityInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			intensityInstance = new Intensity();
			expect(intensityInstance).to.be.instanceOf(Intensity);
		});
		it('should delete instance', function () {
			if (!intensityInstance) this.skip();
			intensityInstance.delete();
		});
	});

	describe('Intensity:functionality', () => {
		let intensityInstance;
		let IntensityValidInput;
		let IntensityValidInputVector;

		before(() => {
			intensityInstance = new Intensity();
			IntensityValidInput = Array(1028).fill(0).map( _ => Math.random() );
			IntensityValidInputVector = arrayToVector(IntensityValidInput)
		});
		after(() => {
			intensityInstance.delete();
			IntensityValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				intensityInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = intensityInstance.compute(IntensityValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('intensity');
		});
	});
	



	describe('Key:instantiation', () => {
		let keyInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			keyInstance = new Key();
			expect(keyInstance).to.be.instanceOf(Key);
		});
		it('should delete instance', function () {
			if (!keyInstance) this.skip();
			keyInstance.delete();
		});
	});

	describe('Key:functionality', () => {
		let keyInstance;
		let KeyValidInput;
		let KeyValidInputVector;

		before(() => {
			keyInstance = new Key();
			KeyValidInput = Array(1028).fill(0).map( _ => Math.random() );
			KeyValidInputVector = arrayToVector(KeyValidInput)
		});
		after(() => {
			keyInstance.delete();
			KeyValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				keyInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = keyInstance.compute(KeyValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('key');
expect(result).to.have.property('scale');
expect(result).to.have.property('strength');
expect(result).to.have.property('firstToSecondRelativeStrength');
		});
	});
	



	describe('KeyExtractor:instantiation', () => {
		let keyExtractorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			keyExtractorInstance = new KeyExtractor();
			expect(keyExtractorInstance).to.be.instanceOf(KeyExtractor);
		});
		it('should delete instance', function () {
			if (!keyExtractorInstance) this.skip();
			keyExtractorInstance.delete();
		});
	});

	describe('KeyExtractor:functionality', () => {
		let keyExtractorInstance;
		let KeyExtractorValidInput;
		let KeyExtractorValidInputVector;

		before(() => {
			keyExtractorInstance = new KeyExtractor();
			KeyExtractorValidInput = Array(4096).fill(0).map( _ => Math.random() );
			KeyExtractorValidInputVector = arrayToVector(KeyExtractorValidInput)
		});
		after(() => {
			keyExtractorInstance.delete();
			KeyExtractorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				keyExtractorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = keyExtractorInstance.compute(KeyExtractorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('key');
expect(result).to.have.property('scale');
expect(result).to.have.property('strength');
		});
	});
	



	describe('LPC:instantiation', () => {
		let lPCInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			lPCInstance = new LPC();
			expect(lPCInstance).to.be.instanceOf(LPC);
		});
		it('should delete instance', function () {
			if (!lPCInstance) this.skip();
			lPCInstance.delete();
		});
	});

	describe('LPC:functionality', () => {
		let lPCInstance;
		let LPCValidInput;
		let LPCValidInputVector;

		before(() => {
			lPCInstance = new LPC();
			LPCValidInput = Array(1028).fill(0).map( _ => Math.random() );
			LPCValidInputVector = arrayToVector(LPCValidInput)
		});
		after(() => {
			lPCInstance.delete();
			LPCValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				lPCInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = lPCInstance.compute(LPCValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('lpc');
expect(result).to.have.property('reflection');
		});
	});
	



	describe('Larm:instantiation', () => {
		let larmInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			larmInstance = new Larm();
			expect(larmInstance).to.be.instanceOf(Larm);
		});
		it('should delete instance', function () {
			if (!larmInstance) this.skip();
			larmInstance.delete();
		});
	});

	describe('Larm:functionality', () => {
		let larmInstance;
		let LarmValidInput;
		let LarmValidInputVector;

		before(() => {
			larmInstance = new Larm();
			LarmValidInput = Array(1028).fill(0).map( _ => Math.random() );
			LarmValidInputVector = arrayToVector(LarmValidInput)
		});
		after(() => {
			larmInstance.delete();
			LarmValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				larmInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = larmInstance.compute(LarmValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('larm');
		});
	});
	



	describe('Leq:instantiation', () => {
		let leqInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			leqInstance = new Leq();
			expect(leqInstance).to.be.instanceOf(Leq);
		});
		it('should delete instance', function () {
			if (!leqInstance) this.skip();
			leqInstance.delete();
		});
	});

	describe('Leq:functionality', () => {
		let leqInstance;
		let LeqValidInput;
		let LeqValidInputVector;

		before(() => {
			leqInstance = new Leq();
			LeqValidInput = Array(1028).fill(0).map( _ => Math.random() );
			LeqValidInputVector = arrayToVector(LeqValidInput)
		});
		after(() => {
			leqInstance.delete();
			LeqValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				leqInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = leqInstance.compute(LeqValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('leq');
		});
	});
	



	describe('LevelExtractor:instantiation', () => {
		let levelExtractorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			levelExtractorInstance = new LevelExtractor();
			expect(levelExtractorInstance).to.be.instanceOf(LevelExtractor);
		});
		it('should delete instance', function () {
			if (!levelExtractorInstance) this.skip();
			levelExtractorInstance.delete();
		});
	});

	describe('LevelExtractor:functionality', () => {
		let levelExtractorInstance;
		let LevelExtractorValidInput;
		let LevelExtractorValidInputVector;

		before(() => {
			levelExtractorInstance = new LevelExtractor();
			LevelExtractorValidInput = Array(88200).fill(0).map( _ => Math.random() );
			LevelExtractorValidInputVector = arrayToVector(LevelExtractorValidInput)
		});
		after(() => {
			levelExtractorInstance.delete();
			LevelExtractorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				levelExtractorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = levelExtractorInstance.compute(LevelExtractorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('loudness');
		});
	});
	



	describe('LogAttackTime:instantiation', () => {
		let logAttackTimeInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			logAttackTimeInstance = new LogAttackTime();
			expect(logAttackTimeInstance).to.be.instanceOf(LogAttackTime);
		});
		it('should delete instance', function () {
			if (!logAttackTimeInstance) this.skip();
			logAttackTimeInstance.delete();
		});
	});

	describe('LogAttackTime:functionality', () => {
		let logAttackTimeInstance;
		let LogAttackTimeValidInput;
		let LogAttackTimeValidInputVector;

		before(() => {
			logAttackTimeInstance = new LogAttackTime();
			LogAttackTimeValidInput = Array(1028).fill(0).map( _ => Math.random() );
			LogAttackTimeValidInputVector = arrayToVector(LogAttackTimeValidInput)
		});
		after(() => {
			logAttackTimeInstance.delete();
			LogAttackTimeValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				logAttackTimeInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = logAttackTimeInstance.compute(LogAttackTimeValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('logAttackTime');
expect(result).to.have.property('attackStart');
expect(result).to.have.property('attackStop');
		});
	});
	



	describe('LogSpectrum:instantiation', () => {
		let logSpectrumInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			logSpectrumInstance = new LogSpectrum();
			expect(logSpectrumInstance).to.be.instanceOf(LogSpectrum);
		});
		it('should delete instance', function () {
			if (!logSpectrumInstance) this.skip();
			logSpectrumInstance.delete();
		});
	});

	describe('LogSpectrum:functionality', () => {
		let logSpectrumInstance;
		let LogSpectrumValidInput;
		let LogSpectrumValidInputVector;

		before(() => {
			logSpectrumInstance = new LogSpectrum();
			LogSpectrumValidInput = Array(1025).fill(0).map( _ => Math.random() );
			LogSpectrumValidInputVector = arrayToVector(LogSpectrumValidInput)
		});
		after(() => {
			logSpectrumInstance.delete();
			LogSpectrumValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				logSpectrumInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = logSpectrumInstance.compute(LogSpectrumValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('logFreqSpectrum');
expect(result).to.have.property('meanTuning');
expect(result).to.have.property('localTuning');
		});
	});
	



	describe('LoopBpmConfidence:instantiation', () => {
		let loopBpmConfidenceInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			loopBpmConfidenceInstance = new LoopBpmConfidence();
			expect(loopBpmConfidenceInstance).to.be.instanceOf(LoopBpmConfidence);
		});
		it('should delete instance', function () {
			if (!loopBpmConfidenceInstance) this.skip();
			loopBpmConfidenceInstance.delete();
		});
	});

	describe('LoopBpmConfidence:functionality', () => {
		let loopBpmConfidenceInstance;
		let LoopBpmConfidenceValidInput;
		let LoopBpmConfidenceValidInputVector;

		before(() => {
			loopBpmConfidenceInstance = new LoopBpmConfidence();
			LoopBpmConfidenceValidInput = Array(1028).fill(0).map( _ => Math.random() );
			LoopBpmConfidenceValidInputVector = arrayToVector(LoopBpmConfidenceValidInput)
		});
		after(() => {
			loopBpmConfidenceInstance.delete();
			LoopBpmConfidenceValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				loopBpmConfidenceInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = loopBpmConfidenceInstance.compute(LoopBpmConfidenceValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('confidence');
		});
	});
	



	describe('LoopBpmEstimator:instantiation', () => {
		let loopBpmEstimatorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			loopBpmEstimatorInstance = new LoopBpmEstimator();
			expect(loopBpmEstimatorInstance).to.be.instanceOf(LoopBpmEstimator);
		});
		it('should delete instance', function () {
			if (!loopBpmEstimatorInstance) this.skip();
			loopBpmEstimatorInstance.delete();
		});
	});

	describe('LoopBpmEstimator:functionality', () => {
		let loopBpmEstimatorInstance;
		let LoopBpmEstimatorValidInput;
		let LoopBpmEstimatorValidInputVector;

		before(() => {
			loopBpmEstimatorInstance = new LoopBpmEstimator();
			LoopBpmEstimatorValidInput = Array(1028).fill(0).map( _ => Math.random() );
			LoopBpmEstimatorValidInputVector = arrayToVector(LoopBpmEstimatorValidInput)
		});
		after(() => {
			loopBpmEstimatorInstance.delete();
			LoopBpmEstimatorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				loopBpmEstimatorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = loopBpmEstimatorInstance.compute(LoopBpmEstimatorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bpm');
		});
	});
	



	describe('Loudness:instantiation', () => {
		let loudnessInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			loudnessInstance = new Loudness();
			expect(loudnessInstance).to.be.instanceOf(Loudness);
		});
		it('should delete instance', function () {
			if (!loudnessInstance) this.skip();
			loudnessInstance.delete();
		});
	});

	describe('Loudness:functionality', () => {
		let loudnessInstance;
		let LoudnessValidInput;
		let LoudnessValidInputVector;

		before(() => {
			loudnessInstance = new Loudness();
			LoudnessValidInput = Array(1028).fill(0).map( _ => Math.random() );
			LoudnessValidInputVector = arrayToVector(LoudnessValidInput)
		});
		after(() => {
			loudnessInstance.delete();
			LoudnessValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				loudnessInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = loudnessInstance.compute(LoudnessValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('loudness');
		});
	});
	



	describe('LoudnessVickers:instantiation', () => {
		let loudnessVickersInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			loudnessVickersInstance = new LoudnessVickers();
			expect(loudnessVickersInstance).to.be.instanceOf(LoudnessVickers);
		});
		it('should delete instance', function () {
			if (!loudnessVickersInstance) this.skip();
			loudnessVickersInstance.delete();
		});
	});

	describe('LoudnessVickers:functionality', () => {
		let loudnessVickersInstance;
		let LoudnessVickersValidInput;
		let LoudnessVickersValidInputVector;

		before(() => {
			loudnessVickersInstance = new LoudnessVickers();
			LoudnessVickersValidInput = Array(1028).fill(0).map( _ => Math.random() );
			LoudnessVickersValidInputVector = arrayToVector(LoudnessVickersValidInput)
		});
		after(() => {
			loudnessVickersInstance.delete();
			LoudnessVickersValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				loudnessVickersInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = loudnessVickersInstance.compute(LoudnessVickersValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('loudness');
		});
	});
	



	describe('LowLevelSpectralEqloudExtractor:instantiation', () => {
		let lowLevelSpectralEqloudExtractorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			lowLevelSpectralEqloudExtractorInstance = new LowLevelSpectralEqloudExtractor();
			expect(lowLevelSpectralEqloudExtractorInstance).to.be.instanceOf(LowLevelSpectralEqloudExtractor);
		});
		it('should delete instance', function () {
			if (!lowLevelSpectralEqloudExtractorInstance) this.skip();
			lowLevelSpectralEqloudExtractorInstance.delete();
		});
	});

	describe('LowLevelSpectralEqloudExtractor:functionality', () => {
		let lowLevelSpectralEqloudExtractorInstance;
		let LowLevelSpectralEqloudExtractorValidInput;
		let LowLevelSpectralEqloudExtractorValidInputVector;

		before(() => {
			lowLevelSpectralEqloudExtractorInstance = new LowLevelSpectralEqloudExtractor();
			LowLevelSpectralEqloudExtractorValidInput = Array(2048).fill(0).map( _ => Math.random() );
			LowLevelSpectralEqloudExtractorValidInputVector = arrayToVector(LowLevelSpectralEqloudExtractorValidInput)
		});
		after(() => {
			lowLevelSpectralEqloudExtractorInstance.delete();
			LowLevelSpectralEqloudExtractorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				lowLevelSpectralEqloudExtractorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = lowLevelSpectralEqloudExtractorInstance.compute(LowLevelSpectralEqloudExtractorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('dissonance');
expect(result).to.have.property('sccoeffs');
expect(result).to.have.property('scvalleys');
expect(result).to.have.property('spectral_centroid');
expect(result).to.have.property('spectral_kurtosis');
expect(result).to.have.property('spectral_skewness');
expect(result).to.have.property('spectral_spread');
		});
	});
	



	describe('LowLevelSpectralExtractor:instantiation', () => {
		let lowLevelSpectralExtractorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			lowLevelSpectralExtractorInstance = new LowLevelSpectralExtractor();
			expect(lowLevelSpectralExtractorInstance).to.be.instanceOf(LowLevelSpectralExtractor);
		});
		it('should delete instance', function () {
			if (!lowLevelSpectralExtractorInstance) this.skip();
			lowLevelSpectralExtractorInstance.delete();
		});
	});

	describe('LowLevelSpectralExtractor:functionality', () => {
		let lowLevelSpectralExtractorInstance;
		let LowLevelSpectralExtractorValidInput;
		let LowLevelSpectralExtractorValidInputVector;

		before(() => {
			lowLevelSpectralExtractorInstance = new LowLevelSpectralExtractor();
			LowLevelSpectralExtractorValidInput = Array(2048).fill(0).map( _ => Math.random() );
			LowLevelSpectralExtractorValidInputVector = arrayToVector(LowLevelSpectralExtractorValidInput)
		});
		after(() => {
			lowLevelSpectralExtractorInstance.delete();
			LowLevelSpectralExtractorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				lowLevelSpectralExtractorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = lowLevelSpectralExtractorInstance.compute(LowLevelSpectralExtractorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('barkbands');
expect(result).to.have.property('barkbands_kurtosis');
expect(result).to.have.property('barkbands_skewness');
expect(result).to.have.property('barkbands_spread');
expect(result).to.have.property('hfc');
expect(result).to.have.property('mfcc');
expect(result).to.have.property('pitch');
expect(result).to.have.property('pitch_instantaneous_confidence');
expect(result).to.have.property('pitch_salience');
expect(result).to.have.property('silence_rate_20dB');
expect(result).to.have.property('silence_rate_30dB');
expect(result).to.have.property('silence_rate_60dB');
expect(result).to.have.property('spectral_complexity');
expect(result).to.have.property('spectral_crest');
expect(result).to.have.property('spectral_decrease');
expect(result).to.have.property('spectral_energy');
expect(result).to.have.property('spectral_energyband_low');
expect(result).to.have.property('spectral_energyband_middle_low');
expect(result).to.have.property('spectral_energyband_middle_high');
expect(result).to.have.property('spectral_energyband_high');
expect(result).to.have.property('spectral_flatness_db');
expect(result).to.have.property('spectral_flux');
expect(result).to.have.property('spectral_rms');
expect(result).to.have.property('spectral_rolloff');
expect(result).to.have.property('spectral_strongpeak');
expect(result).to.have.property('zerocrossingrate');
expect(result).to.have.property('inharmonicity');
expect(result).to.have.property('tristimulus');
expect(result).to.have.property('oddtoevenharmonicenergyratio');
		});
	});
	



	describe('LowPass:instantiation', () => {
		let lowPassInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			lowPassInstance = new LowPass();
			expect(lowPassInstance).to.be.instanceOf(LowPass);
		});
		it('should delete instance', function () {
			if (!lowPassInstance) this.skip();
			lowPassInstance.delete();
		});
	});

	describe('LowPass:functionality', () => {
		let lowPassInstance;
		let LowPassValidInput;
		let LowPassValidInputVector;

		before(() => {
			lowPassInstance = new LowPass();
			LowPassValidInput = Array(1028).fill(0).map( _ => Math.random() );
			LowPassValidInputVector = arrayToVector(LowPassValidInput)
		});
		after(() => {
			lowPassInstance.delete();
			LowPassValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				lowPassInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = lowPassInstance.compute(LowPassValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('MFCC:instantiation', () => {
		let mFCCInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			mFCCInstance = new MFCC();
			expect(mFCCInstance).to.be.instanceOf(MFCC);
		});
		it('should delete instance', function () {
			if (!mFCCInstance) this.skip();
			mFCCInstance.delete();
		});
	});

	describe('MFCC:functionality', () => {
		let mFCCInstance;
		let MFCCValidInput;
		let MFCCValidInputVector;

		before(() => {
			mFCCInstance = new MFCC();
			MFCCValidInput = Array(1025).fill(0).map( _ => Math.random() );
			MFCCValidInputVector = arrayToVector(MFCCValidInput)
		});
		after(() => {
			mFCCInstance.delete();
			MFCCValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				mFCCInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = mFCCInstance.compute(MFCCValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bands');
expect(result).to.have.property('mfcc');
		});
	});
	



	describe('MaxFilter:instantiation', () => {
		let maxFilterInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			maxFilterInstance = new MaxFilter();
			expect(maxFilterInstance).to.be.instanceOf(MaxFilter);
		});
		it('should delete instance', function () {
			if (!maxFilterInstance) this.skip();
			maxFilterInstance.delete();
		});
	});

	describe('MaxFilter:functionality', () => {
		let maxFilterInstance;
		let MaxFilterValidInput;
		let MaxFilterValidInputVector;

		before(() => {
			maxFilterInstance = new MaxFilter();
			MaxFilterValidInput = Array(1028).fill(0).map( _ => Math.random() );
			MaxFilterValidInputVector = arrayToVector(MaxFilterValidInput)
		});
		after(() => {
			maxFilterInstance.delete();
			MaxFilterValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				maxFilterInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = maxFilterInstance.compute(MaxFilterValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('MaxMagFreq:instantiation', () => {
		let maxMagFreqInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			maxMagFreqInstance = new MaxMagFreq();
			expect(maxMagFreqInstance).to.be.instanceOf(MaxMagFreq);
		});
		it('should delete instance', function () {
			if (!maxMagFreqInstance) this.skip();
			maxMagFreqInstance.delete();
		});
	});

	describe('MaxMagFreq:functionality', () => {
		let maxMagFreqInstance;
		let MaxMagFreqValidInput;
		let MaxMagFreqValidInputVector;

		before(() => {
			maxMagFreqInstance = new MaxMagFreq();
			MaxMagFreqValidInput = Array(1028).fill(0).map( _ => Math.random() );
			MaxMagFreqValidInputVector = arrayToVector(MaxMagFreqValidInput)
		});
		after(() => {
			maxMagFreqInstance.delete();
			MaxMagFreqValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				maxMagFreqInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = maxMagFreqInstance.compute(MaxMagFreqValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('maxMagFreq');
		});
	});
	



	describe('MaxToTotal:instantiation', () => {
		let maxToTotalInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			maxToTotalInstance = new MaxToTotal();
			expect(maxToTotalInstance).to.be.instanceOf(MaxToTotal);
		});
		it('should delete instance', function () {
			if (!maxToTotalInstance) this.skip();
			maxToTotalInstance.delete();
		});
	});

	describe('MaxToTotal:functionality', () => {
		let maxToTotalInstance;
		let MaxToTotalValidInput;
		let MaxToTotalValidInputVector;

		before(() => {
			maxToTotalInstance = new MaxToTotal();
			MaxToTotalValidInput = Array(1028).fill(0).map( _ => Math.random() );
			MaxToTotalValidInputVector = arrayToVector(MaxToTotalValidInput)
		});
		after(() => {
			maxToTotalInstance.delete();
			MaxToTotalValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				maxToTotalInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = maxToTotalInstance.compute(MaxToTotalValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('maxToTotal');
		});
	});
	



	describe('Mean:instantiation', () => {
		let meanInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			meanInstance = new Mean();
			expect(meanInstance).to.be.instanceOf(Mean);
		});
		it('should delete instance', function () {
			if (!meanInstance) this.skip();
			meanInstance.delete();
		});
	});

	describe('Mean:functionality', () => {
		let meanInstance;
		let MeanValidInput;
		let MeanValidInputVector;

		before(() => {
			meanInstance = new Mean();
			MeanValidInput = Array(1028).fill(0).map( _ => Math.random() );
			MeanValidInputVector = arrayToVector(MeanValidInput)
		});
		after(() => {
			meanInstance.delete();
			MeanValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				meanInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = meanInstance.compute(MeanValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('mean');
		});
	});
	



	describe('Median:instantiation', () => {
		let medianInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			medianInstance = new Median();
			expect(medianInstance).to.be.instanceOf(Median);
		});
		it('should delete instance', function () {
			if (!medianInstance) this.skip();
			medianInstance.delete();
		});
	});

	describe('Median:functionality', () => {
		let medianInstance;
		let MedianValidInput;
		let MedianValidInputVector;

		before(() => {
			medianInstance = new Median();
			MedianValidInput = Array(1028).fill(0).map( _ => Math.random() );
			MedianValidInputVector = arrayToVector(MedianValidInput)
		});
		after(() => {
			medianInstance.delete();
			MedianValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				medianInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = medianInstance.compute(MedianValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('median');
		});
	});
	



	describe('MedianFilter:instantiation', () => {
		let medianFilterInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			medianFilterInstance = new MedianFilter();
			expect(medianFilterInstance).to.be.instanceOf(MedianFilter);
		});
		it('should delete instance', function () {
			if (!medianFilterInstance) this.skip();
			medianFilterInstance.delete();
		});
	});

	describe('MedianFilter:functionality', () => {
		let medianFilterInstance;
		let MedianFilterValidInput;
		let MedianFilterValidInputVector;

		before(() => {
			medianFilterInstance = new MedianFilter();
			MedianFilterValidInput = Array(1028).fill(0).map( _ => Math.random() );
			MedianFilterValidInputVector = arrayToVector(MedianFilterValidInput)
		});
		after(() => {
			medianFilterInstance.delete();
			MedianFilterValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				medianFilterInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = medianFilterInstance.compute(MedianFilterValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('filteredArray');
		});
	});
	



	describe('MelBands:instantiation', () => {
		let melBandsInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			melBandsInstance = new MelBands();
			expect(melBandsInstance).to.be.instanceOf(MelBands);
		});
		it('should delete instance', function () {
			if (!melBandsInstance) this.skip();
			melBandsInstance.delete();
		});
	});

	describe('MelBands:functionality', () => {
		let melBandsInstance;
		let MelBandsValidInput;
		let MelBandsValidInputVector;

		before(() => {
			melBandsInstance = new MelBands();
			MelBandsValidInput = Array(1025).fill(0).map( _ => Math.random() );
			MelBandsValidInputVector = arrayToVector(MelBandsValidInput)
		});
		after(() => {
			melBandsInstance.delete();
			MelBandsValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				melBandsInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = melBandsInstance.compute(MelBandsValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bands');
		});
	});
	



	describe('Meter:instantiation', () => {
		let meterInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			meterInstance = new Meter();
			expect(meterInstance).to.be.instanceOf(Meter);
		});
		it('should delete instance', function () {
			if (!meterInstance) this.skip();
			meterInstance.delete();
		});
	});

	describe('Meter:functionality', () => {
		let meterInstance;
		let MeterValidInput;
		let MeterValidInputVector;

		before(() => {
			meterInstance = new Meter();
			MeterValidInput = Array(1028).fill(0).map( _ => Math.random() );
			MeterValidInputVector = arrayToVector(MeterValidInput)
		});
		after(() => {
			meterInstance.delete();
			MeterValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				meterInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = meterInstance.compute(MeterValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('meter');
		});
	});
	



	describe('MinMax:instantiation', () => {
		let minMaxInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			minMaxInstance = new MinMax();
			expect(minMaxInstance).to.be.instanceOf(MinMax);
		});
		it('should delete instance', function () {
			if (!minMaxInstance) this.skip();
			minMaxInstance.delete();
		});
	});

	describe('MinMax:functionality', () => {
		let minMaxInstance;
		let MinMaxValidInput;
		let MinMaxValidInputVector;

		before(() => {
			minMaxInstance = new MinMax();
			MinMaxValidInput = Array(1028).fill(0).map( _ => Math.random() );
			MinMaxValidInputVector = arrayToVector(MinMaxValidInput)
		});
		after(() => {
			minMaxInstance.delete();
			MinMaxValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				minMaxInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = minMaxInstance.compute(MinMaxValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('real');
expect(result).to.have.property('int');
		});
	});
	



	describe('MinToTotal:instantiation', () => {
		let minToTotalInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			minToTotalInstance = new MinToTotal();
			expect(minToTotalInstance).to.be.instanceOf(MinToTotal);
		});
		it('should delete instance', function () {
			if (!minToTotalInstance) this.skip();
			minToTotalInstance.delete();
		});
	});

	describe('MinToTotal:functionality', () => {
		let minToTotalInstance;
		let MinToTotalValidInput;
		let MinToTotalValidInputVector;

		before(() => {
			minToTotalInstance = new MinToTotal();
			MinToTotalValidInput = Array(1028).fill(0).map( _ => Math.random() );
			MinToTotalValidInputVector = arrayToVector(MinToTotalValidInput)
		});
		after(() => {
			minToTotalInstance.delete();
			MinToTotalValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				minToTotalInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = minToTotalInstance.compute(MinToTotalValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('minToTotal');
		});
	});
	



	describe('MovingAverage:instantiation', () => {
		let movingAverageInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			movingAverageInstance = new MovingAverage();
			expect(movingAverageInstance).to.be.instanceOf(MovingAverage);
		});
		it('should delete instance', function () {
			if (!movingAverageInstance) this.skip();
			movingAverageInstance.delete();
		});
	});

	describe('MovingAverage:functionality', () => {
		let movingAverageInstance;
		let MovingAverageValidInput;
		let MovingAverageValidInputVector;

		before(() => {
			movingAverageInstance = new MovingAverage();
			MovingAverageValidInput = Array(1028).fill(0).map( _ => Math.random() );
			MovingAverageValidInputVector = arrayToVector(MovingAverageValidInput)
		});
		after(() => {
			movingAverageInstance.delete();
			MovingAverageValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				movingAverageInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = movingAverageInstance.compute(MovingAverageValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('MultiPitchKlapuri:instantiation', () => {
		let multiPitchKlapuriInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			multiPitchKlapuriInstance = new MultiPitchKlapuri();
			expect(multiPitchKlapuriInstance).to.be.instanceOf(MultiPitchKlapuri);
		});
		it('should delete instance', function () {
			if (!multiPitchKlapuriInstance) this.skip();
			multiPitchKlapuriInstance.delete();
		});
	});

	describe('MultiPitchKlapuri:functionality', () => {
		let multiPitchKlapuriInstance;
		let MultiPitchKlapuriValidInput;
		let MultiPitchKlapuriValidInputVector;

		before(() => {
			multiPitchKlapuriInstance = new MultiPitchKlapuri();
			MultiPitchKlapuriValidInput = Array(2048).fill(0).map( _ => Math.random() );
			MultiPitchKlapuriValidInputVector = arrayToVector(MultiPitchKlapuriValidInput)
		});
		after(() => {
			multiPitchKlapuriInstance.delete();
			MultiPitchKlapuriValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				multiPitchKlapuriInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = multiPitchKlapuriInstance.compute(MultiPitchKlapuriValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('pitch');
		});
	});
	



	describe('MultiPitchMelodia:instantiation', () => {
		let multiPitchMelodiaInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			multiPitchMelodiaInstance = new MultiPitchMelodia();
			expect(multiPitchMelodiaInstance).to.be.instanceOf(MultiPitchMelodia);
		});
		it('should delete instance', function () {
			if (!multiPitchMelodiaInstance) this.skip();
			multiPitchMelodiaInstance.delete();
		});
	});

	describe('MultiPitchMelodia:functionality', () => {
		let multiPitchMelodiaInstance;
		let MultiPitchMelodiaValidInput;
		let MultiPitchMelodiaValidInputVector;

		before(() => {
			multiPitchMelodiaInstance = new MultiPitchMelodia();
			MultiPitchMelodiaValidInput = Array(2048).fill(0).map( _ => Math.random() );
			MultiPitchMelodiaValidInputVector = arrayToVector(MultiPitchMelodiaValidInput)
		});
		after(() => {
			multiPitchMelodiaInstance.delete();
			MultiPitchMelodiaValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				multiPitchMelodiaInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = multiPitchMelodiaInstance.compute(MultiPitchMelodiaValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('pitch');
		});
	});
	



	describe('Multiplexer:instantiation', () => {
		let multiplexerInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			multiplexerInstance = new Multiplexer();
			expect(multiplexerInstance).to.be.instanceOf(Multiplexer);
		});
		it('should delete instance', function () {
			if (!multiplexerInstance) this.skip();
			multiplexerInstance.delete();
		});
	});

	describe('Multiplexer:functionality', () => {
		let multiplexerInstance;
		let MultiplexerValidInput;
		let MultiplexerValidInputVector;

		before(() => {
			multiplexerInstance = new Multiplexer();
			MultiplexerValidInput = Array(1028).fill(0).map( _ => Math.random() );
			MultiplexerValidInputVector = arrayToVector(MultiplexerValidInput)
		});
		after(() => {
			multiplexerInstance.delete();
			MultiplexerValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				multiplexerInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = multiplexerInstance.compute(MultiplexerValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('data');
		});
	});
	



	describe('NNLSChroma:instantiation', () => {
		let nNLSChromaInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			nNLSChromaInstance = new NNLSChroma();
			expect(nNLSChromaInstance).to.be.instanceOf(NNLSChroma);
		});
		it('should delete instance', function () {
			if (!nNLSChromaInstance) this.skip();
			nNLSChromaInstance.delete();
		});
	});

	describe('NNLSChroma:functionality', () => {
		let nNLSChromaInstance;
		let NNLSChromaValidInput;
		let NNLSChromaValidInputVector;

		before(() => {
			nNLSChromaInstance = new NNLSChroma();
			NNLSChromaValidInput = Array(1025).fill(0).map( _ => Math.random() );
			NNLSChromaValidInputVector = arrayToVector(NNLSChromaValidInput)
		});
		after(() => {
			nNLSChromaInstance.delete();
			NNLSChromaValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				nNLSChromaInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = nNLSChromaInstance.compute(NNLSChromaValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('tunedLogfreqSpectrum');
expect(result).to.have.property('semitoneSpectrum');
expect(result).to.have.property('bassChromagram');
expect(result).to.have.property('chromagram');
		});
	});
	



	describe('NoiseAdder:instantiation', () => {
		let noiseAdderInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			noiseAdderInstance = new NoiseAdder();
			expect(noiseAdderInstance).to.be.instanceOf(NoiseAdder);
		});
		it('should delete instance', function () {
			if (!noiseAdderInstance) this.skip();
			noiseAdderInstance.delete();
		});
	});

	describe('NoiseAdder:functionality', () => {
		let noiseAdderInstance;
		let NoiseAdderValidInput;
		let NoiseAdderValidInputVector;

		before(() => {
			noiseAdderInstance = new NoiseAdder();
			NoiseAdderValidInput = Array(1028).fill(0).map( _ => Math.random() );
			NoiseAdderValidInputVector = arrayToVector(NoiseAdderValidInput)
		});
		after(() => {
			noiseAdderInstance.delete();
			NoiseAdderValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				noiseAdderInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = noiseAdderInstance.compute(NoiseAdderValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('NoiseBurstDetector:instantiation', () => {
		let noiseBurstDetectorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			noiseBurstDetectorInstance = new NoiseBurstDetector();
			expect(noiseBurstDetectorInstance).to.be.instanceOf(NoiseBurstDetector);
		});
		it('should delete instance', function () {
			if (!noiseBurstDetectorInstance) this.skip();
			noiseBurstDetectorInstance.delete();
		});
	});

	describe('NoiseBurstDetector:functionality', () => {
		let noiseBurstDetectorInstance;
		let NoiseBurstDetectorValidInput;
		let NoiseBurstDetectorValidInputVector;

		before(() => {
			noiseBurstDetectorInstance = new NoiseBurstDetector();
			NoiseBurstDetectorValidInput = Array(1028).fill(0).map( _ => Math.random() );
			NoiseBurstDetectorValidInputVector = arrayToVector(NoiseBurstDetectorValidInput)
		});
		after(() => {
			noiseBurstDetectorInstance.delete();
			NoiseBurstDetectorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				noiseBurstDetectorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = noiseBurstDetectorInstance.compute(NoiseBurstDetectorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('indexes');
		});
	});
	



	describe('NoveltyCurve:instantiation', () => {
		let noveltyCurveInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			noveltyCurveInstance = new NoveltyCurve();
			expect(noveltyCurveInstance).to.be.instanceOf(NoveltyCurve);
		});
		it('should delete instance', function () {
			if (!noveltyCurveInstance) this.skip();
			noveltyCurveInstance.delete();
		});
	});

	describe('NoveltyCurve:functionality', () => {
		let noveltyCurveInstance;
		let NoveltyCurveValidInput;
		let NoveltyCurveValidInputVector;

		before(() => {
			noveltyCurveInstance = new NoveltyCurve();
			NoveltyCurveValidInput = Array(1028).fill(0).map( _ => Math.random() );
			NoveltyCurveValidInputVector = arrayToVector(NoveltyCurveValidInput)
		});
		after(() => {
			noveltyCurveInstance.delete();
			NoveltyCurveValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				noveltyCurveInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = noveltyCurveInstance.compute(NoveltyCurveValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('novelty');
		});
	});
	



	describe('NoveltyCurveFixedBpmEstimator:instantiation', () => {
		let noveltyCurveFixedBpmEstimatorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			noveltyCurveFixedBpmEstimatorInstance = new NoveltyCurveFixedBpmEstimator();
			expect(noveltyCurveFixedBpmEstimatorInstance).to.be.instanceOf(NoveltyCurveFixedBpmEstimator);
		});
		it('should delete instance', function () {
			if (!noveltyCurveFixedBpmEstimatorInstance) this.skip();
			noveltyCurveFixedBpmEstimatorInstance.delete();
		});
	});

	describe('NoveltyCurveFixedBpmEstimator:functionality', () => {
		let noveltyCurveFixedBpmEstimatorInstance;
		let NoveltyCurveFixedBpmEstimatorValidInput;
		let NoveltyCurveFixedBpmEstimatorValidInputVector;

		before(() => {
			noveltyCurveFixedBpmEstimatorInstance = new NoveltyCurveFixedBpmEstimator();
			NoveltyCurveFixedBpmEstimatorValidInput = Array(1028).fill(0).map( _ => Math.random() );
			NoveltyCurveFixedBpmEstimatorValidInputVector = arrayToVector(NoveltyCurveFixedBpmEstimatorValidInput)
		});
		after(() => {
			noveltyCurveFixedBpmEstimatorInstance.delete();
			NoveltyCurveFixedBpmEstimatorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				noveltyCurveFixedBpmEstimatorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = noveltyCurveFixedBpmEstimatorInstance.compute(NoveltyCurveFixedBpmEstimatorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bpms');
expect(result).to.have.property('amplitudes');
		});
	});
	



	describe('OddToEvenHarmonicEnergyRatio:instantiation', () => {
		let oddToEvenHarmonicEnergyRatioInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			oddToEvenHarmonicEnergyRatioInstance = new OddToEvenHarmonicEnergyRatio();
			expect(oddToEvenHarmonicEnergyRatioInstance).to.be.instanceOf(OddToEvenHarmonicEnergyRatio);
		});
		it('should delete instance', function () {
			if (!oddToEvenHarmonicEnergyRatioInstance) this.skip();
			oddToEvenHarmonicEnergyRatioInstance.delete();
		});
	});

	describe('OddToEvenHarmonicEnergyRatio:functionality', () => {
		let oddToEvenHarmonicEnergyRatioInstance;
		let OddToEvenHarmonicEnergyRatioValidInput;
		let OddToEvenHarmonicEnergyRatioValidInputVector;

		before(() => {
			oddToEvenHarmonicEnergyRatioInstance = new OddToEvenHarmonicEnergyRatio();
			OddToEvenHarmonicEnergyRatioValidInput = Array(1028).fill(0).map( _ => Math.random() );
			OddToEvenHarmonicEnergyRatioValidInputVector = arrayToVector(OddToEvenHarmonicEnergyRatioValidInput)
		});
		after(() => {
			oddToEvenHarmonicEnergyRatioInstance.delete();
			OddToEvenHarmonicEnergyRatioValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				oddToEvenHarmonicEnergyRatioInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = oddToEvenHarmonicEnergyRatioInstance.compute(OddToEvenHarmonicEnergyRatioValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('oddToEvenHarmonicEnergyRatio');
		});
	});
	



	describe('OnsetDetection:instantiation', () => {
		let onsetDetectionInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			onsetDetectionInstance = new OnsetDetection();
			expect(onsetDetectionInstance).to.be.instanceOf(OnsetDetection);
		});
		it('should delete instance', function () {
			if (!onsetDetectionInstance) this.skip();
			onsetDetectionInstance.delete();
		});
	});

	describe('OnsetDetection:functionality', () => {
		let onsetDetectionInstance;
		let OnsetDetectionValidInput;
		let OnsetDetectionValidInputVector;

		before(() => {
			onsetDetectionInstance = new OnsetDetection();
			OnsetDetectionValidInput = Array(1028).fill(0).map( _ => Math.random() );
			OnsetDetectionValidInputVector = arrayToVector(OnsetDetectionValidInput)
		});
		after(() => {
			onsetDetectionInstance.delete();
			OnsetDetectionValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				onsetDetectionInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = onsetDetectionInstance.compute(OnsetDetectionValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('onsetDetection');
		});
	});
	



	describe('OnsetDetectionGlobal:instantiation', () => {
		let onsetDetectionGlobalInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			onsetDetectionGlobalInstance = new OnsetDetectionGlobal();
			expect(onsetDetectionGlobalInstance).to.be.instanceOf(OnsetDetectionGlobal);
		});
		it('should delete instance', function () {
			if (!onsetDetectionGlobalInstance) this.skip();
			onsetDetectionGlobalInstance.delete();
		});
	});

	describe('OnsetDetectionGlobal:functionality', () => {
		let onsetDetectionGlobalInstance;
		let OnsetDetectionGlobalValidInput;
		let OnsetDetectionGlobalValidInputVector;

		before(() => {
			onsetDetectionGlobalInstance = new OnsetDetectionGlobal();
			OnsetDetectionGlobalValidInput = Array(2048).fill(0).map( _ => Math.random() );
			OnsetDetectionGlobalValidInputVector = arrayToVector(OnsetDetectionGlobalValidInput)
		});
		after(() => {
			onsetDetectionGlobalInstance.delete();
			OnsetDetectionGlobalValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				onsetDetectionGlobalInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = onsetDetectionGlobalInstance.compute(OnsetDetectionGlobalValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('onsetDetections');
		});
	});
	



	describe('OnsetRate:instantiation', () => {
		let onsetRateInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			onsetRateInstance = new OnsetRate();
			expect(onsetRateInstance).to.be.instanceOf(OnsetRate);
		});
		it('should delete instance', function () {
			if (!onsetRateInstance) this.skip();
			onsetRateInstance.delete();
		});
	});

	describe('OnsetRate:functionality', () => {
		let onsetRateInstance;
		let OnsetRateValidInput;
		let OnsetRateValidInputVector;

		before(() => {
			onsetRateInstance = new OnsetRate();
			OnsetRateValidInput = Array(1028).fill(0).map( _ => Math.random() );
			OnsetRateValidInputVector = arrayToVector(OnsetRateValidInput)
		});
		after(() => {
			onsetRateInstance.delete();
			OnsetRateValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				onsetRateInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = onsetRateInstance.compute(OnsetRateValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('onsets');
expect(result).to.have.property('onsetRate');
		});
	});
	



	describe('OverlapAdd:instantiation', () => {
		let overlapAddInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			overlapAddInstance = new OverlapAdd();
			expect(overlapAddInstance).to.be.instanceOf(OverlapAdd);
		});
		it('should delete instance', function () {
			if (!overlapAddInstance) this.skip();
			overlapAddInstance.delete();
		});
	});

	describe('OverlapAdd:functionality', () => {
		let overlapAddInstance;
		let OverlapAddValidInput;
		let OverlapAddValidInputVector;

		before(() => {
			overlapAddInstance = new OverlapAdd();
			OverlapAddValidInput = Array(2048).fill(0).map( _ => Math.random() );
			OverlapAddValidInputVector = arrayToVector(OverlapAddValidInput)
		});
		after(() => {
			overlapAddInstance.delete();
			OverlapAddValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				overlapAddInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = overlapAddInstance.compute(OverlapAddValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('PeakDetection:instantiation', () => {
		let peakDetectionInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			peakDetectionInstance = new PeakDetection();
			expect(peakDetectionInstance).to.be.instanceOf(PeakDetection);
		});
		it('should delete instance', function () {
			if (!peakDetectionInstance) this.skip();
			peakDetectionInstance.delete();
		});
	});

	describe('PeakDetection:functionality', () => {
		let peakDetectionInstance;
		let PeakDetectionValidInput;
		let PeakDetectionValidInputVector;

		before(() => {
			peakDetectionInstance = new PeakDetection();
			PeakDetectionValidInput = Array(1028).fill(0).map( _ => Math.random() );
			PeakDetectionValidInputVector = arrayToVector(PeakDetectionValidInput)
		});
		after(() => {
			peakDetectionInstance.delete();
			PeakDetectionValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				peakDetectionInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = peakDetectionInstance.compute(PeakDetectionValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('positions');
expect(result).to.have.property('amplitudes');
		});
	});
	



	describe('PercivalBpmEstimator:instantiation', () => {
		let percivalBpmEstimatorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			percivalBpmEstimatorInstance = new PercivalBpmEstimator();
			expect(percivalBpmEstimatorInstance).to.be.instanceOf(PercivalBpmEstimator);
		});
		it('should delete instance', function () {
			if (!percivalBpmEstimatorInstance) this.skip();
			percivalBpmEstimatorInstance.delete();
		});
	});

	describe('PercivalBpmEstimator:functionality', () => {
		let percivalBpmEstimatorInstance;
		let PercivalBpmEstimatorValidInput;
		let PercivalBpmEstimatorValidInputVector;

		before(() => {
			percivalBpmEstimatorInstance = new PercivalBpmEstimator();
			PercivalBpmEstimatorValidInput = Array(1024).fill(0).map( _ => Math.random() );
			PercivalBpmEstimatorValidInputVector = arrayToVector(PercivalBpmEstimatorValidInput)
		});
		after(() => {
			percivalBpmEstimatorInstance.delete();
			PercivalBpmEstimatorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				percivalBpmEstimatorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = percivalBpmEstimatorInstance.compute(PercivalBpmEstimatorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bpm');
		});
	});
	



	describe('PercivalEnhanceHarmonics:instantiation', () => {
		let percivalEnhanceHarmonicsInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			percivalEnhanceHarmonicsInstance = new PercivalEnhanceHarmonics();
			expect(percivalEnhanceHarmonicsInstance).to.be.instanceOf(PercivalEnhanceHarmonics);
		});
		it('should delete instance', function () {
			if (!percivalEnhanceHarmonicsInstance) this.skip();
			percivalEnhanceHarmonicsInstance.delete();
		});
	});

	describe('PercivalEnhanceHarmonics:functionality', () => {
		let percivalEnhanceHarmonicsInstance;
		let PercivalEnhanceHarmonicsValidInput;
		let PercivalEnhanceHarmonicsValidInputVector;

		before(() => {
			percivalEnhanceHarmonicsInstance = new PercivalEnhanceHarmonics();
			PercivalEnhanceHarmonicsValidInput = Array(1028).fill(0).map( _ => Math.random() );
			PercivalEnhanceHarmonicsValidInputVector = arrayToVector(PercivalEnhanceHarmonicsValidInput)
		});
		after(() => {
			percivalEnhanceHarmonicsInstance.delete();
			PercivalEnhanceHarmonicsValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				percivalEnhanceHarmonicsInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = percivalEnhanceHarmonicsInstance.compute(PercivalEnhanceHarmonicsValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('array');
		});
	});
	



	describe('PercivalEvaluatePulseTrains:instantiation', () => {
		let percivalEvaluatePulseTrainsInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			percivalEvaluatePulseTrainsInstance = new PercivalEvaluatePulseTrains();
			expect(percivalEvaluatePulseTrainsInstance).to.be.instanceOf(PercivalEvaluatePulseTrains);
		});
		it('should delete instance', function () {
			if (!percivalEvaluatePulseTrainsInstance) this.skip();
			percivalEvaluatePulseTrainsInstance.delete();
		});
	});

	describe('PercivalEvaluatePulseTrains:functionality', () => {
		let percivalEvaluatePulseTrainsInstance;
		let PercivalEvaluatePulseTrainsValidInput;
		let PercivalEvaluatePulseTrainsValidInputVector;

		before(() => {
			percivalEvaluatePulseTrainsInstance = new PercivalEvaluatePulseTrains();
			PercivalEvaluatePulseTrainsValidInput = Array(1028).fill(0).map( _ => Math.random() );
			PercivalEvaluatePulseTrainsValidInputVector = arrayToVector(PercivalEvaluatePulseTrainsValidInput)
		});
		after(() => {
			percivalEvaluatePulseTrainsInstance.delete();
			PercivalEvaluatePulseTrainsValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				percivalEvaluatePulseTrainsInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = percivalEvaluatePulseTrainsInstance.compute(PercivalEvaluatePulseTrainsValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('lag');
		});
	});
	



	describe('PitchContourSegmentation:instantiation', () => {
		let pitchContourSegmentationInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			pitchContourSegmentationInstance = new PitchContourSegmentation();
			expect(pitchContourSegmentationInstance).to.be.instanceOf(PitchContourSegmentation);
		});
		it('should delete instance', function () {
			if (!pitchContourSegmentationInstance) this.skip();
			pitchContourSegmentationInstance.delete();
		});
	});

	describe('PitchContourSegmentation:functionality', () => {
		let pitchContourSegmentationInstance;
		let PitchContourSegmentationValidInput;
		let PitchContourSegmentationValidInputVector;

		before(() => {
			pitchContourSegmentationInstance = new PitchContourSegmentation();
			PitchContourSegmentationValidInput = Array(1028).fill(0).map( _ => Math.random() );
			PitchContourSegmentationValidInputVector = arrayToVector(PitchContourSegmentationValidInput)
		});
		after(() => {
			pitchContourSegmentationInstance.delete();
			PitchContourSegmentationValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				pitchContourSegmentationInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = pitchContourSegmentationInstance.compute(PitchContourSegmentationValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('onset');
expect(result).to.have.property('duration');
expect(result).to.have.property('MIDIpitch');
		});
	});
	



	describe('PitchContours:instantiation', () => {
		let pitchContoursInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			pitchContoursInstance = new PitchContours();
			expect(pitchContoursInstance).to.be.instanceOf(PitchContours);
		});
		it('should delete instance', function () {
			if (!pitchContoursInstance) this.skip();
			pitchContoursInstance.delete();
		});
	});

	describe('PitchContours:functionality', () => {
		let pitchContoursInstance;
		let PitchContoursValidInput;
		let PitchContoursValidInputVector;

		before(() => {
			pitchContoursInstance = new PitchContours();
			PitchContoursValidInput = Array(1028).fill(0).map( _ => Math.random() );
			PitchContoursValidInputVector = arrayToVector(PitchContoursValidInput)
		});
		after(() => {
			pitchContoursInstance.delete();
			PitchContoursValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				pitchContoursInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = pitchContoursInstance.compute(PitchContoursValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('contoursBins');
expect(result).to.have.property('contoursSaliences');
expect(result).to.have.property('contoursStartTimes');
expect(result).to.have.property('duration');
		});
	});
	



	describe('PitchContoursMelody:instantiation', () => {
		let pitchContoursMelodyInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			pitchContoursMelodyInstance = new PitchContoursMelody();
			expect(pitchContoursMelodyInstance).to.be.instanceOf(PitchContoursMelody);
		});
		it('should delete instance', function () {
			if (!pitchContoursMelodyInstance) this.skip();
			pitchContoursMelodyInstance.delete();
		});
	});

	describe('PitchContoursMelody:functionality', () => {
		let pitchContoursMelodyInstance;
		let PitchContoursMelodyValidInput;
		let PitchContoursMelodyValidInputVector;

		before(() => {
			pitchContoursMelodyInstance = new PitchContoursMelody();
			PitchContoursMelodyValidInput = Array(1028).fill(0).map( _ => Math.random() );
			PitchContoursMelodyValidInputVector = arrayToVector(PitchContoursMelodyValidInput)
		});
		after(() => {
			pitchContoursMelodyInstance.delete();
			PitchContoursMelodyValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				pitchContoursMelodyInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = pitchContoursMelodyInstance.compute(PitchContoursMelodyValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('pitch');
expect(result).to.have.property('pitchConfidence');
		});
	});
	



	describe('PitchContoursMonoMelody:instantiation', () => {
		let pitchContoursMonoMelodyInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			pitchContoursMonoMelodyInstance = new PitchContoursMonoMelody();
			expect(pitchContoursMonoMelodyInstance).to.be.instanceOf(PitchContoursMonoMelody);
		});
		it('should delete instance', function () {
			if (!pitchContoursMonoMelodyInstance) this.skip();
			pitchContoursMonoMelodyInstance.delete();
		});
	});

	describe('PitchContoursMonoMelody:functionality', () => {
		let pitchContoursMonoMelodyInstance;
		let PitchContoursMonoMelodyValidInput;
		let PitchContoursMonoMelodyValidInputVector;

		before(() => {
			pitchContoursMonoMelodyInstance = new PitchContoursMonoMelody();
			PitchContoursMonoMelodyValidInput = Array(1028).fill(0).map( _ => Math.random() );
			PitchContoursMonoMelodyValidInputVector = arrayToVector(PitchContoursMonoMelodyValidInput)
		});
		after(() => {
			pitchContoursMonoMelodyInstance.delete();
			PitchContoursMonoMelodyValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				pitchContoursMonoMelodyInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = pitchContoursMonoMelodyInstance.compute(PitchContoursMonoMelodyValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('pitch');
expect(result).to.have.property('pitchConfidence');
		});
	});
	



	describe('PitchContoursMultiMelody:instantiation', () => {
		let pitchContoursMultiMelodyInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			pitchContoursMultiMelodyInstance = new PitchContoursMultiMelody();
			expect(pitchContoursMultiMelodyInstance).to.be.instanceOf(PitchContoursMultiMelody);
		});
		it('should delete instance', function () {
			if (!pitchContoursMultiMelodyInstance) this.skip();
			pitchContoursMultiMelodyInstance.delete();
		});
	});

	describe('PitchContoursMultiMelody:functionality', () => {
		let pitchContoursMultiMelodyInstance;
		let PitchContoursMultiMelodyValidInput;
		let PitchContoursMultiMelodyValidInputVector;

		before(() => {
			pitchContoursMultiMelodyInstance = new PitchContoursMultiMelody();
			PitchContoursMultiMelodyValidInput = Array(1028).fill(0).map( _ => Math.random() );
			PitchContoursMultiMelodyValidInputVector = arrayToVector(PitchContoursMultiMelodyValidInput)
		});
		after(() => {
			pitchContoursMultiMelodyInstance.delete();
			PitchContoursMultiMelodyValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				pitchContoursMultiMelodyInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = pitchContoursMultiMelodyInstance.compute(PitchContoursMultiMelodyValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('pitch');
		});
	});
	



	describe('PitchFilter:instantiation', () => {
		let pitchFilterInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			pitchFilterInstance = new PitchFilter();
			expect(pitchFilterInstance).to.be.instanceOf(PitchFilter);
		});
		it('should delete instance', function () {
			if (!pitchFilterInstance) this.skip();
			pitchFilterInstance.delete();
		});
	});

	describe('PitchFilter:functionality', () => {
		let pitchFilterInstance;
		let PitchFilterValidInput;
		let PitchFilterValidInputVector;

		before(() => {
			pitchFilterInstance = new PitchFilter();
			PitchFilterValidInput = Array(1028).fill(0).map( _ => Math.random() );
			PitchFilterValidInputVector = arrayToVector(PitchFilterValidInput)
		});
		after(() => {
			pitchFilterInstance.delete();
			PitchFilterValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				pitchFilterInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = pitchFilterInstance.compute(PitchFilterValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('pitchFiltered');
		});
	});
	



	describe('PitchMelodia:instantiation', () => {
		let pitchMelodiaInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			pitchMelodiaInstance = new PitchMelodia();
			expect(pitchMelodiaInstance).to.be.instanceOf(PitchMelodia);
		});
		it('should delete instance', function () {
			if (!pitchMelodiaInstance) this.skip();
			pitchMelodiaInstance.delete();
		});
	});

	describe('PitchMelodia:functionality', () => {
		let pitchMelodiaInstance;
		let PitchMelodiaValidInput;
		let PitchMelodiaValidInputVector;

		before(() => {
			pitchMelodiaInstance = new PitchMelodia();
			PitchMelodiaValidInput = Array(2048).fill(0).map( _ => Math.random() );
			PitchMelodiaValidInputVector = arrayToVector(PitchMelodiaValidInput)
		});
		after(() => {
			pitchMelodiaInstance.delete();
			PitchMelodiaValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				pitchMelodiaInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = pitchMelodiaInstance.compute(PitchMelodiaValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('pitch');
expect(result).to.have.property('pitchConfidence');
		});
	});
	



	describe('PitchSalience:instantiation', () => {
		let pitchSalienceInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			pitchSalienceInstance = new PitchSalience();
			expect(pitchSalienceInstance).to.be.instanceOf(PitchSalience);
		});
		it('should delete instance', function () {
			if (!pitchSalienceInstance) this.skip();
			pitchSalienceInstance.delete();
		});
	});

	describe('PitchSalience:functionality', () => {
		let pitchSalienceInstance;
		let PitchSalienceValidInput;
		let PitchSalienceValidInputVector;

		before(() => {
			pitchSalienceInstance = new PitchSalience();
			PitchSalienceValidInput = Array(1028).fill(0).map( _ => Math.random() );
			PitchSalienceValidInputVector = arrayToVector(PitchSalienceValidInput)
		});
		after(() => {
			pitchSalienceInstance.delete();
			PitchSalienceValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				pitchSalienceInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = pitchSalienceInstance.compute(PitchSalienceValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('pitchSalience');
		});
	});
	



	describe('PitchSalienceFunction:instantiation', () => {
		let pitchSalienceFunctionInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			pitchSalienceFunctionInstance = new PitchSalienceFunction();
			expect(pitchSalienceFunctionInstance).to.be.instanceOf(PitchSalienceFunction);
		});
		it('should delete instance', function () {
			if (!pitchSalienceFunctionInstance) this.skip();
			pitchSalienceFunctionInstance.delete();
		});
	});

	describe('PitchSalienceFunction:functionality', () => {
		let pitchSalienceFunctionInstance;
		let PitchSalienceFunctionValidInput;
		let PitchSalienceFunctionValidInputVector;

		before(() => {
			pitchSalienceFunctionInstance = new PitchSalienceFunction();
			PitchSalienceFunctionValidInput = Array(1028).fill(0).map( _ => Math.random() );
			PitchSalienceFunctionValidInputVector = arrayToVector(PitchSalienceFunctionValidInput)
		});
		after(() => {
			pitchSalienceFunctionInstance.delete();
			PitchSalienceFunctionValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				pitchSalienceFunctionInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = pitchSalienceFunctionInstance.compute(PitchSalienceFunctionValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('salienceFunction');
		});
	});
	



	describe('PitchSalienceFunctionPeaks:instantiation', () => {
		let pitchSalienceFunctionPeaksInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			pitchSalienceFunctionPeaksInstance = new PitchSalienceFunctionPeaks();
			expect(pitchSalienceFunctionPeaksInstance).to.be.instanceOf(PitchSalienceFunctionPeaks);
		});
		it('should delete instance', function () {
			if (!pitchSalienceFunctionPeaksInstance) this.skip();
			pitchSalienceFunctionPeaksInstance.delete();
		});
	});

	describe('PitchSalienceFunctionPeaks:functionality', () => {
		let pitchSalienceFunctionPeaksInstance;
		let PitchSalienceFunctionPeaksValidInput;
		let PitchSalienceFunctionPeaksValidInputVector;

		before(() => {
			pitchSalienceFunctionPeaksInstance = new PitchSalienceFunctionPeaks();
			PitchSalienceFunctionPeaksValidInput = Array(1028).fill(0).map( _ => Math.random() );
			PitchSalienceFunctionPeaksValidInputVector = arrayToVector(PitchSalienceFunctionPeaksValidInput)
		});
		after(() => {
			pitchSalienceFunctionPeaksInstance.delete();
			PitchSalienceFunctionPeaksValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				pitchSalienceFunctionPeaksInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = pitchSalienceFunctionPeaksInstance.compute(PitchSalienceFunctionPeaksValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('salienceBins');
expect(result).to.have.property('salienceValues');
		});
	});
	



	describe('PitchYin:instantiation', () => {
		let pitchYinInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			pitchYinInstance = new PitchYin();
			expect(pitchYinInstance).to.be.instanceOf(PitchYin);
		});
		it('should delete instance', function () {
			if (!pitchYinInstance) this.skip();
			pitchYinInstance.delete();
		});
	});

	describe('PitchYin:functionality', () => {
		let pitchYinInstance;
		let PitchYinValidInput;
		let PitchYinValidInputVector;

		before(() => {
			pitchYinInstance = new PitchYin();
			PitchYinValidInput = Array(2048).fill(0).map( _ => Math.random() );
			PitchYinValidInputVector = arrayToVector(PitchYinValidInput)
		});
		after(() => {
			pitchYinInstance.delete();
			PitchYinValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				pitchYinInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = pitchYinInstance.compute(PitchYinValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('pitch');
expect(result).to.have.property('pitchConfidence');
		});
	});
	



	describe('PitchYinFFT:instantiation', () => {
		let pitchYinFFTInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			pitchYinFFTInstance = new PitchYinFFT();
			expect(pitchYinFFTInstance).to.be.instanceOf(PitchYinFFT);
		});
		it('should delete instance', function () {
			if (!pitchYinFFTInstance) this.skip();
			pitchYinFFTInstance.delete();
		});
	});

	describe('PitchYinFFT:functionality', () => {
		let pitchYinFFTInstance;
		let PitchYinFFTValidInput;
		let PitchYinFFTValidInputVector;

		before(() => {
			pitchYinFFTInstance = new PitchYinFFT();
			PitchYinFFTValidInput = Array(2048).fill(0).map( _ => Math.random() );
			PitchYinFFTValidInputVector = arrayToVector(PitchYinFFTValidInput)
		});
		after(() => {
			pitchYinFFTInstance.delete();
			PitchYinFFTValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				pitchYinFFTInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = pitchYinFFTInstance.compute(PitchYinFFTValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('pitch');
expect(result).to.have.property('pitchConfidence');
		});
	});
	



	describe('PitchYinProbabilistic:instantiation', () => {
		let pitchYinProbabilisticInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			pitchYinProbabilisticInstance = new PitchYinProbabilistic();
			expect(pitchYinProbabilisticInstance).to.be.instanceOf(PitchYinProbabilistic);
		});
		it('should delete instance', function () {
			if (!pitchYinProbabilisticInstance) this.skip();
			pitchYinProbabilisticInstance.delete();
		});
	});

	describe('PitchYinProbabilistic:functionality', () => {
		let pitchYinProbabilisticInstance;
		let PitchYinProbabilisticValidInput;
		let PitchYinProbabilisticValidInputVector;

		before(() => {
			pitchYinProbabilisticInstance = new PitchYinProbabilistic();
			PitchYinProbabilisticValidInput = Array(2048).fill(0).map( _ => Math.random() );
			PitchYinProbabilisticValidInputVector = arrayToVector(PitchYinProbabilisticValidInput)
		});
		after(() => {
			pitchYinProbabilisticInstance.delete();
			PitchYinProbabilisticValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				pitchYinProbabilisticInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = pitchYinProbabilisticInstance.compute(PitchYinProbabilisticValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('pitch');
expect(result).to.have.property('voicedProbabilities');
		});
	});
	



	describe('PitchYinProbabilities:instantiation', () => {
		let pitchYinProbabilitiesInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			pitchYinProbabilitiesInstance = new PitchYinProbabilities();
			expect(pitchYinProbabilitiesInstance).to.be.instanceOf(PitchYinProbabilities);
		});
		it('should delete instance', function () {
			if (!pitchYinProbabilitiesInstance) this.skip();
			pitchYinProbabilitiesInstance.delete();
		});
	});

	describe('PitchYinProbabilities:functionality', () => {
		let pitchYinProbabilitiesInstance;
		let PitchYinProbabilitiesValidInput;
		let PitchYinProbabilitiesValidInputVector;

		before(() => {
			pitchYinProbabilitiesInstance = new PitchYinProbabilities();
			PitchYinProbabilitiesValidInput = Array(2048).fill(0).map( _ => Math.random() );
			PitchYinProbabilitiesValidInputVector = arrayToVector(PitchYinProbabilitiesValidInput)
		});
		after(() => {
			pitchYinProbabilitiesInstance.delete();
			PitchYinProbabilitiesValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				pitchYinProbabilitiesInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = pitchYinProbabilitiesInstance.compute(PitchYinProbabilitiesValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('pitch');
expect(result).to.have.property('probabilities');
expect(result).to.have.property('RMS');
		});
	});
	



	describe('PitchYinProbabilitiesHMM:instantiation', () => {
		let pitchYinProbabilitiesHMMInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			pitchYinProbabilitiesHMMInstance = new PitchYinProbabilitiesHMM();
			expect(pitchYinProbabilitiesHMMInstance).to.be.instanceOf(PitchYinProbabilitiesHMM);
		});
		it('should delete instance', function () {
			if (!pitchYinProbabilitiesHMMInstance) this.skip();
			pitchYinProbabilitiesHMMInstance.delete();
		});
	});

	describe('PitchYinProbabilitiesHMM:functionality', () => {
		let pitchYinProbabilitiesHMMInstance;
		let PitchYinProbabilitiesHMMValidInput;
		let PitchYinProbabilitiesHMMValidInputVector;

		before(() => {
			pitchYinProbabilitiesHMMInstance = new PitchYinProbabilitiesHMM();
			PitchYinProbabilitiesHMMValidInput = Array(1028).fill(0).map( _ => Math.random() );
			PitchYinProbabilitiesHMMValidInputVector = arrayToVector(PitchYinProbabilitiesHMMValidInput)
		});
		after(() => {
			pitchYinProbabilitiesHMMInstance.delete();
			PitchYinProbabilitiesHMMValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				pitchYinProbabilitiesHMMInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = pitchYinProbabilitiesHMMInstance.compute(PitchYinProbabilitiesHMMValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('pitch');
		});
	});
	



	describe('PowerMean:instantiation', () => {
		let powerMeanInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			powerMeanInstance = new PowerMean();
			expect(powerMeanInstance).to.be.instanceOf(PowerMean);
		});
		it('should delete instance', function () {
			if (!powerMeanInstance) this.skip();
			powerMeanInstance.delete();
		});
	});

	describe('PowerMean:functionality', () => {
		let powerMeanInstance;
		let PowerMeanValidInput;
		let PowerMeanValidInputVector;

		before(() => {
			powerMeanInstance = new PowerMean();
			PowerMeanValidInput = Array(1028).fill(0).map( _ => Math.random() );
			PowerMeanValidInputVector = arrayToVector(PowerMeanValidInput)
		});
		after(() => {
			powerMeanInstance.delete();
			PowerMeanValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				powerMeanInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = powerMeanInstance.compute(PowerMeanValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('powerMean');
		});
	});
	



	describe('PowerSpectrum:instantiation', () => {
		let powerSpectrumInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			powerSpectrumInstance = new PowerSpectrum();
			expect(powerSpectrumInstance).to.be.instanceOf(PowerSpectrum);
		});
		it('should delete instance', function () {
			if (!powerSpectrumInstance) this.skip();
			powerSpectrumInstance.delete();
		});
	});

	describe('PowerSpectrum:functionality', () => {
		let powerSpectrumInstance;
		let PowerSpectrumValidInput;
		let PowerSpectrumValidInputVector;

		before(() => {
			powerSpectrumInstance = new PowerSpectrum();
			PowerSpectrumValidInput = Array(1028).fill(0).map( _ => Math.random() );
			PowerSpectrumValidInputVector = arrayToVector(PowerSpectrumValidInput)
		});
		after(() => {
			powerSpectrumInstance.delete();
			PowerSpectrumValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				powerSpectrumInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = powerSpectrumInstance.compute(PowerSpectrumValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('powerSpectrum');
		});
	});
	



	describe('PredominantPitchMelodia:instantiation', () => {
		let predominantPitchMelodiaInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			predominantPitchMelodiaInstance = new PredominantPitchMelodia();
			expect(predominantPitchMelodiaInstance).to.be.instanceOf(PredominantPitchMelodia);
		});
		it('should delete instance', function () {
			if (!predominantPitchMelodiaInstance) this.skip();
			predominantPitchMelodiaInstance.delete();
		});
	});

	describe('PredominantPitchMelodia:functionality', () => {
		let predominantPitchMelodiaInstance;
		let PredominantPitchMelodiaValidInput;
		let PredominantPitchMelodiaValidInputVector;

		before(() => {
			predominantPitchMelodiaInstance = new PredominantPitchMelodia();
			PredominantPitchMelodiaValidInput = Array(2048).fill(0).map( _ => Math.random() );
			PredominantPitchMelodiaValidInputVector = arrayToVector(PredominantPitchMelodiaValidInput)
		});
		after(() => {
			predominantPitchMelodiaInstance.delete();
			PredominantPitchMelodiaValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				predominantPitchMelodiaInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = predominantPitchMelodiaInstance.compute(PredominantPitchMelodiaValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('pitch');
expect(result).to.have.property('pitchConfidence');
		});
	});
	



	describe('RMS:instantiation', () => {
		let rMSInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			rMSInstance = new RMS();
			expect(rMSInstance).to.be.instanceOf(RMS);
		});
		it('should delete instance', function () {
			if (!rMSInstance) this.skip();
			rMSInstance.delete();
		});
	});

	describe('RMS:functionality', () => {
		let rMSInstance;
		let RMSValidInput;
		let RMSValidInputVector;

		before(() => {
			rMSInstance = new RMS();
			RMSValidInput = Array(1028).fill(0).map( _ => Math.random() );
			RMSValidInputVector = arrayToVector(RMSValidInput)
		});
		after(() => {
			rMSInstance.delete();
			RMSValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				rMSInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = rMSInstance.compute(RMSValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('rms');
		});
	});
	



	describe('RawMoments:instantiation', () => {
		let rawMomentsInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			rawMomentsInstance = new RawMoments();
			expect(rawMomentsInstance).to.be.instanceOf(RawMoments);
		});
		it('should delete instance', function () {
			if (!rawMomentsInstance) this.skip();
			rawMomentsInstance.delete();
		});
	});

	describe('RawMoments:functionality', () => {
		let rawMomentsInstance;
		let RawMomentsValidInput;
		let RawMomentsValidInputVector;

		before(() => {
			rawMomentsInstance = new RawMoments();
			RawMomentsValidInput = Array(1028).fill(0).map( _ => Math.random() );
			RawMomentsValidInputVector = arrayToVector(RawMomentsValidInput)
		});
		after(() => {
			rawMomentsInstance.delete();
			RawMomentsValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				rawMomentsInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = rawMomentsInstance.compute(RawMomentsValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('rawMoments');
		});
	});
	



	describe('ReplayGain:instantiation', () => {
		let replayGainInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			replayGainInstance = new ReplayGain();
			expect(replayGainInstance).to.be.instanceOf(ReplayGain);
		});
		it('should delete instance', function () {
			if (!replayGainInstance) this.skip();
			replayGainInstance.delete();
		});
	});

	describe('ReplayGain:functionality', () => {
		let replayGainInstance;
		let ReplayGainValidInput;
		let ReplayGainValidInputVector;

		before(() => {
			replayGainInstance = new ReplayGain();
			ReplayGainValidInput = Array(1028).fill(0).map( _ => Math.random() );
			ReplayGainValidInputVector = arrayToVector(ReplayGainValidInput)
		});
		after(() => {
			replayGainInstance.delete();
			ReplayGainValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				replayGainInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = replayGainInstance.compute(ReplayGainValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('replayGain');
		});
	});
	



	describe('Resample:instantiation', () => {
		let resampleInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			resampleInstance = new Resample();
			expect(resampleInstance).to.be.instanceOf(Resample);
		});
		it('should delete instance', function () {
			if (!resampleInstance) this.skip();
			resampleInstance.delete();
		});
	});

	describe('Resample:functionality', () => {
		let resampleInstance;
		let ResampleValidInput;
		let ResampleValidInputVector;

		before(() => {
			resampleInstance = new Resample();
			ResampleValidInput = Array(1028).fill(0).map( _ => Math.random() );
			ResampleValidInputVector = arrayToVector(ResampleValidInput)
		});
		after(() => {
			resampleInstance.delete();
			ResampleValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				resampleInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = resampleInstance.compute(ResampleValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('ResampleFFT:instantiation', () => {
		let resampleFFTInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			resampleFFTInstance = new ResampleFFT();
			expect(resampleFFTInstance).to.be.instanceOf(ResampleFFT);
		});
		it('should delete instance', function () {
			if (!resampleFFTInstance) this.skip();
			resampleFFTInstance.delete();
		});
	});

	describe('ResampleFFT:functionality', () => {
		let resampleFFTInstance;
		let ResampleFFTValidInput;
		let ResampleFFTValidInputVector;

		before(() => {
			resampleFFTInstance = new ResampleFFT();
			ResampleFFTValidInput = Array(1028).fill(0).map( _ => Math.random() );
			ResampleFFTValidInputVector = arrayToVector(ResampleFFTValidInput)
		});
		after(() => {
			resampleFFTInstance.delete();
			ResampleFFTValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				resampleFFTInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = resampleFFTInstance.compute(ResampleFFTValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('output');
		});
	});
	



	describe('RhythmDescriptors:instantiation', () => {
		let rhythmDescriptorsInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			rhythmDescriptorsInstance = new RhythmDescriptors();
			expect(rhythmDescriptorsInstance).to.be.instanceOf(RhythmDescriptors);
		});
		it('should delete instance', function () {
			if (!rhythmDescriptorsInstance) this.skip();
			rhythmDescriptorsInstance.delete();
		});
	});

	describe('RhythmDescriptors:functionality', () => {
		let rhythmDescriptorsInstance;
		let RhythmDescriptorsValidInput;
		let RhythmDescriptorsValidInputVector;

		before(() => {
			rhythmDescriptorsInstance = new RhythmDescriptors();
			RhythmDescriptorsValidInput = Array(1028).fill(0).map( _ => Math.random() );
			RhythmDescriptorsValidInputVector = arrayToVector(RhythmDescriptorsValidInput)
		});
		after(() => {
			rhythmDescriptorsInstance.delete();
			RhythmDescriptorsValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				rhythmDescriptorsInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = rhythmDescriptorsInstance.compute(RhythmDescriptorsValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('beats_position');
expect(result).to.have.property('confidence');
expect(result).to.have.property('bpm');
expect(result).to.have.property('bpm_estimates');
expect(result).to.have.property('bpm_intervals');
expect(result).to.have.property('first_peak_bpm');
expect(result).to.have.property('first_peak_spread');
expect(result).to.have.property('first_peak_weight');
expect(result).to.have.property('second_peak_bpm');
expect(result).to.have.property('second_peak_spread');
expect(result).to.have.property('second_peak_weight');
expect(result).to.have.property('histogram');
		});
	});
	



	describe('RhythmExtractor:instantiation', () => {
		let rhythmExtractorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			rhythmExtractorInstance = new RhythmExtractor();
			expect(rhythmExtractorInstance).to.be.instanceOf(RhythmExtractor);
		});
		it('should delete instance', function () {
			if (!rhythmExtractorInstance) this.skip();
			rhythmExtractorInstance.delete();
		});
	});

	describe('RhythmExtractor:functionality', () => {
		let rhythmExtractorInstance;
		let RhythmExtractorValidInput;
		let RhythmExtractorValidInputVector;

		before(() => {
			rhythmExtractorInstance = new RhythmExtractor();
			RhythmExtractorValidInput = Array(1024).fill(0).map( _ => Math.random() );
			RhythmExtractorValidInputVector = arrayToVector(RhythmExtractorValidInput)
		});
		after(() => {
			rhythmExtractorInstance.delete();
			RhythmExtractorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				rhythmExtractorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = rhythmExtractorInstance.compute(RhythmExtractorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bpm');
expect(result).to.have.property('ticks');
expect(result).to.have.property('estimates');
expect(result).to.have.property('bpmIntervals');
		});
	});
	



	describe('RhythmExtractor2013:instantiation', () => {
		let rhythmExtractor2013Instance;
		it('should instantiate algorithm and initialize with default params', () => {
			rhythmExtractor2013Instance = new RhythmExtractor2013();
			expect(rhythmExtractor2013Instance).to.be.instanceOf(RhythmExtractor2013);
		});
		it('should delete instance', function () {
			if (!rhythmExtractor2013Instance) this.skip();
			rhythmExtractor2013Instance.delete();
		});
	});

	describe('RhythmExtractor2013:functionality', () => {
		let rhythmExtractor2013Instance;
		let RhythmExtractor2013ValidInput;
		let RhythmExtractor2013ValidInputVector;

		before(() => {
			rhythmExtractor2013Instance = new RhythmExtractor2013();
			RhythmExtractor2013ValidInput = Array(1028).fill(0).map( _ => Math.random() );
			RhythmExtractor2013ValidInputVector = arrayToVector(RhythmExtractor2013ValidInput)
		});
		after(() => {
			rhythmExtractor2013Instance.delete();
			RhythmExtractor2013ValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				rhythmExtractor2013Instance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = rhythmExtractor2013Instance.compute(RhythmExtractor2013ValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bpm');
expect(result).to.have.property('ticks');
expect(result).to.have.property('confidence');
expect(result).to.have.property('estimates');
expect(result).to.have.property('bpmIntervals');
		});
	});
	



	describe('RhythmTransform:instantiation', () => {
		let rhythmTransformInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			rhythmTransformInstance = new RhythmTransform();
			expect(rhythmTransformInstance).to.be.instanceOf(RhythmTransform);
		});
		it('should delete instance', function () {
			if (!rhythmTransformInstance) this.skip();
			rhythmTransformInstance.delete();
		});
	});

	describe('RhythmTransform:functionality', () => {
		let rhythmTransformInstance;
		let RhythmTransformValidInput;
		let RhythmTransformValidInputVector;

		before(() => {
			rhythmTransformInstance = new RhythmTransform();
			RhythmTransformValidInput = Array(256).fill(0).map( _ => Math.random() );
			RhythmTransformValidInputVector = arrayToVector(RhythmTransformValidInput)
		});
		after(() => {
			rhythmTransformInstance.delete();
			RhythmTransformValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				rhythmTransformInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = rhythmTransformInstance.compute(RhythmTransformValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('rhythm');
		});
	});
	



	describe('RollOff:instantiation', () => {
		let rollOffInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			rollOffInstance = new RollOff();
			expect(rollOffInstance).to.be.instanceOf(RollOff);
		});
		it('should delete instance', function () {
			if (!rollOffInstance) this.skip();
			rollOffInstance.delete();
		});
	});

	describe('RollOff:functionality', () => {
		let rollOffInstance;
		let RollOffValidInput;
		let RollOffValidInputVector;

		before(() => {
			rollOffInstance = new RollOff();
			RollOffValidInput = Array(1028).fill(0).map( _ => Math.random() );
			RollOffValidInputVector = arrayToVector(RollOffValidInput)
		});
		after(() => {
			rollOffInstance.delete();
			RollOffValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				rollOffInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = rollOffInstance.compute(RollOffValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('rollOff');
		});
	});
	



	describe('SNR:instantiation', () => {
		let sNRInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			sNRInstance = new SNR();
			expect(sNRInstance).to.be.instanceOf(SNR);
		});
		it('should delete instance', function () {
			if (!sNRInstance) this.skip();
			sNRInstance.delete();
		});
	});

	describe('SNR:functionality', () => {
		let sNRInstance;
		let SNRValidInput;
		let SNRValidInputVector;

		before(() => {
			sNRInstance = new SNR();
			SNRValidInput = Array(512).fill(0).map( _ => Math.random() );
			SNRValidInputVector = arrayToVector(SNRValidInput)
		});
		after(() => {
			sNRInstance.delete();
			SNRValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				sNRInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = sNRInstance.compute(SNRValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('instantSNR');
expect(result).to.have.property('averagedSNR');
expect(result).to.have.property('spectralSNR');
		});
	});
	



	describe('SaturationDetector:instantiation', () => {
		let saturationDetectorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			saturationDetectorInstance = new SaturationDetector();
			expect(saturationDetectorInstance).to.be.instanceOf(SaturationDetector);
		});
		it('should delete instance', function () {
			if (!saturationDetectorInstance) this.skip();
			saturationDetectorInstance.delete();
		});
	});

	describe('SaturationDetector:functionality', () => {
		let saturationDetectorInstance;
		let SaturationDetectorValidInput;
		let SaturationDetectorValidInputVector;

		before(() => {
			saturationDetectorInstance = new SaturationDetector();
			SaturationDetectorValidInput = Array(512).fill(0).map( _ => Math.random() );
			SaturationDetectorValidInputVector = arrayToVector(SaturationDetectorValidInput)
		});
		after(() => {
			saturationDetectorInstance.delete();
			SaturationDetectorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				saturationDetectorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = saturationDetectorInstance.compute(SaturationDetectorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('starts');
expect(result).to.have.property('ends');
		});
	});
	



	describe('Scale:instantiation', () => {
		let scaleInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			scaleInstance = new Scale();
			expect(scaleInstance).to.be.instanceOf(Scale);
		});
		it('should delete instance', function () {
			if (!scaleInstance) this.skip();
			scaleInstance.delete();
		});
	});

	describe('Scale:functionality', () => {
		let scaleInstance;
		let ScaleValidInput;
		let ScaleValidInputVector;

		before(() => {
			scaleInstance = new Scale();
			ScaleValidInput = Array(1028).fill(0).map( _ => Math.random() );
			ScaleValidInputVector = arrayToVector(ScaleValidInput)
		});
		after(() => {
			scaleInstance.delete();
			ScaleValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				scaleInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = scaleInstance.compute(ScaleValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('SineSubtraction:instantiation', () => {
		let sineSubtractionInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			sineSubtractionInstance = new SineSubtraction();
			expect(sineSubtractionInstance).to.be.instanceOf(SineSubtraction);
		});
		it('should delete instance', function () {
			if (!sineSubtractionInstance) this.skip();
			sineSubtractionInstance.delete();
		});
	});

	describe('SineSubtraction:functionality', () => {
		let sineSubtractionInstance;
		let SineSubtractionValidInput;
		let SineSubtractionValidInputVector;

		before(() => {
			sineSubtractionInstance = new SineSubtraction();
			SineSubtractionValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SineSubtractionValidInputVector = arrayToVector(SineSubtractionValidInput)
		});
		after(() => {
			sineSubtractionInstance.delete();
			SineSubtractionValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				sineSubtractionInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = sineSubtractionInstance.compute(SineSubtractionValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('frame');
		});
	});
	



	describe('SingleBeatLoudness:instantiation', () => {
		let singleBeatLoudnessInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			singleBeatLoudnessInstance = new SingleBeatLoudness();
			expect(singleBeatLoudnessInstance).to.be.instanceOf(SingleBeatLoudness);
		});
		it('should delete instance', function () {
			if (!singleBeatLoudnessInstance) this.skip();
			singleBeatLoudnessInstance.delete();
		});
	});

	describe('SingleBeatLoudness:functionality', () => {
		let singleBeatLoudnessInstance;
		let SingleBeatLoudnessValidInput;
		let SingleBeatLoudnessValidInputVector;

		before(() => {
			singleBeatLoudnessInstance = new SingleBeatLoudness();
			SingleBeatLoudnessValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SingleBeatLoudnessValidInputVector = arrayToVector(SingleBeatLoudnessValidInput)
		});
		after(() => {
			singleBeatLoudnessInstance.delete();
			SingleBeatLoudnessValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				singleBeatLoudnessInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = singleBeatLoudnessInstance.compute(SingleBeatLoudnessValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('loudness');
expect(result).to.have.property('loudnessBandRatio');
		});
	});
	



	describe('Slicer:instantiation', () => {
		let slicerInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			slicerInstance = new Slicer();
			expect(slicerInstance).to.be.instanceOf(Slicer);
		});
		it('should delete instance', function () {
			if (!slicerInstance) this.skip();
			slicerInstance.delete();
		});
	});

	describe('Slicer:functionality', () => {
		let slicerInstance;
		let SlicerValidInput;
		let SlicerValidInputVector;

		before(() => {
			slicerInstance = new Slicer();
			SlicerValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SlicerValidInputVector = arrayToVector(SlicerValidInput)
		});
		after(() => {
			slicerInstance.delete();
			SlicerValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				slicerInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = slicerInstance.compute(SlicerValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('frame');
		});
	});
	



	describe('SpectralCentroidTime:instantiation', () => {
		let spectralCentroidTimeInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			spectralCentroidTimeInstance = new SpectralCentroidTime();
			expect(spectralCentroidTimeInstance).to.be.instanceOf(SpectralCentroidTime);
		});
		it('should delete instance', function () {
			if (!spectralCentroidTimeInstance) this.skip();
			spectralCentroidTimeInstance.delete();
		});
	});

	describe('SpectralCentroidTime:functionality', () => {
		let spectralCentroidTimeInstance;
		let SpectralCentroidTimeValidInput;
		let SpectralCentroidTimeValidInputVector;

		before(() => {
			spectralCentroidTimeInstance = new SpectralCentroidTime();
			SpectralCentroidTimeValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SpectralCentroidTimeValidInputVector = arrayToVector(SpectralCentroidTimeValidInput)
		});
		after(() => {
			spectralCentroidTimeInstance.delete();
			SpectralCentroidTimeValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				spectralCentroidTimeInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = spectralCentroidTimeInstance.compute(SpectralCentroidTimeValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('centroid');
		});
	});
	



	describe('SpectralComplexity:instantiation', () => {
		let spectralComplexityInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			spectralComplexityInstance = new SpectralComplexity();
			expect(spectralComplexityInstance).to.be.instanceOf(SpectralComplexity);
		});
		it('should delete instance', function () {
			if (!spectralComplexityInstance) this.skip();
			spectralComplexityInstance.delete();
		});
	});

	describe('SpectralComplexity:functionality', () => {
		let spectralComplexityInstance;
		let SpectralComplexityValidInput;
		let SpectralComplexityValidInputVector;

		before(() => {
			spectralComplexityInstance = new SpectralComplexity();
			SpectralComplexityValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SpectralComplexityValidInputVector = arrayToVector(SpectralComplexityValidInput)
		});
		after(() => {
			spectralComplexityInstance.delete();
			SpectralComplexityValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				spectralComplexityInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = spectralComplexityInstance.compute(SpectralComplexityValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('spectralComplexity');
		});
	});
	



	describe('SpectralContrast:instantiation', () => {
		let spectralContrastInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			spectralContrastInstance = new SpectralContrast();
			expect(spectralContrastInstance).to.be.instanceOf(SpectralContrast);
		});
		it('should delete instance', function () {
			if (!spectralContrastInstance) this.skip();
			spectralContrastInstance.delete();
		});
	});

	describe('SpectralContrast:functionality', () => {
		let spectralContrastInstance;
		let SpectralContrastValidInput;
		let SpectralContrastValidInputVector;

		before(() => {
			spectralContrastInstance = new SpectralContrast();
			SpectralContrastValidInput = Array(2048).fill(0).map( _ => Math.random() );
			SpectralContrastValidInputVector = arrayToVector(SpectralContrastValidInput)
		});
		after(() => {
			spectralContrastInstance.delete();
			SpectralContrastValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				spectralContrastInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = spectralContrastInstance.compute(SpectralContrastValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('spectralContrast');
expect(result).to.have.property('spectralValley');
		});
	});
	



	describe('SpectralPeaks:instantiation', () => {
		let spectralPeaksInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			spectralPeaksInstance = new SpectralPeaks();
			expect(spectralPeaksInstance).to.be.instanceOf(SpectralPeaks);
		});
		it('should delete instance', function () {
			if (!spectralPeaksInstance) this.skip();
			spectralPeaksInstance.delete();
		});
	});

	describe('SpectralPeaks:functionality', () => {
		let spectralPeaksInstance;
		let SpectralPeaksValidInput;
		let SpectralPeaksValidInputVector;

		before(() => {
			spectralPeaksInstance = new SpectralPeaks();
			SpectralPeaksValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SpectralPeaksValidInputVector = arrayToVector(SpectralPeaksValidInput)
		});
		after(() => {
			spectralPeaksInstance.delete();
			SpectralPeaksValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				spectralPeaksInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = spectralPeaksInstance.compute(SpectralPeaksValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('frequencies');
expect(result).to.have.property('magnitudes');
		});
	});
	



	describe('SpectralWhitening:instantiation', () => {
		let spectralWhiteningInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			spectralWhiteningInstance = new SpectralWhitening();
			expect(spectralWhiteningInstance).to.be.instanceOf(SpectralWhitening);
		});
		it('should delete instance', function () {
			if (!spectralWhiteningInstance) this.skip();
			spectralWhiteningInstance.delete();
		});
	});

	describe('SpectralWhitening:functionality', () => {
		let spectralWhiteningInstance;
		let SpectralWhiteningValidInput;
		let SpectralWhiteningValidInputVector;

		before(() => {
			spectralWhiteningInstance = new SpectralWhitening();
			SpectralWhiteningValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SpectralWhiteningValidInputVector = arrayToVector(SpectralWhiteningValidInput)
		});
		after(() => {
			spectralWhiteningInstance.delete();
			SpectralWhiteningValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				spectralWhiteningInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = spectralWhiteningInstance.compute(SpectralWhiteningValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('magnitudes');
		});
	});
	



	describe('Spectrum:instantiation', () => {
		let spectrumInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			spectrumInstance = new Spectrum();
			expect(spectrumInstance).to.be.instanceOf(Spectrum);
		});
		it('should delete instance', function () {
			if (!spectrumInstance) this.skip();
			spectrumInstance.delete();
		});
	});

	describe('Spectrum:functionality', () => {
		let spectrumInstance;
		let SpectrumValidInput;
		let SpectrumValidInputVector;

		before(() => {
			spectrumInstance = new Spectrum();
			SpectrumValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SpectrumValidInputVector = arrayToVector(SpectrumValidInput)
		});
		after(() => {
			spectrumInstance.delete();
			SpectrumValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				spectrumInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = spectrumInstance.compute(SpectrumValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('spectrum');
		});
	});
	



	describe('SpectrumCQ:instantiation', () => {
		let spectrumCQInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			spectrumCQInstance = new SpectrumCQ();
			expect(spectrumCQInstance).to.be.instanceOf(SpectrumCQ);
		});
		it('should delete instance', function () {
			if (!spectrumCQInstance) this.skip();
			spectrumCQInstance.delete();
		});
	});

	describe('SpectrumCQ:functionality', () => {
		let spectrumCQInstance;
		let SpectrumCQValidInput;
		let SpectrumCQValidInputVector;

		before(() => {
			spectrumCQInstance = new SpectrumCQ();
			SpectrumCQValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SpectrumCQValidInputVector = arrayToVector(SpectrumCQValidInput)
		});
		after(() => {
			spectrumCQInstance.delete();
			SpectrumCQValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				spectrumCQInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = spectrumCQInstance.compute(SpectrumCQValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('spectrumCQ');
		});
	});
	



	describe('SpectrumToCent:instantiation', () => {
		let spectrumToCentInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			spectrumToCentInstance = new SpectrumToCent();
			expect(spectrumToCentInstance).to.be.instanceOf(SpectrumToCent);
		});
		it('should delete instance', function () {
			if (!spectrumToCentInstance) this.skip();
			spectrumToCentInstance.delete();
		});
	});

	describe('SpectrumToCent:functionality', () => {
		let spectrumToCentInstance;
		let SpectrumToCentValidInput;
		let SpectrumToCentValidInputVector;

		before(() => {
			spectrumToCentInstance = new SpectrumToCent();
			SpectrumToCentValidInput = Array(32768).fill(0).map( _ => Math.random() );
			SpectrumToCentValidInputVector = arrayToVector(SpectrumToCentValidInput)
		});
		after(() => {
			spectrumToCentInstance.delete();
			SpectrumToCentValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				spectrumToCentInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = spectrumToCentInstance.compute(SpectrumToCentValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bands');
expect(result).to.have.property('frequencies');
		});
	});
	



	describe('Spline:instantiation', () => {
		let splineInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			splineInstance = new Spline();
			expect(splineInstance).to.be.instanceOf(Spline);
		});
		it('should delete instance', function () {
			if (!splineInstance) this.skip();
			splineInstance.delete();
		});
	});

	describe('Spline:functionality', () => {
		let splineInstance;
		let SplineValidInput;
		let SplineValidInputVector;

		before(() => {
			splineInstance = new Spline();
			SplineValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SplineValidInputVector = arrayToVector(SplineValidInput)
		});
		after(() => {
			splineInstance.delete();
			SplineValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				splineInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = splineInstance.compute(SplineValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('y');
		});
	});
	



	describe('SprModelAnal:instantiation', () => {
		let sprModelAnalInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			sprModelAnalInstance = new SprModelAnal();
			expect(sprModelAnalInstance).to.be.instanceOf(SprModelAnal);
		});
		it('should delete instance', function () {
			if (!sprModelAnalInstance) this.skip();
			sprModelAnalInstance.delete();
		});
	});

	describe('SprModelAnal:functionality', () => {
		let sprModelAnalInstance;
		let SprModelAnalValidInput;
		let SprModelAnalValidInputVector;

		before(() => {
			sprModelAnalInstance = new SprModelAnal();
			SprModelAnalValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SprModelAnalValidInputVector = arrayToVector(SprModelAnalValidInput)
		});
		after(() => {
			sprModelAnalInstance.delete();
			SprModelAnalValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				sprModelAnalInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = sprModelAnalInstance.compute(SprModelAnalValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('frequencies');
expect(result).to.have.property('magnitudes');
expect(result).to.have.property('phases');
expect(result).to.have.property('res');
		});
	});
	



	describe('SprModelSynth:instantiation', () => {
		let sprModelSynthInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			sprModelSynthInstance = new SprModelSynth();
			expect(sprModelSynthInstance).to.be.instanceOf(SprModelSynth);
		});
		it('should delete instance', function () {
			if (!sprModelSynthInstance) this.skip();
			sprModelSynthInstance.delete();
		});
	});

	describe('SprModelSynth:functionality', () => {
		let sprModelSynthInstance;
		let SprModelSynthValidInput;
		let SprModelSynthValidInputVector;

		before(() => {
			sprModelSynthInstance = new SprModelSynth();
			SprModelSynthValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SprModelSynthValidInputVector = arrayToVector(SprModelSynthValidInput)
		});
		after(() => {
			sprModelSynthInstance.delete();
			SprModelSynthValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				sprModelSynthInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = sprModelSynthInstance.compute(SprModelSynthValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('frame');
expect(result).to.have.property('sineframe');
expect(result).to.have.property('resframe');
		});
	});
	



	describe('SpsModelAnal:instantiation', () => {
		let spsModelAnalInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			spsModelAnalInstance = new SpsModelAnal();
			expect(spsModelAnalInstance).to.be.instanceOf(SpsModelAnal);
		});
		it('should delete instance', function () {
			if (!spsModelAnalInstance) this.skip();
			spsModelAnalInstance.delete();
		});
	});

	describe('SpsModelAnal:functionality', () => {
		let spsModelAnalInstance;
		let SpsModelAnalValidInput;
		let SpsModelAnalValidInputVector;

		before(() => {
			spsModelAnalInstance = new SpsModelAnal();
			SpsModelAnalValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SpsModelAnalValidInputVector = arrayToVector(SpsModelAnalValidInput)
		});
		after(() => {
			spsModelAnalInstance.delete();
			SpsModelAnalValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				spsModelAnalInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = spsModelAnalInstance.compute(SpsModelAnalValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('frequencies');
expect(result).to.have.property('magnitudes');
expect(result).to.have.property('phases');
expect(result).to.have.property('stocenv');
		});
	});
	



	describe('SpsModelSynth:instantiation', () => {
		let spsModelSynthInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			spsModelSynthInstance = new SpsModelSynth();
			expect(spsModelSynthInstance).to.be.instanceOf(SpsModelSynth);
		});
		it('should delete instance', function () {
			if (!spsModelSynthInstance) this.skip();
			spsModelSynthInstance.delete();
		});
	});

	describe('SpsModelSynth:functionality', () => {
		let spsModelSynthInstance;
		let SpsModelSynthValidInput;
		let SpsModelSynthValidInputVector;

		before(() => {
			spsModelSynthInstance = new SpsModelSynth();
			SpsModelSynthValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SpsModelSynthValidInputVector = arrayToVector(SpsModelSynthValidInput)
		});
		after(() => {
			spsModelSynthInstance.delete();
			SpsModelSynthValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				spsModelSynthInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = spsModelSynthInstance.compute(SpsModelSynthValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('frame');
expect(result).to.have.property('sineframe');
expect(result).to.have.property('stocframe');
		});
	});
	



	describe('StartStopCut:instantiation', () => {
		let startStopCutInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			startStopCutInstance = new StartStopCut();
			expect(startStopCutInstance).to.be.instanceOf(StartStopCut);
		});
		it('should delete instance', function () {
			if (!startStopCutInstance) this.skip();
			startStopCutInstance.delete();
		});
	});

	describe('StartStopCut:functionality', () => {
		let startStopCutInstance;
		let StartStopCutValidInput;
		let StartStopCutValidInputVector;

		before(() => {
			startStopCutInstance = new StartStopCut();
			StartStopCutValidInput = Array(256).fill(0).map( _ => Math.random() );
			StartStopCutValidInputVector = arrayToVector(StartStopCutValidInput)
		});
		after(() => {
			startStopCutInstance.delete();
			StartStopCutValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				startStopCutInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = startStopCutInstance.compute(StartStopCutValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('startCut');
expect(result).to.have.property('stopCut');
		});
	});
	



	describe('StartStopSilence:instantiation', () => {
		let startStopSilenceInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			startStopSilenceInstance = new StartStopSilence();
			expect(startStopSilenceInstance).to.be.instanceOf(StartStopSilence);
		});
		it('should delete instance', function () {
			if (!startStopSilenceInstance) this.skip();
			startStopSilenceInstance.delete();
		});
	});

	describe('StartStopSilence:functionality', () => {
		let startStopSilenceInstance;
		let StartStopSilenceValidInput;
		let StartStopSilenceValidInputVector;

		before(() => {
			startStopSilenceInstance = new StartStopSilence();
			StartStopSilenceValidInput = Array(1028).fill(0).map( _ => Math.random() );
			StartStopSilenceValidInputVector = arrayToVector(StartStopSilenceValidInput)
		});
		after(() => {
			startStopSilenceInstance.delete();
			StartStopSilenceValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				startStopSilenceInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = startStopSilenceInstance.compute(StartStopSilenceValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('startFrame');
expect(result).to.have.property('stopFrame');
		});
	});
	



	describe('StochasticModelAnal:instantiation', () => {
		let stochasticModelAnalInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			stochasticModelAnalInstance = new StochasticModelAnal();
			expect(stochasticModelAnalInstance).to.be.instanceOf(StochasticModelAnal);
		});
		it('should delete instance', function () {
			if (!stochasticModelAnalInstance) this.skip();
			stochasticModelAnalInstance.delete();
		});
	});

	describe('StochasticModelAnal:functionality', () => {
		let stochasticModelAnalInstance;
		let StochasticModelAnalValidInput;
		let StochasticModelAnalValidInputVector;

		before(() => {
			stochasticModelAnalInstance = new StochasticModelAnal();
			StochasticModelAnalValidInput = Array(1028).fill(0).map( _ => Math.random() );
			StochasticModelAnalValidInputVector = arrayToVector(StochasticModelAnalValidInput)
		});
		after(() => {
			stochasticModelAnalInstance.delete();
			StochasticModelAnalValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				stochasticModelAnalInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = stochasticModelAnalInstance.compute(StochasticModelAnalValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('stocenv');
		});
	});
	



	describe('StochasticModelSynth:instantiation', () => {
		let stochasticModelSynthInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			stochasticModelSynthInstance = new StochasticModelSynth();
			expect(stochasticModelSynthInstance).to.be.instanceOf(StochasticModelSynth);
		});
		it('should delete instance', function () {
			if (!stochasticModelSynthInstance) this.skip();
			stochasticModelSynthInstance.delete();
		});
	});

	describe('StochasticModelSynth:functionality', () => {
		let stochasticModelSynthInstance;
		let StochasticModelSynthValidInput;
		let StochasticModelSynthValidInputVector;

		before(() => {
			stochasticModelSynthInstance = new StochasticModelSynth();
			StochasticModelSynthValidInput = Array(1028).fill(0).map( _ => Math.random() );
			StochasticModelSynthValidInputVector = arrayToVector(StochasticModelSynthValidInput)
		});
		after(() => {
			stochasticModelSynthInstance.delete();
			StochasticModelSynthValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				stochasticModelSynthInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = stochasticModelSynthInstance.compute(StochasticModelSynthValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('frame');
		});
	});
	



	describe('StrongDecay:instantiation', () => {
		let strongDecayInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			strongDecayInstance = new StrongDecay();
			expect(strongDecayInstance).to.be.instanceOf(StrongDecay);
		});
		it('should delete instance', function () {
			if (!strongDecayInstance) this.skip();
			strongDecayInstance.delete();
		});
	});

	describe('StrongDecay:functionality', () => {
		let strongDecayInstance;
		let StrongDecayValidInput;
		let StrongDecayValidInputVector;

		before(() => {
			strongDecayInstance = new StrongDecay();
			StrongDecayValidInput = Array(1028).fill(0).map( _ => Math.random() );
			StrongDecayValidInputVector = arrayToVector(StrongDecayValidInput)
		});
		after(() => {
			strongDecayInstance.delete();
			StrongDecayValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				strongDecayInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = strongDecayInstance.compute(StrongDecayValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('strongDecay');
		});
	});
	



	describe('StrongPeak:instantiation', () => {
		let strongPeakInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			strongPeakInstance = new StrongPeak();
			expect(strongPeakInstance).to.be.instanceOf(StrongPeak);
		});
		it('should delete instance', function () {
			if (!strongPeakInstance) this.skip();
			strongPeakInstance.delete();
		});
	});

	describe('StrongPeak:functionality', () => {
		let strongPeakInstance;
		let StrongPeakValidInput;
		let StrongPeakValidInputVector;

		before(() => {
			strongPeakInstance = new StrongPeak();
			StrongPeakValidInput = Array(1028).fill(0).map( _ => Math.random() );
			StrongPeakValidInputVector = arrayToVector(StrongPeakValidInput)
		});
		after(() => {
			strongPeakInstance.delete();
			StrongPeakValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				strongPeakInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = strongPeakInstance.compute(StrongPeakValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('strongPeak');
		});
	});
	



	describe('SuperFluxExtractor:instantiation', () => {
		let superFluxExtractorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			superFluxExtractorInstance = new SuperFluxExtractor();
			expect(superFluxExtractorInstance).to.be.instanceOf(SuperFluxExtractor);
		});
		it('should delete instance', function () {
			if (!superFluxExtractorInstance) this.skip();
			superFluxExtractorInstance.delete();
		});
	});

	describe('SuperFluxExtractor:functionality', () => {
		let superFluxExtractorInstance;
		let SuperFluxExtractorValidInput;
		let SuperFluxExtractorValidInputVector;

		before(() => {
			superFluxExtractorInstance = new SuperFluxExtractor();
			SuperFluxExtractorValidInput = Array(2048).fill(0).map( _ => Math.random() );
			SuperFluxExtractorValidInputVector = arrayToVector(SuperFluxExtractorValidInput)
		});
		after(() => {
			superFluxExtractorInstance.delete();
			SuperFluxExtractorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				superFluxExtractorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = superFluxExtractorInstance.compute(SuperFluxExtractorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('onsets');
		});
	});
	



	describe('SuperFluxNovelty:instantiation', () => {
		let superFluxNoveltyInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			superFluxNoveltyInstance = new SuperFluxNovelty();
			expect(superFluxNoveltyInstance).to.be.instanceOf(SuperFluxNovelty);
		});
		it('should delete instance', function () {
			if (!superFluxNoveltyInstance) this.skip();
			superFluxNoveltyInstance.delete();
		});
	});

	describe('SuperFluxNovelty:functionality', () => {
		let superFluxNoveltyInstance;
		let SuperFluxNoveltyValidInput;
		let SuperFluxNoveltyValidInputVector;

		before(() => {
			superFluxNoveltyInstance = new SuperFluxNovelty();
			SuperFluxNoveltyValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SuperFluxNoveltyValidInputVector = arrayToVector(SuperFluxNoveltyValidInput)
		});
		after(() => {
			superFluxNoveltyInstance.delete();
			SuperFluxNoveltyValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				superFluxNoveltyInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = superFluxNoveltyInstance.compute(SuperFluxNoveltyValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('differences');
		});
	});
	



	describe('SuperFluxPeaks:instantiation', () => {
		let superFluxPeaksInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			superFluxPeaksInstance = new SuperFluxPeaks();
			expect(superFluxPeaksInstance).to.be.instanceOf(SuperFluxPeaks);
		});
		it('should delete instance', function () {
			if (!superFluxPeaksInstance) this.skip();
			superFluxPeaksInstance.delete();
		});
	});

	describe('SuperFluxPeaks:functionality', () => {
		let superFluxPeaksInstance;
		let SuperFluxPeaksValidInput;
		let SuperFluxPeaksValidInputVector;

		before(() => {
			superFluxPeaksInstance = new SuperFluxPeaks();
			SuperFluxPeaksValidInput = Array(1028).fill(0).map( _ => Math.random() );
			SuperFluxPeaksValidInputVector = arrayToVector(SuperFluxPeaksValidInput)
		});
		after(() => {
			superFluxPeaksInstance.delete();
			SuperFluxPeaksValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				superFluxPeaksInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = superFluxPeaksInstance.compute(SuperFluxPeaksValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('peaks');
		});
	});
	



	describe('TCToTotal:instantiation', () => {
		let tCToTotalInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			tCToTotalInstance = new TCToTotal();
			expect(tCToTotalInstance).to.be.instanceOf(TCToTotal);
		});
		it('should delete instance', function () {
			if (!tCToTotalInstance) this.skip();
			tCToTotalInstance.delete();
		});
	});

	describe('TCToTotal:functionality', () => {
		let tCToTotalInstance;
		let TCToTotalValidInput;
		let TCToTotalValidInputVector;

		before(() => {
			tCToTotalInstance = new TCToTotal();
			TCToTotalValidInput = Array(1028).fill(0).map( _ => Math.random() );
			TCToTotalValidInputVector = arrayToVector(TCToTotalValidInput)
		});
		after(() => {
			tCToTotalInstance.delete();
			TCToTotalValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				tCToTotalInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = tCToTotalInstance.compute(TCToTotalValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('TCToTotal');
		});
	});
	



	describe('TempoScaleBands:instantiation', () => {
		let tempoScaleBandsInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			tempoScaleBandsInstance = new TempoScaleBands();
			expect(tempoScaleBandsInstance).to.be.instanceOf(TempoScaleBands);
		});
		it('should delete instance', function () {
			if (!tempoScaleBandsInstance) this.skip();
			tempoScaleBandsInstance.delete();
		});
	});

	describe('TempoScaleBands:functionality', () => {
		let tempoScaleBandsInstance;
		let TempoScaleBandsValidInput;
		let TempoScaleBandsValidInputVector;

		before(() => {
			tempoScaleBandsInstance = new TempoScaleBands();
			TempoScaleBandsValidInput = Array(1028).fill(0).map( _ => Math.random() );
			TempoScaleBandsValidInputVector = arrayToVector(TempoScaleBandsValidInput)
		});
		after(() => {
			tempoScaleBandsInstance.delete();
			TempoScaleBandsValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				tempoScaleBandsInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = tempoScaleBandsInstance.compute(TempoScaleBandsValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('scaledBands');
expect(result).to.have.property('cumulativeBands');
		});
	});
	



	describe('TempoTap:instantiation', () => {
		let tempoTapInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			tempoTapInstance = new TempoTap();
			expect(tempoTapInstance).to.be.instanceOf(TempoTap);
		});
		it('should delete instance', function () {
			if (!tempoTapInstance) this.skip();
			tempoTapInstance.delete();
		});
	});

	describe('TempoTap:functionality', () => {
		let tempoTapInstance;
		let TempoTapValidInput;
		let TempoTapValidInputVector;

		before(() => {
			tempoTapInstance = new TempoTap();
			TempoTapValidInput = Array(256).fill(0).map( _ => Math.random() );
			TempoTapValidInputVector = arrayToVector(TempoTapValidInput)
		});
		after(() => {
			tempoTapInstance.delete();
			TempoTapValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				tempoTapInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = tempoTapInstance.compute(TempoTapValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('periods');
expect(result).to.have.property('phases');
		});
	});
	



	describe('TempoTapDegara:instantiation', () => {
		let tempoTapDegaraInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			tempoTapDegaraInstance = new TempoTapDegara();
			expect(tempoTapDegaraInstance).to.be.instanceOf(TempoTapDegara);
		});
		it('should delete instance', function () {
			if (!tempoTapDegaraInstance) this.skip();
			tempoTapDegaraInstance.delete();
		});
	});

	describe('TempoTapDegara:functionality', () => {
		let tempoTapDegaraInstance;
		let TempoTapDegaraValidInput;
		let TempoTapDegaraValidInputVector;

		before(() => {
			tempoTapDegaraInstance = new TempoTapDegara();
			TempoTapDegaraValidInput = Array(1028).fill(0).map( _ => Math.random() );
			TempoTapDegaraValidInputVector = arrayToVector(TempoTapDegaraValidInput)
		});
		after(() => {
			tempoTapDegaraInstance.delete();
			TempoTapDegaraValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				tempoTapDegaraInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = tempoTapDegaraInstance.compute(TempoTapDegaraValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('ticks');
		});
	});
	



	describe('TempoTapMaxAgreement:instantiation', () => {
		let tempoTapMaxAgreementInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			tempoTapMaxAgreementInstance = new TempoTapMaxAgreement();
			expect(tempoTapMaxAgreementInstance).to.be.instanceOf(TempoTapMaxAgreement);
		});
		it('should delete instance', function () {
			if (!tempoTapMaxAgreementInstance) this.skip();
			tempoTapMaxAgreementInstance.delete();
		});
	});

	describe('TempoTapMaxAgreement:functionality', () => {
		let tempoTapMaxAgreementInstance;
		let TempoTapMaxAgreementValidInput;
		let TempoTapMaxAgreementValidInputVector;

		before(() => {
			tempoTapMaxAgreementInstance = new TempoTapMaxAgreement();
			TempoTapMaxAgreementValidInput = Array(1028).fill(0).map( _ => Math.random() );
			TempoTapMaxAgreementValidInputVector = arrayToVector(TempoTapMaxAgreementValidInput)
		});
		after(() => {
			tempoTapMaxAgreementInstance.delete();
			TempoTapMaxAgreementValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				tempoTapMaxAgreementInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = tempoTapMaxAgreementInstance.compute(TempoTapMaxAgreementValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('ticks');
expect(result).to.have.property('confidence');
		});
	});
	



	describe('TempoTapTicks:instantiation', () => {
		let tempoTapTicksInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			tempoTapTicksInstance = new TempoTapTicks();
			expect(tempoTapTicksInstance).to.be.instanceOf(TempoTapTicks);
		});
		it('should delete instance', function () {
			if (!tempoTapTicksInstance) this.skip();
			tempoTapTicksInstance.delete();
		});
	});

	describe('TempoTapTicks:functionality', () => {
		let tempoTapTicksInstance;
		let TempoTapTicksValidInput;
		let TempoTapTicksValidInputVector;

		before(() => {
			tempoTapTicksInstance = new TempoTapTicks();
			TempoTapTicksValidInput = Array(1028).fill(0).map( _ => Math.random() );
			TempoTapTicksValidInputVector = arrayToVector(TempoTapTicksValidInput)
		});
		after(() => {
			tempoTapTicksInstance.delete();
			TempoTapTicksValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				tempoTapTicksInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = tempoTapTicksInstance.compute(TempoTapTicksValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('ticks');
expect(result).to.have.property('matchingPeriods');
		});
	});
	



	describe('TensorflowInputFSDSINet:instantiation', () => {
		let tensorflowInputFSDSINetInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			tensorflowInputFSDSINetInstance = new TensorflowInputFSDSINet();
			expect(tensorflowInputFSDSINetInstance).to.be.instanceOf(TensorflowInputFSDSINet);
		});
		it('should delete instance', function () {
			if (!tensorflowInputFSDSINetInstance) this.skip();
			tensorflowInputFSDSINetInstance.delete();
		});
	});

	describe('TensorflowInputFSDSINet:functionality', () => {
		let tensorflowInputFSDSINetInstance;
		let TensorflowInputFSDSINetValidInput;
		let TensorflowInputFSDSINetValidInputVector;

		before(() => {
			tensorflowInputFSDSINetInstance = new TensorflowInputFSDSINet();
			TensorflowInputFSDSINetValidInput = Array(1028).fill(0).map( _ => Math.random() );
			TensorflowInputFSDSINetValidInputVector = arrayToVector(TensorflowInputFSDSINetValidInput)
		});
		after(() => {
			tensorflowInputFSDSINetInstance.delete();
			TensorflowInputFSDSINetValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				tensorflowInputFSDSINetInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = tensorflowInputFSDSINetInstance.compute(TensorflowInputFSDSINetValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bands');
		});
	});
	



	describe('TensorflowInputMusiCNN:instantiation', () => {
		let tensorflowInputMusiCNNInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			tensorflowInputMusiCNNInstance = new TensorflowInputMusiCNN();
			expect(tensorflowInputMusiCNNInstance).to.be.instanceOf(TensorflowInputMusiCNN);
		});
		it('should delete instance', function () {
			if (!tensorflowInputMusiCNNInstance) this.skip();
			tensorflowInputMusiCNNInstance.delete();
		});
	});

	describe('TensorflowInputMusiCNN:functionality', () => {
		let tensorflowInputMusiCNNInstance;
		let TensorflowInputMusiCNNValidInput;
		let TensorflowInputMusiCNNValidInputVector;

		before(() => {
			tensorflowInputMusiCNNInstance = new TensorflowInputMusiCNN();
			TensorflowInputMusiCNNValidInput = Array(1028).fill(0).map( _ => Math.random() );
			TensorflowInputMusiCNNValidInputVector = arrayToVector(TensorflowInputMusiCNNValidInput)
		});
		after(() => {
			tensorflowInputMusiCNNInstance.delete();
			TensorflowInputMusiCNNValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				tensorflowInputMusiCNNInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = tensorflowInputMusiCNNInstance.compute(TensorflowInputMusiCNNValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bands');
		});
	});
	



	describe('TensorflowInputTempoCNN:instantiation', () => {
		let tensorflowInputTempoCNNInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			tensorflowInputTempoCNNInstance = new TensorflowInputTempoCNN();
			expect(tensorflowInputTempoCNNInstance).to.be.instanceOf(TensorflowInputTempoCNN);
		});
		it('should delete instance', function () {
			if (!tensorflowInputTempoCNNInstance) this.skip();
			tensorflowInputTempoCNNInstance.delete();
		});
	});

	describe('TensorflowInputTempoCNN:functionality', () => {
		let tensorflowInputTempoCNNInstance;
		let TensorflowInputTempoCNNValidInput;
		let TensorflowInputTempoCNNValidInputVector;

		before(() => {
			tensorflowInputTempoCNNInstance = new TensorflowInputTempoCNN();
			TensorflowInputTempoCNNValidInput = Array(1028).fill(0).map( _ => Math.random() );
			TensorflowInputTempoCNNValidInputVector = arrayToVector(TensorflowInputTempoCNNValidInput)
		});
		after(() => {
			tensorflowInputTempoCNNInstance.delete();
			TensorflowInputTempoCNNValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				tensorflowInputTempoCNNInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = tensorflowInputTempoCNNInstance.compute(TensorflowInputTempoCNNValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bands');
		});
	});
	



	describe('TensorflowInputVGGish:instantiation', () => {
		let tensorflowInputVGGishInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			tensorflowInputVGGishInstance = new TensorflowInputVGGish();
			expect(tensorflowInputVGGishInstance).to.be.instanceOf(TensorflowInputVGGish);
		});
		it('should delete instance', function () {
			if (!tensorflowInputVGGishInstance) this.skip();
			tensorflowInputVGGishInstance.delete();
		});
	});

	describe('TensorflowInputVGGish:functionality', () => {
		let tensorflowInputVGGishInstance;
		let TensorflowInputVGGishValidInput;
		let TensorflowInputVGGishValidInputVector;

		before(() => {
			tensorflowInputVGGishInstance = new TensorflowInputVGGish();
			TensorflowInputVGGishValidInput = Array(1028).fill(0).map( _ => Math.random() );
			TensorflowInputVGGishValidInputVector = arrayToVector(TensorflowInputVGGishValidInput)
		});
		after(() => {
			tensorflowInputVGGishInstance.delete();
			TensorflowInputVGGishValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				tensorflowInputVGGishInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = tensorflowInputVGGishInstance.compute(TensorflowInputVGGishValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bands');
		});
	});
	



	describe('TonalExtractor:instantiation', () => {
		let tonalExtractorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			tonalExtractorInstance = new TonalExtractor();
			expect(tonalExtractorInstance).to.be.instanceOf(TonalExtractor);
		});
		it('should delete instance', function () {
			if (!tonalExtractorInstance) this.skip();
			tonalExtractorInstance.delete();
		});
	});

	describe('TonalExtractor:functionality', () => {
		let tonalExtractorInstance;
		let TonalExtractorValidInput;
		let TonalExtractorValidInputVector;

		before(() => {
			tonalExtractorInstance = new TonalExtractor();
			TonalExtractorValidInput = Array(4096).fill(0).map( _ => Math.random() );
			TonalExtractorValidInputVector = arrayToVector(TonalExtractorValidInput)
		});
		after(() => {
			tonalExtractorInstance.delete();
			TonalExtractorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				tonalExtractorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = tonalExtractorInstance.compute(TonalExtractorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('chords_changes_rate');
expect(result).to.have.property('chords_histogram');
expect(result).to.have.property('chords_key');
expect(result).to.have.property('chords_number_rate');
expect(result).to.have.property('chords_progression');
expect(result).to.have.property('chords_scale');
expect(result).to.have.property('chords_strength');
expect(result).to.have.property('hpcp');
expect(result).to.have.property('hpcp_highres');
expect(result).to.have.property('key_key');
expect(result).to.have.property('key_scale');
expect(result).to.have.property('key_strength');
		});
	});
	



	describe('TonicIndianArtMusic:instantiation', () => {
		let tonicIndianArtMusicInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			tonicIndianArtMusicInstance = new TonicIndianArtMusic();
			expect(tonicIndianArtMusicInstance).to.be.instanceOf(TonicIndianArtMusic);
		});
		it('should delete instance', function () {
			if (!tonicIndianArtMusicInstance) this.skip();
			tonicIndianArtMusicInstance.delete();
		});
	});

	describe('TonicIndianArtMusic:functionality', () => {
		let tonicIndianArtMusicInstance;
		let TonicIndianArtMusicValidInput;
		let TonicIndianArtMusicValidInputVector;

		before(() => {
			tonicIndianArtMusicInstance = new TonicIndianArtMusic();
			TonicIndianArtMusicValidInput = Array(2048).fill(0).map( _ => Math.random() );
			TonicIndianArtMusicValidInputVector = arrayToVector(TonicIndianArtMusicValidInput)
		});
		after(() => {
			tonicIndianArtMusicInstance.delete();
			TonicIndianArtMusicValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				tonicIndianArtMusicInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = tonicIndianArtMusicInstance.compute(TonicIndianArtMusicValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('tonic');
		});
	});
	



	describe('TriangularBands:instantiation', () => {
		let triangularBandsInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			triangularBandsInstance = new TriangularBands();
			expect(triangularBandsInstance).to.be.instanceOf(TriangularBands);
		});
		it('should delete instance', function () {
			if (!triangularBandsInstance) this.skip();
			triangularBandsInstance.delete();
		});
	});

	describe('TriangularBands:functionality', () => {
		let triangularBandsInstance;
		let TriangularBandsValidInput;
		let TriangularBandsValidInputVector;

		before(() => {
			triangularBandsInstance = new TriangularBands();
			TriangularBandsValidInput = Array(1025).fill(0).map( _ => Math.random() );
			TriangularBandsValidInputVector = arrayToVector(TriangularBandsValidInput)
		});
		after(() => {
			triangularBandsInstance.delete();
			TriangularBandsValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				triangularBandsInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = triangularBandsInstance.compute(TriangularBandsValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bands');
		});
	});
	



	describe('TriangularBarkBands:instantiation', () => {
		let triangularBarkBandsInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			triangularBarkBandsInstance = new TriangularBarkBands();
			expect(triangularBarkBandsInstance).to.be.instanceOf(TriangularBarkBands);
		});
		it('should delete instance', function () {
			if (!triangularBarkBandsInstance) this.skip();
			triangularBarkBandsInstance.delete();
		});
	});

	describe('TriangularBarkBands:functionality', () => {
		let triangularBarkBandsInstance;
		let TriangularBarkBandsValidInput;
		let TriangularBarkBandsValidInputVector;

		before(() => {
			triangularBarkBandsInstance = new TriangularBarkBands();
			TriangularBarkBandsValidInput = Array(1025).fill(0).map( _ => Math.random() );
			TriangularBarkBandsValidInputVector = arrayToVector(TriangularBarkBandsValidInput)
		});
		after(() => {
			triangularBarkBandsInstance.delete();
			TriangularBarkBandsValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				triangularBarkBandsInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = triangularBarkBandsInstance.compute(TriangularBarkBandsValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('bands');
		});
	});
	



	describe('Trimmer:instantiation', () => {
		let trimmerInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			trimmerInstance = new Trimmer();
			expect(trimmerInstance).to.be.instanceOf(Trimmer);
		});
		it('should delete instance', function () {
			if (!trimmerInstance) this.skip();
			trimmerInstance.delete();
		});
	});

	describe('Trimmer:functionality', () => {
		let trimmerInstance;
		let TrimmerValidInput;
		let TrimmerValidInputVector;

		before(() => {
			trimmerInstance = new Trimmer();
			TrimmerValidInput = Array(1028).fill(0).map( _ => Math.random() );
			TrimmerValidInputVector = arrayToVector(TrimmerValidInput)
		});
		after(() => {
			trimmerInstance.delete();
			TrimmerValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				trimmerInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = trimmerInstance.compute(TrimmerValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('signal');
		});
	});
	



	describe('Tristimulus:instantiation', () => {
		let tristimulusInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			tristimulusInstance = new Tristimulus();
			expect(tristimulusInstance).to.be.instanceOf(Tristimulus);
		});
		it('should delete instance', function () {
			if (!tristimulusInstance) this.skip();
			tristimulusInstance.delete();
		});
	});

	describe('Tristimulus:functionality', () => {
		let tristimulusInstance;
		let TristimulusValidInput;
		let TristimulusValidInputVector;

		before(() => {
			tristimulusInstance = new Tristimulus();
			TristimulusValidInput = Array(1028).fill(0).map( _ => Math.random() );
			TristimulusValidInputVector = arrayToVector(TristimulusValidInput)
		});
		after(() => {
			tristimulusInstance.delete();
			TristimulusValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				tristimulusInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = tristimulusInstance.compute(TristimulusValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('tristimulus');
		});
	});
	



	describe('TruePeakDetector:instantiation', () => {
		let truePeakDetectorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			truePeakDetectorInstance = new TruePeakDetector();
			expect(truePeakDetectorInstance).to.be.instanceOf(TruePeakDetector);
		});
		it('should delete instance', function () {
			if (!truePeakDetectorInstance) this.skip();
			truePeakDetectorInstance.delete();
		});
	});

	describe('TruePeakDetector:functionality', () => {
		let truePeakDetectorInstance;
		let TruePeakDetectorValidInput;
		let TruePeakDetectorValidInputVector;

		before(() => {
			truePeakDetectorInstance = new TruePeakDetector();
			TruePeakDetectorValidInput = Array(1028).fill(0).map( _ => Math.random() );
			TruePeakDetectorValidInputVector = arrayToVector(TruePeakDetectorValidInput)
		});
		after(() => {
			truePeakDetectorInstance.delete();
			TruePeakDetectorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				truePeakDetectorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = truePeakDetectorInstance.compute(TruePeakDetectorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('peakLocations');
expect(result).to.have.property('output');
		});
	});
	



	describe('TuningFrequency:instantiation', () => {
		let tuningFrequencyInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			tuningFrequencyInstance = new TuningFrequency();
			expect(tuningFrequencyInstance).to.be.instanceOf(TuningFrequency);
		});
		it('should delete instance', function () {
			if (!tuningFrequencyInstance) this.skip();
			tuningFrequencyInstance.delete();
		});
	});

	describe('TuningFrequency:functionality', () => {
		let tuningFrequencyInstance;
		let TuningFrequencyValidInput;
		let TuningFrequencyValidInputVector;

		before(() => {
			tuningFrequencyInstance = new TuningFrequency();
			TuningFrequencyValidInput = Array(1028).fill(0).map( _ => Math.random() );
			TuningFrequencyValidInputVector = arrayToVector(TuningFrequencyValidInput)
		});
		after(() => {
			tuningFrequencyInstance.delete();
			TuningFrequencyValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				tuningFrequencyInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = tuningFrequencyInstance.compute(TuningFrequencyValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('tuningFrequency');
expect(result).to.have.property('tuningCents');
		});
	});
	



	describe('TuningFrequencyExtractor:instantiation', () => {
		let tuningFrequencyExtractorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			tuningFrequencyExtractorInstance = new TuningFrequencyExtractor();
			expect(tuningFrequencyExtractorInstance).to.be.instanceOf(TuningFrequencyExtractor);
		});
		it('should delete instance', function () {
			if (!tuningFrequencyExtractorInstance) this.skip();
			tuningFrequencyExtractorInstance.delete();
		});
	});

	describe('TuningFrequencyExtractor:functionality', () => {
		let tuningFrequencyExtractorInstance;
		let TuningFrequencyExtractorValidInput;
		let TuningFrequencyExtractorValidInputVector;

		before(() => {
			tuningFrequencyExtractorInstance = new TuningFrequencyExtractor();
			TuningFrequencyExtractorValidInput = Array(4096).fill(0).map( _ => Math.random() );
			TuningFrequencyExtractorValidInputVector = arrayToVector(TuningFrequencyExtractorValidInput)
		});
		after(() => {
			tuningFrequencyExtractorInstance.delete();
			TuningFrequencyExtractorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				tuningFrequencyExtractorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = tuningFrequencyExtractorInstance.compute(TuningFrequencyExtractorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('tuningFrequency');
		});
	});
	



	describe('UnaryOperator:instantiation', () => {
		let unaryOperatorInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			unaryOperatorInstance = new UnaryOperator();
			expect(unaryOperatorInstance).to.be.instanceOf(UnaryOperator);
		});
		it('should delete instance', function () {
			if (!unaryOperatorInstance) this.skip();
			unaryOperatorInstance.delete();
		});
	});

	describe('UnaryOperator:functionality', () => {
		let unaryOperatorInstance;
		let UnaryOperatorValidInput;
		let UnaryOperatorValidInputVector;

		before(() => {
			unaryOperatorInstance = new UnaryOperator();
			UnaryOperatorValidInput = Array(1028).fill(0).map( _ => Math.random() );
			UnaryOperatorValidInputVector = arrayToVector(UnaryOperatorValidInput)
		});
		after(() => {
			unaryOperatorInstance.delete();
			UnaryOperatorValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				unaryOperatorInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = unaryOperatorInstance.compute(UnaryOperatorValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('array');
		});
	});
	



	describe('UnaryOperatorStream:instantiation', () => {
		let unaryOperatorStreamInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			unaryOperatorStreamInstance = new UnaryOperatorStream();
			expect(unaryOperatorStreamInstance).to.be.instanceOf(UnaryOperatorStream);
		});
		it('should delete instance', function () {
			if (!unaryOperatorStreamInstance) this.skip();
			unaryOperatorStreamInstance.delete();
		});
	});

	describe('UnaryOperatorStream:functionality', () => {
		let unaryOperatorStreamInstance;
		let UnaryOperatorStreamValidInput;
		let UnaryOperatorStreamValidInputVector;

		before(() => {
			unaryOperatorStreamInstance = new UnaryOperatorStream();
			UnaryOperatorStreamValidInput = Array(1028).fill(0).map( _ => Math.random() );
			UnaryOperatorStreamValidInputVector = arrayToVector(UnaryOperatorStreamValidInput)
		});
		after(() => {
			unaryOperatorStreamInstance.delete();
			UnaryOperatorStreamValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				unaryOperatorStreamInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = unaryOperatorStreamInstance.compute(UnaryOperatorStreamValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('array');
		});
	});
	



	describe('Variance:instantiation', () => {
		let varianceInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			varianceInstance = new Variance();
			expect(varianceInstance).to.be.instanceOf(Variance);
		});
		it('should delete instance', function () {
			if (!varianceInstance) this.skip();
			varianceInstance.delete();
		});
	});

	describe('Variance:functionality', () => {
		let varianceInstance;
		let VarianceValidInput;
		let VarianceValidInputVector;

		before(() => {
			varianceInstance = new Variance();
			VarianceValidInput = Array(1028).fill(0).map( _ => Math.random() );
			VarianceValidInputVector = arrayToVector(VarianceValidInput)
		});
		after(() => {
			varianceInstance.delete();
			VarianceValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				varianceInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = varianceInstance.compute(VarianceValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('variance');
		});
	});
	



	describe('Vibrato:instantiation', () => {
		let vibratoInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			vibratoInstance = new Vibrato();
			expect(vibratoInstance).to.be.instanceOf(Vibrato);
		});
		it('should delete instance', function () {
			if (!vibratoInstance) this.skip();
			vibratoInstance.delete();
		});
	});

	describe('Vibrato:functionality', () => {
		let vibratoInstance;
		let VibratoValidInput;
		let VibratoValidInputVector;

		before(() => {
			vibratoInstance = new Vibrato();
			VibratoValidInput = Array(1028).fill(0).map( _ => Math.random() );
			VibratoValidInputVector = arrayToVector(VibratoValidInput)
		});
		after(() => {
			vibratoInstance.delete();
			VibratoValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				vibratoInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = vibratoInstance.compute(VibratoValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('vibratoFrequency');
expect(result).to.have.property('vibratoExtend');
		});
	});
	



	describe('WarpedAutoCorrelation:instantiation', () => {
		let warpedAutoCorrelationInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			warpedAutoCorrelationInstance = new WarpedAutoCorrelation();
			expect(warpedAutoCorrelationInstance).to.be.instanceOf(WarpedAutoCorrelation);
		});
		it('should delete instance', function () {
			if (!warpedAutoCorrelationInstance) this.skip();
			warpedAutoCorrelationInstance.delete();
		});
	});

	describe('WarpedAutoCorrelation:functionality', () => {
		let warpedAutoCorrelationInstance;
		let WarpedAutoCorrelationValidInput;
		let WarpedAutoCorrelationValidInputVector;

		before(() => {
			warpedAutoCorrelationInstance = new WarpedAutoCorrelation();
			WarpedAutoCorrelationValidInput = Array(1028).fill(0).map( _ => Math.random() );
			WarpedAutoCorrelationValidInputVector = arrayToVector(WarpedAutoCorrelationValidInput)
		});
		after(() => {
			warpedAutoCorrelationInstance.delete();
			WarpedAutoCorrelationValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				warpedAutoCorrelationInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = warpedAutoCorrelationInstance.compute(WarpedAutoCorrelationValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('warpedAutoCorrelation');
		});
	});
	



	describe('Welch:instantiation', () => {
		let welchInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			welchInstance = new Welch();
			expect(welchInstance).to.be.instanceOf(Welch);
		});
		it('should delete instance', function () {
			if (!welchInstance) this.skip();
			welchInstance.delete();
		});
	});

	describe('Welch:functionality', () => {
		let welchInstance;
		let WelchValidInput;
		let WelchValidInputVector;

		before(() => {
			welchInstance = new Welch();
			WelchValidInput = Array(512).fill(0).map( _ => Math.random() );
			WelchValidInputVector = arrayToVector(WelchValidInput)
		});
		after(() => {
			welchInstance.delete();
			WelchValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				welchInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = welchInstance.compute(WelchValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('psd');
		});
	});
	



	describe('Windowing:instantiation', () => {
		let windowingInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			windowingInstance = new Windowing();
			expect(windowingInstance).to.be.instanceOf(Windowing);
		});
		it('should delete instance', function () {
			if (!windowingInstance) this.skip();
			windowingInstance.delete();
		});
	});

	describe('Windowing:functionality', () => {
		let windowingInstance;
		let WindowingValidInput;
		let WindowingValidInputVector;

		before(() => {
			windowingInstance = new Windowing();
			WindowingValidInput = Array(1028).fill(0).map( _ => Math.random() );
			WindowingValidInputVector = arrayToVector(WindowingValidInput)
		});
		after(() => {
			windowingInstance.delete();
			WindowingValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				windowingInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = windowingInstance.compute(WindowingValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('frame');
		});
	});
	



	describe('ZeroCrossingRate:instantiation', () => {
		let zeroCrossingRateInstance;
		it('should instantiate algorithm and initialize with default params', () => {
			zeroCrossingRateInstance = new ZeroCrossingRate();
			expect(zeroCrossingRateInstance).to.be.instanceOf(ZeroCrossingRate);
		});
		it('should delete instance', function () {
			if (!zeroCrossingRateInstance) this.skip();
			zeroCrossingRateInstance.delete();
		});
	});

	describe('ZeroCrossingRate:functionality', () => {
		let zeroCrossingRateInstance;
		let ZeroCrossingRateValidInput;
		let ZeroCrossingRateValidInputVector;

		before(() => {
			zeroCrossingRateInstance = new ZeroCrossingRate();
			ZeroCrossingRateValidInput = Array(1028).fill(0).map( _ => Math.random() );
			ZeroCrossingRateValidInputVector = arrayToVector(ZeroCrossingRateValidInput)
		});
		after(() => {
			zeroCrossingRateInstance.delete();
			ZeroCrossingRateValidInputVector.delete();
		});

		it('should configure with valid parameters', () => {
			expect(() => {
				zeroCrossingRateInstance.configure({});
			}).to.not.throw();
		});

		// invalid param cases

		
		it('should compute with valid input', () => {
			let result;
			expect(() => {
				result = zeroCrossingRateInstance.compute(ZeroCrossingRateValidInputVector);
			}).to.not.throw();
			// output has expected props
			expect(result).to.have.property('zeroCrossingRate');
		});
	});
	


