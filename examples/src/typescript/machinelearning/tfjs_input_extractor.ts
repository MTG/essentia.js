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

import { EssentiaTFInputExtractorOutput } from "./types";

/**
 * Class with methods for computing common feature input representations required 
 * for the inference of Essentia-Tensorflow.js pre-trained models using EssentiaWASM 
 * backend which is imported from `essentia-wasm*.js` builds.
 * @class 
 * @example
 * // Create `EssentiaTFInputExtractor` instance by passing EssentiaWASM import object and `extractorType` value.
 * const extractor = new EssentiaTFInputExtractor(EssentiaWASM, "musicnn");
 * // Compute feature for a given frame of audio signal
 * let featureMusiCNN = extractor.compute(audioSignalFrame);
 * // Change the feature extractor with a new setting for VGGish input
 * extractor.extractorType = "vggish";
 * let featureVGGish = extractor.compute(audioSignalFrame);
 * // Delete and shutdown the extractor instance if you don't need it anymore.
 * extractor.delete();
 * extractor.shutdown();
 */
class EssentiaTFInputExtractor {

  /** 
  * @property {EssentiaJS} this.essentia an instance of `EssentiaWASM.EssentiaJS`. 
  * @property {string} this.extractorType type of the choosen extractor (eg. 'muscinn', 'vggish' or 'tempocnn').
  */
  public essentia: any = null;
  public extractorType: string;
  protected module: any = null;
  protected frameSize: number = 512;
  private sampleRate: number = 16000;

  /**  
  * @constructs
  * @param {EssentiaWASM} EssentiaWASM Essentia WASM emcripten global module object 
  * @param {string} [extractorType='musicnn'] type of the desired extractor type (eg. 'muscinn', 'vggish' or 'tempocnn').
  * @param {boolean} [isDebug=false] whether to enable EssentiaWASM internal debugger for logs.
  */
  constructor(EssentiaWASM: any, extractorType: string="musicnn", isDebug: boolean=false) {
    this.extractorType = extractorType;
    if (this.extractorType === "musicnn") this.frameSize = 512;
    else if (this.extractorType === "vggish") this.frameSize = 400;
    else if (this.extractorType === "tempocnn") this.frameSize = 1024;
    else throw Error("Invalid 'extractorType' choice! Available types are [musicnn', 'vggish', 'tempocnn']");
    this.essentia = new EssentiaWASM.EssentiaJS(isDebug);
    this.module = EssentiaWASM;
  }

  /**
   * Convert a typed JS Float32Array into VectorFloat type.
   * @method
   * @param {Float32Array} inputArray input Float32 typed array.
   * @returns {VectorFloat} returns converted VectorFloat array.
   * @memberof EssentiaTFInputExtractor
   */
  public arrayToVector(inputArray: Float32Array) {
    return this.module.arrayToVector(inputArray);
  }

  /**
   * Convert an input VectorFloat array into typed JS Float32Array 
   * @method 
   * @param {VectorFloat} inputVector input VectorFloat array
   * @returns {Float32Array} returns converted JS typed array
   * @memberof EssentiaTFInputExtractor
   */
  public vectorToArray(inputVector: any): Float32Array {
    return this.module.vectorToArray(inputVector);
  }

  /**
   * Decode and returns the audio buffer from an given audio url or blob uri using Web Audio API. (NOTE: This doesn't work on Safari browser)
   * @async
   * @method
   * @param {string} audioURL web url or blob uri of a audio file
   * @param {AudioContext} webAudioCtx an instance of Web Audio API `AudioContext`
   * @returns {Promise<AudioBuffer>} decoded audio buffer as a promise
   * @memberof EssentiaTFInputExtractor
   */
  public async getAudioBufferFromURL(audioURL: string, webAudioCtx: AudioContext): Promise<AudioBuffer> {
    const response = await fetch(audioURL);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await webAudioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer
  }

  /**
   * Convert an AudioBuffer object to a Mono audio signal array. The audio signal is downmixed
   * to mono using essentia `MonoMixer` algorithm if the audio buffer has 2 channels of audio.
   * Throws an expection if the input AudioBuffer object has more than 2 channels of audio.
   * @method
   * @param {AudioBuffer} buffer `AudioBuffer` object decoded from an audio file.
   * @returns {Float32Array} audio channel data. (downmixed to mono if its stereo signal).
   * @memberof EssentiaTFInputExtractor
   */
  public audioBufferToMonoSignal(buffer: AudioBuffer): Float32Array {
    if (buffer.numberOfChannels === 1) {
      return buffer.getChannelData(0);
    }
    if (buffer.numberOfChannels === 2) {
      const left = this.arrayToVector(buffer.getChannelData(0));
      const right = this.arrayToVector(buffer.getChannelData(1));
      let monoSignal = this.essentia.MonoMixer(left, right).audio;
      return this.vectorToArray(monoSignal);
    }
    throw new Error('Unexpected number of channels found in audio buffer. Only accepts mono or stereo audio buffers.');
  }

  /**
   * Downsample a audio buffer to a target audio sample rate using the Web Audio API
   * NOTE: This method will only works on web-browsers which supports the Web Audio API.
   * @method
   * @param {AudioBuffer} sourceBuffer `AudioBuffer` object decoded from an audio file.
   * @returns {Float32Array} decoded audio buffer object
   * @memberof EssentiaTFInputExtractor
   */
  public downsampleAudioBuffer(sourceBuffer: AudioBuffer): Promise<Float32Array> {
    // adapted from https://github.com/julesyoungberg/soundboy/blob/main/worker/loadSoundFile.ts#L25
    const ctx = new OfflineAudioContext(1, sourceBuffer.duration * this.sampleRate, this.sampleRate);
    // create mono input buffer
    const buffer = ctx.createBuffer(1, sourceBuffer.length, sourceBuffer.sampleRate);
    buffer.copyToChannel(this.audioBufferToMonoSignal(sourceBuffer), 0);
    // connect the buffer to the context
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    // resolve when the source buffer has been rendered to a downsampled buffer
    return new Promise((resolve) => {
        ctx.oncomplete = (e) => {
            const rendered = e.renderedBuffer;
            const samples = rendered.getChannelData(0);
            resolve(samples);
        };

        ctx.startRendering();
        source.start(0);
    });
  }

  /**
   * This method compute the pre-configured features for a given audio signal frame.
   * It throws an exception if the size of audioFrame is not equal to the pre-configured 
   * audioFrame size for the selected `extractorType` setting.
   * @method 
   * @param {Float32Array} audioFrame a frame of audio signal as Float32 typed JS array.
   * @returns {EssentiaTFInputExtractorOutput} returns the computed feature for the input the given audio frame.
   * @memberof EssentiaTFInputExtractor
   */
  public compute(audioFrame: Float32Array | any[]): EssentiaTFInputExtractorOutput {
    let frame;
    if (audioFrame instanceof Float32Array) {
      frame = this.arrayToVector(audioFrame);
    } else { frame = audioFrame } // assume it's of type VectorFloat
    
    // setup feature extractor based on the given `extractorType` input.
    switch(this.extractorType) { 
      case "musicnn": { 
        if (audioFrame.length != this.frameSize) throw new Error("The chosen `extractorType` only works with an audio signal frame size of " + this.frameSize);
        let spectrum = this.essentia.TensorflowInputMusiCNN(frame);
        return {
          melSpectrum: this.vectorToArray(spectrum.bands),
          frameSize: 1,
          patchSize: 187,
          melBandsSize: 96
        }; 
      }
      case "vggish": {
        if (audioFrame.length != this.frameSize) throw new Error("The chosen `extractorType` only works with an audio signal frame size of 400 " + this.frameSize);
        let spectrum = this.essentia.TensorflowInputVGGish(frame);
        return {
          melSpectrum: this.vectorToArray(spectrum.bands),
          frameSize: 1,
          patchSize: 96,
          melBandsSize: 64
        };   
      } 
      case "tempocnn": { 
        if (audioFrame.length != this.frameSize) throw Error("The chosen `extractorType` only works with an audio signal frame size of " + this.frameSize);
        let spectrum = this.essentia.TensorflowInputTempoCNN(frame);
        return {
          melSpectrum: this.vectorToArray(spectrum.bands),
          frameSize: 1,
          patchSize: 256,
          melBandsSize: 40
        };    
      } 
      default: { 
        throw Error("Invalid 'extractorType' choice! Available types are [musicnn', 'vggish', 'tempocnn']")             
      } 
    }
  }

  /**
   * This method compute the pre-configured feature for a whole audio signal.
   * It is a wrapper on top of the `compute` method. It throws an exception 
   * if the size of audioFrame is not equal to the pre-configured size.
   * @method 
   * @param {Float32Array} audioSignal decoded audio signal as Float32 typed JS array.
   * @param {number} hopSize? optional param for specifying hopSize for overlapping-frames. By default use none.
   * @returns {EssentiaTFInputExtractorOutput} returns the computed frame-wise feature for the given audio signal.
   * @memberof EssentiaTFInputExtractor
   */
  public computeFrameWise(audioSignal: Float32Array, hopSize?: number): EssentiaTFInputExtractorOutput {
    let _hopSize: number;
    if(hopSize) _hopSize = hopSize;
    else _hopSize = this.frameSize;
    // compute overlapping frames given frameSize, hopSize
    let frames = this.essentia.FrameGenerator(audioSignal, this.frameSize, _hopSize);
    let melSpectrogram = [];
    let framewiseFeature: any = null;
    for (var i=0; i<frames.size(); i++) {
      framewiseFeature = this.compute(this.vectorToArray(frames.get(i)));
      melSpectrogram.push(framewiseFeature.melSpectrum);
    }
    framewiseFeature.melSpectrum = melSpectrogram;
    framewiseFeature.frameSize = frames.size();
    frames.delete();
    return framewiseFeature;
  }
 
  /**
   * Delete essentia session and frees the memory.
   * @method 
   * @returns {null} 
   * @memberof EssentiaTFInputExtractor
   */
  public delete(): void {
    this.essentia.delete();
  }

  /**
   * This method shutdown all the instance of Essentia WASM and frees the memory.
   * NOTE: If you want to just free the memory of the pre-configured extractor, 
   * use `this.extractor.delete()` instead.
   * @method 
   * @returns {null} 
   * @memberof EssentiaTFInputExtractor
   */
  public shutdown(): void {
    this.essentia.shutdown();
  }
}

export { EssentiaTFInputExtractor }
