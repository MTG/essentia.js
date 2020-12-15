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

import { EssentiaTensorflowInputExtractorOutput } from "./types";

/**
 * Class with methods for computing common feature input representations required 
 * for the inference of Essentia-Tensorflow.js pre-trained models using EssentiaWASM 
 * backend which is imported from `essentia-wasm*.js` builds.
 * @class 
 * @example
 * // Create `EssentiaTensorflowInputExtractor` instance by passing EssentiaWASM import object and `extractorType` value.
 * const extractor = new EssentiaTensorflowInputExtractor(EssentiaWASM, "musicnn");
 * // Compute feature for a given frame of audio signal
 * let featureMusiCNN = extractor.compute(audioSignalFrame);
 * // Change the feature extractor with a new setting for VGGish input
 * extractor.extractorType = "vggish";
 * let featureVGGish = extractor.compute(audioSignalFrame);
 * // Delete and shutdown the extractor instance if you don't need it anymore.
 * extractor.delete();
 * extractor.shutdown();
 */
class EssentiaTensorflowInputExtractor {

  /** 
  * @property {EssentiaJS} this.essentia an instance of `EssentiaWASM.EssentiaJS`. 
  * @property {string} this.extractorType List of available Essentia alogrithms from the WASM backend
  */
  public essentia: any = null;
  public extractorType: string;
  protected module: any = null;

  /**  
  * @constructs
  * @param {EssentiaWASM} EssentiaWASM Essentia WASM emcripten global module object 
  * @param {string} [extractorType='musicnn']
  */
  constructor(EssentiaWASM: any, extractorType: string="musicnn", isDebug: boolean=false) {
    this.essentia = new EssentiaWASM.EssentiaJS(isDebug);
    this.module = EssentiaWASM;
    this.extractorType = extractorType;
  }

  /**
   * Convert a typed JS Float32Array into VectorFloat type.
   * @method
   * @param {Float32Array} inputArray input Float32 typed array.
   * @returns {VectorFloat} returns converted VectorFloat array.
   * @memberof EssentiaTensorflowInputExtractor
   */
  public arrayToVector(inputArray: Float32Array) {
    return this.module.arrayToVector(inputArray);
  }

  /**
   * Convert an input VectorFloat array into typed JS Float32Array 
   * @method 
   * @param {VectorFloat} inputVector input VectorFloat array
   * @returns {Float32Array} returns converted JS typed array
   * @memberof EssentiaTensorflowInputExtractor
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
   * @returns {AudioBuffer} decoded audio buffer as promise
   * @memberof EssentiaTensorflowInputExtractor
   */
  async getAudioBufferFromURL(audioURL: string, webAudioCtx: AudioContext): Promise<AudioBuffer> {
    const response = await fetch(audioURL);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await webAudioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer
  }

  /**
   * This method compute the pre-configured features for a given audio signal frame.
   * It throws an exception if the size of audioFrame is not equal to the pre-configured 
   * audioFrame size for the selected `extractorType` setting.
   * @method 
   * @param {Float32Array} audioFrame a frame of audio signal as Float32 typed JS array.
   * @returns {EssentiaTensorflowInputExtractorOutput} returns the computed feature for the input the audio frame as custom JS object type.
   * @memberof EssentiaTensorflowInputExtractor
   */
  public compute(audioFrame: Float32Array): EssentiaTensorflowInputExtractorOutput {
    // setup feature extractor based on the given `extractorType` input.
    switch(this.extractorType) { 
      case "musicnn": { 
        if (audioFrame.length != 512) throw new Error("The chosen `extractorType` only works with an audio signal frame of 512 samples.");
        let spectrum = this.essentia.TensorflowInputMusiCNN(this.arrayToVector(audioFrame));
        return {
          melSpectrum: this.vectorToArray(spectrum.bands),
          batchSize: 1,
          patchSize: 187,
          melBandsSize: 96
        }; 
      }
      case "vggish": {
        if (audioFrame.length != 400) throw new Error("The chosen `extractorType` only works with an audio signal frame of 400 samples.");
        let spectrum = this.essentia.TensorflowInputVGGish(this.arrayToVector(audioFrame));
        return {
          melSpectrum: this.vectorToArray(spectrum.bands),
          batchSize: 1,
          patchSize: 187,
          melBandsSize: 96
        };   
      } 
      // case "tempocnn": { 
      //   if (audioFrame.length != 1024) throw "The chosen `extractorType` only works with an audio signal frame of 1024 samples.";
      //   let spectrum = this.essentia.TensorflowInputTempoCNN(audioFrame);
      //   return {
      //     melSpectrum: this.vectorToArray(spectrum.bands),
      //     batchSize: 1,
      //     patchSize: 187,
      //     melBandsSize: 96
      //   };    
      // } 
      default: { 
        throw "Invalid 'extractorType' choice! Available types are [musicnn', 'vggish', 'tempocnn']"             
      } 
    }
  }
 
  /**
   * Delete essentia session and frees the memory.
   * @method 
   * @returns {null} 
   * @memberof EssentiaTensorflowInputExtractor
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
   * @memberof EssentiaTensorflowInputExtractor
   */
  public shutdown(): void {
    this.essentia.shutdown();
  }
}

export { EssentiaTensorflowInputExtractor }
