/** 
 * @license
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

// NOTE: The following code snippets are machine generated. Do not edit.

let wasmBackend: any;

function ready(EssentiaWASM: any) {
  wasmBackend = EssentiaWASM;
  wasmBackend.init();
}


/**
 * Decode and returns the audio buffer of a given audio url or blob uri using Web Audio API. 
 * (NOTE: This method doesn't works on Safari browser)
 * @async
 * @method
 * @param {string} audioURL web url or blob uri of a audio file
 * @param {AudioContext} webAudioCtx an instance of Web Audio API `AudioContext`
 * @returns {AudioBuffer} decoded audio buffer object
 * @memberof Essentia
 */
async function getAudioBufferFromURL(audioURL: string, webAudioCtx: AudioContext) {
  const response = await fetch(audioURL);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await webAudioCtx.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

/**
 * Decode and returns the audio channel data from an given audio url or blob uri using Web Audio API. 
 * (NOTE: This method doesn't works on Safari browser)
 * @async
 * @method
 * @param {string} audioURL web url or blob uri of a audio file
 * @param {AudioContext} webAudioCtx an instance of Web Audio API `AudioContext`
 * @param {number} [channel=0] audio channel number
 * @returns {Float32Array} decode and returns the audio data as Float32 array for the given channel
 * @memberof Essentia
 */
async function getAudioChannelDataFromURL(audioURL: string, webAudioCtx: AudioContext, channel: number=0) {
  const response = await fetch(audioURL);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await webAudioCtx.decodeAudioData(arrayBuffer);
  return audioBuffer.getChannelData(channel);
}

/**
 * Convert an AudioBuffer object to a Mono audio signal array. The audio signal is downmixed
 * to mono using essentia `MonoMixer` algorithm if the audio buffer has 2 channels of audio.
 * Throws an expection if the input AudioBuffer object has more than 2 channels of audio.
 * @method
 * @param {AudioBuffer} buffer `AudioBuffer` object decoded from an audio file.
 * @returns {Float32Array} audio channel data. (downmixed to mono if its stereo signal).
 * @memberof Essentia
 */
function audioBufferToMonoSignal(buffer: AudioBuffer): Float32Array {
  if (buffer.numberOfChannels === 1) {
    return buffer.getChannelData(0);
  }
  if (buffer.numberOfChannels === 2) {
    const left = wasmBackend.arrayToVector(buffer.getChannelData(0));
    const right = wasmBackend.arrayToVector(buffer.getChannelData(1));
    let monoSignal = wasmBackend.MonoMixer(left, right).audio;
    return wasmBackend.vectorToArray(monoSignal);
  }
  throw new Error('Unexpected number of channels found in audio buffer. Only accepts mono or stereo audio buffers.');
}

/**
 * Convert an input JS array into VectorFloat type
 * @method
 * @param {Float32Array} inputArray input JS typed array
 * @returns {VectorFloat} returns vector float
 * @memberof Essentia
 */
function arrayToVector(inputArray: any) {
  return wasmBackend.arrayToVector(inputArray);
}

/**
 * Convert an input VectorFloat array into typed JS Float32Array 
 * @method 
 * @param {VectorFloat} inputVector input VectorFloat array
 * @returns {Float32Array} returns converted JS typed array
 * @memberof Essentia
 */
function vectorToArray(inputVector: any): Float32Array {
  return wasmBackend.vectorToArray(inputVector);
}

/**
 * Cuts an audio signal data into overlapping frames given frame size and hop size 
 * @class
 */
class FrameGenerator {
  private algoInstance: any;

  /**
   * @constructs
   * @param {number} [frameSize=2048] frame size for cutting the audio signal
   * @param {number} [hopSize=1024] size of overlapping frame 
  */
  constructor(frameSize: number=2048, hopSize: number=1024) {
    this.algoInstance = new wasmBackend.FrameGenerator(frameSize, hopSize);
  }

  /**
   * Configure algorithm
   * @method
   * @param {number} [frameSize=2048] frame size for cutting the audio signal
   * @param {number} [hopSize=1024] size of overlapping frame 
   * @memberof FrameGenerator
   */
  configure(frameSize: number=2048, hopSize: number=1024) {
    this.algoInstance.configure(frameSize, hopSize);
  }

  /**
   * Execute algorithm
   * @method
   * @param {Float32Array} inputAudioData a single channel audio channel data
   * @returns {VectorVectorFloat} Returns a 2D vector float of sliced audio frames
   * @memberof FrameGenerator 
   */
  compute(inputAudioData: Float32Array) {
    return this.algoInstance.compute(inputAudioData);
  }

  delete() {
    this.algoInstance.delete();
  }
}

/**
* This algorithm downmixes the signal into a single channel given a stereo signal. It is a wrapper around https://essentia.upf.edu/reference/std_MonoMixer.html.
* @method
* @param {VectorFloat} leftChannel the left channel of the stereo audio signal
* @param {VectorFloat} rightChannel the right channel of the stereo audio signal
* @returns {object} {audio: 'the downmixed mono signal'}
* @memberof Essentia
*/
// MonoMixer(leftSignal: any, rightSignal: any) {
//   return this.algorithms.MonoMixer(leftSignal, rightSignal);
// }

/**
* This algorithm computes the EBUR128 loudness descriptors of an audio signal. It is a wrapper around https://essentia.upf.edu/reference/std_LoudnessEBUR128.html.
* @method
* @param {VectorFloat} leftChannel the left channel of the stereo audio signal
* @param {VectorFloat} rightChannel the right channel of the stereo audio signal
* @param {number} [hopSize=0.1] the hop size with which the loudness is computed [s]
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {boolean} [startAtZero=false] start momentary/short-term loudness estimation at time 0 (zero-centered loudness estimation windows) if true; otherwise start both windows at time 0 (time positions for momentary and short-term values will not be syncronized)
* @returns {object} {momentaryLoudness: 'momentary loudness (over 400ms) (LUFS)', shortTermLoudness: 'short-term loudness (over 3 seconds) (LUFS)', integratedLoudness: 'integrated loudness (overall) (LUFS)', loudnessRange: 'loudness range over an arbitrary long time interval [3] (dB, LU)'}
* @memberof Essentia
*/
// LoudnessEBUR128(leftSignal: any, rightSignal: any, hopSize: number=0.1, sampleRate: number=44100, startAtZero: boolean=false) {
//   return this.algorithms.LoudnessEBUR128(leftSignal, rightSignal, hopSize, sampleRate, startAtZero);
// }

// NOTE: The following code snippets are machine generated. Do not edit.
/**
* This algorithm computes the ratio between the pitch energy after the pitch maximum and the pitch energy before the pitch maximum. Sounds having an monotonically ascending pitch or one unique pitch will show a value of (0,1], while sounds having a monotonically descending pitch will show a value of [1,inf). In case there is no energy before the max pitch, the algorithm will return the energy after the maximum pitch. Check https://essentia.upf.edu/reference/std_AfterMaxToBeforeMaxEnergyRatio.html for more details.
* @class
* @param {VectorFloat} pitch the array of pitch values [Hz]
* @returns {object} {afterMaxToBeforeMaxEnergyRatio: 'the ratio between the pitch energy after the pitch maximum to the pitch energy before the pitch maximum'}
* @memberof Essentia
*/
class AfterMaxToBeforeMaxEnergyRatio {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.AfterMaxToBeforeMaxEnergyRatio();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(pitch: any) {
    return this.algoInstance.compute(pitch);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements a IIR all-pass filter of order 1 or 2. Because of its dependence on IIR, IIR's requirements are inherited. Check https://essentia.upf.edu/reference/std_AllPass.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {number} [bandwidth=500] the bandwidth of the filter [Hz] (used only for 2nd-order filters)
* @param {number} [cutoffFrequency=1500] the cutoff frequency for the filter [Hz]
* @param {number} [order=1] the order of the filter
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {signal: 'the filtered signal'}
* @memberof Essentia
*/
class AllPass {
  private algoInstance: any;
  constructor(bandwidth: number=500, cutoffFrequency: number=1500, order: number=1, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.AllPass(bandwidth, cutoffFrequency, order, sampleRate);
  }
  configure(bandwidth: number=500, cutoffFrequency: number=1500, order: number=1, sampleRate: number=44100) {
    this.algoInstance.configure(bandwidth, cutoffFrequency, order, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm creates a wave file in which a given audio signal is mixed with a series of time onsets. The sonification of the onsets can be heard as beeps, or as short white noise pulses if configured to do so. Check https://essentia.upf.edu/reference/std_AudioOnsetsMarker.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {any[]} [onsets=[]] the list of onset locations [s]
* @param {number} [sampleRate=44100] the sampling rate of the output signal [Hz]
* @param {string} [type=beep] the type of sound to be added on the event
* @returns {object} {signal: 'the input signal mixed with bursts at onset locations'}
* @memberof Essentia
*/
class AudioOnsetsMarker {
  private algoInstance: any;
  constructor(onsets: any[]=[], sampleRate: number=44100, type: string='beep') {
    let veconsets = arrayToVector(onsets);
    this.algoInstance = new wasmBackend.AudioOnsetsMarker(veconsets, sampleRate, type);
  }
  configure(onsets: any[]=[], sampleRate: number=44100, type: string='beep') {
    let veconsets = arrayToVector(onsets);
    this.algoInstance.configure(veconsets, sampleRate, type);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the autocorrelation vector of a signal.
It uses the version most commonly used in signal processing, which doesn't remove the mean from the observations.
Using the 'generalized' option this algorithm computes autocorrelation as described in [3]. Check https://essentia.upf.edu/reference/std_AutoCorrelation.html for more details.
* @class
* @param {VectorFloat} array the array to be analyzed
* @param {number} [frequencyDomainCompression=0.5] factor at which FFT magnitude is compressed (only used if 'generalized' is set to true, see [3])
* @param {boolean} [generalized=false] bool value to indicate whether to compute the 'generalized' autocorrelation as described in [3]
* @param {string} [normalization=standard] type of normalization to compute: either 'standard' (default) or 'unbiased'
* @returns {object} {autoCorrelation: 'the autocorrelation vector'}
* @memberof Essentia
*/
class AutoCorrelation {
  private algoInstance: any;
  constructor(frequencyDomainCompression: number=0.5, generalized: boolean=false, normalization: string='standard') {
    this.algoInstance = new wasmBackend.AutoCorrelation(frequencyDomainCompression, generalized, normalization);
  }
  configure(frequencyDomainCompression: number=0.5, generalized: boolean=false, normalization: string='standard') {
    this.algoInstance.configure(frequencyDomainCompression, generalized, normalization);
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the bark-frequency cepstrum coefficients of a spectrum. Bark bands and their subsequent usage in cepstral analysis have shown to be useful in percussive content [1, 2]
This algorithm is implemented using the Bark scaling approach in the Rastamat version of the MFCC algorithm and in a similar manner to the MFCC-FB40 default specs: Check https://essentia.upf.edu/reference/std_BFCC.html for more details.
* @class
* @param {VectorFloat} spectrum the audio spectrum
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
* @returns {object} {bands: 'the energies in bark bands', bfcc: 'the bark frequency cepstrum coefficients'}
* @memberof Essentia
*/
class BFCC {
  private algoInstance: any;
  constructor(dctType: number=2, highFrequencyBound: number=11000, inputSize: number=1025, liftering: number=0, logType: string='dbamp', lowFrequencyBound: number=0, normalize: string='unit_sum', numberBands: number=40, numberCoefficients: number=13, sampleRate: number=44100, type: string='power', weighting: string='warping') {
    this.algoInstance = new wasmBackend.BFCC(dctType, highFrequencyBound, inputSize, liftering, logType, lowFrequencyBound, normalize, numberBands, numberCoefficients, sampleRate, type, weighting);
  }
  configure(dctType: number=2, highFrequencyBound: number=11000, inputSize: number=1025, liftering: number=0, logType: string='dbamp', lowFrequencyBound: number=0, normalize: string='unit_sum', numberBands: number=40, numberCoefficients: number=13, sampleRate: number=44100, type: string='power', weighting: string='warping') {
    this.algoInstance.configure(dctType, highFrequencyBound, inputSize, liftering, logType, lowFrequencyBound, normalize, numberBands, numberCoefficients, sampleRate, type, weighting);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements a break point function which linearly interpolates between discrete xy-coordinates to construct a continuous function. Check https://essentia.upf.edu/reference/std_BPF.html for more details.
* @class
* @param {number} x the input coordinate (x-axis)
* @param {any[]} [xPoints=[0, 1]] the x-coordinates of the points forming the break-point function (the points must be arranged in ascending order and cannot contain duplicates)
* @param {any[]} [yPoints=[0, 1]] the y-coordinates of the points forming the break-point function
* @returns {object} {y: 'the output coordinate (y-axis)'}
* @memberof Essentia
*/
class BPF {
  private algoInstance: any;
  constructor(xPoints: any[]=[0, 1], yPoints: any[]=[0, 1]) {
    let vecxPoints = arrayToVector(xPoints);
    let vecyPoints = arrayToVector(yPoints);
    this.algoInstance = new wasmBackend.BPF(vecxPoints, vecyPoints);
  }
  configure(xPoints: any[]=[0, 1], yPoints: any[]=[0, 1]) {
    let vecxPoints = arrayToVector(xPoints);
    let vecyPoints = arrayToVector(yPoints);
    this.algoInstance.configure(vecxPoints, vecyPoints);
  }
  compute(x: number) {
    return this.algoInstance.compute(x);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements a 2nd order IIR band-pass filter. Because of its dependence on IIR, IIR's requirements are inherited. Check https://essentia.upf.edu/reference/std_BandPass.html for more details.
* @class
* @param {VectorFloat} signal the input audio signal
* @param {number} [bandwidth=500] the bandwidth of the filter [Hz]
* @param {number} [cutoffFrequency=1500] the cutoff frequency for the filter [Hz]
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {signal: 'the filtered signal'}
* @memberof Essentia
*/
class BandPass {
  private algoInstance: any;
  constructor(bandwidth: number=500, cutoffFrequency: number=1500, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.BandPass(bandwidth, cutoffFrequency, sampleRate);
  }
  configure(bandwidth: number=500, cutoffFrequency: number=1500, sampleRate: number=44100) {
    this.algoInstance.configure(bandwidth, cutoffFrequency, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements a 2nd order IIR band-reject filter. Because of its dependence on IIR, IIR's requirements are inherited. Check https://essentia.upf.edu/reference/std_BandReject.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {number} [bandwidth=500] the bandwidth of the filter [Hz]
* @param {number} [cutoffFrequency=1500] the cutoff frequency for the filter [Hz]
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {signal: 'the filtered signal'}
* @memberof Essentia
*/
class BandReject {
  private algoInstance: any;
  constructor(bandwidth: number=500, cutoffFrequency: number=1500, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.BandReject(bandwidth, cutoffFrequency, sampleRate);
  }
  configure(bandwidth: number=500, cutoffFrequency: number=1500, sampleRate: number=44100) {
    this.algoInstance.configure(bandwidth, cutoffFrequency, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes energy in Bark bands of a spectrum. The band frequencies are: [0.0, 50.0, 100.0, 150.0, 200.0, 300.0, 400.0, 510.0, 630.0, 770.0, 920.0, 1080.0, 1270.0, 1480.0, 1720.0, 2000.0, 2320.0, 2700.0, 3150.0, 3700.0, 4400.0, 5300.0, 6400.0, 7700.0, 9500.0, 12000.0, 15500.0, 20500.0, 27000.0]. The first two Bark bands [0,100] and [100,200] have been split in half for better resolution (because of an observed better performance in beat detection). For each bark band the power-spectrum (mag-squared) is summed. Check https://essentia.upf.edu/reference/std_BarkBands.html for more details.
* @class
* @param {VectorFloat} spectrum the input spectrum
* @param {number} [numberBands=27] the number of desired barkbands
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {bands: 'the energy of the bark bands'}
* @memberof Essentia
*/
class BarkBands {
  private algoInstance: any;
  constructor(numberBands: number=27, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.BarkBands(numberBands, sampleRate);
  }
  configure(numberBands: number=27, sampleRate: number=44100) {
    this.algoInstance.configure(numberBands, sampleRate);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the beat positions given an input signal. It computes 'complex spectral difference' onset detection function and utilizes the beat tracking algorithm (TempoTapDegara) to extract beats [1]. The algorithm works with the optimized settings of 2048/1024 frame/hop size for the computation of the detection function, with its posterior x2 resampling.) While it has a lower accuracy than BeatTrackerMultifeature (see the evaluation results in [2]), its computational speed is significantly higher, which makes reasonable to apply this algorithm for batch processings of large amounts of audio signals. Check https://essentia.upf.edu/reference/std_BeatTrackerDegara.html for more details.
* @class
* @param {VectorFloat} signal the audio input signal
* @param {number} [maxTempo=208] the fastest tempo to detect [bpm]
* @param {number} [minTempo=40] the slowest tempo to detect [bpm]
* @returns {object} {ticks: ' the estimated tick locations [s]'}
* @memberof Essentia
*/
class BeatTrackerDegara {
  private algoInstance: any;
  constructor(maxTempo: number=208, minTempo: number=40) {
    this.algoInstance = new wasmBackend.BeatTrackerDegara(maxTempo, minTempo);
  }
  configure(maxTempo: number=208, minTempo: number=40) {
    this.algoInstance.configure(maxTempo, minTempo);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the beat positions given an input signal. It computes a number of onset detection functions and estimates beat location candidates from them using TempoTapDegara algorithm. Thereafter the best candidates are selected using TempoTapMaxAgreement. The employed detection functions, and the optimal frame/hop sizes used for their computation are:
  - complex spectral difference (see 'complex' method in OnsetDetection algorithm, 2048/1024 with posterior x2 upsample or the detection function)
  - energy flux (see 'rms' method in OnsetDetection algorithm, the same settings)
  - spectral flux in Mel-frequency bands (see 'melflux' method in OnsetDetection algorithm, the same settings)
  - beat emphasis function (see 'beat_emphasis' method in OnsetDetectionGlobal algorithm, 2048/512)
  - spectral flux between histogrammed spectrum frames, measured by the modified information gain (see 'infogain' method in OnsetDetectionGlobal algorithm, 2048/512) Check https://essentia.upf.edu/reference/std_BeatTrackerMultiFeature.html for more details.
* @class
* @param {VectorFloat} signal the audio input signal
* @param {number} [maxTempo=208] the fastest tempo to detect [bpm]
* @param {number} [minTempo=40] the slowest tempo to detect [bpm]
* @returns {object} {ticks: ' the estimated tick locations [s]', confidence: 'confidence of the beat tracker [0, 5.32]'}
* @memberof Essentia
*/
class BeatTrackerMultiFeature {
  private algoInstance: any;
  constructor(maxTempo: number=208, minTempo: number=40) {
    this.algoInstance = new wasmBackend.BeatTrackerMultiFeature(maxTempo, minTempo);
  }
  configure(maxTempo: number=208, minTempo: number=40) {
    this.algoInstance.configure(maxTempo, minTempo);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm filters the loudness matrix given by BeatsLoudness algorithm in order to keep only the most salient beat band representation.
This algorithm has been found to be useful for estimating time signatures. Check https://essentia.upf.edu/reference/std_Beatogram.html for more details.
* @class
* @param {VectorFloat} loudness the loudness at each beat
* @param {VectorVectorFloat} loudnessBandRatio matrix of loudness ratios at each band and beat
* @param {number} [size=16] number of beats for dynamic filtering
* @returns {object} {beatogram: 'filtered matrix loudness'}
* @memberof Essentia
*/
class Beatogram {
  private algoInstance: any;
  constructor(size: number=16) {
    this.algoInstance = new wasmBackend.Beatogram(size);
  }
  configure(size: number=16) {
    this.algoInstance.configure(size);
  }
  compute(loudness: any, loudnessBandRatio: any) {
    return this.algoInstance.compute(loudness, loudnessBandRatio);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the spectrum energy of beats in an audio signal given their positions. The energy is computed both on the whole frequency range and for each of the specified frequency bands. See the SingleBeatLoudness algorithm for a more detailed explanation. Check https://essentia.upf.edu/reference/std_BeatsLoudness.html for more details.
* @class
* @param {VectorFloat} signal the input audio signal
* @param {number} [beatDuration=0.05] the duration of the window in which the beat will be restricted [s]
* @param {number} [beatWindowDuration=0.1] the duration of the window in which to look for the beginning of the beat (centered around the positions in 'beats') [s]
* @param {any[]} [beats=[]] the list of beat positions (each position is in seconds)
* @param {any[]} [frequencyBands=[20, 150, 400, 3200, 7000, 22000]] the list of bands to compute energy ratios [Hz
* @param {number} [sampleRate=44100] the audio sampling rate [Hz]
* @returns {object} {loudness: 'the beat's energy in the whole spectrum', loudnessBandRatio: 'the ratio of the beat's energy on each frequency band'}
* @memberof Essentia
*/
class BeatsLoudness {
  private algoInstance: any;
  constructor(beatDuration: number=0.05, beatWindowDuration: number=0.1, beats: any[]=[], frequencyBands: any[]=[20, 150, 400, 3200, 7000, 22000], sampleRate: number=44100) {
    let vecbeats = arrayToVector(beats);
    let vecfrequencyBands = arrayToVector(frequencyBands);
    this.algoInstance = new wasmBackend.BeatsLoudness(beatDuration, beatWindowDuration, vecbeats, vecfrequencyBands, sampleRate);
  }
  configure(beatDuration: number=0.05, beatWindowDuration: number=0.1, beats: any[]=[], frequencyBands: any[]=[20, 150, 400, 3200, 7000, 22000], sampleRate: number=44100) {
    let vecbeats = arrayToVector(beats);
    let vecfrequencyBands = arrayToVector(frequencyBands);
    this.algoInstance.configure(beatDuration, beatWindowDuration, vecbeats, vecfrequencyBands, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm performs basic arithmetical operations element by element given two arrays.
Note:
  - using this algorithm in streaming mode can cause diamond shape graphs which have not been tested with the current scheduler. There is NO GUARANTEE of its correct work for diamond shape graphs.
  - for y=0, x/y is invalid Check https://essentia.upf.edu/reference/std_BinaryOperator.html for more details.
* @class
* @param {VectorFloat} array1 the first operand input array
* @param {VectorFloat} array2 the second operand input array
* @param {string} [type=add] the type of the binary operator to apply to the input arrays
* @returns {object} {array: 'the array containing the result of binary operation'}
* @memberof Essentia
*/
class BinaryOperator {
  private algoInstance: any;
  constructor(type: string='add') {
    this.algoInstance = new wasmBackend.BinaryOperator(type);
  }
  configure(type: string='add') {
    this.algoInstance.configure(type);
  }
  compute(array1: any, array2: any) {
    return this.algoInstance.compute(array1, array2);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm performs basic arithmetical operations element by element given two arrays.
Note:
  - using this algorithm in streaming mode can cause diamond shape graphs which have not been tested with the current scheduler. There is NO GUARANTEE of its correct work for diamond shape graphs.
  - for y=0, x/y is invalid Check https://essentia.upf.edu/reference/std_BinaryOperatorStream.html for more details.
* @class
* @param {VectorFloat} array1 the first operand input array
* @param {VectorFloat} array2 the second operand input array
* @param {string} [type=add] the type of the binary operator to apply to the input arrays
* @returns {object} {array: 'the array containing the result of binary operation'}
* @memberof Essentia
*/
class BinaryOperatorStream {
  private algoInstance: any;
  constructor(type: string='add') {
    this.algoInstance = new wasmBackend.BinaryOperatorStream(type);
  }
  configure(type: string='add') {
    this.algoInstance.configure(type);
  }
  compute(array1: any, array2: any) {
    return this.algoInstance.compute(array1, array2);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes beats per minute histogram and its statistics for the highest and second highest peak.
Note: histogram vector contains occurance frequency for each bpm value, 0-th element corresponds to 0 bpm value. Check https://essentia.upf.edu/reference/std_BpmHistogramDescriptors.html for more details.
* @class
* @param {VectorFloat} bpmIntervals the list of bpm intervals [s]
* @returns {object} {firstPeakBPM: 'value for the highest peak [bpm]', firstPeakWeight: 'weight of the highest peak', firstPeakSpread: 'spread of the highest peak', secondPeakBPM: 'value for the second highest peak [bpm]', secondPeakWeight: 'weight of the second highest peak', secondPeakSpread: 'spread of the second highest peak', histogram: 'bpm histogram [bpm]'}
* @memberof Essentia
*/
class BpmHistogramDescriptors {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.BpmHistogramDescriptors();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(bpmIntervals: any) {
    return this.algoInstance.compute(bpmIntervals);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm extracts the locations of large tempo changes from a list of beat ticks. Check https://essentia.upf.edu/reference/std_BpmRubato.html for more details.
* @class
* @param {VectorFloat} beats list of detected beat ticks [s]
* @param {number} [longRegionsPruningTime=20] time for the longest constant tempo region inside a rubato region [s]
* @param {number} [shortRegionsMergingTime=4] time for the shortest constant tempo region from one tempo region to another [s]
* @param {number} [tolerance=0.08] minimum tempo deviation to look for
* @returns {object} {rubatoStart: 'list of timestamps where the start of a rubato region was detected [s]', rubatoStop: 'list of timestamps where the end of a rubato region was detected [s]', rubatoNumber: 'number of detected rubato regions'}
* @memberof Essentia
*/
class BpmRubato {
  private algoInstance: any;
  constructor(longRegionsPruningTime: number=20, shortRegionsMergingTime: number=4, tolerance: number=0.08) {
    this.algoInstance = new wasmBackend.BpmRubato(longRegionsPruningTime, shortRegionsMergingTime, tolerance);
  }
  configure(longRegionsPruningTime: number=20, shortRegionsMergingTime: number=4, tolerance: number=0.08) {
    this.algoInstance.configure(longRegionsPruningTime, shortRegionsMergingTime, tolerance);
  }
  compute(beats: any) {
    return this.algoInstance.compute(beats);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm extracts the 0th, 1st, 2nd, 3rd and 4th central moments of an array. It returns a 5-tuple in which the index corresponds to the order of the moment. Check https://essentia.upf.edu/reference/std_CentralMoments.html for more details.
* @class
* @param {VectorFloat} array the input array
* @param {string} [mode=pdf] compute central moments considering array values as a probability density function over array index or as sample points of a distribution
* @param {number} [range=1] the range of the input array, used for normalizing the results in the 'pdf' mode
* @returns {object} {centralMoments: 'the central moments of the input array'}
* @memberof Essentia
*/
class CentralMoments {
  private algoInstance: any;
  constructor(mode: string='pdf', range: number=1) {
    this.algoInstance = new wasmBackend.CentralMoments(mode, range);
  }
  configure(mode: string='pdf', range: number=1) {
    this.algoInstance.configure(mode, range);
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the centroid of an array. The centroid is normalized to a specified range. This algorithm can be used to compute spectral centroid or temporal centroid. Check https://essentia.upf.edu/reference/std_Centroid.html for more details.
* @class
* @param {VectorFloat} array the input array
* @param {number} [range=1] the range of the input array, used for normalizing the results
* @returns {object} {centroid: 'the centroid of the array'}
* @memberof Essentia
*/
class Centroid {
  private algoInstance: any;
  constructor(range: number=1) {
    this.algoInstance = new wasmBackend.Centroid(range);
  }
  configure(range: number=1) {
    this.algoInstance.configure(range);
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* Given a chord progression this algorithm describes it by means of key, scale, histogram, and rate of change.
Note:
  - chordsHistogram indexes follow the circle of fifths order, while being shifted to the input key and scale
  - key and scale are taken from the most frequent chord. In the case where multiple chords are equally frequent, the chord is hierarchically chosen from the circle of fifths.
  - chords should follow this name convention `<A-G>[<#/b><m>]` (i.e. C, C# or C#m are valid chords). Chord names not fitting this convention will throw an exception. Check https://essentia.upf.edu/reference/std_ChordsDescriptors.html for more details.
* @class
* @param {VectorString} chords the chord progression
* @param {string} key the key of the whole song, from A to G
* @param {string} scale the scale of the whole song (major or minor)
* @returns {object} {chordsHistogram: 'the normalized histogram of chords', chordsNumberRate: 'the ratio of different chords from the total number of chords in the progression', chordsChangesRate: 'the rate at which chords change in the progression', chordsKey: 'the most frequent chord of the progression', chordsScale: 'the scale of the most frequent chord of the progression (either 'major' or 'minor')'}
* @memberof Essentia
*/
class ChordsDescriptors {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.ChordsDescriptors();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(chords: any, key: string, scale: string) {
    return this.algoInstance.compute(chords, key, scale);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates chords given an input sequence of harmonic pitch class profiles (HPCPs). It finds the best matching major or minor triad and outputs the result as a string (e.g. A#, Bm, G#m, C). The following note names are used in the output:
"A", "Bb", "B", "C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab".
Note:
  - The algorithm assumes that the sequence of the input HPCP frames has been computed with framesize = 2*hopsize
  - The algorithm estimates a sequence of chord values corresponding to the input HPCP frames (one chord value for each frame, estimated using a temporal window of HPCPs centered at that frame). Check https://essentia.upf.edu/reference/std_ChordsDetection.html for more details.
* @class
* @param {VectorVectorFloat} pcp the pitch class profile from which to detect the chord
* @param {number} [hopSize=2048] the hop size with which the input PCPs were computed
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {number} [windowSize=2] the size of the window on which to estimate the chords [s]
* @returns {object} {chords: 'the resulting chords, from A to G', strength: 'the strength of the chord'}
* @memberof Essentia
*/
class ChordsDetection {
  private algoInstance: any;
  constructor(hopSize: number=2048, sampleRate: number=44100, windowSize: number=2) {
    this.algoInstance = new wasmBackend.ChordsDetection(hopSize, sampleRate, windowSize);
  }
  configure(hopSize: number=2048, sampleRate: number=44100, windowSize: number=2) {
    this.algoInstance.configure(hopSize, sampleRate, windowSize);
  }
  compute(pcp: any) {
    return this.algoInstance.compute(pcp);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates chords using pitch profile classes on segments between beats. It is similar to ChordsDetection algorithm, but the chords are estimated on audio segments between each pair of consecutive beats. For each segment the estimation is done based on a chroma (HPCP) vector characterizing it, which can be computed by two methods:
  - 'interbeat_median', each resulting chroma vector component is a median of all the component values in the segment
  - 'starting_beat', chroma vector is sampled from the start of the segment (that is, its starting beat position) using its first frame. It makes sense if chroma is preliminary smoothed. Check https://essentia.upf.edu/reference/std_ChordsDetectionBeats.html for more details.
* @class
* @param {VectorVectorFloat} pcp the pitch class profile from which to detect the chord
* @param {VectorFloat} ticks the list of beat positions (in seconds). One chord will be outputted for each segment between two adjacent ticks. If number of ticks is smaller than 2, exception will be thrown. Those ticks that exceeded the pcp time length will be ignored.
* @param {string} [chromaPick=interbeat_median] method of calculating singleton chroma for interbeat interval
* @param {number} [hopSize=2048] the hop size with which the input PCPs were computed
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {chords: 'the resulting chords, from A to G', strength: 'the strength of the chords'}
* @memberof Essentia
*/
class ChordsDetectionBeats {
  private algoInstance: any;
  constructor(chromaPick: string='interbeat_median', hopSize: number=2048, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.ChordsDetectionBeats(chromaPick, hopSize, sampleRate);
  }
  configure(chromaPick: string='interbeat_median', hopSize: number=2048, sampleRate: number=44100) {
    this.algoInstance.configure(chromaPick, hopSize, sampleRate);
  }
  compute(pcp: any, ticks: any) {
    return this.algoInstance.compute(pcp, ticks);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes a binary cross similarity matrix from two chromagam feature vectors of a query and reference song. Check https://essentia.upf.edu/reference/std_ChromaCrossSimilarity.html for more details.
* @class
* @param {VectorVectorFloat} queryFeature frame-wise chromagram of the query song (e.g., a HPCP)
* @param {VectorVectorFloat} referenceFeature frame-wise chromagram of the reference song (e.g., a HPCP)
* @param {number} [binarizePercentile=0.095] maximum percent of distance values to consider as similar in each row and each column
* @param {number} [frameStackSize=9] number of input frames to stack together and treat as a feature vector for similarity computation. Choose 'frameStackSize=1' to use the original input frames without stacking
* @param {number} [frameStackStride=1] stride size to form a stack of frames (e.g., 'frameStackStride'=1 to use consecutive frames; 'frameStackStride'=2 for using every second frame)
* @param {number} [noti=12] number of circular shifts to be checked for Optimal Transposition Index [1]
* @param {boolean} [oti=true] whether to transpose the key of the reference song to the query song by Optimal Transposition Index [1]
* @param {boolean} [otiBinary=false] whether to use the OTI-based chroma binary similarity method [3]
* @param {boolean} [streaming=false] whether to accumulate the input 'queryFeature' in the euclidean similarity matrix calculation on each compute() method call
* @returns {object} {csm: '2D binary cross-similarity matrix of the query and reference features'}
* @memberof Essentia
*/
class ChromaCrossSimilarity {
  private algoInstance: any;
  constructor(binarizePercentile: number=0.095, frameStackSize: number=9, frameStackStride: number=1, noti: number=12, oti: boolean=true, otiBinary: boolean=false, streaming: boolean=false) {
    this.algoInstance = new wasmBackend.ChromaCrossSimilarity(binarizePercentile, frameStackSize, frameStackStride, noti, oti, otiBinary, streaming);
  }
  configure(binarizePercentile: number=0.095, frameStackSize: number=9, frameStackStride: number=1, noti: number=12, oti: boolean=true, otiBinary: boolean=false, streaming: boolean=false) {
    this.algoInstance.configure(binarizePercentile, frameStackSize, frameStackStride, noti, oti, otiBinary, streaming);
  }
  compute(queryFeature: any, referenceFeature: any) {
    return this.algoInstance.compute(queryFeature, referenceFeature);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the Constant-Q chromagram using FFT. See ConstantQ algorithm for more details.
 Check https://essentia.upf.edu/reference/std_Chromagram.html for more details.
* @class
* @param {VectorFloat} frame the input audio frame
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
* @returns {object} {chromagram: 'the magnitude constant-Q chromagram'}
* @memberof Essentia
*/
class Chromagram {
  private algoInstance: any;
  constructor(binsPerOctave: number=12, minFrequency: number=32.7, minimumKernelSize: number=4, normalizeType: string='unit_max', numberBins: number=84, sampleRate: number=44100, scale: number=1, threshold: number=0.01, windowType: string='hann', zeroPhase: boolean=true) {
    this.algoInstance = new wasmBackend.Chromagram(binsPerOctave, minFrequency, minimumKernelSize, normalizeType, numberBins, sampleRate, scale, threshold, windowType, zeroPhase);
  }
  configure(binsPerOctave: number=12, minFrequency: number=32.7, minimumKernelSize: number=4, normalizeType: string='unit_max', numberBins: number=84, sampleRate: number=44100, scale: number=1, threshold: number=0.01, windowType: string='hann', zeroPhase: boolean=true) {
    this.algoInstance.configure(binsPerOctave, minFrequency, minimumKernelSize, normalizeType, numberBins, sampleRate, scale, threshold, windowType, zeroPhase);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm detects the locations of impulsive noises (clicks and pops) on the input audio frame. It relies on LPC coefficients to inverse-filter the audio in order to attenuate the stationary part and enhance the prediction error (or excitation noise)[1]. After this, a matched filter is used to further enhance the impulsive peaks. The detection threshold is obtained from a robust estimate of the excitation noise power [2] plus a parametric gain value. Check https://essentia.upf.edu/reference/std_ClickDetector.html for more details.
* @class
* @param {VectorFloat} frame the input frame (must be non-empty)
* @param {number} [detectionThreshold=30] 'detectionThreshold' the threshold is based on the instant power of the noisy excitation signal plus detectionThreshold dBs
* @param {number} [frameSize=512] the expected size of the input audio signal (this is an optional parameter to optimize memory allocation)
* @param {number} [hopSize=256] hop size used for the analysis. This parameter must be set correctly as it cannot be obtained from the input data
* @param {number} [order=12] scalar giving the number of LPCs to use
* @param {number} [powerEstimationThreshold=10] the noisy excitation is clipped to 'powerEstimationThreshold' times its median.
* @param {number} [sampleRate=44100] sample rate used for the analysis
* @param {number} [silenceThreshold=-50] threshold to skip silent frames
* @returns {object} {starts: 'starting indexes of the clicks', ends: 'ending indexes of the clicks'}
* @memberof Essentia
*/
class ClickDetector {
  private algoInstance: any;
  constructor(detectionThreshold: number=30, frameSize: number=512, hopSize: number=256, order: number=12, powerEstimationThreshold: number=10, sampleRate: number=44100, silenceThreshold: number=-50) {
    this.algoInstance = new wasmBackend.ClickDetector(detectionThreshold, frameSize, hopSize, order, powerEstimationThreshold, sampleRate, silenceThreshold);
  }
  configure(detectionThreshold: number=30, frameSize: number=512, hopSize: number=256, order: number=12, powerEstimationThreshold: number=10, sampleRate: number=44100, silenceThreshold: number=-50) {
    this.algoInstance.configure(detectionThreshold, frameSize, hopSize, order, powerEstimationThreshold, sampleRate, silenceThreshold);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm clips the input signal to fit its values into a specified interval. Check https://essentia.upf.edu/reference/std_Clipper.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {number} [max=1] the maximum value above which the signal will be clipped
* @param {number} [min=-1] the minimum value below which the signal will be clipped
* @returns {object} {signal: 'the output signal with the added noise'}
* @memberof Essentia
*/
class Clipper {
  private algoInstance: any;
  constructor(max: number=1, min: number=-1) {
    this.algoInstance = new wasmBackend.Clipper(max, min);
  }
  configure(max: number=1, min: number=-1) {
    this.algoInstance.configure(max, min);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes a cover song similiarity measure from a binary cross similarity matrix input between two chroma vectors of a query and reference song using various alignment constraints of smith-waterman local-alignment algorithm. Check https://essentia.upf.edu/reference/std_CoverSongSimilarity.html for more details.
* @class
* @param {VectorVectorFloat} inputArray  a 2D binary cross-similarity matrix between two audio chroma vectors (query vs reference song) (refer 'ChromaCrossSimilarity' algorithm').
* @param {string} [alignmentType=serra09] choose either one of the given local-alignment constraints for smith-waterman algorithm as described in [2] or [3] respectively.
* @param {number} [disExtension=0.5] penalty for disruption extension
* @param {number} [disOnset=0.5] penalty for disruption onset
* @param {string} [distanceType=asymmetric] choose the type of distance. By default the algorithm outputs a asymmetric distance which is obtained by normalising the maximum score in the alignment score matrix with length of reference song
* @returns {object} {scoreMatrix: 'a 2D smith-waterman alignment score matrix from the input binary cross-similarity matrix', distance: 'cover song similarity distance between the query and reference song from the input similarity matrix. Either 'asymmetric' (as described in [2]) or 'symmetric' (maximum score in the alignment score matrix).'}
* @memberof Essentia
*/
class CoverSongSimilarity {
  private algoInstance: any;
  constructor(alignmentType: string='serra09', disExtension: number=0.5, disOnset: number=0.5, distanceType: string='asymmetric') {
    this.algoInstance = new wasmBackend.CoverSongSimilarity(alignmentType, disExtension, disOnset, distanceType);
  }
  configure(alignmentType: string='serra09', disExtension: number=0.5, disOnset: number=0.5, distanceType: string='asymmetric') {
    this.algoInstance.configure(alignmentType, disExtension, disOnset, distanceType);
  }
  compute(inputArray: any) {
    return this.algoInstance.compute(inputArray);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the crest of an array. The crest is defined as the ratio between the maximum value and the arithmetic mean of an array. Typically it is used on the magnitude spectrum. Check https://essentia.upf.edu/reference/std_Crest.html for more details.
* @class
* @param {VectorFloat} array the input array (cannot contain negative values, and must be non-empty)
* @returns {object} {crest: 'the crest of the input array'}
* @memberof Essentia
*/
class Crest {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.Crest();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the cross-correlation vector of two signals. It accepts 2 parameters, minLag and maxLag which define the range of the computation of the innerproduct. Check https://essentia.upf.edu/reference/std_CrossCorrelation.html for more details.
* @class
* @param {VectorFloat} arrayX the first input array
* @param {VectorFloat} arrayY the second input array
* @param {number} [maxLag=1] the maximum lag to be computed between the two vectors
* @param {number} [minLag=0] the minimum lag to be computed between the two vectors
* @returns {object} {crossCorrelation: 'the cross-correlation vector between the two input arrays (its size is equal to maxLag - minLag + 1)'}
* @memberof Essentia
*/
class CrossCorrelation {
  private algoInstance: any;
  constructor(maxLag: number=1, minLag: number=0) {
    this.algoInstance = new wasmBackend.CrossCorrelation(maxLag, minLag);
  }
  configure(maxLag: number=1, minLag: number=0) {
    this.algoInstance.configure(maxLag, minLag);
  }
  compute(arrayX: any, arrayY: any) {
    return this.algoInstance.compute(arrayX, arrayY);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes a euclidean cross-similarity matrix of two sequences of frame features. Similarity values can be optionally binarized Check https://essentia.upf.edu/reference/std_CrossSimilarityMatrix.html for more details.
* @class
* @param {VectorVectorFloat} queryFeature input frame features of the query song (e.g., a chromagram)
* @param {VectorVectorFloat} referenceFeature input frame features of the reference song (e.g., a chromagram)
* @param {boolean} [binarize=false] whether to binarize the euclidean cross-similarity matrix
* @param {number} [binarizePercentile=0.095] maximum percent of distance values to consider as similar in each row and each column
* @param {number} [frameStackSize=1] number of input frames to stack together and treat as a feature vector for similarity computation. Choose 'frameStackSize=1' to use the original input frames without stacking
* @param {number} [frameStackStride=1] stride size to form a stack of frames (e.g., 'frameStackStride'=1 to use consecutive frames; 'frameStackStride'=2 for using every second frame)
* @returns {object} {csm: '2D cross-similarity matrix of two input frame sequences (query vs reference)'}
* @memberof Essentia
*/
class CrossSimilarityMatrix {
  private algoInstance: any;
  constructor(binarize: boolean=false, binarizePercentile: number=0.095, frameStackSize: number=1, frameStackStride: number=1) {
    this.algoInstance = new wasmBackend.CrossSimilarityMatrix(binarize, binarizePercentile, frameStackSize, frameStackStride);
  }
  configure(binarize: boolean=false, binarizePercentile: number=0.095, frameStackSize: number=1, frameStackStride: number=1) {
    this.algoInstance.configure(binarize, binarizePercentile, frameStackSize, frameStackStride);
  }
  compute(queryFeature: any, referenceFeature: any) {
    return this.algoInstance.compute(queryFeature, referenceFeature);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* Computes the second derivatives of a piecewise cubic spline.
The input value, i.e. the point at which the spline is to be evaluated typically should be between xPoints[0] and xPoints[size-1]. If the value lies outside this range, extrapolation is used.
Regarding [left/right] boundary condition flag parameters:
  - 0: the cubic spline should be a quadratic over the first interval
  - 1: the first derivative at the [left/right] endpoint should be [left/right]BoundaryFlag
  - 2: the second derivative at the [left/right] endpoint should be [left/right]BoundaryFlag
References:
  [1] Spline interpolation - Wikipedia, the free encyclopedia,
  http://en.wikipedia.org/wiki/Spline_interpolation Check https://essentia.upf.edu/reference/std_CubicSpline.html for more details.
* @class
* @param {number} x the input coordinate (x-axis)
* @param {number} [leftBoundaryFlag=0] type of boundary condition for the left boundary
* @param {number} [leftBoundaryValue=0] the value to be used in the left boundary, when leftBoundaryFlag is 1 or 2
* @param {number} [rightBoundaryFlag=0] type of boundary condition for the right boundary
* @param {number} [rightBoundaryValue=0] the value to be used in the right boundary, when rightBoundaryFlag is 1 or 2
* @param {any[]} [xPoints=[0, 1]] the x-coordinates where data is specified (the points must be arranged in ascending order and cannot contain duplicates)
* @param {any[]} [yPoints=[0, 1]] the y-coordinates to be interpolated (i.e. the known data)
* @returns {object} {y: 'the value of the spline at x', dy: 'the first derivative of the spline at x', ddy: 'the second derivative of the spline at x'}
* @memberof Essentia
*/
class CubicSpline {
  private algoInstance: any;
  constructor(leftBoundaryFlag: number=0, leftBoundaryValue: number=0, rightBoundaryFlag: number=0, rightBoundaryValue: number=0, xPoints: any[]=[0, 1], yPoints: any[]=[0, 1]) {
    let vecxPoints = arrayToVector(xPoints);
    let vecyPoints = arrayToVector(yPoints);
    this.algoInstance = new wasmBackend.CubicSpline(leftBoundaryFlag, leftBoundaryValue, rightBoundaryFlag, rightBoundaryValue, vecxPoints, vecyPoints);
  }
  configure(leftBoundaryFlag: number=0, leftBoundaryValue: number=0, rightBoundaryFlag: number=0, rightBoundaryValue: number=0, xPoints: any[]=[0, 1], yPoints: any[]=[0, 1]) {
    let vecxPoints = arrayToVector(xPoints);
    let vecyPoints = arrayToVector(yPoints);
    this.algoInstance.configure(leftBoundaryFlag, leftBoundaryValue, rightBoundaryFlag, rightBoundaryValue, vecxPoints, vecyPoints);
  }
  compute(x: number) {
    return this.algoInstance.compute(x);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm removes the DC offset from a signal using a 1st order IIR highpass filter. Because of its dependence on IIR, IIR's requirements are inherited. Check https://essentia.upf.edu/reference/std_DCRemoval.html for more details.
* @class
* @param {VectorFloat} signal the input audio signal
* @param {number} [cutoffFrequency=40] the cutoff frequency for the filter [Hz]
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {signal: 'the filtered signal, with the DC component removed'}
* @memberof Essentia
*/
class DCRemoval {
  private algoInstance: any;
  constructor(cutoffFrequency: number=40, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.DCRemoval(cutoffFrequency, sampleRate);
  }
  configure(cutoffFrequency: number=40, sampleRate: number=44100) {
    this.algoInstance.configure(cutoffFrequency, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the Discrete Cosine Transform of an array.
It uses the DCT-II form, with the 1/sqrt(2) scaling factor for the first coefficient. Check https://essentia.upf.edu/reference/std_DCT.html for more details.
* @class
* @param {VectorFloat} array the input array
* @param {number} [dctType=2] the DCT type
* @param {number} [inputSize=10] the size of the input array
* @param {number} [liftering=0] the liftering coefficient. Use '0' to bypass it
* @param {number} [outputSize=10] the number of output coefficients
* @returns {object} {dct: 'the discrete cosine transform of the input array'}
* @memberof Essentia
*/
class DCT {
  private algoInstance: any;
  constructor(dctType: number=2, inputSize: number=10, liftering: number=0, outputSize: number=10) {
    this.algoInstance = new wasmBackend.DCT(dctType, inputSize, liftering, outputSize);
  }
  configure(dctType: number=2, inputSize: number=10, liftering: number=0, outputSize: number=10) {
    this.algoInstance.configure(dctType, inputSize, liftering, outputSize);
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates danceability of a given audio signal. The algorithm is derived from Detrended Fluctuation Analysis (DFA) described in [1]. The parameters minTau and maxTau are used to define the range of time over which DFA will be performed. The output of this algorithm is the danceability of the audio signal. These values usually range from 0 to 3 (higher values meaning more danceable). Check https://essentia.upf.edu/reference/std_Danceability.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {number} [maxTau=8800] maximum segment length to consider [ms]
* @param {number} [minTau=310] minimum segment length to consider [ms]
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {number} [tauMultiplier=1.1] multiplier to increment from min to max tau
* @returns {object} {danceability: 'the danceability value. Normal values range from 0 to ~3. The higher, the more danceable.', dfa: 'the DFA exponent vector for considered segment length (tau) values'}
* @memberof Essentia
*/
class Danceability {
  private algoInstance: any;
  constructor(maxTau: number=8800, minTau: number=310, sampleRate: number=44100, tauMultiplier: number=1.1) {
    this.algoInstance = new wasmBackend.Danceability(maxTau, minTau, sampleRate, tauMultiplier);
  }
  configure(maxTau: number=8800, minTau: number=310, sampleRate: number=44100, tauMultiplier: number=1.1) {
    this.algoInstance.configure(maxTau, minTau, sampleRate, tauMultiplier);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the decrease of an array defined as the linear regression coefficient. The range parameter is used to normalize the result. For a spectral centroid, the range should be equal to Nyquist and for an audio centroid the range should be equal to (audiosize - 1) / samplerate.
The size of the input array must be at least two elements for "decrease" to be computed, otherwise an exception is thrown.
References:
  [1] Least Squares Fitting -- from Wolfram MathWorld,
  http://mathworld.wolfram.com/LeastSquaresFitting.html Check https://essentia.upf.edu/reference/std_Decrease.html for more details.
* @class
* @param {VectorFloat} array the input array
* @param {number} [range=1] the range of the input array, used for normalizing the results
* @returns {object} {decrease: 'the decrease of the input array'}
* @memberof Essentia
*/
class Decrease {
  private algoInstance: any;
  constructor(range: number=1) {
    this.algoInstance = new wasmBackend.Decrease(range);
  }
  configure(range: number=1) {
    this.algoInstance.configure(range);
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm returns the first-order derivative of an input signal. That is, for each input value it returns the value minus the previous one. Check https://essentia.upf.edu/reference/std_Derivative.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @returns {object} {signal: 'the derivative of the input signal'}
* @memberof Essentia
*/
class Derivative {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.Derivative();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes two descriptors that are based on the derivative of a signal envelope. Check https://essentia.upf.edu/reference/std_DerivativeSFX.html for more details.
* @class
* @param {VectorFloat} envelope the envelope of the signal
* @returns {object} {derAvAfterMax: 'the weighted average of the derivative after the maximum amplitude', maxDerBeforeMax: 'the maximum derivative before the maximum amplitude'}
* @memberof Essentia
*/
class DerivativeSFX {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.DerivativeSFX();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(envelope: any) {
    return this.algoInstance.compute(envelope);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm uses LPC and some heuristics to detect discontinuities in an audio signal. [1]. Check https://essentia.upf.edu/reference/std_DiscontinuityDetector.html for more details.
* @class
* @param {VectorFloat} frame the input frame (must be non-empty)
* @param {number} [detectionThreshold=8] 'detectionThreshold' times the standard deviation plus the median of the frame is used as detection threshold
* @param {number} [energyThreshold=-60] threshold in dB to detect silent subframes
* @param {number} [frameSize=512] the expected size of the input audio signal (this is an optional parameter to optimize memory allocation)
* @param {number} [hopSize=256] hop size used for the analysis. This parameter must be set correctly as it cannot be obtained from the input data
* @param {number} [kernelSize=7] scalar giving the size of the median filter window. Must be odd
* @param {number} [order=3] scalar giving the number of LPCs to use
* @param {number} [silenceThreshold=-50] threshold to skip silent frames
* @param {number} [subFrameSize=32] size of the window used to compute silent subframes
* @returns {object} {discontinuityLocations: 'the index of the detected discontinuities (if any)', discontinuityAmplitudes: 'the peak values of the prediction error for the discontinuities (if any)'}
* @memberof Essentia
*/
class DiscontinuityDetector {
  private algoInstance: any;
  constructor(detectionThreshold: number=8, energyThreshold: number=-60, frameSize: number=512, hopSize: number=256, kernelSize: number=7, order: number=3, silenceThreshold: number=-50, subFrameSize: number=32) {
    this.algoInstance = new wasmBackend.DiscontinuityDetector(detectionThreshold, energyThreshold, frameSize, hopSize, kernelSize, order, silenceThreshold, subFrameSize);
  }
  configure(detectionThreshold: number=8, energyThreshold: number=-60, frameSize: number=512, hopSize: number=256, kernelSize: number=7, order: number=3, silenceThreshold: number=-50, subFrameSize: number=32) {
    this.algoInstance.configure(detectionThreshold, energyThreshold, frameSize, hopSize, kernelSize, order, silenceThreshold, subFrameSize);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the sensory dissonance of an audio signal given its spectral peaks. Sensory dissonance (to be distinguished from musical or theoretical dissonance) measures perceptual roughness of the sound and is based on the roughness of its spectral peaks. Given the spectral peaks, the algorithm estimates total dissonance by summing up the normalized dissonance values for each pair of peaks. These values are computed using dissonance curves, which define dissonace between two spectral peaks according to their frequency and amplitude relations. The dissonance curves are based on perceptual experiments conducted in [1].
Exceptions are thrown when the size of the input vectors are not equal or if input frequencies are not ordered ascendantly
References:
  [1] R. Plomp and W. J. M. Levelt, "Tonal Consonance and Critical
  Bandwidth," The Journal of the Acoustical Society of America, vol. 38,
  no. 4, pp. 548–560, 1965. Check https://essentia.upf.edu/reference/std_Dissonance.html for more details.
* @class
* @param {VectorFloat} frequencies the frequencies of the spectral peaks (must be sorted by frequency)
* @param {VectorFloat} magnitudes the magnitudes of the spectral peaks (must be sorted by frequency
* @returns {object} {dissonance: 'the dissonance of the audio signal (0 meaning completely consonant, and 1 meaning completely dissonant)'}
* @memberof Essentia
*/
class Dissonance {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.Dissonance();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(frequencies, magnitudes);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the spread (variance), skewness and kurtosis of an array given its central moments. The extracted features are good indicators of the shape of the distribution. For the required input see CentralMoments algorithm.
The size of the input array must be at least 5. An exception will be thrown otherwise. Check https://essentia.upf.edu/reference/std_DistributionShape.html for more details.
* @class
* @param {VectorFloat} centralMoments the central moments of a distribution
* @returns {object} {spread: 'the spread (variance) of the distribution', skewness: 'the skewness of the distribution', kurtosis: 'the kurtosis of the distribution'}
* @memberof Essentia
*/
class DistributionShape {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.DistributionShape();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(centralMoments: any) {
    return this.algoInstance.compute(centralMoments);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm outputs the total duration of an audio signal. Check https://essentia.upf.edu/reference/std_Duration.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {duration: 'the duration of the signal [s]'}
* @memberof Essentia
*/
class Duration {
  private algoInstance: any;
  constructor(sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.Duration(sampleRate);
  }
  configure(sampleRate: number=44100) {
    this.algoInstance.configure(sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the dynamic complexity defined as the average absolute deviation from the global loudness level estimate on the dB scale. It is related to the dynamic range and to the amount of fluctuation in loudness present in a recording. Silence at the beginning and at the end of a track are ignored in the computation in order not to deteriorate the results. Check https://essentia.upf.edu/reference/std_DynamicComplexity.html for more details.
* @class
* @param {VectorFloat} signal the input audio signal
* @param {number} [frameSize=0.2] the frame size [s]
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {dynamicComplexity: 'the dynamic complexity coefficient', loudness: 'an estimate of the loudness [dB]'}
* @memberof Essentia
*/
class DynamicComplexity {
  private algoInstance: any;
  constructor(frameSize: number=0.2, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.DynamicComplexity(frameSize, sampleRate);
  }
  configure(frameSize: number=0.2, sampleRate: number=44100) {
    this.algoInstance.configure(frameSize, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes energies/magnitudes in ERB bands of a spectrum. The Equivalent Rectangular Bandwidth (ERB) scale is used. The algorithm applies a frequency domain filterbank using gammatone filters. Adapted from matlab code in:  D. P. W. Ellis (2009). 'Gammatone-like spectrograms', web resource [1]. Check https://essentia.upf.edu/reference/std_ERBBands.html for more details.
* @class
* @param {VectorFloat} spectrum the audio spectrum
* @param {number} [highFrequencyBound=22050] an upper-bound limit for the frequencies to be included in the bands
* @param {number} [inputSize=1025] the size of the spectrum
* @param {number} [lowFrequencyBound=50] a lower-bound limit for the frequencies to be included in the bands
* @param {number} [numberBands=40] the number of output bands
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {string} [type=power] use magnitude or power spectrum
* @param {number} [width=1] filter width with respect to ERB
* @returns {object} {bands: 'the energies/magnitudes of each band'}
* @memberof Essentia
*/
class ERBBands {
  private algoInstance: any;
  constructor(highFrequencyBound: number=22050, inputSize: number=1025, lowFrequencyBound: number=50, numberBands: number=40, sampleRate: number=44100, type: string='power', width: number=1) {
    this.algoInstance = new wasmBackend.ERBBands(highFrequencyBound, inputSize, lowFrequencyBound, numberBands, sampleRate, type, width);
  }
  configure(highFrequencyBound: number=22050, inputSize: number=1025, lowFrequencyBound: number=50, numberBands: number=40, sampleRate: number=44100, type: string='power', width: number=1) {
    this.algoInstance.configure(highFrequencyBound, inputSize, lowFrequencyBound, numberBands, sampleRate, type, width);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the effective duration of an envelope signal. The effective duration is a measure of the time the signal is perceptually meaningful. This is approximated by the time the envelope is above or equal to a given threshold and is above the -90db noise floor. This measure allows to distinguish percussive sounds from sustained sounds but depends on the signal length.
By default, this algorithm uses 40% of the envelope maximum as the threshold which is suited for short sounds. Note, that the 0% thresold corresponds to the duration of signal above -90db noise floor, while the 100% thresold corresponds to the number of times the envelope takes its maximum value.
References:
  [1] G. Peeters, "A large set of audio features for sound description
  (similarity and classification) in the CUIDADO project," CUIDADO I.S.T.
  Project Report, 2004 Check https://essentia.upf.edu/reference/std_EffectiveDuration.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {number} [thresholdRatio=0.4] the ratio of the envelope maximum to be used as the threshold
* @returns {object} {effectiveDuration: 'the effective duration of the signal [s]'}
* @memberof Essentia
*/
class EffectiveDuration {
  private algoInstance: any;
  constructor(sampleRate: number=44100, thresholdRatio: number=0.4) {
    this.algoInstance = new wasmBackend.EffectiveDuration(sampleRate, thresholdRatio);
  }
  configure(sampleRate: number=44100, thresholdRatio: number=0.4) {
    this.algoInstance.configure(sampleRate, thresholdRatio);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the energy of an array. Check https://essentia.upf.edu/reference/std_Energy.html for more details.
* @class
* @param {VectorFloat} array the input array
* @returns {object} {energy: 'the energy of the input array'}
* @memberof Essentia
*/
class Energy {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.Energy();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes energy in a given frequency band of a spectrum including both start and stop cutoff frequencies.
Note that exceptions will be thrown when input spectrum is empty and if startCutoffFrequency is greater than stopCutoffFrequency. Check https://essentia.upf.edu/reference/std_EnergyBand.html for more details.
* @class
* @param {VectorFloat} spectrum the input frequency spectrum
* @param {number} [sampleRate=44100] the audio sampling rate [Hz]
* @param {number} [startCutoffFrequency=0] the start frequency from which to sum the energy [Hz]
* @param {number} [stopCutoffFrequency=100] the stop frequency to which to sum the energy [Hz]
* @returns {object} {energyBand: 'the energy in the frequency band'}
* @memberof Essentia
*/
class EnergyBand {
  private algoInstance: any;
  constructor(sampleRate: number=44100, startCutoffFrequency: number=0, stopCutoffFrequency: number=100) {
    this.algoInstance = new wasmBackend.EnergyBand(sampleRate, startCutoffFrequency, stopCutoffFrequency);
  }
  configure(sampleRate: number=44100, startCutoffFrequency: number=0, stopCutoffFrequency: number=100) {
    this.algoInstance.configure(sampleRate, startCutoffFrequency, stopCutoffFrequency);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the ratio of the spectral energy in the range [startFrequency, stopFrequency] over the total energy. Check https://essentia.upf.edu/reference/std_EnergyBandRatio.html for more details.
* @class
* @param {VectorFloat} spectrum the input audio spectrum
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {number} [startFrequency=0] the frequency from which to start summing the energy [Hz]
* @param {number} [stopFrequency=100] the frequency up to which to sum the energy [Hz]
* @returns {object} {energyBandRatio: 'the energy ratio of the specified band over the total energy'}
* @memberof Essentia
*/
class EnergyBandRatio {
  private algoInstance: any;
  constructor(sampleRate: number=44100, startFrequency: number=0, stopFrequency: number=100) {
    this.algoInstance = new wasmBackend.EnergyBandRatio(sampleRate, startFrequency, stopFrequency);
  }
  configure(sampleRate: number=44100, startFrequency: number=0, stopFrequency: number=100) {
    this.algoInstance.configure(sampleRate, startFrequency, stopFrequency);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the Shannon entropy of an array. Entropy can be used to quantify the peakiness of a distribution. This has been used for voiced/unvoiced decision in automatic speech recognition.  Check https://essentia.upf.edu/reference/std_Entropy.html for more details.
* @class
* @param {VectorFloat} array the input array (cannot contain negative values, and must be non-empty)
* @returns {object} {entropy: 'the entropy of the input array'}
* @memberof Essentia
*/
class Entropy {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.Entropy();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the envelope of a signal by applying a non-symmetric lowpass filter on a signal. By default it rectifies the signal, but that is optional. Check https://essentia.upf.edu/reference/std_Envelope.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {boolean} [applyRectification=true] whether to apply rectification (envelope based on the absolute value of signal)
* @param {number} [attackTime=10] the attack time of the first order lowpass in the attack phase [ms]
* @param {number} [releaseTime=1500] the release time of the first order lowpass in the release phase [ms]
* @param {number} [sampleRate=44100] the audio sampling rate [Hz]
* @returns {object} {signal: 'the resulting envelope of the signal'}
* @memberof Essentia
*/
class Envelope {
  private algoInstance: any;
  constructor(applyRectification: boolean=true, attackTime: number=10, releaseTime: number=1500, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.Envelope(applyRectification, attackTime, releaseTime, sampleRate);
  }
  configure(applyRectification: boolean=true, attackTime: number=10, releaseTime: number=1500, sampleRate: number=44100) {
    this.algoInstance.configure(applyRectification, attackTime, releaseTime, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements an equal-loudness filter. The human ear does not perceive sounds of all frequencies as having equal loudness, and to account for this, the signal is filtered by an inverted approximation of the equal-loudness curves. Technically, the filter is a cascade of a 10th order Yulewalk filter with a 2nd order Butterworth high pass filter. Check https://essentia.upf.edu/reference/std_EqualLoudness.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {signal: 'the filtered signal'}
* @memberof Essentia
*/
class EqualLoudness {
  private algoInstance: any;
  constructor(sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.EqualLoudness(sampleRate);
  }
  configure(sampleRate: number=44100) {
    this.algoInstance.configure(sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the flatness of an array, which is defined as the ratio between the geometric mean and the arithmetic mean. Check https://essentia.upf.edu/reference/std_Flatness.html for more details.
* @class
* @param {VectorFloat} array the input array
* @returns {object} {flatness: 'the flatness (ratio between the geometric and the arithmetic mean of the input array)'}
* @memberof Essentia
*/
class Flatness {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.Flatness();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the flatness of an array, which is defined as the ratio between the geometric mean and the arithmetic mean converted to dB scale. Check https://essentia.upf.edu/reference/std_FlatnessDB.html for more details.
* @class
* @param {VectorFloat} array the input array
* @returns {object} {flatnessDB: 'the flatness dB'}
* @memberof Essentia
*/
class FlatnessDB {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.FlatnessDB();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm calculates the flatness coefficient of a signal envelope. Check https://essentia.upf.edu/reference/std_FlatnessSFX.html for more details.
* @class
* @param {VectorFloat} envelope the envelope of the signal
* @returns {object} {flatness: 'the flatness coefficient'}
* @memberof Essentia
*/
class FlatnessSFX {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.FlatnessSFX();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(envelope: any) {
    return this.algoInstance.compute(envelope);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the spectral flux of a spectrum. Flux is defined as the L2-norm [1] or L1-norm [2] of the difference between two consecutive frames of the magnitude spectrum. The frames have to be of the same size in order to yield a meaningful result. The default L2-norm is used more commonly. Check https://essentia.upf.edu/reference/std_Flux.html for more details.
* @class
* @param {VectorFloat} spectrum the input spectrum
* @param {boolean} [halfRectify=false] half-rectify the differences in each spectrum bin
* @param {string} [norm=L2] the norm to use for difference computation
* @returns {object} {flux: 'the spectral flux of the input spectrum'}
* @memberof Essentia
*/
class Flux {
  private algoInstance: any;
  constructor(halfRectify: boolean=false, norm: string='L2') {
    this.algoInstance = new wasmBackend.Flux(halfRectify, norm);
  }
  configure(halfRectify: boolean=false, norm: string='L2') {
    this.algoInstance.configure(halfRectify, norm);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm slices the input buffer into frames. It returns a frame of a constant size and jumps a constant amount of samples forward in the buffer on every compute() call until no more frames can be extracted; empty frame vectors are returned afterwards. Incomplete frames (frames starting before the beginning of the input buffer or going past its end) are zero-padded or dropped according to the "validFrameThresholdRatio" parameter. Check https://essentia.upf.edu/reference/std_FrameCutter.html for more details.
* @class
* @param {VectorFloat} signal the buffer from which to read data
* @param {number} [frameSize=1024] the output frame size
* @param {number} [hopSize=512] the hop size between frames
* @param {boolean} [lastFrameToEndOfFile=false] whether the beginning of the last frame should reach the end of file. Only applicable if startFromZero is true
* @param {boolean} [startFromZero=false] whether to start the first frame at time 0 (centered at frameSize/2) if true, or -frameSize/2 otherwise (zero-centered)
* @param {number} [validFrameThresholdRatio=0] frames smaller than this ratio will be discarded, those larger will be zero-padded to a full frame (i.e. a value of 0 will never discard frames and a value of 1 will only keep frames that are of length 'frameSize')
* @returns {object} {frame: 'the frame to write to'}
* @memberof Essentia
*/
class FrameCutter {
  private algoInstance: any;
  constructor(frameSize: number=1024, hopSize: number=512, lastFrameToEndOfFile: boolean=false, startFromZero: boolean=false, validFrameThresholdRatio: number=0) {
    this.algoInstance = new wasmBackend.FrameCutter(frameSize, hopSize, lastFrameToEndOfFile, startFromZero, validFrameThresholdRatio);
  }
  configure(frameSize: number=1024, hopSize: number=512, lastFrameToEndOfFile: boolean=false, startFromZero: boolean=false, validFrameThresholdRatio: number=0) {
    this.algoInstance.configure(frameSize, hopSize, lastFrameToEndOfFile, startFromZero, validFrameThresholdRatio);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm converts a sequence of input audio signal frames into a sequence of audio samples. Check https://essentia.upf.edu/reference/std_FrameToReal.html for more details.
* @class
* @param {VectorFloat} signal the input audio frame
* @param {number} [frameSize=2048] the frame size for computing the overlap-add process
* @param {number} [hopSize=128] the hop size with which the overlap-add function is computed
* @returns {object} {signal: 'the output audio samples'}
* @memberof Essentia
*/
class FrameToReal {
  private algoInstance: any;
  constructor(frameSize: number=2048, hopSize: number=128) {
    this.algoInstance = new wasmBackend.FrameToReal(frameSize, hopSize);
  }
  configure(frameSize: number=2048, hopSize: number=128) {
    this.algoInstance.configure(frameSize, hopSize);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes energy in rectangular frequency bands of a spectrum. The bands are non-overlapping. For each band the power-spectrum (mag-squared) is summed. Check https://essentia.upf.edu/reference/std_FrequencyBands.html for more details.
* @class
* @param {VectorFloat} spectrum the input spectrum (must be greater than size one)
* @param {any[]} [frequencyBands=[0, 50, 100, 150, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320, 2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 20500, 27000]] list of frequency ranges in to which the spectrum is divided (these must be in ascending order and connot contain duplicates)
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {bands: 'the energy in each band'}
* @memberof Essentia
*/
class FrequencyBands {
  private algoInstance: any;
  constructor(frequencyBands: any[]=[0, 50, 100, 150, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320, 2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 20500, 27000], sampleRate: number=44100) {
    let vecfrequencyBands = arrayToVector(frequencyBands);
    this.algoInstance = new wasmBackend.FrequencyBands(vecfrequencyBands, sampleRate);
  }
  configure(frequencyBands: any[]=[0, 50, 100, 150, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320, 2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 20500, 27000], sampleRate: number=44100) {
    let vecfrequencyBands = arrayToVector(frequencyBands);
    this.algoInstance.configure(vecfrequencyBands, sampleRate);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the Gammatone-frequency cepstral coefficients of a spectrum. This is an equivalent of MFCCs, but using a gammatone filterbank (ERBBands) scaled on an Equivalent Rectangular Bandwidth (ERB) scale. Check https://essentia.upf.edu/reference/std_GFCC.html for more details.
* @class
* @param {VectorFloat} spectrum the audio spectrum
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
* @returns {object} {bands: 'the energies in ERB bands', gfcc: 'the gammatone feature cepstrum coefficients'}
* @memberof Essentia
*/
class GFCC {
  private algoInstance: any;
  constructor(dctType: number=2, highFrequencyBound: number=22050, inputSize: number=1025, logType: string='dbamp', lowFrequencyBound: number=40, numberBands: number=40, numberCoefficients: number=13, sampleRate: number=44100, silenceThreshold: number=1e-10, type: string='power') {
    this.algoInstance = new wasmBackend.GFCC(dctType, highFrequencyBound, inputSize, logType, lowFrequencyBound, numberBands, numberCoefficients, sampleRate, silenceThreshold, type);
  }
  configure(dctType: number=2, highFrequencyBound: number=22050, inputSize: number=1025, logType: string='dbamp', lowFrequencyBound: number=40, numberBands: number=40, numberCoefficients: number=13, sampleRate: number=44100, silenceThreshold: number=1e-10, type: string='power') {
    this.algoInstance.configure(dctType, highFrequencyBound, inputSize, logType, lowFrequencyBound, numberBands, numberCoefficients, sampleRate, silenceThreshold, type);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm uses energy and time thresholds to detect gaps in the waveform. A median filter is used to remove spurious silent samples. The power of a small audio region before the detected gaps (prepower) is thresholded to detect intentional pauses as described in [1]. This technique is extended to the region after the gap.
The algorithm was designed for a framewise use and returns the start and end timestamps related to the first frame processed. Call configure() or reset() in order to restart the count. Check https://essentia.upf.edu/reference/std_GapsDetector.html for more details.
* @class
* @param {VectorFloat} frame the input frame (must be non-empty)
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
* @returns {object} {starts: 'the start indexes of the detected gaps (if any) in seconds', ends: 'the end indexes of the detected gaps (if any) in seconds'}
* @memberof Essentia
*/
class GapsDetector {
  private algoInstance: any;
  constructor(attackTime: number=0.05, frameSize: number=2048, hopSize: number=1024, kernelSize: number=11, maximumTime: number=3500, minimumTime: number=10, postpowerTime: number=40, prepowerThreshold: number=-30, prepowerTime: number=40, releaseTime: number=0.05, sampleRate: number=44100, silenceThreshold: number=-50) {
    this.algoInstance = new wasmBackend.GapsDetector(attackTime, frameSize, hopSize, kernelSize, maximumTime, minimumTime, postpowerTime, prepowerThreshold, prepowerTime, releaseTime, sampleRate, silenceThreshold);
  }
  configure(attackTime: number=0.05, frameSize: number=2048, hopSize: number=1024, kernelSize: number=11, maximumTime: number=3500, minimumTime: number=10, postpowerTime: number=40, prepowerThreshold: number=-30, prepowerTime: number=40, releaseTime: number=0.05, sampleRate: number=44100, silenceThreshold: number=-50) {
    this.algoInstance.configure(attackTime, frameSize, hopSize, kernelSize, maximumTime, minimumTime, postpowerTime, prepowerThreshold, prepowerTime, releaseTime, sampleRate, silenceThreshold);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the geometric mean of an array of positive values. Check https://essentia.upf.edu/reference/std_GeometricMean.html for more details.
* @class
* @param {VectorFloat} array the input array
* @returns {object} {geometricMean: 'the geometric mean of the input array'}
* @memberof Essentia
*/
class GeometricMean {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.GeometricMean();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the High Frequency Content of a spectrum. It can be computed according to the following techniques:
  - 'Masri' (default) which does: sum |X(n)|^2*k,
  - 'Jensen' which does: sum |X(n)|*k^2
  - 'Brossier' which does: sum |X(n)|*k Check https://essentia.upf.edu/reference/std_HFC.html for more details.
* @class
* @param {VectorFloat} spectrum the input audio spectrum
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {string} [type=Masri] the type of HFC coefficient to be computed
* @returns {object} {hfc: 'the high-frequency coefficient'}
* @memberof Essentia
*/
class HFC {
  private algoInstance: any;
  constructor(sampleRate: number=44100, type: string='Masri') {
    this.algoInstance = new wasmBackend.HFC(sampleRate, type);
  }
  configure(sampleRate: number=44100, type: string='Masri') {
    this.algoInstance.configure(sampleRate, type);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* Computes a Harmonic Pitch Class Profile (HPCP) from the spectral peaks of a signal. HPCP is a k*12 dimensional vector which represents the intensities of the twelve (k==1) semitone pitch classes (corresponsing to notes from A to G#), or subdivisions of these (k>1). Check https://essentia.upf.edu/reference/std_HPCP.html for more details.
* @class
* @param {VectorFloat} frequencies the frequencies of the spectral peaks [Hz]
* @param {VectorFloat} magnitudes the magnitudes of the spectral peaks
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
* @returns {object} {hpcp: 'the resulting harmonic pitch class profile'}
* @memberof Essentia
*/
class HPCP {
  private algoInstance: any;
  constructor(bandPreset: boolean=true, bandSplitFrequency: number=500, harmonics: number=0, maxFrequency: number=5000, maxShifted: boolean=false, minFrequency: number=40, nonLinear: boolean=false, normalized: string='unitMax', referenceFrequency: number=440, sampleRate: number=44100, size: number=12, weightType: string='squaredCosine', windowSize: number=1) {
    this.algoInstance = new wasmBackend.HPCP(bandPreset, bandSplitFrequency, harmonics, maxFrequency, maxShifted, minFrequency, nonLinear, normalized, referenceFrequency, sampleRate, size, weightType, windowSize);
  }
  configure(bandPreset: boolean=true, bandSplitFrequency: number=500, harmonics: number=0, maxFrequency: number=5000, maxShifted: boolean=false, minFrequency: number=40, nonLinear: boolean=false, normalized: string='unitMax', referenceFrequency: number=440, sampleRate: number=44100, size: number=12, weightType: string='squaredCosine', windowSize: number=1) {
    this.algoInstance.configure(bandPreset, bandSplitFrequency, harmonics, maxFrequency, maxShifted, minFrequency, nonLinear, normalized, referenceFrequency, sampleRate, size, weightType, windowSize);
  }
  compute(frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(frequencies, magnitudes);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm extracts bpms that are harmonically related to the tempo given by the 'bpm' parameter.
The algorithm assumes a certain bpm is harmonically related to parameter bpm, when the greatest common divisor between both bpms is greater than threshold.
The 'tolerance' parameter is needed in order to consider if two bpms are related. For instance, 120, 122 and 236 may be related or not depending on how much tolerance is given Check https://essentia.upf.edu/reference/std_HarmonicBpm.html for more details.
* @class
* @param {VectorFloat} bpms list of bpm candidates
* @param {number} [bpm=60] the bpm used to find its harmonics
* @param {number} [threshold=20] bpm threshold below which greatest common divisors are discarded
* @param {number} [tolerance=5] percentage tolerance to consider two bpms are equal or equal to a harmonic
* @returns {object} {harmonicBpms: 'a list of bpms which are harmonically related to the bpm parameter '}
* @memberof Essentia
*/
class HarmonicBpm {
  private algoInstance: any;
  constructor(bpm: number=60, threshold: number=20, tolerance: number=5) {
    this.algoInstance = new wasmBackend.HarmonicBpm(bpm, threshold, tolerance);
  }
  configure(bpm: number=60, threshold: number=20, tolerance: number=5) {
    this.algoInstance.configure(bpm, threshold, tolerance);
  }
  compute(bpms: any) {
    return this.algoInstance.compute(bpms);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm finds the harmonic peaks of a signal given its spectral peaks and its fundamental frequency.
Note:
  - "tolerance" parameter defines the allowed fixed deviation from ideal harmonics, being a percentage over the F0. For example: if the F0 is 100Hz you may decide to allow a deviation of 20%, that is a fixed deviation of 20Hz; for the harmonic series it is: [180-220], [280-320], [380-420], etc.
  - If "pitch" is zero, it means its value is unknown, or the sound is unpitched, and in that case the HarmonicPeaks algorithm returns an empty vector.
  - The output frequency and magnitude vectors are of size "maxHarmonics". If a particular harmonic was not found among spectral peaks, its ideal frequency value is output together with 0 magnitude.
This algorithm is intended to receive its "frequencies" and "magnitudes" inputs from the SpectralPeaks algorithm.
  - When input vectors differ in size or are empty, an exception is thrown. Input vectors must be ordered by ascending frequency excluding DC components and not contain duplicates, otherwise an exception is thrown. Check https://essentia.upf.edu/reference/std_HarmonicPeaks.html for more details.
* @class
* @param {VectorFloat} frequencies the frequencies of the spectral peaks [Hz] (ascending order)
* @param {VectorFloat} magnitudes the magnitudes of the spectral peaks (ascending frequency order)
* @param {number} pitch an estimate of the fundamental frequency of the signal [Hz]
* @param {number} [maxHarmonics=20] the number of harmonics to return including F0
* @param {number} [tolerance=0.2] the allowed ratio deviation from ideal harmonics
* @returns {object} {harmonicFrequencies: 'the frequencies of harmonic peaks [Hz]', harmonicMagnitudes: 'the magnitudes of harmonic peaks'}
* @memberof Essentia
*/
class HarmonicPeaks {
  private algoInstance: any;
  constructor(maxHarmonics: number=20, tolerance: number=0.2) {
    this.algoInstance = new wasmBackend.HarmonicPeaks(maxHarmonics, tolerance);
  }
  configure(maxHarmonics: number=20, tolerance: number=0.2) {
    this.algoInstance.configure(maxHarmonics, tolerance);
  }
  compute(frequencies: any, magnitudes: any, pitch: number) {
    return this.algoInstance.compute(frequencies, magnitudes, pitch);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements a 1st order IIR high-pass filter. Because of its dependence on IIR, IIR's requirements are inherited. Check https://essentia.upf.edu/reference/std_HighPass.html for more details.
* @class
* @param {VectorFloat} signal the input audio signal
* @param {number} [cutoffFrequency=1500] the cutoff frequency for the filter [Hz]
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {signal: 'the filtered signal'}
* @memberof Essentia
*/
class HighPass {
  private algoInstance: any;
  constructor(cutoffFrequency: number=1500, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.HighPass(cutoffFrequency, sampleRate);
  }
  configure(cutoffFrequency: number=1500, sampleRate: number=44100) {
    this.algoInstance.configure(cutoffFrequency, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes high-resolution chroma features from an HPCP vector. The vector's size must be a multiple of 12 and it is recommended that it be larger than 120. In otherwords, the HPCP's resolution should be 10 Cents or more.
The high-resolution features being computed are: Check https://essentia.upf.edu/reference/std_HighResolutionFeatures.html for more details.
* @class
* @param {VectorFloat} hpcp the HPCPs, preferably of size >= 120
* @param {number} [maxPeaks=24] maximum number of HPCP peaks to consider when calculating outputs
* @returns {object} {equalTemperedDeviation: 'measure of the deviation of HPCP local maxima with respect to equal-tempered bins', nonTemperedEnergyRatio: 'ratio between the energy on non-tempered bins and the total energy', nonTemperedPeaksEnergyRatio: 'ratio between the energy on non-tempered peaks and the total energy'}
* @memberof Essentia
*/
class HighResolutionFeatures {
  private algoInstance: any;
  constructor(maxPeaks: number=24) {
    this.algoInstance = new wasmBackend.HighResolutionFeatures(maxPeaks);
  }
  configure(maxPeaks: number=24) {
    this.algoInstance.configure(maxPeaks);
  }
  compute(hpcp: any) {
    return this.algoInstance.compute(hpcp);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes a histogram. Values outside the range are ignored Check https://essentia.upf.edu/reference/std_Histogram.html for more details.
* @class
* @param {VectorFloat} array the input array
* @param {number} [maxValue=1] the max value of the histogram
* @param {number} [minValue=0] the min value of the histogram
* @param {string} [normalize=none] the normalization setting.
* @param {number} [numberBins=10] the number of bins
* @returns {object} {histogram: 'the values in the equally-spaced bins', binEdges: 'the edges of the equally-spaced bins. Size is _histogram.size() + 1'}
* @memberof Essentia
*/
class Histogram {
  private algoInstance: any;
  constructor(maxValue: number=1, minValue: number=0, normalize: string='none', numberBins: number=10) {
    this.algoInstance = new wasmBackend.Histogram(maxValue, minValue, normalize, numberBins);
  }
  configure(maxValue: number=1, minValue: number=0, normalize: string='none', numberBins: number=10) {
    this.algoInstance.configure(maxValue, minValue, normalize, numberBins);
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the harmonic plus residual model analysis. Check https://essentia.upf.edu/reference/std_HprModelAnal.html for more details.
* @class
* @param {VectorFloat} frame the input frame
* @param {number} pitch external pitch input [Hz].
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
* @returns {object} {frequencies: 'the frequencies of the sinusoidal peaks [Hz]', magnitudes: 'the magnitudes of the sinusoidal peaks', phases: 'the phases of the sinusoidal peaks', res: 'output residual frame'}
* @memberof Essentia
*/
class HprModelAnal {
  private algoInstance: any;
  constructor(fftSize: number=2048, freqDevOffset: number=20, freqDevSlope: number=0.01, harmDevSlope: number=0.01, hopSize: number=512, magnitudeThreshold: number=0, maxFrequency: number=5000, maxPeaks: number=100, maxnSines: number=100, minFrequency: number=20, nHarmonics: number=100, orderBy: string='frequency', sampleRate: number=44100, stocf: number=0.2) {
    this.algoInstance = new wasmBackend.HprModelAnal(fftSize, freqDevOffset, freqDevSlope, harmDevSlope, hopSize, magnitudeThreshold, maxFrequency, maxPeaks, maxnSines, minFrequency, nHarmonics, orderBy, sampleRate, stocf);
  }
  configure(fftSize: number=2048, freqDevOffset: number=20, freqDevSlope: number=0.01, harmDevSlope: number=0.01, hopSize: number=512, magnitudeThreshold: number=0, maxFrequency: number=5000, maxPeaks: number=100, maxnSines: number=100, minFrequency: number=20, nHarmonics: number=100, orderBy: string='frequency', sampleRate: number=44100, stocf: number=0.2) {
    this.algoInstance.configure(fftSize, freqDevOffset, freqDevSlope, harmDevSlope, hopSize, magnitudeThreshold, maxFrequency, maxPeaks, maxnSines, minFrequency, nHarmonics, orderBy, sampleRate, stocf);
  }
  compute(frame: any, pitch: number) {
    return this.algoInstance.compute(frame, pitch);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the harmonic plus stochastic model analysis.  Check https://essentia.upf.edu/reference/std_HpsModelAnal.html for more details.
* @class
* @param {VectorFloat} frame the input frame
* @param {number} pitch external pitch input [Hz].
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
* @returns {object} {frequencies: 'the frequencies of the sinusoidal peaks [Hz]', magnitudes: 'the magnitudes of the sinusoidal peaks', phases: 'the phases of the sinusoidal peaks', stocenv: 'the stochastic envelope'}
* @memberof Essentia
*/
class HpsModelAnal {
  private algoInstance: any;
  constructor(fftSize: number=2048, freqDevOffset: number=20, freqDevSlope: number=0.01, harmDevSlope: number=0.01, hopSize: number=512, magnitudeThreshold: number=0, maxFrequency: number=5000, maxPeaks: number=100, maxnSines: number=100, minFrequency: number=20, nHarmonics: number=100, orderBy: string='frequency', sampleRate: number=44100, stocf: number=0.2) {
    this.algoInstance = new wasmBackend.HpsModelAnal(fftSize, freqDevOffset, freqDevSlope, harmDevSlope, hopSize, magnitudeThreshold, maxFrequency, maxPeaks, maxnSines, minFrequency, nHarmonics, orderBy, sampleRate, stocf);
  }
  configure(fftSize: number=2048, freqDevOffset: number=20, freqDevSlope: number=0.01, harmDevSlope: number=0.01, hopSize: number=512, magnitudeThreshold: number=0, maxFrequency: number=5000, maxPeaks: number=100, maxnSines: number=100, minFrequency: number=20, nHarmonics: number=100, orderBy: string='frequency', sampleRate: number=44100, stocf: number=0.2) {
    this.algoInstance.configure(fftSize, freqDevOffset, freqDevSlope, harmDevSlope, hopSize, magnitudeThreshold, maxFrequency, maxPeaks, maxnSines, minFrequency, nHarmonics, orderBy, sampleRate, stocf);
  }
  compute(frame: any, pitch: number) {
    return this.algoInstance.compute(frame, pitch);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the Inverse Discrete Cosine Transform of an array.
It can be configured to perform the inverse DCT-II form, with the 1/sqrt(2) scaling factor for the first coefficient or the inverse DCT-III form based on the HTK implementation. Check https://essentia.upf.edu/reference/std_IDCT.html for more details.
* @class
* @param {VectorFloat} dct the discrete cosine transform
* @param {number} [dctType=2] the DCT type
* @param {number} [inputSize=10] the size of the input array
* @param {number} [liftering=0] the liftering coefficient. Use '0' to bypass it
* @param {number} [outputSize=10] the number of output coefficients
* @returns {object} {idct: 'the inverse cosine transform of the input array'}
* @memberof Essentia
*/
class IDCT {
  private algoInstance: any;
  constructor(dctType: number=2, inputSize: number=10, liftering: number=0, outputSize: number=10) {
    this.algoInstance = new wasmBackend.IDCT(dctType, inputSize, liftering, outputSize);
  }
  configure(dctType: number=2, inputSize: number=10, liftering: number=0, outputSize: number=10) {
    this.algoInstance.configure(dctType, inputSize, liftering, outputSize);
  }
  compute(dct: any) {
    return this.algoInstance.compute(dct);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements a standard IIR filter. It filters the data in the input vector with the filter described by parameter vectors 'numerator' and 'denominator' to create the output filtered vector. In the litterature, the numerator is often referred to as the 'B' coefficients and the denominator as the 'A' coefficients. Check https://essentia.upf.edu/reference/std_IIR.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {any[]} [denominator=[1]] the list of coefficients of the denominator. Often referred to as the A coefficient vector.
* @param {any[]} [numerator=[1]] the list of coefficients of the numerator. Often referred to as the B coefficient vector.
* @returns {object} {signal: 'the filtered signal'}
* @memberof Essentia
*/
class IIR {
  private algoInstance: any;
  constructor(denominator: any[]=[1], numerator: any[]=[1]) {
    let vecdenominator = arrayToVector(denominator);
    let vecnumerator = arrayToVector(numerator);
    this.algoInstance = new wasmBackend.IIR(vecdenominator, vecnumerator);
  }
  configure(denominator: any[]=[1], numerator: any[]=[1]) {
    let vecdenominator = arrayToVector(denominator);
    let vecnumerator = arrayToVector(numerator);
    this.algoInstance.configure(vecdenominator, vecnumerator);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm calculates the inharmonicity of a signal given its spectral peaks. The inharmonicity value is computed as an energy weighted divergence of the spectral components from their closest multiple of the fundamental frequency. The fundamental frequency is taken as the first spectral peak from the input. The inharmonicity value ranges from 0 (purely harmonic signal) to 1 (inharmonic signal). Check https://essentia.upf.edu/reference/std_Inharmonicity.html for more details.
* @class
* @param {VectorFloat} frequencies the frequencies of the harmonic peaks [Hz] (in ascending order)
* @param {VectorFloat} magnitudes the magnitudes of the harmonic peaks (in frequency ascending order
* @returns {object} {inharmonicity: 'the inharmonicity of the audio signal'}
* @memberof Essentia
*/
class Inharmonicity {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.Inharmonicity();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(frequencies, magnitudes);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the instant power of an array. That is, the energy of the array over its size. Check https://essentia.upf.edu/reference/std_InstantPower.html for more details.
* @class
* @param {VectorFloat} array the input array
* @returns {object} {power: 'the instant power of the input array'}
* @memberof Essentia
*/
class InstantPower {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.InstantPower();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm classifies the input audio signal as either relaxed (-1), moderate (0), or aggressive (1). Check https://essentia.upf.edu/reference/std_Intensity.html for more details.
* @class
* @param {VectorFloat} signal the input audio signal
* @param {number} [sampleRate=44100] the input audio sampling rate [Hz]
* @returns {object} {intensity: 'the intensity value'}
* @memberof Essentia
*/
class Intensity {
  private algoInstance: any;
  constructor(sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.Intensity(sampleRate);
  }
  configure(sampleRate: number=44100) {
    this.algoInstance.configure(sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes key estimate given a pitch class profile (HPCP). The algorithm was severely adapted and changed from the original implementation for readability and speed. Check https://essentia.upf.edu/reference/std_Key.html for more details.
* @class
* @param {VectorFloat} pcp the input pitch class profile
* @param {number} [numHarmonics=4] number of harmonics that should contribute to the polyphonic profile (1 only considers the fundamental harmonic)
* @param {number} [pcpSize=36] number of array elements used to represent a semitone times 12 (this parameter is only a hint, during computation, the size of the input PCP is used instead)
* @param {string} [profileType=bgate] the type of polyphic profile to use for correlation calculation
* @param {number} [slope=0.6] value of the slope of the exponential harmonic contribution to the polyphonic profile
* @param {boolean} [useMajMin=false] use a third profile called 'majmin' for ambiguous tracks [4]. Only avalable for the edma, bgate and braw profiles
* @param {boolean} [usePolyphony=true] enables the use of polyphonic profiles to define key profiles (this includes the contributions from triads as well as pitch harmonics)
* @param {boolean} [useThreeChords=true] consider only the 3 main triad chords of the key (T, D, SD) to build the polyphonic profiles
* @returns {object} {key: 'the estimated key, from A to G', scale: 'the scale of the key (major or minor)', strength: 'the strength of the estimated key', firstToSecondRelativeStrength: 'the relative strength difference between the best estimate and second best estimate of the key'}
* @memberof Essentia
*/
class Key {
  private algoInstance: any;
  constructor(numHarmonics: number=4, pcpSize: number=36, profileType: string='bgate', slope: number=0.6, useMajMin: boolean=false, usePolyphony: boolean=true, useThreeChords: boolean=true) {
    this.algoInstance = new wasmBackend.Key(numHarmonics, pcpSize, profileType, slope, useMajMin, usePolyphony, useThreeChords);
  }
  configure(numHarmonics: number=4, pcpSize: number=36, profileType: string='bgate', slope: number=0.6, useMajMin: boolean=false, usePolyphony: boolean=true, useThreeChords: boolean=true) {
    this.algoInstance.configure(numHarmonics, pcpSize, profileType, slope, useMajMin, usePolyphony, useThreeChords);
  }
  compute(pcp: any) {
    return this.algoInstance.compute(pcp);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm extracts key/scale for an audio signal. It computes HPCP frames for the input signal and applies key estimation using the Key algorithm. Check https://essentia.upf.edu/reference/std_KeyExtractor.html for more details.
* @class
* @param {VectorFloat} audio the audio input signal
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
* @returns {object} {key: 'See Key algorithm documentation', scale: 'See Key algorithm documentation', strength: 'See Key algorithm documentation'}
* @memberof Essentia
*/
class KeyExtractor {
  private algoInstance: any;
  constructor(averageDetuningCorrection: boolean=true, frameSize: number=4096, hopSize: number=4096, hpcpSize: number=12, maxFrequency: number=3500, maximumSpectralPeaks: number=60, minFrequency: number=25, pcpThreshold: number=0.2, profileType: string='bgate', sampleRate: number=44100, spectralPeaksThreshold: number=0.0001, tuningFrequency: number=440, weightType: string='cosine', windowType: string='hann') {
    this.algoInstance = new wasmBackend.KeyExtractor(averageDetuningCorrection, frameSize, hopSize, hpcpSize, maxFrequency, maximumSpectralPeaks, minFrequency, pcpThreshold, profileType, sampleRate, spectralPeaksThreshold, tuningFrequency, weightType, windowType);
  }
  configure(averageDetuningCorrection: boolean=true, frameSize: number=4096, hopSize: number=4096, hpcpSize: number=12, maxFrequency: number=3500, maximumSpectralPeaks: number=60, minFrequency: number=25, pcpThreshold: number=0.2, profileType: string='bgate', sampleRate: number=44100, spectralPeaksThreshold: number=0.0001, tuningFrequency: number=440, weightType: string='cosine', windowType: string='hann') {
    this.algoInstance.configure(averageDetuningCorrection, frameSize, hopSize, hpcpSize, maxFrequency, maximumSpectralPeaks, minFrequency, pcpThreshold, profileType, sampleRate, spectralPeaksThreshold, tuningFrequency, weightType, windowType);
  }
  compute(audio: any) {
    return this.algoInstance.compute(audio);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes Linear Predictive Coefficients and associated reflection coefficients of a signal. Check https://essentia.upf.edu/reference/std_LPC.html for more details.
* @class
* @param {VectorFloat} frame the input audio frame
* @param {number} [order=10] the order of the LPC analysis (typically [8,14])
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {string} [type=regular] the type of LPC (regular or warped)
* @returns {object} {lpc: 'the LPC coefficients', reflection: 'the reflection coefficients'}
* @memberof Essentia
*/
class LPC {
  private algoInstance: any;
  constructor(order: number=10, sampleRate: number=44100, type: string='regular') {
    this.algoInstance = new wasmBackend.LPC(order, sampleRate, type);
  }
  configure(order: number=10, sampleRate: number=44100, type: string='regular') {
    this.algoInstance.configure(order, sampleRate, type);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the long-term loudness of an audio signal. The LARM model is based on the asymmetrical low-pass filtering of the Peak Program Meter (PPM), combined with Revised Low-frequency B-weighting (RLB) and power mean calculations. LARM has shown to be a reliable and objective loudness estimate of music and speech. Check https://essentia.upf.edu/reference/std_Larm.html for more details.
* @class
* @param {VectorFloat} signal the audio input signal
* @param {number} [attackTime=10] the attack time of the first order lowpass in the attack phase [ms]
* @param {number} [power=1.5] the power used for averaging
* @param {number} [releaseTime=1500] the release time of the first order lowpass in the release phase [ms]
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {larm: 'the LARM loudness estimate [dB]'}
* @memberof Essentia
*/
class Larm {
  private algoInstance: any;
  constructor(attackTime: number=10, power: number=1.5, releaseTime: number=1500, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.Larm(attackTime, power, releaseTime, sampleRate);
  }
  configure(attackTime: number=10, power: number=1.5, releaseTime: number=1500, sampleRate: number=44100) {
    this.algoInstance.configure(attackTime, power, releaseTime, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the Equivalent sound level (Leq) of an audio signal. The Leq measure can be derived from the Revised Low-frequency B-weighting (RLB) or from the raw signal as described in [1]. If the signal contains no energy, Leq defaults to essentias definition of silence which is -90dB.
This algorithm will throw an exception on empty input. Check https://essentia.upf.edu/reference/std_Leq.html for more details.
* @class
* @param {VectorFloat} signal the input signal (must be non-empty)
* @returns {object} {leq: 'the equivalent sound level estimate [dB]'}
* @memberof Essentia
*/
class Leq {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.Leq();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm extracts the loudness of an audio signal in frames using Loudness algorithm. Check https://essentia.upf.edu/reference/std_LevelExtractor.html for more details.
* @class
* @param {VectorFloat} signal the audio input signal
* @param {number} [frameSize=88200] frame size to compute loudness
* @param {number} [hopSize=44100] hop size to compute loudness
* @returns {object} {loudness: 'the loudness values'}
* @memberof Essentia
*/
class LevelExtractor {
  private algoInstance: any;
  constructor(frameSize: number=88200, hopSize: number=44100) {
    this.algoInstance = new wasmBackend.LevelExtractor(frameSize, hopSize);
  }
  configure(frameSize: number=88200, hopSize: number=44100) {
    this.algoInstance.configure(frameSize, hopSize);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the log (base 10) of the attack time of a signal envelope. The attack time is defined as the time duration from when the sound becomes perceptually audible to when it reaches its maximum intensity. By default, the start of the attack is estimated as the point where the signal envelope reaches 20% of its maximum value in order to account for possible noise presence. Also by default, the end of the attack is estimated as as the point where the signal envelope has reached 90% of its maximum value, in order to account for the possibility that the max value occurres after the logAttack, as in trumpet sounds. Check https://essentia.upf.edu/reference/std_LogAttackTime.html for more details.
* @class
* @param {VectorFloat} signal the input signal envelope (must be non-empty)
* @param {number} [sampleRate=44100] the audio sampling rate [Hz]
* @param {number} [startAttackThreshold=0.2] the percentage of the input signal envelope at which the starting point of the attack is considered
* @param {number} [stopAttackThreshold=0.9] the percentage of the input signal envelope at which the ending point of the attack is considered
* @returns {object} {logAttackTime: 'the log (base 10) of the attack time [log10(s)]', attackStart: 'the attack start time [s]', attackStop: 'the attack end time [s]'}
* @memberof Essentia
*/
class LogAttackTime {
  private algoInstance: any;
  constructor(sampleRate: number=44100, startAttackThreshold: number=0.2, stopAttackThreshold: number=0.9) {
    this.algoInstance = new wasmBackend.LogAttackTime(sampleRate, startAttackThreshold, stopAttackThreshold);
  }
  configure(sampleRate: number=44100, startAttackThreshold: number=0.2, stopAttackThreshold: number=0.9) {
    this.algoInstance.configure(sampleRate, startAttackThreshold, stopAttackThreshold);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes spectrum with logarithmically distributed frequency bins. This code is ported from NNLS Chroma [1, 2].This algorithm also returns a local tuning that is retrieved for input frame and a global tuning that is updated with a moving average. Check https://essentia.upf.edu/reference/std_LogSpectrum.html for more details.
* @class
* @param {VectorFloat} spectrum spectrum frame
* @param {number} [binsPerSemitone=3]  bins per semitone
* @param {number} [frameSize=1025] the input frame size of the spectrum vector
* @param {number} [nOctave=7] the number of octave of the output vector
* @param {number} [rollOn=0] this removes low-frequency noise - useful in quiet recordings
* @param {number} [sampleRate=44100] the input sample rate
* @returns {object} {logFreqSpectrum: 'log frequency spectrum frame', meanTuning: 'normalized mean tuning frequency', localTuning: 'normalized local tuning frequency'}
* @memberof Essentia
*/
class LogSpectrum {
  private algoInstance: any;
  constructor(binsPerSemitone: number=3, frameSize: number=1025, nOctave: number=7, rollOn: number=0, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.LogSpectrum(binsPerSemitone, frameSize, nOctave, rollOn, sampleRate);
  }
  configure(binsPerSemitone: number=3, frameSize: number=1025, nOctave: number=7, rollOn: number=0, sampleRate: number=44100) {
    this.algoInstance.configure(binsPerSemitone, frameSize, nOctave, rollOn, sampleRate);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm takes an audio signal and a BPM estimate for that signal and predicts the reliability of the BPM estimate in a value from 0 to 1. The audio signal is assumed to be a musical loop with constant tempo. The confidence returned is based on comparing the duration of the signal with multiples of the BPM estimate (see [1] for more details). Check https://essentia.upf.edu/reference/std_LoopBpmConfidence.html for more details.
* @class
* @param {VectorFloat} signal loop audio signal
* @param {number} bpmEstimate estimated BPM for the audio signal (will be rounded to nearest integer)
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {confidence: 'confidence value for the BPM estimation'}
* @memberof Essentia
*/
class LoopBpmConfidence {
  private algoInstance: any;
  constructor(sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.LoopBpmConfidence(sampleRate);
  }
  configure(sampleRate: number=44100) {
    this.algoInstance.configure(sampleRate);
  }
  compute(signal: any, bpmEstimate: number) {
    return this.algoInstance.compute(signal, bpmEstimate);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the BPM of audio loops. It internally uses PercivalBpmEstimator algorithm to produce a BPM estimate and LoopBpmConfidence to asses the reliability of the estimate. If the provided estimate is below the given confidenceThreshold, the algorithm outputs a BPM 0.0, otherwise it outputs the estimated BPM. For more details on the BPM estimation method and the confidence measure please check the used algorithms. Check https://essentia.upf.edu/reference/std_LoopBpmEstimator.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {number} [confidenceThreshold=0.95] confidence threshold below which bpm estimate will be considered unreliable
* @returns {object} {bpm: 'the estimated bpm (will be 0 if unsure)'}
* @memberof Essentia
*/
class LoopBpmEstimator {
  private algoInstance: any;
  constructor(confidenceThreshold: number=0.95) {
    this.algoInstance = new wasmBackend.LoopBpmEstimator(confidenceThreshold);
  }
  configure(confidenceThreshold: number=0.95) {
    this.algoInstance.configure(confidenceThreshold);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the loudness of an audio signal defined by Steven's power law. It computes loudness as the energy of the signal raised to the power of 0.67. Check https://essentia.upf.edu/reference/std_Loudness.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @returns {object} {loudness: 'the loudness of the input signal'}
* @memberof Essentia
*/
class Loudness {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.Loudness();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes Vickers's loudness of an audio signal. Currently, this algorithm only works for signals with a 44100Hz sampling rate. This algorithm is meant to be given frames of audio as input (not entire audio signals). The algorithm described in the paper performs a weighted average of the loudness value computed for each of the given frames, this step is left as a post processing step and is not performed by this algorithm. Check https://essentia.upf.edu/reference/std_LoudnessVickers.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {number} [sampleRate=44100] the audio sampling rate of the input signal which is used to create the weight vector [Hz] (currently, this algorithm only works on signals with a sampling rate of 44100Hz)
* @returns {object} {loudness: 'the Vickers loudness [dB]'}
* @memberof Essentia
*/
class LoudnessVickers {
  private algoInstance: any;
  constructor(sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.LoudnessVickers(sampleRate);
  }
  configure(sampleRate: number=44100) {
    this.algoInstance.configure(sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm extracts a set of level spectral features for which it is recommended to apply a preliminary equal-loudness filter over an input audio signal (according to the internal evaluations conducted at Music Technology Group). To this end, you are expected to provide the output of EqualLoudness algorithm as an input for this algorithm. Still, you are free to provide an unprocessed audio input in the case you want to compute these features without equal-loudness filter. Check https://essentia.upf.edu/reference/std_LowLevelSpectralEqloudExtractor.html for more details.
* @class
* @param {VectorFloat} signal the input audio signal
* @param {number} [frameSize=2048] the frame size for computing low level features
* @param {number} [hopSize=1024] the hop size for computing low level features
* @param {number} [sampleRate=44100] the audio sampling rate
* @returns {object} {dissonance: 'See Dissonance algorithm documentation', sccoeffs: 'See SpectralContrast algorithm documentation', scvalleys: 'See SpectralContrast algorithm documentation', spectral_centroid: 'See Centroid algorithm documentation', spectral_kurtosis: 'See DistributionShape algorithm documentation', spectral_skewness: 'See DistributionShape algorithm documentation', spectral_spread: 'See DistributionShape algorithm documentation'}
* @memberof Essentia
*/
class LowLevelSpectralEqloudExtractor {
  private algoInstance: any;
  constructor(frameSize: number=2048, hopSize: number=1024, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.LowLevelSpectralEqloudExtractor(frameSize, hopSize, sampleRate);
  }
  configure(frameSize: number=2048, hopSize: number=1024, sampleRate: number=44100) {
    this.algoInstance.configure(frameSize, hopSize, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm extracts all low-level spectral features, which do not require an equal-loudness filter for their computation, from an audio signal Check https://essentia.upf.edu/reference/std_LowLevelSpectralExtractor.html for more details.
* @class
* @param {VectorFloat} signal the audio input signal
* @param {number} [frameSize=2048] the frame size for computing low level features
* @param {number} [hopSize=1024] the hop size for computing low level features
* @param {number} [sampleRate=44100] the audio sampling rate
* @returns {object} {barkbands: 'spectral energy at each bark band. See BarkBands alogithm', barkbands_kurtosis: 'kurtosis from bark bands. See DistributionShape algorithm documentation', barkbands_skewness: 'skewness from bark bands. See DistributionShape algorithm documentation', barkbands_spread: 'spread from barkbands. See DistributionShape algorithm documentation', hfc: 'See HFC algorithm documentation', mfcc: 'See MFCC algorithm documentation', pitch: 'See PitchYinFFT algorithm documentation', pitch_instantaneous_confidence: 'See PitchYinFFT algorithm documentation', pitch_salience: 'See PitchSalience algorithm documentation', silence_rate_20dB: 'See SilenceRate algorithm documentation', silence_rate_30dB: 'See SilenceRate algorithm documentation', silence_rate_60dB: 'See SilenceRate algorithm documentation', spectral_complexity: 'See Spectral algorithm documentation', spectral_crest: 'See Crest algorithm documentation', spectral_decrease: 'See Decrease algorithm documentation', spectral_energy: 'See Energy algorithm documentation', spectral_energyband_low: 'Energy in band (20,150] Hz. See EnergyBand algorithm documentation', spectral_energyband_middle_low: 'Energy in band (150,800] Hz.See EnergyBand algorithm documentation', spectral_energyband_middle_high: 'Energy in band (800,4000] Hz. See EnergyBand algorithm documentation', spectral_energyband_high: 'Energy in band (4000,20000] Hz. See EnergyBand algorithm documentation', spectral_flatness_db: 'See flatnessDB algorithm documentation', spectral_flux: 'See Flux algorithm documentation', spectral_rms: 'See RMS algorithm documentation', spectral_rolloff: 'See RollOff algorithm documentation', spectral_strongpeak: 'See StrongPeak algorithm documentation', zerocrossingrate: 'See ZeroCrossingRate algorithm documentation', inharmonicity: 'See Inharmonicity algorithm documentation', tristimulus: 'See Tristimulus algorithm documentation', oddtoevenharmonicenergyratio: 'See OddToEvenHarmonicEnergyRatio algorithm documentation'}
* @memberof Essentia
*/
class LowLevelSpectralExtractor {
  private algoInstance: any;
  constructor(frameSize: number=2048, hopSize: number=1024, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.LowLevelSpectralExtractor(frameSize, hopSize, sampleRate);
  }
  configure(frameSize: number=2048, hopSize: number=1024, sampleRate: number=44100) {
    this.algoInstance.configure(frameSize, hopSize, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements a 1st order IIR low-pass filter. Because of its dependence on IIR, IIR's requirements are inherited.
References:
  [1] U. Zölzer, DAFX - Digital Audio Effects, p. 40,
  John Wiley & Sons, 2002 Check https://essentia.upf.edu/reference/std_LowPass.html for more details.
* @class
* @param {VectorFloat} signal the input audio signal
* @param {number} [cutoffFrequency=1500] the cutoff frequency for the filter [Hz]
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {signal: 'the filtered signal'}
* @memberof Essentia
*/
class LowPass {
  private algoInstance: any;
  constructor(cutoffFrequency: number=1500, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.LowPass(cutoffFrequency, sampleRate);
  }
  configure(cutoffFrequency: number=1500, sampleRate: number=44100) {
    this.algoInstance.configure(cutoffFrequency, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the mel-frequency cepstrum coefficients of a spectrum. As there is no standard implementation, the MFCC-FB40 is used by default:
  - filterbank of 40 bands from 0 to 11000Hz
  - take the log value of the spectrum energy in each mel band. Bands energy values below silence threshold will be clipped to its value before computing log-energies
  - DCT of the 40 bands down to 13 mel coefficients
There is a paper describing various MFCC implementations [1]. Check https://essentia.upf.edu/reference/std_MFCC.html for more details.
* @class
* @param {VectorFloat} spectrum the audio spectrum
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
* @returns {object} {bands: 'the energies in mel bands', mfcc: 'the mel frequency cepstrum coefficients'}
* @memberof Essentia
*/
class MFCC {
  private algoInstance: any;
  constructor(dctType: number=2, highFrequencyBound: number=11000, inputSize: number=1025, liftering: number=0, logType: string='dbamp', lowFrequencyBound: number=0, normalize: string='unit_sum', numberBands: number=40, numberCoefficients: number=13, sampleRate: number=44100, silenceThreshold: number=1e-10, type: string='power', warpingFormula: string='htkMel', weighting: string='warping') {
    this.algoInstance = new wasmBackend.MFCC(dctType, highFrequencyBound, inputSize, liftering, logType, lowFrequencyBound, normalize, numberBands, numberCoefficients, sampleRate, silenceThreshold, type, warpingFormula, weighting);
  }
  configure(dctType: number=2, highFrequencyBound: number=11000, inputSize: number=1025, liftering: number=0, logType: string='dbamp', lowFrequencyBound: number=0, normalize: string='unit_sum', numberBands: number=40, numberCoefficients: number=13, sampleRate: number=44100, silenceThreshold: number=1e-10, type: string='power', warpingFormula: string='htkMel', weighting: string='warping') {
    this.algoInstance.configure(dctType, highFrequencyBound, inputSize, liftering, logType, lowFrequencyBound, normalize, numberBands, numberCoefficients, sampleRate, silenceThreshold, type, warpingFormula, weighting);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements a maximum filter for 1d signal using van Herk/Gil-Werman (HGW) algorithm. Check https://essentia.upf.edu/reference/std_MaxFilter.html for more details.
* @class
* @param {VectorFloat} signal signal to be filtered
* @param {boolean} [causal=true] use casual filter (window is behind current element otherwise it is centered around)
* @param {number} [width=3] the window size, even size is auto-resized to the next odd value in the non-casual case
* @returns {object} {signal: 'filtered output'}
* @memberof Essentia
*/
class MaxFilter {
  private algoInstance: any;
  constructor(causal: boolean=true, width: number=3) {
    this.algoInstance = new wasmBackend.MaxFilter(causal, width);
  }
  configure(causal: boolean=true, width: number=3) {
    this.algoInstance.configure(causal, width);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the frequency with the largest magnitude in a spectrum.
Note that a spectrum must contain at least two elements otherwise an exception is thrown Check https://essentia.upf.edu/reference/std_MaxMagFreq.html for more details.
* @class
* @param {VectorFloat} spectrum the input spectrum (must have more than 1 element)
* @param {number} [sampleRate=44100] the audio sampling rate [Hz]
* @returns {object} {maxMagFreq: 'the frequency with the largest magnitude [Hz]'}
* @memberof Essentia
*/
class MaxMagFreq {
  private algoInstance: any;
  constructor(sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.MaxMagFreq(sampleRate);
  }
  configure(sampleRate: number=44100) {
    this.algoInstance.configure(sampleRate);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the ratio between the index of the maximum value of the envelope of a signal and the total length of the envelope. This ratio shows how much the maximum amplitude is off-center. Its value is close to 0 if the maximum is close to the beginning (e.g. Decrescendo or Impulsive sounds), close to 0.5 if it is close to the middle (e.g. Delta sounds) and close to 1 if it is close to the end of the sound (e.g. Crescendo sounds). This algorithm is intended to be fed by the output of the Envelope algorithm Check https://essentia.upf.edu/reference/std_MaxToTotal.html for more details.
* @class
* @param {VectorFloat} envelope the envelope of the signal
* @returns {object} {maxToTotal: 'the maximum amplitude position to total length ratio'}
* @memberof Essentia
*/
class MaxToTotal {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.MaxToTotal();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(envelope: any) {
    return this.algoInstance.compute(envelope);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the mean of an array. Check https://essentia.upf.edu/reference/std_Mean.html for more details.
* @class
* @param {VectorFloat} array the input array
* @returns {object} {mean: 'the mean of the input array'}
* @memberof Essentia
*/
class Mean {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.Mean();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the median of an array. When there is an odd number of numbers, the median is simply the middle number. For example, the median of 2, 4, and 7 is 4. When there is an even number of numbers, the median is the mean of the two middle numbers. Thus, the median of the numbers 2, 4, 7, 12 is (4+7)/2 = 5.5. See [1] for more info. Check https://essentia.upf.edu/reference/std_Median.html for more details.
* @class
* @param {VectorFloat} array the input array (must be non-empty)
* @returns {object} {median: 'the median of the input array'}
* @memberof Essentia
*/
class Median {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.Median();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the median filtered version of the input signal giving the kernel size as detailed in [1]. Check https://essentia.upf.edu/reference/std_MedianFilter.html for more details.
* @class
* @param {VectorFloat} array the input array (must be non-empty)
* @param {number} [kernelSize=11] scalar giving the size of the median filter window. Must be odd
* @returns {object} {filteredArray: 'the median-filtered input array'}
* @memberof Essentia
*/
class MedianFilter {
  private algoInstance: any;
  constructor(kernelSize: number=11) {
    this.algoInstance = new wasmBackend.MedianFilter(kernelSize);
  }
  configure(kernelSize: number=11) {
    this.algoInstance.configure(kernelSize);
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes energy in mel bands of a spectrum. It applies a frequency-domain filterbank (MFCC FB-40, [1]), which consists of equal area triangular filters spaced according to the mel scale. The filterbank is normalized in such a way that the sum of coefficients for every filter equals one. It is recommended that the input "spectrum" be calculated by the Spectrum algorithm. Check https://essentia.upf.edu/reference/std_MelBands.html for more details.
* @class
* @param {VectorFloat} spectrum the audio spectrum
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
* @returns {object} {bands: 'the energy in mel bands'}
* @memberof Essentia
*/
class MelBands {
  private algoInstance: any;
  constructor(highFrequencyBound: number=22050, inputSize: number=1025, log: boolean=false, lowFrequencyBound: number=0, normalize: string='unit_sum', numberBands: number=24, sampleRate: number=44100, type: string='power', warpingFormula: string='htkMel', weighting: string='warping') {
    this.algoInstance = new wasmBackend.MelBands(highFrequencyBound, inputSize, log, lowFrequencyBound, normalize, numberBands, sampleRate, type, warpingFormula, weighting);
  }
  configure(highFrequencyBound: number=22050, inputSize: number=1025, log: boolean=false, lowFrequencyBound: number=0, normalize: string='unit_sum', numberBands: number=24, sampleRate: number=44100, type: string='power', warpingFormula: string='htkMel', weighting: string='warping') {
    this.algoInstance.configure(highFrequencyBound, inputSize, log, lowFrequencyBound, normalize, numberBands, sampleRate, type, warpingFormula, weighting);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the time signature of a given beatogram by finding the highest correlation between beats. Check https://essentia.upf.edu/reference/std_Meter.html for more details.
* @class
* @param {VectorVectorFloat} beatogram filtered matrix loudness
* @returns {object} {meter: 'the time signature'}
* @memberof Essentia
*/
class Meter {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.Meter();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(beatogram: any) {
    return this.algoInstance.compute(beatogram);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm calculates the minimum or maximum value of an array.
If the array has more than one minimum or maximum value, the index of the first one is returned Check https://essentia.upf.edu/reference/std_MinMax.html for more details.
* @class
* @param {VectorFloat} array the input array
* @param {string} [type=min] the type of the operation
* @returns {object} {real: 'the minimum or maximum of the input array, according to the type parameter', int: 'the index of the value'}
* @memberof Essentia
*/
class MinMax {
  private algoInstance: any;
  constructor(type: string='min') {
    this.algoInstance = new wasmBackend.MinMax(type);
  }
  configure(type: string='min') {
    this.algoInstance.configure(type);
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the ratio between the index of the minimum value of the envelope of a signal and the total length of the envelope. Check https://essentia.upf.edu/reference/std_MinToTotal.html for more details.
* @class
* @param {VectorFloat} envelope the envelope of the signal
* @returns {object} {minToTotal: 'the minimum amplitude position to total length ratio'}
* @memberof Essentia
*/
class MinToTotal {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.MinToTotal();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(envelope: any) {
    return this.algoInstance.compute(envelope);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements a FIR Moving Average filter. Because of its dependece on IIR, IIR's requirements are inherited. Check https://essentia.upf.edu/reference/std_MovingAverage.html for more details.
* @class
* @param {VectorFloat} signal the input audio signal
* @param {number} [size=6] the size of the window [audio samples]
* @returns {object} {signal: 'the filtered signal'}
* @memberof Essentia
*/
class MovingAverage {
  private algoInstance: any;
  constructor(size: number=6) {
    this.algoInstance = new wasmBackend.MovingAverage(size);
  }
  configure(size: number=6) {
    this.algoInstance.configure(size);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates multiple pitch values corresponding to the melodic lines present in a polyphonic music signal (for example, string quartet, piano). This implementation is based on the algorithm in [1]: In each frame, a set of possible fundamental frequency candidates is extracted based on the principle of harmonic summation. In an optimization stage, the number of harmonic sources (polyphony) is estimated and the final set of fundamental frequencies determined. In contrast to the pich salience function proposed in [2], this implementation uses the pitch salience function described in [1].
The output is a vector for each frame containing the estimated melody pitch values. Check https://essentia.upf.edu/reference/std_MultiPitchKlapuri.html for more details.
* @class
* @param {VectorFloat} signal the input signal
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
* @returns {object} {pitch: 'the estimated pitch values [Hz]'}
* @memberof Essentia
*/
class MultiPitchKlapuri {
  private algoInstance: any;
  constructor(binResolution: number=10, frameSize: number=2048, harmonicWeight: number=0.8, hopSize: number=128, magnitudeCompression: number=1, magnitudeThreshold: number=40, maxFrequency: number=1760, minFrequency: number=80, numberHarmonics: number=10, referenceFrequency: number=55, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.MultiPitchKlapuri(binResolution, frameSize, harmonicWeight, hopSize, magnitudeCompression, magnitudeThreshold, maxFrequency, minFrequency, numberHarmonics, referenceFrequency, sampleRate);
  }
  configure(binResolution: number=10, frameSize: number=2048, harmonicWeight: number=0.8, hopSize: number=128, magnitudeCompression: number=1, magnitudeThreshold: number=40, maxFrequency: number=1760, minFrequency: number=80, numberHarmonics: number=10, referenceFrequency: number=55, sampleRate: number=44100) {
    this.algoInstance.configure(binResolution, frameSize, harmonicWeight, hopSize, magnitudeCompression, magnitudeThreshold, maxFrequency, minFrequency, numberHarmonics, referenceFrequency, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates multiple fundamental frequency contours from an audio signal. It is a multi pitch version of the MELODIA algorithm described in [1]. While the algorithm is originally designed to extract melody in polyphonic music, this implementation is adapted for multiple sources. The approach is based on the creation and characterization of pitch contours, time continuous sequences of pitch candidates grouped using auditory streaming cues. To this end, PitchSalienceFunction, PitchSalienceFunctionPeaks, PitchContours, and PitchContoursMonoMelody algorithms are employed. It is strongly advised to use the default parameter values which are optimized according to [1] (where further details are provided) except for minFrequency, maxFrequency, and voicingTolerance, which will depend on your application. Check https://essentia.upf.edu/reference/std_MultiPitchMelodia.html for more details.
* @class
* @param {VectorFloat} signal the input signal
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
* @returns {object} {pitch: 'the estimated pitch values [Hz]'}
* @memberof Essentia
*/
class MultiPitchMelodia {
  private algoInstance: any;
  constructor(binResolution: number=10, filterIterations: number=3, frameSize: number=2048, guessUnvoiced: boolean=false, harmonicWeight: number=0.8, hopSize: number=128, magnitudeCompression: number=1, magnitudeThreshold: number=40, maxFrequency: number=20000, minDuration: number=100, minFrequency: number=40, numberHarmonics: number=20, peakDistributionThreshold: number=0.9, peakFrameThreshold: number=0.9, pitchContinuity: number=27.5625, referenceFrequency: number=55, sampleRate: number=44100, timeContinuity: number=100) {
    this.algoInstance = new wasmBackend.MultiPitchMelodia(binResolution, filterIterations, frameSize, guessUnvoiced, harmonicWeight, hopSize, magnitudeCompression, magnitudeThreshold, maxFrequency, minDuration, minFrequency, numberHarmonics, peakDistributionThreshold, peakFrameThreshold, pitchContinuity, referenceFrequency, sampleRate, timeContinuity);
  }
  configure(binResolution: number=10, filterIterations: number=3, frameSize: number=2048, guessUnvoiced: boolean=false, harmonicWeight: number=0.8, hopSize: number=128, magnitudeCompression: number=1, magnitudeThreshold: number=40, maxFrequency: number=20000, minDuration: number=100, minFrequency: number=40, numberHarmonics: number=20, peakDistributionThreshold: number=0.9, peakFrameThreshold: number=0.9, pitchContinuity: number=27.5625, referenceFrequency: number=55, sampleRate: number=44100, timeContinuity: number=100) {
    this.algoInstance.configure(binResolution, filterIterations, frameSize, guessUnvoiced, harmonicWeight, hopSize, magnitudeCompression, magnitudeThreshold, maxFrequency, minDuration, minFrequency, numberHarmonics, peakDistributionThreshold, peakFrameThreshold, pitchContinuity, referenceFrequency, sampleRate, timeContinuity);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm returns a single vector from a given number of real values and/or frames. Frames from different inputs are multiplexed onto a single stream in an alternating fashion. Check https://essentia.upf.edu/reference/std_Multiplexer.html for more details.
* @class
* @param {number} [numberRealInputs=0] the number of inputs of type Real to multiplex
* @param {number} [numberVectorRealInputs=0] the number of inputs of type vector<Real> to multiplex
* @returns {object} {data: 'the frame containing the input values and/or input frames'}
* @memberof Essentia
*/
class Multiplexer {
  private algoInstance: any;
  constructor(numberRealInputs: number=0, numberVectorRealInputs: number=0) {
    this.algoInstance = new wasmBackend.Multiplexer(numberRealInputs, numberVectorRealInputs);
  }
  configure(numberRealInputs: number=0, numberVectorRealInputs: number=0) {
    this.algoInstance.configure(numberRealInputs, numberVectorRealInputs);
  }
  compute() {
    return this.algoInstance.compute();
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm extracts treble and bass chromagrams from a sequence of log-frequency spectrum frames.
On this representation, two processing steps are performed:
  -tuning, after which each centre bin (i.e. bin 2, 5, 8, ...) corresponds to a semitone, even if the tuning of the piece deviates from 440 Hz standard pitch.
  -running standardisation: subtraction of the running mean, division by the running standard deviation. This has a spectral whitening effect.
This code is ported from NNLS Chroma [1, 2]. To achieve similar results follow this processing chain:
frame slicing with sample rate = 44100, frame size = 16384, hop size = 2048 -> Windowing with Hann and no normalization -> Spectrum -> LogSpectrum. Check https://essentia.upf.edu/reference/std_NNLSChroma.html for more details.
* @class
* @param {VectorVectorFloat} logSpectrogram log spectrum frames
* @param {VectorFloat} meanTuning mean tuning frames
* @param {VectorFloat} localTuning local tuning frames
* @param {string} [chromaNormalization=none] determines whether or how the chromagrams are normalised
* @param {number} [frameSize=1025] the input frame size of the spectrum vector
* @param {number} [sampleRate=44100] the input sample rate
* @param {number} [spectralShape=0.7]  the shape of the notes in the NNLS dictionary
* @param {number} [spectralWhitening=1] determines how much the log-frequency spectrum is whitened
* @param {string} [tuningMode=global] local uses a local average for tuning, global uses all audio frames. Local tuning is only advisable when the tuning is likely to change over the audio
* @param {boolean} [useNNLS=true] toggle between NNLS approximate transcription and linear spectral mapping
* @returns {object} {tunedLogfreqSpectrum: 'Log frequency spectrum after tuning', semitoneSpectrum: 'a spectral representation with one bin per semitone', bassChromagram: ' a 12-dimensional chromagram, restricted to the bass range', chromagram: 'a 12-dimensional chromagram, restricted with mid-range emphasis'}
* @memberof Essentia
*/
class NNLSChroma {
  private algoInstance: any;
  constructor(chromaNormalization: string='none', frameSize: number=1025, sampleRate: number=44100, spectralShape: number=0.7, spectralWhitening: number=1, tuningMode: string='global', useNNLS: boolean=true) {
    this.algoInstance = new wasmBackend.NNLSChroma(chromaNormalization, frameSize, sampleRate, spectralShape, spectralWhitening, tuningMode, useNNLS);
  }
  configure(chromaNormalization: string='none', frameSize: number=1025, sampleRate: number=44100, spectralShape: number=0.7, spectralWhitening: number=1, tuningMode: string='global', useNNLS: boolean=true) {
    this.algoInstance.configure(chromaNormalization, frameSize, sampleRate, spectralShape, spectralWhitening, tuningMode, useNNLS);
  }
  compute(logSpectrogram: any, meanTuning: any, localTuning: any) {
    return this.algoInstance.compute(logSpectrogram, meanTuning, localTuning);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm adds noise to an input signal. The average energy of the noise in dB is defined by the level parameter, and is generated using the Mersenne Twister random number generator. Check https://essentia.upf.edu/reference/std_NoiseAdder.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {boolean} [fixSeed=false] if true, 0 is used as the seed for generating random values
* @param {number} [level=-100] power level of the noise generator [dB]
* @returns {object} {signal: 'the output signal with the added noise'}
* @memberof Essentia
*/
class NoiseAdder {
  private algoInstance: any;
  constructor(fixSeed: boolean=false, level: number=-100) {
    this.algoInstance = new wasmBackend.NoiseAdder(fixSeed, level);
  }
  configure(fixSeed: boolean=false, level: number=-100) {
    this.algoInstance.configure(fixSeed, level);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm detects noise bursts in the waveform by thresholding  the peaks of the second derivative. The threshold is computed using an Exponential Moving Average filter over the RMS of the second derivative of the input frame. Check https://essentia.upf.edu/reference/std_NoiseBurstDetector.html for more details.
* @class
* @param {VectorFloat} frame the input frame (must be non-empty)
* @param {number} [alpha=0.9] alpha coefficient for the Exponential Moving Average threshold estimation.
* @param {number} [silenceThreshold=-50] threshold to skip silent frames
* @param {number} [threshold=8] factor to control the dynamic theshold
* @returns {object} {indexes: 'indexes of the noisy samples'}
* @memberof Essentia
*/
class NoiseBurstDetector {
  private algoInstance: any;
  constructor(alpha: number=0.9, silenceThreshold: number=-50, threshold: number=8) {
    this.algoInstance = new wasmBackend.NoiseBurstDetector(alpha, silenceThreshold, threshold);
  }
  configure(alpha: number=0.9, silenceThreshold: number=-50, threshold: number=8) {
    this.algoInstance.configure(alpha, silenceThreshold, threshold);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the "novelty curve" (Grosche & Müller, 2009) onset detection function. The algorithm expects as an input a frame-wise sequence of frequency-bands energies or spectrum magnitudes as originally proposed in [1] (see FrequencyBands and Spectrum algorithms). Novelty in each band (or frequency bin) is computed as a derivative between log-compressed energy (magnitude) values in consequent frames. The overall novelty value is then computed as a weighted sum that can be configured using 'weightCurve' parameter. The resulting novelty curve can be used for beat tracking and onset detection (see BpmHistogram and Onsets). Check https://essentia.upf.edu/reference/std_NoveltyCurve.html for more details.
* @class
* @param {VectorVectorFloat} frequencyBands the frequency bands
* @param {number} [frameRate=344.531] the sampling rate of the input audio
* @param {boolean} [normalize=false] whether to normalize each band's energy
* @param {any[]} [weightCurve=[]] vector containing the weights for each frequency band. Only if weightCurveType==supplied
* @param {string} [weightCurveType=hybrid] the type of weighting to be used for the bands novelty
* @returns {object} {novelty: 'the novelty curve as a single vector'}
* @memberof Essentia
*/
class NoveltyCurve {
  private algoInstance: any;
  constructor(frameRate: number=344.531, normalize: boolean=false, weightCurve: any[]=[], weightCurveType: string='hybrid') {
    let vecweightCurve = arrayToVector(weightCurve);
    this.algoInstance = new wasmBackend.NoveltyCurve(frameRate, normalize, vecweightCurve, weightCurveType);
  }
  configure(frameRate: number=344.531, normalize: boolean=false, weightCurve: any[]=[], weightCurveType: string='hybrid') {
    let vecweightCurve = arrayToVector(weightCurve);
    this.algoInstance.configure(frameRate, normalize, vecweightCurve, weightCurveType);
  }
  compute(frequencyBands: any) {
    return this.algoInstance.compute(frequencyBands);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm outputs a histogram of the most probable bpms assuming the signal has constant tempo given the novelty curve. This algorithm is based on the autocorrelation of the novelty curve (see NoveltyCurve algorithm) and should only be used for signals that have a constant tempo or as a first tempo estimator to be used in conjunction with other algorithms such as BpmHistogram.It is a simplified version of the algorithm described in [1] as, in order to predict the best BPM candidate,  it computes autocorrelation of the entire novelty curve instead of analyzing it on frames and histogramming the peaks over frames. Check https://essentia.upf.edu/reference/std_NoveltyCurveFixedBpmEstimator.html for more details.
* @class
* @param {VectorFloat} novelty the novelty curve of the audio signal
* @param {number} [hopSize=512] the hopSize used to computeh the novelty curve from the original signal
* @param {number} [maxBpm=560] the maximum bpm to look for
* @param {number} [minBpm=30] the minimum bpm to look for
* @param {number} [sampleRate=44100] the sampling rate original audio signal [Hz]
* @param {number} [tolerance=3] tolerance (in percentage) for considering bpms to be equal
* @returns {object} {bpms: 'the bpm candidates sorted by magnitude', amplitudes: 'the magnitude of each bpm candidate'}
* @memberof Essentia
*/
class NoveltyCurveFixedBpmEstimator {
  private algoInstance: any;
  constructor(hopSize: number=512, maxBpm: number=560, minBpm: number=30, sampleRate: number=44100, tolerance: number=3) {
    this.algoInstance = new wasmBackend.NoveltyCurveFixedBpmEstimator(hopSize, maxBpm, minBpm, sampleRate, tolerance);
  }
  configure(hopSize: number=512, maxBpm: number=560, minBpm: number=30, sampleRate: number=44100, tolerance: number=3) {
    this.algoInstance.configure(hopSize, maxBpm, minBpm, sampleRate, tolerance);
  }
  compute(novelty: any) {
    return this.algoInstance.compute(novelty);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the ratio between a signal's odd and even harmonic energy given the signal's harmonic peaks. The odd to even harmonic energy ratio is a measure allowing to distinguish odd-harmonic-energy predominant sounds (such as from a clarinet) from equally important even-harmonic-energy sounds (such as from a trumpet). The required harmonic frequencies and magnitudes can be computed by the HarmonicPeaks algorithm.
In the case when the even energy is zero, which may happen when only even harmonics where found or when only one peak was found, the algorithm outputs the maximum real number possible. Therefore, this algorithm should be used in conjunction with the harmonic peaks algorithm.
If no peaks are supplied, the algorithm outputs a value of one, assuming either the spectrum was flat or it was silent. Check https://essentia.upf.edu/reference/std_OddToEvenHarmonicEnergyRatio.html for more details.
* @class
* @param {VectorFloat} frequencies the frequencies of the harmonic peaks (at least two frequencies in frequency ascending order)
* @param {VectorFloat} magnitudes the magnitudes of the harmonic peaks (at least two magnitudes in frequency ascending order)
* @returns {object} {oddToEvenHarmonicEnergyRatio: 'the ratio between the odd and even harmonic energies of the given harmonic peaks'}
* @memberof Essentia
*/
class OddToEvenHarmonicEnergyRatio {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.OddToEvenHarmonicEnergyRatio();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(frequencies, magnitudes);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes various onset detection functions. The output of this algorithm should be post-processed in order to determine whether the frame contains an onset or not. Namely, it could be fed to the Onsets algorithm. It is recommended that the input "spectrum" is generated by the Spectrum algorithm.
Four methods are available:
  - 'HFC', the High Frequency Content detection function which accurately detects percussive events (see HFC algorithm for details).
  - 'complex', the Complex-Domain spectral difference function [1] taking into account changes in magnitude and phase. It emphasizes note onsets either as a result of significant change in energy in the magnitude spectrum, and/or a deviation from the expected phase values in the phase spectrum, caused by a change in pitch.
  - 'complex_phase', the simplified Complex-Domain spectral difference function [2] taking into account phase changes, weighted by magnitude. TODO:It reacts better on tonal sounds such as bowed string, but tends to over-detect percussive events.
  - 'flux', the Spectral Flux detection function which characterizes changes in magnitude spectrum. See Flux algorithm for details.
  - 'melflux', the spectral difference function, similar to spectral flux, but using half-rectified energy changes in Mel-frequency bands of the spectrum [3].
  - 'rms', the difference function, measuring the half-rectified change of the RMS of the magnitude spectrum (i.e., measuring overall energy flux) [4]. Check https://essentia.upf.edu/reference/std_OnsetDetection.html for more details.
* @class
* @param {VectorFloat} spectrum the input spectrum
* @param {VectorFloat} phase the phase vector corresponding to this spectrum (used only by the "complex" method)
* @param {string} [method=hfc] the method used for onset detection
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {onsetDetection: 'the value of the detection function in the current frame'}
* @memberof Essentia
*/
class OnsetDetection {
  private algoInstance: any;
  constructor(method: string='hfc', sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.OnsetDetection(method, sampleRate);
  }
  configure(method: string='hfc', sampleRate: number=44100) {
    this.algoInstance.configure(method, sampleRate);
  }
  compute(spectrum: any, phase: any) {
    return this.algoInstance.compute(spectrum, phase);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes various onset detection functions. Detection values are computed frame-wisely given an input signal. The output of this algorithm should be post-processed in order to determine whether the frame contains an onset or not. Namely, it could be fed to the Onsets algorithm.
The following method are available:
  - 'infogain', the spectral difference measured by the modified information gain [1]. For each frame, it accounts for energy change in between preceding and consecutive frames, histogrammed together, in order to suppress short-term variations on frame-by-frame basis.
  - 'beat_emphasis', the beat emphasis function [1]. This function is a linear combination of onset detection functions (complex spectral differences) in a number of sub-bands, weighted by their beat strength computed over the entire input signal.
Note:
  - 'infogain' onset detection has been optimized for the default sampleRate=44100Hz, frameSize=2048, hopSize=512.
  - 'beat_emphasis' is optimized for a fixed resolution of 11.6ms, which corresponds to the default sampleRate=44100Hz, frameSize=1024, hopSize=512.
  Optimal performance of beat detection with TempoTapDegara is not guaranteed for other settings. Check https://essentia.upf.edu/reference/std_OnsetDetectionGlobal.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {number} [frameSize=2048] the frame size for computing onset detection function
* @param {number} [hopSize=512] the hop size for computing onset detection function
* @param {string} [method=infogain] the method used for onset detection
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {onsetDetections: 'the frame-wise values of the detection function'}
* @memberof Essentia
*/
class OnsetDetectionGlobal {
  private algoInstance: any;
  constructor(frameSize: number=2048, hopSize: number=512, method: string='infogain', sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.OnsetDetectionGlobal(frameSize, hopSize, method, sampleRate);
  }
  configure(frameSize: number=2048, hopSize: number=512, method: string='infogain', sampleRate: number=44100) {
    this.algoInstance.configure(frameSize, hopSize, method, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the number of onsets per second and their position in time for an audio signal. Onset detection functions are computed using both high frequency content and complex-domain methods available in OnsetDetection algorithm. See OnsetDetection for more information.
Please note that due to a dependence on the Onsets algorithm, this algorithm is only valid for audio signals with a sampling rate of 44100Hz.
This algorithm throws an exception if the input signal is empty. Check https://essentia.upf.edu/reference/std_OnsetRate.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @returns {object} {onsets: 'the positions of detected onsets [s]', onsetRate: 'the number of onsets per second'}
* @memberof Essentia
*/
class OnsetRate {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.OnsetRate();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm returns the output of an overlap-add process for a sequence of frames of an audio signal. It considers that the input audio frames are windowed audio signals. Giving the size of the frame and the hop size, overlapping and adding consecutive frames will produce a continuous signal. A normalization gain can be passed as a parameter. Check https://essentia.upf.edu/reference/std_OverlapAdd.html for more details.
* @class
* @param {VectorFloat} signal the windowed input audio frame
* @param {number} [frameSize=2048] the frame size for computing the overlap-add process
* @param {number} [gain=1] the normalization gain that scales the output signal. Useful for IFFT output
* @param {number} [hopSize=128] the hop size with which the overlap-add function is computed
* @returns {object} {signal: 'the output overlap-add audio signal frame'}
* @memberof Essentia
*/
class OverlapAdd {
  private algoInstance: any;
  constructor(frameSize: number=2048, gain: number=1, hopSize: number=128) {
    this.algoInstance = new wasmBackend.OverlapAdd(frameSize, gain, hopSize);
  }
  configure(frameSize: number=2048, gain: number=1, hopSize: number=128) {
    this.algoInstance.configure(frameSize, gain, hopSize);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm detects local maxima (peaks) in an array. The algorithm finds positive slopes and detects a peak when the slope changes sign and the peak is above the threshold.
It optionally interpolates using parabolic curve fitting.
When two consecutive peaks are closer than the `minPeakDistance` parameter, the smallest one is discarded. A value of 0 bypasses this feature. Check https://essentia.upf.edu/reference/std_PeakDetection.html for more details.
* @class
* @param {VectorFloat} array the input array
* @param {boolean} [interpolate=true] boolean flag to enable interpolation
* @param {number} [maxPeaks=100] the maximum number of returned peaks
* @param {number} [maxPosition=1] the maximum value of the range to evaluate
* @param {number} [minPeakDistance=0] minimum distance between consecutive peaks (0 to bypass this feature)
* @param {number} [minPosition=0] the minimum value of the range to evaluate
* @param {string} [orderBy=position] the ordering type of the output peaks (ascending by position or descending by value)
* @param {number} [range=1] the input range
* @param {number} [threshold=-1e+06] peaks below this given threshold are not output
* @returns {object} {positions: 'the positions of the peaks', amplitudes: 'the amplitudes of the peaks'}
* @memberof Essentia
*/
class PeakDetection {
  private algoInstance: any;
  constructor(interpolate: boolean=true, maxPeaks: number=100, maxPosition: number=1, minPeakDistance: number=0, minPosition: number=0, orderBy: string='position', range: number=1, threshold: number=-1e+06) {
    this.algoInstance = new wasmBackend.PeakDetection(interpolate, maxPeaks, maxPosition, minPeakDistance, minPosition, orderBy, range, threshold);
  }
  configure(interpolate: boolean=true, maxPeaks: number=100, maxPosition: number=1, minPeakDistance: number=0, minPosition: number=0, orderBy: string='position', range: number=1, threshold: number=-1e+06) {
    this.algoInstance.configure(interpolate, maxPeaks, maxPosition, minPeakDistance, minPosition, orderBy, range, threshold);
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the tempo in beats per minute (BPM) from an input signal as described in [1]. Check https://essentia.upf.edu/reference/std_PercivalBpmEstimator.html for more details.
* @class
* @param {VectorFloat} signal input signal
* @param {number} [frameSize=1024] frame size for the analysis of the input signal
* @param {number} [frameSizeOSS=2048] frame size for the analysis of the Onset Strength Signal
* @param {number} [hopSize=128] hop size for the analysis of the input signal
* @param {number} [hopSizeOSS=128] hop size for the analysis of the Onset Strength Signal
* @param {number} [maxBPM=210] maximum BPM to detect
* @param {number} [minBPM=50] minimum BPM to detect
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {bpm: 'the tempo estimation [bpm]'}
* @memberof Essentia
*/
class PercivalBpmEstimator {
  private algoInstance: any;
  constructor(frameSize: number=1024, frameSizeOSS: number=2048, hopSize: number=128, hopSizeOSS: number=128, maxBPM: number=210, minBPM: number=50, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.PercivalBpmEstimator(frameSize, frameSizeOSS, hopSize, hopSizeOSS, maxBPM, minBPM, sampleRate);
  }
  configure(frameSize: number=1024, frameSizeOSS: number=2048, hopSize: number=128, hopSizeOSS: number=128, maxBPM: number=210, minBPM: number=50, sampleRate: number=44100) {
    this.algoInstance.configure(frameSize, frameSizeOSS, hopSize, hopSizeOSS, maxBPM, minBPM, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements the 'Enhance Harmonics' step as described in [1].Given an input autocorrelation signal, two time-stretched versions of it scaled by factors of 2 and 4 are added to the original.For more details check the referenced paper. Check https://essentia.upf.edu/reference/std_PercivalEnhanceHarmonics.html for more details.
* @class
* @param {VectorFloat} array the input signal
* @returns {object} {array: 'the input signal with enhanced harmonics'}
* @memberof Essentia
*/
class PercivalEnhanceHarmonics {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.PercivalEnhanceHarmonics();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements the 'Evaluate Pulse Trains' step as described in [1].Given an input onset detection function (ODF, called "onset strength signal", OSS, in the original paper) and a number of candidate BPM peak positions, the ODF is correlated with ideal expected pulse trains (for each candidate tempo lag) shifted in time by different amounts.The candidate tempo lag that generates a periodic pulse train with the best correlation to the ODF is returned as the best tempo estimate.
For more details check the referenced paper.Please note that in the original paper, the term OSS (Onset Strength Signal) is used instead of ODF. Check https://essentia.upf.edu/reference/std_PercivalEvaluatePulseTrains.html for more details.
* @class
* @param {VectorFloat} oss onset strength signal (or other novelty curve)
* @param {VectorFloat} positions peak positions of BPM candidates
* @returns {object} {lag: 'best tempo lag estimate'}
* @memberof Essentia
*/
class PercivalEvaluatePulseTrains {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.PercivalEvaluatePulseTrains();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(oss: any, positions: any) {
    return this.algoInstance.compute(oss, positions);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm converts a pitch sequence estimated from an audio signal into a set of discrete note events. Each note is defined by its onset time, duration and MIDI pitch value, quantized to the equal tempered scale. Check https://essentia.upf.edu/reference/std_PitchContourSegmentation.html for more details.
* @class
* @param {VectorFloat} pitch estimated pitch contour [Hz]
* @param {VectorFloat} signal input audio signal
* @param {number} [hopSize=128] hop size of the extracted pitch
* @param {number} [minDuration=0.1] minimum note duration [s]
* @param {number} [pitchDistanceThreshold=60] pitch threshold for note segmentation [cents]
* @param {number} [rmsThreshold=-2] zscore threshold for note segmentation
* @param {number} [sampleRate=44100] sample rate of the audio signal
* @param {number} [tuningFrequency=440] tuning reference frequency  [Hz]
* @returns {object} {onset: 'note onset times [s]', duration: 'note durations [s]', MIDIpitch: 'quantized MIDI pitch value'}
* @memberof Essentia
*/
class PitchContourSegmentation {
  private algoInstance: any;
  constructor(hopSize: number=128, minDuration: number=0.1, pitchDistanceThreshold: number=60, rmsThreshold: number=-2, sampleRate: number=44100, tuningFrequency: number=440) {
    this.algoInstance = new wasmBackend.PitchContourSegmentation(hopSize, minDuration, pitchDistanceThreshold, rmsThreshold, sampleRate, tuningFrequency);
  }
  configure(hopSize: number=128, minDuration: number=0.1, pitchDistanceThreshold: number=60, rmsThreshold: number=-2, sampleRate: number=44100, tuningFrequency: number=440) {
    this.algoInstance.configure(hopSize, minDuration, pitchDistanceThreshold, rmsThreshold, sampleRate, tuningFrequency);
  }
  compute(pitch: any, signal: any) {
    return this.algoInstance.compute(pitch, signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm tracks a set of predominant pitch contours of an audio signal. This algorithm is intended to receive its "frequencies" and "magnitudes" inputs from the PitchSalienceFunctionPeaks algorithm outputs aggregated over all frames in the sequence. The output is a vector of estimated melody pitch values. Check https://essentia.upf.edu/reference/std_PitchContours.html for more details.
* @class
* @param {VectorVectorFloat} peakBins frame-wise array of cent bins corresponding to pitch salience function peaks
* @param {VectorVectorFloat} peakSaliences frame-wise array of values of salience function peaks
* @param {number} [binResolution=10] salience function bin resolution [cents]
* @param {number} [hopSize=128] the hop size with which the pitch salience function was computed
* @param {number} [minDuration=100] the minimum allowed contour duration [ms]
* @param {number} [peakDistributionThreshold=0.9] allowed deviation below the peak salience mean over all frames (fraction of the standard deviation)
* @param {number} [peakFrameThreshold=0.9] per-frame salience threshold factor (fraction of the highest peak salience in a frame)
* @param {number} [pitchContinuity=27.5625] pitch continuity cue (maximum allowed pitch change durig 1 ms time period) [cents]
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {number} [timeContinuity=100] time continuity cue (the maximum allowed gap duration for a pitch contour) [ms]
* @returns {object} {contoursBins: 'array of frame-wise vectors of cent bin values representing each contour', contoursSaliences: 'array of frame-wise vectors of pitch saliences representing each contour', contoursStartTimes: 'array of start times of each contour [s]', duration: 'time duration of the input signal [s]'}
* @memberof Essentia
*/
class PitchContours {
  private algoInstance: any;
  constructor(binResolution: number=10, hopSize: number=128, minDuration: number=100, peakDistributionThreshold: number=0.9, peakFrameThreshold: number=0.9, pitchContinuity: number=27.5625, sampleRate: number=44100, timeContinuity: number=100) {
    this.algoInstance = new wasmBackend.PitchContours(binResolution, hopSize, minDuration, peakDistributionThreshold, peakFrameThreshold, pitchContinuity, sampleRate, timeContinuity);
  }
  configure(binResolution: number=10, hopSize: number=128, minDuration: number=100, peakDistributionThreshold: number=0.9, peakFrameThreshold: number=0.9, pitchContinuity: number=27.5625, sampleRate: number=44100, timeContinuity: number=100) {
    this.algoInstance.configure(binResolution, hopSize, minDuration, peakDistributionThreshold, peakFrameThreshold, pitchContinuity, sampleRate, timeContinuity);
  }
  compute(peakBins: any, peakSaliences: any) {
    return this.algoInstance.compute(peakBins, peakSaliences);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm converts a set of pitch contours into a sequence of predominant f0 values in Hz by taking the value of the most predominant contour in each frame.
This algorithm is intended to receive its "contoursBins", "contoursSaliences", and "contoursStartTimes" inputs from the PitchContours algorithm. The "duration" input corresponds to the time duration of the input signal. The output is a vector of estimated pitch values and a vector of confidence values. Check https://essentia.upf.edu/reference/std_PitchContoursMelody.html for more details.
* @class
* @param {VectorVectorFloat} contoursBins array of frame-wise vectors of cent bin values representing each contour
* @param {VectorVectorFloat} contoursSaliences array of frame-wise vectors of pitch saliences representing each contour
* @param {VectorFloat} contoursStartTimes array of the start times of each contour [s]
* @param {number} duration time duration of the input signal [s]
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
* @returns {object} {pitch: 'vector of estimated pitch values (i.e., melody) [Hz]', pitchConfidence: 'confidence with which the pitch was detected'}
* @memberof Essentia
*/
class PitchContoursMelody {
  private algoInstance: any;
  constructor(binResolution: number=10, filterIterations: number=3, guessUnvoiced: boolean=false, hopSize: number=128, maxFrequency: number=20000, minFrequency: number=80, referenceFrequency: number=55, sampleRate: number=44100, voiceVibrato: boolean=false, voicingTolerance: number=0.2) {
    this.algoInstance = new wasmBackend.PitchContoursMelody(binResolution, filterIterations, guessUnvoiced, hopSize, maxFrequency, minFrequency, referenceFrequency, sampleRate, voiceVibrato, voicingTolerance);
  }
  configure(binResolution: number=10, filterIterations: number=3, guessUnvoiced: boolean=false, hopSize: number=128, maxFrequency: number=20000, minFrequency: number=80, referenceFrequency: number=55, sampleRate: number=44100, voiceVibrato: boolean=false, voicingTolerance: number=0.2) {
    this.algoInstance.configure(binResolution, filterIterations, guessUnvoiced, hopSize, maxFrequency, minFrequency, referenceFrequency, sampleRate, voiceVibrato, voicingTolerance);
  }
  compute(contoursBins: any, contoursSaliences: any, contoursStartTimes: any, duration: number) {
    return this.algoInstance.compute(contoursBins, contoursSaliences, contoursStartTimes, duration);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm converts a set of pitch contours into a sequence of f0 values in Hz by taking the value of the most salient contour in each frame.
In contrast to pitchContoursMelody, it assumes a single source. 
This algorithm is intended to receive its "contoursBins", "contoursSaliences", and "contoursStartTimes" inputs from the PitchContours algorithm. The "duration" input corresponds to the time duration of the input signal. The output is a vector of estimated pitch values and a vector of confidence values. Check https://essentia.upf.edu/reference/std_PitchContoursMonoMelody.html for more details.
* @class
* @param {VectorVectorFloat} contoursBins array of frame-wise vectors of cent bin values representing each contour
* @param {VectorVectorFloat} contoursSaliences array of frame-wise vectors of pitch saliences representing each contour
* @param {VectorFloat} contoursStartTimes array of the start times of each contour [s]
* @param {number} duration time duration of the input signal [s]
* @param {number} [binResolution=10] salience function bin resolution [cents]
* @param {number} [filterIterations=3] number of interations for the octave errors / pitch outlier filtering process
* @param {boolean} [guessUnvoiced=false] Estimate pitch for non-voiced segments by using non-salient contours when no salient ones are present in a frame
* @param {number} [hopSize=128] the hop size with which the pitch salience function was computed
* @param {number} [maxFrequency=20000] the maximum allowed frequency for salience function peaks (ignore contours with peaks above) [Hz]
* @param {number} [minFrequency=80] the minimum allowed frequency for salience function peaks (ignore contours with peaks below) [Hz]
* @param {number} [referenceFrequency=55] the reference frequency for Hertz to cent convertion [Hz], corresponding to the 0th cent bin
* @param {number} [sampleRate=44100] the sampling rate of the audio signal (Hz)
* @returns {object} {pitch: 'vector of estimated pitch values (i.e., melody) [Hz]', pitchConfidence: 'confidence with which the pitch was detected'}
* @memberof Essentia
*/
class PitchContoursMonoMelody {
  private algoInstance: any;
  constructor(binResolution: number=10, filterIterations: number=3, guessUnvoiced: boolean=false, hopSize: number=128, maxFrequency: number=20000, minFrequency: number=80, referenceFrequency: number=55, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.PitchContoursMonoMelody(binResolution, filterIterations, guessUnvoiced, hopSize, maxFrequency, minFrequency, referenceFrequency, sampleRate);
  }
  configure(binResolution: number=10, filterIterations: number=3, guessUnvoiced: boolean=false, hopSize: number=128, maxFrequency: number=20000, minFrequency: number=80, referenceFrequency: number=55, sampleRate: number=44100) {
    this.algoInstance.configure(binResolution, filterIterations, guessUnvoiced, hopSize, maxFrequency, minFrequency, referenceFrequency, sampleRate);
  }
  compute(contoursBins: any, contoursSaliences: any, contoursStartTimes: any, duration: number) {
    return this.algoInstance.compute(contoursBins, contoursSaliences, contoursStartTimes, duration);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm post-processes a set of pitch contours into a sequence of mutliple f0 values in Hz.
This algorithm is intended to receive its "contoursBins", "contoursSaliences", and "contoursStartTimes" inputs from the PitchContours algorithm. The "duration" input corresponds to the time duration of the input signal. The output is a vector of estimated pitch values Check https://essentia.upf.edu/reference/std_PitchContoursMultiMelody.html for more details.
* @class
* @param {VectorVectorFloat} contoursBins array of frame-wise vectors of cent bin values representing each contour
* @param {VectorVectorFloat} contoursSaliences array of frame-wise vectors of pitch saliences representing each contour
* @param {VectorFloat} contoursStartTimes array of the start times of each contour [s]
* @param {number} duration time duration of the input signal [s]
* @param {number} [binResolution=10] salience function bin resolution [cents]
* @param {number} [filterIterations=3] number of interations for the octave errors / pitch outlier filtering process
* @param {boolean} [guessUnvoiced=false] Estimate pitch for non-voiced segments by using non-salient contours when no salient ones are present in a frame
* @param {number} [hopSize=128] the hop size with which the pitch salience function was computed
* @param {number} [maxFrequency=20000] the maximum allowed frequency for salience function peaks (ignore contours with peaks above) [Hz]
* @param {number} [minFrequency=80] the minimum allowed frequency for salience function peaks (ignore contours with peaks below) [Hz]
* @param {number} [referenceFrequency=55] the reference frequency for Hertz to cent convertion [Hz], corresponding to the 0th cent bin
* @param {number} [sampleRate=44100] the sampling rate of the audio signal (Hz)
* @returns {object} {pitch: 'vector of estimated pitch values (i.e., melody) [Hz]'}
* @memberof Essentia
*/
class PitchContoursMultiMelody {
  private algoInstance: any;
  constructor(binResolution: number=10, filterIterations: number=3, guessUnvoiced: boolean=false, hopSize: number=128, maxFrequency: number=20000, minFrequency: number=80, referenceFrequency: number=55, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.PitchContoursMultiMelody(binResolution, filterIterations, guessUnvoiced, hopSize, maxFrequency, minFrequency, referenceFrequency, sampleRate);
  }
  configure(binResolution: number=10, filterIterations: number=3, guessUnvoiced: boolean=false, hopSize: number=128, maxFrequency: number=20000, minFrequency: number=80, referenceFrequency: number=55, sampleRate: number=44100) {
    this.algoInstance.configure(binResolution, filterIterations, guessUnvoiced, hopSize, maxFrequency, minFrequency, referenceFrequency, sampleRate);
  }
  compute(contoursBins: any, contoursSaliences: any, contoursStartTimes: any, duration: number) {
    return this.algoInstance.compute(contoursBins, contoursSaliences, contoursStartTimes, duration);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm corrects the fundamental frequency estimations for a sequence of frames given pitch values together with their confidence values. In particular, it removes non-confident parts and spurious jumps in pitch and applies octave corrections. Check https://essentia.upf.edu/reference/std_PitchFilter.html for more details.
* @class
* @param {VectorFloat} pitch vector of pitch values for the input frames [Hz]
* @param {VectorFloat} pitchConfidence vector of pitch confidence values for the input frames
* @param {number} [confidenceThreshold=36] ratio between the average confidence of the most confident chunk and the minimum allowed average confidence of a chunk
* @param {number} [minChunkSize=30] minumum number of frames in non-zero pitch chunks
* @param {boolean} [useAbsolutePitchConfidence=false] treat negative pitch confidence values as positive (use with melodia guessUnvoiced=True)
* @returns {object} {pitchFiltered: 'vector of corrected pitch values [Hz]'}
* @memberof Essentia
*/
class PitchFilter {
  private algoInstance: any;
  constructor(confidenceThreshold: number=36, minChunkSize: number=30, useAbsolutePitchConfidence: boolean=false) {
    this.algoInstance = new wasmBackend.PitchFilter(confidenceThreshold, minChunkSize, useAbsolutePitchConfidence);
  }
  configure(confidenceThreshold: number=36, minChunkSize: number=30, useAbsolutePitchConfidence: boolean=false) {
    this.algoInstance.configure(confidenceThreshold, minChunkSize, useAbsolutePitchConfidence);
  }
  compute(pitch: any, pitchConfidence: any) {
    return this.algoInstance.compute(pitch, pitchConfidence);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the fundamental frequency corresponding to the melody of a monophonic music signal based on the MELODIA algorithm. While the algorithm is originally designed to extract the predominant melody from polyphonic music [1], this implementation is adapted for monophonic signals. The approach is based on the creation and characterization of pitch contours, time continuous sequences of pitch candidates grouped using auditory streaming cues. To this end, PitchSalienceFunction, PitchSalienceFunctionPeaks, PitchContours, and PitchContoursMonoMelody algorithms are employed. It is strongly advised to use the default parameter values which are optimized according to [1] (where further details are provided) except for minFrequency and maxFrequency, which will depend on your application. Check https://essentia.upf.edu/reference/std_PitchMelodia.html for more details.
* @class
* @param {VectorFloat} signal the input signal
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
* @returns {object} {pitch: 'the estimated pitch values [Hz]', pitchConfidence: 'confidence with which the pitch was detected'}
* @memberof Essentia
*/
class PitchMelodia {
  private algoInstance: any;
  constructor(binResolution: number=10, filterIterations: number=3, frameSize: number=2048, guessUnvoiced: boolean=false, harmonicWeight: number=0.8, hopSize: number=128, magnitudeCompression: number=1, magnitudeThreshold: number=40, maxFrequency: number=20000, minDuration: number=100, minFrequency: number=40, numberHarmonics: number=20, peakDistributionThreshold: number=0.9, peakFrameThreshold: number=0.9, pitchContinuity: number=27.5625, referenceFrequency: number=55, sampleRate: number=44100, timeContinuity: number=100) {
    this.algoInstance = new wasmBackend.PitchMelodia(binResolution, filterIterations, frameSize, guessUnvoiced, harmonicWeight, hopSize, magnitudeCompression, magnitudeThreshold, maxFrequency, minDuration, minFrequency, numberHarmonics, peakDistributionThreshold, peakFrameThreshold, pitchContinuity, referenceFrequency, sampleRate, timeContinuity);
  }
  configure(binResolution: number=10, filterIterations: number=3, frameSize: number=2048, guessUnvoiced: boolean=false, harmonicWeight: number=0.8, hopSize: number=128, magnitudeCompression: number=1, magnitudeThreshold: number=40, maxFrequency: number=20000, minDuration: number=100, minFrequency: number=40, numberHarmonics: number=20, peakDistributionThreshold: number=0.9, peakFrameThreshold: number=0.9, pitchContinuity: number=27.5625, referenceFrequency: number=55, sampleRate: number=44100, timeContinuity: number=100) {
    this.algoInstance.configure(binResolution, filterIterations, frameSize, guessUnvoiced, harmonicWeight, hopSize, magnitudeCompression, magnitudeThreshold, maxFrequency, minDuration, minFrequency, numberHarmonics, peakDistributionThreshold, peakFrameThreshold, pitchContinuity, referenceFrequency, sampleRate, timeContinuity);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the pitch salience of a spectrum. The pitch salience is given by the ratio of the highest auto correlation value of the spectrum to the non-shifted auto correlation value. Pitch salience was designed as quick measure of tone sensation. Unpitched sounds (non-musical sound effects) and pure tones have an average pitch salience value close to 0 whereas sounds containing several harmonics in the spectrum tend to have a higher value. Check https://essentia.upf.edu/reference/std_PitchSalience.html for more details.
* @class
* @param {VectorFloat} spectrum the input audio spectrum
* @param {number} [highBoundary=5000] until which frequency we are looking for the minimum (must be smaller than half sampleRate) [Hz]
* @param {number} [lowBoundary=100] from which frequency we are looking for the maximum (must not be larger than highBoundary) [Hz]
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {pitchSalience: 'the pitch salience (normalized from 0 to 1)'}
* @memberof Essentia
*/
class PitchSalience {
  private algoInstance: any;
  constructor(highBoundary: number=5000, lowBoundary: number=100, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.PitchSalience(highBoundary, lowBoundary, sampleRate);
  }
  configure(highBoundary: number=5000, lowBoundary: number=100, sampleRate: number=44100) {
    this.algoInstance.configure(highBoundary, lowBoundary, sampleRate);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the pitch salience function of a signal frame given its spectral peaks. The salience function covers a pitch range of nearly five octaves (i.e., 6000 cents), starting from the "referenceFrequency", and is quantized into cent bins according to the specified "binResolution". The salience of a given frequency is computed as the sum of the weighted energies found at integer multiples (harmonics) of that frequency.  Check https://essentia.upf.edu/reference/std_PitchSalienceFunction.html for more details.
* @class
* @param {VectorFloat} frequencies the frequencies of the spectral peaks [Hz]
* @param {VectorFloat} magnitudes the magnitudes of the spectral peaks
* @param {number} [binResolution=10] salience function bin resolution [cents]
* @param {number} [harmonicWeight=0.8] harmonic weighting parameter (weight decay ratio between two consequent harmonics, =1 for no decay)
* @param {number} [magnitudeCompression=1] magnitude compression parameter (=0 for maximum compression, =1 for no compression)
* @param {number} [magnitudeThreshold=40] peak magnitude threshold (maximum allowed difference from the highest peak in dBs)
* @param {number} [numberHarmonics=20] number of considered harmonics
* @param {number} [referenceFrequency=55] the reference frequency for Hertz to cent convertion [Hz], corresponding to the 0th cent bin
* @returns {object} {salienceFunction: 'array of the quantized pitch salience values'}
* @memberof Essentia
*/
class PitchSalienceFunction {
  private algoInstance: any;
  constructor(binResolution: number=10, harmonicWeight: number=0.8, magnitudeCompression: number=1, magnitudeThreshold: number=40, numberHarmonics: number=20, referenceFrequency: number=55) {
    this.algoInstance = new wasmBackend.PitchSalienceFunction(binResolution, harmonicWeight, magnitudeCompression, magnitudeThreshold, numberHarmonics, referenceFrequency);
  }
  configure(binResolution: number=10, harmonicWeight: number=0.8, magnitudeCompression: number=1, magnitudeThreshold: number=40, numberHarmonics: number=20, referenceFrequency: number=55) {
    this.algoInstance.configure(binResolution, harmonicWeight, magnitudeCompression, magnitudeThreshold, numberHarmonics, referenceFrequency);
  }
  compute(frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(frequencies, magnitudes);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the peaks of a given pitch salience function. Check https://essentia.upf.edu/reference/std_PitchSalienceFunctionPeaks.html for more details.
* @class
* @param {VectorFloat} salienceFunction the array of salience function values corresponding to cent frequency bins
* @param {number} [binResolution=10] salience function bin resolution [cents]
* @param {number} [maxFrequency=1760] the maximum frequency to evaluate (ignore peaks above) [Hz]
* @param {number} [minFrequency=55] the minimum frequency to evaluate (ignore peaks below) [Hz]
* @param {number} [referenceFrequency=55] the reference frequency for Hertz to cent convertion [Hz], corresponding to the 0th cent bin
* @returns {object} {salienceBins: 'the cent bins corresponding to salience function peaks', salienceValues: 'the values of salience function peaks'}
* @memberof Essentia
*/
class PitchSalienceFunctionPeaks {
  private algoInstance: any;
  constructor(binResolution: number=10, maxFrequency: number=1760, minFrequency: number=55, referenceFrequency: number=55) {
    this.algoInstance = new wasmBackend.PitchSalienceFunctionPeaks(binResolution, maxFrequency, minFrequency, referenceFrequency);
  }
  configure(binResolution: number=10, maxFrequency: number=1760, minFrequency: number=55, referenceFrequency: number=55) {
    this.algoInstance.configure(binResolution, maxFrequency, minFrequency, referenceFrequency);
  }
  compute(salienceFunction: any) {
    return this.algoInstance.compute(salienceFunction);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the fundamental frequency given the frame of a monophonic music signal. It is an implementation of the Yin algorithm [1] for computations in the time domain. Check https://essentia.upf.edu/reference/std_PitchYin.html for more details.
* @class
* @param {VectorFloat} signal the input signal frame
* @param {number} [frameSize=2048] number of samples in the input frame (this is an optional parameter to optimize memory allocation)
* @param {boolean} [interpolate=true] enable interpolation
* @param {number} [maxFrequency=22050] the maximum allowed frequency [Hz]
* @param {number} [minFrequency=20] the minimum allowed frequency [Hz]
* @param {number} [sampleRate=44100] sampling rate of the input audio [Hz]
* @param {number} [tolerance=0.15] tolerance for peak detection
* @returns {object} {pitch: 'detected pitch [Hz]', pitchConfidence: 'confidence with which the pitch was detected [0,1]'}
* @memberof Essentia
*/
class PitchYin {
  private algoInstance: any;
  constructor(frameSize: number=2048, interpolate: boolean=true, maxFrequency: number=22050, minFrequency: number=20, sampleRate: number=44100, tolerance: number=0.15) {
    this.algoInstance = new wasmBackend.PitchYin(frameSize, interpolate, maxFrequency, minFrequency, sampleRate, tolerance);
  }
  configure(frameSize: number=2048, interpolate: boolean=true, maxFrequency: number=22050, minFrequency: number=20, sampleRate: number=44100, tolerance: number=0.15) {
    this.algoInstance.configure(frameSize, interpolate, maxFrequency, minFrequency, sampleRate, tolerance);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the fundamental frequency given the spectrum of a monophonic music signal. It is an implementation of YinFFT algorithm [1], which is an optimized version of Yin algorithm for computation in the frequency domain. It is recommended to window the input spectrum with a Hann window. The raw spectrum can be computed with the Spectrum algorithm. Check https://essentia.upf.edu/reference/std_PitchYinFFT.html for more details.
* @class
* @param {VectorFloat} spectrum the input spectrum (preferably created with a hann window)
* @param {number} [frameSize=2048] number of samples in the input spectrum
* @param {boolean} [interpolate=true] boolean flag to enable interpolation
* @param {number} [maxFrequency=22050] the maximum allowed frequency [Hz]
* @param {number} [minFrequency=20] the minimum allowed frequency [Hz]
* @param {number} [sampleRate=44100] sampling rate of the input spectrum [Hz]
* @param {number} [tolerance=1] tolerance for peak detection
* @returns {object} {pitch: 'detected pitch [Hz]', pitchConfidence: 'confidence with which the pitch was detected [0,1]'}
* @memberof Essentia
*/
class PitchYinFFT {
  private algoInstance: any;
  constructor(frameSize: number=2048, interpolate: boolean=true, maxFrequency: number=22050, minFrequency: number=20, sampleRate: number=44100, tolerance: number=1) {
    this.algoInstance = new wasmBackend.PitchYinFFT(frameSize, interpolate, maxFrequency, minFrequency, sampleRate, tolerance);
  }
  configure(frameSize: number=2048, interpolate: boolean=true, maxFrequency: number=22050, minFrequency: number=20, sampleRate: number=44100, tolerance: number=1) {
    this.algoInstance.configure(frameSize, interpolate, maxFrequency, minFrequency, sampleRate, tolerance);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the pitch track of a mono audio signal using probabilistic Yin algorithm. Check https://essentia.upf.edu/reference/std_PitchYinProbabilistic.html for more details.
* @class
* @param {VectorFloat} signal the input mono audio signal
* @param {number} [frameSize=2048] the frame size of FFT
* @param {number} [hopSize=256] the hop size with which the pitch is computed
* @param {number} [lowRMSThreshold=0.1] the low RMS amplitude threshold
* @param {string} [outputUnvoiced=negative] whether output unvoiced frame, zero: output non-voiced pitch as 0.; abs: output non-voiced pitch as absolute values; negative: output non-voiced pitch as negative values
* @param {boolean} [preciseTime=false] use non-standard precise YIN timing (slow).
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {pitch: 'the output pitch estimations', voicedProbabilities: 'the voiced probabilities'}
* @memberof Essentia
*/
class PitchYinProbabilistic {
  private algoInstance: any;
  constructor(frameSize: number=2048, hopSize: number=256, lowRMSThreshold: number=0.1, outputUnvoiced: string='negative', preciseTime: boolean=false, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.PitchYinProbabilistic(frameSize, hopSize, lowRMSThreshold, outputUnvoiced, preciseTime, sampleRate);
  }
  configure(frameSize: number=2048, hopSize: number=256, lowRMSThreshold: number=0.1, outputUnvoiced: string='negative', preciseTime: boolean=false, sampleRate: number=44100) {
    this.algoInstance.configure(frameSize, hopSize, lowRMSThreshold, outputUnvoiced, preciseTime, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the fundamental frequencies, their probabilities given the frame of a monophonic music signal. It is a part of the implementation of the probabilistic Yin algorithm [1]. Check https://essentia.upf.edu/reference/std_PitchYinProbabilities.html for more details.
* @class
* @param {VectorFloat} signal the input signal frame
* @param {number} [frameSize=2048] number of samples in the input frame
* @param {number} [lowAmp=0.1] the low RMS amplitude threshold
* @param {boolean} [preciseTime=false] use non-standard precise YIN timing (slow).
* @param {number} [sampleRate=44100] sampling rate of the input audio [Hz]
* @returns {object} {pitch: 'the output pitch candidate frequencies in cents', probabilities: 'the output pitch candidate probabilities', RMS: 'the output RMS value'}
* @memberof Essentia
*/
class PitchYinProbabilities {
  private algoInstance: any;
  constructor(frameSize: number=2048, lowAmp: number=0.1, preciseTime: boolean=false, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.PitchYinProbabilities(frameSize, lowAmp, preciseTime, sampleRate);
  }
  configure(frameSize: number=2048, lowAmp: number=0.1, preciseTime: boolean=false, sampleRate: number=44100) {
    this.algoInstance.configure(frameSize, lowAmp, preciseTime, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the smoothed fundamental frequency given the pitch candidates and probabilities using hidden Markov models. It is a part of the implementation of the probabilistic Yin algorithm [1]. Check https://essentia.upf.edu/reference/std_PitchYinProbabilitiesHMM.html for more details.
* @class
* @param {VectorVectorFloat} pitchCandidates the pitch candidates
* @param {VectorVectorFloat} probabilities the pitch probabilities
* @param {number} [minFrequency=61.735] minimum detected frequency
* @param {number} [numberBinsPerSemitone=5] number of bins per semitone
* @param {number} [selfTransition=0.99] the self transition probabilities
* @param {number} [yinTrust=0.5] the yin trust parameter
* @returns {object} {pitch: 'pitch frequencies in Hz'}
* @memberof Essentia
*/
class PitchYinProbabilitiesHMM {
  private algoInstance: any;
  constructor(minFrequency: number=61.735, numberBinsPerSemitone: number=5, selfTransition: number=0.99, yinTrust: number=0.5) {
    this.algoInstance = new wasmBackend.PitchYinProbabilitiesHMM(minFrequency, numberBinsPerSemitone, selfTransition, yinTrust);
  }
  configure(minFrequency: number=61.735, numberBinsPerSemitone: number=5, selfTransition: number=0.99, yinTrust: number=0.5) {
    this.algoInstance.configure(minFrequency, numberBinsPerSemitone, selfTransition, yinTrust);
  }
  compute(pitchCandidates: any, probabilities: any) {
    return this.algoInstance.compute(pitchCandidates, probabilities);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the power mean of an array. It accepts one parameter, p, which is the power (or order or degree) of the Power Mean. Note that if p=-1, the Power Mean is equal to the Harmonic Mean, if p=0, the Power Mean is equal to the Geometric Mean, if p=1, the Power Mean is equal to the Arithmetic Mean, if p=2, the Power Mean is equal to the Root Mean Square. Check https://essentia.upf.edu/reference/std_PowerMean.html for more details.
* @class
* @param {VectorFloat} array the input array (must contain only positive real numbers)
* @param {number} [power=1] the power to which to elevate each element before taking the mean
* @returns {object} {powerMean: 'the power mean of the input array'}
* @memberof Essentia
*/
class PowerMean {
  private algoInstance: any;
  constructor(power: number=1) {
    this.algoInstance = new wasmBackend.PowerMean(power);
  }
  configure(power: number=1) {
    this.algoInstance.configure(power);
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the power spectrum of an array of Reals. The resulting power spectrum has a size which is half the size of the input array plus one. Bins contain squared magnitude values. Check https://essentia.upf.edu/reference/std_PowerSpectrum.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {number} [size=2048] the expected size of the input frame (this is purely optional and only targeted at optimizing the creation time of the FFT object)
* @returns {object} {powerSpectrum: 'power spectrum of the input signal'}
* @memberof Essentia
*/
class PowerSpectrum {
  private algoInstance: any;
  constructor(size: number=2048) {
    this.algoInstance = new wasmBackend.PowerSpectrum(size);
  }
  configure(size: number=2048) {
    this.algoInstance.configure(size);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the fundamental frequency of the predominant melody from polyphonic music signals using the MELODIA algorithm. It is specifically suited for music with a predominent melodic element, for example the singing voice melody in an accompanied singing recording. The approach [1] is based on the creation and characterization of pitch contours, time continuous sequences of pitch candidates grouped using auditory streaming cues. It furthermore determines for each frame, if the predominant melody is present or not. To this end, PitchSalienceFunction, PitchSalienceFunctionPeaks, PitchContours, and PitchContoursMelody algorithms are employed. It is strongly advised to use the default parameter values which are optimized according to [1] (where further details are provided) except for minFrequency, maxFrequency, and voicingTolerance, which will depend on your application. Check https://essentia.upf.edu/reference/std_PredominantPitchMelodia.html for more details.
* @class
* @param {VectorFloat} signal the input signal
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
* @returns {object} {pitch: 'the estimated pitch values [Hz]', pitchConfidence: 'confidence with which the pitch was detected'}
* @memberof Essentia
*/
class PredominantPitchMelodia {
  private algoInstance: any;
  constructor(binResolution: number=10, filterIterations: number=3, frameSize: number=2048, guessUnvoiced: boolean=false, harmonicWeight: number=0.8, hopSize: number=128, magnitudeCompression: number=1, magnitudeThreshold: number=40, maxFrequency: number=20000, minDuration: number=100, minFrequency: number=80, numberHarmonics: number=20, peakDistributionThreshold: number=0.9, peakFrameThreshold: number=0.9, pitchContinuity: number=27.5625, referenceFrequency: number=55, sampleRate: number=44100, timeContinuity: number=100, voiceVibrato: boolean=false, voicingTolerance: number=0.2) {
    this.algoInstance = new wasmBackend.PredominantPitchMelodia(binResolution, filterIterations, frameSize, guessUnvoiced, harmonicWeight, hopSize, magnitudeCompression, magnitudeThreshold, maxFrequency, minDuration, minFrequency, numberHarmonics, peakDistributionThreshold, peakFrameThreshold, pitchContinuity, referenceFrequency, sampleRate, timeContinuity, voiceVibrato, voicingTolerance);
  }
  configure(binResolution: number=10, filterIterations: number=3, frameSize: number=2048, guessUnvoiced: boolean=false, harmonicWeight: number=0.8, hopSize: number=128, magnitudeCompression: number=1, magnitudeThreshold: number=40, maxFrequency: number=20000, minDuration: number=100, minFrequency: number=80, numberHarmonics: number=20, peakDistributionThreshold: number=0.9, peakFrameThreshold: number=0.9, pitchContinuity: number=27.5625, referenceFrequency: number=55, sampleRate: number=44100, timeContinuity: number=100, voiceVibrato: boolean=false, voicingTolerance: number=0.2) {
    this.algoInstance.configure(binResolution, filterIterations, frameSize, guessUnvoiced, harmonicWeight, hopSize, magnitudeCompression, magnitudeThreshold, maxFrequency, minDuration, minFrequency, numberHarmonics, peakDistributionThreshold, peakFrameThreshold, pitchContinuity, referenceFrequency, sampleRate, timeContinuity, voiceVibrato, voicingTolerance);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the root mean square (quadratic mean) of an array.
RMS is not defined for empty arrays. In such case, an exception will be thrown
.
References:
  [1] Root mean square - Wikipedia, the free encyclopedia,
  http://en.wikipedia.org/wiki/Root_mean_square Check https://essentia.upf.edu/reference/std_RMS.html for more details.
* @class
* @param {VectorFloat} array the input array
* @returns {object} {rms: 'the root mean square of the input array'}
* @memberof Essentia
*/
class RMS {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.RMS();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the first 5 raw moments of an array. The output array is of size 6 because the zero-ith moment is used for padding so that the first moment corresponds to index 1. Check https://essentia.upf.edu/reference/std_RawMoments.html for more details.
* @class
* @param {VectorFloat} array the input array
* @param {number} [range=22050] the range of the input array, used for normalizing the results
* @returns {object} {rawMoments: 'the (raw) moments of the input array'}
* @memberof Essentia
*/
class RawMoments {
  private algoInstance: any;
  constructor(range: number=22050) {
    this.algoInstance = new wasmBackend.RawMoments(range);
  }
  configure(range: number=22050) {
    this.algoInstance.configure(range);
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the Replay Gain loudness value of an audio signal. The algorithm is described in detail in [1]. The value returned is the 'standard' ReplayGain value, not the value with 6dB preamplification as computed by lame, mp3gain, vorbisgain, and all widely used ReplayGain programs. Check https://essentia.upf.edu/reference/std_ReplayGain.html for more details.
* @class
* @param {VectorFloat} signal the input audio signal (must be longer than 0.05ms)
* @param {number} [sampleRate=44100] the sampling rate of the input audio signal [Hz]
* @returns {object} {replayGain: 'the distance to the suitable average replay level (~-31dbB) defined by SMPTE [dB]'}
* @memberof Essentia
*/
class ReplayGain {
  private algoInstance: any;
  constructor(sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.ReplayGain(sampleRate);
  }
  configure(sampleRate: number=44100) {
    this.algoInstance.configure(sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm resamples the input signal to the desired sampling rate. Check https://essentia.upf.edu/reference/std_Resample.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {number} [inputSampleRate=44100] the sampling rate of the input signal [Hz]
* @param {number} [outputSampleRate=44100] the sampling rate of the output signal [Hz]
* @param {number} [quality=1] the quality of the conversion, 0 for best quality, 4 for fast linear approximation
* @returns {object} {signal: 'the resampled signal'}
* @memberof Essentia
*/
class Resample {
  private algoInstance: any;
  constructor(inputSampleRate: number=44100, outputSampleRate: number=44100, quality: number=1) {
    this.algoInstance = new wasmBackend.Resample(inputSampleRate, outputSampleRate, quality);
  }
  configure(inputSampleRate: number=44100, outputSampleRate: number=44100, quality: number=1) {
    this.algoInstance.configure(inputSampleRate, outputSampleRate, quality);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm resamples a sequence using FFT/IFFT. The input and output sizes must be an even number. The algorithm is a counterpart of the resample function in SciPy. Check https://essentia.upf.edu/reference/std_ResampleFFT.html for more details.
* @class
* @param {VectorFloat} input input array
* @param {number} [inSize=128] the size of the input sequence. It needs to be even-sized.
* @param {number} [outSize=128] the size of the output sequence. It needs to be even-sized.
* @returns {object} {output: 'output resample array'}
* @memberof Essentia
*/
class ResampleFFT {
  private algoInstance: any;
  constructor(inSize: number=128, outSize: number=128) {
    this.algoInstance = new wasmBackend.ResampleFFT(inSize, outSize);
  }
  configure(inSize: number=128, outSize: number=128) {
    this.algoInstance.configure(inSize, outSize);
  }
  compute(input: any) {
    return this.algoInstance.compute(input);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes rhythm features (bpm, beat positions, beat histogram peaks) for an audio signal. It combines RhythmExtractor2013 for beat tracking and BPM estimation with BpmHistogramDescriptors algorithms. Check https://essentia.upf.edu/reference/std_RhythmDescriptors.html for more details.
* @class
* @param {VectorFloat} signal the audio input signal
* @returns {object} {beats_position: 'See RhythmExtractor2013 algorithm documentation', confidence: 'See RhythmExtractor2013 algorithm documentation', bpm: 'See RhythmExtractor2013 algorithm documentation', bpm_estimates: 'See RhythmExtractor2013 algorithm documentation', bpm_intervals: 'See RhythmExtractor2013 algorithm documentation', first_peak_bpm: 'See BpmHistogramDescriptors algorithm documentation', first_peak_spread: 'See BpmHistogramDescriptors algorithm documentation', first_peak_weight: 'See BpmHistogramDescriptors algorithm documentation', second_peak_bpm: 'See BpmHistogramDescriptors algorithm documentation', second_peak_spread: 'See BpmHistogramDescriptors algorithm documentation', second_peak_weight: 'See BpmHistogramDescriptors algorithm documentation', histogram: 'bpm histogram [bpm]'}
* @memberof Essentia
*/
class RhythmDescriptors {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.RhythmDescriptors();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the tempo in bpm and beat positions given an audio signal. The algorithm combines several periodicity functions and estimates beats using TempoTap and TempoTapTicks. It combines:
- onset detection functions based on high-frequency content (see OnsetDetection)
- complex-domain spectral difference function (see OnsetDetection)
- periodicity function based on energy bands (see FrequencyBands, TempoScaleBands) Check https://essentia.upf.edu/reference/std_RhythmExtractor.html for more details.
* @class
* @param {VectorFloat} signal the audio input signal
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
* @returns {object} {bpm: 'the tempo estimation [bpm]', ticks: ' the estimated tick locations [s]', estimates: 'the bpm estimation per frame [bpm]', bpmIntervals: 'list of beats interval [s]'}
* @memberof Essentia
*/
class RhythmExtractor {
  private algoInstance: any;
  constructor(frameHop: number=1024, frameSize: number=1024, hopSize: number=256, lastBeatInterval: number=0.1, maxTempo: number=208, minTempo: number=40, numberFrames: number=1024, sampleRate: number=44100, tempoHints: any[]=[], tolerance: number=0.24, useBands: boolean=true, useOnset: boolean=true) {
    let vectempoHints = arrayToVector(tempoHints);
    this.algoInstance = new wasmBackend.RhythmExtractor(frameHop, frameSize, hopSize, lastBeatInterval, maxTempo, minTempo, numberFrames, sampleRate, vectempoHints, tolerance, useBands, useOnset);
  }
  configure(frameHop: number=1024, frameSize: number=1024, hopSize: number=256, lastBeatInterval: number=0.1, maxTempo: number=208, minTempo: number=40, numberFrames: number=1024, sampleRate: number=44100, tempoHints: any[]=[], tolerance: number=0.24, useBands: boolean=true, useOnset: boolean=true) {
    let vectempoHints = arrayToVector(tempoHints);
    this.algoInstance.configure(frameHop, frameSize, hopSize, lastBeatInterval, maxTempo, minTempo, numberFrames, sampleRate, vectempoHints, tolerance, useBands, useOnset);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm extracts the beat positions and estimates their confidence as well as tempo in bpm for an audio signal. The beat locations can be computed using:
  - 'multifeature', the BeatTrackerMultiFeature algorithm
  - 'degara', the BeatTrackerDegara algorithm (note that there is no confidence estimation for this method, the output confidence value is always 0) Check https://essentia.upf.edu/reference/std_RhythmExtractor2013.html for more details.
* @class
* @param {VectorFloat} signal the audio input signal
* @param {number} [maxTempo=208] the fastest tempo to detect [bpm]
* @param {string} [method=multifeature] the method used for beat tracking
* @param {number} [minTempo=40] the slowest tempo to detect [bpm]
* @returns {object} {bpm: 'the tempo estimation [bpm]', ticks: ' the estimated tick locations [s]', confidence: 'confidence with which the ticks are detected (ignore this value if using 'degara' method)', estimates: 'the list of bpm estimates characterizing the bpm distribution for the signal [bpm]', bpmIntervals: 'list of beats interval [s]'}
* @memberof Essentia
*/
class RhythmExtractor2013 {
  private algoInstance: any;
  constructor(maxTempo: number=208, method: string='multifeature', minTempo: number=40) {
    this.algoInstance = new wasmBackend.RhythmExtractor2013(maxTempo, method, minTempo);
  }
  configure(maxTempo: number=208, method: string='multifeature', minTempo: number=40) {
    this.algoInstance.configure(maxTempo, method, minTempo);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements the rhythm transform. It computes a tempogram, a representation of rhythmic periodicities in the input signal in the rhythm domain, by using FFT similarly to computation of spectrum in the frequency domain [1]. Additional features, including rhythmic centroid and a rhythmic counterpart of MFCCs, can be derived from this rhythmic representation. Check https://essentia.upf.edu/reference/std_RhythmTransform.html for more details.
* @class
* @param {VectorVectorFloat} melBands the energies in the mel bands
* @param {number} [frameSize=256] the frame size to compute the rhythm trasform
* @param {number} [hopSize=32] the hop size to compute the rhythm transform
* @returns {object} {rhythm: 'consecutive frames in the rhythm domain'}
* @memberof Essentia
*/
class RhythmTransform {
  private algoInstance: any;
  constructor(frameSize: number=256, hopSize: number=32) {
    this.algoInstance = new wasmBackend.RhythmTransform(frameSize, hopSize);
  }
  configure(frameSize: number=256, hopSize: number=32) {
    this.algoInstance.configure(frameSize, hopSize);
  }
  compute(melBands: any) {
    return this.algoInstance.compute(melBands);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the roll-off frequency of a spectrum. The roll-off frequency is defined as the frequency under which some percentage (cutoff) of the total energy of the spectrum is contained. The roll-off frequency can be used to distinguish between harmonic (below roll-off) and noisy sounds (above roll-off). Check https://essentia.upf.edu/reference/std_RollOff.html for more details.
* @class
* @param {VectorFloat} spectrum the input audio spectrum (must have more than one elements)
* @param {number} [cutoff=0.85] the ratio of total energy to attain before yielding the roll-off frequency
* @param {number} [sampleRate=44100] the sampling rate of the audio signal (used to normalize rollOff) [Hz]
* @returns {object} {rollOff: 'the roll-off frequency [Hz]'}
* @memberof Essentia
*/
class RollOff {
  private algoInstance: any;
  constructor(cutoff: number=0.85, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.RollOff(cutoff, sampleRate);
  }
  configure(cutoff: number=0.85, sampleRate: number=44100) {
    this.algoInstance.configure(cutoff, sampleRate);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the SNR of the input audio in a frame-wise manner. Check https://essentia.upf.edu/reference/std_SNR.html for more details.
* @class
* @param {VectorFloat} frame the input audio frame
* @param {number} [MAAlpha=0.95] Alpha coefficient for the EMA SNR estimation [2]
* @param {number} [MMSEAlpha=0.98] Alpha coefficient for the MMSE estimation [1].
* @param {number} [NoiseAlpha=0.9] Alpha coefficient for the EMA noise estimation [2]
* @param {number} [frameSize=512] the size of the input frame
* @param {number} [noiseThreshold=-40] Threshold to detect frames without signal
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {boolean} [useBroadbadNoiseCorrection=true] flag to apply the -10 * log10(BW) broadband noise correction factor
* @returns {object} {instantSNR: 'SNR value for the the current frame', averagedSNR: 'averaged SNR through an Exponential Moving Average filter', spectralSNR: 'instant SNR for each frequency bin'}
* @memberof Essentia
*/
class SNR {
  private algoInstance: any;
  constructor(MAAlpha: number=0.95, MMSEAlpha: number=0.98, NoiseAlpha: number=0.9, frameSize: number=512, noiseThreshold: number=-40, sampleRate: number=44100, useBroadbadNoiseCorrection: boolean=true) {
    this.algoInstance = new wasmBackend.SNR(MAAlpha, MMSEAlpha, NoiseAlpha, frameSize, noiseThreshold, sampleRate, useBroadbadNoiseCorrection);
  }
  configure(MAAlpha: number=0.95, MMSEAlpha: number=0.98, NoiseAlpha: number=0.9, frameSize: number=512, noiseThreshold: number=-40, sampleRate: number=44100, useBroadbadNoiseCorrection: boolean=true) {
    this.algoInstance.configure(MAAlpha, MMSEAlpha, NoiseAlpha, frameSize, noiseThreshold, sampleRate, useBroadbadNoiseCorrection);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* this algorithm outputs the staring/ending locations of the saturated regions in seconds. Saturated regions are found by means of a tripe criterion:
	 1. samples in a saturated region should have more energy than a given threshold.
	 2. the difference between the samples in a saturated region should be smaller than a given threshold.
	 3. the duration of the saturated region should be longer than a given threshold. Check https://essentia.upf.edu/reference/std_SaturationDetector.html for more details.
* @class
* @param {VectorFloat} frame the input audio frame
* @param {number} [differentialThreshold=0.001] minimum difference between contiguous samples of the salturated regions
* @param {number} [energyThreshold=-1] mininimum energy of the samples in the saturated regions [dB]
* @param {number} [frameSize=512] expected input frame size
* @param {number} [hopSize=256] hop size used for the analysis
* @param {number} [minimumDuration=0.005] minimum duration of the saturated regions [ms]
* @param {number} [sampleRate=44100] sample rate used for the analysis
* @returns {object} {starts: 'starting times of the detected saturated regions [s]', ends: 'ending times of the detected saturated regions [s]'}
* @memberof Essentia
*/
class SaturationDetector {
  private algoInstance: any;
  constructor(differentialThreshold: number=0.001, energyThreshold: number=-1, frameSize: number=512, hopSize: number=256, minimumDuration: number=0.005, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.SaturationDetector(differentialThreshold, energyThreshold, frameSize, hopSize, minimumDuration, sampleRate);
  }
  configure(differentialThreshold: number=0.001, energyThreshold: number=-1, frameSize: number=512, hopSize: number=256, minimumDuration: number=0.005, sampleRate: number=44100) {
    this.algoInstance.configure(differentialThreshold, energyThreshold, frameSize, hopSize, minimumDuration, sampleRate);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm scales the audio by the specified factor using clipping if required. Check https://essentia.upf.edu/reference/std_Scale.html for more details.
* @class
* @param {VectorFloat} signal the input audio signal
* @param {boolean} [clipping=true] boolean flag whether to apply clipping or not
* @param {number} [factor=10] the multiplication factor by which the audio will be scaled
* @param {number} [maxAbsValue=1] the maximum value above which to apply clipping
* @returns {object} {signal: 'the output audio signal'}
* @memberof Essentia
*/
class Scale {
  private algoInstance: any;
  constructor(clipping: boolean=true, factor: number=10, maxAbsValue: number=1) {
    this.algoInstance = new wasmBackend.Scale(clipping, factor, maxAbsValue);
  }
  configure(clipping: boolean=true, factor: number=10, maxAbsValue: number=1) {
    this.algoInstance.configure(clipping, factor, maxAbsValue);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm subtracts the sinusoids computed with the sine model analysis from an input audio signal. It ouputs an audio signal. Check https://essentia.upf.edu/reference/std_SineSubtraction.html for more details.
* @class
* @param {VectorFloat} frame the input audio frame to subtract from
* @param {VectorFloat} magnitudes the magnitudes of the sinusoidal peaks
* @param {VectorFloat} frequencies the frequencies of the sinusoidal peaks [Hz]
* @param {VectorFloat} phases the phases of the sinusoidal peaks
* @param {number} [fftSize=512] the size of the FFT internal process (full spectrum size) and output frame. Minimum twice the hopsize.
* @param {number} [hopSize=128] the hop size between frames
* @param {number} [sampleRate=44100] the audio sampling rate [Hz]
* @returns {object} {frame: 'the output audio frame'}
* @memberof Essentia
*/
class SineSubtraction {
  private algoInstance: any;
  constructor(fftSize: number=512, hopSize: number=128, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.SineSubtraction(fftSize, hopSize, sampleRate);
  }
  configure(fftSize: number=512, hopSize: number=128, sampleRate: number=44100) {
    this.algoInstance.configure(fftSize, hopSize, sampleRate);
  }
  compute(frame: any, magnitudes: any, frequencies: any, phases: any) {
    return this.algoInstance.compute(frame, magnitudes, frequencies, phases);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the spectrum energy of a single beat across the whole frequency range and on each specified frequency band given an audio segment. It detects the onset of the beat within the input segment, computes spectrum on a window starting on this onset, and estimates energy (see Energy and EnergyBandRatio algorithms). The frequency bands used by default are: 0-200 Hz, 200-400 Hz, 400-800 Hz, 800-1600 Hz, 1600-3200 Hz, 3200-22000Hz, following E. Scheirer [1]. Check https://essentia.upf.edu/reference/std_SingleBeatLoudness.html for more details.
* @class
* @param {VectorFloat} beat audio segement containing a beat
* @param {number} [beatDuration=0.05] window size for the beat's energy computation (the window starts at the onset) [s]
* @param {number} [beatWindowDuration=0.1] window size for the beat's onset detection [s]
* @param {any[]} [frequencyBands=[0, 200, 400, 800, 1600, 3200, 22000]] frequency bands
* @param {string} [onsetStart=sumEnergy] criteria for finding the start of the beat
* @param {number} [sampleRate=44100] the audio sampling rate [Hz]
* @returns {object} {loudness: 'the beat's energy across the whole spectrum', loudnessBandRatio: 'the beat's energy ratio for each band'}
* @memberof Essentia
*/
class SingleBeatLoudness {
  private algoInstance: any;
  constructor(beatDuration: number=0.05, beatWindowDuration: number=0.1, frequencyBands: any[]=[0, 200, 400, 800, 1600, 3200, 22000], onsetStart: string='sumEnergy', sampleRate: number=44100) {
    let vecfrequencyBands = arrayToVector(frequencyBands);
    this.algoInstance = new wasmBackend.SingleBeatLoudness(beatDuration, beatWindowDuration, vecfrequencyBands, onsetStart, sampleRate);
  }
  configure(beatDuration: number=0.05, beatWindowDuration: number=0.1, frequencyBands: any[]=[0, 200, 400, 800, 1600, 3200, 22000], onsetStart: string='sumEnergy', sampleRate: number=44100) {
    let vecfrequencyBands = arrayToVector(frequencyBands);
    this.algoInstance.configure(beatDuration, beatWindowDuration, vecfrequencyBands, onsetStart, sampleRate);
  }
  compute(beat: any) {
    return this.algoInstance.compute(beat);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm splits an audio signal into segments given their start and end times. Check https://essentia.upf.edu/reference/std_Slicer.html for more details.
* @class
* @param {VectorFloat} audio the input audio signal
* @param {any[]} [endTimes=[]] the list of end times for the slices you want to extract
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {any[]} [startTimes=[]] the list of start times for the slices you want to extract
* @param {string} [timeUnits=seconds] the units of time of the start and end times
* @returns {object} {frame: 'the frames of the sliced input signal'}
* @memberof Essentia
*/
class Slicer {
  private algoInstance: any;
  constructor(endTimes: any[]=[], sampleRate: number=44100, startTimes: any[]=[], timeUnits: string='seconds') {
    let vecendTimes = arrayToVector(endTimes);
    let vecstartTimes = arrayToVector(startTimes);
    this.algoInstance = new wasmBackend.Slicer(vecendTimes, sampleRate, vecstartTimes, timeUnits);
  }
  configure(endTimes: any[]=[], sampleRate: number=44100, startTimes: any[]=[], timeUnits: string='seconds') {
    let vecendTimes = arrayToVector(endTimes);
    let vecstartTimes = arrayToVector(startTimes);
    this.algoInstance.configure(vecendTimes, sampleRate, vecstartTimes, timeUnits);
  }
  compute(audio: any) {
    return this.algoInstance.compute(audio);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the spectral centroid of a signal in time domain. A first difference filter is applied to the input signal. Then the centroid is computed by dividing the norm of the resulting signal by the norm of the input signal. The centroid is given in hertz.
References:
 [1] Udo Zölzer (2002). DAFX Digital Audio Effects pag.364-365
 Check https://essentia.upf.edu/reference/std_SpectralCentroidTime.html for more details.
* @class
* @param {VectorFloat} array the input array
* @param {number} [sampleRate=44100] sampling rate of the input spectrum [Hz]
* @returns {object} {centroid: 'the spectral centroid of the signal'}
* @memberof Essentia
*/
class SpectralCentroidTime {
  private algoInstance: any;
  constructor(sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.SpectralCentroidTime(sampleRate);
  }
  configure(sampleRate: number=44100) {
    this.algoInstance.configure(sampleRate);
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the spectral complexity of a spectrum. The spectral complexity is based on the number of peaks in the input spectrum. Check https://essentia.upf.edu/reference/std_SpectralComplexity.html for more details.
* @class
* @param {VectorFloat} spectrum the input spectrum
* @param {number} [magnitudeThreshold=0.005] the minimum spectral-peak magnitude that contributes to spectral complexity
* @param {number} [sampleRate=44100] the audio sampling rate [Hz]
* @returns {object} {spectralComplexity: 'the spectral complexity of the input spectrum'}
* @memberof Essentia
*/
class SpectralComplexity {
  private algoInstance: any;
  constructor(magnitudeThreshold: number=0.005, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.SpectralComplexity(magnitudeThreshold, sampleRate);
  }
  configure(magnitudeThreshold: number=0.005, sampleRate: number=44100) {
    this.algoInstance.configure(magnitudeThreshold, sampleRate);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the Spectral Contrast feature of a spectrum. It is based on the Octave Based Spectral Contrast feature as described in [1]. The version implemented here is a modified version to improve discriminative power and robustness. The modifications are described in [2]. Check https://essentia.upf.edu/reference/std_SpectralContrast.html for more details.
* @class
* @param {VectorFloat} spectrum the audio spectrum
* @param {number} [frameSize=2048] the size of the fft frames
* @param {number} [highFrequencyBound=11000] the upper bound of the highest band
* @param {number} [lowFrequencyBound=20] the lower bound of the lowest band
* @param {number} [neighbourRatio=0.4] the ratio of the bins in the sub band used to calculate the peak and valley
* @param {number} [numberBands=6] the number of bands in the filter
* @param {number} [sampleRate=22050] the sampling rate of the audio signal
* @param {number} [staticDistribution=0.15] the ratio of the bins to distribute equally
* @returns {object} {spectralContrast: 'the spectral contrast coefficients', spectralValley: 'the magnitudes of the valleys'}
* @memberof Essentia
*/
class SpectralContrast {
  private algoInstance: any;
  constructor(frameSize: number=2048, highFrequencyBound: number=11000, lowFrequencyBound: number=20, neighbourRatio: number=0.4, numberBands: number=6, sampleRate: number=22050, staticDistribution: number=0.15) {
    this.algoInstance = new wasmBackend.SpectralContrast(frameSize, highFrequencyBound, lowFrequencyBound, neighbourRatio, numberBands, sampleRate, staticDistribution);
  }
  configure(frameSize: number=2048, highFrequencyBound: number=11000, lowFrequencyBound: number=20, neighbourRatio: number=0.4, numberBands: number=6, sampleRate: number=22050, staticDistribution: number=0.15) {
    this.algoInstance.configure(frameSize, highFrequencyBound, lowFrequencyBound, neighbourRatio, numberBands, sampleRate, staticDistribution);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm extracts peaks from a spectrum. It is important to note that the peak algorithm is independent of an input that is linear or in dB, so one has to adapt the threshold to fit with the type of data fed to it. The algorithm relies on PeakDetection algorithm which is run with parabolic interpolation [1]. The exactness of the peak-searching depends heavily on the windowing type. It gives best results with dB input, a blackman-harris 92dB window and interpolation set to true. According to [1], spectral peak frequencies tend to be about twice as accurate when dB magnitude is used rather than just linear magnitude. For further information about the peak detection, see the description of the PeakDetection algorithm. Check https://essentia.upf.edu/reference/std_SpectralPeaks.html for more details.
* @class
* @param {VectorFloat} spectrum the input spectrum
* @param {number} [magnitudeThreshold=0] peaks below this given threshold are not outputted
* @param {number} [maxFrequency=5000] the maximum frequency of the range to evaluate [Hz]
* @param {number} [maxPeaks=100] the maximum number of returned peaks
* @param {number} [minFrequency=0] the minimum frequency of the range to evaluate [Hz]
* @param {string} [orderBy=frequency] the ordering type of the outputted peaks (ascending by frequency or descending by magnitude)
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {frequencies: 'the frequencies of the spectral peaks [Hz]', magnitudes: 'the magnitudes of the spectral peaks'}
* @memberof Essentia
*/
class SpectralPeaks {
  private algoInstance: any;
  constructor(magnitudeThreshold: number=0, maxFrequency: number=5000, maxPeaks: number=100, minFrequency: number=0, orderBy: string='frequency', sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.SpectralPeaks(magnitudeThreshold, maxFrequency, maxPeaks, minFrequency, orderBy, sampleRate);
  }
  configure(magnitudeThreshold: number=0, maxFrequency: number=5000, maxPeaks: number=100, minFrequency: number=0, orderBy: string='frequency', sampleRate: number=44100) {
    this.algoInstance.configure(magnitudeThreshold, maxFrequency, maxPeaks, minFrequency, orderBy, sampleRate);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* Performs spectral whitening of spectral peaks of a spectrum. The algorithm works in dB scale, but the conversion is done by the algorithm so input should be in linear scale. The concept of 'whitening' refers to 'white noise' or a non-zero flat spectrum. It first computes a spectral envelope similar to the 'true envelope' in [1], and then modifies the amplitude of each peak relative to the envelope. For example, the predominant peaks will have a value close to 0dB because they are very close to the envelope. On the other hand, minor peaks between significant peaks will have lower amplitudes such as -30dB. Check https://essentia.upf.edu/reference/std_SpectralWhitening.html for more details.
* @class
* @param {VectorFloat} spectrum the audio linear spectrum
* @param {VectorFloat} frequencies the spectral peaks' linear frequencies
* @param {VectorFloat} magnitudes the spectral peaks' linear magnitudes
* @param {number} [maxFrequency=5000] max frequency to apply whitening to [Hz]
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {magnitudes: 'the whitened spectral peaks' linear magnitudes'}
* @memberof Essentia
*/
class SpectralWhitening {
  private algoInstance: any;
  constructor(maxFrequency: number=5000, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.SpectralWhitening(maxFrequency, sampleRate);
  }
  configure(maxFrequency: number=5000, sampleRate: number=44100) {
    this.algoInstance.configure(maxFrequency, sampleRate);
  }
  compute(spectrum: any, frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(spectrum, frequencies, magnitudes);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the magnitude spectrum of an array of Reals. The resulting magnitude spectrum has a size which is half the size of the input array plus one. Bins contain raw (linear) magnitude values. Check https://essentia.upf.edu/reference/std_Spectrum.html for more details.
* @class
* @param {VectorFloat} frame the input audio frame
* @param {number} [size=2048] the expected size of the input audio signal (this is an optional parameter to optimize memory allocation)
* @returns {object} {spectrum: 'magnitude spectrum of the input audio signal'}
* @memberof Essentia
*/
class Spectrum {
  private algoInstance: any;
  constructor(size: number=2048) {
    this.algoInstance = new wasmBackend.Spectrum(size);
  }
  configure(size: number=2048) {
    this.algoInstance.configure(size);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the magnitude of the Constant-Q spectrum. See ConstantQ algorithm for more details.
 Check https://essentia.upf.edu/reference/std_SpectrumCQ.html for more details.
* @class
* @param {VectorFloat} frame the input audio frame
* @param {number} [binsPerOctave=12] number of bins per octave
* @param {number} [minFrequency=32.7] minimum frequency [Hz]
* @param {number} [minimumKernelSize=4] minimum size allowed for frequency kernels
* @param {number} [numberBins=84] number of frequency bins, starting at minFrequency
* @param {number} [sampleRate=44100] FFT sampling rate [Hz]
* @param {number} [scale=1] filters scale. Larger values use longer windows
* @param {number} [threshold=0.01] bins whose magnitude is below this quantile are discarded
* @param {string} [windowType=hann] the window type
* @param {boolean} [zeroPhase=true] a boolean value that enables zero-phase windowing. Input audio frames should be windowed with the same phase mode
* @returns {object} {spectrumCQ: 'the magnitude constant-Q spectrum'}
* @memberof Essentia
*/
class SpectrumCQ {
  private algoInstance: any;
  constructor(binsPerOctave: number=12, minFrequency: number=32.7, minimumKernelSize: number=4, numberBins: number=84, sampleRate: number=44100, scale: number=1, threshold: number=0.01, windowType: string='hann', zeroPhase: boolean=true) {
    this.algoInstance = new wasmBackend.SpectrumCQ(binsPerOctave, minFrequency, minimumKernelSize, numberBins, sampleRate, scale, threshold, windowType, zeroPhase);
  }
  configure(binsPerOctave: number=12, minFrequency: number=32.7, minimumKernelSize: number=4, numberBins: number=84, sampleRate: number=44100, scale: number=1, threshold: number=0.01, windowType: string='hann', zeroPhase: boolean=true) {
    this.algoInstance.configure(binsPerOctave, minFrequency, minimumKernelSize, numberBins, sampleRate, scale, threshold, windowType, zeroPhase);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes energy in triangular frequency bands of a spectrum equally spaced on the cent scale. Each band is computed to have a constant wideness in the cent scale. For each band the power-spectrum (mag-squared) is summed. Check https://essentia.upf.edu/reference/std_SpectrumToCent.html for more details.
* @class
* @param {VectorFloat} spectrum the input spectrum (must be greater than size one)
* @param {number} [bands=720] number of bins to compute. Default is 720 (6 octaves with the default 'centBinResolution')
* @param {number} [centBinResolution=10] Width of each band in cents. Default is 10 cents
* @param {number} [inputSize=32768] the size of the spectrum
* @param {boolean} [log=true] compute log-energies (log2 (1 + energy))
* @param {number} [minimumFrequency=164] central frequency of the first band of the bank [Hz]
* @param {string} [normalize=unit_sum] use unit area or vertex equal to 1 triangles.
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {string} [type=power] use magnitude or power spectrum
* @returns {object} {bands: 'the energy in each band', frequencies: 'the central frequency of each band'}
* @memberof Essentia
*/
class SpectrumToCent {
  private algoInstance: any;
  constructor(bands: number=720, centBinResolution: number=10, inputSize: number=32768, log: boolean=true, minimumFrequency: number=164, normalize: string='unit_sum', sampleRate: number=44100, type: string='power') {
    this.algoInstance = new wasmBackend.SpectrumToCent(bands, centBinResolution, inputSize, log, minimumFrequency, normalize, sampleRate, type);
  }
  configure(bands: number=720, centBinResolution: number=10, inputSize: number=32768, log: boolean=true, minimumFrequency: number=164, normalize: string='unit_sum', sampleRate: number=44100, type: string='power') {
    this.algoInstance.configure(bands, centBinResolution, inputSize, log, minimumFrequency, normalize, sampleRate, type);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* Evaluates a piecewise spline of type b, beta or quadratic.
The input value, i.e. the point at which the spline is to be evaluated typically should be between xPoins[0] and xPoinst[size-1]. If the value lies outside this range, extrapolation is used.
Regarding spline types:
  - B: evaluates a cubic B spline approximant.
  - Beta: evaluates a cubic beta spline approximant. For beta splines parameters 'beta1' and 'beta2' can be supplied. For no bias set beta1 to 1 and for no tension set beta2 to 0. Note that if beta1=1 and beta2=0, the cubic beta becomes a cubic B spline. On the other hand if beta1=1 and beta2 is large the beta spline turns into a linear spline.
  - Quadratic: evaluates a piecewise quadratic spline at a point. Note that size of input must be odd. Check https://essentia.upf.edu/reference/std_Spline.html for more details.
* @class
* @param {number} x the input coordinate (x-axis)
* @param {number} [beta1=1] the skew or bias parameter (only available for type beta)
* @param {number} [beta2=0] the tension parameter
* @param {string} [type=b] the type of spline to be computed
* @param {any[]} [xPoints=[0, 1]] the x-coordinates where data is specified (the points must be arranged in ascending order and cannot contain duplicates)
* @param {any[]} [yPoints=[0, 1]] the y-coordinates to be interpolated (i.e. the known data)
* @returns {object} {y: 'the value of the spline at x'}
* @memberof Essentia
*/
class Spline {
  private algoInstance: any;
  constructor(beta1: number=1, beta2: number=0, type: string='b', xPoints: any[]=[0, 1], yPoints: any[]=[0, 1]) {
    let vecxPoints = arrayToVector(xPoints);
    let vecyPoints = arrayToVector(yPoints);
    this.algoInstance = new wasmBackend.Spline(beta1, beta2, type, vecxPoints, vecyPoints);
  }
  configure(beta1: number=1, beta2: number=0, type: string='b', xPoints: any[]=[0, 1], yPoints: any[]=[0, 1]) {
    let vecxPoints = arrayToVector(xPoints);
    let vecyPoints = arrayToVector(yPoints);
    this.algoInstance.configure(beta1, beta2, type, vecxPoints, vecyPoints);
  }
  compute(x: number) {
    return this.algoInstance.compute(x);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the sinusoidal plus residual model analysis.  Check https://essentia.upf.edu/reference/std_SprModelAnal.html for more details.
* @class
* @param {VectorFloat} frame the input frame
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
* @returns {object} {frequencies: 'the frequencies of the sinusoidal peaks [Hz]', magnitudes: 'the magnitudes of the sinusoidal peaks', phases: 'the phases of the sinusoidal peaks', res: 'output residual frame'}
* @memberof Essentia
*/
class SprModelAnal {
  private algoInstance: any;
  constructor(fftSize: number=2048, freqDevOffset: number=20, freqDevSlope: number=0.01, hopSize: number=512, magnitudeThreshold: number=0, maxFrequency: number=5000, maxPeaks: number=100, maxnSines: number=100, minFrequency: number=0, orderBy: string='frequency', sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.SprModelAnal(fftSize, freqDevOffset, freqDevSlope, hopSize, magnitudeThreshold, maxFrequency, maxPeaks, maxnSines, minFrequency, orderBy, sampleRate);
  }
  configure(fftSize: number=2048, freqDevOffset: number=20, freqDevSlope: number=0.01, hopSize: number=512, magnitudeThreshold: number=0, maxFrequency: number=5000, maxPeaks: number=100, maxnSines: number=100, minFrequency: number=0, orderBy: string='frequency', sampleRate: number=44100) {
    this.algoInstance.configure(fftSize, freqDevOffset, freqDevSlope, hopSize, magnitudeThreshold, maxFrequency, maxPeaks, maxnSines, minFrequency, orderBy, sampleRate);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the sinusoidal plus residual model synthesis from SPS model analysis. Check https://essentia.upf.edu/reference/std_SprModelSynth.html for more details.
* @class
* @param {VectorFloat} magnitudes the magnitudes of the sinusoidal peaks
* @param {VectorFloat} frequencies the frequencies of the sinusoidal peaks [Hz]
* @param {VectorFloat} phases the phases of the sinusoidal peaks
* @param {VectorFloat} res the residual frame
* @param {number} [fftSize=2048] the size of the output FFT frame (full spectrum size)
* @param {number} [hopSize=512] the hop size between frames
* @param {number} [sampleRate=44100] the audio sampling rate [Hz]
* @returns {object} {frame: 'the output audio frame of the Sinusoidal Plus Stochastic model', sineframe: 'the output audio frame for sinusoidal component ', resframe: 'the output audio frame for stochastic component '}
* @memberof Essentia
*/
class SprModelSynth {
  private algoInstance: any;
  constructor(fftSize: number=2048, hopSize: number=512, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.SprModelSynth(fftSize, hopSize, sampleRate);
  }
  configure(fftSize: number=2048, hopSize: number=512, sampleRate: number=44100) {
    this.algoInstance.configure(fftSize, hopSize, sampleRate);
  }
  compute(magnitudes: any, frequencies: any, phases: any, res: any) {
    return this.algoInstance.compute(magnitudes, frequencies, phases, res);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the stochastic model analysis.  Check https://essentia.upf.edu/reference/std_SpsModelAnal.html for more details.
* @class
* @param {VectorFloat} frame the input frame
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
* @returns {object} {frequencies: 'the frequencies of the sinusoidal peaks [Hz]', magnitudes: 'the magnitudes of the sinusoidal peaks', phases: 'the phases of the sinusoidal peaks', stocenv: 'the stochastic envelope'}
* @memberof Essentia
*/
class SpsModelAnal {
  private algoInstance: any;
  constructor(fftSize: number=2048, freqDevOffset: number=20, freqDevSlope: number=0.01, hopSize: number=512, magnitudeThreshold: number=0, maxFrequency: number=5000, maxPeaks: number=100, maxnSines: number=100, minFrequency: number=0, orderBy: string='frequency', sampleRate: number=44100, stocf: number=0.2) {
    this.algoInstance = new wasmBackend.SpsModelAnal(fftSize, freqDevOffset, freqDevSlope, hopSize, magnitudeThreshold, maxFrequency, maxPeaks, maxnSines, minFrequency, orderBy, sampleRate, stocf);
  }
  configure(fftSize: number=2048, freqDevOffset: number=20, freqDevSlope: number=0.01, hopSize: number=512, magnitudeThreshold: number=0, maxFrequency: number=5000, maxPeaks: number=100, maxnSines: number=100, minFrequency: number=0, orderBy: string='frequency', sampleRate: number=44100, stocf: number=0.2) {
    this.algoInstance.configure(fftSize, freqDevOffset, freqDevSlope, hopSize, magnitudeThreshold, maxFrequency, maxPeaks, maxnSines, minFrequency, orderBy, sampleRate, stocf);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the sinusoidal plus stochastic model synthesis from SPS model analysis. Check https://essentia.upf.edu/reference/std_SpsModelSynth.html for more details.
* @class
* @param {VectorFloat} magnitudes the magnitudes of the sinusoidal peaks
* @param {VectorFloat} frequencies the frequencies of the sinusoidal peaks [Hz]
* @param {VectorFloat} phases the phases of the sinusoidal peaks
* @param {VectorFloat} stocenv the stochastic envelope
* @param {number} [fftSize=2048] the size of the output FFT frame (full spectrum size)
* @param {number} [hopSize=512] the hop size between frames
* @param {number} [sampleRate=44100] the audio sampling rate [Hz]
* @param {number} [stocf=0.2] decimation factor used for the stochastic approximation
* @returns {object} {frame: 'the output audio frame of the Sinusoidal Plus Stochastic model', sineframe: 'the output audio frame for sinusoidal component ', stocframe: 'the output audio frame for stochastic component '}
* @memberof Essentia
*/
class SpsModelSynth {
  private algoInstance: any;
  constructor(fftSize: number=2048, hopSize: number=512, sampleRate: number=44100, stocf: number=0.2) {
    this.algoInstance = new wasmBackend.SpsModelSynth(fftSize, hopSize, sampleRate, stocf);
  }
  configure(fftSize: number=2048, hopSize: number=512, sampleRate: number=44100, stocf: number=0.2) {
    this.algoInstance.configure(fftSize, hopSize, sampleRate, stocf);
  }
  compute(magnitudes: any, frequencies: any, phases: any, stocenv: any) {
    return this.algoInstance.compute(magnitudes, frequencies, phases, stocenv);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm outputs if there is a cut at the beginning or at the end of the audio by locating the first and last non-silent frames and comparing their positions to the actual beginning and end of the audio. The input audio is considered to be cut at the beginning (or the end) and the corresponding flag is activated if the first (last) non-silent frame occurs before (after) the configurable time threshold. Check https://essentia.upf.edu/reference/std_StartStopCut.html for more details.
* @class
* @param {VectorFloat} audio the input audio 
* @param {number} [frameSize=256] the frame size for the internal power analysis
* @param {number} [hopSize=256] the hop size for the internal power analysis
* @param {number} [maximumStartTime=10] if the first non-silent frame occurs before maximumStartTime startCut is activated [ms]
* @param {number} [maximumStopTime=10] if the last non-silent frame occurs after maximumStopTime to the end stopCut is activated [ms]
* @param {number} [sampleRate=44100] the sample rate
* @param {number} [threshold=-60] the threshold below which average energy is defined as silence [dB]
* @returns {object} {startCut: '1 if there is a cut at the begining of the audio', stopCut: '1 if there is a cut at the end of the audio'}
* @memberof Essentia
*/
class StartStopCut {
  private algoInstance: any;
  constructor(frameSize: number=256, hopSize: number=256, maximumStartTime: number=10, maximumStopTime: number=10, sampleRate: number=44100, threshold: number=-60) {
    this.algoInstance = new wasmBackend.StartStopCut(frameSize, hopSize, maximumStartTime, maximumStopTime, sampleRate, threshold);
  }
  configure(frameSize: number=256, hopSize: number=256, maximumStartTime: number=10, maximumStopTime: number=10, sampleRate: number=44100, threshold: number=-60) {
    this.algoInstance.configure(frameSize, hopSize, maximumStartTime, maximumStopTime, sampleRate, threshold);
  }
  compute(audio: any) {
    return this.algoInstance.compute(audio);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm outputs the frame at which sound begins and the frame at which sound ends. Check https://essentia.upf.edu/reference/std_StartStopSilence.html for more details.
* @class
* @param {VectorFloat} frame the input audio frames
* @param {number} [threshold=-60] the threshold below which average energy is defined as silence [dB]
* @returns {object} {startFrame: 'number of the first non-silent frame', stopFrame: 'number of the last non-silent frame'}
* @memberof Essentia
*/
class StartStopSilence {
  private algoInstance: any;
  constructor(threshold: number=-60) {
    this.algoInstance = new wasmBackend.StartStopSilence(threshold);
  }
  configure(threshold: number=-60) {
    this.algoInstance.configure(threshold);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the stochastic model analysis. It gets the resampled spectral envelope of the stochastic component. Check https://essentia.upf.edu/reference/std_StochasticModelAnal.html for more details.
* @class
* @param {VectorFloat} frame the input frame
* @param {number} [fftSize=2048] the size of the internal FFT size (full spectrum size)
* @param {number} [hopSize=512] the hop size between frames
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {number} [stocf=0.2] decimation factor used for the stochastic approximation
* @returns {object} {stocenv: 'the stochastic envelope'}
* @memberof Essentia
*/
class StochasticModelAnal {
  private algoInstance: any;
  constructor(fftSize: number=2048, hopSize: number=512, sampleRate: number=44100, stocf: number=0.2) {
    this.algoInstance = new wasmBackend.StochasticModelAnal(fftSize, hopSize, sampleRate, stocf);
  }
  configure(fftSize: number=2048, hopSize: number=512, sampleRate: number=44100, stocf: number=0.2) {
    this.algoInstance.configure(fftSize, hopSize, sampleRate, stocf);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the stochastic model synthesis. It generates the noisy spectrum from a resampled spectral envelope of the stochastic component. Check https://essentia.upf.edu/reference/std_StochasticModelSynth.html for more details.
* @class
* @param {VectorFloat} stocenv the stochastic envelope input
* @param {number} [fftSize=2048] the size of the internal FFT size (full spectrum size)
* @param {number} [hopSize=512] the hop size between frames
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {number} [stocf=0.2] decimation factor used for the stochastic approximation
* @returns {object} {frame: 'the output frame'}
* @memberof Essentia
*/
class StochasticModelSynth {
  private algoInstance: any;
  constructor(fftSize: number=2048, hopSize: number=512, sampleRate: number=44100, stocf: number=0.2) {
    this.algoInstance = new wasmBackend.StochasticModelSynth(fftSize, hopSize, sampleRate, stocf);
  }
  configure(fftSize: number=2048, hopSize: number=512, sampleRate: number=44100, stocf: number=0.2) {
    this.algoInstance.configure(fftSize, hopSize, sampleRate, stocf);
  }
  compute(stocenv: any) {
    return this.algoInstance.compute(stocenv);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the Strong Decay of an audio signal. The Strong Decay is built from the non-linear combination of the signal energy and the signal temporal centroid, the latter being the balance of the absolute value of the signal. A signal containing a temporal centroid near its start boundary and a strong energy is said to have a strong decay. Check https://essentia.upf.edu/reference/std_StrongDecay.html for more details.
* @class
* @param {VectorFloat} signal the input audio signal
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @returns {object} {strongDecay: 'the strong decay'}
* @memberof Essentia
*/
class StrongDecay {
  private algoInstance: any;
  constructor(sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.StrongDecay(sampleRate);
  }
  configure(sampleRate: number=44100) {
    this.algoInstance.configure(sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the Strong Peak of a spectrum. The Strong Peak is defined as the ratio between the spectrum's maximum peak's magnitude and the "bandwidth" of the peak above a threshold (half its amplitude). This ratio reveals whether the spectrum presents a very "pronounced" maximum peak (i.e. the thinner and the higher the maximum of the spectrum is, the higher the ratio value). Check https://essentia.upf.edu/reference/std_StrongPeak.html for more details.
* @class
* @param {VectorFloat} spectrum the input spectrum (must be greater than one element and cannot contain negative values)
* @returns {object} {strongPeak: 'the Strong Peak ratio'}
* @memberof Essentia
*/
class StrongPeak {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.StrongPeak();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm detects onsets given an audio signal using SuperFlux algorithm. This implementation is based on the available reference implementation in python [2]. The algorithm computes spectrum of the input signal, summarizes it into triangular band energies, and computes a onset detection function based on spectral flux tracking spectral trajectories with a maximum filter (SuperFluxNovelty). The peaks of the function are then detected (SuperFluxPeaks). Check https://essentia.upf.edu/reference/std_SuperFluxExtractor.html for more details.
* @class
* @param {VectorFloat} signal the audio input signal
* @param {number} [combine=20] time threshold for double onsets detections (ms)
* @param {number} [frameSize=2048] the frame size for computing low-level features
* @param {number} [hopSize=256] the hop size for computing low-level features
* @param {number} [ratioThreshold=16] ratio threshold for peak picking with respect to novelty_signal/novelty_average rate, use 0 to disable it (for low-energy onsets)
* @param {number} [sampleRate=44100] the audio sampling rate [Hz]
* @param {number} [threshold=0.05] threshold for peak peaking with respect to the difference between novelty_signal and average_signal (for onsets in ambient noise)
* @returns {object} {onsets: 'the onsets times'}
* @memberof Essentia
*/
class SuperFluxExtractor {
  private algoInstance: any;
  constructor(combine: number=20, frameSize: number=2048, hopSize: number=256, ratioThreshold: number=16, sampleRate: number=44100, threshold: number=0.05) {
    this.algoInstance = new wasmBackend.SuperFluxExtractor(combine, frameSize, hopSize, ratioThreshold, sampleRate, threshold);
  }
  configure(combine: number=20, frameSize: number=2048, hopSize: number=256, ratioThreshold: number=16, sampleRate: number=44100, threshold: number=0.05) {
    this.algoInstance.configure(combine, frameSize, hopSize, ratioThreshold, sampleRate, threshold);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* Onset detection function for Superflux algorithm. See SuperFluxExtractor for more details. Check https://essentia.upf.edu/reference/std_SuperFluxNovelty.html for more details.
* @class
* @param {VectorVectorFloat} bands the input bands spectrogram
* @param {number} [binWidth=3] filter width (number of frequency bins)
* @param {number} [frameWidth=2] differentiation offset (compute the difference with the N-th previous frame)
* @returns {object} {differences: 'SuperFlux novelty curve'}
* @memberof Essentia
*/
class SuperFluxNovelty {
  private algoInstance: any;
  constructor(binWidth: number=3, frameWidth: number=2) {
    this.algoInstance = new wasmBackend.SuperFluxNovelty(binWidth, frameWidth);
  }
  configure(binWidth: number=3, frameWidth: number=2) {
    this.algoInstance.configure(binWidth, frameWidth);
  }
  compute(bands: any) {
    return this.algoInstance.compute(bands);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm detects peaks of an onset detection function computed by the SuperFluxNovelty algorithm. See SuperFluxExtractor for more details. Check https://essentia.upf.edu/reference/std_SuperFluxPeaks.html for more details.
* @class
* @param {VectorFloat} novelty the input onset detection function
* @param {number} [combine=30] time threshold for double onsets detections (ms)
* @param {number} [frameRate=172] frameRate
* @param {number} [pre_avg=100] look back duration for moving average filter [ms]
* @param {number} [pre_max=30] look back duration for moving maximum filter [ms]
* @param {number} [ratioThreshold=16] ratio threshold for peak picking with respect to novelty_signal/novelty_average rate, use 0 to disable it (for low-energy onsets)
* @param {number} [threshold=0.05] threshold for peak peaking with respect to the difference between novelty_signal and average_signal (for onsets in ambient noise)
* @returns {object} {peaks: 'detected peaks' instants [s]'}
* @memberof Essentia
*/
class SuperFluxPeaks {
  private algoInstance: any;
  constructor(combine: number=30, frameRate: number=172, pre_avg: number=100, pre_max: number=30, ratioThreshold: number=16, threshold: number=0.05) {
    this.algoInstance = new wasmBackend.SuperFluxPeaks(combine, frameRate, pre_avg, pre_max, ratioThreshold, threshold);
  }
  configure(combine: number=30, frameRate: number=172, pre_avg: number=100, pre_max: number=30, ratioThreshold: number=16, threshold: number=0.05) {
    this.algoInstance.configure(combine, frameRate, pre_avg, pre_max, ratioThreshold, threshold);
  }
  compute(novelty: any) {
    return this.algoInstance.compute(novelty);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm calculates the ratio of the temporal centroid to the total length of a signal envelope. This ratio shows how the sound is 'balanced'. Its value is close to 0 if most of the energy lies at the beginning of the sound (e.g. decrescendo or impulsive sounds), close to 0.5 if the sound is symetric (e.g. 'delta unvarying' sounds), and close to 1 if most of the energy lies at the end of the sound (e.g. crescendo sounds). Check https://essentia.upf.edu/reference/std_TCToTotal.html for more details.
* @class
* @param {VectorFloat} envelope the envelope of the signal (its length must be greater than 1
* @returns {object} {TCToTotal: 'the temporal centroid to total length ratio'}
* @memberof Essentia
*/
class TCToTotal {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.TCToTotal();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(envelope: any) {
    return this.algoInstance.compute(envelope);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes features for tempo tracking to be used with the TempoTap algorithm. See standard_rhythmextractor_tempotap in examples folder. Check https://essentia.upf.edu/reference/std_TempoScaleBands.html for more details.
* @class
* @param {VectorFloat} bands the audio power spectrum divided into bands
* @param {any[]} [bandsGain=[2, 3, 2, 1, 1.20000004768, 2, 3, 2.5]] gain for each bands
* @param {number} [frameTime=512] the frame rate in samples
* @returns {object} {scaledBands: 'the output bands after scaling', cumulativeBands: 'cumulative sum of the output bands before scaling'}
* @memberof Essentia
*/
class TempoScaleBands {
  private algoInstance: any;
  constructor(bandsGain: any[]=[2, 3, 2, 1, 1.20000004768, 2, 3, 2.5], frameTime: number=512) {
    let vecbandsGain = arrayToVector(bandsGain);
    this.algoInstance = new wasmBackend.TempoScaleBands(vecbandsGain, frameTime);
  }
  configure(bandsGain: any[]=[2, 3, 2, 1, 1.20000004768, 2, 3, 2.5], frameTime: number=512) {
    let vecbandsGain = arrayToVector(bandsGain);
    this.algoInstance.configure(vecbandsGain, frameTime);
  }
  compute(bands: any) {
    return this.algoInstance.compute(bands);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the periods and phases of a periodic signal, represented by a sequence of values of any number of detection functions, such as energy bands, onsets locations, etc. It requires to be sequentially run on a vector of such values ("featuresFrame") for each particular audio frame in order to get estimations related to that frames. The estimations are done for each detection function separately, utilizing the latest "frameHop" frames, including the present one, to compute autocorrelation. Empty estimations will be returned until enough frames are accumulated in the algorithm's buffer.
The algorithm uses elements of the following beat-tracking methods:
 - BeatIt, elaborated by Fabien Gouyon and Simon Dixon (input features) [1]
 - Multi-comb filter with Rayleigh weighting, Mathew Davies [2] Check https://essentia.upf.edu/reference/std_TempoTap.html for more details.
* @class
* @param {VectorFloat} featuresFrame input temporal features of a frame
* @param {number} [frameHop=1024] number of feature frames separating two evaluations
* @param {number} [frameSize=256] number of audio samples in a frame
* @param {number} [maxTempo=208] fastest tempo allowed to be detected [bpm]
* @param {number} [minTempo=40] slowest tempo allowed to be detected [bpm]
* @param {number} [numberFrames=1024] number of feature frames to buffer on
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {any[]} [tempoHints=[]] optional list of initial beat locations, to favor the detection of pre-determined tempo period and beats alignment [s]
* @returns {object} {periods: 'list of tempo estimates found for each input feature, in frames', phases: 'list of initial phase candidates found for each input feature, in frames'}
* @memberof Essentia
*/
class TempoTap {
  private algoInstance: any;
  constructor(frameHop: number=1024, frameSize: number=256, maxTempo: number=208, minTempo: number=40, numberFrames: number=1024, sampleRate: number=44100, tempoHints: any[]=[]) {
    let vectempoHints = arrayToVector(tempoHints);
    this.algoInstance = new wasmBackend.TempoTap(frameHop, frameSize, maxTempo, minTempo, numberFrames, sampleRate, vectempoHints);
  }
  configure(frameHop: number=1024, frameSize: number=256, maxTempo: number=208, minTempo: number=40, numberFrames: number=1024, sampleRate: number=44100, tempoHints: any[]=[]) {
    let vectempoHints = arrayToVector(tempoHints);
    this.algoInstance.configure(frameHop, frameSize, maxTempo, minTempo, numberFrames, sampleRate, vectempoHints);
  }
  compute(featuresFrame: any) {
    return this.algoInstance.compute(featuresFrame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates beat positions given an onset detection function.  The detection function is partitioned into 6-second frames with a 1.5-second increment, and the autocorrelation is computed for each frame, and is weighted by a tempo preference curve [2]. Periodicity estimations are done frame-wisely, searching for the best match with the Viterbi algorith [3]. The estimated periods are then passed to the probabilistic beat tracking algorithm [1], which computes beat positions. Check https://essentia.upf.edu/reference/std_TempoTapDegara.html for more details.
* @class
* @param {VectorFloat} onsetDetections the input frame-wise vector of onset detection values
* @param {number} [maxTempo=208] fastest tempo allowed to be detected [bpm]
* @param {number} [minTempo=40] slowest tempo allowed to be detected [bpm]
* @param {string} [resample=none] use upsampling of the onset detection function (may increase accuracy)
* @param {number} [sampleRateODF=86.1328] the sampling rate of the onset detection function [Hz]
* @returns {object} {ticks: 'the list of resulting ticks [s]'}
* @memberof Essentia
*/
class TempoTapDegara {
  private algoInstance: any;
  constructor(maxTempo: number=208, minTempo: number=40, resample: string='none', sampleRateODF: number=86.1328) {
    this.algoInstance = new wasmBackend.TempoTapDegara(maxTempo, minTempo, resample, sampleRateODF);
  }
  configure(maxTempo: number=208, minTempo: number=40, resample: string='none', sampleRateODF: number=86.1328) {
    this.algoInstance.configure(maxTempo, minTempo, resample, sampleRateODF);
  }
  compute(onsetDetections: any) {
    return this.algoInstance.compute(onsetDetections);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm outputs beat positions and confidence of their estimation based on the maximum mutual agreement between beat candidates estimated by different beat trackers (or using different features). Check https://essentia.upf.edu/reference/std_TempoTapMaxAgreement.html for more details.
* @class
* @param {VectorVectorFloat} tickCandidates the tick candidates estimated using different beat trackers (or features) [s]
* @returns {object} {ticks: 'the list of resulting ticks [s]', confidence: 'confidence with which the ticks were detected [0, 5.32]'}
* @memberof Essentia
*/
class TempoTapMaxAgreement {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.TempoTapMaxAgreement();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(tickCandidates: any) {
    return this.algoInstance.compute(tickCandidates);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm builds the list of ticks from the period and phase candidates given by the TempoTap algorithm. Check https://essentia.upf.edu/reference/std_TempoTapTicks.html for more details.
* @class
* @param {VectorFloat} periods tempo period candidates for the current frame, in frames
* @param {VectorFloat} phases tempo ticks phase candidates for the current frame, in frames
* @param {number} [frameHop=512] number of feature frames separating two evaluations
* @param {number} [hopSize=256] number of audio samples per features
* @param {number} [sampleRate=44100] sampling rate of the audio signal [Hz]
* @returns {object} {ticks: 'the list of resulting ticks [s]', matchingPeriods: 'list of matching periods [s]'}
* @memberof Essentia
*/
class TempoTapTicks {
  private algoInstance: any;
  constructor(frameHop: number=512, hopSize: number=256, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.TempoTapTicks(frameHop, hopSize, sampleRate);
  }
  configure(frameHop: number=512, hopSize: number=256, sampleRate: number=44100) {
    this.algoInstance.configure(frameHop, hopSize, sampleRate);
  }
  compute(periods: any, phases: any) {
    return this.algoInstance.compute(periods, phases);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes mel bands from an audio frame with the specific parametrization required by the FSD-SINet models. Check https://essentia.upf.edu/reference/std_TensorflowInputFSDSINet.html for more details.
* @class
* @param {VectorFloat} frame the audio frame
* @returns {object} {bands: 'the log-compressed mel bands'}
* @memberof Essentia
*/
class TensorflowInputFSDSINet {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.TensorflowInputFSDSINet();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes mel-bands specific to the input of MusiCNN-based models. Check https://essentia.upf.edu/reference/std_TensorflowInputMusiCNN.html for more details.
* @class
* @param {VectorFloat} frame the audio frame
* @returns {object} {bands: 'the log compressed mel bands'}
* @memberof Essentia
*/
class TensorflowInputMusiCNN {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.TensorflowInputMusiCNN();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes mel-bands specific to the input of TempoCNN-based models. Check https://essentia.upf.edu/reference/std_TensorflowInputTempoCNN.html for more details.
* @class
* @param {VectorFloat} frame the audio frame
* @returns {object} {bands: 'the mel bands'}
* @memberof Essentia
*/
class TensorflowInputTempoCNN {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.TensorflowInputTempoCNN();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes mel-bands specific to the input of VGGish-based models. Check https://essentia.upf.edu/reference/std_TensorflowInputVGGish.html for more details.
* @class
* @param {VectorFloat} frame the audio frame
* @returns {object} {bands: 'the log compressed mel bands'}
* @memberof Essentia
*/
class TensorflowInputVGGish {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.TensorflowInputVGGish();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes tonal features for an audio signal Check https://essentia.upf.edu/reference/std_TonalExtractor.html for more details.
* @class
* @param {VectorFloat} signal the audio input signal
* @param {number} [frameSize=4096] the framesize for computing tonal features
* @param {number} [hopSize=2048] the hopsize for computing tonal features
* @param {number} [tuningFrequency=440] the tuning frequency of the input signal
* @returns {object} {chords_changes_rate: 'See ChordsDescriptors algorithm documentation', chords_histogram: 'See ChordsDescriptors algorithm documentation', chords_key: 'See ChordsDescriptors algorithm documentation', chords_number_rate: 'See ChordsDescriptors algorithm documentation', chords_progression: 'See ChordsDetection algorithm documentation', chords_scale: 'See ChordsDetection algorithm documentation', chords_strength: 'See ChordsDetection algorithm documentation', hpcp: 'See HPCP algorithm documentation', hpcp_highres: 'See HPCP algorithm documentation', key_key: 'See Key algorithm documentation', key_scale: 'See Key algorithm documentation', key_strength: 'See Key algorithm documentation'}
* @memberof Essentia
*/
class TonalExtractor {
  private algoInstance: any;
  constructor(frameSize: number=4096, hopSize: number=2048, tuningFrequency: number=440) {
    this.algoInstance = new wasmBackend.TonalExtractor(frameSize, hopSize, tuningFrequency);
  }
  configure(frameSize: number=4096, hopSize: number=2048, tuningFrequency: number=440) {
    this.algoInstance.configure(frameSize, hopSize, tuningFrequency);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the tonic frequency of the lead artist in Indian art music. It uses multipitch representation of the audio signal (pitch salience) to compute a histogram using which the tonic is identified as one of its peak. The decision is made based on the distance between the prominent peaks, the classification is done using a decision tree. An empty input signal will throw an exception. An exception will also be thrown if no predominant pitch salience peaks are detected within the maxTonicFrequency to minTonicFrequency range.  Check https://essentia.upf.edu/reference/std_TonicIndianArtMusic.html for more details.
* @class
* @param {VectorFloat} signal the input signal
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
* @returns {object} {tonic: 'the estimated tonic frequency [Hz]'}
* @memberof Essentia
*/
class TonicIndianArtMusic {
  private algoInstance: any;
  constructor(binResolution: number=10, frameSize: number=2048, harmonicWeight: number=0.85, hopSize: number=512, magnitudeCompression: number=1, magnitudeThreshold: number=40, maxTonicFrequency: number=375, minTonicFrequency: number=100, numberHarmonics: number=20, numberSaliencePeaks: number=5, referenceFrequency: number=55, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.TonicIndianArtMusic(binResolution, frameSize, harmonicWeight, hopSize, magnitudeCompression, magnitudeThreshold, maxTonicFrequency, minTonicFrequency, numberHarmonics, numberSaliencePeaks, referenceFrequency, sampleRate);
  }
  configure(binResolution: number=10, frameSize: number=2048, harmonicWeight: number=0.85, hopSize: number=512, magnitudeCompression: number=1, magnitudeThreshold: number=40, maxTonicFrequency: number=375, minTonicFrequency: number=100, numberHarmonics: number=20, numberSaliencePeaks: number=5, referenceFrequency: number=55, sampleRate: number=44100) {
    this.algoInstance.configure(binResolution, frameSize, harmonicWeight, hopSize, magnitudeCompression, magnitudeThreshold, maxTonicFrequency, minTonicFrequency, numberHarmonics, numberSaliencePeaks, referenceFrequency, sampleRate);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes energy in triangular frequency bands of a spectrum. The arbitrary number of overlapping bands can be specified. For each band the power-spectrum (mag-squared) is summed. Check https://essentia.upf.edu/reference/std_TriangularBands.html for more details.
* @class
* @param {VectorFloat} spectrum the input spectrum (must be greater than size one)
* @param {any[]} [frequencyBands=[21.533203125, 43.06640625, 64.599609375, 86.1328125, 107.666015625, 129.19921875, 150.732421875, 172.265625, 193.798828125, 215.33203125, 236.865234375, 258.3984375, 279.931640625, 301.46484375, 322.998046875, 344.53125, 366.064453125, 387.59765625, 409.130859375, 430.6640625, 452.197265625, 473.73046875, 495.263671875, 516.796875, 538.330078125, 559.86328125, 581.396484375, 602.9296875, 624.462890625, 645.99609375, 667.529296875, 689.0625, 710.595703125, 732.12890625, 753.662109375, 775.1953125, 796.728515625, 839.794921875, 861.328125, 882.861328125, 904.39453125, 925.927734375, 968.994140625, 990.52734375, 1012.06054688, 1055.12695312, 1076.66015625, 1098.19335938, 1141.25976562, 1184.32617188, 1205.859375, 1248.92578125, 1270.45898438, 1313.52539062, 1356.59179688, 1399.65820312, 1442.72460938, 1485.79101562, 1528.85742188, 1571.92382812, 1614.99023438, 1658.05664062, 1701.12304688, 1765.72265625, 1808.7890625, 1873.38867188, 1916.45507812, 1981.0546875, 2024.12109375, 2088.72070312, 2153.3203125, 2217.91992188, 2282.51953125, 2347.11914062, 2411.71875, 2497.8515625, 2562.45117188, 2627.05078125, 2713.18359375, 2799.31640625, 2885.44921875, 2950.04882812, 3036.18164062, 3143.84765625, 3229.98046875, 3316.11328125, 3423.77929688, 3509.91210938, 3617.578125, 3725.24414062, 3832.91015625, 3940.57617188, 4069.77539062, 4177.44140625, 4306.640625, 4435.83984375, 4565.0390625, 4694.23828125, 4844.97070312, 4974.16992188, 5124.90234375, 5275.63476562, 5426.3671875, 5577.09960938, 5749.36523438, 5921.63085938, 6093.89648438, 6266.16210938, 6459.9609375, 6653.75976562, 6847.55859375, 7041.35742188, 7256.68945312, 7450.48828125, 7687.35351562, 7902.68554688, 8139.55078125, 8376.41601562, 8613.28125, 8871.6796875, 9130.078125, 9388.4765625, 9668.40820312, 9948.33984375, 10249.8046875, 10551.2695312, 10852.734375, 11175.7324219, 11498.7304688, 11843.2617188, 12187.7929688, 12553.8574219, 12919.921875, 13285.9863281, 13673.5839844, 14082.7148438, 14491.8457031, 14922.5097656, 15353.1738281, 15805.3710938, 16257.5683594]] list of frequency ranges into which the spectrum is divided (these must be in ascending order and connot contain duplicates),each triangle is build as x(i-1)=0, x(i)=1, x(i+1)=0 over i, the resulting number of bands is size of input array - 2
* @param {number} [inputSize=1025] the size of the spectrum
* @param {boolean} [log=true] compute log-energies (log2 (1 + energy))
* @param {string} [normalize=unit_sum] spectrum bin weights to use for each triangular band: 'unit_max' to make each triangle vertex equal to 1, 'unit_sum' to make each triangle area equal to 1 summing the actual weights of spectrum bins, 'unit_area' to make each triangle area equal to 1 normalizing the weights of each triangle by its bandwidth
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {string} [type=power] use magnitude or power spectrum
* @param {string} [weighting=linear] type of weighting function for determining triangle area
* @returns {object} {bands: 'the energy in each band'}
* @memberof Essentia
*/
class TriangularBands {
  private algoInstance: any;
  constructor(frequencyBands: any[]=[21.533203125, 43.06640625, 64.599609375, 86.1328125, 107.666015625, 129.19921875, 150.732421875, 172.265625, 193.798828125, 215.33203125, 236.865234375, 258.3984375, 279.931640625, 301.46484375, 322.998046875, 344.53125, 366.064453125, 387.59765625, 409.130859375, 430.6640625, 452.197265625, 473.73046875, 495.263671875, 516.796875, 538.330078125, 559.86328125, 581.396484375, 602.9296875, 624.462890625, 645.99609375, 667.529296875, 689.0625, 710.595703125, 732.12890625, 753.662109375, 775.1953125, 796.728515625, 839.794921875, 861.328125, 882.861328125, 904.39453125, 925.927734375, 968.994140625, 990.52734375, 1012.06054688, 1055.12695312, 1076.66015625, 1098.19335938, 1141.25976562, 1184.32617188, 1205.859375, 1248.92578125, 1270.45898438, 1313.52539062, 1356.59179688, 1399.65820312, 1442.72460938, 1485.79101562, 1528.85742188, 1571.92382812, 1614.99023438, 1658.05664062, 1701.12304688, 1765.72265625, 1808.7890625, 1873.38867188, 1916.45507812, 1981.0546875, 2024.12109375, 2088.72070312, 2153.3203125, 2217.91992188, 2282.51953125, 2347.11914062, 2411.71875, 2497.8515625, 2562.45117188, 2627.05078125, 2713.18359375, 2799.31640625, 2885.44921875, 2950.04882812, 3036.18164062, 3143.84765625, 3229.98046875, 3316.11328125, 3423.77929688, 3509.91210938, 3617.578125, 3725.24414062, 3832.91015625, 3940.57617188, 4069.77539062, 4177.44140625, 4306.640625, 4435.83984375, 4565.0390625, 4694.23828125, 4844.97070312, 4974.16992188, 5124.90234375, 5275.63476562, 5426.3671875, 5577.09960938, 5749.36523438, 5921.63085938, 6093.89648438, 6266.16210938, 6459.9609375, 6653.75976562, 6847.55859375, 7041.35742188, 7256.68945312, 7450.48828125, 7687.35351562, 7902.68554688, 8139.55078125, 8376.41601562, 8613.28125, 8871.6796875, 9130.078125, 9388.4765625, 9668.40820312, 9948.33984375, 10249.8046875, 10551.2695312, 10852.734375, 11175.7324219, 11498.7304688, 11843.2617188, 12187.7929688, 12553.8574219, 12919.921875, 13285.9863281, 13673.5839844, 14082.7148438, 14491.8457031, 14922.5097656, 15353.1738281, 15805.3710938, 16257.5683594], inputSize: number=1025, log: boolean=true, normalize: string='unit_sum', sampleRate: number=44100, type: string='power', weighting: string='linear') {
    let vecfrequencyBands = arrayToVector(frequencyBands);
    this.algoInstance = new wasmBackend.TriangularBands(vecfrequencyBands, inputSize, log, normalize, sampleRate, type, weighting);
  }
  configure(frequencyBands: any[]=[21.533203125, 43.06640625, 64.599609375, 86.1328125, 107.666015625, 129.19921875, 150.732421875, 172.265625, 193.798828125, 215.33203125, 236.865234375, 258.3984375, 279.931640625, 301.46484375, 322.998046875, 344.53125, 366.064453125, 387.59765625, 409.130859375, 430.6640625, 452.197265625, 473.73046875, 495.263671875, 516.796875, 538.330078125, 559.86328125, 581.396484375, 602.9296875, 624.462890625, 645.99609375, 667.529296875, 689.0625, 710.595703125, 732.12890625, 753.662109375, 775.1953125, 796.728515625, 839.794921875, 861.328125, 882.861328125, 904.39453125, 925.927734375, 968.994140625, 990.52734375, 1012.06054688, 1055.12695312, 1076.66015625, 1098.19335938, 1141.25976562, 1184.32617188, 1205.859375, 1248.92578125, 1270.45898438, 1313.52539062, 1356.59179688, 1399.65820312, 1442.72460938, 1485.79101562, 1528.85742188, 1571.92382812, 1614.99023438, 1658.05664062, 1701.12304688, 1765.72265625, 1808.7890625, 1873.38867188, 1916.45507812, 1981.0546875, 2024.12109375, 2088.72070312, 2153.3203125, 2217.91992188, 2282.51953125, 2347.11914062, 2411.71875, 2497.8515625, 2562.45117188, 2627.05078125, 2713.18359375, 2799.31640625, 2885.44921875, 2950.04882812, 3036.18164062, 3143.84765625, 3229.98046875, 3316.11328125, 3423.77929688, 3509.91210938, 3617.578125, 3725.24414062, 3832.91015625, 3940.57617188, 4069.77539062, 4177.44140625, 4306.640625, 4435.83984375, 4565.0390625, 4694.23828125, 4844.97070312, 4974.16992188, 5124.90234375, 5275.63476562, 5426.3671875, 5577.09960938, 5749.36523438, 5921.63085938, 6093.89648438, 6266.16210938, 6459.9609375, 6653.75976562, 6847.55859375, 7041.35742188, 7256.68945312, 7450.48828125, 7687.35351562, 7902.68554688, 8139.55078125, 8376.41601562, 8613.28125, 8871.6796875, 9130.078125, 9388.4765625, 9668.40820312, 9948.33984375, 10249.8046875, 10551.2695312, 10852.734375, 11175.7324219, 11498.7304688, 11843.2617188, 12187.7929688, 12553.8574219, 12919.921875, 13285.9863281, 13673.5839844, 14082.7148438, 14491.8457031, 14922.5097656, 15353.1738281, 15805.3710938, 16257.5683594], inputSize: number=1025, log: boolean=true, normalize: string='unit_sum', sampleRate: number=44100, type: string='power', weighting: string='linear') {
    let vecfrequencyBands = arrayToVector(frequencyBands);
    this.algoInstance.configure(vecfrequencyBands, inputSize, log, normalize, sampleRate, type, weighting);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes energy in the bark bands of a spectrum. It is different to the regular BarkBands algorithm in that is more configurable so that it can be used in the BFCC algorithm to produce output similar to Rastamat (http://www.ee.columbia.edu/ln/rosa/matlab/rastamat/)
See the BFCC algorithm documentation for more information as to why you might want to choose this over Mel frequency analysis
It is recommended that the input "spectrum" be calculated by the Spectrum algorithm. Check https://essentia.upf.edu/reference/std_TriangularBarkBands.html for more details.
* @class
* @param {VectorFloat} spectrum the audio spectrum
* @param {number} [highFrequencyBound=22050] an upper-bound limit for the frequencies to be included in the bands
* @param {number} [inputSize=1025] the size of the spectrum
* @param {boolean} [log=false] compute log-energies (log2 (1 + energy))
* @param {number} [lowFrequencyBound=0] a lower-bound limit for the frequencies to be included in the bands
* @param {string} [normalize=unit_sum] 'unit_max' makes the vertex of all the triangles equal to 1, 'unit_sum' makes the area of all the triangles equal to 1
* @param {number} [numberBands=24] the number of output bands
* @param {number} [sampleRate=44100] the sample rate
* @param {string} [type=power] 'power' to output squared units, 'magnitude' to keep it as the input
* @param {string} [weighting=warping] type of weighting function for determining triangle area
* @returns {object} {bands: 'the energy in bark bands'}
* @memberof Essentia
*/
class TriangularBarkBands {
  private algoInstance: any;
  constructor(highFrequencyBound: number=22050, inputSize: number=1025, log: boolean=false, lowFrequencyBound: number=0, normalize: string='unit_sum', numberBands: number=24, sampleRate: number=44100, type: string='power', weighting: string='warping') {
    this.algoInstance = new wasmBackend.TriangularBarkBands(highFrequencyBound, inputSize, log, lowFrequencyBound, normalize, numberBands, sampleRate, type, weighting);
  }
  configure(highFrequencyBound: number=22050, inputSize: number=1025, log: boolean=false, lowFrequencyBound: number=0, normalize: string='unit_sum', numberBands: number=24, sampleRate: number=44100, type: string='power', weighting: string='warping') {
    this.algoInstance.configure(highFrequencyBound, inputSize, log, lowFrequencyBound, normalize, numberBands, sampleRate, type, weighting);
  }
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm extracts a segment of an audio signal given its start and end times.
Giving "startTime" greater than "endTime" will raise an exception. Check https://essentia.upf.edu/reference/std_Trimmer.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {boolean} [checkRange=false] check whether the specified time range for a slice fits the size of input signal (throw exception if not)
* @param {number} [endTime=1e+06] the end time of the slice you want to extract [s]
* @param {number} [sampleRate=44100] the sampling rate of the input audio signal [Hz]
* @param {number} [startTime=0] the start time of the slice you want to extract [s]
* @returns {object} {signal: 'the trimmed signal'}
* @memberof Essentia
*/
class Trimmer {
  private algoInstance: any;
  constructor(checkRange: boolean=false, endTime: number=1e+06, sampleRate: number=44100, startTime: number=0) {
    this.algoInstance = new wasmBackend.Trimmer(checkRange, endTime, sampleRate, startTime);
  }
  configure(checkRange: boolean=false, endTime: number=1e+06, sampleRate: number=44100, startTime: number=0) {
    this.algoInstance.configure(checkRange, endTime, sampleRate, startTime);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm calculates the tristimulus of a signal given its harmonic peaks. The tristimulus has been introduced as a timbre equivalent to the color attributes in the vision. Tristimulus measures the mixture of harmonics in a given sound, grouped into three sections. The first tristimulus measures the relative weight of the first harmonic; the second tristimulus measures the relative weight of the second, third, and fourth harmonics taken together; and the third tristimulus measures the relative weight of all the remaining harmonics. Check https://essentia.upf.edu/reference/std_Tristimulus.html for more details.
* @class
* @param {VectorFloat} frequencies the frequencies of the harmonic peaks ordered by frequency
* @param {VectorFloat} magnitudes the magnitudes of the harmonic peaks ordered by frequency
* @returns {object} {tristimulus: 'a three-element vector that measures the mixture of harmonics of the given spectrum'}
* @memberof Essentia
*/
class Tristimulus {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.Tristimulus();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(frequencies, magnitudes);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements a “true-peak” level meter for clipping detection. According to the ITU-R recommendations, “true-peak” values overcoming the full-scale range are potential sources of “clipping in subsequent processes, such as within particular D/A converters or during sample-rate conversion”.
The ITU-R BS.1770-4[1] (by default) and the ITU-R BS.1770-2[2] signal-flows can be used. Go to the references for information about the differences.
Only the peaks (if any) exceeding the configurable amplitude threshold are returned.
Note: the parameters 'blockDC' and 'emphasise' work only when 'version' is set to 2.
References:
  [1] Series, B. S. (2011). Recommendation  ITU-R  BS.1770-4. Algorithms to measure audio programme loudness and true-peak audio level,
  https://www.itu.int/dms_pubrec/itu-r/rec/bs/R-REC-BS.1770-4-201510-I!!PDF-E.pdf
  [2] Series, B. S. (2011). Recommendation  ITU-R  BS.1770-2. Algorithms to measure audio programme loudness and true-peak audio level,
  https://www.itu.int/dms_pubrec/itu-r/rec/bs/R-REC-BS.1770-2-201103-S!!PDF-E.pdf
 Check https://essentia.upf.edu/reference/std_TruePeakDetector.html for more details.
* @class
* @param {VectorFloat} signal the input audio signal
* @param {boolean} [blockDC=false] flag to activate the optional DC blocker
* @param {boolean} [emphasise=false] flag to activate the optional emphasis filter
* @param {number} [oversamplingFactor=4] times the signal is oversapled
* @param {number} [quality=1] type of interpolation applied (see libresmple)
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {number} [threshold=-0.0002] threshold to detect peaks [dB]
* @param {number} [version=4] algorithm version
* @returns {object} {peakLocations: 'the peak locations in the ouput signal', output: 'the processed signal'}
* @memberof Essentia
*/
class TruePeakDetector {
  private algoInstance: any;
  constructor(blockDC: boolean=false, emphasise: boolean=false, oversamplingFactor: number=4, quality: number=1, sampleRate: number=44100, threshold: number=-0.0002, version: number=4) {
    this.algoInstance = new wasmBackend.TruePeakDetector(blockDC, emphasise, oversamplingFactor, quality, sampleRate, threshold, version);
  }
  configure(blockDC: boolean=false, emphasise: boolean=false, oversamplingFactor: number=4, quality: number=1, sampleRate: number=44100, threshold: number=-0.0002, version: number=4) {
    this.algoInstance.configure(blockDC, emphasise, oversamplingFactor, quality, sampleRate, threshold, version);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm estimates the tuning frequency give a sequence/set of spectral peaks. The result is the tuning frequency in Hz, and its distance from 440Hz in cents. This version is slightly adapted from the original algorithm [1], but gives the same results. Check https://essentia.upf.edu/reference/std_TuningFrequency.html for more details.
* @class
* @param {VectorFloat} frequencies the frequencies of the spectral peaks [Hz]
* @param {VectorFloat} magnitudes the magnitudes of the spectral peaks
* @param {number} [resolution=1] resolution in cents (logarithmic scale, 100 cents = 1 semitone) for tuning frequency determination
* @returns {object} {tuningFrequency: 'the tuning frequency [Hz]', tuningCents: 'the deviation from 440 Hz (between -35 to 65 cents)'}
* @memberof Essentia
*/
class TuningFrequency {
  private algoInstance: any;
  constructor(resolution: number=1) {
    this.algoInstance = new wasmBackend.TuningFrequency(resolution);
  }
  configure(resolution: number=1) {
    this.algoInstance.configure(resolution);
  }
  compute(frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(frequencies, magnitudes);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm extracts the tuning frequency of an audio signal Check https://essentia.upf.edu/reference/std_TuningFrequencyExtractor.html for more details.
* @class
* @param {VectorFloat} signal the audio input signal
* @param {number} [frameSize=4096] the frameSize for computing tuning frequency
* @param {number} [hopSize=2048] the hopsize for computing tuning frequency
* @returns {object} {tuningFrequency: 'the computed tuning frequency'}
* @memberof Essentia
*/
class TuningFrequencyExtractor {
  private algoInstance: any;
  constructor(frameSize: number=4096, hopSize: number=2048) {
    this.algoInstance = new wasmBackend.TuningFrequencyExtractor(frameSize, hopSize);
  }
  configure(frameSize: number=4096, hopSize: number=2048) {
    this.algoInstance.configure(frameSize, hopSize);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm performs basic arithmetical operations element by element given an array.
Note:
  - log and ln are equivalent to the natural logarithm
  - for log, ln, log10 and lin2db, x is clipped to 1e-30 for x<1e-30
  - for x<0, sqrt(x) is invalid
  - scale and shift parameters define linear transformation to be applied to the resulting elements Check https://essentia.upf.edu/reference/std_UnaryOperator.html for more details.
* @class
* @param {VectorFloat} array the input array
* @param {number} [scale=1] multiply result by factor
* @param {number} [shift=0] shift result by value (add value)
* @param {string} [type=identity] the type of the unary operator to apply to input array
* @returns {object} {array: 'the input array transformed by unary operation'}
* @memberof Essentia
*/
class UnaryOperator {
  private algoInstance: any;
  constructor(scale: number=1, shift: number=0, type: string='identity') {
    this.algoInstance = new wasmBackend.UnaryOperator(scale, shift, type);
  }
  configure(scale: number=1, shift: number=0, type: string='identity') {
    this.algoInstance.configure(scale, shift, type);
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm performs basic arithmetical operations element by element given an array.
Note:
  - log and ln are equivalent to the natural logarithm
  - for log, ln, log10 and lin2db, x is clipped to 1e-30 for x<1e-30
  - for x<0, sqrt(x) is invalid
  - scale and shift parameters define linear transformation to be applied to the resulting elements Check https://essentia.upf.edu/reference/std_UnaryOperatorStream.html for more details.
* @class
* @param {VectorFloat} array the input array
* @param {number} [scale=1] multiply result by factor
* @param {number} [shift=0] shift result by value (add value)
* @param {string} [type=identity] the type of the unary operator to apply to input array
* @returns {object} {array: 'the input array transformed by unary operation'}
* @memberof Essentia
*/
class UnaryOperatorStream {
  private algoInstance: any;
  constructor(scale: number=1, shift: number=0, type: string='identity') {
    this.algoInstance = new wasmBackend.UnaryOperatorStream(scale, shift, type);
  }
  configure(scale: number=1, shift: number=0, type: string='identity') {
    this.algoInstance.configure(scale, shift, type);
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the variance of an array. Check https://essentia.upf.edu/reference/std_Variance.html for more details.
* @class
* @param {VectorFloat} array the input array
* @returns {object} {variance: 'the variance of the input array'}
* @memberof Essentia
*/
class Variance {
  private algoInstance: any;
  constructor() {
    this.algoInstance = new wasmBackend.Variance();
  }
  configure() {
    this.algoInstance.configure();
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm detects the presence of vibrato and estimates its parameters given a pitch contour [Hz]. The result is the vibrato frequency in Hz and the extent (peak to peak) in cents. If no vibrato is detected in a frame, the output of both values is zero. Check https://essentia.upf.edu/reference/std_Vibrato.html for more details.
* @class
* @param {VectorFloat} pitch the pitch trajectory [Hz].
* @param {number} [maxExtend=250] maximum considered vibrato extent [cents]
* @param {number} [maxFrequency=8] maximum considered vibrato frequency [Hz]
* @param {number} [minExtend=50] minimum considered vibrato extent [cents]
* @param {number} [minFrequency=4] minimum considered vibrato frequency [Hz]
* @param {number} [sampleRate=344.531] sample rate of the input pitch contour
* @returns {object} {vibratoFrequency: 'estimated vibrato frequency (or speed) [Hz]; zero if no vibrato was detected.', vibratoExtend: 'estimated vibrato extent (or depth) [cents]; zero if no vibrato was detected.'}
* @memberof Essentia
*/
class Vibrato {
  private algoInstance: any;
  constructor(maxExtend: number=250, maxFrequency: number=8, minExtend: number=50, minFrequency: number=4, sampleRate: number=344.531) {
    this.algoInstance = new wasmBackend.Vibrato(maxExtend, maxFrequency, minExtend, minFrequency, sampleRate);
  }
  configure(maxExtend: number=250, maxFrequency: number=8, minExtend: number=50, minFrequency: number=4, sampleRate: number=344.531) {
    this.algoInstance.configure(maxExtend, maxFrequency, minExtend, minFrequency, sampleRate);
  }
  compute(pitch: any) {
    return this.algoInstance.compute(pitch);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the warped auto-correlation of an audio signal. The implementation is an adapted version of K. Schmidt's implementation of the matlab algorithm from the 'warped toolbox' by Aki Harma and Matti Karjalainen found [2]. For a detailed explanation of the algorithm, see [1].
This algorithm is only defined for positive lambda = 1.0674*sqrt(2.0*atan(0.00006583*sampleRate)/PI) - 0.1916, thus it will throw an exception when the supplied sampling rate does not pass the requirements.
If maxLag is larger than the size of the input array, an exception is thrown. Check https://essentia.upf.edu/reference/std_WarpedAutoCorrelation.html for more details.
* @class
* @param {VectorFloat} array the array to be analyzed
* @param {number} [maxLag=1] the maximum lag for which the auto-correlation is computed (inclusive) (must be smaller than signal size) 
* @param {number} [sampleRate=44100] the audio sampling rate [Hz]
* @returns {object} {warpedAutoCorrelation: 'the warped auto-correlation vector'}
* @memberof Essentia
*/
class WarpedAutoCorrelation {
  private algoInstance: any;
  constructor(maxLag: number=1, sampleRate: number=44100) {
    this.algoInstance = new wasmBackend.WarpedAutoCorrelation(maxLag, sampleRate);
  }
  configure(maxLag: number=1, sampleRate: number=44100) {
    this.algoInstance.configure(maxLag, sampleRate);
  }
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
*  This algorithm estimates the Power Spectral Density of the input signal using the Welch's method [1].
 The input should be fed with the overlapped audio frames. The algorithm stores internally therequired past frames to compute each output. Call reset() to clear the buffers. This implentation is based on Scipy [2] Check https://essentia.upf.edu/reference/std_Welch.html for more details.
* @class
* @param {VectorFloat} frame the input stereo audio signal
* @param {number} [averagingFrames=10] amount of frames to average
* @param {number} [fftSize=1024] size of the FFT. Zero padding is added if this is larger the input frame size.
* @param {number} [frameSize=512] the expected size of the input audio signal (this is an optional parameter to optimize memory allocation)
* @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
* @param {string} [scaling=density] 'density' normalizes the result to the bandwidth while 'power' outputs the unnormalized power spectrum
* @param {string} [windowType=hann] the window type
* @returns {object} {psd: 'Power Spectral Density [dB] or [dB/Hz]'}
* @memberof Essentia
*/
class Welch {
  private algoInstance: any;
  constructor(averagingFrames: number=10, fftSize: number=1024, frameSize: number=512, sampleRate: number=44100, scaling: string='density', windowType: string='hann') {
    this.algoInstance = new wasmBackend.Welch(averagingFrames, fftSize, frameSize, sampleRate, scaling, windowType);
  }
  configure(averagingFrames: number=10, fftSize: number=1024, frameSize: number=512, sampleRate: number=44100, scaling: string='density', windowType: string='hann') {
    this.algoInstance.configure(averagingFrames, fftSize, frameSize, sampleRate, scaling, windowType);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm applies windowing to an audio signal. It optionally applies zero-phase windowing and optionally adds zero-padding. The resulting windowed frame size is equal to the incoming frame size plus the number of padded zeros. By default, the available windows are normalized (to have an area of 1) and then scaled by a factor of 2. Check https://essentia.upf.edu/reference/std_Windowing.html for more details.
* @class
* @param {VectorFloat} frame the input audio frame
* @param {number} [constantsDecimals=5] number of decimals considered in the constants for the formulation of the hamming and blackmanharris* windows 
* @param {boolean} [normalized=true] a boolean value to specify whether to normalize windows (to have an area of 1) and then scale by a factor of 2
* @param {number} [size=1024] the window size
* @param {boolean} [splitPadding=false] whether to split the padding to the edges of the signal (_/\_) or to add it to the right (/\__). This option is ignored when zeroPhase (\__/) is true
* @param {boolean} [symmetric=true] whether to create a symmetric or asymmetric window as implemented in SciPy
* @param {string} [type=hann] the window type
* @param {number} [zeroPadding=0] the size of the zero-padding
* @param {boolean} [zeroPhase=true] a boolean value that enables zero-phase windowing
* @returns {object} {frame: 'the windowed audio frame'}
* @memberof Essentia
*/
class Windowing {
  private algoInstance: any;
  constructor(constantsDecimals: number=5, normalized: boolean=true, size: number=1024, splitPadding: boolean=false, symmetric: boolean=true, type: string='hann', zeroPadding: number=0, zeroPhase: boolean=true) {
    this.algoInstance = new wasmBackend.Windowing(constantsDecimals, normalized, size, splitPadding, symmetric, type, zeroPadding, zeroPhase);
  }
  configure(constantsDecimals: number=5, normalized: boolean=true, size: number=1024, splitPadding: boolean=false, symmetric: boolean=true, type: string='hann', zeroPadding: number=0, zeroPhase: boolean=true) {
    this.algoInstance.configure(constantsDecimals, normalized, size, splitPadding, symmetric, type, zeroPadding, zeroPhase);
  }
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the zero-crossing rate of an audio signal. It is the number of sign changes between consecutive signal values divided by the total number of values. Noisy signals tend to have higher zero-crossing rate.
In order to avoid small variations around zero caused by noise, a threshold around zero is given to consider a valid zerocrosing whenever the boundary is crossed. Check https://essentia.upf.edu/reference/std_ZeroCrossingRate.html for more details.
* @class
* @param {VectorFloat} signal the input signal
* @param {number} [threshold=0] the threshold which will be taken as the zero axis in both positive and negative sign
* @returns {object} {zeroCrossingRate: 'the zero-crossing rate'}
* @memberof Essentia
*/
class ZeroCrossingRate {
  private algoInstance: any;
  constructor(threshold: number=0) {
    this.algoInstance = new wasmBackend.ZeroCrossingRate(threshold);
  }
  configure(threshold: number=0) {
    this.algoInstance.configure(threshold);
  }
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  delete() {
    this.algoInstance.delete();
  }
}
 



/*
@exports
*/
export {
  getAudioBufferFromURL,
  getAudioChannelDataFromURL,
  audioBufferToMonoSignal,
  arrayToVector,
  vectorToArray,
  FrameGenerator,
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
  ready
};