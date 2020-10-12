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

import Essentia from "./core_api";

/**
 * EssentiaExtractor 
 * This class provides one-liner methods which implements the whole chain of algorithms required for computing features such as log-scaled mel spectrogram, HPCP chroma features etc This can be extended according to your needs.
 * @class 
 * @extends {Essentia}
 */
class EssentiaExtractor extends Essentia {

  public sampleRate: any=44100;
  public frameSize: any=2048;

  public profile: any={
    Windowing: {
      normalized: false,
      size: 1024,
      type: "hann",
      zeroPadding: 0,
      zeroPhase: true
    },
    Spectrum: {
      size: this.frameSize
    },
    MelBands: {
      highFrequencyBound: Math.floor(this.sampleRate / 2),
      inputSize: Math.floor(this.frameSize / (2+1)),
      log: false,
      lowFrequencyBound: 0,
      normalize: 'unit_tri',
      numberBands: 96,
      sampleRate: this.sampleRate,
      type: 'power',
      warpingFormula: 'slaneyMel',
      weighting: 'linear'
    },
    SpectralPeaks: {
      magnitudeThreshold: 0,
      maxFrequency: 4500,
      maxPeaks: 100,
      minFrequency: 80,
      orderBy: 'frequency',
      sampleRate: this.sampleRate,
    },
    SpectralWhitening: {
      maxFrequency: 4500,
      sampleRate: this.sampleRate
    },
    HPCP: {
      bandPreset: true,
      bandSplitFrequency: 500,
      harmonics: 0,
      maxFrequency: 4500,
      maxShifted: false,
      minFrequency: 80,
      nonLinear: false,
      normalized: 'unitMax',
      referenceFrequency: 440,
      sampleRate: this.sampleRate,
      size: 12, // chroma bin size
      weightType: 'squaredCosine',
      windowSize: 1
    },
  };

  /**
   *Creates an instance of EssentiaExtractor.
  * @param {*} EssentiaWASM
  * @param {boolean} [isDebug=false]
  * @constructs
  */
  constructor(public EssentiaWASM: any, public isDebug: boolean=false) {
    super(EssentiaWASM, isDebug);
  }

  /**
   * Compute log-scaled mel spectrogram for a given audio signal frame along with an optional extractor profile configuration
   * @method
   * @param {Float32Array} audioFrame a frame of decoded audio signal as Float32 typed array.
   * @param {number} sampleRate Sample rate of the input audio signal.
   * @param {boolean} [asVector=false] whether to output the spectrogram as a vector float type for chaining with other essentia algorithms.
   * @param {*} [config=this.profile]
   * @returns {Array} Log-scaled Mel Spectrum
   * @memberof EssentiaExtractor
   */
  melSpectrumExtractor(audioFrame: Float32Array, sampleRate: number=this.sampleRate, asVector: boolean=false, config: any=this.profile) {

    const signalFrame = this.arrayToVector(audioFrame);

    let _frameSize = audioFrame.length;

    // we need to compute the following signal process chain 
    // audio frame => windowing => spectrum => mel bands => log scale
    var windowOut = this.Windowing(signalFrame, 
                                  config.Windowing.normalized, 
                                  config.Windowing.size,
                                  config.Windowing.type, 
                                  config.Windowing.zeroPadding,
                                  config.Windowing.zeroPhase);
    
    var spectrumOut = this.Spectrum(windowOut.frame, _frameSize);

    var melOut = this.MelBands(spectrumOut.spectrum, 
                              config.MelBands.highFrequencyBound, 
                              Math.floor(_frameSize / (2+1)), 
                              config.MelBands.log, 
                              config.MelBands.lowFrequencyBound, 
                              config.MelBands.normalize, 
                              config.MelBands.numberBands, 
                              sampleRate,
                              config.MelBands.type,
                              config.MelBands.warpingFormula,
                              config.MelBands.weighting);
    
    // shift operation of mel-spectrograms
    var shift = this.UnaryOperator(melOut.bands,      
                                  10000, 
                                  1);
    
    // logarithmic compression of mel-spectrograms
    var logComp = this.UnaryOperator(shift.array, 1, 0, "log10");
      
    // return the output of the feature extractor either as VectorFloat type or as JavaScript Float32 typed array
    if (asVector) {

      // fallback to free the std vectors
      //delete windowOut.frame;
      delete spectrumOut.spectrum;
      delete melOut.bands;
      delete shift.array;

      return logComp.array;
    }
    else {
      // convert type to JS array
      let logMelBands = this.vectorToArray(logComp.array);

      // fallback to free the std vectors
      //delete windowOut.frame;
      delete spectrumOut.spectrum;
      delete melOut.bands;
      delete shift.array;
      delete logComp.array;

      return logMelBands;
    }
  }
  
  /**
   * Compute HPCP chroma feature for a given audio signal frame along with an optional extractor profile configuration
   * @method
   * @param {Float32Array} audioFrame a decoded audio signal frame as Float32 typed array.
   * @param {number} sampleRate Sample rate of the input audio signal.
   * @param {boolean} [asVector=false] whether to output the hpcpgram as a vector float type for chaining with other essentia algorithms.
   * @param {*} [config=this.profile] 
   * @returns {Array} Frame-wise HPCP
   * @memberof EssentiaExtractor
   */
  hpcpExtractor(audioFrame: Float32Array, sampleRate: number=this.sampleRate, asVector: boolean=false, config: any=this.profile) {
  
    const signalFrame = this.arrayToVector(audioFrame);

    let _frameSize = audioFrame.length;

    // we need to compute the following signal process chain 
    // audio frame => windowing => spectrum => spectral peak => spectral whitening => HPCP
    var windowOut = this.Windowing(signalFrame, 
                                  config.Windowing.normalized, 
                                  config.Windowing.size,
                                  config.Windowing.type, 
                                  config.Windowing.zeroPadding,
                                  config.Windowing.zeroPhase);

    var spectrumOut = this.Spectrum(windowOut.frame, _frameSize);

    var peaksOut = this.SpectralPeaks(spectrumOut.spectrum,
                                      config.SpectralPeaks.magnitudeThreshold,
                                      config.SpectralPeaks.maxFrequency,
                                      config.SpectralPeaks.maxPeaks,
                                      config.SpectralPeaks.minFrequency,
                                      config.SpectralPeaks.orderBy,
                                      sampleRate);
      
    var whiteningOut = this.SpectralWhitening(spectrumOut.spectrum,
                                              peaksOut.frequencies,
                                              peaksOut.magnitudes,
                                              config.SpectralWhitening.maxFrequency,
                                              sampleRate);

    var hpcpOut = this.HPCP(peaksOut.frequencies,
                            whiteningOut.magnitudes,
                            config.HPCP.bandPreset,
                            config.HPCP.bandSplitFrequency,
                            config.HPCP.harmonics,
                            config.HPCP.maxFrequency,
                            config.HPCP.maxShifted,
                            config.HPCP.minFrequency,
                            config.HPCP.nonLinear,
                            config.HPCP.normalized,
                            config.HPCP.referenceFrequency,
                            sampleRate,
                            config.HPCP.size,
                            config.HPCP.weightType,
                            config.HPCP.windowSize);

    
    // return the output of the feature extractor either as VectorFloat type or as JavaScript Float32 typed array
    if (asVector) {
      // fallback to free the std vectors
      delete windowOut.frame;
      delete spectrumOut.spectrum;
      delete peaksOut.frequencies;
      delete peaksOut.magnitudes;
      delete whiteningOut.magnitudes;

      return hpcpOut.hpcp;
    }
    else {
      // convert type to JS array
      let hpcpFrame = this.vectorToArray(hpcpOut.hpcp);

      delete windowOut.frame;
      delete spectrumOut.spectrum;
      delete peaksOut.frequencies;
      delete peaksOut.magnitudes;
      delete whiteningOut.magnitudes;
      delete hpcpOut.hpcp;
     
      return hpcpFrame;
    }
  }

  // Add your new extractor methods here ...
}

export default EssentiaExtractor;
