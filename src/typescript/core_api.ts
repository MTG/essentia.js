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

import * as paramTypes from "./param_types";

let wasmBackend: any;

/**
 * Set module-wide WASM instance and initialise Essentia
 * @function
 * @param {EssentiaEmscriptenModule} EssentiaWASM Essentia WebAssembly backend (emcripten global module object) which is loaded from 'essentia-wasm.*.js file'
*/
function ready(EssentiaWASM: any, isDebug: boolean = false) {
  wasmBackend = EssentiaWASM;
  wasmBackend.init(isDebug);
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
 * @function
 * @param {Float32Array} inputArray input JS typed array
 * @returns {VectorFloat} returns vector float
*/
function arrayToVector(inputArray: any) {
  return wasmBackend.arrayToVector(inputArray);
}

/**
 * Convert an input VectorFloat array into typed JS Float32Array 
 * @function 
 * @param {VectorFloat} inputVector input VectorFloat array
 * @returns {Float32Array} returns converted JS typed array
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
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {number} [frameSize=2048] frame size for cutting the audio signal
   * @param {number} [hopSize=1024] size of overlapping frame 
  */
  constructor(frameSize: number=2048, hopSize: number=1024) {
    this.algoInstance = new wasmBackend.FrameGenerator(frameSize, hopSize);
  }

  /**
   * Configure algorithm with default or given params
   * @method
   * @param {number} [frameSize=2048] frame size for cutting the audio signal
   * @param {number} [hopSize=1024] size of overlapping frame 
   * @memberof FrameGenerator
  */
  configure(frameSize: number=2048, hopSize: number=1024) {
    this.algoInstance.configure(frameSize, hopSize);
  }

  /**
   * Execute algorithm with given inputs
   * @method
   * @param {Float32Array} inputAudioData a single channel audio channel data
   * @returns {VectorVectorFloat} Returns a 2D vector float of sliced audio frames
   * @memberof FrameGenerator 
  */
  compute(inputAudioData: Float32Array) {
    return this.algoInstance.compute(inputAudioData);
  }

  /**
   * Delete algorithm instance
   * @method
   * @memberof FrameGenerator 
  */
  delete() {
    this.algoInstance.delete();
  }
}

/**
 * This algorithm downmixes the signal into a single channel given a stereo signal. It is a wrapper around https://essentia.upf.edu/reference/std_MonoMixer.html.
 * @class
*/
class MonoMixer {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
  */
  constructor() {
    this.algoInstance = new wasmBackend.MonoMixer();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @memberof MonoMixer
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} leftChannel the left channel of the stereo audio signal
   * @param {VectorFloat} rightChannel the right channel of the stereo audio signal
   * @returns {object} {audio: 'the downmixed mono signal'}
   * @memberof MonoMixer 
  */
  compute(leftSignal: any, rightSignal: any) {
    return this.algoInstance.compute(leftSignal, rightSignal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof MonoMixer 
  */
  delete() {
    this.algoInstance.delete();
  }
}

/**
 * This algorithm computes the EBUR128 loudness descriptors of an audio signal. It is a wrapper around https://essentia.upf.edu/reference/std_LoudnessEBUR128.html.
 * @class
*/
class LoudnessEBUR128 {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {number} [hopSize=0.1] the hop size with which the loudness is computed [s]
   * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
   * @param {boolean} [startAtZero=false] start momentary/short-term loudness estimation at time 0 (zero-centered loudness estimation windows) if true; otherwise start both windows at time 0 (time positions for momentary and short-term values will not be syncronized)
  */
  constructor(hopSize: number=0.1, sampleRate: number=44100, startAtZero: boolean=false) {
    this.algoInstance = new wasmBackend.LoudnessEBUR128(hopSize, sampleRate, startAtZero);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {number} [hopSize=0.1] the hop size with which the loudness is computed [s]
   * @param {number} [sampleRate=44100] the sampling rate of the audio signal [Hz]
   * @param {boolean} [startAtZero=false] start momentary/short-term loudness estimation at time 0 (zero-centered loudness estimation windows) if true; otherwise start both windows at time 0 (time positions for momentary and short-term values will not be syncronized)
   * @memberof LoudnessEBUR128
  */
  configure(hopSize: number=0.1, sampleRate: number=44100, startAtZero: boolean=false) {
    this.algoInstance.configure(hopSize, sampleRate, startAtZero);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} leftChannel the left channel of the stereo audio signal
   * @param {VectorFloat} rightChannel the right channel of the stereo audio signal
   * @returns {object} {momentaryLoudness: 'momentary loudness (over 400ms) (LUFS)', shortTermLoudness: 'short-term loudness (over 3 seconds) (LUFS)', integratedLoudness: 'integrated loudness (overall) (LUFS)', loudnessRange: 'loudness range over an arbitrary long time interval [3] (dB, LU)'}
   * @memberof LoudnessEBUR128 
  */
  compute(leftSignal: any, rightSignal: any) {
    return this.algoInstance.compute(leftSignal, rightSignal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof LoudnessEBUR128 
  */
  delete() {
    this.algoInstance.delete();
  }
}

// NOTE: The following code snippets are machine generated. Do not edit.
/**
* This algorithm computes the ratio between the pitch energy after the pitch maximum and the pitch energy before the pitch maximum. Sounds having an monotonically ascending pitch or one unique pitch will show a value of (0,1], while sounds having a monotonically descending pitch will show a value of [1,inf). In case there is no energy before the max pitch, the algorithm will return the energy after the maximum pitch. Check https://essentia.upf.edu/reference/std_AfterMaxToBeforeMaxEnergyRatio.html for more details.
* @class
*/
class AfterMaxToBeforeMaxEnergyRatio {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsAfterMaxToBeforeMaxEnergyRatio} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.AfterMaxToBeforeMaxEnergyRatio();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsAfterMaxToBeforeMaxEnergyRatio} [params]
   * @memberof AfterMaxToBeforeMaxEnergyRatio
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} pitch the array of pitch values [Hz]
   * @returns {object} {afterMaxToBeforeMaxEnergyRatio: 'the ratio between the pitch energy after the pitch maximum to the pitch energy before the pitch maximum'}
   * @memberof AfterMaxToBeforeMaxEnergyRatio
  */
  compute(pitch: any) {
    return this.algoInstance.compute(pitch);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof AfterMaxToBeforeMaxEnergyRatio
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements a IIR all-pass filter of order 1 or 2. Because of its dependence on IIR, IIR's requirements are inherited. Check https://essentia.upf.edu/reference/std_AllPass.html for more details.
* @class
*/
class AllPass {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsAllPass = {
    bandwidth: 500,
    cutoffFrequency: 1500,
    order: 1,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsAllPass = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsAllPass} [params]
  */
  constructor(params: paramTypes.ParamsAllPass) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.AllPass(this.params.bandwidth, this.params.cutoffFrequency, this.params.order, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsAllPass} [params]
   * @memberof AllPass
  */
  configure(params: paramTypes.ParamsAllPass) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.bandwidth, this.params.cutoffFrequency, this.params.order, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {signal: 'the filtered signal'}
   * @memberof AllPass
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof AllPass
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsAllPass) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm creates a wave file in which a given audio signal is mixed with a series of time onsets. The sonification of the onsets can be heard as beeps, or as short white noise pulses if configured to do so. Check https://essentia.upf.edu/reference/std_AudioOnsetsMarker.html for more details.
* @class
*/
class AudioOnsetsMarker {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsAudioOnsetsMarker = {
    onsets: arrayToVector([]),
    sampleRate: 44100,
    type: 'beep',
  };
  private params: paramTypes.ParamsAudioOnsetsMarker = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsAudioOnsetsMarker} [params]
  */
  constructor(params: paramTypes.ParamsAudioOnsetsMarker) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.AudioOnsetsMarker(this.params.onsets, this.params.sampleRate, this.params.type);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsAudioOnsetsMarker} [params]
   * @memberof AudioOnsetsMarker
  */
  configure(params: paramTypes.ParamsAudioOnsetsMarker) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.onsets, this.params.sampleRate, this.params.type);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {signal: 'the input signal mixed with bursts at onset locations'}
   * @memberof AudioOnsetsMarker
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof AudioOnsetsMarker
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsAudioOnsetsMarker) {
    if (!params) return;
    if (params.onsets) {
      params.onsets = arrayToVector(params.onsets);
    }
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the autocorrelation vector of a signal.
It uses the version most commonly used in signal processing, which doesn't remove the mean from the observations.
Using the 'generalized' option this algorithm computes autocorrelation as described in [3]. Check https://essentia.upf.edu/reference/std_AutoCorrelation.html for more details.
* @class
*/
class AutoCorrelation {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsAutoCorrelation = {
    frequencyDomainCompression: 0.5,
    generalized: false,
    normalization: 'standard',
  };
  private params: paramTypes.ParamsAutoCorrelation = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsAutoCorrelation} [params]
  */
  constructor(params: paramTypes.ParamsAutoCorrelation) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.AutoCorrelation(this.params.frequencyDomainCompression, this.params.generalized, this.params.normalization);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsAutoCorrelation} [params]
   * @memberof AutoCorrelation
  */
  configure(params: paramTypes.ParamsAutoCorrelation) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frequencyDomainCompression, this.params.generalized, this.params.normalization);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the array to be analyzed
   * @returns {object} {autoCorrelation: 'the autocorrelation vector'}
   * @memberof AutoCorrelation
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof AutoCorrelation
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsAutoCorrelation) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the bark-frequency cepstrum coefficients of a spectrum. Bark bands and their subsequent usage in cepstral analysis have shown to be useful in percussive content [1, 2]
This algorithm is implemented using the Bark scaling approach in the Rastamat version of the MFCC algorithm and in a similar manner to the MFCC-FB40 default specs: Check https://essentia.upf.edu/reference/std_BFCC.html for more details.
* @class
*/
class BFCC {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsBFCC = {
    dctType: 2,
    highFrequencyBound: 11000,
    inputSize: 1025,
    liftering: 0,
    logType: 'dbamp',
    lowFrequencyBound: 0,
    normalize: 'unit_sum',
    numberBands: 40,
    numberCoefficients: 13,
    sampleRate: 44100,
    type: 'power',
    weighting: 'warping',
  };
  private params: paramTypes.ParamsBFCC = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsBFCC} [params]
  */
  constructor(params: paramTypes.ParamsBFCC) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.BFCC(this.params.dctType, this.params.highFrequencyBound, this.params.inputSize, this.params.liftering, this.params.logType, this.params.lowFrequencyBound, this.params.normalize, this.params.numberBands, this.params.numberCoefficients, this.params.sampleRate, this.params.type, this.params.weighting);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsBFCC} [params]
   * @memberof BFCC
  */
  configure(params: paramTypes.ParamsBFCC) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.dctType, this.params.highFrequencyBound, this.params.inputSize, this.params.liftering, this.params.logType, this.params.lowFrequencyBound, this.params.normalize, this.params.numberBands, this.params.numberCoefficients, this.params.sampleRate, this.params.type, this.params.weighting);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the audio spectrum
   * @returns {object} {bands: 'the energies in bark bands', bfcc: 'the bark frequency cepstrum coefficients'}
   * @memberof BFCC
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof BFCC
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsBFCC) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm implements a break point function which linearly interpolates between discrete xy-coordinates to construct a continuous function. Check https://essentia.upf.edu/reference/std_BPF.html for more details.
* @class
*/
class BPF {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsBPF = {
    xPoints: arrayToVector([0, 1]),
    yPoints: arrayToVector([0, 1]),
  };
  private params: paramTypes.ParamsBPF = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsBPF} [params]
  */
  constructor(params: paramTypes.ParamsBPF) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.BPF(this.params.xPoints, this.params.yPoints);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsBPF} [params]
   * @memberof BPF
  */
  configure(params: paramTypes.ParamsBPF) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.xPoints, this.params.yPoints);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {number} x the input coordinate (x-axis)
   * @returns {object} {y: 'the output coordinate (y-axis)'}
   * @memberof BPF
  */
  compute(x: number) {
    return this.algoInstance.compute(x);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof BPF
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsBPF) {
    if (!params) return;
    if (params.xPoints) {
      params.xPoints = arrayToVector(params.xPoints);
    }
    if (params.yPoints) {
      params.yPoints = arrayToVector(params.yPoints);
    }
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm implements a 2nd order IIR band-pass filter. Because of its dependence on IIR, IIR's requirements are inherited. Check https://essentia.upf.edu/reference/std_BandPass.html for more details.
* @class
*/
class BandPass {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsBandPass = {
    bandwidth: 500,
    cutoffFrequency: 1500,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsBandPass = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsBandPass} [params]
  */
  constructor(params: paramTypes.ParamsBandPass) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.BandPass(this.params.bandwidth, this.params.cutoffFrequency, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsBandPass} [params]
   * @memberof BandPass
  */
  configure(params: paramTypes.ParamsBandPass) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.bandwidth, this.params.cutoffFrequency, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input audio signal
   * @returns {object} {signal: 'the filtered signal'}
   * @memberof BandPass
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof BandPass
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsBandPass) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm implements a 2nd order IIR band-reject filter. Because of its dependence on IIR, IIR's requirements are inherited. Check https://essentia.upf.edu/reference/std_BandReject.html for more details.
* @class
*/
class BandReject {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsBandReject = {
    bandwidth: 500,
    cutoffFrequency: 1500,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsBandReject = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsBandReject} [params]
  */
  constructor(params: paramTypes.ParamsBandReject) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.BandReject(this.params.bandwidth, this.params.cutoffFrequency, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsBandReject} [params]
   * @memberof BandReject
  */
  configure(params: paramTypes.ParamsBandReject) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.bandwidth, this.params.cutoffFrequency, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {signal: 'the filtered signal'}
   * @memberof BandReject
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof BandReject
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsBandReject) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes energy in Bark bands of a spectrum. The band frequencies are: [0.0, 50.0, 100.0, 150.0, 200.0, 300.0, 400.0, 510.0, 630.0, 770.0, 920.0, 1080.0, 1270.0, 1480.0, 1720.0, 2000.0, 2320.0, 2700.0, 3150.0, 3700.0, 4400.0, 5300.0, 6400.0, 7700.0, 9500.0, 12000.0, 15500.0, 20500.0, 27000.0]. The first two Bark bands [0,100] and [100,200] have been split in half for better resolution (because of an observed better performance in beat detection). For each bark band the power-spectrum (mag-squared) is summed. Check https://essentia.upf.edu/reference/std_BarkBands.html for more details.
* @class
*/
class BarkBands {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsBarkBands = {
    numberBands: 27,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsBarkBands = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsBarkBands} [params]
  */
  constructor(params: paramTypes.ParamsBarkBands) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.BarkBands(this.params.numberBands, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsBarkBands} [params]
   * @memberof BarkBands
  */
  configure(params: paramTypes.ParamsBarkBands) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.numberBands, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input spectrum
   * @returns {object} {bands: 'the energy of the bark bands'}
   * @memberof BarkBands
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof BarkBands
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsBarkBands) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates the beat positions given an input signal. It computes 'complex spectral difference' onset detection function and utilizes the beat tracking algorithm (TempoTapDegara) to extract beats [1]. The algorithm works with the optimized settings of 2048/1024 frame/hop size for the computation of the detection function, with its posterior x2 resampling.) While it has a lower accuracy than BeatTrackerMultifeature (see the evaluation results in [2]), its computational speed is significantly higher, which makes reasonable to apply this algorithm for batch processings of large amounts of audio signals. Check https://essentia.upf.edu/reference/std_BeatTrackerDegara.html for more details.
* @class
*/
class BeatTrackerDegara {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsBeatTrackerDegara = {
    maxTempo: 208,
    minTempo: 40,
  };
  private params: paramTypes.ParamsBeatTrackerDegara = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsBeatTrackerDegara} [params]
  */
  constructor(params: paramTypes.ParamsBeatTrackerDegara) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.BeatTrackerDegara(this.params.maxTempo, this.params.minTempo);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsBeatTrackerDegara} [params]
   * @memberof BeatTrackerDegara
  */
  configure(params: paramTypes.ParamsBeatTrackerDegara) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.maxTempo, this.params.minTempo);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the audio input signal
   * @returns {object} {ticks: ' the estimated tick locations [s]'}
   * @memberof BeatTrackerDegara
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof BeatTrackerDegara
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsBeatTrackerDegara) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
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
*/
class BeatTrackerMultiFeature {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsBeatTrackerMultiFeature = {
    maxTempo: 208,
    minTempo: 40,
  };
  private params: paramTypes.ParamsBeatTrackerMultiFeature = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsBeatTrackerMultiFeature} [params]
  */
  constructor(params: paramTypes.ParamsBeatTrackerMultiFeature) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.BeatTrackerMultiFeature(this.params.maxTempo, this.params.minTempo);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsBeatTrackerMultiFeature} [params]
   * @memberof BeatTrackerMultiFeature
  */
  configure(params: paramTypes.ParamsBeatTrackerMultiFeature) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.maxTempo, this.params.minTempo);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the audio input signal
   * @returns {object} {ticks: ' the estimated tick locations [s]', confidence: 'confidence of the beat tracker [0, 5.32]'}
   * @memberof BeatTrackerMultiFeature
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof BeatTrackerMultiFeature
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsBeatTrackerMultiFeature) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm filters the loudness matrix given by BeatsLoudness algorithm in order to keep only the most salient beat band representation.
This algorithm has been found to be useful for estimating time signatures. Check https://essentia.upf.edu/reference/std_Beatogram.html for more details.
* @class
*/
class Beatogram {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsBeatogram = {
    size: 16,
  };
  private params: paramTypes.ParamsBeatogram = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsBeatogram} [params]
  */
  constructor(params: paramTypes.ParamsBeatogram) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Beatogram(this.params.size);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsBeatogram} [params]
   * @memberof Beatogram
  */
  configure(params: paramTypes.ParamsBeatogram) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.size);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} loudness the loudness at each beat
   * @param {VectorVectorFloat} loudnessBandRatio matrix of loudness ratios at each band and beat
   * @returns {object} {beatogram: 'filtered matrix loudness'}
   * @memberof Beatogram
  */
  compute(loudness: any, loudnessBandRatio: any) {
    return this.algoInstance.compute(loudness, loudnessBandRatio);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Beatogram
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsBeatogram) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the spectrum energy of beats in an audio signal given their positions. The energy is computed both on the whole frequency range and for each of the specified frequency bands. See the SingleBeatLoudness algorithm for a more detailed explanation. Check https://essentia.upf.edu/reference/std_BeatsLoudness.html for more details.
* @class
*/
class BeatsLoudness {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsBeatsLoudness = {
    beatDuration: 0.05,
    beatWindowDuration: 0.1,
    beats: arrayToVector([]),
    frequencyBands: arrayToVector([20, 150, 400, 3200, 7000, 22000]),
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsBeatsLoudness = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsBeatsLoudness} [params]
  */
  constructor(params: paramTypes.ParamsBeatsLoudness) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.BeatsLoudness(this.params.beatDuration, this.params.beatWindowDuration, this.params.beats, this.params.frequencyBands, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsBeatsLoudness} [params]
   * @memberof BeatsLoudness
  */
  configure(params: paramTypes.ParamsBeatsLoudness) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.beatDuration, this.params.beatWindowDuration, this.params.beats, this.params.frequencyBands, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input audio signal
   * @returns {object} {loudness: 'the beat's energy in the whole spectrum', loudnessBandRatio: 'the ratio of the beat's energy on each frequency band'}
   * @memberof BeatsLoudness
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof BeatsLoudness
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsBeatsLoudness) {
    if (!params) return;
    if (params.beats) {
      params.beats = arrayToVector(params.beats);
    }
    if (params.frequencyBands) {
      params.frequencyBands = arrayToVector(params.frequencyBands);
    }
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm performs basic arithmetical operations element by element given two arrays.
Note:
  - using this algorithm in streaming mode can cause diamond shape graphs which have not been tested with the current scheduler. There is NO GUARANTEE of its correct work for diamond shape graphs.
  - for y=0, x/y is invalid Check https://essentia.upf.edu/reference/std_BinaryOperator.html for more details.
* @class
*/
class BinaryOperator {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsBinaryOperator = {
    type: 'add',
  };
  private params: paramTypes.ParamsBinaryOperator = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsBinaryOperator} [params]
  */
  constructor(params: paramTypes.ParamsBinaryOperator) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.BinaryOperator(this.params.type);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsBinaryOperator} [params]
   * @memberof BinaryOperator
  */
  configure(params: paramTypes.ParamsBinaryOperator) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.type);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array1 the first operand input array
   * @param {VectorFloat} array2 the second operand input array
   * @returns {object} {array: 'the array containing the result of binary operation'}
   * @memberof BinaryOperator
  */
  compute(array1: any, array2: any) {
    return this.algoInstance.compute(array1, array2);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof BinaryOperator
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsBinaryOperator) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm performs basic arithmetical operations element by element given two arrays.
Note:
  - using this algorithm in streaming mode can cause diamond shape graphs which have not been tested with the current scheduler. There is NO GUARANTEE of its correct work for diamond shape graphs.
  - for y=0, x/y is invalid Check https://essentia.upf.edu/reference/std_BinaryOperatorStream.html for more details.
* @class
*/
class BinaryOperatorStream {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsBinaryOperatorStream = {
    type: 'add',
  };
  private params: paramTypes.ParamsBinaryOperatorStream = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsBinaryOperatorStream} [params]
  */
  constructor(params: paramTypes.ParamsBinaryOperatorStream) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.BinaryOperatorStream(this.params.type);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsBinaryOperatorStream} [params]
   * @memberof BinaryOperatorStream
  */
  configure(params: paramTypes.ParamsBinaryOperatorStream) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.type);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array1 the first operand input array
   * @param {VectorFloat} array2 the second operand input array
   * @returns {object} {array: 'the array containing the result of binary operation'}
   * @memberof BinaryOperatorStream
  */
  compute(array1: any, array2: any) {
    return this.algoInstance.compute(array1, array2);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof BinaryOperatorStream
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsBinaryOperatorStream) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes beats per minute histogram and its statistics for the highest and second highest peak.
Note: histogram vector contains occurance frequency for each bpm value, 0-th element corresponds to 0 bpm value. Check https://essentia.upf.edu/reference/std_BpmHistogramDescriptors.html for more details.
* @class
*/
class BpmHistogramDescriptors {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsBpmHistogramDescriptors} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.BpmHistogramDescriptors();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsBpmHistogramDescriptors} [params]
   * @memberof BpmHistogramDescriptors
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} bpmIntervals the list of bpm intervals [s]
   * @returns {object} {firstPeakBPM: 'value for the highest peak [bpm]', firstPeakWeight: 'weight of the highest peak', firstPeakSpread: 'spread of the highest peak', secondPeakBPM: 'value for the second highest peak [bpm]', secondPeakWeight: 'weight of the second highest peak', secondPeakSpread: 'spread of the second highest peak', histogram: 'bpm histogram [bpm]'}
   * @memberof BpmHistogramDescriptors
  */
  compute(bpmIntervals: any) {
    return this.algoInstance.compute(bpmIntervals);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof BpmHistogramDescriptors
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm extracts the locations of large tempo changes from a list of beat ticks. Check https://essentia.upf.edu/reference/std_BpmRubato.html for more details.
* @class
*/
class BpmRubato {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsBpmRubato = {
    longRegionsPruningTime: 20,
    shortRegionsMergingTime: 4,
    tolerance: 0.08,
  };
  private params: paramTypes.ParamsBpmRubato = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsBpmRubato} [params]
  */
  constructor(params: paramTypes.ParamsBpmRubato) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.BpmRubato(this.params.longRegionsPruningTime, this.params.shortRegionsMergingTime, this.params.tolerance);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsBpmRubato} [params]
   * @memberof BpmRubato
  */
  configure(params: paramTypes.ParamsBpmRubato) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.longRegionsPruningTime, this.params.shortRegionsMergingTime, this.params.tolerance);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} beats list of detected beat ticks [s]
   * @returns {object} {rubatoStart: 'list of timestamps where the start of a rubato region was detected [s]', rubatoStop: 'list of timestamps where the end of a rubato region was detected [s]', rubatoNumber: 'number of detected rubato regions'}
   * @memberof BpmRubato
  */
  compute(beats: any) {
    return this.algoInstance.compute(beats);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof BpmRubato
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsBpmRubato) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm extracts the 0th, 1st, 2nd, 3rd and 4th central moments of an array. It returns a 5-tuple in which the index corresponds to the order of the moment. Check https://essentia.upf.edu/reference/std_CentralMoments.html for more details.
* @class
*/
class CentralMoments {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsCentralMoments = {
    mode: 'pdf',
    range: 1,
  };
  private params: paramTypes.ParamsCentralMoments = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsCentralMoments} [params]
  */
  constructor(params: paramTypes.ParamsCentralMoments) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.CentralMoments(this.params.mode, this.params.range);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsCentralMoments} [params]
   * @memberof CentralMoments
  */
  configure(params: paramTypes.ParamsCentralMoments) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.mode, this.params.range);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {centralMoments: 'the central moments of the input array'}
   * @memberof CentralMoments
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof CentralMoments
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsCentralMoments) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the centroid of an array. The centroid is normalized to a specified range. This algorithm can be used to compute spectral centroid or temporal centroid. Check https://essentia.upf.edu/reference/std_Centroid.html for more details.
* @class
*/
class Centroid {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsCentroid = {
    range: 1,
  };
  private params: paramTypes.ParamsCentroid = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsCentroid} [params]
  */
  constructor(params: paramTypes.ParamsCentroid) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Centroid(this.params.range);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsCentroid} [params]
   * @memberof Centroid
  */
  configure(params: paramTypes.ParamsCentroid) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.range);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {centroid: 'the centroid of the array'}
   * @memberof Centroid
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Centroid
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsCentroid) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* Given a chord progression this algorithm describes it by means of key, scale, histogram, and rate of change.
Note:
  - chordsHistogram indexes follow the circle of fifths order, while being shifted to the input key and scale
  - key and scale are taken from the most frequent chord. In the case where multiple chords are equally frequent, the chord is hierarchically chosen from the circle of fifths.
  - chords should follow this name convention `<A-G>[<#/b><m>]` (i.e. C, C# or C#m are valid chords). Chord names not fitting this convention will throw an exception. Check https://essentia.upf.edu/reference/std_ChordsDescriptors.html for more details.
* @class
*/
class ChordsDescriptors {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsChordsDescriptors} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.ChordsDescriptors();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsChordsDescriptors} [params]
   * @memberof ChordsDescriptors
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorString} chords the chord progression
   * @param {string} key the key of the whole song, from A to G
   * @param {string} scale the scale of the whole song (major or minor)
   * @returns {object} {chordsHistogram: 'the normalized histogram of chords', chordsNumberRate: 'the ratio of different chords from the total number of chords in the progression', chordsChangesRate: 'the rate at which chords change in the progression', chordsKey: 'the most frequent chord of the progression', chordsScale: 'the scale of the most frequent chord of the progression (either 'major' or 'minor')'}
   * @memberof ChordsDescriptors
  */
  compute(chords: any, key: string, scale: string) {
    return this.algoInstance.compute(chords, key, scale);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof ChordsDescriptors
  */
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
*/
class ChordsDetection {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsChordsDetection = {
    hopSize: 2048,
    sampleRate: 44100,
    windowSize: 2,
  };
  private params: paramTypes.ParamsChordsDetection = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsChordsDetection} [params]
  */
  constructor(params: paramTypes.ParamsChordsDetection) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.ChordsDetection(this.params.hopSize, this.params.sampleRate, this.params.windowSize);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsChordsDetection} [params]
   * @memberof ChordsDetection
  */
  configure(params: paramTypes.ParamsChordsDetection) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.hopSize, this.params.sampleRate, this.params.windowSize);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} pcp the pitch class profile from which to detect the chord
   * @returns {object} {chords: 'the resulting chords, from A to G', strength: 'the strength of the chord'}
   * @memberof ChordsDetection
  */
  compute(pcp: any) {
    return this.algoInstance.compute(pcp);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof ChordsDetection
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsChordsDetection) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates chords using pitch profile classes on segments between beats. It is similar to ChordsDetection algorithm, but the chords are estimated on audio segments between each pair of consecutive beats. For each segment the estimation is done based on a chroma (HPCP) vector characterizing it, which can be computed by two methods:
  - 'interbeat_median', each resulting chroma vector component is a median of all the component values in the segment
  - 'starting_beat', chroma vector is sampled from the start of the segment (that is, its starting beat position) using its first frame. It makes sense if chroma is preliminary smoothed. Check https://essentia.upf.edu/reference/std_ChordsDetectionBeats.html for more details.
* @class
*/
class ChordsDetectionBeats {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsChordsDetectionBeats = {
    chromaPick: 'interbeat_median',
    hopSize: 2048,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsChordsDetectionBeats = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsChordsDetectionBeats} [params]
  */
  constructor(params: paramTypes.ParamsChordsDetectionBeats) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.ChordsDetectionBeats(this.params.chromaPick, this.params.hopSize, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsChordsDetectionBeats} [params]
   * @memberof ChordsDetectionBeats
  */
  configure(params: paramTypes.ParamsChordsDetectionBeats) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.chromaPick, this.params.hopSize, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} pcp the pitch class profile from which to detect the chord
   * @param {VectorFloat} ticks the list of beat positions (in seconds). One chord will be outputted for each segment between two adjacent ticks. If number of ticks is smaller than 2, exception will be thrown. Those ticks that exceeded the pcp time length will be ignored.
   * @returns {object} {chords: 'the resulting chords, from A to G', strength: 'the strength of the chords'}
   * @memberof ChordsDetectionBeats
  */
  compute(pcp: any, ticks: any) {
    return this.algoInstance.compute(pcp, ticks);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof ChordsDetectionBeats
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsChordsDetectionBeats) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes a binary cross similarity matrix from two chromagam feature vectors of a query and reference song. Check https://essentia.upf.edu/reference/std_ChromaCrossSimilarity.html for more details.
* @class
*/
class ChromaCrossSimilarity {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsChromaCrossSimilarity = {
    binarizePercentile: 0.095,
    frameStackSize: 9,
    frameStackStride: 1,
    noti: 12,
    oti: true,
    otiBinary: false,
    streaming: false,
  };
  private params: paramTypes.ParamsChromaCrossSimilarity = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsChromaCrossSimilarity} [params]
  */
  constructor(params: paramTypes.ParamsChromaCrossSimilarity) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.ChromaCrossSimilarity(this.params.binarizePercentile, this.params.frameStackSize, this.params.frameStackStride, this.params.noti, this.params.oti, this.params.otiBinary, this.params.streaming);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsChromaCrossSimilarity} [params]
   * @memberof ChromaCrossSimilarity
  */
  configure(params: paramTypes.ParamsChromaCrossSimilarity) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binarizePercentile, this.params.frameStackSize, this.params.frameStackStride, this.params.noti, this.params.oti, this.params.otiBinary, this.params.streaming);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} queryFeature frame-wise chromagram of the query song (e.g., a HPCP)
   * @param {VectorVectorFloat} referenceFeature frame-wise chromagram of the reference song (e.g., a HPCP)
   * @returns {object} {csm: '2D binary cross-similarity matrix of the query and reference features'}
   * @memberof ChromaCrossSimilarity
  */
  compute(queryFeature: any, referenceFeature: any) {
    return this.algoInstance.compute(queryFeature, referenceFeature);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof ChromaCrossSimilarity
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsChromaCrossSimilarity) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the Constant-Q chromagram using FFT. See ConstantQ algorithm for more details.
 Check https://essentia.upf.edu/reference/std_Chromagram.html for more details.
* @class
*/
class Chromagram {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsChromagram = {
    binsPerOctave: 12,
    minFrequency: 32.7,
    minimumKernelSize: 4,
    normalizeType: 'unit_max',
    numberBins: 84,
    sampleRate: 44100,
    scale: 1,
    threshold: 0.01,
    windowType: 'hann',
    zeroPhase: true,
  };
  private params: paramTypes.ParamsChromagram = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsChromagram} [params]
  */
  constructor(params: paramTypes.ParamsChromagram) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Chromagram(this.params.binsPerOctave, this.params.minFrequency, this.params.minimumKernelSize, this.params.normalizeType, this.params.numberBins, this.params.sampleRate, this.params.scale, this.params.threshold, this.params.windowType, this.params.zeroPhase);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsChromagram} [params]
   * @memberof Chromagram
  */
  configure(params: paramTypes.ParamsChromagram) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binsPerOctave, this.params.minFrequency, this.params.minimumKernelSize, this.params.normalizeType, this.params.numberBins, this.params.sampleRate, this.params.scale, this.params.threshold, this.params.windowType, this.params.zeroPhase);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input audio frame
   * @returns {object} {chromagram: 'the magnitude constant-Q chromagram'}
   * @memberof Chromagram
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Chromagram
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsChromagram) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm detects the locations of impulsive noises (clicks and pops) on the input audio frame. It relies on LPC coefficients to inverse-filter the audio in order to attenuate the stationary part and enhance the prediction error (or excitation noise)[1]. After this, a matched filter is used to further enhance the impulsive peaks. The detection threshold is obtained from a robust estimate of the excitation noise power [2] plus a parametric gain value. Check https://essentia.upf.edu/reference/std_ClickDetector.html for more details.
* @class
*/
class ClickDetector {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsClickDetector = {
    detectionThreshold: 30,
    frameSize: 512,
    hopSize: 256,
    order: 12,
    powerEstimationThreshold: 10,
    sampleRate: 44100,
    silenceThreshold: -50,
  };
  private params: paramTypes.ParamsClickDetector = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsClickDetector} [params]
  */
  constructor(params: paramTypes.ParamsClickDetector) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.ClickDetector(this.params.detectionThreshold, this.params.frameSize, this.params.hopSize, this.params.order, this.params.powerEstimationThreshold, this.params.sampleRate, this.params.silenceThreshold);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsClickDetector} [params]
   * @memberof ClickDetector
  */
  configure(params: paramTypes.ParamsClickDetector) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.detectionThreshold, this.params.frameSize, this.params.hopSize, this.params.order, this.params.powerEstimationThreshold, this.params.sampleRate, this.params.silenceThreshold);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input frame (must be non-empty)
   * @returns {object} {starts: 'starting indexes of the clicks', ends: 'ending indexes of the clicks'}
   * @memberof ClickDetector
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof ClickDetector
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsClickDetector) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm clips the input signal to fit its values into a specified interval. Check https://essentia.upf.edu/reference/std_Clipper.html for more details.
* @class
*/
class Clipper {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsClipper = {
    max: 1,
    min: -1,
  };
  private params: paramTypes.ParamsClipper = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsClipper} [params]
  */
  constructor(params: paramTypes.ParamsClipper) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Clipper(this.params.max, this.params.min);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsClipper} [params]
   * @memberof Clipper
  */
  configure(params: paramTypes.ParamsClipper) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.max, this.params.min);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {signal: 'the output signal with the added noise'}
   * @memberof Clipper
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Clipper
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsClipper) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes a cover song similiarity measure from a binary cross similarity matrix input between two chroma vectors of a query and reference song using various alignment constraints of smith-waterman local-alignment algorithm. Check https://essentia.upf.edu/reference/std_CoverSongSimilarity.html for more details.
* @class
*/
class CoverSongSimilarity {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsCoverSongSimilarity = {
    alignmentType: 'serra09',
    disExtension: 0.5,
    disOnset: 0.5,
    distanceType: 'asymmetric',
  };
  private params: paramTypes.ParamsCoverSongSimilarity = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsCoverSongSimilarity} [params]
  */
  constructor(params: paramTypes.ParamsCoverSongSimilarity) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.CoverSongSimilarity(this.params.alignmentType, this.params.disExtension, this.params.disOnset, this.params.distanceType);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsCoverSongSimilarity} [params]
   * @memberof CoverSongSimilarity
  */
  configure(params: paramTypes.ParamsCoverSongSimilarity) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.alignmentType, this.params.disExtension, this.params.disOnset, this.params.distanceType);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} inputArray  a 2D binary cross-similarity matrix between two audio chroma vectors (query vs reference song) (refer 'ChromaCrossSimilarity' algorithm').
   * @returns {object} {scoreMatrix: 'a 2D smith-waterman alignment score matrix from the input binary cross-similarity matrix', distance: 'cover song similarity distance between the query and reference song from the input similarity matrix. Either 'asymmetric' (as described in [2]) or 'symmetric' (maximum score in the alignment score matrix).'}
   * @memberof CoverSongSimilarity
  */
  compute(inputArray: any) {
    return this.algoInstance.compute(inputArray);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof CoverSongSimilarity
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsCoverSongSimilarity) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the crest of an array. The crest is defined as the ratio between the maximum value and the arithmetic mean of an array. Typically it is used on the magnitude spectrum. Check https://essentia.upf.edu/reference/std_Crest.html for more details.
* @class
*/
class Crest {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsCrest} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.Crest();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsCrest} [params]
   * @memberof Crest
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array (cannot contain negative values, and must be non-empty)
   * @returns {object} {crest: 'the crest of the input array'}
   * @memberof Crest
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Crest
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the cross-correlation vector of two signals. It accepts 2 parameters, minLag and maxLag which define the range of the computation of the innerproduct. Check https://essentia.upf.edu/reference/std_CrossCorrelation.html for more details.
* @class
*/
class CrossCorrelation {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsCrossCorrelation = {
    maxLag: 1,
    minLag: 0,
  };
  private params: paramTypes.ParamsCrossCorrelation = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsCrossCorrelation} [params]
  */
  constructor(params: paramTypes.ParamsCrossCorrelation) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.CrossCorrelation(this.params.maxLag, this.params.minLag);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsCrossCorrelation} [params]
   * @memberof CrossCorrelation
  */
  configure(params: paramTypes.ParamsCrossCorrelation) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.maxLag, this.params.minLag);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} arrayX the first input array
   * @param {VectorFloat} arrayY the second input array
   * @returns {object} {crossCorrelation: 'the cross-correlation vector between the two input arrays (its size is equal to maxLag - minLag + 1)'}
   * @memberof CrossCorrelation
  */
  compute(arrayX: any, arrayY: any) {
    return this.algoInstance.compute(arrayX, arrayY);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof CrossCorrelation
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsCrossCorrelation) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes a euclidean cross-similarity matrix of two sequences of frame features. Similarity values can be optionally binarized Check https://essentia.upf.edu/reference/std_CrossSimilarityMatrix.html for more details.
* @class
*/
class CrossSimilarityMatrix {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsCrossSimilarityMatrix = {
    binarize: false,
    binarizePercentile: 0.095,
    frameStackSize: 1,
    frameStackStride: 1,
  };
  private params: paramTypes.ParamsCrossSimilarityMatrix = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsCrossSimilarityMatrix} [params]
  */
  constructor(params: paramTypes.ParamsCrossSimilarityMatrix) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.CrossSimilarityMatrix(this.params.binarize, this.params.binarizePercentile, this.params.frameStackSize, this.params.frameStackStride);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsCrossSimilarityMatrix} [params]
   * @memberof CrossSimilarityMatrix
  */
  configure(params: paramTypes.ParamsCrossSimilarityMatrix) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binarize, this.params.binarizePercentile, this.params.frameStackSize, this.params.frameStackStride);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} queryFeature input frame features of the query song (e.g., a chromagram)
   * @param {VectorVectorFloat} referenceFeature input frame features of the reference song (e.g., a chromagram)
   * @returns {object} {csm: '2D cross-similarity matrix of two input frame sequences (query vs reference)'}
   * @memberof CrossSimilarityMatrix
  */
  compute(queryFeature: any, referenceFeature: any) {
    return this.algoInstance.compute(queryFeature, referenceFeature);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof CrossSimilarityMatrix
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsCrossSimilarityMatrix) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
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
*/
class CubicSpline {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsCubicSpline = {
    leftBoundaryFlag: 0,
    leftBoundaryValue: 0,
    rightBoundaryFlag: 0,
    rightBoundaryValue: 0,
    xPoints: arrayToVector([0, 1]),
    yPoints: arrayToVector([0, 1]),
  };
  private params: paramTypes.ParamsCubicSpline = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsCubicSpline} [params]
  */
  constructor(params: paramTypes.ParamsCubicSpline) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.CubicSpline(this.params.leftBoundaryFlag, this.params.leftBoundaryValue, this.params.rightBoundaryFlag, this.params.rightBoundaryValue, this.params.xPoints, this.params.yPoints);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsCubicSpline} [params]
   * @memberof CubicSpline
  */
  configure(params: paramTypes.ParamsCubicSpline) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.leftBoundaryFlag, this.params.leftBoundaryValue, this.params.rightBoundaryFlag, this.params.rightBoundaryValue, this.params.xPoints, this.params.yPoints);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {number} x the input coordinate (x-axis)
   * @returns {object} {y: 'the value of the spline at x', dy: 'the first derivative of the spline at x', ddy: 'the second derivative of the spline at x'}
   * @memberof CubicSpline
  */
  compute(x: number) {
    return this.algoInstance.compute(x);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof CubicSpline
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsCubicSpline) {
    if (!params) return;
    if (params.xPoints) {
      params.xPoints = arrayToVector(params.xPoints);
    }
    if (params.yPoints) {
      params.yPoints = arrayToVector(params.yPoints);
    }
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm removes the DC offset from a signal using a 1st order IIR highpass filter. Because of its dependence on IIR, IIR's requirements are inherited. Check https://essentia.upf.edu/reference/std_DCRemoval.html for more details.
* @class
*/
class DCRemoval {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsDCRemoval = {
    cutoffFrequency: 40,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsDCRemoval = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsDCRemoval} [params]
  */
  constructor(params: paramTypes.ParamsDCRemoval) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.DCRemoval(this.params.cutoffFrequency, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsDCRemoval} [params]
   * @memberof DCRemoval
  */
  configure(params: paramTypes.ParamsDCRemoval) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.cutoffFrequency, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input audio signal
   * @returns {object} {signal: 'the filtered signal, with the DC component removed'}
   * @memberof DCRemoval
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof DCRemoval
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsDCRemoval) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the Discrete Cosine Transform of an array.
It uses the DCT-II form, with the 1/sqrt(2) scaling factor for the first coefficient. Check https://essentia.upf.edu/reference/std_DCT.html for more details.
* @class
*/
class DCT {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsDCT = {
    dctType: 2,
    inputSize: 10,
    liftering: 0,
    outputSize: 10,
  };
  private params: paramTypes.ParamsDCT = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsDCT} [params]
  */
  constructor(params: paramTypes.ParamsDCT) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.DCT(this.params.dctType, this.params.inputSize, this.params.liftering, this.params.outputSize);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsDCT} [params]
   * @memberof DCT
  */
  configure(params: paramTypes.ParamsDCT) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.dctType, this.params.inputSize, this.params.liftering, this.params.outputSize);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {dct: 'the discrete cosine transform of the input array'}
   * @memberof DCT
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof DCT
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsDCT) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates danceability of a given audio signal. The algorithm is derived from Detrended Fluctuation Analysis (DFA) described in [1]. The parameters minTau and maxTau are used to define the range of time over which DFA will be performed. The output of this algorithm is the danceability of the audio signal. These values usually range from 0 to 3 (higher values meaning more danceable). Check https://essentia.upf.edu/reference/std_Danceability.html for more details.
* @class
*/
class Danceability {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsDanceability = {
    maxTau: 8800,
    minTau: 310,
    sampleRate: 44100,
    tauMultiplier: 1.1,
  };
  private params: paramTypes.ParamsDanceability = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsDanceability} [params]
  */
  constructor(params: paramTypes.ParamsDanceability) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Danceability(this.params.maxTau, this.params.minTau, this.params.sampleRate, this.params.tauMultiplier);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsDanceability} [params]
   * @memberof Danceability
  */
  configure(params: paramTypes.ParamsDanceability) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.maxTau, this.params.minTau, this.params.sampleRate, this.params.tauMultiplier);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {danceability: 'the danceability value. Normal values range from 0 to ~3. The higher, the more danceable.', dfa: 'the DFA exponent vector for considered segment length (tau) values'}
   * @memberof Danceability
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Danceability
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsDanceability) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the decrease of an array defined as the linear regression coefficient. The range parameter is used to normalize the result. For a spectral centroid, the range should be equal to Nyquist and for an audio centroid the range should be equal to (audiosize - 1) / samplerate.
The size of the input array must be at least two elements for "decrease" to be computed, otherwise an exception is thrown.
References:
  [1] Least Squares Fitting -- from Wolfram MathWorld,
  http://mathworld.wolfram.com/LeastSquaresFitting.html Check https://essentia.upf.edu/reference/std_Decrease.html for more details.
* @class
*/
class Decrease {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsDecrease = {
    range: 1,
  };
  private params: paramTypes.ParamsDecrease = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsDecrease} [params]
  */
  constructor(params: paramTypes.ParamsDecrease) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Decrease(this.params.range);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsDecrease} [params]
   * @memberof Decrease
  */
  configure(params: paramTypes.ParamsDecrease) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.range);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {decrease: 'the decrease of the input array'}
   * @memberof Decrease
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Decrease
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsDecrease) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm returns the first-order derivative of an input signal. That is, for each input value it returns the value minus the previous one. Check https://essentia.upf.edu/reference/std_Derivative.html for more details.
* @class
*/
class Derivative {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsDerivative} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.Derivative();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsDerivative} [params]
   * @memberof Derivative
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {signal: 'the derivative of the input signal'}
   * @memberof Derivative
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Derivative
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes two descriptors that are based on the derivative of a signal envelope. Check https://essentia.upf.edu/reference/std_DerivativeSFX.html for more details.
* @class
*/
class DerivativeSFX {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsDerivativeSFX} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.DerivativeSFX();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsDerivativeSFX} [params]
   * @memberof DerivativeSFX
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} envelope the envelope of the signal
   * @returns {object} {derAvAfterMax: 'the weighted average of the derivative after the maximum amplitude', maxDerBeforeMax: 'the maximum derivative before the maximum amplitude'}
   * @memberof DerivativeSFX
  */
  compute(envelope: any) {
    return this.algoInstance.compute(envelope);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof DerivativeSFX
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm uses LPC and some heuristics to detect discontinuities in an audio signal. [1]. Check https://essentia.upf.edu/reference/std_DiscontinuityDetector.html for more details.
* @class
*/
class DiscontinuityDetector {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsDiscontinuityDetector = {
    detectionThreshold: 8,
    energyThreshold: -60,
    frameSize: 512,
    hopSize: 256,
    kernelSize: 7,
    order: 3,
    silenceThreshold: -50,
    subFrameSize: 32,
  };
  private params: paramTypes.ParamsDiscontinuityDetector = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsDiscontinuityDetector} [params]
  */
  constructor(params: paramTypes.ParamsDiscontinuityDetector) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.DiscontinuityDetector(this.params.detectionThreshold, this.params.energyThreshold, this.params.frameSize, this.params.hopSize, this.params.kernelSize, this.params.order, this.params.silenceThreshold, this.params.subFrameSize);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsDiscontinuityDetector} [params]
   * @memberof DiscontinuityDetector
  */
  configure(params: paramTypes.ParamsDiscontinuityDetector) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.detectionThreshold, this.params.energyThreshold, this.params.frameSize, this.params.hopSize, this.params.kernelSize, this.params.order, this.params.silenceThreshold, this.params.subFrameSize);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input frame (must be non-empty)
   * @returns {object} {discontinuityLocations: 'the index of the detected discontinuities (if any)', discontinuityAmplitudes: 'the peak values of the prediction error for the discontinuities (if any)'}
   * @memberof DiscontinuityDetector
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof DiscontinuityDetector
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsDiscontinuityDetector) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
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
*/
class Dissonance {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsDissonance} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.Dissonance();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsDissonance} [params]
   * @memberof Dissonance
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frequencies the frequencies of the spectral peaks (must be sorted by frequency)
   * @param {VectorFloat} magnitudes the magnitudes of the spectral peaks (must be sorted by frequency
   * @returns {object} {dissonance: 'the dissonance of the audio signal (0 meaning completely consonant, and 1 meaning completely dissonant)'}
   * @memberof Dissonance
  */
  compute(frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(frequencies, magnitudes);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Dissonance
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the spread (variance), skewness and kurtosis of an array given its central moments. The extracted features are good indicators of the shape of the distribution. For the required input see CentralMoments algorithm.
The size of the input array must be at least 5. An exception will be thrown otherwise. Check https://essentia.upf.edu/reference/std_DistributionShape.html for more details.
* @class
*/
class DistributionShape {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsDistributionShape} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.DistributionShape();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsDistributionShape} [params]
   * @memberof DistributionShape
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} centralMoments the central moments of a distribution
   * @returns {object} {spread: 'the spread (variance) of the distribution', skewness: 'the skewness of the distribution', kurtosis: 'the kurtosis of the distribution'}
   * @memberof DistributionShape
  */
  compute(centralMoments: any) {
    return this.algoInstance.compute(centralMoments);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof DistributionShape
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm outputs the total duration of an audio signal. Check https://essentia.upf.edu/reference/std_Duration.html for more details.
* @class
*/
class Duration {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsDuration = {
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsDuration = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsDuration} [params]
  */
  constructor(params: paramTypes.ParamsDuration) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Duration(this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsDuration} [params]
   * @memberof Duration
  */
  configure(params: paramTypes.ParamsDuration) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {duration: 'the duration of the signal [s]'}
   * @memberof Duration
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Duration
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsDuration) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the dynamic complexity defined as the average absolute deviation from the global loudness level estimate on the dB scale. It is related to the dynamic range and to the amount of fluctuation in loudness present in a recording. Silence at the beginning and at the end of a track are ignored in the computation in order not to deteriorate the results. Check https://essentia.upf.edu/reference/std_DynamicComplexity.html for more details.
* @class
*/
class DynamicComplexity {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsDynamicComplexity = {
    frameSize: 0.2,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsDynamicComplexity = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsDynamicComplexity} [params]
  */
  constructor(params: paramTypes.ParamsDynamicComplexity) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.DynamicComplexity(this.params.frameSize, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsDynamicComplexity} [params]
   * @memberof DynamicComplexity
  */
  configure(params: paramTypes.ParamsDynamicComplexity) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input audio signal
   * @returns {object} {dynamicComplexity: 'the dynamic complexity coefficient', loudness: 'an estimate of the loudness [dB]'}
   * @memberof DynamicComplexity
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof DynamicComplexity
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsDynamicComplexity) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes energies/magnitudes in ERB bands of a spectrum. The Equivalent Rectangular Bandwidth (ERB) scale is used. The algorithm applies a frequency domain filterbank using gammatone filters. Adapted from matlab code in:  D. P. W. Ellis (2009). 'Gammatone-like spectrograms', web resource [1]. Check https://essentia.upf.edu/reference/std_ERBBands.html for more details.
* @class
*/
class ERBBands {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsERBBands = {
    highFrequencyBound: 22050,
    inputSize: 1025,
    lowFrequencyBound: 50,
    numberBands: 40,
    sampleRate: 44100,
    type: 'power',
    width: 1,
  };
  private params: paramTypes.ParamsERBBands = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsERBBands} [params]
  */
  constructor(params: paramTypes.ParamsERBBands) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.ERBBands(this.params.highFrequencyBound, this.params.inputSize, this.params.lowFrequencyBound, this.params.numberBands, this.params.sampleRate, this.params.type, this.params.width);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsERBBands} [params]
   * @memberof ERBBands
  */
  configure(params: paramTypes.ParamsERBBands) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.highFrequencyBound, this.params.inputSize, this.params.lowFrequencyBound, this.params.numberBands, this.params.sampleRate, this.params.type, this.params.width);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the audio spectrum
   * @returns {object} {bands: 'the energies/magnitudes of each band'}
   * @memberof ERBBands
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof ERBBands
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsERBBands) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
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
*/
class EffectiveDuration {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsEffectiveDuration = {
    sampleRate: 44100,
    thresholdRatio: 0.4,
  };
  private params: paramTypes.ParamsEffectiveDuration = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsEffectiveDuration} [params]
  */
  constructor(params: paramTypes.ParamsEffectiveDuration) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.EffectiveDuration(this.params.sampleRate, this.params.thresholdRatio);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsEffectiveDuration} [params]
   * @memberof EffectiveDuration
  */
  configure(params: paramTypes.ParamsEffectiveDuration) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.sampleRate, this.params.thresholdRatio);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {effectiveDuration: 'the effective duration of the signal [s]'}
   * @memberof EffectiveDuration
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof EffectiveDuration
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsEffectiveDuration) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the energy of an array. Check https://essentia.upf.edu/reference/std_Energy.html for more details.
* @class
*/
class Energy {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsEnergy} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.Energy();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsEnergy} [params]
   * @memberof Energy
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {energy: 'the energy of the input array'}
   * @memberof Energy
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Energy
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes energy in a given frequency band of a spectrum including both start and stop cutoff frequencies.
Note that exceptions will be thrown when input spectrum is empty and if startCutoffFrequency is greater than stopCutoffFrequency. Check https://essentia.upf.edu/reference/std_EnergyBand.html for more details.
* @class
*/
class EnergyBand {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsEnergyBand = {
    sampleRate: 44100,
    startCutoffFrequency: 0,
    stopCutoffFrequency: 100,
  };
  private params: paramTypes.ParamsEnergyBand = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsEnergyBand} [params]
  */
  constructor(params: paramTypes.ParamsEnergyBand) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.EnergyBand(this.params.sampleRate, this.params.startCutoffFrequency, this.params.stopCutoffFrequency);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsEnergyBand} [params]
   * @memberof EnergyBand
  */
  configure(params: paramTypes.ParamsEnergyBand) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.sampleRate, this.params.startCutoffFrequency, this.params.stopCutoffFrequency);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input frequency spectrum
   * @returns {object} {energyBand: 'the energy in the frequency band'}
   * @memberof EnergyBand
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof EnergyBand
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsEnergyBand) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the ratio of the spectral energy in the range [startFrequency, stopFrequency] over the total energy. Check https://essentia.upf.edu/reference/std_EnergyBandRatio.html for more details.
* @class
*/
class EnergyBandRatio {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsEnergyBandRatio = {
    sampleRate: 44100,
    startFrequency: 0,
    stopFrequency: 100,
  };
  private params: paramTypes.ParamsEnergyBandRatio = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsEnergyBandRatio} [params]
  */
  constructor(params: paramTypes.ParamsEnergyBandRatio) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.EnergyBandRatio(this.params.sampleRate, this.params.startFrequency, this.params.stopFrequency);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsEnergyBandRatio} [params]
   * @memberof EnergyBandRatio
  */
  configure(params: paramTypes.ParamsEnergyBandRatio) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.sampleRate, this.params.startFrequency, this.params.stopFrequency);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input audio spectrum
   * @returns {object} {energyBandRatio: 'the energy ratio of the specified band over the total energy'}
   * @memberof EnergyBandRatio
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof EnergyBandRatio
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsEnergyBandRatio) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the Shannon entropy of an array. Entropy can be used to quantify the peakiness of a distribution. This has been used for voiced/unvoiced decision in automatic speech recognition.  Check https://essentia.upf.edu/reference/std_Entropy.html for more details.
* @class
*/
class Entropy {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsEntropy} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.Entropy();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsEntropy} [params]
   * @memberof Entropy
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array (cannot contain negative values, and must be non-empty)
   * @returns {object} {entropy: 'the entropy of the input array'}
   * @memberof Entropy
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Entropy
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the envelope of a signal by applying a non-symmetric lowpass filter on a signal. By default it rectifies the signal, but that is optional. Check https://essentia.upf.edu/reference/std_Envelope.html for more details.
* @class
*/
class Envelope {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsEnvelope = {
    applyRectification: true,
    attackTime: 10,
    releaseTime: 1500,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsEnvelope = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsEnvelope} [params]
  */
  constructor(params: paramTypes.ParamsEnvelope) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Envelope(this.params.applyRectification, this.params.attackTime, this.params.releaseTime, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsEnvelope} [params]
   * @memberof Envelope
  */
  configure(params: paramTypes.ParamsEnvelope) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.applyRectification, this.params.attackTime, this.params.releaseTime, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {signal: 'the resulting envelope of the signal'}
   * @memberof Envelope
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Envelope
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsEnvelope) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm implements an equal-loudness filter. The human ear does not perceive sounds of all frequencies as having equal loudness, and to account for this, the signal is filtered by an inverted approximation of the equal-loudness curves. Technically, the filter is a cascade of a 10th order Yulewalk filter with a 2nd order Butterworth high pass filter. Check https://essentia.upf.edu/reference/std_EqualLoudness.html for more details.
* @class
*/
class EqualLoudness {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsEqualLoudness = {
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsEqualLoudness = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsEqualLoudness} [params]
  */
  constructor(params: paramTypes.ParamsEqualLoudness) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.EqualLoudness(this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsEqualLoudness} [params]
   * @memberof EqualLoudness
  */
  configure(params: paramTypes.ParamsEqualLoudness) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {signal: 'the filtered signal'}
   * @memberof EqualLoudness
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof EqualLoudness
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsEqualLoudness) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the flatness of an array, which is defined as the ratio between the geometric mean and the arithmetic mean. Check https://essentia.upf.edu/reference/std_Flatness.html for more details.
* @class
*/
class Flatness {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsFlatness} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.Flatness();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsFlatness} [params]
   * @memberof Flatness
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {flatness: 'the flatness (ratio between the geometric and the arithmetic mean of the input array)'}
   * @memberof Flatness
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Flatness
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the flatness of an array, which is defined as the ratio between the geometric mean and the arithmetic mean converted to dB scale. Check https://essentia.upf.edu/reference/std_FlatnessDB.html for more details.
* @class
*/
class FlatnessDB {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsFlatnessDB} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.FlatnessDB();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsFlatnessDB} [params]
   * @memberof FlatnessDB
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {flatnessDB: 'the flatness dB'}
   * @memberof FlatnessDB
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof FlatnessDB
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm calculates the flatness coefficient of a signal envelope. Check https://essentia.upf.edu/reference/std_FlatnessSFX.html for more details.
* @class
*/
class FlatnessSFX {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsFlatnessSFX} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.FlatnessSFX();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsFlatnessSFX} [params]
   * @memberof FlatnessSFX
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} envelope the envelope of the signal
   * @returns {object} {flatness: 'the flatness coefficient'}
   * @memberof FlatnessSFX
  */
  compute(envelope: any) {
    return this.algoInstance.compute(envelope);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof FlatnessSFX
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the spectral flux of a spectrum. Flux is defined as the L2-norm [1] or L1-norm [2] of the difference between two consecutive frames of the magnitude spectrum. The frames have to be of the same size in order to yield a meaningful result. The default L2-norm is used more commonly. Check https://essentia.upf.edu/reference/std_Flux.html for more details.
* @class
*/
class Flux {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsFlux = {
    halfRectify: false,
    norm: 'L2',
  };
  private params: paramTypes.ParamsFlux = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsFlux} [params]
  */
  constructor(params: paramTypes.ParamsFlux) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Flux(this.params.halfRectify, this.params.norm);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsFlux} [params]
   * @memberof Flux
  */
  configure(params: paramTypes.ParamsFlux) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.halfRectify, this.params.norm);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input spectrum
   * @returns {object} {flux: 'the spectral flux of the input spectrum'}
   * @memberof Flux
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Flux
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsFlux) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm slices the input buffer into frames. It returns a frame of a constant size and jumps a constant amount of samples forward in the buffer on every compute() call until no more frames can be extracted; empty frame vectors are returned afterwards. Incomplete frames (frames starting before the beginning of the input buffer or going past its end) are zero-padded or dropped according to the "validFrameThresholdRatio" parameter. Check https://essentia.upf.edu/reference/std_FrameCutter.html for more details.
* @class
*/
class FrameCutter {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsFrameCutter = {
    frameSize: 1024,
    hopSize: 512,
    lastFrameToEndOfFile: false,
    startFromZero: false,
    validFrameThresholdRatio: 0,
  };
  private params: paramTypes.ParamsFrameCutter = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsFrameCutter} [params]
  */
  constructor(params: paramTypes.ParamsFrameCutter) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.FrameCutter(this.params.frameSize, this.params.hopSize, this.params.lastFrameToEndOfFile, this.params.startFromZero, this.params.validFrameThresholdRatio);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsFrameCutter} [params]
   * @memberof FrameCutter
  */
  configure(params: paramTypes.ParamsFrameCutter) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.hopSize, this.params.lastFrameToEndOfFile, this.params.startFromZero, this.params.validFrameThresholdRatio);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the buffer from which to read data
   * @returns {object} {frame: 'the frame to write to'}
   * @memberof FrameCutter
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof FrameCutter
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsFrameCutter) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm converts a sequence of input audio signal frames into a sequence of audio samples. Check https://essentia.upf.edu/reference/std_FrameToReal.html for more details.
* @class
*/
class FrameToReal {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsFrameToReal = {
    frameSize: 2048,
    hopSize: 128,
  };
  private params: paramTypes.ParamsFrameToReal = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsFrameToReal} [params]
  */
  constructor(params: paramTypes.ParamsFrameToReal) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.FrameToReal(this.params.frameSize, this.params.hopSize);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsFrameToReal} [params]
   * @memberof FrameToReal
  */
  configure(params: paramTypes.ParamsFrameToReal) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.hopSize);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input audio frame
   * @returns {object} {signal: 'the output audio samples'}
   * @memberof FrameToReal
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof FrameToReal
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsFrameToReal) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes energy in rectangular frequency bands of a spectrum. The bands are non-overlapping. For each band the power-spectrum (mag-squared) is summed. Check https://essentia.upf.edu/reference/std_FrequencyBands.html for more details.
* @class
*/
class FrequencyBands {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsFrequencyBands = {
    frequencyBands: arrayToVector([0, 50, 100, 150, 200, 300, 400, 510, 630, 770, 920, 1080, 1270, 1480, 1720, 2000, 2320, 2700, 3150, 3700, 4400, 5300, 6400, 7700, 9500, 12000, 15500, 20500, 27000]),
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsFrequencyBands = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsFrequencyBands} [params]
  */
  constructor(params: paramTypes.ParamsFrequencyBands) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.FrequencyBands(this.params.frequencyBands, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsFrequencyBands} [params]
   * @memberof FrequencyBands
  */
  configure(params: paramTypes.ParamsFrequencyBands) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frequencyBands, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input spectrum (must be greater than size one)
   * @returns {object} {bands: 'the energy in each band'}
   * @memberof FrequencyBands
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof FrequencyBands
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsFrequencyBands) {
    if (!params) return;
    if (params.frequencyBands) {
      params.frequencyBands = arrayToVector(params.frequencyBands);
    }
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the Gammatone-frequency cepstral coefficients of a spectrum. This is an equivalent of MFCCs, but using a gammatone filterbank (ERBBands) scaled on an Equivalent Rectangular Bandwidth (ERB) scale. Check https://essentia.upf.edu/reference/std_GFCC.html for more details.
* @class
*/
class GFCC {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsGFCC = {
    dctType: 2,
    highFrequencyBound: 22050,
    inputSize: 1025,
    logType: 'dbamp',
    lowFrequencyBound: 40,
    numberBands: 40,
    numberCoefficients: 13,
    sampleRate: 44100,
    silenceThreshold: 1e-10,
    type: 'power',
  };
  private params: paramTypes.ParamsGFCC = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsGFCC} [params]
  */
  constructor(params: paramTypes.ParamsGFCC) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.GFCC(this.params.dctType, this.params.highFrequencyBound, this.params.inputSize, this.params.logType, this.params.lowFrequencyBound, this.params.numberBands, this.params.numberCoefficients, this.params.sampleRate, this.params.silenceThreshold, this.params.type);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsGFCC} [params]
   * @memberof GFCC
  */
  configure(params: paramTypes.ParamsGFCC) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.dctType, this.params.highFrequencyBound, this.params.inputSize, this.params.logType, this.params.lowFrequencyBound, this.params.numberBands, this.params.numberCoefficients, this.params.sampleRate, this.params.silenceThreshold, this.params.type);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the audio spectrum
   * @returns {object} {bands: 'the energies in ERB bands', gfcc: 'the gammatone feature cepstrum coefficients'}
   * @memberof GFCC
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof GFCC
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsGFCC) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm uses energy and time thresholds to detect gaps in the waveform. A median filter is used to remove spurious silent samples. The power of a small audio region before the detected gaps (prepower) is thresholded to detect intentional pauses as described in [1]. This technique is extended to the region after the gap.
The algorithm was designed for a framewise use and returns the start and end timestamps related to the first frame processed. Call configure() or reset() in order to restart the count. Check https://essentia.upf.edu/reference/std_GapsDetector.html for more details.
* @class
*/
class GapsDetector {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsGapsDetector = {
    attackTime: 0.05,
    frameSize: 2048,
    hopSize: 1024,
    kernelSize: 11,
    maximumTime: 3500,
    minimumTime: 10,
    postpowerTime: 40,
    prepowerThreshold: -30,
    prepowerTime: 40,
    releaseTime: 0.05,
    sampleRate: 44100,
    silenceThreshold: -50,
  };
  private params: paramTypes.ParamsGapsDetector = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsGapsDetector} [params]
  */
  constructor(params: paramTypes.ParamsGapsDetector) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.GapsDetector(this.params.attackTime, this.params.frameSize, this.params.hopSize, this.params.kernelSize, this.params.maximumTime, this.params.minimumTime, this.params.postpowerTime, this.params.prepowerThreshold, this.params.prepowerTime, this.params.releaseTime, this.params.sampleRate, this.params.silenceThreshold);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsGapsDetector} [params]
   * @memberof GapsDetector
  */
  configure(params: paramTypes.ParamsGapsDetector) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.attackTime, this.params.frameSize, this.params.hopSize, this.params.kernelSize, this.params.maximumTime, this.params.minimumTime, this.params.postpowerTime, this.params.prepowerThreshold, this.params.prepowerTime, this.params.releaseTime, this.params.sampleRate, this.params.silenceThreshold);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input frame (must be non-empty)
   * @returns {object} {starts: 'the start indexes of the detected gaps (if any) in seconds', ends: 'the end indexes of the detected gaps (if any) in seconds'}
   * @memberof GapsDetector
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof GapsDetector
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsGapsDetector) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the geometric mean of an array of positive values. Check https://essentia.upf.edu/reference/std_GeometricMean.html for more details.
* @class
*/
class GeometricMean {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsGeometricMean} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.GeometricMean();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsGeometricMean} [params]
   * @memberof GeometricMean
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {geometricMean: 'the geometric mean of the input array'}
   * @memberof GeometricMean
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof GeometricMean
  */
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
*/
class HFC {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsHFC = {
    sampleRate: 44100,
    type: 'Masri',
  };
  private params: paramTypes.ParamsHFC = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsHFC} [params]
  */
  constructor(params: paramTypes.ParamsHFC) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.HFC(this.params.sampleRate, this.params.type);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsHFC} [params]
   * @memberof HFC
  */
  configure(params: paramTypes.ParamsHFC) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.sampleRate, this.params.type);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input audio spectrum
   * @returns {object} {hfc: 'the high-frequency coefficient'}
   * @memberof HFC
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof HFC
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsHFC) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* Computes a Harmonic Pitch Class Profile (HPCP) from the spectral peaks of a signal. HPCP is a k*12 dimensional vector which represents the intensities of the twelve (k==1) semitone pitch classes (corresponsing to notes from A to G#), or subdivisions of these (k>1). Check https://essentia.upf.edu/reference/std_HPCP.html for more details.
* @class
*/
class HPCP {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsHPCP = {
    bandPreset: true,
    bandSplitFrequency: 500,
    harmonics: 0,
    maxFrequency: 5000,
    maxShifted: false,
    minFrequency: 40,
    nonLinear: false,
    normalized: 'unitMax',
    referenceFrequency: 440,
    sampleRate: 44100,
    size: 12,
    weightType: 'squaredCosine',
    windowSize: 1,
  };
  private params: paramTypes.ParamsHPCP = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsHPCP} [params]
  */
  constructor(params: paramTypes.ParamsHPCP) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.HPCP(this.params.bandPreset, this.params.bandSplitFrequency, this.params.harmonics, this.params.maxFrequency, this.params.maxShifted, this.params.minFrequency, this.params.nonLinear, this.params.normalized, this.params.referenceFrequency, this.params.sampleRate, this.params.size, this.params.weightType, this.params.windowSize);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsHPCP} [params]
   * @memberof HPCP
  */
  configure(params: paramTypes.ParamsHPCP) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.bandPreset, this.params.bandSplitFrequency, this.params.harmonics, this.params.maxFrequency, this.params.maxShifted, this.params.minFrequency, this.params.nonLinear, this.params.normalized, this.params.referenceFrequency, this.params.sampleRate, this.params.size, this.params.weightType, this.params.windowSize);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frequencies the frequencies of the spectral peaks [Hz]
   * @param {VectorFloat} magnitudes the magnitudes of the spectral peaks
   * @returns {object} {hpcp: 'the resulting harmonic pitch class profile'}
   * @memberof HPCP
  */
  compute(frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(frequencies, magnitudes);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof HPCP
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsHPCP) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm extracts bpms that are harmonically related to the tempo given by the 'bpm' parameter.
The algorithm assumes a certain bpm is harmonically related to parameter bpm, when the greatest common divisor between both bpms is greater than threshold.
The 'tolerance' parameter is needed in order to consider if two bpms are related. For instance, 120, 122 and 236 may be related or not depending on how much tolerance is given Check https://essentia.upf.edu/reference/std_HarmonicBpm.html for more details.
* @class
*/
class HarmonicBpm {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsHarmonicBpm = {
    bpm: 60,
    threshold: 20,
    tolerance: 5,
  };
  private params: paramTypes.ParamsHarmonicBpm = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsHarmonicBpm} [params]
  */
  constructor(params: paramTypes.ParamsHarmonicBpm) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.HarmonicBpm(this.params.bpm, this.params.threshold, this.params.tolerance);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsHarmonicBpm} [params]
   * @memberof HarmonicBpm
  */
  configure(params: paramTypes.ParamsHarmonicBpm) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.bpm, this.params.threshold, this.params.tolerance);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} bpms list of bpm candidates
   * @returns {object} {harmonicBpms: 'a list of bpms which are harmonically related to the bpm parameter '}
   * @memberof HarmonicBpm
  */
  compute(bpms: any) {
    return this.algoInstance.compute(bpms);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof HarmonicBpm
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsHarmonicBpm) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
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
*/
class HarmonicPeaks {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsHarmonicPeaks = {
    maxHarmonics: 20,
    tolerance: 0.2,
  };
  private params: paramTypes.ParamsHarmonicPeaks = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsHarmonicPeaks} [params]
  */
  constructor(params: paramTypes.ParamsHarmonicPeaks) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.HarmonicPeaks(this.params.maxHarmonics, this.params.tolerance);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsHarmonicPeaks} [params]
   * @memberof HarmonicPeaks
  */
  configure(params: paramTypes.ParamsHarmonicPeaks) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.maxHarmonics, this.params.tolerance);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frequencies the frequencies of the spectral peaks [Hz] (ascending order)
   * @param {VectorFloat} magnitudes the magnitudes of the spectral peaks (ascending frequency order)
   * @param {number} pitch an estimate of the fundamental frequency of the signal [Hz]
   * @returns {object} {harmonicFrequencies: 'the frequencies of harmonic peaks [Hz]', harmonicMagnitudes: 'the magnitudes of harmonic peaks'}
   * @memberof HarmonicPeaks
  */
  compute(frequencies: any, magnitudes: any, pitch: number) {
    return this.algoInstance.compute(frequencies, magnitudes, pitch);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof HarmonicPeaks
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsHarmonicPeaks) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm implements a 1st order IIR high-pass filter. Because of its dependence on IIR, IIR's requirements are inherited. Check https://essentia.upf.edu/reference/std_HighPass.html for more details.
* @class
*/
class HighPass {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsHighPass = {
    cutoffFrequency: 1500,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsHighPass = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsHighPass} [params]
  */
  constructor(params: paramTypes.ParamsHighPass) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.HighPass(this.params.cutoffFrequency, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsHighPass} [params]
   * @memberof HighPass
  */
  configure(params: paramTypes.ParamsHighPass) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.cutoffFrequency, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input audio signal
   * @returns {object} {signal: 'the filtered signal'}
   * @memberof HighPass
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof HighPass
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsHighPass) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes high-resolution chroma features from an HPCP vector. The vector's size must be a multiple of 12 and it is recommended that it be larger than 120. In otherwords, the HPCP's resolution should be 10 Cents or more.
The high-resolution features being computed are: Check https://essentia.upf.edu/reference/std_HighResolutionFeatures.html for more details.
* @class
*/
class HighResolutionFeatures {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsHighResolutionFeatures = {
    maxPeaks: 24,
  };
  private params: paramTypes.ParamsHighResolutionFeatures = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsHighResolutionFeatures} [params]
  */
  constructor(params: paramTypes.ParamsHighResolutionFeatures) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.HighResolutionFeatures(this.params.maxPeaks);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsHighResolutionFeatures} [params]
   * @memberof HighResolutionFeatures
  */
  configure(params: paramTypes.ParamsHighResolutionFeatures) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.maxPeaks);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} hpcp the HPCPs, preferably of size >= 120
   * @returns {object} {equalTemperedDeviation: 'measure of the deviation of HPCP local maxima with respect to equal-tempered bins', nonTemperedEnergyRatio: 'ratio between the energy on non-tempered bins and the total energy', nonTemperedPeaksEnergyRatio: 'ratio between the energy on non-tempered peaks and the total energy'}
   * @memberof HighResolutionFeatures
  */
  compute(hpcp: any) {
    return this.algoInstance.compute(hpcp);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof HighResolutionFeatures
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsHighResolutionFeatures) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes a histogram. Values outside the range are ignored Check https://essentia.upf.edu/reference/std_Histogram.html for more details.
* @class
*/
class Histogram {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsHistogram = {
    maxValue: 1,
    minValue: 0,
    normalize: 'none',
    numberBins: 10,
  };
  private params: paramTypes.ParamsHistogram = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsHistogram} [params]
  */
  constructor(params: paramTypes.ParamsHistogram) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Histogram(this.params.maxValue, this.params.minValue, this.params.normalize, this.params.numberBins);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsHistogram} [params]
   * @memberof Histogram
  */
  configure(params: paramTypes.ParamsHistogram) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.maxValue, this.params.minValue, this.params.normalize, this.params.numberBins);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {histogram: 'the values in the equally-spaced bins', binEdges: 'the edges of the equally-spaced bins. Size is _histogram.size() + 1'}
   * @memberof Histogram
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Histogram
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsHistogram) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the harmonic plus residual model analysis. Check https://essentia.upf.edu/reference/std_HprModelAnal.html for more details.
* @class
*/
class HprModelAnal {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsHprModelAnal = {
    fftSize: 2048,
    freqDevOffset: 20,
    freqDevSlope: 0.01,
    harmDevSlope: 0.01,
    hopSize: 512,
    magnitudeThreshold: 0,
    maxFrequency: 5000,
    maxPeaks: 100,
    maxnSines: 100,
    minFrequency: 20,
    nHarmonics: 100,
    orderBy: 'frequency',
    sampleRate: 44100,
    stocf: 0.2,
  };
  private params: paramTypes.ParamsHprModelAnal = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsHprModelAnal} [params]
  */
  constructor(params: paramTypes.ParamsHprModelAnal) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.HprModelAnal(this.params.fftSize, this.params.freqDevOffset, this.params.freqDevSlope, this.params.harmDevSlope, this.params.hopSize, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.maxPeaks, this.params.maxnSines, this.params.minFrequency, this.params.nHarmonics, this.params.orderBy, this.params.sampleRate, this.params.stocf);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsHprModelAnal} [params]
   * @memberof HprModelAnal
  */
  configure(params: paramTypes.ParamsHprModelAnal) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.fftSize, this.params.freqDevOffset, this.params.freqDevSlope, this.params.harmDevSlope, this.params.hopSize, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.maxPeaks, this.params.maxnSines, this.params.minFrequency, this.params.nHarmonics, this.params.orderBy, this.params.sampleRate, this.params.stocf);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input frame
   * @param {number} pitch external pitch input [Hz].
   * @returns {object} {frequencies: 'the frequencies of the sinusoidal peaks [Hz]', magnitudes: 'the magnitudes of the sinusoidal peaks', phases: 'the phases of the sinusoidal peaks', res: 'output residual frame'}
   * @memberof HprModelAnal
  */
  compute(frame: any, pitch: number) {
    return this.algoInstance.compute(frame, pitch);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof HprModelAnal
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsHprModelAnal) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the harmonic plus stochastic model analysis.  Check https://essentia.upf.edu/reference/std_HpsModelAnal.html for more details.
* @class
*/
class HpsModelAnal {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsHpsModelAnal = {
    fftSize: 2048,
    freqDevOffset: 20,
    freqDevSlope: 0.01,
    harmDevSlope: 0.01,
    hopSize: 512,
    magnitudeThreshold: 0,
    maxFrequency: 5000,
    maxPeaks: 100,
    maxnSines: 100,
    minFrequency: 20,
    nHarmonics: 100,
    orderBy: 'frequency',
    sampleRate: 44100,
    stocf: 0.2,
  };
  private params: paramTypes.ParamsHpsModelAnal = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsHpsModelAnal} [params]
  */
  constructor(params: paramTypes.ParamsHpsModelAnal) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.HpsModelAnal(this.params.fftSize, this.params.freqDevOffset, this.params.freqDevSlope, this.params.harmDevSlope, this.params.hopSize, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.maxPeaks, this.params.maxnSines, this.params.minFrequency, this.params.nHarmonics, this.params.orderBy, this.params.sampleRate, this.params.stocf);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsHpsModelAnal} [params]
   * @memberof HpsModelAnal
  */
  configure(params: paramTypes.ParamsHpsModelAnal) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.fftSize, this.params.freqDevOffset, this.params.freqDevSlope, this.params.harmDevSlope, this.params.hopSize, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.maxPeaks, this.params.maxnSines, this.params.minFrequency, this.params.nHarmonics, this.params.orderBy, this.params.sampleRate, this.params.stocf);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input frame
   * @param {number} pitch external pitch input [Hz].
   * @returns {object} {frequencies: 'the frequencies of the sinusoidal peaks [Hz]', magnitudes: 'the magnitudes of the sinusoidal peaks', phases: 'the phases of the sinusoidal peaks', stocenv: 'the stochastic envelope'}
   * @memberof HpsModelAnal
  */
  compute(frame: any, pitch: number) {
    return this.algoInstance.compute(frame, pitch);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof HpsModelAnal
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsHpsModelAnal) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the Inverse Discrete Cosine Transform of an array.
It can be configured to perform the inverse DCT-II form, with the 1/sqrt(2) scaling factor for the first coefficient or the inverse DCT-III form based on the HTK implementation. Check https://essentia.upf.edu/reference/std_IDCT.html for more details.
* @class
*/
class IDCT {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsIDCT = {
    dctType: 2,
    inputSize: 10,
    liftering: 0,
    outputSize: 10,
  };
  private params: paramTypes.ParamsIDCT = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsIDCT} [params]
  */
  constructor(params: paramTypes.ParamsIDCT) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.IDCT(this.params.dctType, this.params.inputSize, this.params.liftering, this.params.outputSize);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsIDCT} [params]
   * @memberof IDCT
  */
  configure(params: paramTypes.ParamsIDCT) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.dctType, this.params.inputSize, this.params.liftering, this.params.outputSize);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} dct the discrete cosine transform
   * @returns {object} {idct: 'the inverse cosine transform of the input array'}
   * @memberof IDCT
  */
  compute(dct: any) {
    return this.algoInstance.compute(dct);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof IDCT
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsIDCT) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm implements a standard IIR filter. It filters the data in the input vector with the filter described by parameter vectors 'numerator' and 'denominator' to create the output filtered vector. In the litterature, the numerator is often referred to as the 'B' coefficients and the denominator as the 'A' coefficients. Check https://essentia.upf.edu/reference/std_IIR.html for more details.
* @class
*/
class IIR {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsIIR = {
    denominator: arrayToVector([1]),
    numerator: arrayToVector([1]),
  };
  private params: paramTypes.ParamsIIR = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsIIR} [params]
  */
  constructor(params: paramTypes.ParamsIIR) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.IIR(this.params.denominator, this.params.numerator);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsIIR} [params]
   * @memberof IIR
  */
  configure(params: paramTypes.ParamsIIR) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.denominator, this.params.numerator);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {signal: 'the filtered signal'}
   * @memberof IIR
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof IIR
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsIIR) {
    if (!params) return;
    if (params.denominator) {
      params.denominator = arrayToVector(params.denominator);
    }
    if (params.numerator) {
      params.numerator = arrayToVector(params.numerator);
    }
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm calculates the inharmonicity of a signal given its spectral peaks. The inharmonicity value is computed as an energy weighted divergence of the spectral components from their closest multiple of the fundamental frequency. The fundamental frequency is taken as the first spectral peak from the input. The inharmonicity value ranges from 0 (purely harmonic signal) to 1 (inharmonic signal). Check https://essentia.upf.edu/reference/std_Inharmonicity.html for more details.
* @class
*/
class Inharmonicity {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsInharmonicity} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.Inharmonicity();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsInharmonicity} [params]
   * @memberof Inharmonicity
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frequencies the frequencies of the harmonic peaks [Hz] (in ascending order)
   * @param {VectorFloat} magnitudes the magnitudes of the harmonic peaks (in frequency ascending order
   * @returns {object} {inharmonicity: 'the inharmonicity of the audio signal'}
   * @memberof Inharmonicity
  */
  compute(frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(frequencies, magnitudes);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Inharmonicity
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the instant power of an array. That is, the energy of the array over its size. Check https://essentia.upf.edu/reference/std_InstantPower.html for more details.
* @class
*/
class InstantPower {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsInstantPower} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.InstantPower();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsInstantPower} [params]
   * @memberof InstantPower
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {power: 'the instant power of the input array'}
   * @memberof InstantPower
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof InstantPower
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm classifies the input audio signal as either relaxed (-1), moderate (0), or aggressive (1). Check https://essentia.upf.edu/reference/std_Intensity.html for more details.
* @class
*/
class Intensity {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsIntensity = {
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsIntensity = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsIntensity} [params]
  */
  constructor(params: paramTypes.ParamsIntensity) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Intensity(this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsIntensity} [params]
   * @memberof Intensity
  */
  configure(params: paramTypes.ParamsIntensity) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input audio signal
   * @returns {object} {intensity: 'the intensity value'}
   * @memberof Intensity
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Intensity
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsIntensity) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes key estimate given a pitch class profile (HPCP). The algorithm was severely adapted and changed from the original implementation for readability and speed. Check https://essentia.upf.edu/reference/std_Key.html for more details.
* @class
*/
class Key {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsKey = {
    numHarmonics: 4,
    pcpSize: 36,
    profileType: 'bgate',
    slope: 0.6,
    useMajMin: false,
    usePolyphony: true,
    useThreeChords: true,
  };
  private params: paramTypes.ParamsKey = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsKey} [params]
  */
  constructor(params: paramTypes.ParamsKey) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Key(this.params.numHarmonics, this.params.pcpSize, this.params.profileType, this.params.slope, this.params.useMajMin, this.params.usePolyphony, this.params.useThreeChords);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsKey} [params]
   * @memberof Key
  */
  configure(params: paramTypes.ParamsKey) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.numHarmonics, this.params.pcpSize, this.params.profileType, this.params.slope, this.params.useMajMin, this.params.usePolyphony, this.params.useThreeChords);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} pcp the input pitch class profile
   * @returns {object} {key: 'the estimated key, from A to G', scale: 'the scale of the key (major or minor)', strength: 'the strength of the estimated key', firstToSecondRelativeStrength: 'the relative strength difference between the best estimate and second best estimate of the key'}
   * @memberof Key
  */
  compute(pcp: any) {
    return this.algoInstance.compute(pcp);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Key
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsKey) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm extracts key/scale for an audio signal. It computes HPCP frames for the input signal and applies key estimation using the Key algorithm. Check https://essentia.upf.edu/reference/std_KeyExtractor.html for more details.
* @class
*/
class KeyExtractor {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsKeyExtractor = {
    averageDetuningCorrection: true,
    frameSize: 4096,
    hopSize: 4096,
    hpcpSize: 12,
    maxFrequency: 3500,
    maximumSpectralPeaks: 60,
    minFrequency: 25,
    pcpThreshold: 0.2,
    profileType: 'bgate',
    sampleRate: 44100,
    spectralPeaksThreshold: 0.0001,
    tuningFrequency: 440,
    weightType: 'cosine',
    windowType: 'hann',
  };
  private params: paramTypes.ParamsKeyExtractor = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsKeyExtractor} [params]
  */
  constructor(params: paramTypes.ParamsKeyExtractor) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.KeyExtractor(this.params.averageDetuningCorrection, this.params.frameSize, this.params.hopSize, this.params.hpcpSize, this.params.maxFrequency, this.params.maximumSpectralPeaks, this.params.minFrequency, this.params.pcpThreshold, this.params.profileType, this.params.sampleRate, this.params.spectralPeaksThreshold, this.params.tuningFrequency, this.params.weightType, this.params.windowType);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsKeyExtractor} [params]
   * @memberof KeyExtractor
  */
  configure(params: paramTypes.ParamsKeyExtractor) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.averageDetuningCorrection, this.params.frameSize, this.params.hopSize, this.params.hpcpSize, this.params.maxFrequency, this.params.maximumSpectralPeaks, this.params.minFrequency, this.params.pcpThreshold, this.params.profileType, this.params.sampleRate, this.params.spectralPeaksThreshold, this.params.tuningFrequency, this.params.weightType, this.params.windowType);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} audio the audio input signal
   * @returns {object} {key: 'See Key algorithm documentation', scale: 'See Key algorithm documentation', strength: 'See Key algorithm documentation'}
   * @memberof KeyExtractor
  */
  compute(audio: any) {
    return this.algoInstance.compute(audio);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof KeyExtractor
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsKeyExtractor) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes Linear Predictive Coefficients and associated reflection coefficients of a signal. Check https://essentia.upf.edu/reference/std_LPC.html for more details.
* @class
*/
class LPC {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsLPC = {
    order: 10,
    sampleRate: 44100,
    type: 'regular',
  };
  private params: paramTypes.ParamsLPC = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsLPC} [params]
  */
  constructor(params: paramTypes.ParamsLPC) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.LPC(this.params.order, this.params.sampleRate, this.params.type);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsLPC} [params]
   * @memberof LPC
  */
  configure(params: paramTypes.ParamsLPC) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.order, this.params.sampleRate, this.params.type);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input audio frame
   * @returns {object} {lpc: 'the LPC coefficients', reflection: 'the reflection coefficients'}
   * @memberof LPC
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof LPC
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsLPC) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates the long-term loudness of an audio signal. The LARM model is based on the asymmetrical low-pass filtering of the Peak Program Meter (PPM), combined with Revised Low-frequency B-weighting (RLB) and power mean calculations. LARM has shown to be a reliable and objective loudness estimate of music and speech. Check https://essentia.upf.edu/reference/std_Larm.html for more details.
* @class
*/
class Larm {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsLarm = {
    attackTime: 10,
    power: 1.5,
    releaseTime: 1500,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsLarm = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsLarm} [params]
  */
  constructor(params: paramTypes.ParamsLarm) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Larm(this.params.attackTime, this.params.power, this.params.releaseTime, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsLarm} [params]
   * @memberof Larm
  */
  configure(params: paramTypes.ParamsLarm) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.attackTime, this.params.power, this.params.releaseTime, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the audio input signal
   * @returns {object} {larm: 'the LARM loudness estimate [dB]'}
   * @memberof Larm
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Larm
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsLarm) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the Equivalent sound level (Leq) of an audio signal. The Leq measure can be derived from the Revised Low-frequency B-weighting (RLB) or from the raw signal as described in [1]. If the signal contains no energy, Leq defaults to essentias definition of silence which is -90dB.
This algorithm will throw an exception on empty input. Check https://essentia.upf.edu/reference/std_Leq.html for more details.
* @class
*/
class Leq {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsLeq} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.Leq();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsLeq} [params]
   * @memberof Leq
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal (must be non-empty)
   * @returns {object} {leq: 'the equivalent sound level estimate [dB]'}
   * @memberof Leq
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Leq
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm extracts the loudness of an audio signal in frames using Loudness algorithm. Check https://essentia.upf.edu/reference/std_LevelExtractor.html for more details.
* @class
*/
class LevelExtractor {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsLevelExtractor = {
    frameSize: 88200,
    hopSize: 44100,
  };
  private params: paramTypes.ParamsLevelExtractor = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsLevelExtractor} [params]
  */
  constructor(params: paramTypes.ParamsLevelExtractor) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.LevelExtractor(this.params.frameSize, this.params.hopSize);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsLevelExtractor} [params]
   * @memberof LevelExtractor
  */
  configure(params: paramTypes.ParamsLevelExtractor) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.hopSize);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the audio input signal
   * @returns {object} {loudness: 'the loudness values'}
   * @memberof LevelExtractor
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof LevelExtractor
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsLevelExtractor) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the log (base 10) of the attack time of a signal envelope. The attack time is defined as the time duration from when the sound becomes perceptually audible to when it reaches its maximum intensity. By default, the start of the attack is estimated as the point where the signal envelope reaches 20% of its maximum value in order to account for possible noise presence. Also by default, the end of the attack is estimated as as the point where the signal envelope has reached 90% of its maximum value, in order to account for the possibility that the max value occurres after the logAttack, as in trumpet sounds. Check https://essentia.upf.edu/reference/std_LogAttackTime.html for more details.
* @class
*/
class LogAttackTime {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsLogAttackTime = {
    sampleRate: 44100,
    startAttackThreshold: 0.2,
    stopAttackThreshold: 0.9,
  };
  private params: paramTypes.ParamsLogAttackTime = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsLogAttackTime} [params]
  */
  constructor(params: paramTypes.ParamsLogAttackTime) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.LogAttackTime(this.params.sampleRate, this.params.startAttackThreshold, this.params.stopAttackThreshold);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsLogAttackTime} [params]
   * @memberof LogAttackTime
  */
  configure(params: paramTypes.ParamsLogAttackTime) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.sampleRate, this.params.startAttackThreshold, this.params.stopAttackThreshold);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal envelope (must be non-empty)
   * @returns {object} {logAttackTime: 'the log (base 10) of the attack time [log10(s)]', attackStart: 'the attack start time [s]', attackStop: 'the attack end time [s]'}
   * @memberof LogAttackTime
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof LogAttackTime
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsLogAttackTime) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes spectrum with logarithmically distributed frequency bins. This code is ported from NNLS Chroma [1, 2].This algorithm also returns a local tuning that is retrieved for input frame and a global tuning that is updated with a moving average. Check https://essentia.upf.edu/reference/std_LogSpectrum.html for more details.
* @class
*/
class LogSpectrum {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsLogSpectrum = {
    binsPerSemitone: 3,
    frameSize: 1025,
    nOctave: 7,
    rollOn: 0,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsLogSpectrum = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsLogSpectrum} [params]
  */
  constructor(params: paramTypes.ParamsLogSpectrum) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.LogSpectrum(this.params.binsPerSemitone, this.params.frameSize, this.params.nOctave, this.params.rollOn, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsLogSpectrum} [params]
   * @memberof LogSpectrum
  */
  configure(params: paramTypes.ParamsLogSpectrum) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binsPerSemitone, this.params.frameSize, this.params.nOctave, this.params.rollOn, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum spectrum frame
   * @returns {object} {logFreqSpectrum: 'log frequency spectrum frame', meanTuning: 'normalized mean tuning frequency', localTuning: 'normalized local tuning frequency'}
   * @memberof LogSpectrum
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof LogSpectrum
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsLogSpectrum) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm takes an audio signal and a BPM estimate for that signal and predicts the reliability of the BPM estimate in a value from 0 to 1. The audio signal is assumed to be a musical loop with constant tempo. The confidence returned is based on comparing the duration of the signal with multiples of the BPM estimate (see [1] for more details). Check https://essentia.upf.edu/reference/std_LoopBpmConfidence.html for more details.
* @class
*/
class LoopBpmConfidence {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsLoopBpmConfidence = {
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsLoopBpmConfidence = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsLoopBpmConfidence} [params]
  */
  constructor(params: paramTypes.ParamsLoopBpmConfidence) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.LoopBpmConfidence(this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsLoopBpmConfidence} [params]
   * @memberof LoopBpmConfidence
  */
  configure(params: paramTypes.ParamsLoopBpmConfidence) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal loop audio signal
   * @param {number} bpmEstimate estimated BPM for the audio signal (will be rounded to nearest integer)
   * @returns {object} {confidence: 'confidence value for the BPM estimation'}
   * @memberof LoopBpmConfidence
  */
  compute(signal: any, bpmEstimate: number) {
    return this.algoInstance.compute(signal, bpmEstimate);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof LoopBpmConfidence
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsLoopBpmConfidence) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates the BPM of audio loops. It internally uses PercivalBpmEstimator algorithm to produce a BPM estimate and LoopBpmConfidence to asses the reliability of the estimate. If the provided estimate is below the given confidenceThreshold, the algorithm outputs a BPM 0.0, otherwise it outputs the estimated BPM. For more details on the BPM estimation method and the confidence measure please check the used algorithms. Check https://essentia.upf.edu/reference/std_LoopBpmEstimator.html for more details.
* @class
*/
class LoopBpmEstimator {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsLoopBpmEstimator = {
    confidenceThreshold: 0.95,
  };
  private params: paramTypes.ParamsLoopBpmEstimator = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsLoopBpmEstimator} [params]
  */
  constructor(params: paramTypes.ParamsLoopBpmEstimator) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.LoopBpmEstimator(this.params.confidenceThreshold);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsLoopBpmEstimator} [params]
   * @memberof LoopBpmEstimator
  */
  configure(params: paramTypes.ParamsLoopBpmEstimator) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.confidenceThreshold);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {bpm: 'the estimated bpm (will be 0 if unsure)'}
   * @memberof LoopBpmEstimator
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof LoopBpmEstimator
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsLoopBpmEstimator) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the loudness of an audio signal defined by Steven's power law. It computes loudness as the energy of the signal raised to the power of 0.67. Check https://essentia.upf.edu/reference/std_Loudness.html for more details.
* @class
*/
class Loudness {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsLoudness} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.Loudness();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsLoudness} [params]
   * @memberof Loudness
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {loudness: 'the loudness of the input signal'}
   * @memberof Loudness
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Loudness
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes Vickers's loudness of an audio signal. Currently, this algorithm only works for signals with a 44100Hz sampling rate. This algorithm is meant to be given frames of audio as input (not entire audio signals). The algorithm described in the paper performs a weighted average of the loudness value computed for each of the given frames, this step is left as a post processing step and is not performed by this algorithm. Check https://essentia.upf.edu/reference/std_LoudnessVickers.html for more details.
* @class
*/
class LoudnessVickers {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsLoudnessVickers = {
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsLoudnessVickers = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsLoudnessVickers} [params]
  */
  constructor(params: paramTypes.ParamsLoudnessVickers) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.LoudnessVickers(this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsLoudnessVickers} [params]
   * @memberof LoudnessVickers
  */
  configure(params: paramTypes.ParamsLoudnessVickers) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {loudness: 'the Vickers loudness [dB]'}
   * @memberof LoudnessVickers
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof LoudnessVickers
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsLoudnessVickers) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm extracts a set of level spectral features for which it is recommended to apply a preliminary equal-loudness filter over an input audio signal (according to the internal evaluations conducted at Music Technology Group). To this end, you are expected to provide the output of EqualLoudness algorithm as an input for this algorithm. Still, you are free to provide an unprocessed audio input in the case you want to compute these features without equal-loudness filter. Check https://essentia.upf.edu/reference/std_LowLevelSpectralEqloudExtractor.html for more details.
* @class
*/
class LowLevelSpectralEqloudExtractor {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsLowLevelSpectralEqloudExtractor = {
    frameSize: 2048,
    hopSize: 1024,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsLowLevelSpectralEqloudExtractor = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsLowLevelSpectralEqloudExtractor} [params]
  */
  constructor(params: paramTypes.ParamsLowLevelSpectralEqloudExtractor) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.LowLevelSpectralEqloudExtractor(this.params.frameSize, this.params.hopSize, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsLowLevelSpectralEqloudExtractor} [params]
   * @memberof LowLevelSpectralEqloudExtractor
  */
  configure(params: paramTypes.ParamsLowLevelSpectralEqloudExtractor) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.hopSize, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input audio signal
   * @returns {object} {dissonance: 'See Dissonance algorithm documentation', sccoeffs: 'See SpectralContrast algorithm documentation', scvalleys: 'See SpectralContrast algorithm documentation', spectral_centroid: 'See Centroid algorithm documentation', spectral_kurtosis: 'See DistributionShape algorithm documentation', spectral_skewness: 'See DistributionShape algorithm documentation', spectral_spread: 'See DistributionShape algorithm documentation'}
   * @memberof LowLevelSpectralEqloudExtractor
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof LowLevelSpectralEqloudExtractor
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsLowLevelSpectralEqloudExtractor) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm extracts all low-level spectral features, which do not require an equal-loudness filter for their computation, from an audio signal Check https://essentia.upf.edu/reference/std_LowLevelSpectralExtractor.html for more details.
* @class
*/
class LowLevelSpectralExtractor {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsLowLevelSpectralExtractor = {
    frameSize: 2048,
    hopSize: 1024,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsLowLevelSpectralExtractor = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsLowLevelSpectralExtractor} [params]
  */
  constructor(params: paramTypes.ParamsLowLevelSpectralExtractor) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.LowLevelSpectralExtractor(this.params.frameSize, this.params.hopSize, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsLowLevelSpectralExtractor} [params]
   * @memberof LowLevelSpectralExtractor
  */
  configure(params: paramTypes.ParamsLowLevelSpectralExtractor) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.hopSize, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the audio input signal
   * @returns {object} {barkbands: 'spectral energy at each bark band. See BarkBands alogithm', barkbands_kurtosis: 'kurtosis from bark bands. See DistributionShape algorithm documentation', barkbands_skewness: 'skewness from bark bands. See DistributionShape algorithm documentation', barkbands_spread: 'spread from barkbands. See DistributionShape algorithm documentation', hfc: 'See HFC algorithm documentation', mfcc: 'See MFCC algorithm documentation', pitch: 'See PitchYinFFT algorithm documentation', pitch_instantaneous_confidence: 'See PitchYinFFT algorithm documentation', pitch_salience: 'See PitchSalience algorithm documentation', silence_rate_20dB: 'See SilenceRate algorithm documentation', silence_rate_30dB: 'See SilenceRate algorithm documentation', silence_rate_60dB: 'See SilenceRate algorithm documentation', spectral_complexity: 'See Spectral algorithm documentation', spectral_crest: 'See Crest algorithm documentation', spectral_decrease: 'See Decrease algorithm documentation', spectral_energy: 'See Energy algorithm documentation', spectral_energyband_low: 'Energy in band (20,150] Hz. See EnergyBand algorithm documentation', spectral_energyband_middle_low: 'Energy in band (150,800] Hz.See EnergyBand algorithm documentation', spectral_energyband_middle_high: 'Energy in band (800,4000] Hz. See EnergyBand algorithm documentation', spectral_energyband_high: 'Energy in band (4000,20000] Hz. See EnergyBand algorithm documentation', spectral_flatness_db: 'See flatnessDB algorithm documentation', spectral_flux: 'See Flux algorithm documentation', spectral_rms: 'See RMS algorithm documentation', spectral_rolloff: 'See RollOff algorithm documentation', spectral_strongpeak: 'See StrongPeak algorithm documentation', zerocrossingrate: 'See ZeroCrossingRate algorithm documentation', inharmonicity: 'See Inharmonicity algorithm documentation', tristimulus: 'See Tristimulus algorithm documentation', oddtoevenharmonicenergyratio: 'See OddToEvenHarmonicEnergyRatio algorithm documentation'}
   * @memberof LowLevelSpectralExtractor
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof LowLevelSpectralExtractor
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsLowLevelSpectralExtractor) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm implements a 1st order IIR low-pass filter. Because of its dependence on IIR, IIR's requirements are inherited.
References:
  [1] U. Zölzer, DAFX - Digital Audio Effects, p. 40,
  John Wiley & Sons, 2002 Check https://essentia.upf.edu/reference/std_LowPass.html for more details.
* @class
*/
class LowPass {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsLowPass = {
    cutoffFrequency: 1500,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsLowPass = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsLowPass} [params]
  */
  constructor(params: paramTypes.ParamsLowPass) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.LowPass(this.params.cutoffFrequency, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsLowPass} [params]
   * @memberof LowPass
  */
  configure(params: paramTypes.ParamsLowPass) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.cutoffFrequency, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input audio signal
   * @returns {object} {signal: 'the filtered signal'}
   * @memberof LowPass
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof LowPass
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsLowPass) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the mel-frequency cepstrum coefficients of a spectrum. As there is no standard implementation, the MFCC-FB40 is used by default:
  - filterbank of 40 bands from 0 to 11000Hz
  - take the log value of the spectrum energy in each mel band. Bands energy values below silence threshold will be clipped to its value before computing log-energies
  - DCT of the 40 bands down to 13 mel coefficients
There is a paper describing various MFCC implementations [1]. Check https://essentia.upf.edu/reference/std_MFCC.html for more details.
* @class
*/
class MFCC {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsMFCC = {
    dctType: 2,
    highFrequencyBound: 11000,
    inputSize: 1025,
    liftering: 0,
    logType: 'dbamp',
    lowFrequencyBound: 0,
    normalize: 'unit_sum',
    numberBands: 40,
    numberCoefficients: 13,
    sampleRate: 44100,
    silenceThreshold: 1e-10,
    type: 'power',
    warpingFormula: 'htkMel',
    weighting: 'warping',
  };
  private params: paramTypes.ParamsMFCC = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsMFCC} [params]
  */
  constructor(params: paramTypes.ParamsMFCC) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.MFCC(this.params.dctType, this.params.highFrequencyBound, this.params.inputSize, this.params.liftering, this.params.logType, this.params.lowFrequencyBound, this.params.normalize, this.params.numberBands, this.params.numberCoefficients, this.params.sampleRate, this.params.silenceThreshold, this.params.type, this.params.warpingFormula, this.params.weighting);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsMFCC} [params]
   * @memberof MFCC
  */
  configure(params: paramTypes.ParamsMFCC) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.dctType, this.params.highFrequencyBound, this.params.inputSize, this.params.liftering, this.params.logType, this.params.lowFrequencyBound, this.params.normalize, this.params.numberBands, this.params.numberCoefficients, this.params.sampleRate, this.params.silenceThreshold, this.params.type, this.params.warpingFormula, this.params.weighting);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the audio spectrum
   * @returns {object} {bands: 'the energies in mel bands', mfcc: 'the mel frequency cepstrum coefficients'}
   * @memberof MFCC
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof MFCC
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsMFCC) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm implements a maximum filter for 1d signal using van Herk/Gil-Werman (HGW) algorithm. Check https://essentia.upf.edu/reference/std_MaxFilter.html for more details.
* @class
*/
class MaxFilter {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsMaxFilter = {
    causal: true,
    width: 3,
  };
  private params: paramTypes.ParamsMaxFilter = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsMaxFilter} [params]
  */
  constructor(params: paramTypes.ParamsMaxFilter) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.MaxFilter(this.params.causal, this.params.width);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsMaxFilter} [params]
   * @memberof MaxFilter
  */
  configure(params: paramTypes.ParamsMaxFilter) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.causal, this.params.width);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal signal to be filtered
   * @returns {object} {signal: 'filtered output'}
   * @memberof MaxFilter
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof MaxFilter
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsMaxFilter) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the frequency with the largest magnitude in a spectrum.
Note that a spectrum must contain at least two elements otherwise an exception is thrown Check https://essentia.upf.edu/reference/std_MaxMagFreq.html for more details.
* @class
*/
class MaxMagFreq {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsMaxMagFreq = {
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsMaxMagFreq = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsMaxMagFreq} [params]
  */
  constructor(params: paramTypes.ParamsMaxMagFreq) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.MaxMagFreq(this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsMaxMagFreq} [params]
   * @memberof MaxMagFreq
  */
  configure(params: paramTypes.ParamsMaxMagFreq) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input spectrum (must have more than 1 element)
   * @returns {object} {maxMagFreq: 'the frequency with the largest magnitude [Hz]'}
   * @memberof MaxMagFreq
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof MaxMagFreq
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsMaxMagFreq) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the ratio between the index of the maximum value of the envelope of a signal and the total length of the envelope. This ratio shows how much the maximum amplitude is off-center. Its value is close to 0 if the maximum is close to the beginning (e.g. Decrescendo or Impulsive sounds), close to 0.5 if it is close to the middle (e.g. Delta sounds) and close to 1 if it is close to the end of the sound (e.g. Crescendo sounds). This algorithm is intended to be fed by the output of the Envelope algorithm Check https://essentia.upf.edu/reference/std_MaxToTotal.html for more details.
* @class
*/
class MaxToTotal {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsMaxToTotal} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.MaxToTotal();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsMaxToTotal} [params]
   * @memberof MaxToTotal
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} envelope the envelope of the signal
   * @returns {object} {maxToTotal: 'the maximum amplitude position to total length ratio'}
   * @memberof MaxToTotal
  */
  compute(envelope: any) {
    return this.algoInstance.compute(envelope);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof MaxToTotal
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the mean of an array. Check https://essentia.upf.edu/reference/std_Mean.html for more details.
* @class
*/
class Mean {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsMean} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.Mean();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsMean} [params]
   * @memberof Mean
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {mean: 'the mean of the input array'}
   * @memberof Mean
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Mean
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the median of an array. When there is an odd number of numbers, the median is simply the middle number. For example, the median of 2, 4, and 7 is 4. When there is an even number of numbers, the median is the mean of the two middle numbers. Thus, the median of the numbers 2, 4, 7, 12 is (4+7)/2 = 5.5. See [1] for more info. Check https://essentia.upf.edu/reference/std_Median.html for more details.
* @class
*/
class Median {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsMedian} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.Median();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsMedian} [params]
   * @memberof Median
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array (must be non-empty)
   * @returns {object} {median: 'the median of the input array'}
   * @memberof Median
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Median
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the median filtered version of the input signal giving the kernel size as detailed in [1]. Check https://essentia.upf.edu/reference/std_MedianFilter.html for more details.
* @class
*/
class MedianFilter {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsMedianFilter = {
    kernelSize: 11,
  };
  private params: paramTypes.ParamsMedianFilter = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsMedianFilter} [params]
  */
  constructor(params: paramTypes.ParamsMedianFilter) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.MedianFilter(this.params.kernelSize);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsMedianFilter} [params]
   * @memberof MedianFilter
  */
  configure(params: paramTypes.ParamsMedianFilter) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.kernelSize);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array (must be non-empty)
   * @returns {object} {filteredArray: 'the median-filtered input array'}
   * @memberof MedianFilter
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof MedianFilter
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsMedianFilter) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes energy in mel bands of a spectrum. It applies a frequency-domain filterbank (MFCC FB-40, [1]), which consists of equal area triangular filters spaced according to the mel scale. The filterbank is normalized in such a way that the sum of coefficients for every filter equals one. It is recommended that the input "spectrum" be calculated by the Spectrum algorithm. Check https://essentia.upf.edu/reference/std_MelBands.html for more details.
* @class
*/
class MelBands {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsMelBands = {
    highFrequencyBound: 22050,
    inputSize: 1025,
    log: false,
    lowFrequencyBound: 0,
    normalize: 'unit_sum',
    numberBands: 24,
    sampleRate: 44100,
    type: 'power',
    warpingFormula: 'htkMel',
    weighting: 'warping',
  };
  private params: paramTypes.ParamsMelBands = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsMelBands} [params]
  */
  constructor(params: paramTypes.ParamsMelBands) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.MelBands(this.params.highFrequencyBound, this.params.inputSize, this.params.log, this.params.lowFrequencyBound, this.params.normalize, this.params.numberBands, this.params.sampleRate, this.params.type, this.params.warpingFormula, this.params.weighting);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsMelBands} [params]
   * @memberof MelBands
  */
  configure(params: paramTypes.ParamsMelBands) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.highFrequencyBound, this.params.inputSize, this.params.log, this.params.lowFrequencyBound, this.params.normalize, this.params.numberBands, this.params.sampleRate, this.params.type, this.params.warpingFormula, this.params.weighting);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the audio spectrum
   * @returns {object} {bands: 'the energy in mel bands'}
   * @memberof MelBands
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof MelBands
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsMelBands) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates the time signature of a given beatogram by finding the highest correlation between beats. Check https://essentia.upf.edu/reference/std_Meter.html for more details.
* @class
*/
class Meter {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsMeter} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.Meter();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsMeter} [params]
   * @memberof Meter
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} beatogram filtered matrix loudness
   * @returns {object} {meter: 'the time signature'}
   * @memberof Meter
  */
  compute(beatogram: any) {
    return this.algoInstance.compute(beatogram);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Meter
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm calculates the minimum or maximum value of an array.
If the array has more than one minimum or maximum value, the index of the first one is returned Check https://essentia.upf.edu/reference/std_MinMax.html for more details.
* @class
*/
class MinMax {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsMinMax = {
    type: 'min',
  };
  private params: paramTypes.ParamsMinMax = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsMinMax} [params]
  */
  constructor(params: paramTypes.ParamsMinMax) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.MinMax(this.params.type);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsMinMax} [params]
   * @memberof MinMax
  */
  configure(params: paramTypes.ParamsMinMax) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.type);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {real: 'the minimum or maximum of the input array, according to the type parameter', int: 'the index of the value'}
   * @memberof MinMax
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof MinMax
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsMinMax) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the ratio between the index of the minimum value of the envelope of a signal and the total length of the envelope. Check https://essentia.upf.edu/reference/std_MinToTotal.html for more details.
* @class
*/
class MinToTotal {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsMinToTotal} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.MinToTotal();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsMinToTotal} [params]
   * @memberof MinToTotal
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} envelope the envelope of the signal
   * @returns {object} {minToTotal: 'the minimum amplitude position to total length ratio'}
   * @memberof MinToTotal
  */
  compute(envelope: any) {
    return this.algoInstance.compute(envelope);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof MinToTotal
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements a FIR Moving Average filter. Because of its dependece on IIR, IIR's requirements are inherited. Check https://essentia.upf.edu/reference/std_MovingAverage.html for more details.
* @class
*/
class MovingAverage {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsMovingAverage = {
    size: 6,
  };
  private params: paramTypes.ParamsMovingAverage = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsMovingAverage} [params]
  */
  constructor(params: paramTypes.ParamsMovingAverage) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.MovingAverage(this.params.size);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsMovingAverage} [params]
   * @memberof MovingAverage
  */
  configure(params: paramTypes.ParamsMovingAverage) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.size);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input audio signal
   * @returns {object} {signal: 'the filtered signal'}
   * @memberof MovingAverage
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof MovingAverage
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsMovingAverage) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates multiple pitch values corresponding to the melodic lines present in a polyphonic music signal (for example, string quartet, piano). This implementation is based on the algorithm in [1]: In each frame, a set of possible fundamental frequency candidates is extracted based on the principle of harmonic summation. In an optimization stage, the number of harmonic sources (polyphony) is estimated and the final set of fundamental frequencies determined. In contrast to the pich salience function proposed in [2], this implementation uses the pitch salience function described in [1].
The output is a vector for each frame containing the estimated melody pitch values. Check https://essentia.upf.edu/reference/std_MultiPitchKlapuri.html for more details.
* @class
*/
class MultiPitchKlapuri {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsMultiPitchKlapuri = {
    binResolution: 10,
    frameSize: 2048,
    harmonicWeight: 0.8,
    hopSize: 128,
    magnitudeCompression: 1,
    magnitudeThreshold: 40,
    maxFrequency: 1760,
    minFrequency: 80,
    numberHarmonics: 10,
    referenceFrequency: 55,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsMultiPitchKlapuri = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsMultiPitchKlapuri} [params]
  */
  constructor(params: paramTypes.ParamsMultiPitchKlapuri) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.MultiPitchKlapuri(this.params.binResolution, this.params.frameSize, this.params.harmonicWeight, this.params.hopSize, this.params.magnitudeCompression, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.minFrequency, this.params.numberHarmonics, this.params.referenceFrequency, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsMultiPitchKlapuri} [params]
   * @memberof MultiPitchKlapuri
  */
  configure(params: paramTypes.ParamsMultiPitchKlapuri) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binResolution, this.params.frameSize, this.params.harmonicWeight, this.params.hopSize, this.params.magnitudeCompression, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.minFrequency, this.params.numberHarmonics, this.params.referenceFrequency, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {pitch: 'the estimated pitch values [Hz]'}
   * @memberof MultiPitchKlapuri
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof MultiPitchKlapuri
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsMultiPitchKlapuri) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates multiple fundamental frequency contours from an audio signal. It is a multi pitch version of the MELODIA algorithm described in [1]. While the algorithm is originally designed to extract melody in polyphonic music, this implementation is adapted for multiple sources. The approach is based on the creation and characterization of pitch contours, time continuous sequences of pitch candidates grouped using auditory streaming cues. To this end, PitchSalienceFunction, PitchSalienceFunctionPeaks, PitchContours, and PitchContoursMonoMelody algorithms are employed. It is strongly advised to use the default parameter values which are optimized according to [1] (where further details are provided) except for minFrequency, maxFrequency, and voicingTolerance, which will depend on your application. Check https://essentia.upf.edu/reference/std_MultiPitchMelodia.html for more details.
* @class
*/
class MultiPitchMelodia {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsMultiPitchMelodia = {
    binResolution: 10,
    filterIterations: 3,
    frameSize: 2048,
    guessUnvoiced: false,
    harmonicWeight: 0.8,
    hopSize: 128,
    magnitudeCompression: 1,
    magnitudeThreshold: 40,
    maxFrequency: 20000,
    minDuration: 100,
    minFrequency: 40,
    numberHarmonics: 20,
    peakDistributionThreshold: 0.9,
    peakFrameThreshold: 0.9,
    pitchContinuity: 27.5625,
    referenceFrequency: 55,
    sampleRate: 44100,
    timeContinuity: 100,
  };
  private params: paramTypes.ParamsMultiPitchMelodia = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsMultiPitchMelodia} [params]
  */
  constructor(params: paramTypes.ParamsMultiPitchMelodia) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.MultiPitchMelodia(this.params.binResolution, this.params.filterIterations, this.params.frameSize, this.params.guessUnvoiced, this.params.harmonicWeight, this.params.hopSize, this.params.magnitudeCompression, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.minDuration, this.params.minFrequency, this.params.numberHarmonics, this.params.peakDistributionThreshold, this.params.peakFrameThreshold, this.params.pitchContinuity, this.params.referenceFrequency, this.params.sampleRate, this.params.timeContinuity);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsMultiPitchMelodia} [params]
   * @memberof MultiPitchMelodia
  */
  configure(params: paramTypes.ParamsMultiPitchMelodia) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binResolution, this.params.filterIterations, this.params.frameSize, this.params.guessUnvoiced, this.params.harmonicWeight, this.params.hopSize, this.params.magnitudeCompression, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.minDuration, this.params.minFrequency, this.params.numberHarmonics, this.params.peakDistributionThreshold, this.params.peakFrameThreshold, this.params.pitchContinuity, this.params.referenceFrequency, this.params.sampleRate, this.params.timeContinuity);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {pitch: 'the estimated pitch values [Hz]'}
   * @memberof MultiPitchMelodia
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof MultiPitchMelodia
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsMultiPitchMelodia) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm returns a single vector from a given number of real values and/or frames. Frames from different inputs are multiplexed onto a single stream in an alternating fashion. Check https://essentia.upf.edu/reference/std_Multiplexer.html for more details.
* @class
*/
class Multiplexer {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsMultiplexer = {
    numberRealInputs: 0,
    numberVectorRealInputs: 0,
  };
  private params: paramTypes.ParamsMultiplexer = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsMultiplexer} [params]
  */
  constructor(params: paramTypes.ParamsMultiplexer) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Multiplexer(this.params.numberRealInputs, this.params.numberVectorRealInputs);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsMultiplexer} [params]
   * @memberof Multiplexer
  */
  configure(params: paramTypes.ParamsMultiplexer) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.numberRealInputs, this.params.numberVectorRealInputs);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @returns {object} {data: 'the frame containing the input values and/or input frames'}
   * @memberof Multiplexer
  */
  compute() {
    return this.algoInstance.compute();
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Multiplexer
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsMultiplexer) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
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
*/
class NNLSChroma {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsNNLSChroma = {
    chromaNormalization: 'none',
    frameSize: 1025,
    sampleRate: 44100,
    spectralShape: 0.7,
    spectralWhitening: 1,
    tuningMode: 'global',
    useNNLS: true,
  };
  private params: paramTypes.ParamsNNLSChroma = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsNNLSChroma} [params]
  */
  constructor(params: paramTypes.ParamsNNLSChroma) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.NNLSChroma(this.params.chromaNormalization, this.params.frameSize, this.params.sampleRate, this.params.spectralShape, this.params.spectralWhitening, this.params.tuningMode, this.params.useNNLS);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsNNLSChroma} [params]
   * @memberof NNLSChroma
  */
  configure(params: paramTypes.ParamsNNLSChroma) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.chromaNormalization, this.params.frameSize, this.params.sampleRate, this.params.spectralShape, this.params.spectralWhitening, this.params.tuningMode, this.params.useNNLS);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} logSpectrogram log spectrum frames
   * @param {VectorFloat} meanTuning mean tuning frames
   * @param {VectorFloat} localTuning local tuning frames
   * @returns {object} {tunedLogfreqSpectrum: 'Log frequency spectrum after tuning', semitoneSpectrum: 'a spectral representation with one bin per semitone', bassChromagram: ' a 12-dimensional chromagram, restricted to the bass range', chromagram: 'a 12-dimensional chromagram, restricted with mid-range emphasis'}
   * @memberof NNLSChroma
  */
  compute(logSpectrogram: any, meanTuning: any, localTuning: any) {
    return this.algoInstance.compute(logSpectrogram, meanTuning, localTuning);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof NNLSChroma
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsNNLSChroma) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm adds noise to an input signal. The average energy of the noise in dB is defined by the level parameter, and is generated using the Mersenne Twister random number generator. Check https://essentia.upf.edu/reference/std_NoiseAdder.html for more details.
* @class
*/
class NoiseAdder {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsNoiseAdder = {
    fixSeed: false,
    level: -100,
  };
  private params: paramTypes.ParamsNoiseAdder = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsNoiseAdder} [params]
  */
  constructor(params: paramTypes.ParamsNoiseAdder) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.NoiseAdder(this.params.fixSeed, this.params.level);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsNoiseAdder} [params]
   * @memberof NoiseAdder
  */
  configure(params: paramTypes.ParamsNoiseAdder) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.fixSeed, this.params.level);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {signal: 'the output signal with the added noise'}
   * @memberof NoiseAdder
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof NoiseAdder
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsNoiseAdder) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm detects noise bursts in the waveform by thresholding  the peaks of the second derivative. The threshold is computed using an Exponential Moving Average filter over the RMS of the second derivative of the input frame. Check https://essentia.upf.edu/reference/std_NoiseBurstDetector.html for more details.
* @class
*/
class NoiseBurstDetector {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsNoiseBurstDetector = {
    alpha: 0.9,
    silenceThreshold: -50,
    threshold: 8,
  };
  private params: paramTypes.ParamsNoiseBurstDetector = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsNoiseBurstDetector} [params]
  */
  constructor(params: paramTypes.ParamsNoiseBurstDetector) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.NoiseBurstDetector(this.params.alpha, this.params.silenceThreshold, this.params.threshold);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsNoiseBurstDetector} [params]
   * @memberof NoiseBurstDetector
  */
  configure(params: paramTypes.ParamsNoiseBurstDetector) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.alpha, this.params.silenceThreshold, this.params.threshold);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input frame (must be non-empty)
   * @returns {object} {indexes: 'indexes of the noisy samples'}
   * @memberof NoiseBurstDetector
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof NoiseBurstDetector
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsNoiseBurstDetector) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the "novelty curve" (Grosche & Müller, 2009) onset detection function. The algorithm expects as an input a frame-wise sequence of frequency-bands energies or spectrum magnitudes as originally proposed in [1] (see FrequencyBands and Spectrum algorithms). Novelty in each band (or frequency bin) is computed as a derivative between log-compressed energy (magnitude) values in consequent frames. The overall novelty value is then computed as a weighted sum that can be configured using 'weightCurve' parameter. The resulting novelty curve can be used for beat tracking and onset detection (see BpmHistogram and Onsets). Check https://essentia.upf.edu/reference/std_NoveltyCurve.html for more details.
* @class
*/
class NoveltyCurve {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsNoveltyCurve = {
    frameRate: 344.531,
    normalize: false,
    weightCurve: arrayToVector([]),
    weightCurveType: 'hybrid',
  };
  private params: paramTypes.ParamsNoveltyCurve = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsNoveltyCurve} [params]
  */
  constructor(params: paramTypes.ParamsNoveltyCurve) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.NoveltyCurve(this.params.frameRate, this.params.normalize, this.params.weightCurve, this.params.weightCurveType);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsNoveltyCurve} [params]
   * @memberof NoveltyCurve
  */
  configure(params: paramTypes.ParamsNoveltyCurve) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameRate, this.params.normalize, this.params.weightCurve, this.params.weightCurveType);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} frequencyBands the frequency bands
   * @returns {object} {novelty: 'the novelty curve as a single vector'}
   * @memberof NoveltyCurve
  */
  compute(frequencyBands: any) {
    return this.algoInstance.compute(frequencyBands);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof NoveltyCurve
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsNoveltyCurve) {
    if (!params) return;
    if (params.weightCurve) {
      params.weightCurve = arrayToVector(params.weightCurve);
    }
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm outputs a histogram of the most probable bpms assuming the signal has constant tempo given the novelty curve. This algorithm is based on the autocorrelation of the novelty curve (see NoveltyCurve algorithm) and should only be used for signals that have a constant tempo or as a first tempo estimator to be used in conjunction with other algorithms such as BpmHistogram.It is a simplified version of the algorithm described in [1] as, in order to predict the best BPM candidate,  it computes autocorrelation of the entire novelty curve instead of analyzing it on frames and histogramming the peaks over frames. Check https://essentia.upf.edu/reference/std_NoveltyCurveFixedBpmEstimator.html for more details.
* @class
*/
class NoveltyCurveFixedBpmEstimator {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsNoveltyCurveFixedBpmEstimator = {
    hopSize: 512,
    maxBpm: 560,
    minBpm: 30,
    sampleRate: 44100,
    tolerance: 3,
  };
  private params: paramTypes.ParamsNoveltyCurveFixedBpmEstimator = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsNoveltyCurveFixedBpmEstimator} [params]
  */
  constructor(params: paramTypes.ParamsNoveltyCurveFixedBpmEstimator) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.NoveltyCurveFixedBpmEstimator(this.params.hopSize, this.params.maxBpm, this.params.minBpm, this.params.sampleRate, this.params.tolerance);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsNoveltyCurveFixedBpmEstimator} [params]
   * @memberof NoveltyCurveFixedBpmEstimator
  */
  configure(params: paramTypes.ParamsNoveltyCurveFixedBpmEstimator) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.hopSize, this.params.maxBpm, this.params.minBpm, this.params.sampleRate, this.params.tolerance);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} novelty the novelty curve of the audio signal
   * @returns {object} {bpms: 'the bpm candidates sorted by magnitude', amplitudes: 'the magnitude of each bpm candidate'}
   * @memberof NoveltyCurveFixedBpmEstimator
  */
  compute(novelty: any) {
    return this.algoInstance.compute(novelty);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof NoveltyCurveFixedBpmEstimator
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsNoveltyCurveFixedBpmEstimator) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the ratio between a signal's odd and even harmonic energy given the signal's harmonic peaks. The odd to even harmonic energy ratio is a measure allowing to distinguish odd-harmonic-energy predominant sounds (such as from a clarinet) from equally important even-harmonic-energy sounds (such as from a trumpet). The required harmonic frequencies and magnitudes can be computed by the HarmonicPeaks algorithm.
In the case when the even energy is zero, which may happen when only even harmonics where found or when only one peak was found, the algorithm outputs the maximum real number possible. Therefore, this algorithm should be used in conjunction with the harmonic peaks algorithm.
If no peaks are supplied, the algorithm outputs a value of one, assuming either the spectrum was flat or it was silent. Check https://essentia.upf.edu/reference/std_OddToEvenHarmonicEnergyRatio.html for more details.
* @class
*/
class OddToEvenHarmonicEnergyRatio {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsOddToEvenHarmonicEnergyRatio} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.OddToEvenHarmonicEnergyRatio();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsOddToEvenHarmonicEnergyRatio} [params]
   * @memberof OddToEvenHarmonicEnergyRatio
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frequencies the frequencies of the harmonic peaks (at least two frequencies in frequency ascending order)
   * @param {VectorFloat} magnitudes the magnitudes of the harmonic peaks (at least two magnitudes in frequency ascending order)
   * @returns {object} {oddToEvenHarmonicEnergyRatio: 'the ratio between the odd and even harmonic energies of the given harmonic peaks'}
   * @memberof OddToEvenHarmonicEnergyRatio
  */
  compute(frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(frequencies, magnitudes);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof OddToEvenHarmonicEnergyRatio
  */
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
*/
class OnsetDetection {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsOnsetDetection = {
    method: 'hfc',
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsOnsetDetection = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsOnsetDetection} [params]
  */
  constructor(params: paramTypes.ParamsOnsetDetection) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.OnsetDetection(this.params.method, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsOnsetDetection} [params]
   * @memberof OnsetDetection
  */
  configure(params: paramTypes.ParamsOnsetDetection) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.method, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input spectrum
   * @param {VectorFloat} phase the phase vector corresponding to this spectrum (used only by the "complex" method)
   * @returns {object} {onsetDetection: 'the value of the detection function in the current frame'}
   * @memberof OnsetDetection
  */
  compute(spectrum: any, phase: any) {
    return this.algoInstance.compute(spectrum, phase);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof OnsetDetection
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsOnsetDetection) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
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
*/
class OnsetDetectionGlobal {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsOnsetDetectionGlobal = {
    frameSize: 2048,
    hopSize: 512,
    method: 'infogain',
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsOnsetDetectionGlobal = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsOnsetDetectionGlobal} [params]
  */
  constructor(params: paramTypes.ParamsOnsetDetectionGlobal) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.OnsetDetectionGlobal(this.params.frameSize, this.params.hopSize, this.params.method, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsOnsetDetectionGlobal} [params]
   * @memberof OnsetDetectionGlobal
  */
  configure(params: paramTypes.ParamsOnsetDetectionGlobal) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.hopSize, this.params.method, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {onsetDetections: 'the frame-wise values of the detection function'}
   * @memberof OnsetDetectionGlobal
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof OnsetDetectionGlobal
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsOnsetDetectionGlobal) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the number of onsets per second and their position in time for an audio signal. Onset detection functions are computed using both high frequency content and complex-domain methods available in OnsetDetection algorithm. See OnsetDetection for more information.
Please note that due to a dependence on the Onsets algorithm, this algorithm is only valid for audio signals with a sampling rate of 44100Hz.
This algorithm throws an exception if the input signal is empty. Check https://essentia.upf.edu/reference/std_OnsetRate.html for more details.
* @class
*/
class OnsetRate {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsOnsetRate} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.OnsetRate();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsOnsetRate} [params]
   * @memberof OnsetRate
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {onsets: 'the positions of detected onsets [s]', onsetRate: 'the number of onsets per second'}
   * @memberof OnsetRate
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof OnsetRate
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm returns the output of an overlap-add process for a sequence of frames of an audio signal. It considers that the input audio frames are windowed audio signals. Giving the size of the frame and the hop size, overlapping and adding consecutive frames will produce a continuous signal. A normalization gain can be passed as a parameter. Check https://essentia.upf.edu/reference/std_OverlapAdd.html for more details.
* @class
*/
class OverlapAdd {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsOverlapAdd = {
    frameSize: 2048,
    gain: 1,
    hopSize: 128,
  };
  private params: paramTypes.ParamsOverlapAdd = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsOverlapAdd} [params]
  */
  constructor(params: paramTypes.ParamsOverlapAdd) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.OverlapAdd(this.params.frameSize, this.params.gain, this.params.hopSize);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsOverlapAdd} [params]
   * @memberof OverlapAdd
  */
  configure(params: paramTypes.ParamsOverlapAdd) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.gain, this.params.hopSize);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the windowed input audio frame
   * @returns {object} {signal: 'the output overlap-add audio signal frame'}
   * @memberof OverlapAdd
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof OverlapAdd
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsOverlapAdd) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm detects local maxima (peaks) in an array. The algorithm finds positive slopes and detects a peak when the slope changes sign and the peak is above the threshold.
It optionally interpolates using parabolic curve fitting.
When two consecutive peaks are closer than the `minPeakDistance` parameter, the smallest one is discarded. A value of 0 bypasses this feature. Check https://essentia.upf.edu/reference/std_PeakDetection.html for more details.
* @class
*/
class PeakDetection {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPeakDetection = {
    interpolate: true,
    maxPeaks: 100,
    maxPosition: 1,
    minPeakDistance: 0,
    minPosition: 0,
    orderBy: 'position',
    range: 1,
    threshold: -1e+06,
  };
  private params: paramTypes.ParamsPeakDetection = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPeakDetection} [params]
  */
  constructor(params: paramTypes.ParamsPeakDetection) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PeakDetection(this.params.interpolate, this.params.maxPeaks, this.params.maxPosition, this.params.minPeakDistance, this.params.minPosition, this.params.orderBy, this.params.range, this.params.threshold);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPeakDetection} [params]
   * @memberof PeakDetection
  */
  configure(params: paramTypes.ParamsPeakDetection) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.interpolate, this.params.maxPeaks, this.params.maxPosition, this.params.minPeakDistance, this.params.minPosition, this.params.orderBy, this.params.range, this.params.threshold);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {positions: 'the positions of the peaks', amplitudes: 'the amplitudes of the peaks'}
   * @memberof PeakDetection
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PeakDetection
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPeakDetection) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates the tempo in beats per minute (BPM) from an input signal as described in [1]. Check https://essentia.upf.edu/reference/std_PercivalBpmEstimator.html for more details.
* @class
*/
class PercivalBpmEstimator {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPercivalBpmEstimator = {
    frameSize: 1024,
    frameSizeOSS: 2048,
    hopSize: 128,
    hopSizeOSS: 128,
    maxBPM: 210,
    minBPM: 50,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsPercivalBpmEstimator = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPercivalBpmEstimator} [params]
  */
  constructor(params: paramTypes.ParamsPercivalBpmEstimator) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PercivalBpmEstimator(this.params.frameSize, this.params.frameSizeOSS, this.params.hopSize, this.params.hopSizeOSS, this.params.maxBPM, this.params.minBPM, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPercivalBpmEstimator} [params]
   * @memberof PercivalBpmEstimator
  */
  configure(params: paramTypes.ParamsPercivalBpmEstimator) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.frameSizeOSS, this.params.hopSize, this.params.hopSizeOSS, this.params.maxBPM, this.params.minBPM, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal input signal
   * @returns {object} {bpm: 'the tempo estimation [bpm]'}
   * @memberof PercivalBpmEstimator
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PercivalBpmEstimator
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPercivalBpmEstimator) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm implements the 'Enhance Harmonics' step as described in [1].Given an input autocorrelation signal, two time-stretched versions of it scaled by factors of 2 and 4 are added to the original.For more details check the referenced paper. Check https://essentia.upf.edu/reference/std_PercivalEnhanceHarmonics.html for more details.
* @class
*/
class PercivalEnhanceHarmonics {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPercivalEnhanceHarmonics} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.PercivalEnhanceHarmonics();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPercivalEnhanceHarmonics} [params]
   * @memberof PercivalEnhanceHarmonics
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input signal
   * @returns {object} {array: 'the input signal with enhanced harmonics'}
   * @memberof PercivalEnhanceHarmonics
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PercivalEnhanceHarmonics
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm implements the 'Evaluate Pulse Trains' step as described in [1].Given an input onset detection function (ODF, called "onset strength signal", OSS, in the original paper) and a number of candidate BPM peak positions, the ODF is correlated with ideal expected pulse trains (for each candidate tempo lag) shifted in time by different amounts.The candidate tempo lag that generates a periodic pulse train with the best correlation to the ODF is returned as the best tempo estimate.
For more details check the referenced paper.Please note that in the original paper, the term OSS (Onset Strength Signal) is used instead of ODF. Check https://essentia.upf.edu/reference/std_PercivalEvaluatePulseTrains.html for more details.
* @class
*/
class PercivalEvaluatePulseTrains {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPercivalEvaluatePulseTrains} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.PercivalEvaluatePulseTrains();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPercivalEvaluatePulseTrains} [params]
   * @memberof PercivalEvaluatePulseTrains
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} oss onset strength signal (or other novelty curve)
   * @param {VectorFloat} positions peak positions of BPM candidates
   * @returns {object} {lag: 'best tempo lag estimate'}
   * @memberof PercivalEvaluatePulseTrains
  */
  compute(oss: any, positions: any) {
    return this.algoInstance.compute(oss, positions);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PercivalEvaluatePulseTrains
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm converts a pitch sequence estimated from an audio signal into a set of discrete note events. Each note is defined by its onset time, duration and MIDI pitch value, quantized to the equal tempered scale. Check https://essentia.upf.edu/reference/std_PitchContourSegmentation.html for more details.
* @class
*/
class PitchContourSegmentation {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPitchContourSegmentation = {
    hopSize: 128,
    minDuration: 0.1,
    pitchDistanceThreshold: 60,
    rmsThreshold: -2,
    sampleRate: 44100,
    tuningFrequency: 440,
  };
  private params: paramTypes.ParamsPitchContourSegmentation = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPitchContourSegmentation} [params]
  */
  constructor(params: paramTypes.ParamsPitchContourSegmentation) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PitchContourSegmentation(this.params.hopSize, this.params.minDuration, this.params.pitchDistanceThreshold, this.params.rmsThreshold, this.params.sampleRate, this.params.tuningFrequency);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPitchContourSegmentation} [params]
   * @memberof PitchContourSegmentation
  */
  configure(params: paramTypes.ParamsPitchContourSegmentation) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.hopSize, this.params.minDuration, this.params.pitchDistanceThreshold, this.params.rmsThreshold, this.params.sampleRate, this.params.tuningFrequency);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} pitch estimated pitch contour [Hz]
   * @param {VectorFloat} signal input audio signal
   * @returns {object} {onset: 'note onset times [s]', duration: 'note durations [s]', MIDIpitch: 'quantized MIDI pitch value'}
   * @memberof PitchContourSegmentation
  */
  compute(pitch: any, signal: any) {
    return this.algoInstance.compute(pitch, signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PitchContourSegmentation
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPitchContourSegmentation) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm tracks a set of predominant pitch contours of an audio signal. This algorithm is intended to receive its "frequencies" and "magnitudes" inputs from the PitchSalienceFunctionPeaks algorithm outputs aggregated over all frames in the sequence. The output is a vector of estimated melody pitch values. Check https://essentia.upf.edu/reference/std_PitchContours.html for more details.
* @class
*/
class PitchContours {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPitchContours = {
    binResolution: 10,
    hopSize: 128,
    minDuration: 100,
    peakDistributionThreshold: 0.9,
    peakFrameThreshold: 0.9,
    pitchContinuity: 27.5625,
    sampleRate: 44100,
    timeContinuity: 100,
  };
  private params: paramTypes.ParamsPitchContours = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPitchContours} [params]
  */
  constructor(params: paramTypes.ParamsPitchContours) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PitchContours(this.params.binResolution, this.params.hopSize, this.params.minDuration, this.params.peakDistributionThreshold, this.params.peakFrameThreshold, this.params.pitchContinuity, this.params.sampleRate, this.params.timeContinuity);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPitchContours} [params]
   * @memberof PitchContours
  */
  configure(params: paramTypes.ParamsPitchContours) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binResolution, this.params.hopSize, this.params.minDuration, this.params.peakDistributionThreshold, this.params.peakFrameThreshold, this.params.pitchContinuity, this.params.sampleRate, this.params.timeContinuity);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} peakBins frame-wise array of cent bins corresponding to pitch salience function peaks
   * @param {VectorVectorFloat} peakSaliences frame-wise array of values of salience function peaks
   * @returns {object} {contoursBins: 'array of frame-wise vectors of cent bin values representing each contour', contoursSaliences: 'array of frame-wise vectors of pitch saliences representing each contour', contoursStartTimes: 'array of start times of each contour [s]', duration: 'time duration of the input signal [s]'}
   * @memberof PitchContours
  */
  compute(peakBins: any, peakSaliences: any) {
    return this.algoInstance.compute(peakBins, peakSaliences);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PitchContours
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPitchContours) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm converts a set of pitch contours into a sequence of predominant f0 values in Hz by taking the value of the most predominant contour in each frame.
This algorithm is intended to receive its "contoursBins", "contoursSaliences", and "contoursStartTimes" inputs from the PitchContours algorithm. The "duration" input corresponds to the time duration of the input signal. The output is a vector of estimated pitch values and a vector of confidence values. Check https://essentia.upf.edu/reference/std_PitchContoursMelody.html for more details.
* @class
*/
class PitchContoursMelody {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPitchContoursMelody = {
    binResolution: 10,
    filterIterations: 3,
    guessUnvoiced: false,
    hopSize: 128,
    maxFrequency: 20000,
    minFrequency: 80,
    referenceFrequency: 55,
    sampleRate: 44100,
    voiceVibrato: false,
    voicingTolerance: 0.2,
  };
  private params: paramTypes.ParamsPitchContoursMelody = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPitchContoursMelody} [params]
  */
  constructor(params: paramTypes.ParamsPitchContoursMelody) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PitchContoursMelody(this.params.binResolution, this.params.filterIterations, this.params.guessUnvoiced, this.params.hopSize, this.params.maxFrequency, this.params.minFrequency, this.params.referenceFrequency, this.params.sampleRate, this.params.voiceVibrato, this.params.voicingTolerance);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPitchContoursMelody} [params]
   * @memberof PitchContoursMelody
  */
  configure(params: paramTypes.ParamsPitchContoursMelody) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binResolution, this.params.filterIterations, this.params.guessUnvoiced, this.params.hopSize, this.params.maxFrequency, this.params.minFrequency, this.params.referenceFrequency, this.params.sampleRate, this.params.voiceVibrato, this.params.voicingTolerance);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} contoursBins array of frame-wise vectors of cent bin values representing each contour
   * @param {VectorVectorFloat} contoursSaliences array of frame-wise vectors of pitch saliences representing each contour
   * @param {VectorFloat} contoursStartTimes array of the start times of each contour [s]
   * @param {number} duration time duration of the input signal [s]
   * @returns {object} {pitch: 'vector of estimated pitch values (i.e., melody) [Hz]', pitchConfidence: 'confidence with which the pitch was detected'}
   * @memberof PitchContoursMelody
  */
  compute(contoursBins: any, contoursSaliences: any, contoursStartTimes: any, duration: number) {
    return this.algoInstance.compute(contoursBins, contoursSaliences, contoursStartTimes, duration);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PitchContoursMelody
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPitchContoursMelody) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm converts a set of pitch contours into a sequence of f0 values in Hz by taking the value of the most salient contour in each frame.
In contrast to pitchContoursMelody, it assumes a single source. 
This algorithm is intended to receive its "contoursBins", "contoursSaliences", and "contoursStartTimes" inputs from the PitchContours algorithm. The "duration" input corresponds to the time duration of the input signal. The output is a vector of estimated pitch values and a vector of confidence values. Check https://essentia.upf.edu/reference/std_PitchContoursMonoMelody.html for more details.
* @class
*/
class PitchContoursMonoMelody {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPitchContoursMonoMelody = {
    binResolution: 10,
    filterIterations: 3,
    guessUnvoiced: false,
    hopSize: 128,
    maxFrequency: 20000,
    minFrequency: 80,
    referenceFrequency: 55,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsPitchContoursMonoMelody = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPitchContoursMonoMelody} [params]
  */
  constructor(params: paramTypes.ParamsPitchContoursMonoMelody) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PitchContoursMonoMelody(this.params.binResolution, this.params.filterIterations, this.params.guessUnvoiced, this.params.hopSize, this.params.maxFrequency, this.params.minFrequency, this.params.referenceFrequency, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPitchContoursMonoMelody} [params]
   * @memberof PitchContoursMonoMelody
  */
  configure(params: paramTypes.ParamsPitchContoursMonoMelody) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binResolution, this.params.filterIterations, this.params.guessUnvoiced, this.params.hopSize, this.params.maxFrequency, this.params.minFrequency, this.params.referenceFrequency, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} contoursBins array of frame-wise vectors of cent bin values representing each contour
   * @param {VectorVectorFloat} contoursSaliences array of frame-wise vectors of pitch saliences representing each contour
   * @param {VectorFloat} contoursStartTimes array of the start times of each contour [s]
   * @param {number} duration time duration of the input signal [s]
   * @returns {object} {pitch: 'vector of estimated pitch values (i.e., melody) [Hz]', pitchConfidence: 'confidence with which the pitch was detected'}
   * @memberof PitchContoursMonoMelody
  */
  compute(contoursBins: any, contoursSaliences: any, contoursStartTimes: any, duration: number) {
    return this.algoInstance.compute(contoursBins, contoursSaliences, contoursStartTimes, duration);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PitchContoursMonoMelody
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPitchContoursMonoMelody) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm post-processes a set of pitch contours into a sequence of mutliple f0 values in Hz.
This algorithm is intended to receive its "contoursBins", "contoursSaliences", and "contoursStartTimes" inputs from the PitchContours algorithm. The "duration" input corresponds to the time duration of the input signal. The output is a vector of estimated pitch values Check https://essentia.upf.edu/reference/std_PitchContoursMultiMelody.html for more details.
* @class
*/
class PitchContoursMultiMelody {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPitchContoursMultiMelody = {
    binResolution: 10,
    filterIterations: 3,
    guessUnvoiced: false,
    hopSize: 128,
    maxFrequency: 20000,
    minFrequency: 80,
    referenceFrequency: 55,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsPitchContoursMultiMelody = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPitchContoursMultiMelody} [params]
  */
  constructor(params: paramTypes.ParamsPitchContoursMultiMelody) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PitchContoursMultiMelody(this.params.binResolution, this.params.filterIterations, this.params.guessUnvoiced, this.params.hopSize, this.params.maxFrequency, this.params.minFrequency, this.params.referenceFrequency, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPitchContoursMultiMelody} [params]
   * @memberof PitchContoursMultiMelody
  */
  configure(params: paramTypes.ParamsPitchContoursMultiMelody) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binResolution, this.params.filterIterations, this.params.guessUnvoiced, this.params.hopSize, this.params.maxFrequency, this.params.minFrequency, this.params.referenceFrequency, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} contoursBins array of frame-wise vectors of cent bin values representing each contour
   * @param {VectorVectorFloat} contoursSaliences array of frame-wise vectors of pitch saliences representing each contour
   * @param {VectorFloat} contoursStartTimes array of the start times of each contour [s]
   * @param {number} duration time duration of the input signal [s]
   * @returns {object} {pitch: 'vector of estimated pitch values (i.e., melody) [Hz]'}
   * @memberof PitchContoursMultiMelody
  */
  compute(contoursBins: any, contoursSaliences: any, contoursStartTimes: any, duration: number) {
    return this.algoInstance.compute(contoursBins, contoursSaliences, contoursStartTimes, duration);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PitchContoursMultiMelody
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPitchContoursMultiMelody) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm corrects the fundamental frequency estimations for a sequence of frames given pitch values together with their confidence values. In particular, it removes non-confident parts and spurious jumps in pitch and applies octave corrections. Check https://essentia.upf.edu/reference/std_PitchFilter.html for more details.
* @class
*/
class PitchFilter {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPitchFilter = {
    confidenceThreshold: 36,
    minChunkSize: 30,
    useAbsolutePitchConfidence: false,
  };
  private params: paramTypes.ParamsPitchFilter = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPitchFilter} [params]
  */
  constructor(params: paramTypes.ParamsPitchFilter) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PitchFilter(this.params.confidenceThreshold, this.params.minChunkSize, this.params.useAbsolutePitchConfidence);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPitchFilter} [params]
   * @memberof PitchFilter
  */
  configure(params: paramTypes.ParamsPitchFilter) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.confidenceThreshold, this.params.minChunkSize, this.params.useAbsolutePitchConfidence);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} pitch vector of pitch values for the input frames [Hz]
   * @param {VectorFloat} pitchConfidence vector of pitch confidence values for the input frames
   * @returns {object} {pitchFiltered: 'vector of corrected pitch values [Hz]'}
   * @memberof PitchFilter
  */
  compute(pitch: any, pitchConfidence: any) {
    return this.algoInstance.compute(pitch, pitchConfidence);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PitchFilter
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPitchFilter) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates the fundamental frequency corresponding to the melody of a monophonic music signal based on the MELODIA algorithm. While the algorithm is originally designed to extract the predominant melody from polyphonic music [1], this implementation is adapted for monophonic signals. The approach is based on the creation and characterization of pitch contours, time continuous sequences of pitch candidates grouped using auditory streaming cues. To this end, PitchSalienceFunction, PitchSalienceFunctionPeaks, PitchContours, and PitchContoursMonoMelody algorithms are employed. It is strongly advised to use the default parameter values which are optimized according to [1] (where further details are provided) except for minFrequency and maxFrequency, which will depend on your application. Check https://essentia.upf.edu/reference/std_PitchMelodia.html for more details.
* @class
*/
class PitchMelodia {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPitchMelodia = {
    binResolution: 10,
    filterIterations: 3,
    frameSize: 2048,
    guessUnvoiced: false,
    harmonicWeight: 0.8,
    hopSize: 128,
    magnitudeCompression: 1,
    magnitudeThreshold: 40,
    maxFrequency: 20000,
    minDuration: 100,
    minFrequency: 40,
    numberHarmonics: 20,
    peakDistributionThreshold: 0.9,
    peakFrameThreshold: 0.9,
    pitchContinuity: 27.5625,
    referenceFrequency: 55,
    sampleRate: 44100,
    timeContinuity: 100,
  };
  private params: paramTypes.ParamsPitchMelodia = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPitchMelodia} [params]
  */
  constructor(params: paramTypes.ParamsPitchMelodia) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PitchMelodia(this.params.binResolution, this.params.filterIterations, this.params.frameSize, this.params.guessUnvoiced, this.params.harmonicWeight, this.params.hopSize, this.params.magnitudeCompression, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.minDuration, this.params.minFrequency, this.params.numberHarmonics, this.params.peakDistributionThreshold, this.params.peakFrameThreshold, this.params.pitchContinuity, this.params.referenceFrequency, this.params.sampleRate, this.params.timeContinuity);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPitchMelodia} [params]
   * @memberof PitchMelodia
  */
  configure(params: paramTypes.ParamsPitchMelodia) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binResolution, this.params.filterIterations, this.params.frameSize, this.params.guessUnvoiced, this.params.harmonicWeight, this.params.hopSize, this.params.magnitudeCompression, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.minDuration, this.params.minFrequency, this.params.numberHarmonics, this.params.peakDistributionThreshold, this.params.peakFrameThreshold, this.params.pitchContinuity, this.params.referenceFrequency, this.params.sampleRate, this.params.timeContinuity);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {pitch: 'the estimated pitch values [Hz]', pitchConfidence: 'confidence with which the pitch was detected'}
   * @memberof PitchMelodia
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PitchMelodia
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPitchMelodia) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the pitch salience of a spectrum. The pitch salience is given by the ratio of the highest auto correlation value of the spectrum to the non-shifted auto correlation value. Pitch salience was designed as quick measure of tone sensation. Unpitched sounds (non-musical sound effects) and pure tones have an average pitch salience value close to 0 whereas sounds containing several harmonics in the spectrum tend to have a higher value. Check https://essentia.upf.edu/reference/std_PitchSalience.html for more details.
* @class
*/
class PitchSalience {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPitchSalience = {
    highBoundary: 5000,
    lowBoundary: 100,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsPitchSalience = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPitchSalience} [params]
  */
  constructor(params: paramTypes.ParamsPitchSalience) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PitchSalience(this.params.highBoundary, this.params.lowBoundary, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPitchSalience} [params]
   * @memberof PitchSalience
  */
  configure(params: paramTypes.ParamsPitchSalience) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.highBoundary, this.params.lowBoundary, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input audio spectrum
   * @returns {object} {pitchSalience: 'the pitch salience (normalized from 0 to 1)'}
   * @memberof PitchSalience
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PitchSalience
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPitchSalience) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the pitch salience function of a signal frame given its spectral peaks. The salience function covers a pitch range of nearly five octaves (i.e., 6000 cents), starting from the "referenceFrequency", and is quantized into cent bins according to the specified "binResolution". The salience of a given frequency is computed as the sum of the weighted energies found at integer multiples (harmonics) of that frequency.  Check https://essentia.upf.edu/reference/std_PitchSalienceFunction.html for more details.
* @class
*/
class PitchSalienceFunction {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPitchSalienceFunction = {
    binResolution: 10,
    harmonicWeight: 0.8,
    magnitudeCompression: 1,
    magnitudeThreshold: 40,
    numberHarmonics: 20,
    referenceFrequency: 55,
  };
  private params: paramTypes.ParamsPitchSalienceFunction = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPitchSalienceFunction} [params]
  */
  constructor(params: paramTypes.ParamsPitchSalienceFunction) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PitchSalienceFunction(this.params.binResolution, this.params.harmonicWeight, this.params.magnitudeCompression, this.params.magnitudeThreshold, this.params.numberHarmonics, this.params.referenceFrequency);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPitchSalienceFunction} [params]
   * @memberof PitchSalienceFunction
  */
  configure(params: paramTypes.ParamsPitchSalienceFunction) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binResolution, this.params.harmonicWeight, this.params.magnitudeCompression, this.params.magnitudeThreshold, this.params.numberHarmonics, this.params.referenceFrequency);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frequencies the frequencies of the spectral peaks [Hz]
   * @param {VectorFloat} magnitudes the magnitudes of the spectral peaks
   * @returns {object} {salienceFunction: 'array of the quantized pitch salience values'}
   * @memberof PitchSalienceFunction
  */
  compute(frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(frequencies, magnitudes);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PitchSalienceFunction
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPitchSalienceFunction) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the peaks of a given pitch salience function. Check https://essentia.upf.edu/reference/std_PitchSalienceFunctionPeaks.html for more details.
* @class
*/
class PitchSalienceFunctionPeaks {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPitchSalienceFunctionPeaks = {
    binResolution: 10,
    maxFrequency: 1760,
    minFrequency: 55,
    referenceFrequency: 55,
  };
  private params: paramTypes.ParamsPitchSalienceFunctionPeaks = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPitchSalienceFunctionPeaks} [params]
  */
  constructor(params: paramTypes.ParamsPitchSalienceFunctionPeaks) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PitchSalienceFunctionPeaks(this.params.binResolution, this.params.maxFrequency, this.params.minFrequency, this.params.referenceFrequency);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPitchSalienceFunctionPeaks} [params]
   * @memberof PitchSalienceFunctionPeaks
  */
  configure(params: paramTypes.ParamsPitchSalienceFunctionPeaks) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binResolution, this.params.maxFrequency, this.params.minFrequency, this.params.referenceFrequency);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} salienceFunction the array of salience function values corresponding to cent frequency bins
   * @returns {object} {salienceBins: 'the cent bins corresponding to salience function peaks', salienceValues: 'the values of salience function peaks'}
   * @memberof PitchSalienceFunctionPeaks
  */
  compute(salienceFunction: any) {
    return this.algoInstance.compute(salienceFunction);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PitchSalienceFunctionPeaks
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPitchSalienceFunctionPeaks) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates the fundamental frequency given the frame of a monophonic music signal. It is an implementation of the Yin algorithm [1] for computations in the time domain. Check https://essentia.upf.edu/reference/std_PitchYin.html for more details.
* @class
*/
class PitchYin {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPitchYin = {
    frameSize: 2048,
    interpolate: true,
    maxFrequency: 22050,
    minFrequency: 20,
    sampleRate: 44100,
    tolerance: 0.15,
  };
  private params: paramTypes.ParamsPitchYin = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPitchYin} [params]
  */
  constructor(params: paramTypes.ParamsPitchYin) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PitchYin(this.params.frameSize, this.params.interpolate, this.params.maxFrequency, this.params.minFrequency, this.params.sampleRate, this.params.tolerance);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPitchYin} [params]
   * @memberof PitchYin
  */
  configure(params: paramTypes.ParamsPitchYin) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.interpolate, this.params.maxFrequency, this.params.minFrequency, this.params.sampleRate, this.params.tolerance);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal frame
   * @returns {object} {pitch: 'detected pitch [Hz]', pitchConfidence: 'confidence with which the pitch was detected [0,1]'}
   * @memberof PitchYin
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PitchYin
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPitchYin) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates the fundamental frequency given the spectrum of a monophonic music signal. It is an implementation of YinFFT algorithm [1], which is an optimized version of Yin algorithm for computation in the frequency domain. It is recommended to window the input spectrum with a Hann window. The raw spectrum can be computed with the Spectrum algorithm. Check https://essentia.upf.edu/reference/std_PitchYinFFT.html for more details.
* @class
*/
class PitchYinFFT {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPitchYinFFT = {
    frameSize: 2048,
    interpolate: true,
    maxFrequency: 22050,
    minFrequency: 20,
    sampleRate: 44100,
    tolerance: 1,
  };
  private params: paramTypes.ParamsPitchYinFFT = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPitchYinFFT} [params]
  */
  constructor(params: paramTypes.ParamsPitchYinFFT) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PitchYinFFT(this.params.frameSize, this.params.interpolate, this.params.maxFrequency, this.params.minFrequency, this.params.sampleRate, this.params.tolerance);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPitchYinFFT} [params]
   * @memberof PitchYinFFT
  */
  configure(params: paramTypes.ParamsPitchYinFFT) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.interpolate, this.params.maxFrequency, this.params.minFrequency, this.params.sampleRate, this.params.tolerance);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input spectrum (preferably created with a hann window)
   * @returns {object} {pitch: 'detected pitch [Hz]', pitchConfidence: 'confidence with which the pitch was detected [0,1]'}
   * @memberof PitchYinFFT
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PitchYinFFT
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPitchYinFFT) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the pitch track of a mono audio signal using probabilistic Yin algorithm. Check https://essentia.upf.edu/reference/std_PitchYinProbabilistic.html for more details.
* @class
*/
class PitchYinProbabilistic {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPitchYinProbabilistic = {
    frameSize: 2048,
    hopSize: 256,
    lowRMSThreshold: 0.1,
    outputUnvoiced: 'negative',
    preciseTime: false,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsPitchYinProbabilistic = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPitchYinProbabilistic} [params]
  */
  constructor(params: paramTypes.ParamsPitchYinProbabilistic) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PitchYinProbabilistic(this.params.frameSize, this.params.hopSize, this.params.lowRMSThreshold, this.params.outputUnvoiced, this.params.preciseTime, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPitchYinProbabilistic} [params]
   * @memberof PitchYinProbabilistic
  */
  configure(params: paramTypes.ParamsPitchYinProbabilistic) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.hopSize, this.params.lowRMSThreshold, this.params.outputUnvoiced, this.params.preciseTime, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input mono audio signal
   * @returns {object} {pitch: 'the output pitch estimations', voicedProbabilities: 'the voiced probabilities'}
   * @memberof PitchYinProbabilistic
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PitchYinProbabilistic
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPitchYinProbabilistic) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates the fundamental frequencies, their probabilities given the frame of a monophonic music signal. It is a part of the implementation of the probabilistic Yin algorithm [1]. Check https://essentia.upf.edu/reference/std_PitchYinProbabilities.html for more details.
* @class
*/
class PitchYinProbabilities {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPitchYinProbabilities = {
    frameSize: 2048,
    lowAmp: 0.1,
    preciseTime: false,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsPitchYinProbabilities = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPitchYinProbabilities} [params]
  */
  constructor(params: paramTypes.ParamsPitchYinProbabilities) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PitchYinProbabilities(this.params.frameSize, this.params.lowAmp, this.params.preciseTime, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPitchYinProbabilities} [params]
   * @memberof PitchYinProbabilities
  */
  configure(params: paramTypes.ParamsPitchYinProbabilities) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.lowAmp, this.params.preciseTime, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal frame
   * @returns {object} {pitch: 'the output pitch candidate frequencies in cents', probabilities: 'the output pitch candidate probabilities', RMS: 'the output RMS value'}
   * @memberof PitchYinProbabilities
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PitchYinProbabilities
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPitchYinProbabilities) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates the smoothed fundamental frequency given the pitch candidates and probabilities using hidden Markov models. It is a part of the implementation of the probabilistic Yin algorithm [1]. Check https://essentia.upf.edu/reference/std_PitchYinProbabilitiesHMM.html for more details.
* @class
*/
class PitchYinProbabilitiesHMM {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPitchYinProbabilitiesHMM = {
    minFrequency: 61.735,
    numberBinsPerSemitone: 5,
    selfTransition: 0.99,
    yinTrust: 0.5,
  };
  private params: paramTypes.ParamsPitchYinProbabilitiesHMM = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPitchYinProbabilitiesHMM} [params]
  */
  constructor(params: paramTypes.ParamsPitchYinProbabilitiesHMM) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PitchYinProbabilitiesHMM(this.params.minFrequency, this.params.numberBinsPerSemitone, this.params.selfTransition, this.params.yinTrust);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPitchYinProbabilitiesHMM} [params]
   * @memberof PitchYinProbabilitiesHMM
  */
  configure(params: paramTypes.ParamsPitchYinProbabilitiesHMM) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.minFrequency, this.params.numberBinsPerSemitone, this.params.selfTransition, this.params.yinTrust);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} pitchCandidates the pitch candidates
   * @param {VectorVectorFloat} probabilities the pitch probabilities
   * @returns {object} {pitch: 'pitch frequencies in Hz'}
   * @memberof PitchYinProbabilitiesHMM
  */
  compute(pitchCandidates: any, probabilities: any) {
    return this.algoInstance.compute(pitchCandidates, probabilities);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PitchYinProbabilitiesHMM
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPitchYinProbabilitiesHMM) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the power mean of an array. It accepts one parameter, p, which is the power (or order or degree) of the Power Mean. Note that if p=-1, the Power Mean is equal to the Harmonic Mean, if p=0, the Power Mean is equal to the Geometric Mean, if p=1, the Power Mean is equal to the Arithmetic Mean, if p=2, the Power Mean is equal to the Root Mean Square. Check https://essentia.upf.edu/reference/std_PowerMean.html for more details.
* @class
*/
class PowerMean {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPowerMean = {
    power: 1,
  };
  private params: paramTypes.ParamsPowerMean = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPowerMean} [params]
  */
  constructor(params: paramTypes.ParamsPowerMean) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PowerMean(this.params.power);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPowerMean} [params]
   * @memberof PowerMean
  */
  configure(params: paramTypes.ParamsPowerMean) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.power);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array (must contain only positive real numbers)
   * @returns {object} {powerMean: 'the power mean of the input array'}
   * @memberof PowerMean
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PowerMean
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPowerMean) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the power spectrum of an array of Reals. The resulting power spectrum has a size which is half the size of the input array plus one. Bins contain squared magnitude values. Check https://essentia.upf.edu/reference/std_PowerSpectrum.html for more details.
* @class
*/
class PowerSpectrum {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPowerSpectrum = {
    size: 2048,
  };
  private params: paramTypes.ParamsPowerSpectrum = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPowerSpectrum} [params]
  */
  constructor(params: paramTypes.ParamsPowerSpectrum) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PowerSpectrum(this.params.size);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPowerSpectrum} [params]
   * @memberof PowerSpectrum
  */
  configure(params: paramTypes.ParamsPowerSpectrum) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.size);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {powerSpectrum: 'power spectrum of the input signal'}
   * @memberof PowerSpectrum
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PowerSpectrum
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPowerSpectrum) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates the fundamental frequency of the predominant melody from polyphonic music signals using the MELODIA algorithm. It is specifically suited for music with a predominent melodic element, for example the singing voice melody in an accompanied singing recording. The approach [1] is based on the creation and characterization of pitch contours, time continuous sequences of pitch candidates grouped using auditory streaming cues. It furthermore determines for each frame, if the predominant melody is present or not. To this end, PitchSalienceFunction, PitchSalienceFunctionPeaks, PitchContours, and PitchContoursMelody algorithms are employed. It is strongly advised to use the default parameter values which are optimized according to [1] (where further details are provided) except for minFrequency, maxFrequency, and voicingTolerance, which will depend on your application. Check https://essentia.upf.edu/reference/std_PredominantPitchMelodia.html for more details.
* @class
*/
class PredominantPitchMelodia {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsPredominantPitchMelodia = {
    binResolution: 10,
    filterIterations: 3,
    frameSize: 2048,
    guessUnvoiced: false,
    harmonicWeight: 0.8,
    hopSize: 128,
    magnitudeCompression: 1,
    magnitudeThreshold: 40,
    maxFrequency: 20000,
    minDuration: 100,
    minFrequency: 80,
    numberHarmonics: 20,
    peakDistributionThreshold: 0.9,
    peakFrameThreshold: 0.9,
    pitchContinuity: 27.5625,
    referenceFrequency: 55,
    sampleRate: 44100,
    timeContinuity: 100,
    voiceVibrato: false,
    voicingTolerance: 0.2,
  };
  private params: paramTypes.ParamsPredominantPitchMelodia = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsPredominantPitchMelodia} [params]
  */
  constructor(params: paramTypes.ParamsPredominantPitchMelodia) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.PredominantPitchMelodia(this.params.binResolution, this.params.filterIterations, this.params.frameSize, this.params.guessUnvoiced, this.params.harmonicWeight, this.params.hopSize, this.params.magnitudeCompression, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.minDuration, this.params.minFrequency, this.params.numberHarmonics, this.params.peakDistributionThreshold, this.params.peakFrameThreshold, this.params.pitchContinuity, this.params.referenceFrequency, this.params.sampleRate, this.params.timeContinuity, this.params.voiceVibrato, this.params.voicingTolerance);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsPredominantPitchMelodia} [params]
   * @memberof PredominantPitchMelodia
  */
  configure(params: paramTypes.ParamsPredominantPitchMelodia) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binResolution, this.params.filterIterations, this.params.frameSize, this.params.guessUnvoiced, this.params.harmonicWeight, this.params.hopSize, this.params.magnitudeCompression, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.minDuration, this.params.minFrequency, this.params.numberHarmonics, this.params.peakDistributionThreshold, this.params.peakFrameThreshold, this.params.pitchContinuity, this.params.referenceFrequency, this.params.sampleRate, this.params.timeContinuity, this.params.voiceVibrato, this.params.voicingTolerance);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {pitch: 'the estimated pitch values [Hz]', pitchConfidence: 'confidence with which the pitch was detected'}
   * @memberof PredominantPitchMelodia
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof PredominantPitchMelodia
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsPredominantPitchMelodia) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
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
*/
class RMS {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsRMS} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.RMS();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsRMS} [params]
   * @memberof RMS
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {rms: 'the root mean square of the input array'}
   * @memberof RMS
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof RMS
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes the first 5 raw moments of an array. The output array is of size 6 because the zero-ith moment is used for padding so that the first moment corresponds to index 1. Check https://essentia.upf.edu/reference/std_RawMoments.html for more details.
* @class
*/
class RawMoments {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsRawMoments = {
    range: 22050,
  };
  private params: paramTypes.ParamsRawMoments = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsRawMoments} [params]
  */
  constructor(params: paramTypes.ParamsRawMoments) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.RawMoments(this.params.range);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsRawMoments} [params]
   * @memberof RawMoments
  */
  configure(params: paramTypes.ParamsRawMoments) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.range);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {rawMoments: 'the (raw) moments of the input array'}
   * @memberof RawMoments
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof RawMoments
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsRawMoments) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the Replay Gain loudness value of an audio signal. The algorithm is described in detail in [1]. The value returned is the 'standard' ReplayGain value, not the value with 6dB preamplification as computed by lame, mp3gain, vorbisgain, and all widely used ReplayGain programs. Check https://essentia.upf.edu/reference/std_ReplayGain.html for more details.
* @class
*/
class ReplayGain {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsReplayGain = {
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsReplayGain = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsReplayGain} [params]
  */
  constructor(params: paramTypes.ParamsReplayGain) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.ReplayGain(this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsReplayGain} [params]
   * @memberof ReplayGain
  */
  configure(params: paramTypes.ParamsReplayGain) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input audio signal (must be longer than 0.05ms)
   * @returns {object} {replayGain: 'the distance to the suitable average replay level (~-31dbB) defined by SMPTE [dB]'}
   * @memberof ReplayGain
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof ReplayGain
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsReplayGain) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm resamples the input signal to the desired sampling rate. Check https://essentia.upf.edu/reference/std_Resample.html for more details.
* @class
*/
class Resample {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsResample = {
    inputSampleRate: 44100,
    outputSampleRate: 44100,
    quality: 1,
  };
  private params: paramTypes.ParamsResample = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsResample} [params]
  */
  constructor(params: paramTypes.ParamsResample) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Resample(this.params.inputSampleRate, this.params.outputSampleRate, this.params.quality);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsResample} [params]
   * @memberof Resample
  */
  configure(params: paramTypes.ParamsResample) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.inputSampleRate, this.params.outputSampleRate, this.params.quality);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {signal: 'the resampled signal'}
   * @memberof Resample
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Resample
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsResample) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm resamples a sequence using FFT/IFFT. The input and output sizes must be an even number. The algorithm is a counterpart of the resample function in SciPy. Check https://essentia.upf.edu/reference/std_ResampleFFT.html for more details.
* @class
*/
class ResampleFFT {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsResampleFFT = {
    inSize: 128,
    outSize: 128,
  };
  private params: paramTypes.ParamsResampleFFT = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsResampleFFT} [params]
  */
  constructor(params: paramTypes.ParamsResampleFFT) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.ResampleFFT(this.params.inSize, this.params.outSize);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsResampleFFT} [params]
   * @memberof ResampleFFT
  */
  configure(params: paramTypes.ParamsResampleFFT) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.inSize, this.params.outSize);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} input input array
   * @returns {object} {output: 'output resample array'}
   * @memberof ResampleFFT
  */
  compute(input: any) {
    return this.algoInstance.compute(input);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof ResampleFFT
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsResampleFFT) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes rhythm features (bpm, beat positions, beat histogram peaks) for an audio signal. It combines RhythmExtractor2013 for beat tracking and BPM estimation with BpmHistogramDescriptors algorithms. Check https://essentia.upf.edu/reference/std_RhythmDescriptors.html for more details.
* @class
*/
class RhythmDescriptors {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsRhythmDescriptors} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.RhythmDescriptors();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsRhythmDescriptors} [params]
   * @memberof RhythmDescriptors
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the audio input signal
   * @returns {object} {beats_position: 'See RhythmExtractor2013 algorithm documentation', confidence: 'See RhythmExtractor2013 algorithm documentation', bpm: 'See RhythmExtractor2013 algorithm documentation', bpm_estimates: 'See RhythmExtractor2013 algorithm documentation', bpm_intervals: 'See RhythmExtractor2013 algorithm documentation', first_peak_bpm: 'See BpmHistogramDescriptors algorithm documentation', first_peak_spread: 'See BpmHistogramDescriptors algorithm documentation', first_peak_weight: 'See BpmHistogramDescriptors algorithm documentation', second_peak_bpm: 'See BpmHistogramDescriptors algorithm documentation', second_peak_spread: 'See BpmHistogramDescriptors algorithm documentation', second_peak_weight: 'See BpmHistogramDescriptors algorithm documentation', histogram: 'bpm histogram [bpm]'}
   * @memberof RhythmDescriptors
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof RhythmDescriptors
  */
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
*/
class RhythmExtractor {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsRhythmExtractor = {
    frameHop: 1024,
    frameSize: 1024,
    hopSize: 256,
    lastBeatInterval: 0.1,
    maxTempo: 208,
    minTempo: 40,
    numberFrames: 1024,
    sampleRate: 44100,
    tempoHints: arrayToVector([]),
    tolerance: 0.24,
    useBands: true,
    useOnset: true,
  };
  private params: paramTypes.ParamsRhythmExtractor = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsRhythmExtractor} [params]
  */
  constructor(params: paramTypes.ParamsRhythmExtractor) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.RhythmExtractor(this.params.frameHop, this.params.frameSize, this.params.hopSize, this.params.lastBeatInterval, this.params.maxTempo, this.params.minTempo, this.params.numberFrames, this.params.sampleRate, this.params.tempoHints, this.params.tolerance, this.params.useBands, this.params.useOnset);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsRhythmExtractor} [params]
   * @memberof RhythmExtractor
  */
  configure(params: paramTypes.ParamsRhythmExtractor) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameHop, this.params.frameSize, this.params.hopSize, this.params.lastBeatInterval, this.params.maxTempo, this.params.minTempo, this.params.numberFrames, this.params.sampleRate, this.params.tempoHints, this.params.tolerance, this.params.useBands, this.params.useOnset);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the audio input signal
   * @returns {object} {bpm: 'the tempo estimation [bpm]', ticks: ' the estimated tick locations [s]', estimates: 'the bpm estimation per frame [bpm]', bpmIntervals: 'list of beats interval [s]'}
   * @memberof RhythmExtractor
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof RhythmExtractor
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsRhythmExtractor) {
    if (!params) return;
    if (params.tempoHints) {
      params.tempoHints = arrayToVector(params.tempoHints);
    }
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm extracts the beat positions and estimates their confidence as well as tempo in bpm for an audio signal. The beat locations can be computed using:
  - 'multifeature', the BeatTrackerMultiFeature algorithm
  - 'degara', the BeatTrackerDegara algorithm (note that there is no confidence estimation for this method, the output confidence value is always 0) Check https://essentia.upf.edu/reference/std_RhythmExtractor2013.html for more details.
* @class
*/
class RhythmExtractor2013 {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsRhythmExtractor2013 = {
    maxTempo: 208,
    method: 'multifeature',
    minTempo: 40,
  };
  private params: paramTypes.ParamsRhythmExtractor2013 = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsRhythmExtractor2013} [params]
  */
  constructor(params: paramTypes.ParamsRhythmExtractor2013) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.RhythmExtractor2013(this.params.maxTempo, this.params.method, this.params.minTempo);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsRhythmExtractor2013} [params]
   * @memberof RhythmExtractor2013
  */
  configure(params: paramTypes.ParamsRhythmExtractor2013) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.maxTempo, this.params.method, this.params.minTempo);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the audio input signal
   * @returns {object} {bpm: 'the tempo estimation [bpm]', ticks: ' the estimated tick locations [s]', confidence: 'confidence with which the ticks are detected (ignore this value if using 'degara' method)', estimates: 'the list of bpm estimates characterizing the bpm distribution for the signal [bpm]', bpmIntervals: 'list of beats interval [s]'}
   * @memberof RhythmExtractor2013
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof RhythmExtractor2013
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsRhythmExtractor2013) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm implements the rhythm transform. It computes a tempogram, a representation of rhythmic periodicities in the input signal in the rhythm domain, by using FFT similarly to computation of spectrum in the frequency domain [1]. Additional features, including rhythmic centroid and a rhythmic counterpart of MFCCs, can be derived from this rhythmic representation. Check https://essentia.upf.edu/reference/std_RhythmTransform.html for more details.
* @class
*/
class RhythmTransform {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsRhythmTransform = {
    frameSize: 256,
    hopSize: 32,
  };
  private params: paramTypes.ParamsRhythmTransform = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsRhythmTransform} [params]
  */
  constructor(params: paramTypes.ParamsRhythmTransform) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.RhythmTransform(this.params.frameSize, this.params.hopSize);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsRhythmTransform} [params]
   * @memberof RhythmTransform
  */
  configure(params: paramTypes.ParamsRhythmTransform) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.hopSize);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} melBands the energies in the mel bands
   * @returns {object} {rhythm: 'consecutive frames in the rhythm domain'}
   * @memberof RhythmTransform
  */
  compute(melBands: any) {
    return this.algoInstance.compute(melBands);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof RhythmTransform
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsRhythmTransform) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the roll-off frequency of a spectrum. The roll-off frequency is defined as the frequency under which some percentage (cutoff) of the total energy of the spectrum is contained. The roll-off frequency can be used to distinguish between harmonic (below roll-off) and noisy sounds (above roll-off). Check https://essentia.upf.edu/reference/std_RollOff.html for more details.
* @class
*/
class RollOff {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsRollOff = {
    cutoff: 0.85,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsRollOff = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsRollOff} [params]
  */
  constructor(params: paramTypes.ParamsRollOff) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.RollOff(this.params.cutoff, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsRollOff} [params]
   * @memberof RollOff
  */
  configure(params: paramTypes.ParamsRollOff) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.cutoff, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input audio spectrum (must have more than one elements)
   * @returns {object} {rollOff: 'the roll-off frequency [Hz]'}
   * @memberof RollOff
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof RollOff
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsRollOff) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the SNR of the input audio in a frame-wise manner. Check https://essentia.upf.edu/reference/std_SNR.html for more details.
* @class
*/
class SNR {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSNR = {
    MAAlpha: 0.95,
    MMSEAlpha: 0.98,
    NoiseAlpha: 0.9,
    frameSize: 512,
    noiseThreshold: -40,
    sampleRate: 44100,
    useBroadbadNoiseCorrection: true,
  };
  private params: paramTypes.ParamsSNR = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSNR} [params]
  */
  constructor(params: paramTypes.ParamsSNR) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SNR(this.params.MAAlpha, this.params.MMSEAlpha, this.params.NoiseAlpha, this.params.frameSize, this.params.noiseThreshold, this.params.sampleRate, this.params.useBroadbadNoiseCorrection);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSNR} [params]
   * @memberof SNR
  */
  configure(params: paramTypes.ParamsSNR) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.MAAlpha, this.params.MMSEAlpha, this.params.NoiseAlpha, this.params.frameSize, this.params.noiseThreshold, this.params.sampleRate, this.params.useBroadbadNoiseCorrection);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input audio frame
   * @returns {object} {instantSNR: 'SNR value for the the current frame', averagedSNR: 'averaged SNR through an Exponential Moving Average filter', spectralSNR: 'instant SNR for each frequency bin'}
   * @memberof SNR
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SNR
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSNR) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* this algorithm outputs the staring/ending locations of the saturated regions in seconds. Saturated regions are found by means of a tripe criterion:
	 1. samples in a saturated region should have more energy than a given threshold.
	 2. the difference between the samples in a saturated region should be smaller than a given threshold.
	 3. the duration of the saturated region should be longer than a given threshold. Check https://essentia.upf.edu/reference/std_SaturationDetector.html for more details.
* @class
*/
class SaturationDetector {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSaturationDetector = {
    differentialThreshold: 0.001,
    energyThreshold: -1,
    frameSize: 512,
    hopSize: 256,
    minimumDuration: 0.005,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsSaturationDetector = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSaturationDetector} [params]
  */
  constructor(params: paramTypes.ParamsSaturationDetector) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SaturationDetector(this.params.differentialThreshold, this.params.energyThreshold, this.params.frameSize, this.params.hopSize, this.params.minimumDuration, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSaturationDetector} [params]
   * @memberof SaturationDetector
  */
  configure(params: paramTypes.ParamsSaturationDetector) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.differentialThreshold, this.params.energyThreshold, this.params.frameSize, this.params.hopSize, this.params.minimumDuration, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input audio frame
   * @returns {object} {starts: 'starting times of the detected saturated regions [s]', ends: 'ending times of the detected saturated regions [s]'}
   * @memberof SaturationDetector
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SaturationDetector
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSaturationDetector) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm scales the audio by the specified factor using clipping if required. Check https://essentia.upf.edu/reference/std_Scale.html for more details.
* @class
*/
class Scale {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsScale = {
    clipping: true,
    factor: 10,
    maxAbsValue: 1,
  };
  private params: paramTypes.ParamsScale = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsScale} [params]
  */
  constructor(params: paramTypes.ParamsScale) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Scale(this.params.clipping, this.params.factor, this.params.maxAbsValue);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsScale} [params]
   * @memberof Scale
  */
  configure(params: paramTypes.ParamsScale) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.clipping, this.params.factor, this.params.maxAbsValue);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input audio signal
   * @returns {object} {signal: 'the output audio signal'}
   * @memberof Scale
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Scale
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsScale) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm subtracts the sinusoids computed with the sine model analysis from an input audio signal. It ouputs an audio signal. Check https://essentia.upf.edu/reference/std_SineSubtraction.html for more details.
* @class
*/
class SineSubtraction {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSineSubtraction = {
    fftSize: 512,
    hopSize: 128,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsSineSubtraction = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSineSubtraction} [params]
  */
  constructor(params: paramTypes.ParamsSineSubtraction) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SineSubtraction(this.params.fftSize, this.params.hopSize, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSineSubtraction} [params]
   * @memberof SineSubtraction
  */
  configure(params: paramTypes.ParamsSineSubtraction) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.fftSize, this.params.hopSize, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input audio frame to subtract from
   * @param {VectorFloat} magnitudes the magnitudes of the sinusoidal peaks
   * @param {VectorFloat} frequencies the frequencies of the sinusoidal peaks [Hz]
   * @param {VectorFloat} phases the phases of the sinusoidal peaks
   * @returns {object} {frame: 'the output audio frame'}
   * @memberof SineSubtraction
  */
  compute(frame: any, magnitudes: any, frequencies: any, phases: any) {
    return this.algoInstance.compute(frame, magnitudes, frequencies, phases);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SineSubtraction
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSineSubtraction) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the spectrum energy of a single beat across the whole frequency range and on each specified frequency band given an audio segment. It detects the onset of the beat within the input segment, computes spectrum on a window starting on this onset, and estimates energy (see Energy and EnergyBandRatio algorithms). The frequency bands used by default are: 0-200 Hz, 200-400 Hz, 400-800 Hz, 800-1600 Hz, 1600-3200 Hz, 3200-22000Hz, following E. Scheirer [1]. Check https://essentia.upf.edu/reference/std_SingleBeatLoudness.html for more details.
* @class
*/
class SingleBeatLoudness {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSingleBeatLoudness = {
    beatDuration: 0.05,
    beatWindowDuration: 0.1,
    frequencyBands: arrayToVector([0, 200, 400, 800, 1600, 3200, 22000]),
    onsetStart: 'sumEnergy',
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsSingleBeatLoudness = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSingleBeatLoudness} [params]
  */
  constructor(params: paramTypes.ParamsSingleBeatLoudness) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SingleBeatLoudness(this.params.beatDuration, this.params.beatWindowDuration, this.params.frequencyBands, this.params.onsetStart, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSingleBeatLoudness} [params]
   * @memberof SingleBeatLoudness
  */
  configure(params: paramTypes.ParamsSingleBeatLoudness) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.beatDuration, this.params.beatWindowDuration, this.params.frequencyBands, this.params.onsetStart, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} beat audio segement containing a beat
   * @returns {object} {loudness: 'the beat's energy across the whole spectrum', loudnessBandRatio: 'the beat's energy ratio for each band'}
   * @memberof SingleBeatLoudness
  */
  compute(beat: any) {
    return this.algoInstance.compute(beat);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SingleBeatLoudness
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSingleBeatLoudness) {
    if (!params) return;
    if (params.frequencyBands) {
      params.frequencyBands = arrayToVector(params.frequencyBands);
    }
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm splits an audio signal into segments given their start and end times. Check https://essentia.upf.edu/reference/std_Slicer.html for more details.
* @class
*/
class Slicer {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSlicer = {
    endTimes: arrayToVector([]),
    sampleRate: 44100,
    startTimes: arrayToVector([]),
    timeUnits: 'seconds',
  };
  private params: paramTypes.ParamsSlicer = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSlicer} [params]
  */
  constructor(params: paramTypes.ParamsSlicer) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Slicer(this.params.endTimes, this.params.sampleRate, this.params.startTimes, this.params.timeUnits);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSlicer} [params]
   * @memberof Slicer
  */
  configure(params: paramTypes.ParamsSlicer) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.endTimes, this.params.sampleRate, this.params.startTimes, this.params.timeUnits);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} audio the input audio signal
   * @returns {object} {frame: 'the frames of the sliced input signal'}
   * @memberof Slicer
  */
  compute(audio: any) {
    return this.algoInstance.compute(audio);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Slicer
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSlicer) {
    if (!params) return;
    if (params.endTimes) {
      params.endTimes = arrayToVector(params.endTimes);
    }
    if (params.startTimes) {
      params.startTimes = arrayToVector(params.startTimes);
    }
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the spectral centroid of a signal in time domain. A first difference filter is applied to the input signal. Then the centroid is computed by dividing the norm of the resulting signal by the norm of the input signal. The centroid is given in hertz.
References:
 [1] Udo Zölzer (2002). DAFX Digital Audio Effects pag.364-365
 Check https://essentia.upf.edu/reference/std_SpectralCentroidTime.html for more details.
* @class
*/
class SpectralCentroidTime {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSpectralCentroidTime = {
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsSpectralCentroidTime = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSpectralCentroidTime} [params]
  */
  constructor(params: paramTypes.ParamsSpectralCentroidTime) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SpectralCentroidTime(this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSpectralCentroidTime} [params]
   * @memberof SpectralCentroidTime
  */
  configure(params: paramTypes.ParamsSpectralCentroidTime) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {centroid: 'the spectral centroid of the signal'}
   * @memberof SpectralCentroidTime
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SpectralCentroidTime
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSpectralCentroidTime) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the spectral complexity of a spectrum. The spectral complexity is based on the number of peaks in the input spectrum. Check https://essentia.upf.edu/reference/std_SpectralComplexity.html for more details.
* @class
*/
class SpectralComplexity {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSpectralComplexity = {
    magnitudeThreshold: 0.005,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsSpectralComplexity = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSpectralComplexity} [params]
  */
  constructor(params: paramTypes.ParamsSpectralComplexity) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SpectralComplexity(this.params.magnitudeThreshold, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSpectralComplexity} [params]
   * @memberof SpectralComplexity
  */
  configure(params: paramTypes.ParamsSpectralComplexity) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.magnitudeThreshold, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input spectrum
   * @returns {object} {spectralComplexity: 'the spectral complexity of the input spectrum'}
   * @memberof SpectralComplexity
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SpectralComplexity
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSpectralComplexity) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the Spectral Contrast feature of a spectrum. It is based on the Octave Based Spectral Contrast feature as described in [1]. The version implemented here is a modified version to improve discriminative power and robustness. The modifications are described in [2]. Check https://essentia.upf.edu/reference/std_SpectralContrast.html for more details.
* @class
*/
class SpectralContrast {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSpectralContrast = {
    frameSize: 2048,
    highFrequencyBound: 11000,
    lowFrequencyBound: 20,
    neighbourRatio: 0.4,
    numberBands: 6,
    sampleRate: 22050,
    staticDistribution: 0.15,
  };
  private params: paramTypes.ParamsSpectralContrast = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSpectralContrast} [params]
  */
  constructor(params: paramTypes.ParamsSpectralContrast) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SpectralContrast(this.params.frameSize, this.params.highFrequencyBound, this.params.lowFrequencyBound, this.params.neighbourRatio, this.params.numberBands, this.params.sampleRate, this.params.staticDistribution);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSpectralContrast} [params]
   * @memberof SpectralContrast
  */
  configure(params: paramTypes.ParamsSpectralContrast) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.highFrequencyBound, this.params.lowFrequencyBound, this.params.neighbourRatio, this.params.numberBands, this.params.sampleRate, this.params.staticDistribution);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the audio spectrum
   * @returns {object} {spectralContrast: 'the spectral contrast coefficients', spectralValley: 'the magnitudes of the valleys'}
   * @memberof SpectralContrast
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SpectralContrast
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSpectralContrast) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm extracts peaks from a spectrum. It is important to note that the peak algorithm is independent of an input that is linear or in dB, so one has to adapt the threshold to fit with the type of data fed to it. The algorithm relies on PeakDetection algorithm which is run with parabolic interpolation [1]. The exactness of the peak-searching depends heavily on the windowing type. It gives best results with dB input, a blackman-harris 92dB window and interpolation set to true. According to [1], spectral peak frequencies tend to be about twice as accurate when dB magnitude is used rather than just linear magnitude. For further information about the peak detection, see the description of the PeakDetection algorithm. Check https://essentia.upf.edu/reference/std_SpectralPeaks.html for more details.
* @class
*/
class SpectralPeaks {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSpectralPeaks = {
    magnitudeThreshold: 0,
    maxFrequency: 5000,
    maxPeaks: 100,
    minFrequency: 0,
    orderBy: 'frequency',
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsSpectralPeaks = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSpectralPeaks} [params]
  */
  constructor(params: paramTypes.ParamsSpectralPeaks) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SpectralPeaks(this.params.magnitudeThreshold, this.params.maxFrequency, this.params.maxPeaks, this.params.minFrequency, this.params.orderBy, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSpectralPeaks} [params]
   * @memberof SpectralPeaks
  */
  configure(params: paramTypes.ParamsSpectralPeaks) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.magnitudeThreshold, this.params.maxFrequency, this.params.maxPeaks, this.params.minFrequency, this.params.orderBy, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input spectrum
   * @returns {object} {frequencies: 'the frequencies of the spectral peaks [Hz]', magnitudes: 'the magnitudes of the spectral peaks'}
   * @memberof SpectralPeaks
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SpectralPeaks
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSpectralPeaks) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* Performs spectral whitening of spectral peaks of a spectrum. The algorithm works in dB scale, but the conversion is done by the algorithm so input should be in linear scale. The concept of 'whitening' refers to 'white noise' or a non-zero flat spectrum. It first computes a spectral envelope similar to the 'true envelope' in [1], and then modifies the amplitude of each peak relative to the envelope. For example, the predominant peaks will have a value close to 0dB because they are very close to the envelope. On the other hand, minor peaks between significant peaks will have lower amplitudes such as -30dB. Check https://essentia.upf.edu/reference/std_SpectralWhitening.html for more details.
* @class
*/
class SpectralWhitening {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSpectralWhitening = {
    maxFrequency: 5000,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsSpectralWhitening = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSpectralWhitening} [params]
  */
  constructor(params: paramTypes.ParamsSpectralWhitening) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SpectralWhitening(this.params.maxFrequency, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSpectralWhitening} [params]
   * @memberof SpectralWhitening
  */
  configure(params: paramTypes.ParamsSpectralWhitening) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.maxFrequency, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the audio linear spectrum
   * @param {VectorFloat} frequencies the spectral peaks' linear frequencies
   * @param {VectorFloat} magnitudes the spectral peaks' linear magnitudes
   * @returns {object} {magnitudes: 'the whitened spectral peaks' linear magnitudes'}
   * @memberof SpectralWhitening
  */
  compute(spectrum: any, frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(spectrum, frequencies, magnitudes);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SpectralWhitening
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSpectralWhitening) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the magnitude spectrum of an array of Reals. The resulting magnitude spectrum has a size which is half the size of the input array plus one. Bins contain raw (linear) magnitude values. Check https://essentia.upf.edu/reference/std_Spectrum.html for more details.
* @class
*/
class Spectrum {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSpectrum = {
    size: 2048,
  };
  private params: paramTypes.ParamsSpectrum = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSpectrum} [params]
  */
  constructor(params: paramTypes.ParamsSpectrum) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Spectrum(this.params.size);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSpectrum} [params]
   * @memberof Spectrum
  */
  configure(params: paramTypes.ParamsSpectrum) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.size);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input audio frame
   * @returns {object} {spectrum: 'magnitude spectrum of the input audio signal'}
   * @memberof Spectrum
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Spectrum
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSpectrum) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the magnitude of the Constant-Q spectrum. See ConstantQ algorithm for more details.
 Check https://essentia.upf.edu/reference/std_SpectrumCQ.html for more details.
* @class
*/
class SpectrumCQ {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSpectrumCQ = {
    binsPerOctave: 12,
    minFrequency: 32.7,
    minimumKernelSize: 4,
    numberBins: 84,
    sampleRate: 44100,
    scale: 1,
    threshold: 0.01,
    windowType: 'hann',
    zeroPhase: true,
  };
  private params: paramTypes.ParamsSpectrumCQ = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSpectrumCQ} [params]
  */
  constructor(params: paramTypes.ParamsSpectrumCQ) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SpectrumCQ(this.params.binsPerOctave, this.params.minFrequency, this.params.minimumKernelSize, this.params.numberBins, this.params.sampleRate, this.params.scale, this.params.threshold, this.params.windowType, this.params.zeroPhase);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSpectrumCQ} [params]
   * @memberof SpectrumCQ
  */
  configure(params: paramTypes.ParamsSpectrumCQ) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binsPerOctave, this.params.minFrequency, this.params.minimumKernelSize, this.params.numberBins, this.params.sampleRate, this.params.scale, this.params.threshold, this.params.windowType, this.params.zeroPhase);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input audio frame
   * @returns {object} {spectrumCQ: 'the magnitude constant-Q spectrum'}
   * @memberof SpectrumCQ
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SpectrumCQ
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSpectrumCQ) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes energy in triangular frequency bands of a spectrum equally spaced on the cent scale. Each band is computed to have a constant wideness in the cent scale. For each band the power-spectrum (mag-squared) is summed. Check https://essentia.upf.edu/reference/std_SpectrumToCent.html for more details.
* @class
*/
class SpectrumToCent {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSpectrumToCent = {
    bands: 720,
    centBinResolution: 10,
    inputSize: 32768,
    log: true,
    minimumFrequency: 164,
    normalize: 'unit_sum',
    sampleRate: 44100,
    type: 'power',
  };
  private params: paramTypes.ParamsSpectrumToCent = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSpectrumToCent} [params]
  */
  constructor(params: paramTypes.ParamsSpectrumToCent) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SpectrumToCent(this.params.bands, this.params.centBinResolution, this.params.inputSize, this.params.log, this.params.minimumFrequency, this.params.normalize, this.params.sampleRate, this.params.type);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSpectrumToCent} [params]
   * @memberof SpectrumToCent
  */
  configure(params: paramTypes.ParamsSpectrumToCent) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.bands, this.params.centBinResolution, this.params.inputSize, this.params.log, this.params.minimumFrequency, this.params.normalize, this.params.sampleRate, this.params.type);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input spectrum (must be greater than size one)
   * @returns {object} {bands: 'the energy in each band', frequencies: 'the central frequency of each band'}
   * @memberof SpectrumToCent
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SpectrumToCent
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSpectrumToCent) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
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
*/
class Spline {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSpline = {
    beta1: 1,
    beta2: 0,
    type: 'b',
    xPoints: arrayToVector([0, 1]),
    yPoints: arrayToVector([0, 1]),
  };
  private params: paramTypes.ParamsSpline = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSpline} [params]
  */
  constructor(params: paramTypes.ParamsSpline) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Spline(this.params.beta1, this.params.beta2, this.params.type, this.params.xPoints, this.params.yPoints);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSpline} [params]
   * @memberof Spline
  */
  configure(params: paramTypes.ParamsSpline) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.beta1, this.params.beta2, this.params.type, this.params.xPoints, this.params.yPoints);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {number} x the input coordinate (x-axis)
   * @returns {object} {y: 'the value of the spline at x'}
   * @memberof Spline
  */
  compute(x: number) {
    return this.algoInstance.compute(x);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Spline
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSpline) {
    if (!params) return;
    if (params.xPoints) {
      params.xPoints = arrayToVector(params.xPoints);
    }
    if (params.yPoints) {
      params.yPoints = arrayToVector(params.yPoints);
    }
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the sinusoidal plus residual model analysis.  Check https://essentia.upf.edu/reference/std_SprModelAnal.html for more details.
* @class
*/
class SprModelAnal {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSprModelAnal = {
    fftSize: 2048,
    freqDevOffset: 20,
    freqDevSlope: 0.01,
    hopSize: 512,
    magnitudeThreshold: 0,
    maxFrequency: 5000,
    maxPeaks: 100,
    maxnSines: 100,
    minFrequency: 0,
    orderBy: 'frequency',
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsSprModelAnal = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSprModelAnal} [params]
  */
  constructor(params: paramTypes.ParamsSprModelAnal) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SprModelAnal(this.params.fftSize, this.params.freqDevOffset, this.params.freqDevSlope, this.params.hopSize, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.maxPeaks, this.params.maxnSines, this.params.minFrequency, this.params.orderBy, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSprModelAnal} [params]
   * @memberof SprModelAnal
  */
  configure(params: paramTypes.ParamsSprModelAnal) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.fftSize, this.params.freqDevOffset, this.params.freqDevSlope, this.params.hopSize, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.maxPeaks, this.params.maxnSines, this.params.minFrequency, this.params.orderBy, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input frame
   * @returns {object} {frequencies: 'the frequencies of the sinusoidal peaks [Hz]', magnitudes: 'the magnitudes of the sinusoidal peaks', phases: 'the phases of the sinusoidal peaks', res: 'output residual frame'}
   * @memberof SprModelAnal
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SprModelAnal
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSprModelAnal) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the sinusoidal plus residual model synthesis from SPS model analysis. Check https://essentia.upf.edu/reference/std_SprModelSynth.html for more details.
* @class
*/
class SprModelSynth {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSprModelSynth = {
    fftSize: 2048,
    hopSize: 512,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsSprModelSynth = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSprModelSynth} [params]
  */
  constructor(params: paramTypes.ParamsSprModelSynth) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SprModelSynth(this.params.fftSize, this.params.hopSize, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSprModelSynth} [params]
   * @memberof SprModelSynth
  */
  configure(params: paramTypes.ParamsSprModelSynth) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.fftSize, this.params.hopSize, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} magnitudes the magnitudes of the sinusoidal peaks
   * @param {VectorFloat} frequencies the frequencies of the sinusoidal peaks [Hz]
   * @param {VectorFloat} phases the phases of the sinusoidal peaks
   * @param {VectorFloat} res the residual frame
   * @returns {object} {frame: 'the output audio frame of the Sinusoidal Plus Stochastic model', sineframe: 'the output audio frame for sinusoidal component ', resframe: 'the output audio frame for stochastic component '}
   * @memberof SprModelSynth
  */
  compute(magnitudes: any, frequencies: any, phases: any, res: any) {
    return this.algoInstance.compute(magnitudes, frequencies, phases, res);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SprModelSynth
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSprModelSynth) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the stochastic model analysis.  Check https://essentia.upf.edu/reference/std_SpsModelAnal.html for more details.
* @class
*/
class SpsModelAnal {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSpsModelAnal = {
    fftSize: 2048,
    freqDevOffset: 20,
    freqDevSlope: 0.01,
    hopSize: 512,
    magnitudeThreshold: 0,
    maxFrequency: 5000,
    maxPeaks: 100,
    maxnSines: 100,
    minFrequency: 0,
    orderBy: 'frequency',
    sampleRate: 44100,
    stocf: 0.2,
  };
  private params: paramTypes.ParamsSpsModelAnal = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSpsModelAnal} [params]
  */
  constructor(params: paramTypes.ParamsSpsModelAnal) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SpsModelAnal(this.params.fftSize, this.params.freqDevOffset, this.params.freqDevSlope, this.params.hopSize, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.maxPeaks, this.params.maxnSines, this.params.minFrequency, this.params.orderBy, this.params.sampleRate, this.params.stocf);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSpsModelAnal} [params]
   * @memberof SpsModelAnal
  */
  configure(params: paramTypes.ParamsSpsModelAnal) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.fftSize, this.params.freqDevOffset, this.params.freqDevSlope, this.params.hopSize, this.params.magnitudeThreshold, this.params.maxFrequency, this.params.maxPeaks, this.params.maxnSines, this.params.minFrequency, this.params.orderBy, this.params.sampleRate, this.params.stocf);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input frame
   * @returns {object} {frequencies: 'the frequencies of the sinusoidal peaks [Hz]', magnitudes: 'the magnitudes of the sinusoidal peaks', phases: 'the phases of the sinusoidal peaks', stocenv: 'the stochastic envelope'}
   * @memberof SpsModelAnal
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SpsModelAnal
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSpsModelAnal) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the sinusoidal plus stochastic model synthesis from SPS model analysis. Check https://essentia.upf.edu/reference/std_SpsModelSynth.html for more details.
* @class
*/
class SpsModelSynth {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSpsModelSynth = {
    fftSize: 2048,
    hopSize: 512,
    sampleRate: 44100,
    stocf: 0.2,
  };
  private params: paramTypes.ParamsSpsModelSynth = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSpsModelSynth} [params]
  */
  constructor(params: paramTypes.ParamsSpsModelSynth) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SpsModelSynth(this.params.fftSize, this.params.hopSize, this.params.sampleRate, this.params.stocf);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSpsModelSynth} [params]
   * @memberof SpsModelSynth
  */
  configure(params: paramTypes.ParamsSpsModelSynth) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.fftSize, this.params.hopSize, this.params.sampleRate, this.params.stocf);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} magnitudes the magnitudes of the sinusoidal peaks
   * @param {VectorFloat} frequencies the frequencies of the sinusoidal peaks [Hz]
   * @param {VectorFloat} phases the phases of the sinusoidal peaks
   * @param {VectorFloat} stocenv the stochastic envelope
   * @returns {object} {frame: 'the output audio frame of the Sinusoidal Plus Stochastic model', sineframe: 'the output audio frame for sinusoidal component ', stocframe: 'the output audio frame for stochastic component '}
   * @memberof SpsModelSynth
  */
  compute(magnitudes: any, frequencies: any, phases: any, stocenv: any) {
    return this.algoInstance.compute(magnitudes, frequencies, phases, stocenv);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SpsModelSynth
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSpsModelSynth) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm outputs if there is a cut at the beginning or at the end of the audio by locating the first and last non-silent frames and comparing their positions to the actual beginning and end of the audio. The input audio is considered to be cut at the beginning (or the end) and the corresponding flag is activated if the first (last) non-silent frame occurs before (after) the configurable time threshold. Check https://essentia.upf.edu/reference/std_StartStopCut.html for more details.
* @class
*/
class StartStopCut {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsStartStopCut = {
    frameSize: 256,
    hopSize: 256,
    maximumStartTime: 10,
    maximumStopTime: 10,
    sampleRate: 44100,
    threshold: -60,
  };
  private params: paramTypes.ParamsStartStopCut = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsStartStopCut} [params]
  */
  constructor(params: paramTypes.ParamsStartStopCut) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.StartStopCut(this.params.frameSize, this.params.hopSize, this.params.maximumStartTime, this.params.maximumStopTime, this.params.sampleRate, this.params.threshold);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsStartStopCut} [params]
   * @memberof StartStopCut
  */
  configure(params: paramTypes.ParamsStartStopCut) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.hopSize, this.params.maximumStartTime, this.params.maximumStopTime, this.params.sampleRate, this.params.threshold);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} audio the input audio 
   * @returns {object} {startCut: '1 if there is a cut at the begining of the audio', stopCut: '1 if there is a cut at the end of the audio'}
   * @memberof StartStopCut
  */
  compute(audio: any) {
    return this.algoInstance.compute(audio);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof StartStopCut
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsStartStopCut) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm outputs the frame at which sound begins and the frame at which sound ends. Check https://essentia.upf.edu/reference/std_StartStopSilence.html for more details.
* @class
*/
class StartStopSilence {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsStartStopSilence = {
    threshold: -60,
  };
  private params: paramTypes.ParamsStartStopSilence = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsStartStopSilence} [params]
  */
  constructor(params: paramTypes.ParamsStartStopSilence) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.StartStopSilence(this.params.threshold);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsStartStopSilence} [params]
   * @memberof StartStopSilence
  */
  configure(params: paramTypes.ParamsStartStopSilence) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.threshold);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input audio frames
   * @returns {object} {startFrame: 'number of the first non-silent frame', stopFrame: 'number of the last non-silent frame'}
   * @memberof StartStopSilence
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof StartStopSilence
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsStartStopSilence) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the stochastic model analysis. It gets the resampled spectral envelope of the stochastic component. Check https://essentia.upf.edu/reference/std_StochasticModelAnal.html for more details.
* @class
*/
class StochasticModelAnal {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsStochasticModelAnal = {
    fftSize: 2048,
    hopSize: 512,
    sampleRate: 44100,
    stocf: 0.2,
  };
  private params: paramTypes.ParamsStochasticModelAnal = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsStochasticModelAnal} [params]
  */
  constructor(params: paramTypes.ParamsStochasticModelAnal) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.StochasticModelAnal(this.params.fftSize, this.params.hopSize, this.params.sampleRate, this.params.stocf);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsStochasticModelAnal} [params]
   * @memberof StochasticModelAnal
  */
  configure(params: paramTypes.ParamsStochasticModelAnal) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.fftSize, this.params.hopSize, this.params.sampleRate, this.params.stocf);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input frame
   * @returns {object} {stocenv: 'the stochastic envelope'}
   * @memberof StochasticModelAnal
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof StochasticModelAnal
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsStochasticModelAnal) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the stochastic model synthesis. It generates the noisy spectrum from a resampled spectral envelope of the stochastic component. Check https://essentia.upf.edu/reference/std_StochasticModelSynth.html for more details.
* @class
*/
class StochasticModelSynth {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsStochasticModelSynth = {
    fftSize: 2048,
    hopSize: 512,
    sampleRate: 44100,
    stocf: 0.2,
  };
  private params: paramTypes.ParamsStochasticModelSynth = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsStochasticModelSynth} [params]
  */
  constructor(params: paramTypes.ParamsStochasticModelSynth) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.StochasticModelSynth(this.params.fftSize, this.params.hopSize, this.params.sampleRate, this.params.stocf);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsStochasticModelSynth} [params]
   * @memberof StochasticModelSynth
  */
  configure(params: paramTypes.ParamsStochasticModelSynth) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.fftSize, this.params.hopSize, this.params.sampleRate, this.params.stocf);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} stocenv the stochastic envelope input
   * @returns {object} {frame: 'the output frame'}
   * @memberof StochasticModelSynth
  */
  compute(stocenv: any) {
    return this.algoInstance.compute(stocenv);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof StochasticModelSynth
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsStochasticModelSynth) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the Strong Decay of an audio signal. The Strong Decay is built from the non-linear combination of the signal energy and the signal temporal centroid, the latter being the balance of the absolute value of the signal. A signal containing a temporal centroid near its start boundary and a strong energy is said to have a strong decay. Check https://essentia.upf.edu/reference/std_StrongDecay.html for more details.
* @class
*/
class StrongDecay {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsStrongDecay = {
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsStrongDecay = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsStrongDecay} [params]
  */
  constructor(params: paramTypes.ParamsStrongDecay) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.StrongDecay(this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsStrongDecay} [params]
   * @memberof StrongDecay
  */
  configure(params: paramTypes.ParamsStrongDecay) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input audio signal
   * @returns {object} {strongDecay: 'the strong decay'}
   * @memberof StrongDecay
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof StrongDecay
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsStrongDecay) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the Strong Peak of a spectrum. The Strong Peak is defined as the ratio between the spectrum's maximum peak's magnitude and the "bandwidth" of the peak above a threshold (half its amplitude). This ratio reveals whether the spectrum presents a very "pronounced" maximum peak (i.e. the thinner and the higher the maximum of the spectrum is, the higher the ratio value). Check https://essentia.upf.edu/reference/std_StrongPeak.html for more details.
* @class
*/
class StrongPeak {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsStrongPeak} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.StrongPeak();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsStrongPeak} [params]
   * @memberof StrongPeak
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input spectrum (must be greater than one element and cannot contain negative values)
   * @returns {object} {strongPeak: 'the Strong Peak ratio'}
   * @memberof StrongPeak
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof StrongPeak
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm detects onsets given an audio signal using SuperFlux algorithm. This implementation is based on the available reference implementation in python [2]. The algorithm computes spectrum of the input signal, summarizes it into triangular band energies, and computes a onset detection function based on spectral flux tracking spectral trajectories with a maximum filter (SuperFluxNovelty). The peaks of the function are then detected (SuperFluxPeaks). Check https://essentia.upf.edu/reference/std_SuperFluxExtractor.html for more details.
* @class
*/
class SuperFluxExtractor {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSuperFluxExtractor = {
    combine: 20,
    frameSize: 2048,
    hopSize: 256,
    ratioThreshold: 16,
    sampleRate: 44100,
    threshold: 0.05,
  };
  private params: paramTypes.ParamsSuperFluxExtractor = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSuperFluxExtractor} [params]
  */
  constructor(params: paramTypes.ParamsSuperFluxExtractor) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SuperFluxExtractor(this.params.combine, this.params.frameSize, this.params.hopSize, this.params.ratioThreshold, this.params.sampleRate, this.params.threshold);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSuperFluxExtractor} [params]
   * @memberof SuperFluxExtractor
  */
  configure(params: paramTypes.ParamsSuperFluxExtractor) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.combine, this.params.frameSize, this.params.hopSize, this.params.ratioThreshold, this.params.sampleRate, this.params.threshold);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the audio input signal
   * @returns {object} {onsets: 'the onsets times'}
   * @memberof SuperFluxExtractor
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SuperFluxExtractor
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSuperFluxExtractor) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* Onset detection function for Superflux algorithm. See SuperFluxExtractor for more details. Check https://essentia.upf.edu/reference/std_SuperFluxNovelty.html for more details.
* @class
*/
class SuperFluxNovelty {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSuperFluxNovelty = {
    binWidth: 3,
    frameWidth: 2,
  };
  private params: paramTypes.ParamsSuperFluxNovelty = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSuperFluxNovelty} [params]
  */
  constructor(params: paramTypes.ParamsSuperFluxNovelty) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SuperFluxNovelty(this.params.binWidth, this.params.frameWidth);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSuperFluxNovelty} [params]
   * @memberof SuperFluxNovelty
  */
  configure(params: paramTypes.ParamsSuperFluxNovelty) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binWidth, this.params.frameWidth);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} bands the input bands spectrogram
   * @returns {object} {differences: 'SuperFlux novelty curve'}
   * @memberof SuperFluxNovelty
  */
  compute(bands: any) {
    return this.algoInstance.compute(bands);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SuperFluxNovelty
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSuperFluxNovelty) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm detects peaks of an onset detection function computed by the SuperFluxNovelty algorithm. See SuperFluxExtractor for more details. Check https://essentia.upf.edu/reference/std_SuperFluxPeaks.html for more details.
* @class
*/
class SuperFluxPeaks {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsSuperFluxPeaks = {
    combine: 30,
    frameRate: 172,
    pre_avg: 100,
    pre_max: 30,
    ratioThreshold: 16,
    threshold: 0.05,
  };
  private params: paramTypes.ParamsSuperFluxPeaks = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsSuperFluxPeaks} [params]
  */
  constructor(params: paramTypes.ParamsSuperFluxPeaks) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.SuperFluxPeaks(this.params.combine, this.params.frameRate, this.params.pre_avg, this.params.pre_max, this.params.ratioThreshold, this.params.threshold);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsSuperFluxPeaks} [params]
   * @memberof SuperFluxPeaks
  */
  configure(params: paramTypes.ParamsSuperFluxPeaks) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.combine, this.params.frameRate, this.params.pre_avg, this.params.pre_max, this.params.ratioThreshold, this.params.threshold);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} novelty the input onset detection function
   * @returns {object} {peaks: 'detected peaks' instants [s]'}
   * @memberof SuperFluxPeaks
  */
  compute(novelty: any) {
    return this.algoInstance.compute(novelty);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof SuperFluxPeaks
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsSuperFluxPeaks) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm calculates the ratio of the temporal centroid to the total length of a signal envelope. This ratio shows how the sound is 'balanced'. Its value is close to 0 if most of the energy lies at the beginning of the sound (e.g. decrescendo or impulsive sounds), close to 0.5 if the sound is symetric (e.g. 'delta unvarying' sounds), and close to 1 if most of the energy lies at the end of the sound (e.g. crescendo sounds). Check https://essentia.upf.edu/reference/std_TCToTotal.html for more details.
* @class
*/
class TCToTotal {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTCToTotal} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.TCToTotal();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTCToTotal} [params]
   * @memberof TCToTotal
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} envelope the envelope of the signal (its length must be greater than 1
   * @returns {object} {TCToTotal: 'the temporal centroid to total length ratio'}
   * @memberof TCToTotal
  */
  compute(envelope: any) {
    return this.algoInstance.compute(envelope);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TCToTotal
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes features for tempo tracking to be used with the TempoTap algorithm. See standard_rhythmextractor_tempotap in examples folder. Check https://essentia.upf.edu/reference/std_TempoScaleBands.html for more details.
* @class
*/
class TempoScaleBands {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsTempoScaleBands = {
    bandsGain: arrayToVector([2, 3, 2, 1, 1.20000004768, 2, 3, 2.5]),
    frameTime: 512,
  };
  private params: paramTypes.ParamsTempoScaleBands = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTempoScaleBands} [params]
  */
  constructor(params: paramTypes.ParamsTempoScaleBands) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.TempoScaleBands(this.params.bandsGain, this.params.frameTime);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTempoScaleBands} [params]
   * @memberof TempoScaleBands
  */
  configure(params: paramTypes.ParamsTempoScaleBands) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.bandsGain, this.params.frameTime);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} bands the audio power spectrum divided into bands
   * @returns {object} {scaledBands: 'the output bands after scaling', cumulativeBands: 'cumulative sum of the output bands before scaling'}
   * @memberof TempoScaleBands
  */
  compute(bands: any) {
    return this.algoInstance.compute(bands);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TempoScaleBands
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsTempoScaleBands) {
    if (!params) return;
    if (params.bandsGain) {
      params.bandsGain = arrayToVector(params.bandsGain);
    }
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates the periods and phases of a periodic signal, represented by a sequence of values of any number of detection functions, such as energy bands, onsets locations, etc. It requires to be sequentially run on a vector of such values ("featuresFrame") for each particular audio frame in order to get estimations related to that frames. The estimations are done for each detection function separately, utilizing the latest "frameHop" frames, including the present one, to compute autocorrelation. Empty estimations will be returned until enough frames are accumulated in the algorithm's buffer.
The algorithm uses elements of the following beat-tracking methods:
 - BeatIt, elaborated by Fabien Gouyon and Simon Dixon (input features) [1]
 - Multi-comb filter with Rayleigh weighting, Mathew Davies [2] Check https://essentia.upf.edu/reference/std_TempoTap.html for more details.
* @class
*/
class TempoTap {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsTempoTap = {
    frameHop: 1024,
    frameSize: 256,
    maxTempo: 208,
    minTempo: 40,
    numberFrames: 1024,
    sampleRate: 44100,
    tempoHints: arrayToVector([]),
  };
  private params: paramTypes.ParamsTempoTap = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTempoTap} [params]
  */
  constructor(params: paramTypes.ParamsTempoTap) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.TempoTap(this.params.frameHop, this.params.frameSize, this.params.maxTempo, this.params.minTempo, this.params.numberFrames, this.params.sampleRate, this.params.tempoHints);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTempoTap} [params]
   * @memberof TempoTap
  */
  configure(params: paramTypes.ParamsTempoTap) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameHop, this.params.frameSize, this.params.maxTempo, this.params.minTempo, this.params.numberFrames, this.params.sampleRate, this.params.tempoHints);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} featuresFrame input temporal features of a frame
   * @returns {object} {periods: 'list of tempo estimates found for each input feature, in frames', phases: 'list of initial phase candidates found for each input feature, in frames'}
   * @memberof TempoTap
  */
  compute(featuresFrame: any) {
    return this.algoInstance.compute(featuresFrame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TempoTap
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsTempoTap) {
    if (!params) return;
    if (params.tempoHints) {
      params.tempoHints = arrayToVector(params.tempoHints);
    }
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates beat positions given an onset detection function.  The detection function is partitioned into 6-second frames with a 1.5-second increment, and the autocorrelation is computed for each frame, and is weighted by a tempo preference curve [2]. Periodicity estimations are done frame-wisely, searching for the best match with the Viterbi algorith [3]. The estimated periods are then passed to the probabilistic beat tracking algorithm [1], which computes beat positions. Check https://essentia.upf.edu/reference/std_TempoTapDegara.html for more details.
* @class
*/
class TempoTapDegara {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsTempoTapDegara = {
    maxTempo: 208,
    minTempo: 40,
    resample: 'none',
    sampleRateODF: 86.1328,
  };
  private params: paramTypes.ParamsTempoTapDegara = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTempoTapDegara} [params]
  */
  constructor(params: paramTypes.ParamsTempoTapDegara) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.TempoTapDegara(this.params.maxTempo, this.params.minTempo, this.params.resample, this.params.sampleRateODF);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTempoTapDegara} [params]
   * @memberof TempoTapDegara
  */
  configure(params: paramTypes.ParamsTempoTapDegara) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.maxTempo, this.params.minTempo, this.params.resample, this.params.sampleRateODF);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} onsetDetections the input frame-wise vector of onset detection values
   * @returns {object} {ticks: 'the list of resulting ticks [s]'}
   * @memberof TempoTapDegara
  */
  compute(onsetDetections: any) {
    return this.algoInstance.compute(onsetDetections);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TempoTapDegara
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsTempoTapDegara) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm outputs beat positions and confidence of their estimation based on the maximum mutual agreement between beat candidates estimated by different beat trackers (or using different features). Check https://essentia.upf.edu/reference/std_TempoTapMaxAgreement.html for more details.
* @class
*/
class TempoTapMaxAgreement {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTempoTapMaxAgreement} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.TempoTapMaxAgreement();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTempoTapMaxAgreement} [params]
   * @memberof TempoTapMaxAgreement
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorVectorFloat} tickCandidates the tick candidates estimated using different beat trackers (or features) [s]
   * @returns {object} {ticks: 'the list of resulting ticks [s]', confidence: 'confidence with which the ticks were detected [0, 5.32]'}
   * @memberof TempoTapMaxAgreement
  */
  compute(tickCandidates: any) {
    return this.algoInstance.compute(tickCandidates);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TempoTapMaxAgreement
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm builds the list of ticks from the period and phase candidates given by the TempoTap algorithm. Check https://essentia.upf.edu/reference/std_TempoTapTicks.html for more details.
* @class
*/
class TempoTapTicks {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsTempoTapTicks = {
    frameHop: 512,
    hopSize: 256,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsTempoTapTicks = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTempoTapTicks} [params]
  */
  constructor(params: paramTypes.ParamsTempoTapTicks) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.TempoTapTicks(this.params.frameHop, this.params.hopSize, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTempoTapTicks} [params]
   * @memberof TempoTapTicks
  */
  configure(params: paramTypes.ParamsTempoTapTicks) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameHop, this.params.hopSize, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} periods tempo period candidates for the current frame, in frames
   * @param {VectorFloat} phases tempo ticks phase candidates for the current frame, in frames
   * @returns {object} {ticks: 'the list of resulting ticks [s]', matchingPeriods: 'list of matching periods [s]'}
   * @memberof TempoTapTicks
  */
  compute(periods: any, phases: any) {
    return this.algoInstance.compute(periods, phases);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TempoTapTicks
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsTempoTapTicks) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes mel bands from an audio frame with the specific parametrization required by the FSD-SINet models. Check https://essentia.upf.edu/reference/std_TensorflowInputFSDSINet.html for more details.
* @class
*/
class TensorflowInputFSDSINet {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTensorflowInputFSDSINet} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.TensorflowInputFSDSINet();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTensorflowInputFSDSINet} [params]
   * @memberof TensorflowInputFSDSINet
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the audio frame
   * @returns {object} {bands: 'the log-compressed mel bands'}
   * @memberof TensorflowInputFSDSINet
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TensorflowInputFSDSINet
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes mel-bands specific to the input of MusiCNN-based models. Check https://essentia.upf.edu/reference/std_TensorflowInputMusiCNN.html for more details.
* @class
*/
class TensorflowInputMusiCNN {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTensorflowInputMusiCNN} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.TensorflowInputMusiCNN();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTensorflowInputMusiCNN} [params]
   * @memberof TensorflowInputMusiCNN
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the audio frame
   * @returns {object} {bands: 'the log compressed mel bands'}
   * @memberof TensorflowInputMusiCNN
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TensorflowInputMusiCNN
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes mel-bands specific to the input of TempoCNN-based models. Check https://essentia.upf.edu/reference/std_TensorflowInputTempoCNN.html for more details.
* @class
*/
class TensorflowInputTempoCNN {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTensorflowInputTempoCNN} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.TensorflowInputTempoCNN();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTensorflowInputTempoCNN} [params]
   * @memberof TensorflowInputTempoCNN
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the audio frame
   * @returns {object} {bands: 'the mel bands'}
   * @memberof TensorflowInputTempoCNN
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TensorflowInputTempoCNN
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes mel-bands specific to the input of VGGish-based models. Check https://essentia.upf.edu/reference/std_TensorflowInputVGGish.html for more details.
* @class
*/
class TensorflowInputVGGish {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTensorflowInputVGGish} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.TensorflowInputVGGish();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTensorflowInputVGGish} [params]
   * @memberof TensorflowInputVGGish
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the audio frame
   * @returns {object} {bands: 'the log compressed mel bands'}
   * @memberof TensorflowInputVGGish
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TensorflowInputVGGish
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm computes tonal features for an audio signal Check https://essentia.upf.edu/reference/std_TonalExtractor.html for more details.
* @class
*/
class TonalExtractor {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsTonalExtractor = {
    frameSize: 4096,
    hopSize: 2048,
    tuningFrequency: 440,
  };
  private params: paramTypes.ParamsTonalExtractor = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTonalExtractor} [params]
  */
  constructor(params: paramTypes.ParamsTonalExtractor) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.TonalExtractor(this.params.frameSize, this.params.hopSize, this.params.tuningFrequency);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTonalExtractor} [params]
   * @memberof TonalExtractor
  */
  configure(params: paramTypes.ParamsTonalExtractor) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.hopSize, this.params.tuningFrequency);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the audio input signal
   * @returns {object} {chords_changes_rate: 'See ChordsDescriptors algorithm documentation', chords_histogram: 'See ChordsDescriptors algorithm documentation', chords_key: 'See ChordsDescriptors algorithm documentation', chords_number_rate: 'See ChordsDescriptors algorithm documentation', chords_progression: 'See ChordsDetection algorithm documentation', chords_scale: 'See ChordsDetection algorithm documentation', chords_strength: 'See ChordsDetection algorithm documentation', hpcp: 'See HPCP algorithm documentation', hpcp_highres: 'See HPCP algorithm documentation', key_key: 'See Key algorithm documentation', key_scale: 'See Key algorithm documentation', key_strength: 'See Key algorithm documentation'}
   * @memberof TonalExtractor
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TonalExtractor
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsTonalExtractor) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates the tonic frequency of the lead artist in Indian art music. It uses multipitch representation of the audio signal (pitch salience) to compute a histogram using which the tonic is identified as one of its peak. The decision is made based on the distance between the prominent peaks, the classification is done using a decision tree. An empty input signal will throw an exception. An exception will also be thrown if no predominant pitch salience peaks are detected within the maxTonicFrequency to minTonicFrequency range.  Check https://essentia.upf.edu/reference/std_TonicIndianArtMusic.html for more details.
* @class
*/
class TonicIndianArtMusic {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsTonicIndianArtMusic = {
    binResolution: 10,
    frameSize: 2048,
    harmonicWeight: 0.85,
    hopSize: 512,
    magnitudeCompression: 1,
    magnitudeThreshold: 40,
    maxTonicFrequency: 375,
    minTonicFrequency: 100,
    numberHarmonics: 20,
    numberSaliencePeaks: 5,
    referenceFrequency: 55,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsTonicIndianArtMusic = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTonicIndianArtMusic} [params]
  */
  constructor(params: paramTypes.ParamsTonicIndianArtMusic) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.TonicIndianArtMusic(this.params.binResolution, this.params.frameSize, this.params.harmonicWeight, this.params.hopSize, this.params.magnitudeCompression, this.params.magnitudeThreshold, this.params.maxTonicFrequency, this.params.minTonicFrequency, this.params.numberHarmonics, this.params.numberSaliencePeaks, this.params.referenceFrequency, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTonicIndianArtMusic} [params]
   * @memberof TonicIndianArtMusic
  */
  configure(params: paramTypes.ParamsTonicIndianArtMusic) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.binResolution, this.params.frameSize, this.params.harmonicWeight, this.params.hopSize, this.params.magnitudeCompression, this.params.magnitudeThreshold, this.params.maxTonicFrequency, this.params.minTonicFrequency, this.params.numberHarmonics, this.params.numberSaliencePeaks, this.params.referenceFrequency, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {tonic: 'the estimated tonic frequency [Hz]'}
   * @memberof TonicIndianArtMusic
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TonicIndianArtMusic
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsTonicIndianArtMusic) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes energy in triangular frequency bands of a spectrum. The arbitrary number of overlapping bands can be specified. For each band the power-spectrum (mag-squared) is summed. Check https://essentia.upf.edu/reference/std_TriangularBands.html for more details.
* @class
*/
class TriangularBands {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsTriangularBands = {
    frequencyBands: arrayToVector([21.533203125, 43.06640625, 64.599609375, 86.1328125, 107.666015625, 129.19921875, 150.732421875, 172.265625, 193.798828125, 215.33203125, 236.865234375, 258.3984375, 279.931640625, 301.46484375, 322.998046875, 344.53125, 366.064453125, 387.59765625, 409.130859375, 430.6640625, 452.197265625, 473.73046875, 495.263671875, 516.796875, 538.330078125, 559.86328125, 581.396484375, 602.9296875, 624.462890625, 645.99609375, 667.529296875, 689.0625, 710.595703125, 732.12890625, 753.662109375, 775.1953125, 796.728515625, 839.794921875, 861.328125, 882.861328125, 904.39453125, 925.927734375, 968.994140625, 990.52734375, 1012.06054688, 1055.12695312, 1076.66015625, 1098.19335938, 1141.25976562, 1184.32617188, 1205.859375, 1248.92578125, 1270.45898438, 1313.52539062, 1356.59179688, 1399.65820312, 1442.72460938, 1485.79101562, 1528.85742188, 1571.92382812, 1614.99023438, 1658.05664062, 1701.12304688, 1765.72265625, 1808.7890625, 1873.38867188, 1916.45507812, 1981.0546875, 2024.12109375, 2088.72070312, 2153.3203125, 2217.91992188, 2282.51953125, 2347.11914062, 2411.71875, 2497.8515625, 2562.45117188, 2627.05078125, 2713.18359375, 2799.31640625, 2885.44921875, 2950.04882812, 3036.18164062, 3143.84765625, 3229.98046875, 3316.11328125, 3423.77929688, 3509.91210938, 3617.578125, 3725.24414062, 3832.91015625, 3940.57617188, 4069.77539062, 4177.44140625, 4306.640625, 4435.83984375, 4565.0390625, 4694.23828125, 4844.97070312, 4974.16992188, 5124.90234375, 5275.63476562, 5426.3671875, 5577.09960938, 5749.36523438, 5921.63085938, 6093.89648438, 6266.16210938, 6459.9609375, 6653.75976562, 6847.55859375, 7041.35742188, 7256.68945312, 7450.48828125, 7687.35351562, 7902.68554688, 8139.55078125, 8376.41601562, 8613.28125, 8871.6796875, 9130.078125, 9388.4765625, 9668.40820312, 9948.33984375, 10249.8046875, 10551.2695312, 10852.734375, 11175.7324219, 11498.7304688, 11843.2617188, 12187.7929688, 12553.8574219, 12919.921875, 13285.9863281, 13673.5839844, 14082.7148438, 14491.8457031, 14922.5097656, 15353.1738281, 15805.3710938, 16257.5683594]),
    inputSize: 1025,
    log: true,
    normalize: 'unit_sum',
    sampleRate: 44100,
    type: 'power',
    weighting: 'linear',
  };
  private params: paramTypes.ParamsTriangularBands = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTriangularBands} [params]
  */
  constructor(params: paramTypes.ParamsTriangularBands) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.TriangularBands(this.params.frequencyBands, this.params.inputSize, this.params.log, this.params.normalize, this.params.sampleRate, this.params.type, this.params.weighting);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTriangularBands} [params]
   * @memberof TriangularBands
  */
  configure(params: paramTypes.ParamsTriangularBands) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frequencyBands, this.params.inputSize, this.params.log, this.params.normalize, this.params.sampleRate, this.params.type, this.params.weighting);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the input spectrum (must be greater than size one)
   * @returns {object} {bands: 'the energy in each band'}
   * @memberof TriangularBands
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TriangularBands
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsTriangularBands) {
    if (!params) return;
    if (params.frequencyBands) {
      params.frequencyBands = arrayToVector(params.frequencyBands);
    }
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes energy in the bark bands of a spectrum. It is different to the regular BarkBands algorithm in that is more configurable so that it can be used in the BFCC algorithm to produce output similar to Rastamat (http://www.ee.columbia.edu/ln/rosa/matlab/rastamat/)
See the BFCC algorithm documentation for more information as to why you might want to choose this over Mel frequency analysis
It is recommended that the input "spectrum" be calculated by the Spectrum algorithm. Check https://essentia.upf.edu/reference/std_TriangularBarkBands.html for more details.
* @class
*/
class TriangularBarkBands {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsTriangularBarkBands = {
    highFrequencyBound: 22050,
    inputSize: 1025,
    log: false,
    lowFrequencyBound: 0,
    normalize: 'unit_sum',
    numberBands: 24,
    sampleRate: 44100,
    type: 'power',
    weighting: 'warping',
  };
  private params: paramTypes.ParamsTriangularBarkBands = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTriangularBarkBands} [params]
  */
  constructor(params: paramTypes.ParamsTriangularBarkBands) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.TriangularBarkBands(this.params.highFrequencyBound, this.params.inputSize, this.params.log, this.params.lowFrequencyBound, this.params.normalize, this.params.numberBands, this.params.sampleRate, this.params.type, this.params.weighting);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTriangularBarkBands} [params]
   * @memberof TriangularBarkBands
  */
  configure(params: paramTypes.ParamsTriangularBarkBands) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.highFrequencyBound, this.params.inputSize, this.params.log, this.params.lowFrequencyBound, this.params.normalize, this.params.numberBands, this.params.sampleRate, this.params.type, this.params.weighting);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} spectrum the audio spectrum
   * @returns {object} {bands: 'the energy in bark bands'}
   * @memberof TriangularBarkBands
  */
  compute(spectrum: any) {
    return this.algoInstance.compute(spectrum);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TriangularBarkBands
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsTriangularBarkBands) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm extracts a segment of an audio signal given its start and end times.
Giving "startTime" greater than "endTime" will raise an exception. Check https://essentia.upf.edu/reference/std_Trimmer.html for more details.
* @class
*/
class Trimmer {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsTrimmer = {
    checkRange: false,
    endTime: 1e+06,
    sampleRate: 44100,
    startTime: 0,
  };
  private params: paramTypes.ParamsTrimmer = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTrimmer} [params]
  */
  constructor(params: paramTypes.ParamsTrimmer) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Trimmer(this.params.checkRange, this.params.endTime, this.params.sampleRate, this.params.startTime);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTrimmer} [params]
   * @memberof Trimmer
  */
  configure(params: paramTypes.ParamsTrimmer) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.checkRange, this.params.endTime, this.params.sampleRate, this.params.startTime);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {signal: 'the trimmed signal'}
   * @memberof Trimmer
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Trimmer
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsTrimmer) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm calculates the tristimulus of a signal given its harmonic peaks. The tristimulus has been introduced as a timbre equivalent to the color attributes in the vision. Tristimulus measures the mixture of harmonics in a given sound, grouped into three sections. The first tristimulus measures the relative weight of the first harmonic; the second tristimulus measures the relative weight of the second, third, and fourth harmonics taken together; and the third tristimulus measures the relative weight of all the remaining harmonics. Check https://essentia.upf.edu/reference/std_Tristimulus.html for more details.
* @class
*/
class Tristimulus {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTristimulus} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.Tristimulus();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTristimulus} [params]
   * @memberof Tristimulus
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frequencies the frequencies of the harmonic peaks ordered by frequency
   * @param {VectorFloat} magnitudes the magnitudes of the harmonic peaks ordered by frequency
   * @returns {object} {tristimulus: 'a three-element vector that measures the mixture of harmonics of the given spectrum'}
   * @memberof Tristimulus
  */
  compute(frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(frequencies, magnitudes);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Tristimulus
  */
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
*/
class TruePeakDetector {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsTruePeakDetector = {
    blockDC: false,
    emphasise: false,
    oversamplingFactor: 4,
    quality: 1,
    sampleRate: 44100,
    threshold: -0.0002,
    version: 4,
  };
  private params: paramTypes.ParamsTruePeakDetector = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTruePeakDetector} [params]
  */
  constructor(params: paramTypes.ParamsTruePeakDetector) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.TruePeakDetector(this.params.blockDC, this.params.emphasise, this.params.oversamplingFactor, this.params.quality, this.params.sampleRate, this.params.threshold, this.params.version);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTruePeakDetector} [params]
   * @memberof TruePeakDetector
  */
  configure(params: paramTypes.ParamsTruePeakDetector) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.blockDC, this.params.emphasise, this.params.oversamplingFactor, this.params.quality, this.params.sampleRate, this.params.threshold, this.params.version);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input audio signal
   * @returns {object} {peakLocations: 'the peak locations in the ouput signal', output: 'the processed signal'}
   * @memberof TruePeakDetector
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TruePeakDetector
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsTruePeakDetector) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm estimates the tuning frequency give a sequence/set of spectral peaks. The result is the tuning frequency in Hz, and its distance from 440Hz in cents. This version is slightly adapted from the original algorithm [1], but gives the same results. Check https://essentia.upf.edu/reference/std_TuningFrequency.html for more details.
* @class
*/
class TuningFrequency {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsTuningFrequency = {
    resolution: 1,
  };
  private params: paramTypes.ParamsTuningFrequency = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTuningFrequency} [params]
  */
  constructor(params: paramTypes.ParamsTuningFrequency) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.TuningFrequency(this.params.resolution);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTuningFrequency} [params]
   * @memberof TuningFrequency
  */
  configure(params: paramTypes.ParamsTuningFrequency) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.resolution);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frequencies the frequencies of the spectral peaks [Hz]
   * @param {VectorFloat} magnitudes the magnitudes of the spectral peaks
   * @returns {object} {tuningFrequency: 'the tuning frequency [Hz]', tuningCents: 'the deviation from 440 Hz (between -35 to 65 cents)'}
   * @memberof TuningFrequency
  */
  compute(frequencies: any, magnitudes: any) {
    return this.algoInstance.compute(frequencies, magnitudes);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TuningFrequency
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsTuningFrequency) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm extracts the tuning frequency of an audio signal Check https://essentia.upf.edu/reference/std_TuningFrequencyExtractor.html for more details.
* @class
*/
class TuningFrequencyExtractor {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsTuningFrequencyExtractor = {
    frameSize: 4096,
    hopSize: 2048,
  };
  private params: paramTypes.ParamsTuningFrequencyExtractor = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsTuningFrequencyExtractor} [params]
  */
  constructor(params: paramTypes.ParamsTuningFrequencyExtractor) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.TuningFrequencyExtractor(this.params.frameSize, this.params.hopSize);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsTuningFrequencyExtractor} [params]
   * @memberof TuningFrequencyExtractor
  */
  configure(params: paramTypes.ParamsTuningFrequencyExtractor) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.frameSize, this.params.hopSize);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the audio input signal
   * @returns {object} {tuningFrequency: 'the computed tuning frequency'}
   * @memberof TuningFrequencyExtractor
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof TuningFrequencyExtractor
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsTuningFrequencyExtractor) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
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
*/
class UnaryOperator {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsUnaryOperator = {
    scale: 1,
    shift: 0,
    type: 'identity',
  };
  private params: paramTypes.ParamsUnaryOperator = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsUnaryOperator} [params]
  */
  constructor(params: paramTypes.ParamsUnaryOperator) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.UnaryOperator(this.params.scale, this.params.shift, this.params.type);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsUnaryOperator} [params]
   * @memberof UnaryOperator
  */
  configure(params: paramTypes.ParamsUnaryOperator) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.scale, this.params.shift, this.params.type);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {array: 'the input array transformed by unary operation'}
   * @memberof UnaryOperator
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof UnaryOperator
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsUnaryOperator) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
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
*/
class UnaryOperatorStream {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsUnaryOperatorStream = {
    scale: 1,
    shift: 0,
    type: 'identity',
  };
  private params: paramTypes.ParamsUnaryOperatorStream = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsUnaryOperatorStream} [params]
  */
  constructor(params: paramTypes.ParamsUnaryOperatorStream) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.UnaryOperatorStream(this.params.scale, this.params.shift, this.params.type);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsUnaryOperatorStream} [params]
   * @memberof UnaryOperatorStream
  */
  configure(params: paramTypes.ParamsUnaryOperatorStream) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.scale, this.params.shift, this.params.type);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {array: 'the input array transformed by unary operation'}
   * @memberof UnaryOperatorStream
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof UnaryOperatorStream
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsUnaryOperatorStream) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the variance of an array. Check https://essentia.upf.edu/reference/std_Variance.html for more details.
* @class
*/
class Variance {
  private algoInstance: any;
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsVariance} [params]
  */
  constructor() {
    this.algoInstance = new wasmBackend.Variance();
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsVariance} [params]
   * @memberof Variance
  */
  configure() {
    this.algoInstance.configure();
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the input array
   * @returns {object} {variance: 'the variance of the input array'}
   * @memberof Variance
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Variance
  */
  delete() {
    this.algoInstance.delete();
  }
}
 
/**
* This algorithm detects the presence of vibrato and estimates its parameters given a pitch contour [Hz]. The result is the vibrato frequency in Hz and the extent (peak to peak) in cents. If no vibrato is detected in a frame, the output of both values is zero. Check https://essentia.upf.edu/reference/std_Vibrato.html for more details.
* @class
*/
class Vibrato {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsVibrato = {
    maxExtend: 250,
    maxFrequency: 8,
    minExtend: 50,
    minFrequency: 4,
    sampleRate: 344.531,
  };
  private params: paramTypes.ParamsVibrato = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsVibrato} [params]
  */
  constructor(params: paramTypes.ParamsVibrato) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Vibrato(this.params.maxExtend, this.params.maxFrequency, this.params.minExtend, this.params.minFrequency, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsVibrato} [params]
   * @memberof Vibrato
  */
  configure(params: paramTypes.ParamsVibrato) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.maxExtend, this.params.maxFrequency, this.params.minExtend, this.params.minFrequency, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} pitch the pitch trajectory [Hz].
   * @returns {object} {vibratoFrequency: 'estimated vibrato frequency (or speed) [Hz]; zero if no vibrato was detected.', vibratoExtend: 'estimated vibrato extent (or depth) [cents]; zero if no vibrato was detected.'}
   * @memberof Vibrato
  */
  compute(pitch: any) {
    return this.algoInstance.compute(pitch);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Vibrato
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsVibrato) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the warped auto-correlation of an audio signal. The implementation is an adapted version of K. Schmidt's implementation of the matlab algorithm from the 'warped toolbox' by Aki Harma and Matti Karjalainen found [2]. For a detailed explanation of the algorithm, see [1].
This algorithm is only defined for positive lambda = 1.0674*sqrt(2.0*atan(0.00006583*sampleRate)/PI) - 0.1916, thus it will throw an exception when the supplied sampling rate does not pass the requirements.
If maxLag is larger than the size of the input array, an exception is thrown. Check https://essentia.upf.edu/reference/std_WarpedAutoCorrelation.html for more details.
* @class
*/
class WarpedAutoCorrelation {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsWarpedAutoCorrelation = {
    maxLag: 1,
    sampleRate: 44100,
  };
  private params: paramTypes.ParamsWarpedAutoCorrelation = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsWarpedAutoCorrelation} [params]
  */
  constructor(params: paramTypes.ParamsWarpedAutoCorrelation) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.WarpedAutoCorrelation(this.params.maxLag, this.params.sampleRate);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsWarpedAutoCorrelation} [params]
   * @memberof WarpedAutoCorrelation
  */
  configure(params: paramTypes.ParamsWarpedAutoCorrelation) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.maxLag, this.params.sampleRate);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} array the array to be analyzed
   * @returns {object} {warpedAutoCorrelation: 'the warped auto-correlation vector'}
   * @memberof WarpedAutoCorrelation
  */
  compute(array: any) {
    return this.algoInstance.compute(array);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof WarpedAutoCorrelation
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsWarpedAutoCorrelation) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
*  This algorithm estimates the Power Spectral Density of the input signal using the Welch's method [1].
 The input should be fed with the overlapped audio frames. The algorithm stores internally therequired past frames to compute each output. Call reset() to clear the buffers. This implentation is based on Scipy [2] Check https://essentia.upf.edu/reference/std_Welch.html for more details.
* @class
*/
class Welch {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsWelch = {
    averagingFrames: 10,
    fftSize: 1024,
    frameSize: 512,
    sampleRate: 44100,
    scaling: 'density',
    windowType: 'hann',
  };
  private params: paramTypes.ParamsWelch = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsWelch} [params]
  */
  constructor(params: paramTypes.ParamsWelch) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Welch(this.params.averagingFrames, this.params.fftSize, this.params.frameSize, this.params.sampleRate, this.params.scaling, this.params.windowType);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsWelch} [params]
   * @memberof Welch
  */
  configure(params: paramTypes.ParamsWelch) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.averagingFrames, this.params.fftSize, this.params.frameSize, this.params.sampleRate, this.params.scaling, this.params.windowType);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input stereo audio signal
   * @returns {object} {psd: 'Power Spectral Density [dB] or [dB/Hz]'}
   * @memberof Welch
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Welch
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsWelch) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm applies windowing to an audio signal. It optionally applies zero-phase windowing and optionally adds zero-padding. The resulting windowed frame size is equal to the incoming frame size plus the number of padded zeros. By default, the available windows are normalized (to have an area of 1) and then scaled by a factor of 2. Check https://essentia.upf.edu/reference/std_Windowing.html for more details.
* @class
*/
class Windowing {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsWindowing = {
    constantsDecimals: 5,
    normalized: true,
    size: 1024,
    splitPadding: false,
    symmetric: true,
    type: 'hann',
    zeroPadding: 0,
    zeroPhase: true,
  };
  private params: paramTypes.ParamsWindowing = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsWindowing} [params]
  */
  constructor(params: paramTypes.ParamsWindowing) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.Windowing(this.params.constantsDecimals, this.params.normalized, this.params.size, this.params.splitPadding, this.params.symmetric, this.params.type, this.params.zeroPadding, this.params.zeroPhase);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsWindowing} [params]
   * @memberof Windowing
  */
  configure(params: paramTypes.ParamsWindowing) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.constantsDecimals, this.params.normalized, this.params.size, this.params.splitPadding, this.params.symmetric, this.params.type, this.params.zeroPadding, this.params.zeroPhase);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} frame the input audio frame
   * @returns {object} {frame: 'the windowed audio frame'}
   * @memberof Windowing
  */
  compute(frame: any) {
    return this.algoInstance.compute(frame);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof Windowing
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsWindowing) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
  }
}
 
/**
* This algorithm computes the zero-crossing rate of an audio signal. It is the number of sign changes between consecutive signal values divided by the total number of values. Noisy signals tend to have higher zero-crossing rate.
In order to avoid small variations around zero caused by noise, a threshold around zero is given to consider a valid zerocrosing whenever the boundary is crossed. Check https://essentia.upf.edu/reference/std_ZeroCrossingRate.html for more details.
* @class
*/
class ZeroCrossingRate {
  private algoInstance: any;
  private readonly defaultParams: paramTypes.ParamsZeroCrossingRate = {
    threshold: 0,
  };
  private params: paramTypes.ParamsZeroCrossingRate = { ...this.defaultParams };
  /**
   * Creates an instance of the algorithm and initializes it by configuring with default or given params
   * @constructor
   * @param {paramTypes.ParamsZeroCrossingRate} [params]
  */
  constructor(params: paramTypes.ParamsZeroCrossingRate) {
    this.updateParams(params);
    this.algoInstance = new wasmBackend.ZeroCrossingRate(this.params.threshold);
  }
  /**
   * Configure algorithm with default or given params
   * @method
   * @param {paramTypes.ParamsZeroCrossingRate} [params]
   * @memberof ZeroCrossingRate
  */
  configure(params: paramTypes.ParamsZeroCrossingRate) {
    this.updateParams(params);
    this.algoInstance.configure(this.params.threshold);
  }
  /**
   * Execute algorithm with given inputs
   * @method
   * @param {VectorFloat} signal the input signal
   * @returns {object} {zeroCrossingRate: 'the zero-crossing rate'}
   * @memberof ZeroCrossingRate
  */
  compute(signal: any) {
    return this.algoInstance.compute(signal);
  }
  /**
   * Delete algorithm instance
   * @method
   * @memberof ZeroCrossingRate
  */
  delete() {
    this.algoInstance.delete();
  }
  private updateParams(params: paramTypes.ParamsZeroCrossingRate) {
    if (!params) return;
    this.params = { ...this.defaultParams, ...params };
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
  ready
};