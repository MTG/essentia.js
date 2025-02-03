
 
/**
 * Parameter object type accepted by `AllPass` algorithm
 *@type
 * @param {number} [bandwidth=500] the bandwidth of the filter [Hz] (used only for 2nd-order filters)
 * @param {number} [cutoffFrequency=1500] the cutoff frequency for the filter [Hz]
 * @param {number} [order=1] the order of the filter
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsAllPass = {
  bandwidth: number,
  cutoffFrequency: number,
  order: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `AudioOnsetsMarker` algorithm
 *@type
 * @param {any[]} [onsets=[]] the list of onset locations [s]
 * @param {number} [sampleRate=44100] the sampling rate of the output signal [Hz]
 * @param {string} [type=beep] the type of sound to be added on the event
*/
type ParamsAudioOnsetsMarker = {
  onsets: any[],
  sampleRate: number,
  type: string,
};
 
/**
 * Parameter object type accepted by `AutoCorrelation` algorithm
 *@type
 * @param {number} [frequencyDomainCompression=0.5] factor at which FFT magnitude is compressed (only used if 'generalized' is set to true, see [3])
 * @param {boolean} [generalized=false] bool value to indicate whether to compute the 'generalized' autocorrelation as described in [3]
 * @param {string} [normalization=standard] type of normalization to compute: either 'standard' (default) or 'unbiased'
*/
type ParamsAutoCorrelation = {
  frequencyDomainCompression: number,
  generalized: boolean,
  normalization: string,
};
 
/**
 * Parameter object type accepted by `BFCC` algorithm
 *@type
 * @param {number} [dctType=2] the DCT type
 * @param {number} [highFrequencyBound=11000] the upper bound of the frequency range [Hz]
 * @param {number} [inputSize=1025] the size of input spectrum
 * @param {number} [liftering=0] the liftering coefficient. Use '0' to bypass it
 * @param {string} [logType=dbamp] logarithmic compression type. Use 'dbpow' if working with power and 'dbamp' if working with magnitudes
 * @param {number} [lowFrequencyBound=0] the lower bound of the frequency range [Hz]
 * @param {string} [normalize=unit_sum] 'unit_max' makes the vertex of all the triangles equal to 1, 'unit_sum' makes the area of all the triangles equal to 1
 * @param {number} [numberBands=40] the number of bark bands in the filter
 * @param {number} [numberCoefficients=13] the number of output cepstrum coefficients
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {string} [type=power] use magnitude or power spectrum
 * @param {string} [weighting=warping] type of weighting function for determining triangle area
*/
type ParamsBFCC = {
  dctType: number,
  highFrequencyBound: number,
  inputSize: number,
  liftering: number,
  logType: string,
  lowFrequencyBound: number,
  normalize: string,
  numberBands: number,
  numberCoefficients: number,
  sampleRate: number,
  type: string,
  weighting: string,
};
 
/**
 * Parameter object type accepted by `BPF` algorithm
 *@type
 * @param {any[]} [xPoints=[0, 1]] the x-coordinates of the points forming the break-point function (the points must be arranged in ascending order and cannot contain duplicates)
 * @param {any[]} [yPoints=[0, 1]] the y-coordinates of the points forming the break-point function
*/
type ParamsBPF = {
  xPoints: any[],
  yPoints: any[],
};
 
/**
 * Parameter object type accepted by `BandPass` algorithm
 *@type
 * @param {number} [bandwidth=500] the bandwidth of the filter [Hz]
 * @param {number} [cutoffFrequency=1500] the cutoff frequency for the filter [Hz]
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsBandPass = {
  bandwidth: number,
  cutoffFrequency: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `BandReject` algorithm
 *@type
 * @param {number} [bandwidth=500] the bandwidth of the filter [Hz]
 * @param {number} [cutoffFrequency=1500] the cutoff frequency for the filter [Hz]
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsBandReject = {
  bandwidth: number,
  cutoffFrequency: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `BarkBands` algorithm
 *@type
 * @param {number} [numberBands=27] the number of desired barkbands
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsBarkBands = {
  numberBands: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `BeatTrackerDegara` algorithm
 *@type
 * @param {number} [maxTempo=208] the fastest tempo to detect [bpm]
 * @param {number} [minTempo=40] the slowest tempo to detect [bpm]
*/
type ParamsBeatTrackerDegara = {
  maxTempo: number,
  minTempo: number,
};
 
/**
 * Parameter object type accepted by `BeatTrackerMultiFeature` algorithm
 *@type
 * @param {number} [maxTempo=208] the fastest tempo to detect [bpm]
 * @param {number} [minTempo=40] the slowest tempo to detect [bpm]
*/
type ParamsBeatTrackerMultiFeature = {
  maxTempo: number,
  minTempo: number,
};
 
/**
 * Parameter object type accepted by `Beatogram` algorithm
 *@type
 * @param {number} [size=16] number of beats for dynamic filtering
*/
type ParamsBeatogram = {
  size: number,
};
 
/**
 * Parameter object type accepted by `BeatsLoudness` algorithm
 *@type
 * @param {number} [beatDuration=0.05] the duration of the window in which the beat will be restricted [s]
 * @param {number} [beatWindowDuration=0.1] the duration of the window in which to look for the beginning of the beat (centered around the positions in 'beats') [s]
 * @param {any[]} [beats=[]] the list of beat positions (each position is in seconds)
 * @param {any[]} [frequencyBands=[20, 150, 400, 3200, 7000, 22000]] the list of bands to compute energy ratios [Hz
 * @param {number} [sampleRate=44100] the audio sampling rate [Hz]
*/
type ParamsBeatsLoudness = {
  beatDuration: number,
  beatWindowDuration: number,
  beats: any[],
  frequencyBands: any[],
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `BinaryOperator` algorithm
 *@type
 * @param {string} [type=add] the type of the binary operator to apply to the input arrays
*/
type ParamsBinaryOperator = {
  type: string,
};
 
/**
 * Parameter object type accepted by `BinaryOperatorStream` algorithm
 *@type
 * @param {string} [type=add] the type of the binary operator to apply to the input arrays
*/
type ParamsBinaryOperatorStream = {
  type: string,
};
 

 
/**
 * Parameter object type accepted by `BpmRubato` algorithm
 *@type
 * @param {number} [longRegionsPruningTime=20] time for the longest constant tempo region inside a rubato region [s]
 * @param {number} [shortRegionsMergingTime=4] time for the shortest constant tempo region from one tempo region to another [s]
 * @param {number} [tolerance=0.08] minimum tempo deviation to look for
*/
type ParamsBpmRubato = {
  longRegionsPruningTime: number,
  shortRegionsMergingTime: number,
  tolerance: number,
};
 
/**
 * Parameter object type accepted by `CentralMoments` algorithm
 *@type
 * @param {string} [mode=pdf] compute central moments considering array values as a probability density function over array index or as sample points of a distribution
 * @param {number} [range=1] the range of the input array, used for normalizing the results in the 'pdf' mode
*/
type ParamsCentralMoments = {
  mode: string,
  range: number,
};
 
/**
 * Parameter object type accepted by `Centroid` algorithm
 *@type
 * @param {number} [range=1] the range of the input array, used for normalizing the results
*/
type ParamsCentroid = {
  range: number,
};
 

 
/**
 * Parameter object type accepted by `ChordsDetection` algorithm
 *@type
 * @param {number} [hopSize=2048] the hop size with which the input PCPs were computed
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [windowSize=2] the size of the window on which to estimate the chords [s]
*/
type ParamsChordsDetection = {
  hopSize: number,
  sampleRate: number,
  windowSize: number,
};
 
/**
 * Parameter object type accepted by `ChordsDetectionBeats` algorithm
 *@type
 * @param {string} [chromaPick=interbeat_median] method of calculating singleton chroma for interbeat interval
 * @param {number} [hopSize=2048] the hop size with which the input PCPs were computed
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsChordsDetectionBeats = {
  chromaPick: string,
  hopSize: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `ChromaCrossSimilarity` algorithm
 *@type
 * @param {number} [binarizePercentile=0.095] maximum percent of distance values to consider as similar in each row and each column
 * @param {number} [frameStackSize=9] number of input frames to stack together and treat as a feature vector for similarity computation. Choose 'frameStackSize=1' to use the original input frames without stacking
 * @param {number} [frameStackStride=1] stride size to form a stack of frames (e.g., 'frameStackStride'=1 to use consecutive frames; 'frameStackStride'=2 for using every second frame)
 * @param {number} [noti=12] number of circular shifts to be checked for Optimal Transposition Index [1]
 * @param {boolean} [oti=true] whether to transpose the key of the reference song to the query song by Optimal Transposition Index [1]
 * @param {boolean} [otiBinary=false] whether to use the OTI-based chroma binary similarity method [3]
 * @param {boolean} [streaming=false] whether to accumulate the input 'queryFeature' in the euclidean similarity matrix calculation on each compute() method call
*/
type ParamsChromaCrossSimilarity = {
  binarizePercentile: number,
  frameStackSize: number,
  frameStackStride: number,
  noti: number,
  oti: boolean,
  otiBinary: boolean,
  streaming: boolean,
};
 
/**
 * Parameter object type accepted by `Chromagram` algorithm
 *@type
 * @param {number} [binsPerOctave=12] number of bins per octave
 * @param {number} [minFrequency=32.7] minimum frequency [Hz]
 * @param {number} [minimumKernelSize=4] minimum size allowed for frequency kernels
 * @param {string} [normalizeType=unit_max] normalize type
 * @param {number} [numberBins=84] number of frequency bins, starting at minFrequency
 * @param {number} [sampleRate=44100] FFT sampling rate [Hz]
 * @param {number} [scale=1] filters scale. Larger values use longer windows
 * @param {number} [threshold=0.01] bins whose magnitude is below this quantile are discarded
 * @param {string} [windowType=hann] the window type
 * @param {boolean} [zeroPhase=true] a boolean value that enables zero-phase windowing. Input audio frames should be windowed with the same phase mode
*/
type ParamsChromagram = {
  binsPerOctave: number,
  minFrequency: number,
  minimumKernelSize: number,
  normalizeType: string,
  numberBins: number,
  sampleRate: number,
  scale: number,
  threshold: number,
  windowType: string,
  zeroPhase: boolean,
};
 
/**
 * Parameter object type accepted by `ClickDetector` algorithm
 *@type
 * @param {number} [detectionThreshold=30] 'detectionThreshold' the threshold is based on the instant power of the noisy excitation signal plus detectionThreshold dBs
 * @param {number} [frameSize=512] the expected size of the input audio signal (this is an optional parameter to optimize memory allocation)
 * @param {number} [hopSize=256] hop size used for the analysis. This parameter must be set correctly as it cannot be obtained from the input data
 * @param {number} [order=12] scalar giving the number of LPCs to use
 * @param {number} [powerEstimationThreshold=10] the noisy excitation is clipped to 'powerEstimationThreshold' times its median.
 * @param {number} [sampleRate=44100] sample rate used for the analysis
 * @param {number} [silenceThreshold=-50] threshold to skip silent frames
*/
type ParamsClickDetector = {
  detectionThreshold: number,
  frameSize: number,
  hopSize: number,
  order: number,
  powerEstimationThreshold: number,
  sampleRate: number,
  silenceThreshold: number,
};
 
/**
 * Parameter object type accepted by `Clipper` algorithm
 *@type
 * @param {number} [max=1] the maximum value above which the signal will be clipped
 * @param {number} [min=-1] the minimum value below which the signal will be clipped
*/
type ParamsClipper = {
  max: number,
  min: number,
};
 
/**
 * Parameter object type accepted by `CoverSongSimilarity` algorithm
 *@type
 * @param {string} [alignmentType=serra09] choose either one of the given local-alignment constraints for smith-waterman algorithm as described in [2] or [3] respectively.
 * @param {number} [disExtension=0.5] penalty for disruption extension
 * @param {number} [disOnset=0.5] penalty for disruption onset
 * @param {string} [distanceType=asymmetric] choose the type of distance. By default the algorithm outputs a asymmetric distance which is obtained by normalising the maximum score in the alignment score matrix with length of reference song
*/
type ParamsCoverSongSimilarity = {
  alignmentType: string,
  disExtension: number,
  disOnset: number,
  distanceType: string,
};
 

 
/**
 * Parameter object type accepted by `CrossCorrelation` algorithm
 *@type
 * @param {number} [maxLag=1] the maximum lag to be computed between the two vectors
 * @param {number} [minLag=0] the minimum lag to be computed between the two vectors
*/
type ParamsCrossCorrelation = {
  maxLag: number,
  minLag: number,
};
 
/**
 * Parameter object type accepted by `CrossSimilarityMatrix` algorithm
 *@type
 * @param {boolean} [binarize=false] whether to binarize the euclidean cross-similarity matrix
 * @param {number} [binarizePercentile=0.095] maximum percent of distance values to consider as similar in each row and each column
 * @param {number} [frameStackSize=1] number of input frames to stack together and treat as a feature vector for similarity computation. Choose 'frameStackSize=1' to use the original input frames without stacking
 * @param {number} [frameStackStride=1] stride size to form a stack of frames (e.g., 'frameStackStride'=1 to use consecutive frames; 'frameStackStride'=2 for using every second frame)
*/
type ParamsCrossSimilarityMatrix = {
  binarize: boolean,
  binarizePercentile: number,
  frameStackSize: number,
  frameStackStride: number,
};
 
/**
 * Parameter object type accepted by `CubicSpline` algorithm
 *@type
 * @param {number} [leftBoundaryFlag=0] type of boundary condition for the left boundary
 * @param {number} [leftBoundaryValue=0] the value to be used in the left boundary, when leftBoundaryFlag is 1 or 2
 * @param {number} [rightBoundaryFlag=0] type of boundary condition for the right boundary
 * @param {number} [rightBoundaryValue=0] the value to be used in the right boundary, when rightBoundaryFlag is 1 or 2
 * @param {any[]} [xPoints=[0, 1]] the x-coordinates where data is specified (the points must be arranged in ascending order and cannot contain duplicates)
 * @param {any[]} [yPoints=[0, 1]] the y-coordinates to be interpolated (i.e. the known data)
*/
type ParamsCubicSpline = {
  leftBoundaryFlag: number,
  leftBoundaryValue: number,
  rightBoundaryFlag: number,
  rightBoundaryValue: number,
  xPoints: any[],
  yPoints: any[],
};
 
/**
 * Parameter object type accepted by `DCRemoval` algorithm
 *@type
 * @param {number} [cutoffFrequency=40] the cutoff frequency for the filter [Hz]
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsDCRemoval = {
  cutoffFrequency: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `DCT` algorithm
 *@type
 * @param {number} [dctType=2] the DCT type
 * @param {number} [inputSize=10] the size of the input array
 * @param {number} [liftering=0] the liftering coefficient. Use '0' to bypass it
 * @param {number} [outputSize=10] the number of output coefficients
*/
type ParamsDCT = {
  dctType: number,
  inputSize: number,
  liftering: number,
  outputSize: number,
};
 
/**
 * Parameter object type accepted by `Danceability` algorithm
 *@type
 * @param {number} [maxTau=8800] maximum segment length to consider [ms]
 * @param {number} [minTau=310] minimum segment length to consider [ms]
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [tauMultiplier=1.1] multiplier to increment from min to max tau
*/
type ParamsDanceability = {
  maxTau: number,
  minTau: number,
  sampleRate: number,
  tauMultiplier: number,
};
 
/**
 * Parameter object type accepted by `Decrease` algorithm
 *@type
 * @param {number} [range=1] the range of the input array, used for normalizing the results
*/
type ParamsDecrease = {
  range: number,
};
 

 

 
/**
 * Parameter object type accepted by `DiscontinuityDetector` algorithm
 *@type
 * @param {number} [detectionThreshold=8] 'detectionThreshold' times the standard deviation plus the median of the frame is used as detection threshold
 * @param {number} [energyThreshold=-60] threshold in dB to detect silent subframes
 * @param {number} [frameSize=512] the expected size of the input audio signal (this is an optional parameter to optimize memory allocation)
 * @param {number} [hopSize=256] hop size used for the analysis. This parameter must be set correctly as it cannot be obtained from the input data
 * @param {number} [kernelSize=7] scalar giving the size of the median filter window. Must be odd
 * @param {number} [order=3] scalar giving the number of LPCs to use
 * @param {number} [silenceThreshold=-50] threshold to skip silent frames
 * @param {number} [subFrameSize=32] size of the window used to compute silent subframes
*/
type ParamsDiscontinuityDetector = {
  detectionThreshold: number,
  energyThreshold: number,
  frameSize: number,
  hopSize: number,
  kernelSize: number,
  order: number,
  silenceThreshold: number,
  subFrameSize: number,
};
 

 

 
/**
 * Parameter object type accepted by `Duration` algorithm
 *@type
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsDuration = {
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `DynamicComplexity` algorithm
 *@type
 * @param {number} [frameSize=0.2] the frame size [s]
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsDynamicComplexity = {
  frameSize: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `ERBBands` algorithm
 *@type
 * @param {number} [highFrequencyBound=22050] an upper-bound limit for the frequencies to be included in the bands
 * @param {number} [inputSize=1025] the size of the spectrum
 * @param {number} [lowFrequencyBound=50] a lower-bound limit for the frequencies to be included in the bands
 * @param {number} [numberBands=40] the number of output bands
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {string} [type=power] use magnitude or power spectrum
 * @param {number} [width=1] filter width with respect to ERB
*/
type ParamsERBBands = {
  highFrequencyBound: number,
  inputSize: number,
  lowFrequencyBound: number,
  numberBands: number,
  sampleRate: number,
  type: string,
  width: number,
};
 
/**
 * Parameter object type accepted by `EffectiveDuration` algorithm
 *@type
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [thresholdRatio=0.4] the ratio of the envelope maximum to be used as the threshold
*/
type ParamsEffectiveDuration = {
  sampleRate: number,
  thresholdRatio: number,
};
 

 
/**
 * Parameter object type accepted by `EnergyBand` algorithm
 *@type
 * @param {number} [sampleRate=44100] the audio sampling rate [Hz]
 * @param {number} [startCutoffFrequency=0] the start frequency from which to sum the energy [Hz]
 * @param {number} [stopCutoffFrequency=100] the stop frequency to which to sum the energy [Hz]
*/
type ParamsEnergyBand = {
  sampleRate: number,
  startCutoffFrequency: number,
  stopCutoffFrequency: number,
};
 
/**
 * Parameter object type accepted by `EnergyBandRatio` algorithm
 *@type
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [startFrequency=0] the frequency from which to start summing the energy [Hz]
 * @param {number} [stopFrequency=100] the frequency up to which to sum the energy [Hz]
*/
type ParamsEnergyBandRatio = {
  sampleRate: number,
  startFrequency: number,
  stopFrequency: number,
};
 

 
/**
 * Parameter object type accepted by `Envelope` algorithm
 *@type
 * @param {boolean} [applyRectification=true] whether to apply rectification (envelope based on the absolute value of signal)
 * @param {number} [attackTime=10] the attack time of the first order lowpass in the attack phase [ms]
 * @param {number} [releaseTime=1500] the release time of the first order lowpass in the release phase [ms]
 * @param {number} [sampleRate=44100] the audio sampling rate [Hz]
*/
type ParamsEnvelope = {
  applyRectification: boolean,
  attackTime: number,
  releaseTime: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `EqualLoudness` algorithm
 *@type
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsEqualLoudness = {
  sampleRate: number,
};
 

 

 

 
/**
 * Parameter object type accepted by `Flux` algorithm
 *@type
 * @param {boolean} [halfRectify=false] half-rectify the differences in each spectrum bin
 * @param {string} [norm=L2] the norm to use for difference computation
*/
type ParamsFlux = {
  halfRectify: boolean,
  norm: string,
};
 
/**
 * Parameter object type accepted by `FrameCutter` algorithm
 *@type
 * @param {number} [frameSize=1024] the output frame size
 * @param {number} [hopSize=512] the hop size between frames
 * @param {boolean} [lastFrameToEndOfFile=false] whether the beginning of the last frame should reach the end of file. Only applicable if startFromZero is true
 * @param {boolean} [startFromZero=false] whether to start the first frame at time 0 (centered at frameSize/2) if true, or -frameSize/2 otherwise (zero-centered)
 * @param {number} [validFrameThresholdRatio=0] frames smaller than this ratio will be discarded, those larger will be zero-padded to a full frame (i.e. a value of 0 will never discard frames and a value of 1 will only keep frames that are of length 'frameSize')
*/
type ParamsFrameCutter = {
  frameSize: number,
  hopSize: number,
  lastFrameToEndOfFile: boolean,
  startFromZero: boolean,
  validFrameThresholdRatio: number,
};
 
/**
 * Parameter object type accepted by `FrameToReal` algorithm
 *@type
 * @param {number} [frameSize=2048] the frame size for computing the overlap-add process
 * @param {number} [hopSize=128] the hop size with which the overlap-add function is computed
*/
type ParamsFrameToReal = {
  frameSize: number,
  hopSize: number,
};
 
/**
 * Parameter object type accepted by `FrequencyBands` algorithm
 *@type
 * @param {any[]} [frequencyBands=[0, 50, 100, 150, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320, 2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 20500, 27000]] list of frequency ranges in to which the spectrum is divided (these must be in ascending order and connot contain duplicates)
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsFrequencyBands = {
  frequencyBands: any[],
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `GFCC` algorithm
 *@type
 * @param {number} [dctType=2] the DCT type
 * @param {number} [highFrequencyBound=22050] the upper bound of the frequency range [Hz]
 * @param {number} [inputSize=1025] the size of input spectrum
 * @param {string} [logType=dbamp] logarithmic compression type. Use 'dbpow' if working with power and 'dbamp' if working with magnitudes
 * @param {number} [lowFrequencyBound=40] the lower bound of the frequency range [Hz]
 * @param {number} [numberBands=40] the number of bands in the filter
 * @param {number} [numberCoefficients=13] the number of output cepstrum coefficients
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [silenceThreshold=1e-10] silence threshold for computing log-energy bands
 * @param {string} [type=power] use magnitude or power spectrum
*/
type ParamsGFCC = {
  dctType: number,
  highFrequencyBound: number,
  inputSize: number,
  logType: string,
  lowFrequencyBound: number,
  numberBands: number,
  numberCoefficients: number,
  sampleRate: number,
  silenceThreshold: number,
  type: string,
};
 
/**
 * Parameter object type accepted by `GapsDetector` algorithm
 *@type
 * @param {number} [attackTime=0.05] the attack time of the first order lowpass in the attack phase [ms]
 * @param {number} [frameSize=2048] frame size used for the analysis. Should match the input frame size. Otherwise, an exception will be thrown
 * @param {number} [hopSize=1024] hop size used for the analysis
 * @param {number} [kernelSize=11] scalar giving the size of the median filter window. Must be odd
 * @param {number} [maximumTime=3500] time of the maximum gap duration [ms]
 * @param {number} [minimumTime=10] time of the minimum gap duration [ms]
 * @param {number} [postpowerTime=40] time for the postpower calculation [ms]
 * @param {number} [prepowerThreshold=-30] prepower threshold [dB]. 
 * @param {number} [prepowerTime=40] time for the prepower calculation [ms]
 * @param {number} [releaseTime=0.05] the release time of the first order lowpass in the release phase [ms]
 * @param {number} [sampleRate=44100] sample rate used for the analysis
 * @param {number} [silenceThreshold=-50] silence threshold [dB]
*/
type ParamsGapsDetector = {
  attackTime: number,
  frameSize: number,
  hopSize: number,
  kernelSize: number,
  maximumTime: number,
  minimumTime: number,
  postpowerTime: number,
  prepowerThreshold: number,
  prepowerTime: number,
  releaseTime: number,
  sampleRate: number,
  silenceThreshold: number,
};
 

 
/**
 * Parameter object type accepted by `HFC` algorithm
 *@type
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {string} [type=Masri] the type of HFC coefficient to be computed
*/
type ParamsHFC = {
  sampleRate: number,
  type: string,
};
 
/**
 * Parameter object type accepted by `HPCP` algorithm
 *@type
 * @param {boolean} [bandPreset=true] enables whether to use a band preset
 * @param {number} [bandSplitFrequency=500] the split frequency for low and high bands, not used if bandPreset is false [Hz]
 * @param {number} [harmonics=0] number of harmonics for frequency contribution, 0 indicates exclusive fundamental frequency contribution
 * @param {number} [maxFrequency=5000] the maximum frequency that contributes to the HPCP [Hz] (the difference between the max and split frequencies must not be less than 200.0 Hz)
 * @param {boolean} [maxShifted=false] whether to shift the HPCP vector so that the maximum peak is at index 0
 * @param {number} [minFrequency=40] the minimum frequency that contributes to the HPCP [Hz] (the difference between the min and split frequencies must not be less than 200.0 Hz)
 * @param {boolean} [nonLinear=false] apply non-linear post-processing to the output (use with normalized='unitMax'). Boosts values close to 1, decreases values close to 0.
 * @param {string} [normalized=unitMax] whether to normalize the HPCP vector
 * @param {number} [referenceFrequency=440] the reference frequency for semitone index calculation, corresponding to A3 [Hz]
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [size=12] the size of the output HPCP (must be a positive nonzero multiple of 12)
 * @param {string} [weightType=squaredCosine] type of weighting function for determining frequency contribution
 * @param {number} [windowSize=1] the size, in semitones, of the window used for the weighting
*/
type ParamsHPCP = {
  bandPreset: boolean,
  bandSplitFrequency: number,
  harmonics: number,
  maxFrequency: number,
  maxShifted: boolean,
  minFrequency: number,
  nonLinear: boolean,
  normalized: string,
  referenceFrequency: number,
  sampleRate: number,
  size: number,
  weightType: string,
  windowSize: number,
};
 
/**
 * Parameter object type accepted by `HarmonicBpm` algorithm
 *@type
 * @param {number} [bpm=60] the bpm used to find its harmonics
 * @param {number} [threshold=20] bpm threshold below which greatest common divisors are discarded
 * @param {number} [tolerance=5] percentage tolerance to consider two bpms are equal or equal to a harmonic
*/
type ParamsHarmonicBpm = {
  bpm: number,
  threshold: number,
  tolerance: number,
};
 
/**
 * Parameter object type accepted by `HarmonicPeaks` algorithm
 *@type
 * @param {number} [maxHarmonics=20] the number of harmonics to return including F0
 * @param {number} [tolerance=0.2] the allowed ratio deviation from ideal harmonics
*/
type ParamsHarmonicPeaks = {
  maxHarmonics: number,
  tolerance: number,
};
 
/**
 * Parameter object type accepted by `HighPass` algorithm
 *@type
 * @param {number} [cutoffFrequency=1500] the cutoff frequency for the filter [Hz]
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsHighPass = {
  cutoffFrequency: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `HighResolutionFeatures` algorithm
 *@type
 * @param {number} [maxPeaks=24] maximum number of HPCP peaks to consider when calculating outputs
*/
type ParamsHighResolutionFeatures = {
  maxPeaks: number,
};
 
/**
 * Parameter object type accepted by `Histogram` algorithm
 *@type
 * @param {number} [maxValue=1] the max value of the histogram
 * @param {number} [minValue=0] the min value of the histogram
 * @param {string} [normalize=none] the normalization setting.
 * @param {number} [numberBins=10] the number of bins
*/
type ParamsHistogram = {
  maxValue: number,
  minValue: number,
  normalize: string,
  numberBins: number,
};
 
/**
 * Parameter object type accepted by `HprModelAnal` algorithm
 *@type
 * @param {number} [fftSize=2048] the size of the internal FFT size (full spectrum size)
 * @param {number} [freqDevOffset=20] minimum frequency deviation at 0Hz
 * @param {number} [freqDevSlope=0.01] slope increase of minimum frequency deviation
 * @param {number} [harmDevSlope=0.01] slope increase of minimum frequency deviation
 * @param {number} [hopSize=512] the hop size between frames
 * @param {number} [magnitudeThreshold=0] peaks below this given threshold are not outputted
 * @param {number} [maxFrequency=5000] the maximum frequency of the range to evaluate [Hz]
 * @param {number} [maxPeaks=100] the maximum number of returned peaks
 * @param {number} [maxnSines=100] maximum number of sines per frame
 * @param {number} [minFrequency=20] the minimum frequency of the range to evaluate [Hz]
 * @param {number} [nHarmonics=100] maximum number of harmonics per frame
 * @param {string} [orderBy=frequency] the ordering type of the outputted peaks (ascending by frequency or descending by magnitude)
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [stocf=0.2] decimation factor used for the stochastic approximation
*/
type ParamsHprModelAnal = {
  fftSize: number,
  freqDevOffset: number,
  freqDevSlope: number,
  harmDevSlope: number,
  hopSize: number,
  magnitudeThreshold: number,
  maxFrequency: number,
  maxPeaks: number,
  maxnSines: number,
  minFrequency: number,
  nHarmonics: number,
  orderBy: string,
  sampleRate: number,
  stocf: number,
};
 
/**
 * Parameter object type accepted by `HpsModelAnal` algorithm
 *@type
 * @param {number} [fftSize=2048] the size of the internal FFT size (full spectrum size)
 * @param {number} [freqDevOffset=20] minimum frequency deviation at 0Hz
 * @param {number} [freqDevSlope=0.01] slope increase of minimum frequency deviation
 * @param {number} [harmDevSlope=0.01] slope increase of minimum frequency deviation
 * @param {number} [hopSize=512] the hop size between frames
 * @param {number} [magnitudeThreshold=0] peaks below this given threshold are not outputted
 * @param {number} [maxFrequency=5000] the maximum frequency of the range to evaluate [Hz]
 * @param {number} [maxPeaks=100] the maximum number of returned peaks
 * @param {number} [maxnSines=100] maximum number of sines per frame
 * @param {number} [minFrequency=20] the minimum frequency of the range to evaluate [Hz]
 * @param {number} [nHarmonics=100] maximum number of harmonics per frame
 * @param {string} [orderBy=frequency] the ordering type of the outputted peaks (ascending by frequency or descending by magnitude)
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [stocf=0.2] decimation factor used for the stochastic approximation
*/
type ParamsHpsModelAnal = {
  fftSize: number,
  freqDevOffset: number,
  freqDevSlope: number,
  harmDevSlope: number,
  hopSize: number,
  magnitudeThreshold: number,
  maxFrequency: number,
  maxPeaks: number,
  maxnSines: number,
  minFrequency: number,
  nHarmonics: number,
  orderBy: string,
  sampleRate: number,
  stocf: number,
};
 
/**
 * Parameter object type accepted by `IDCT` algorithm
 *@type
 * @param {number} [dctType=2] the DCT type
 * @param {number} [inputSize=10] the size of the input array
 * @param {number} [liftering=0] the liftering coefficient. Use '0' to bypass it
 * @param {number} [outputSize=10] the number of output coefficients
*/
type ParamsIDCT = {
  dctType: number,
  inputSize: number,
  liftering: number,
  outputSize: number,
};
 
/**
 * Parameter object type accepted by `IIR` algorithm
 *@type
 * @param {any[]} [denominator=[1]] the list of coefficients of the denominator. Often referred to as the A coefficient vector.
 * @param {any[]} [numerator=[1]] the list of coefficients of the numerator. Often referred to as the B coefficient vector.
*/
type ParamsIIR = {
  denominator: any[],
  numerator: any[],
};
 

 

 
/**
 * Parameter object type accepted by `Intensity` algorithm
 *@type
 * @param {number} [sampleRate=44100] the input audio sampling rate [Hz]
*/
type ParamsIntensity = {
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `Key` algorithm
 *@type
 * @param {number} [numHarmonics=4] number of harmonics that should contribute to the polyphonic profile (1 only considers the fundamental harmonic)
 * @param {number} [pcpSize=36] number of array elements used to represent a semitone times 12 (this parameter is only a hint, during computation, the size of the input PCP is used instead)
 * @param {string} [profileType=bgate] the type of polyphic profile to use for correlation calculation
 * @param {number} [slope=0.6] value of the slope of the exponential harmonic contribution to the polyphonic profile
 * @param {boolean} [useMajMin=false] use a third profile called 'majmin' for ambiguous tracks [4]. Only avalable for the edma, bgate and braw profiles
 * @param {boolean} [usePolyphony=true] enables the use of polyphonic profiles to define key profiles (this includes the contributions from triads as well as pitch harmonics)
 * @param {boolean} [useThreeChords=true] consider only the 3 main triad chords of the key (T, D, SD) to build the polyphonic profiles
*/
type ParamsKey = {
  numHarmonics: number,
  pcpSize: number,
  profileType: string,
  slope: number,
  useMajMin: boolean,
  usePolyphony: boolean,
  useThreeChords: boolean,
};
 
/**
 * Parameter object type accepted by `KeyExtractor` algorithm
 *@type
 * @param {boolean} [averageDetuningCorrection=true] shifts a pcp to the nearest tempered bin
 * @param {number} [frameSize=4096] the framesize for computing tonal features
 * @param {number} [hopSize=4096] the hopsize for computing tonal features
 * @param {number} [hpcpSize=12] the size of the output HPCP (must be a positive nonzero multiple of 12)
 * @param {number} [maxFrequency=3500] max frequency to apply whitening to [Hz]
 * @param {number} [maximumSpectralPeaks=60] the maximum number of spectral peaks
 * @param {number} [minFrequency=25] min frequency to apply whitening to [Hz]
 * @param {number} [pcpThreshold=0.2] pcp bins below this value are set to 0
 * @param {string} [profileType=bgate] the type of polyphic profile to use for correlation calculation
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [spectralPeaksThreshold=0.0001] the threshold for the spectral peaks
 * @param {number} [tuningFrequency=440] the tuning frequency of the input signal
 * @param {string} [weightType=cosine] type of weighting function for determining frequency contribution
 * @param {string} [windowType=hann] the window type
*/
type ParamsKeyExtractor = {
  averageDetuningCorrection: boolean,
  frameSize: number,
  hopSize: number,
  hpcpSize: number,
  maxFrequency: number,
  maximumSpectralPeaks: number,
  minFrequency: number,
  pcpThreshold: number,
  profileType: string,
  sampleRate: number,
  spectralPeaksThreshold: number,
  tuningFrequency: number,
  weightType: string,
  windowType: string,
};
 
/**
 * Parameter object type accepted by `LPC` algorithm
 *@type
 * @param {number} [order=10] the order of the LPC analysis (typically [8,14])
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {string} [type=regular] the type of LPC (regular or warped)
*/
type ParamsLPC = {
  order: number,
  sampleRate: number,
  type: string,
};
 
/**
 * Parameter object type accepted by `Larm` algorithm
 *@type
 * @param {number} [attackTime=10] the attack time of the first order lowpass in the attack phase [ms]
 * @param {number} [power=1.5] the power used for averaging
 * @param {number} [releaseTime=1500] the release time of the first order lowpass in the release phase [ms]
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsLarm = {
  attackTime: number,
  power: number,
  releaseTime: number,
  sampleRate: number,
};
 

 
/**
 * Parameter object type accepted by `LevelExtractor` algorithm
 *@type
 * @param {number} [frameSize=88200] frame size to compute loudness
 * @param {number} [hopSize=44100] hop size to compute loudness
*/
type ParamsLevelExtractor = {
  frameSize: number,
  hopSize: number,
};
 
/**
 * Parameter object type accepted by `LogAttackTime` algorithm
 *@type
 * @param {number} [sampleRate=44100] the audio sampling rate [Hz]
 * @param {number} [startAttackThreshold=0.2] the percentage of the input signal envelope at which the starting point of the attack is considered
 * @param {number} [stopAttackThreshold=0.9] the percentage of the input signal envelope at which the ending point of the attack is considered
*/
type ParamsLogAttackTime = {
  sampleRate: number,
  startAttackThreshold: number,
  stopAttackThreshold: number,
};
 
/**
 * Parameter object type accepted by `LogSpectrum` algorithm
 *@type
 * @param {number} [binsPerSemitone=3]  bins per semitone
 * @param {number} [frameSize=1025] the input frame size of the spectrum vector
 * @param {number} [nOctave=7] the number of octave of the output vector
 * @param {number} [rollOn=0] this removes low-frequency noise - useful in quiet recordings
 * @param {number} [sampleRate=44100] the input sample rate
*/
type ParamsLogSpectrum = {
  binsPerSemitone: number,
  frameSize: number,
  nOctave: number,
  rollOn: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `LoopBpmConfidence` algorithm
 *@type
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsLoopBpmConfidence = {
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `LoopBpmEstimator` algorithm
 *@type
 * @param {number} [confidenceThreshold=0.95] confidence threshold below which bpm estimate will be considered unreliable
*/
type ParamsLoopBpmEstimator = {
  confidenceThreshold: number,
};
 

 
/**
 * Parameter object type accepted by `LoudnessVickers` algorithm
 *@type
 * @param {number} [sampleRate=44100] the audio sampling rate of the input signal which is used to create the weight vector [Hz] (currently, this algorithm only works on signals with a sampling rate of 44100Hz)
*/
type ParamsLoudnessVickers = {
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `LowLevelSpectralEqloudExtractor` algorithm
 *@type
 * @param {number} [frameSize=2048] the frame size for computing low level features
 * @param {number} [hopSize=1024] the hop size for computing low level features
 * @param {number} [sampleRate=44100] the audio sampling rate
*/
type ParamsLowLevelSpectralEqloudExtractor = {
  frameSize: number,
  hopSize: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `LowLevelSpectralExtractor` algorithm
 *@type
 * @param {number} [frameSize=2048] the frame size for computing low level features
 * @param {number} [hopSize=1024] the hop size for computing low level features
 * @param {number} [sampleRate=44100] the audio sampling rate
*/
type ParamsLowLevelSpectralExtractor = {
  frameSize: number,
  hopSize: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `LowPass` algorithm
 *@type
 * @param {number} [cutoffFrequency=1500] the cutoff frequency for the filter [Hz]
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsLowPass = {
  cutoffFrequency: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `MFCC` algorithm
 *@type
 * @param {number} [dctType=2] the DCT type
 * @param {number} [highFrequencyBound=11000] the upper bound of the frequency range [Hz]
 * @param {number} [inputSize=1025] the size of input spectrum
 * @param {number} [liftering=0] the liftering coefficient. Use '0' to bypass it
 * @param {string} [logType=dbamp] logarithmic compression type. Use 'dbpow' if working with power and 'dbamp' if working with magnitudes
 * @param {number} [lowFrequencyBound=0] the lower bound of the frequency range [Hz]
 * @param {string} [normalize=unit_sum] spectrum bin weights to use for each mel band: 'unit_max' to make each mel band vertex equal to 1, 'unit_sum' to make each mel band area equal to 1 summing the actual weights of spectrum bins, 'unit_area' to make each triangle mel band area equal to 1 normalizing the weights of each triangle by its bandwidth
 * @param {number} [numberBands=40] the number of mel-bands in the filter
 * @param {number} [numberCoefficients=13] the number of output mel coefficients
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [silenceThreshold=1e-10] silence threshold for computing log-energy bands
 * @param {string} [type=power] use magnitude or power spectrum
 * @param {string} [warpingFormula=htkMel] The scale implementation type: 'htkMel' scale from the HTK toolkit [2, 3] (default) or 'slaneyMel' scale from the Auditory toolbox [4]
 * @param {string} [weighting=warping] type of weighting function for determining triangle area
*/
type ParamsMFCC = {
  dctType: number,
  highFrequencyBound: number,
  inputSize: number,
  liftering: number,
  logType: string,
  lowFrequencyBound: number,
  normalize: string,
  numberBands: number,
  numberCoefficients: number,
  sampleRate: number,
  silenceThreshold: number,
  type: string,
  warpingFormula: string,
  weighting: string,
};
 
/**
 * Parameter object type accepted by `MaxFilter` algorithm
 *@type
 * @param {boolean} [causal=true] use casual filter (window is behind current element otherwise it is centered around)
 * @param {number} [width=3] the window size, even size is auto-resized to the next odd value in the non-casual case
*/
type ParamsMaxFilter = {
  causal: boolean,
  width: number,
};
 
/**
 * Parameter object type accepted by `MaxMagFreq` algorithm
 *@type
 * @param {number} [sampleRate=44100] the audio sampling rate [Hz]
*/
type ParamsMaxMagFreq = {
  sampleRate: number,
};
 

 

 

 
/**
 * Parameter object type accepted by `MedianFilter` algorithm
 *@type
 * @param {number} [kernelSize=11] scalar giving the size of the median filter window. Must be odd
*/
type ParamsMedianFilter = {
  kernelSize: number,
};
 
/**
 * Parameter object type accepted by `MelBands` algorithm
 *@type
 * @param {number} [highFrequencyBound=22050] an upper-bound limit for the frequencies to be included in the bands
 * @param {number} [inputSize=1025] the size of the spectrum
 * @param {boolean} [log=false] compute log-energies (log2 (1 + energy))
 * @param {number} [lowFrequencyBound=0] a lower-bound limit for the frequencies to be included in the bands
 * @param {string} [normalize=unit_sum] spectrum bin weights to use for each mel band: 'unit_max' to make each mel band vertex equal to 1, 'unit_sum' to make each mel band area equal to 1 summing the actual weights of spectrum bins, 'unit_area' to make each triangle mel band area equal to 1 normalizing the weights of each triangle by its bandwidth
 * @param {number} [numberBands=24] the number of output bands
 * @param {number} [sampleRate=44100] the sample rate
 * @param {string} [type=power] 'power' to output squared units, 'magnitude' to keep it as the input
 * @param {string} [warpingFormula=htkMel] The scale implementation type: 'htkMel' scale from the HTK toolkit [2, 3] (default) or 'slaneyMel' scale from the Auditory toolbox [4]
 * @param {string} [weighting=warping] type of weighting function for determining triangle area
*/
type ParamsMelBands = {
  highFrequencyBound: number,
  inputSize: number,
  log: boolean,
  lowFrequencyBound: number,
  normalize: string,
  numberBands: number,
  sampleRate: number,
  type: string,
  warpingFormula: string,
  weighting: string,
};
 

 
/**
 * Parameter object type accepted by `MinMax` algorithm
 *@type
 * @param {string} [type=min] the type of the operation
*/
type ParamsMinMax = {
  type: string,
};
 

 
/**
 * Parameter object type accepted by `MovingAverage` algorithm
 *@type
 * @param {number} [size=6] the size of the window [audio samples]
*/
type ParamsMovingAverage = {
  size: number,
};
 
/**
 * Parameter object type accepted by `MultiPitchKlapuri` algorithm
 *@type
 * @param {number} [binResolution=10] salience function bin resolution [cents]
 * @param {number} [frameSize=2048] the frame size for computing pitch saliecnce
 * @param {number} [harmonicWeight=0.8] harmonic weighting parameter (weight decay ratio between two consequent harmonics, =1 for no decay)
 * @param {number} [hopSize=128] the hop size with which the pitch salience function was computed
 * @param {number} [magnitudeCompression=1] magnitude compression parameter for the salience function (=0 for maximum compression, =1 for no compression)
 * @param {number} [magnitudeThreshold=40] spectral peak magnitude threshold (maximum allowed difference from the highest peak in dBs)
 * @param {number} [maxFrequency=1760] the maximum allowed frequency for salience function peaks (ignore peaks above) [Hz]
 * @param {number} [minFrequency=80] the minimum allowed frequency for salience function peaks (ignore peaks below) [Hz]
 * @param {number} [numberHarmonics=10] number of considered harmonics
 * @param {number} [referenceFrequency=55] the reference frequency for Hertz to cent convertion [Hz], corresponding to the 0th cent bin
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsMultiPitchKlapuri = {
  binResolution: number,
  frameSize: number,
  harmonicWeight: number,
  hopSize: number,
  magnitudeCompression: number,
  magnitudeThreshold: number,
  maxFrequency: number,
  minFrequency: number,
  numberHarmonics: number,
  referenceFrequency: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `MultiPitchMelodia` algorithm
 *@type
 * @param {number} [binResolution=10] salience function bin resolution [cents]
 * @param {number} [filterIterations=3] number of iterations for the octave errors / pitch outlier filtering process
 * @param {number} [frameSize=2048] the frame size for computing pitch saliecnce
 * @param {boolean} [guessUnvoiced=false] estimate pitch for non-voiced segments by using non-salient contours when no salient ones are present in a frame
 * @param {number} [harmonicWeight=0.8] harmonic weighting parameter (weight decay ratio between two consequent harmonics, =1 for no decay)
 * @param {number} [hopSize=128] the hop size with which the pitch salience function was computed
 * @param {number} [magnitudeCompression=1] magnitude compression parameter for the salience function (=0 for maximum compression, =1 for no compression)
 * @param {number} [magnitudeThreshold=40] spectral peak magnitude threshold (maximum allowed difference from the highest peak in dBs)
 * @param {number} [maxFrequency=20000] the maximum allowed frequency for salience function peaks (ignore contours with peaks above) [Hz]
 * @param {number} [minDuration=100] the minimum allowed contour duration [ms]
 * @param {number} [minFrequency=40] the minimum allowed frequency for salience function peaks (ignore contours with peaks below) [Hz]
 * @param {number} [numberHarmonics=20] number of considered harmonics
 * @param {number} [peakDistributionThreshold=0.9] allowed deviation below the peak salience mean over all frames (fraction of the standard deviation)
 * @param {number} [peakFrameThreshold=0.9] per-frame salience threshold factor (fraction of the highest peak salience in a frame)
 * @param {number} [pitchContinuity=27.5625] pitch continuity cue (maximum allowed pitch change during 1 ms time period) [cents]
 * @param {number} [referenceFrequency=55] the reference frequency for Hertz to cent convertion [Hz], corresponding to the 0th cent bin
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [timeContinuity=100] time continuity cue (the maximum allowed gap duration for a pitch contour) [ms]
*/
type ParamsMultiPitchMelodia = {
  binResolution: number,
  filterIterations: number,
  frameSize: number,
  guessUnvoiced: boolean,
  harmonicWeight: number,
  hopSize: number,
  magnitudeCompression: number,
  magnitudeThreshold: number,
  maxFrequency: number,
  minDuration: number,
  minFrequency: number,
  numberHarmonics: number,
  peakDistributionThreshold: number,
  peakFrameThreshold: number,
  pitchContinuity: number,
  referenceFrequency: number,
  sampleRate: number,
  timeContinuity: number,
};
 
/**
 * Parameter object type accepted by `Multiplexer` algorithm
 *@type
 * @param {number} [numberRealInputs=0] the number of inputs of type Real to multiplex
 * @param {number} [numberVectorRealInputs=0] the number of inputs of type vector<Real> to multiplex
*/
type ParamsMultiplexer = {
  numberRealInputs: number,
  numberVectorRealInputs: number,
};
 
/**
 * Parameter object type accepted by `NNLSChroma` algorithm
 *@type
 * @param {string} [chromaNormalization=none] determines whether or how the chromagrams are normalised
 * @param {number} [frameSize=1025] the input frame size of the spectrum vector
 * @param {number} [sampleRate=44100] the input sample rate
 * @param {number} [spectralShape=0.7]  the shape of the notes in the NNLS dictionary
 * @param {number} [spectralWhitening=1] determines how much the log-frequency spectrum is whitened
 * @param {string} [tuningMode=global] local uses a local average for tuning, global uses all audio frames. Local tuning is only advisable when the tuning is likely to change over the audio
 * @param {boolean} [useNNLS=true] toggle between NNLS approximate transcription and linear spectral mapping
*/
type ParamsNNLSChroma = {
  chromaNormalization: string,
  frameSize: number,
  sampleRate: number,
  spectralShape: number,
  spectralWhitening: number,
  tuningMode: string,
  useNNLS: boolean,
};
 
/**
 * Parameter object type accepted by `NoiseAdder` algorithm
 *@type
 * @param {boolean} [fixSeed=false] if true, 0 is used as the seed for generating random values
 * @param {number} [level=-100] power level of the noise generator [dB]
*/
type ParamsNoiseAdder = {
  fixSeed: boolean,
  level: number,
};
 
/**
 * Parameter object type accepted by `NoiseBurstDetector` algorithm
 *@type
 * @param {number} [alpha=0.9] alpha coefficient for the Exponential Moving Average threshold estimation.
 * @param {number} [silenceThreshold=-50] threshold to skip silent frames
 * @param {number} [threshold=8] factor to control the dynamic theshold
*/
type ParamsNoiseBurstDetector = {
  alpha: number,
  silenceThreshold: number,
  threshold: number,
};
 
/**
 * Parameter object type accepted by `NoveltyCurve` algorithm
 *@type
 * @param {number} [frameRate=344.531] the sampling rate of the input audio
 * @param {boolean} [normalize=false] whether to normalize each band's energy
 * @param {any[]} [weightCurve=[]] vector containing the weights for each frequency band. Only if weightCurveType==supplied
 * @param {string} [weightCurveType=hybrid] the type of weighting to be used for the bands novelty
*/
type ParamsNoveltyCurve = {
  frameRate: number,
  normalize: boolean,
  weightCurve: any[],
  weightCurveType: string,
};
 
/**
 * Parameter object type accepted by `NoveltyCurveFixedBpmEstimator` algorithm
 *@type
 * @param {number} [hopSize=512] the hopSize used to computeh the novelty curve from the original signal
 * @param {number} [maxBpm=560] the maximum bpm to look for
 * @param {number} [minBpm=30] the minimum bpm to look for
 * @param {number} [sampleRate=44100] the sampling rate original audio signal [Hz]
 * @param {number} [tolerance=3] tolerance (in percentage) for considering bpms to be equal
*/
type ParamsNoveltyCurveFixedBpmEstimator = {
  hopSize: number,
  maxBpm: number,
  minBpm: number,
  sampleRate: number,
  tolerance: number,
};
 

 
/**
 * Parameter object type accepted by `OnsetDetection` algorithm
 *@type
 * @param {string} [method=hfc] the method used for onset detection
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsOnsetDetection = {
  method: string,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `OnsetDetectionGlobal` algorithm
 *@type
 * @param {number} [frameSize=2048] the frame size for computing onset detection function
 * @param {number} [hopSize=512] the hop size for computing onset detection function
 * @param {string} [method=infogain] the method used for onset detection
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsOnsetDetectionGlobal = {
  frameSize: number,
  hopSize: number,
  method: string,
  sampleRate: number,
};
 

 
/**
 * Parameter object type accepted by `OverlapAdd` algorithm
 *@type
 * @param {number} [frameSize=2048] the frame size for computing the overlap-add process
 * @param {number} [gain=1] the normalization gain that scales the output signal. Useful for IFFT output
 * @param {number} [hopSize=128] the hop size with which the overlap-add function is computed
*/
type ParamsOverlapAdd = {
  frameSize: number,
  gain: number,
  hopSize: number,
};
 
/**
 * Parameter object type accepted by `PeakDetection` algorithm
 *@type
 * @param {boolean} [interpolate=true] boolean flag to enable interpolation
 * @param {number} [maxPeaks=100] the maximum number of returned peaks
 * @param {number} [maxPosition=1] the maximum value of the range to evaluate
 * @param {number} [minPeakDistance=0] minimum distance between consecutive peaks (0 to bypass this feature)
 * @param {number} [minPosition=0] the minimum value of the range to evaluate
 * @param {string} [orderBy=position] the ordering type of the output peaks (ascending by position or descending by value)
 * @param {number} [range=1] the input range
 * @param {number} [threshold=-1e+06] peaks below this given threshold are not output
*/
type ParamsPeakDetection = {
  interpolate: boolean,
  maxPeaks: number,
  maxPosition: number,
  minPeakDistance: number,
  minPosition: number,
  orderBy: string,
  range: number,
  threshold: number,
};
 
/**
 * Parameter object type accepted by `PercivalBpmEstimator` algorithm
 *@type
 * @param {number} [frameSize=1024] frame size for the analysis of the input signal
 * @param {number} [frameSizeOSS=2048] frame size for the analysis of the Onset Strength Signal
 * @param {number} [hopSize=128] hop size for the analysis of the input signal
 * @param {number} [hopSizeOSS=128] hop size for the analysis of the Onset Strength Signal
 * @param {number} [maxBPM=210] maximum BPM to detect
 * @param {number} [minBPM=50] minimum BPM to detect
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsPercivalBpmEstimator = {
  frameSize: number,
  frameSizeOSS: number,
  hopSize: number,
  hopSizeOSS: number,
  maxBPM: number,
  minBPM: number,
  sampleRate: number,
};
 

 

 
/**
 * Parameter object type accepted by `PitchContourSegmentation` algorithm
 *@type
 * @param {number} [hopSize=128] hop size of the extracted pitch
 * @param {number} [minDuration=0.1] minimum note duration [s]
 * @param {number} [pitchDistanceThreshold=60] pitch threshold for note segmentation [cents]
 * @param {number} [rmsThreshold=-2] zscore threshold for note segmentation
 * @param {number} [sampleRate=44100] sample rate of the audio signal
 * @param {number} [tuningFrequency=440] tuning reference frequency  [Hz]
*/
type ParamsPitchContourSegmentation = {
  hopSize: number,
  minDuration: number,
  pitchDistanceThreshold: number,
  rmsThreshold: number,
  sampleRate: number,
  tuningFrequency: number,
};
 
/**
 * Parameter object type accepted by `PitchContours` algorithm
 *@type
 * @param {number} [binResolution=10] salience function bin resolution [cents]
 * @param {number} [hopSize=128] the hop size with which the pitch salience function was computed
 * @param {number} [minDuration=100] the minimum allowed contour duration [ms]
 * @param {number} [peakDistributionThreshold=0.9] allowed deviation below the peak salience mean over all frames (fraction of the standard deviation)
 * @param {number} [peakFrameThreshold=0.9] per-frame salience threshold factor (fraction of the highest peak salience in a frame)
 * @param {number} [pitchContinuity=27.5625] pitch continuity cue (maximum allowed pitch change durig 1 ms time period) [cents]
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [timeContinuity=100] time continuity cue (the maximum allowed gap duration for a pitch contour) [ms]
*/
type ParamsPitchContours = {
  binResolution: number,
  hopSize: number,
  minDuration: number,
  peakDistributionThreshold: number,
  peakFrameThreshold: number,
  pitchContinuity: number,
  sampleRate: number,
  timeContinuity: number,
};
 
/**
 * Parameter object type accepted by `PitchContoursMelody` algorithm
 *@type
 * @param {number} [binResolution=10] salience function bin resolution [cents]
 * @param {number} [filterIterations=3] number of interations for the octave errors / pitch outlier filtering process
 * @param {boolean} [guessUnvoiced=false] Estimate pitch for non-voiced segments by using non-salient contours when no salient ones are present in a frame
 * @param {number} [hopSize=128] the hop size with which the pitch salience function was computed
 * @param {number} [maxFrequency=20000] the maximum allowed frequency for salience function peaks (ignore contours with peaks above) [Hz]
 * @param {number} [minFrequency=80] the minimum allowed frequency for salience function peaks (ignore contours with peaks below) [Hz]
 * @param {number} [referenceFrequency=55] the reference frequency for Hertz to cent convertion [Hz], corresponding to the 0th cent bin
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal (Hz)
 * @param {boolean} [voiceVibrato=false] detect voice vibrato
 * @param {number} [voicingTolerance=0.2] allowed deviation below the average contour mean salience of all contours (fraction of the standard deviation)
*/
type ParamsPitchContoursMelody = {
  binResolution: number,
  filterIterations: number,
  guessUnvoiced: boolean,
  hopSize: number,
  maxFrequency: number,
  minFrequency: number,
  referenceFrequency: number,
  sampleRate: number,
  voiceVibrato: boolean,
  voicingTolerance: number,
};
 
/**
 * Parameter object type accepted by `PitchContoursMonoMelody` algorithm
 *@type
 * @param {number} [binResolution=10] salience function bin resolution [cents]
 * @param {number} [filterIterations=3] number of interations for the octave errors / pitch outlier filtering process
 * @param {boolean} [guessUnvoiced=false] Estimate pitch for non-voiced segments by using non-salient contours when no salient ones are present in a frame
 * @param {number} [hopSize=128] the hop size with which the pitch salience function was computed
 * @param {number} [maxFrequency=20000] the maximum allowed frequency for salience function peaks (ignore contours with peaks above) [Hz]
 * @param {number} [minFrequency=80] the minimum allowed frequency for salience function peaks (ignore contours with peaks below) [Hz]
 * @param {number} [referenceFrequency=55] the reference frequency for Hertz to cent convertion [Hz], corresponding to the 0th cent bin
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal (Hz)
*/
type ParamsPitchContoursMonoMelody = {
  binResolution: number,
  filterIterations: number,
  guessUnvoiced: boolean,
  hopSize: number,
  maxFrequency: number,
  minFrequency: number,
  referenceFrequency: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `PitchContoursMultiMelody` algorithm
 *@type
 * @param {number} [binResolution=10] salience function bin resolution [cents]
 * @param {number} [filterIterations=3] number of interations for the octave errors / pitch outlier filtering process
 * @param {boolean} [guessUnvoiced=false] Estimate pitch for non-voiced segments by using non-salient contours when no salient ones are present in a frame
 * @param {number} [hopSize=128] the hop size with which the pitch salience function was computed
 * @param {number} [maxFrequency=20000] the maximum allowed frequency for salience function peaks (ignore contours with peaks above) [Hz]
 * @param {number} [minFrequency=80] the minimum allowed frequency for salience function peaks (ignore contours with peaks below) [Hz]
 * @param {number} [referenceFrequency=55] the reference frequency for Hertz to cent convertion [Hz], corresponding to the 0th cent bin
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal (Hz)
*/
type ParamsPitchContoursMultiMelody = {
  binResolution: number,
  filterIterations: number,
  guessUnvoiced: boolean,
  hopSize: number,
  maxFrequency: number,
  minFrequency: number,
  referenceFrequency: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `PitchFilter` algorithm
 *@type
 * @param {number} [confidenceThreshold=36] ratio between the average confidence of the most confident chunk and the minimum allowed average confidence of a chunk
 * @param {number} [minChunkSize=30] minumum number of frames in non-zero pitch chunks
 * @param {boolean} [useAbsolutePitchConfidence=false] treat negative pitch confidence values as positive (use with melodia guessUnvoiced=True)
*/
type ParamsPitchFilter = {
  confidenceThreshold: number,
  minChunkSize: number,
  useAbsolutePitchConfidence: boolean,
};
 
/**
 * Parameter object type accepted by `PitchMelodia` algorithm
 *@type
 * @param {number} [binResolution=10] salience function bin resolution [cents]
 * @param {number} [filterIterations=3] number of iterations for the octave errors / pitch outlier filtering process
 * @param {number} [frameSize=2048] the frame size for computing pitch saliecnce
 * @param {boolean} [guessUnvoiced=false] estimate pitch for non-voiced segments by using non-salient contours when no salient ones are present in a frame
 * @param {number} [harmonicWeight=0.8] harmonic weighting parameter (weight decay ratio between two consequent harmonics, =1 for no decay)
 * @param {number} [hopSize=128] the hop size with which the pitch salience function was computed
 * @param {number} [magnitudeCompression=1] magnitude compression parameter for the salience function (=0 for maximum compression, =1 for no compression)
 * @param {number} [magnitudeThreshold=40] spectral peak magnitude threshold (maximum allowed difference from the highest peak in dBs)
 * @param {number} [maxFrequency=20000] the maximum allowed frequency for salience function peaks (ignore contours with peaks above) [Hz]
 * @param {number} [minDuration=100] the minimum allowed contour duration [ms]
 * @param {number} [minFrequency=40] the minimum allowed frequency for salience function peaks (ignore contours with peaks below) [Hz]
 * @param {number} [numberHarmonics=20] number of considered harmonics
 * @param {number} [peakDistributionThreshold=0.9] allowed deviation below the peak salience mean over all frames (fraction of the standard deviation)
 * @param {number} [peakFrameThreshold=0.9] per-frame salience threshold factor (fraction of the highest peak salience in a frame)
 * @param {number} [pitchContinuity=27.5625] pitch continuity cue (maximum allowed pitch change during 1 ms time period) [cents]
 * @param {number} [referenceFrequency=55] the reference frequency for Hertz to cent convertion [Hz], corresponding to the 0th cent bin
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [timeContinuity=100] time continuity cue (the maximum allowed gap duration for a pitch contour) [ms]
*/
type ParamsPitchMelodia = {
  binResolution: number,
  filterIterations: number,
  frameSize: number,
  guessUnvoiced: boolean,
  harmonicWeight: number,
  hopSize: number,
  magnitudeCompression: number,
  magnitudeThreshold: number,
  maxFrequency: number,
  minDuration: number,
  minFrequency: number,
  numberHarmonics: number,
  peakDistributionThreshold: number,
  peakFrameThreshold: number,
  pitchContinuity: number,
  referenceFrequency: number,
  sampleRate: number,
  timeContinuity: number,
};
 
/**
 * Parameter object type accepted by `PitchSalience` algorithm
 *@type
 * @param {number} [highBoundary=5000] until which frequency we are looking for the minimum (must be smaller than half sampleRate) [Hz]
 * @param {number} [lowBoundary=100] from which frequency we are looking for the maximum (must not be larger than highBoundary) [Hz]
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsPitchSalience = {
  highBoundary: number,
  lowBoundary: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `PitchSalienceFunction` algorithm
 *@type
 * @param {number} [binResolution=10] salience function bin resolution [cents]
 * @param {number} [harmonicWeight=0.8] harmonic weighting parameter (weight decay ratio between two consequent harmonics, =1 for no decay)
 * @param {number} [magnitudeCompression=1] magnitude compression parameter (=0 for maximum compression, =1 for no compression)
 * @param {number} [magnitudeThreshold=40] peak magnitude threshold (maximum allowed difference from the highest peak in dBs)
 * @param {number} [numberHarmonics=20] number of considered harmonics
 * @param {number} [referenceFrequency=55] the reference frequency for Hertz to cent convertion [Hz], corresponding to the 0th cent bin
*/
type ParamsPitchSalienceFunction = {
  binResolution: number,
  harmonicWeight: number,
  magnitudeCompression: number,
  magnitudeThreshold: number,
  numberHarmonics: number,
  referenceFrequency: number,
};
 
/**
 * Parameter object type accepted by `PitchSalienceFunctionPeaks` algorithm
 *@type
 * @param {number} [binResolution=10] salience function bin resolution [cents]
 * @param {number} [maxFrequency=1760] the maximum frequency to evaluate (ignore peaks above) [Hz]
 * @param {number} [minFrequency=55] the minimum frequency to evaluate (ignore peaks below) [Hz]
 * @param {number} [referenceFrequency=55] the reference frequency for Hertz to cent convertion [Hz], corresponding to the 0th cent bin
*/
type ParamsPitchSalienceFunctionPeaks = {
  binResolution: number,
  maxFrequency: number,
  minFrequency: number,
  referenceFrequency: number,
};
 
/**
 * Parameter object type accepted by `PitchYin` algorithm
 *@type
 * @param {number} [frameSize=2048] number of samples in the input frame (this is an optional parameter to optimize memory allocation)
 * @param {boolean} [interpolate=true] enable interpolation
 * @param {number} [maxFrequency=22050] the maximum allowed frequency [Hz]
 * @param {number} [minFrequency=20] the minimum allowed frequency [Hz]
 * @param {number} [sampleRate=44100] sampling rate of the input audio [Hz]
 * @param {number} [tolerance=0.15] tolerance for peak detection
*/
type ParamsPitchYin = {
  frameSize: number,
  interpolate: boolean,
  maxFrequency: number,
  minFrequency: number,
  sampleRate: number,
  tolerance: number,
};
 
/**
 * Parameter object type accepted by `PitchYinFFT` algorithm
 *@type
 * @param {number} [frameSize=2048] number of samples in the input spectrum
 * @param {boolean} [interpolate=true] boolean flag to enable interpolation
 * @param {number} [maxFrequency=22050] the maximum allowed frequency [Hz]
 * @param {number} [minFrequency=20] the minimum allowed frequency [Hz]
 * @param {number} [sampleRate=44100] sampling rate of the input spectrum [Hz]
 * @param {number} [tolerance=1] tolerance for peak detection
*/
type ParamsPitchYinFFT = {
  frameSize: number,
  interpolate: boolean,
  maxFrequency: number,
  minFrequency: number,
  sampleRate: number,
  tolerance: number,
};
 
/**
 * Parameter object type accepted by `PitchYinProbabilistic` algorithm
 *@type
 * @param {number} [frameSize=2048] the frame size of FFT
 * @param {number} [hopSize=256] the hop size with which the pitch is computed
 * @param {number} [lowRMSThreshold=0.1] the low RMS amplitude threshold
 * @param {string} [outputUnvoiced=negative] whether output unvoiced frame, zero: output non-voiced pitch as 0.; abs: output non-voiced pitch as absolute values; negative: output non-voiced pitch as negative values
 * @param {boolean} [preciseTime=false] use non-standard precise YIN timing (slow).
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsPitchYinProbabilistic = {
  frameSize: number,
  hopSize: number,
  lowRMSThreshold: number,
  outputUnvoiced: string,
  preciseTime: boolean,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `PitchYinProbabilities` algorithm
 *@type
 * @param {number} [frameSize=2048] number of samples in the input frame
 * @param {number} [lowAmp=0.1] the low RMS amplitude threshold
 * @param {boolean} [preciseTime=false] use non-standard precise YIN timing (slow).
 * @param {number} [sampleRate=44100] sampling rate of the input audio [Hz]
*/
type ParamsPitchYinProbabilities = {
  frameSize: number,
  lowAmp: number,
  preciseTime: boolean,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `PitchYinProbabilitiesHMM` algorithm
 *@type
 * @param {number} [minFrequency=61.735] minimum detected frequency
 * @param {number} [numberBinsPerSemitone=5] number of bins per semitone
 * @param {number} [selfTransition=0.99] the self transition probabilities
 * @param {number} [yinTrust=0.5] the yin trust parameter
*/
type ParamsPitchYinProbabilitiesHMM = {
  minFrequency: number,
  numberBinsPerSemitone: number,
  selfTransition: number,
  yinTrust: number,
};
 
/**
 * Parameter object type accepted by `PowerMean` algorithm
 *@type
 * @param {number} [power=1] the power to which to elevate each element before taking the mean
*/
type ParamsPowerMean = {
  power: number,
};
 
/**
 * Parameter object type accepted by `PowerSpectrum` algorithm
 *@type
 * @param {number} [size=2048] the expected size of the input frame (this is purely optional and only targeted at optimizing the creation time of the FFT object)
*/
type ParamsPowerSpectrum = {
  size: number,
};
 
/**
 * Parameter object type accepted by `PredominantPitchMelodia` algorithm
 *@type
 * @param {number} [binResolution=10] salience function bin resolution [cents]
 * @param {number} [filterIterations=3] number of iterations for the octave errors / pitch outlier filtering process
 * @param {number} [frameSize=2048] the frame size for computing pitch salience
 * @param {boolean} [guessUnvoiced=false] estimate pitch for non-voiced segments by using non-salient contours when no salient ones are present in a frame
 * @param {number} [harmonicWeight=0.8] harmonic weighting parameter (weight decay ratio between two consequent harmonics, =1 for no decay)
 * @param {number} [hopSize=128] the hop size with which the pitch salience function was computed
 * @param {number} [magnitudeCompression=1] magnitude compression parameter for the salience function (=0 for maximum compression, =1 for no compression)
 * @param {number} [magnitudeThreshold=40] spectral peak magnitude threshold (maximum allowed difference from the highest peak in dBs)
 * @param {number} [maxFrequency=20000] the maximum allowed frequency for salience function peaks (ignore contours with peaks above) [Hz]
 * @param {number} [minDuration=100] the minimum allowed contour duration [ms]
 * @param {number} [minFrequency=80] the minimum allowed frequency for salience function peaks (ignore contours with peaks below) [Hz]
 * @param {number} [numberHarmonics=20] number of considered harmonics
 * @param {number} [peakDistributionThreshold=0.9] allowed deviation below the peak salience mean over all frames (fraction of the standard deviation)
 * @param {number} [peakFrameThreshold=0.9] per-frame salience threshold factor (fraction of the highest peak salience in a frame)
 * @param {number} [pitchContinuity=27.5625] pitch continuity cue (maximum allowed pitch change during 1 ms time period) [cents]
 * @param {number} [referenceFrequency=55] the reference frequency for Hertz to cent conversion [Hz], corresponding to the 0th cent bin
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [timeContinuity=100] time continuity cue (the maximum allowed gap duration for a pitch contour) [ms]
 * @param {boolean} [voiceVibrato=false] detect voice vibrato
 * @param {number} [voicingTolerance=0.2] allowed deviation below the average contour mean salience of all contours (fraction of the standard deviation)
*/
type ParamsPredominantPitchMelodia = {
  binResolution: number,
  filterIterations: number,
  frameSize: number,
  guessUnvoiced: boolean,
  harmonicWeight: number,
  hopSize: number,
  magnitudeCompression: number,
  magnitudeThreshold: number,
  maxFrequency: number,
  minDuration: number,
  minFrequency: number,
  numberHarmonics: number,
  peakDistributionThreshold: number,
  peakFrameThreshold: number,
  pitchContinuity: number,
  referenceFrequency: number,
  sampleRate: number,
  timeContinuity: number,
  voiceVibrato: boolean,
  voicingTolerance: number,
};
 

 
/**
 * Parameter object type accepted by `RawMoments` algorithm
 *@type
 * @param {number} [range=22050] the range of the input array, used for normalizing the results
*/
type ParamsRawMoments = {
  range: number,
};
 
/**
 * Parameter object type accepted by `ReplayGain` algorithm
 *@type
 * @param {number} [sampleRate=44100] the sampling rate of the input audio signal [Hz]
*/
type ParamsReplayGain = {
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `Resample` algorithm
 *@type
 * @param {number} [inputSampleRate=44100] the sampling rate of the input signal [Hz]
 * @param {number} [outputSampleRate=44100] the sampling rate of the output signal [Hz]
 * @param {number} [quality=1] the quality of the conversion, 0 for best quality, 4 for fast linear approximation
*/
type ParamsResample = {
  inputSampleRate: number,
  outputSampleRate: number,
  quality: number,
};
 
/**
 * Parameter object type accepted by `ResampleFFT` algorithm
 *@type
 * @param {number} [inSize=128] the size of the input sequence. It needs to be even-sized.
 * @param {number} [outSize=128] the size of the output sequence. It needs to be even-sized.
*/
type ParamsResampleFFT = {
  inSize: number,
  outSize: number,
};
 

 
/**
 * Parameter object type accepted by `RhythmExtractor` algorithm
 *@type
 * @param {number} [frameHop=1024] the number of feature frames separating two evaluations
 * @param {number} [frameSize=1024] the number audio samples used to compute a feature
 * @param {number} [hopSize=256] the number of audio samples per features
 * @param {number} [lastBeatInterval=0.1] the minimum interval between last beat and end of file [s]
 * @param {number} [maxTempo=208] the fastest tempo to detect [bpm]
 * @param {number} [minTempo=40] the slowest tempo to detect [bpm]
 * @param {number} [numberFrames=1024] the number of feature frames to buffer on
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {any[]} [tempoHints=[]] the optional list of initial beat locations, to favor the detection of pre-determined tempo period and beats alignment [s]
 * @param {number} [tolerance=0.24] the minimum interval between two consecutive beats [s]
 * @param {boolean} [useBands=true] whether or not to use band energy as periodicity function
 * @param {boolean} [useOnset=true] whether or not to use onsets as periodicity function
*/
type ParamsRhythmExtractor = {
  frameHop: number,
  frameSize: number,
  hopSize: number,
  lastBeatInterval: number,
  maxTempo: number,
  minTempo: number,
  numberFrames: number,
  sampleRate: number,
  tempoHints: any[],
  tolerance: number,
  useBands: boolean,
  useOnset: boolean,
};
 
/**
 * Parameter object type accepted by `RhythmExtractor2013` algorithm
 *@type
 * @param {number} [maxTempo=208] the fastest tempo to detect [bpm]
 * @param {string} [method=multifeature] the method used for beat tracking
 * @param {number} [minTempo=40] the slowest tempo to detect [bpm]
*/
type ParamsRhythmExtractor2013 = {
  maxTempo: number,
  method: string,
  minTempo: number,
};
 
/**
 * Parameter object type accepted by `RhythmTransform` algorithm
 *@type
 * @param {number} [frameSize=256] the frame size to compute the rhythm trasform
 * @param {number} [hopSize=32] the hop size to compute the rhythm transform
*/
type ParamsRhythmTransform = {
  frameSize: number,
  hopSize: number,
};
 
/**
 * Parameter object type accepted by `RollOff` algorithm
 *@type
 * @param {number} [cutoff=0.85] the ratio of total energy to attain before yielding the roll-off frequency
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal (used to normalize rollOff) [Hz]
*/
type ParamsRollOff = {
  cutoff: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `SNR` algorithm
 *@type
 * @param {number} [MAAlpha=0.95] Alpha coefficient for the EMA SNR estimation [2]
 * @param {number} [MMSEAlpha=0.98] Alpha coefficient for the MMSE estimation [1].
 * @param {number} [NoiseAlpha=0.9] Alpha coefficient for the EMA noise estimation [2]
 * @param {number} [frameSize=512] the size of the input frame
 * @param {number} [noiseThreshold=-40] Threshold to detect frames without signal
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {boolean} [useBroadbadNoiseCorrection=true] flag to apply the -10 * log10(BW) broadband noise correction factor
*/
type ParamsSNR = {
  MAAlpha: number,
  MMSEAlpha: number,
  NoiseAlpha: number,
  frameSize: number,
  noiseThreshold: number,
  sampleRate: number,
  useBroadbadNoiseCorrection: boolean,
};
 
/**
 * Parameter object type accepted by `SaturationDetector` algorithm
 *@type
 * @param {number} [differentialThreshold=0.001] minimum difference between contiguous samples of the salturated regions
 * @param {number} [energyThreshold=-1] mininimum energy of the samples in the saturated regions [dB]
 * @param {number} [frameSize=512] expected input frame size
 * @param {number} [hopSize=256] hop size used for the analysis
 * @param {number} [minimumDuration=0.005] minimum duration of the saturated regions [ms]
 * @param {number} [sampleRate=44100] sample rate used for the analysis
*/
type ParamsSaturationDetector = {
  differentialThreshold: number,
  energyThreshold: number,
  frameSize: number,
  hopSize: number,
  minimumDuration: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `Scale` algorithm
 *@type
 * @param {boolean} [clipping=true] boolean flag whether to apply clipping or not
 * @param {number} [factor=10] the multiplication factor by which the audio will be scaled
 * @param {number} [maxAbsValue=1] the maximum value above which to apply clipping
*/
type ParamsScale = {
  clipping: boolean,
  factor: number,
  maxAbsValue: number,
};
 
/**
 * Parameter object type accepted by `SineSubtraction` algorithm
 *@type
 * @param {number} [fftSize=512] the size of the FFT internal process (full spectrum size) and output frame. Minimum twice the hopsize.
 * @param {number} [hopSize=128] the hop size between frames
 * @param {number} [sampleRate=44100] the audio sampling rate [Hz]
*/
type ParamsSineSubtraction = {
  fftSize: number,
  hopSize: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `SingleBeatLoudness` algorithm
 *@type
 * @param {number} [beatDuration=0.05] window size for the beat's energy computation (the window starts at the onset) [s]
 * @param {number} [beatWindowDuration=0.1] window size for the beat's onset detection [s]
 * @param {any[]} [frequencyBands=[0, 200, 400, 800, 1600, 3200, 22000]] frequency bands
 * @param {string} [onsetStart=sumEnergy] criteria for finding the start of the beat
 * @param {number} [sampleRate=44100] the audio sampling rate [Hz]
*/
type ParamsSingleBeatLoudness = {
  beatDuration: number,
  beatWindowDuration: number,
  frequencyBands: any[],
  onsetStart: string,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `Slicer` algorithm
 *@type
 * @param {any[]} [endTimes=[]] the list of end times for the slices you want to extract
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {any[]} [startTimes=[]] the list of start times for the slices you want to extract
 * @param {string} [timeUnits=seconds] the units of time of the start and end times
*/
type ParamsSlicer = {
  endTimes: any[],
  sampleRate: number,
  startTimes: any[],
  timeUnits: string,
};
 
/**
 * Parameter object type accepted by `SpectralCentroidTime` algorithm
 *@type
 * @param {number} [sampleRate=44100] sampling rate of the input spectrum [Hz]
*/
type ParamsSpectralCentroidTime = {
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `SpectralComplexity` algorithm
 *@type
 * @param {number} [magnitudeThreshold=0.005] the minimum spectral-peak magnitude that contributes to spectral complexity
 * @param {number} [sampleRate=44100] the audio sampling rate [Hz]
*/
type ParamsSpectralComplexity = {
  magnitudeThreshold: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `SpectralContrast` algorithm
 *@type
 * @param {number} [frameSize=2048] the size of the fft frames
 * @param {number} [highFrequencyBound=11000] the upper bound of the highest band
 * @param {number} [lowFrequencyBound=20] the lower bound of the lowest band
 * @param {number} [neighbourRatio=0.4] the ratio of the bins in the sub band used to calculate the peak and valley
 * @param {number} [numberBands=6] the number of bands in the filter
 * @param {number} [sampleRate=22050] the sampling rate of the audio signal
 * @param {number} [staticDistribution=0.15] the ratio of the bins to distribute equally
*/
type ParamsSpectralContrast = {
  frameSize: number,
  highFrequencyBound: number,
  lowFrequencyBound: number,
  neighbourRatio: number,
  numberBands: number,
  sampleRate: number,
  staticDistribution: number,
};
 
/**
 * Parameter object type accepted by `SpectralPeaks` algorithm
 *@type
 * @param {number} [magnitudeThreshold=0] peaks below this given threshold are not outputted
 * @param {number} [maxFrequency=5000] the maximum frequency of the range to evaluate [Hz]
 * @param {number} [maxPeaks=100] the maximum number of returned peaks
 * @param {number} [minFrequency=0] the minimum frequency of the range to evaluate [Hz]
 * @param {string} [orderBy=frequency] the ordering type of the outputted peaks (ascending by frequency or descending by magnitude)
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsSpectralPeaks = {
  magnitudeThreshold: number,
  maxFrequency: number,
  maxPeaks: number,
  minFrequency: number,
  orderBy: string,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `SpectralWhitening` algorithm
 *@type
 * @param {number} [maxFrequency=5000] max frequency to apply whitening to [Hz]
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsSpectralWhitening = {
  maxFrequency: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `Spectrum` algorithm
 *@type
 * @param {number} [size=2048] the expected size of the input audio signal (this is an optional parameter to optimize memory allocation)
*/
type ParamsSpectrum = {
  size: number,
};
 
/**
 * Parameter object type accepted by `SpectrumCQ` algorithm
 *@type
 * @param {number} [binsPerOctave=12] number of bins per octave
 * @param {number} [minFrequency=32.7] minimum frequency [Hz]
 * @param {number} [minimumKernelSize=4] minimum size allowed for frequency kernels
 * @param {number} [numberBins=84] number of frequency bins, starting at minFrequency
 * @param {number} [sampleRate=44100] FFT sampling rate [Hz]
 * @param {number} [scale=1] filters scale. Larger values use longer windows
 * @param {number} [threshold=0.01] bins whose magnitude is below this quantile are discarded
 * @param {string} [windowType=hann] the window type
 * @param {boolean} [zeroPhase=true] a boolean value that enables zero-phase windowing. Input audio frames should be windowed with the same phase mode
*/
type ParamsSpectrumCQ = {
  binsPerOctave: number,
  minFrequency: number,
  minimumKernelSize: number,
  numberBins: number,
  sampleRate: number,
  scale: number,
  threshold: number,
  windowType: string,
  zeroPhase: boolean,
};
 
/**
 * Parameter object type accepted by `SpectrumToCent` algorithm
 *@type
 * @param {number} [bands=720] number of bins to compute. Default is 720 (6 octaves with the default 'centBinResolution')
 * @param {number} [centBinResolution=10] Width of each band in cents. Default is 10 cents
 * @param {number} [inputSize=32768] the size of the spectrum
 * @param {boolean} [log=true] compute log-energies (log2 (1 + energy))
 * @param {number} [minimumFrequency=164] central frequency of the first band of the bank [Hz]
 * @param {string} [normalize=unit_sum] use unit area or vertex equal to 1 triangles.
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {string} [type=power] use magnitude or power spectrum
*/
type ParamsSpectrumToCent = {
  bands: number,
  centBinResolution: number,
  inputSize: number,
  log: boolean,
  minimumFrequency: number,
  normalize: string,
  sampleRate: number,
  type: string,
};
 
/**
 * Parameter object type accepted by `Spline` algorithm
 *@type
 * @param {number} [beta1=1] the skew or bias parameter (only available for type beta)
 * @param {number} [beta2=0] the tension parameter
 * @param {string} [type=b] the type of spline to be computed
 * @param {any[]} [xPoints=[0, 1]] the x-coordinates where data is specified (the points must be arranged in ascending order and cannot contain duplicates)
 * @param {any[]} [yPoints=[0, 1]] the y-coordinates to be interpolated (i.e. the known data)
*/
type ParamsSpline = {
  beta1: number,
  beta2: number,
  type: string,
  xPoints: any[],
  yPoints: any[],
};
 
/**
 * Parameter object type accepted by `SprModelAnal` algorithm
 *@type
 * @param {number} [fftSize=2048] the size of the internal FFT size (full spectrum size)
 * @param {number} [freqDevOffset=20] minimum frequency deviation at 0Hz
 * @param {number} [freqDevSlope=0.01] slope increase of minimum frequency deviation
 * @param {number} [hopSize=512] the hop size between frames
 * @param {number} [magnitudeThreshold=0] peaks below this given threshold are not outputted
 * @param {number} [maxFrequency=5000] the maximum frequency of the range to evaluate [Hz]
 * @param {number} [maxPeaks=100] the maximum number of returned peaks
 * @param {number} [maxnSines=100] maximum number of sines per frame
 * @param {number} [minFrequency=0] the minimum frequency of the range to evaluate [Hz]
 * @param {string} [orderBy=frequency] the ordering type of the outputted peaks (ascending by frequency or descending by magnitude)
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsSprModelAnal = {
  fftSize: number,
  freqDevOffset: number,
  freqDevSlope: number,
  hopSize: number,
  magnitudeThreshold: number,
  maxFrequency: number,
  maxPeaks: number,
  maxnSines: number,
  minFrequency: number,
  orderBy: string,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `SprModelSynth` algorithm
 *@type
 * @param {number} [fftSize=2048] the size of the output FFT frame (full spectrum size)
 * @param {number} [hopSize=512] the hop size between frames
 * @param {number} [sampleRate=44100] the audio sampling rate [Hz]
*/
type ParamsSprModelSynth = {
  fftSize: number,
  hopSize: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `SpsModelAnal` algorithm
 *@type
 * @param {number} [fftSize=2048] the size of the internal FFT size (full spectrum size)
 * @param {number} [freqDevOffset=20] minimum frequency deviation at 0Hz
 * @param {number} [freqDevSlope=0.01] slope increase of minimum frequency deviation
 * @param {number} [hopSize=512] the hop size between frames
 * @param {number} [magnitudeThreshold=0] peaks below this given threshold are not outputted
 * @param {number} [maxFrequency=5000] the maximum frequency of the range to evaluate [Hz]
 * @param {number} [maxPeaks=100] the maximum number of returned peaks
 * @param {number} [maxnSines=100] maximum number of sines per frame
 * @param {number} [minFrequency=0] the minimum frequency of the range to evaluate [Hz]
 * @param {string} [orderBy=frequency] the ordering type of the outputted peaks (ascending by frequency or descending by magnitude)
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [stocf=0.2] decimation factor used for the stochastic approximation
*/
type ParamsSpsModelAnal = {
  fftSize: number,
  freqDevOffset: number,
  freqDevSlope: number,
  hopSize: number,
  magnitudeThreshold: number,
  maxFrequency: number,
  maxPeaks: number,
  maxnSines: number,
  minFrequency: number,
  orderBy: string,
  sampleRate: number,
  stocf: number,
};
 
/**
 * Parameter object type accepted by `SpsModelSynth` algorithm
 *@type
 * @param {number} [fftSize=2048] the size of the output FFT frame (full spectrum size)
 * @param {number} [hopSize=512] the hop size between frames
 * @param {number} [sampleRate=44100] the audio sampling rate [Hz]
 * @param {number} [stocf=0.2] decimation factor used for the stochastic approximation
*/
type ParamsSpsModelSynth = {
  fftSize: number,
  hopSize: number,
  sampleRate: number,
  stocf: number,
};
 
/**
 * Parameter object type accepted by `StartStopCut` algorithm
 *@type
 * @param {number} [frameSize=256] the frame size for the internal power analysis
 * @param {number} [hopSize=256] the hop size for the internal power analysis
 * @param {number} [maximumStartTime=10] if the first non-silent frame occurs before maximumStartTime startCut is activated [ms]
 * @param {number} [maximumStopTime=10] if the last non-silent frame occurs after maximumStopTime to the end stopCut is activated [ms]
 * @param {number} [sampleRate=44100] the sample rate
 * @param {number} [threshold=-60] the threshold below which average energy is defined as silence [dB]
*/
type ParamsStartStopCut = {
  frameSize: number,
  hopSize: number,
  maximumStartTime: number,
  maximumStopTime: number,
  sampleRate: number,
  threshold: number,
};
 
/**
 * Parameter object type accepted by `StartStopSilence` algorithm
 *@type
 * @param {number} [threshold=-60] the threshold below which average energy is defined as silence [dB]
*/
type ParamsStartStopSilence = {
  threshold: number,
};
 
/**
 * Parameter object type accepted by `StochasticModelAnal` algorithm
 *@type
 * @param {number} [fftSize=2048] the size of the internal FFT size (full spectrum size)
 * @param {number} [hopSize=512] the hop size between frames
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [stocf=0.2] decimation factor used for the stochastic approximation
*/
type ParamsStochasticModelAnal = {
  fftSize: number,
  hopSize: number,
  sampleRate: number,
  stocf: number,
};
 
/**
 * Parameter object type accepted by `StochasticModelSynth` algorithm
 *@type
 * @param {number} [fftSize=2048] the size of the internal FFT size (full spectrum size)
 * @param {number} [hopSize=512] the hop size between frames
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [stocf=0.2] decimation factor used for the stochastic approximation
*/
type ParamsStochasticModelSynth = {
  fftSize: number,
  hopSize: number,
  sampleRate: number,
  stocf: number,
};
 
/**
 * Parameter object type accepted by `StrongDecay` algorithm
 *@type
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsStrongDecay = {
  sampleRate: number,
};
 

 
/**
 * Parameter object type accepted by `SuperFluxExtractor` algorithm
 *@type
 * @param {number} [combine=20] time threshold for double onsets detections (ms)
 * @param {number} [frameSize=2048] the frame size for computing low-level features
 * @param {number} [hopSize=256] the hop size for computing low-level features
 * @param {number} [ratioThreshold=16] ratio threshold for peak picking with respect to novelty_signal/novelty_average rate, use 0 to disable it (for low-energy onsets)
 * @param {number} [sampleRate=44100] the audio sampling rate [Hz]
 * @param {number} [threshold=0.05] threshold for peak peaking with respect to the difference between novelty_signal and average_signal (for onsets in ambient noise)
*/
type ParamsSuperFluxExtractor = {
  combine: number,
  frameSize: number,
  hopSize: number,
  ratioThreshold: number,
  sampleRate: number,
  threshold: number,
};
 
/**
 * Parameter object type accepted by `SuperFluxNovelty` algorithm
 *@type
 * @param {number} [binWidth=3] filter width (number of frequency bins)
 * @param {number} [frameWidth=2] differentiation offset (compute the difference with the N-th previous frame)
*/
type ParamsSuperFluxNovelty = {
  binWidth: number,
  frameWidth: number,
};
 
/**
 * Parameter object type accepted by `SuperFluxPeaks` algorithm
 *@type
 * @param {number} [combine=30] time threshold for double onsets detections (ms)
 * @param {number} [frameRate=172] frameRate
 * @param {number} [pre_avg=100] look back duration for moving average filter [ms]
 * @param {number} [pre_max=30] look back duration for moving maximum filter [ms]
 * @param {number} [ratioThreshold=16] ratio threshold for peak picking with respect to novelty_signal/novelty_average rate, use 0 to disable it (for low-energy onsets)
 * @param {number} [threshold=0.05] threshold for peak peaking with respect to the difference between novelty_signal and average_signal (for onsets in ambient noise)
*/
type ParamsSuperFluxPeaks = {
  combine: number,
  frameRate: number,
  pre_avg: number,
  pre_max: number,
  ratioThreshold: number,
  threshold: number,
};
 

 
/**
 * Parameter object type accepted by `TempoScaleBands` algorithm
 *@type
 * @param {any[]} [bandsGain=[2, 3, 2, 1, 1.20000004768, 2, 3, 2.5]] gain for each bands
 * @param {number} [frameTime=512] the frame rate in samples
*/
type ParamsTempoScaleBands = {
  bandsGain: any[],
  frameTime: number,
};
 
/**
 * Parameter object type accepted by `TempoTap` algorithm
 *@type
 * @param {number} [frameHop=1024] number of feature frames separating two evaluations
 * @param {number} [frameSize=256] number of audio samples in a frame
 * @param {number} [maxTempo=208] fastest tempo allowed to be detected [bpm]
 * @param {number} [minTempo=40] slowest tempo allowed to be detected [bpm]
 * @param {number} [numberFrames=1024] number of feature frames to buffer on
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {any[]} [tempoHints=[]] optional list of initial beat locations, to favor the detection of pre-determined tempo period and beats alignment [s]
*/
type ParamsTempoTap = {
  frameHop: number,
  frameSize: number,
  maxTempo: number,
  minTempo: number,
  numberFrames: number,
  sampleRate: number,
  tempoHints: any[],
};
 
/**
 * Parameter object type accepted by `TempoTapDegara` algorithm
 *@type
 * @param {number} [maxTempo=208] fastest tempo allowed to be detected [bpm]
 * @param {number} [minTempo=40] slowest tempo allowed to be detected [bpm]
 * @param {string} [resample=none] use upsampling of the onset detection function (may increase accuracy)
 * @param {number} [sampleRateODF=86.1328] the sampling rate of the onset detection function [Hz]
*/
type ParamsTempoTapDegara = {
  maxTempo: number,
  minTempo: number,
  resample: string,
  sampleRateODF: number,
};
 

 
/**
 * Parameter object type accepted by `TempoTapTicks` algorithm
 *@type
 * @param {number} [frameHop=512] number of feature frames separating two evaluations
 * @param {number} [hopSize=256] number of audio samples per features
 * @param {number} [sampleRate=44100] sampling rate of the audio signal [Hz]
*/
type ParamsTempoTapTicks = {
  frameHop: number,
  hopSize: number,
  sampleRate: number,
};
 

 

 

 

 
/**
 * Parameter object type accepted by `TonalExtractor` algorithm
 *@type
 * @param {number} [frameSize=4096] the framesize for computing tonal features
 * @param {number} [hopSize=2048] the hopsize for computing tonal features
 * @param {number} [tuningFrequency=440] the tuning frequency of the input signal
*/
type ParamsTonalExtractor = {
  frameSize: number,
  hopSize: number,
  tuningFrequency: number,
};
 
/**
 * Parameter object type accepted by `TonicIndianArtMusic` algorithm
 *@type
 * @param {number} [binResolution=10] salience function bin resolution [cents]
 * @param {number} [frameSize=2048] the frame size for computing pitch saliecnce
 * @param {number} [harmonicWeight=0.85] harmonic weighting parameter (weight decay ratio between two consequent harmonics, =1 for no decay)
 * @param {number} [hopSize=512] the hop size with which the pitch salience function was computed
 * @param {number} [magnitudeCompression=1] magnitude compression parameter (=0 for maximum compression, =1 for no compression)
 * @param {number} [magnitudeThreshold=40] peak magnitude threshold (maximum allowed difference from the highest peak in dBs)
 * @param {number} [maxTonicFrequency=375] the maximum allowed tonic frequency [Hz]
 * @param {number} [minTonicFrequency=100] the minimum allowed tonic frequency [Hz]
 * @param {number} [numberHarmonics=20] number of considered hamonics
 * @param {number} [numberSaliencePeaks=5] number of top peaks of the salience function which should be considered for constructing histogram
 * @param {number} [referenceFrequency=55] the reference frequency for Hertz to cent convertion [Hz], corresponding to the 0th cent bin
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
*/
type ParamsTonicIndianArtMusic = {
  binResolution: number,
  frameSize: number,
  harmonicWeight: number,
  hopSize: number,
  magnitudeCompression: number,
  magnitudeThreshold: number,
  maxTonicFrequency: number,
  minTonicFrequency: number,
  numberHarmonics: number,
  numberSaliencePeaks: number,
  referenceFrequency: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `TriangularBands` algorithm
 *@type
 * @param {any[]} [frequencyBands=[21.533203125, 43.06640625, 64.599609375, 86.1328125, 107.666015625, 129.19921875, 150.732421875, 172.265625, 193.798828125, 215.33203125, 236.865234375, 258.3984375, 279.931640625, 301.46484375, 322.998046875, 344.53125, 366.064453125, 387.59765625, 409.130859375, 430.6640625, 452.197265625, 473.73046875, 495.263671875, 516.796875, 538.330078125, 559.86328125, 581.396484375, 602.9296875, 624.462890625, 645.99609375, 667.529296875, 689.0625, 710.595703125, 732.12890625, 753.662109375, 775.1953125, 796.728515625, 839.794921875, 861.328125, 882.861328125, 904.39453125, 925.927734375, 968.994140625, 990.52734375, 1012.06054688, 1055.12695312, 1076.66015625, 1098.19335938, 1141.25976562, 1184.32617188, 1205.859375, 1248.92578125, 1270.45898438, 1313.52539062, 1356.59179688, 1399.65820312, 1442.72460938, 1485.79101562, 1528.85742188, 1571.92382812, 1614.99023438, 1658.05664062, 1701.12304688, 1765.72265625, 1808.7890625, 1873.38867188, 1916.45507812, 1981.0546875, 2024.12109375, 2088.72070312, 2153.3203125, 2217.91992188, 2282.51953125, 2347.11914062, 2411.71875, 2497.8515625, 2562.45117188, 2627.05078125, 2713.18359375, 2799.31640625, 2885.44921875, 2950.04882812, 3036.18164062, 3143.84765625, 3229.98046875, 3316.11328125, 3423.77929688, 3509.91210938, 3617.578125, 3725.24414062, 3832.91015625, 3940.57617188, 4069.77539062, 4177.44140625, 4306.640625, 4435.83984375, 4565.0390625, 4694.23828125, 4844.97070312, 4974.16992188, 5124.90234375, 5275.63476562, 5426.3671875, 5577.09960938, 5749.36523438, 5921.63085938, 6093.89648438, 6266.16210938, 6459.9609375, 6653.75976562, 6847.55859375, 7041.35742188, 7256.68945312, 7450.48828125, 7687.35351562, 7902.68554688, 8139.55078125, 8376.41601562, 8613.28125, 8871.6796875, 9130.078125, 9388.4765625, 9668.40820312, 9948.33984375, 10249.8046875, 10551.2695312, 10852.734375, 11175.7324219, 11498.7304688, 11843.2617188, 12187.7929688, 12553.8574219, 12919.921875, 13285.9863281, 13673.5839844, 14082.7148438, 14491.8457031, 14922.5097656, 15353.1738281, 15805.3710938, 16257.5683594]] list of frequency ranges into which the spectrum is divided (these must be in ascending order and connot contain duplicates),each triangle is build as x(i-1)=0, x(i)=1, x(i+1)=0 over i, the resulting number of bands is size of input array - 2
 * @param {number} [inputSize=1025] the size of the spectrum
 * @param {boolean} [log=true] compute log-energies (log2 (1 + energy))
 * @param {string} [normalize=unit_sum] spectrum bin weights to use for each triangular band: 'unit_max' to make each triangle vertex equal to 1, 'unit_sum' to make each triangle area equal to 1 summing the actual weights of spectrum bins, 'unit_area' to make each triangle area equal to 1 normalizing the weights of each triangle by its bandwidth
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {string} [type=power] use magnitude or power spectrum
 * @param {string} [weighting=linear] type of weighting function for determining triangle area
*/
type ParamsTriangularBands = {
  frequencyBands: any[],
  inputSize: number,
  log: boolean,
  normalize: string,
  sampleRate: number,
  type: string,
  weighting: string,
};
 
/**
 * Parameter object type accepted by `TriangularBarkBands` algorithm
 *@type
 * @param {number} [highFrequencyBound=22050] an upper-bound limit for the frequencies to be included in the bands
 * @param {number} [inputSize=1025] the size of the spectrum
 * @param {boolean} [log=false] compute log-energies (log2 (1 + energy))
 * @param {number} [lowFrequencyBound=0] a lower-bound limit for the frequencies to be included in the bands
 * @param {string} [normalize=unit_sum] 'unit_max' makes the vertex of all the triangles equal to 1, 'unit_sum' makes the area of all the triangles equal to 1
 * @param {number} [numberBands=24] the number of output bands
 * @param {number} [sampleRate=44100] the sample rate
 * @param {string} [type=power] 'power' to output squared units, 'magnitude' to keep it as the input
 * @param {string} [weighting=warping] type of weighting function for determining triangle area
*/
type ParamsTriangularBarkBands = {
  highFrequencyBound: number,
  inputSize: number,
  log: boolean,
  lowFrequencyBound: number,
  normalize: string,
  numberBands: number,
  sampleRate: number,
  type: string,
  weighting: string,
};
 
/**
 * Parameter object type accepted by `Trimmer` algorithm
 *@type
 * @param {boolean} [checkRange=false] check whether the specified time range for a slice fits the size of input signal (throw exception if not)
 * @param {number} [endTime=1e+06] the end time of the slice you want to extract [s]
 * @param {number} [sampleRate=44100] the sampling rate of the input audio signal [Hz]
 * @param {number} [startTime=0] the start time of the slice you want to extract [s]
*/
type ParamsTrimmer = {
  checkRange: boolean,
  endTime: number,
  sampleRate: number,
  startTime: number,
};
 

 
/**
 * Parameter object type accepted by `TruePeakDetector` algorithm
 *@type
 * @param {boolean} [blockDC=false] flag to activate the optional DC blocker
 * @param {boolean} [emphasise=false] flag to activate the optional emphasis filter
 * @param {number} [oversamplingFactor=4] times the signal is oversapled
 * @param {number} [quality=1] type of interpolation applied (see libresmple)
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {number} [threshold=-0.0002] threshold to detect peaks [dB]
 * @param {number} [version=4] algorithm version
*/
type ParamsTruePeakDetector = {
  blockDC: boolean,
  emphasise: boolean,
  oversamplingFactor: number,
  quality: number,
  sampleRate: number,
  threshold: number,
  version: number,
};
 
/**
 * Parameter object type accepted by `TuningFrequency` algorithm
 *@type
 * @param {number} [resolution=1] resolution in cents (logarithmic scale, 100 cents = 1 semitone) for tuning frequency determination
*/
type ParamsTuningFrequency = {
  resolution: number,
};
 
/**
 * Parameter object type accepted by `TuningFrequencyExtractor` algorithm
 *@type
 * @param {number} [frameSize=4096] the frameSize for computing tuning frequency
 * @param {number} [hopSize=2048] the hopsize for computing tuning frequency
*/
type ParamsTuningFrequencyExtractor = {
  frameSize: number,
  hopSize: number,
};
 
/**
 * Parameter object type accepted by `UnaryOperator` algorithm
 *@type
 * @param {number} [scale=1] multiply result by factor
 * @param {number} [shift=0] shift result by value (add value)
 * @param {string} [type=identity] the type of the unary operator to apply to input array
*/
type ParamsUnaryOperator = {
  scale: number,
  shift: number,
  type: string,
};
 
/**
 * Parameter object type accepted by `UnaryOperatorStream` algorithm
 *@type
 * @param {number} [scale=1] multiply result by factor
 * @param {number} [shift=0] shift result by value (add value)
 * @param {string} [type=identity] the type of the unary operator to apply to input array
*/
type ParamsUnaryOperatorStream = {
  scale: number,
  shift: number,
  type: string,
};
 

 
/**
 * Parameter object type accepted by `Vibrato` algorithm
 *@type
 * @param {number} [maxExtend=250] maximum considered vibrato extent [cents]
 * @param {number} [maxFrequency=8] maximum considered vibrato frequency [Hz]
 * @param {number} [minExtend=50] minimum considered vibrato extent [cents]
 * @param {number} [minFrequency=4] minimum considered vibrato frequency [Hz]
 * @param {number} [sampleRate=344.531] sample rate of the input pitch contour
*/
type ParamsVibrato = {
  maxExtend: number,
  maxFrequency: number,
  minExtend: number,
  minFrequency: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `WarpedAutoCorrelation` algorithm
 *@type
 * @param {number} [maxLag=1] the maximum lag for which the auto-correlation is computed (inclusive) (must be smaller than signal size) 
 * @param {number} [sampleRate=44100] the audio sampling rate [Hz]
*/
type ParamsWarpedAutoCorrelation = {
  maxLag: number,
  sampleRate: number,
};
 
/**
 * Parameter object type accepted by `Welch` algorithm
 *@type
 * @param {number} [averagingFrames=10] amount of frames to average
 * @param {number} [fftSize=1024] size of the FFT. Zero padding is added if this is larger the input frame size.
 * @param {number} [frameSize=512] the expected size of the input audio signal (this is an optional parameter to optimize memory allocation)
 * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
 * @param {string} [scaling=density] 'density' normalizes the result to the bandwidth while 'power' outputs the unnormalized power spectrum
 * @param {string} [windowType=hann] the window type
*/
type ParamsWelch = {
  averagingFrames: number,
  fftSize: number,
  frameSize: number,
  sampleRate: number,
  scaling: string,
  windowType: string,
};
 
/**
 * Parameter object type accepted by `Windowing` algorithm
 *@type
 * @param {number} [constantsDecimals=5] number of decimals considered in the constants for the formulation of the hamming and blackmanharris* windows 
 * @param {boolean} [normalized=true] a boolean value to specify whether to normalize windows (to have an area of 1) and then scale by a factor of 2
 * @param {number} [size=1024] the window size
 * @param {boolean} [splitPadding=false] whether to split the padding to the edges of the signal (_/\_) or to add it to the right (/\__). This option is ignored when zeroPhase (\__/) is true
 * @param {boolean} [symmetric=true] whether to create a symmetric or asymmetric window as implemented in SciPy
 * @param {string} [type=hann] the window type
 * @param {number} [zeroPadding=0] the size of the zero-padding
 * @param {boolean} [zeroPhase=true] a boolean value that enables zero-phase windowing
*/
type ParamsWindowing = {
  constantsDecimals: number,
  normalized: boolean,
  size: number,
  splitPadding: boolean,
  symmetric: boolean,
  type: string,
  zeroPadding: number,
  zeroPhase: boolean,
};
 
/**
 * Parameter object type accepted by `ZeroCrossingRate` algorithm
 *@type
 * @param {number} [threshold=0] the threshold which will be taken as the zero axis in both positive and negative sign
*/
type ParamsZeroCrossingRate = {
  threshold: number,
};
 
export {
  ParamsAllPass,
  ParamsAudioOnsetsMarker,
  ParamsAutoCorrelation,
  ParamsBFCC,
  ParamsBPF,
  ParamsBandPass,
  ParamsBandReject,
  ParamsBarkBands,
  ParamsBeatTrackerDegara,
  ParamsBeatTrackerMultiFeature,
  ParamsBeatogram,
  ParamsBeatsLoudness,
  ParamsBinaryOperator,
  ParamsBinaryOperatorStream,
  ParamsBpmRubato,
  ParamsCentralMoments,
  ParamsCentroid,
  ParamsChordsDetection,
  ParamsChordsDetectionBeats,
  ParamsChromaCrossSimilarity,
  ParamsChromagram,
  ParamsClickDetector,
  ParamsClipper,
  ParamsCoverSongSimilarity,
  ParamsCrossCorrelation,
  ParamsCrossSimilarityMatrix,
  ParamsCubicSpline,
  ParamsDCRemoval,
  ParamsDCT,
  ParamsDanceability,
  ParamsDecrease,
  ParamsDiscontinuityDetector,
  ParamsDuration,
  ParamsDynamicComplexity,
  ParamsERBBands,
  ParamsEffectiveDuration,
  ParamsEnergyBand,
  ParamsEnergyBandRatio,
  ParamsEnvelope,
  ParamsEqualLoudness,
  ParamsFlux,
  ParamsFrameCutter,
  ParamsFrameToReal,
  ParamsFrequencyBands,
  ParamsGFCC,
  ParamsGapsDetector,
  ParamsHFC,
  ParamsHPCP,
  ParamsHarmonicBpm,
  ParamsHarmonicPeaks,
  ParamsHighPass,
  ParamsHighResolutionFeatures,
  ParamsHistogram,
  ParamsHprModelAnal,
  ParamsHpsModelAnal,
  ParamsIDCT,
  ParamsIIR,
  ParamsIntensity,
  ParamsKey,
  ParamsKeyExtractor,
  ParamsLPC,
  ParamsLarm,
  ParamsLevelExtractor,
  ParamsLogAttackTime,
  ParamsLogSpectrum,
  ParamsLoopBpmConfidence,
  ParamsLoopBpmEstimator,
  ParamsLoudnessVickers,
  ParamsLowLevelSpectralEqloudExtractor,
  ParamsLowLevelSpectralExtractor,
  ParamsLowPass,
  ParamsMFCC,
  ParamsMaxFilter,
  ParamsMaxMagFreq,
  ParamsMedianFilter,
  ParamsMelBands,
  ParamsMinMax,
  ParamsMovingAverage,
  ParamsMultiPitchKlapuri,
  ParamsMultiPitchMelodia,
  ParamsMultiplexer,
  ParamsNNLSChroma,
  ParamsNoiseAdder,
  ParamsNoiseBurstDetector,
  ParamsNoveltyCurve,
  ParamsNoveltyCurveFixedBpmEstimator,
  ParamsOnsetDetection,
  ParamsOnsetDetectionGlobal,
  ParamsOverlapAdd,
  ParamsPeakDetection,
  ParamsPercivalBpmEstimator,
  ParamsPitchContourSegmentation,
  ParamsPitchContours,
  ParamsPitchContoursMelody,
  ParamsPitchContoursMonoMelody,
  ParamsPitchContoursMultiMelody,
  ParamsPitchFilter,
  ParamsPitchMelodia,
  ParamsPitchSalience,
  ParamsPitchSalienceFunction,
  ParamsPitchSalienceFunctionPeaks,
  ParamsPitchYin,
  ParamsPitchYinFFT,
  ParamsPitchYinProbabilistic,
  ParamsPitchYinProbabilities,
  ParamsPitchYinProbabilitiesHMM,
  ParamsPowerMean,
  ParamsPowerSpectrum,
  ParamsPredominantPitchMelodia,
  ParamsRawMoments,
  ParamsReplayGain,
  ParamsResample,
  ParamsResampleFFT,
  ParamsRhythmExtractor,
  ParamsRhythmExtractor2013,
  ParamsRhythmTransform,
  ParamsRollOff,
  ParamsSNR,
  ParamsSaturationDetector,
  ParamsScale,
  ParamsSineSubtraction,
  ParamsSingleBeatLoudness,
  ParamsSlicer,
  ParamsSpectralCentroidTime,
  ParamsSpectralComplexity,
  ParamsSpectralContrast,
  ParamsSpectralPeaks,
  ParamsSpectralWhitening,
  ParamsSpectrum,
  ParamsSpectrumCQ,
  ParamsSpectrumToCent,
  ParamsSpline,
  ParamsSprModelAnal,
  ParamsSprModelSynth,
  ParamsSpsModelAnal,
  ParamsSpsModelSynth,
  ParamsStartStopCut,
  ParamsStartStopSilence,
  ParamsStochasticModelAnal,
  ParamsStochasticModelSynth,
  ParamsStrongDecay,
  ParamsSuperFluxExtractor,
  ParamsSuperFluxNovelty,
  ParamsSuperFluxPeaks,
  ParamsTempoScaleBands,
  ParamsTempoTap,
  ParamsTempoTapDegara,
  ParamsTempoTapTicks,
  ParamsTonalExtractor,
  ParamsTonicIndianArtMusic,
  ParamsTriangularBands,
  ParamsTriangularBarkBands,
  ParamsTrimmer,
  ParamsTruePeakDetector,
  ParamsTuningFrequency,
  ParamsTuningFrequencyExtractor,
  ParamsUnaryOperator,
  ParamsUnaryOperatorStream,
  ParamsVibrato,
  ParamsWarpedAutoCorrelation,
  ParamsWelch,
  ParamsWindowing,
  ParamsZeroCrossingRate,
}
 
