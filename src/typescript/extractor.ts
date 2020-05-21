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
 * EssentiaExtractor Base Class
 * @class 
 * @extends {Essentia}
 */
class EssentiaExtractor extends Essentia {

  public sampleRate: any=44100;
  public frameSize: any=4096;
  public hopSize: any=2048;

  public profile: any={
    Windowing: {
      normalized: true,
      size: this.frameSize,
      type: "blackmanharris62",
      zeroPadding: 0,
      zeroPhase: true
    },
    Spectrum: {
      size: this.frameSize
    },
    MelBands: {
      highFrequencyBound: 22050,
      inputSize: this.frameSize,
      log: false,
      lowFrequencyBound: 0,
      normalize: 'unit_sum',
      numberBands: 128,
      sampleRate: this.sampleRate,
      type: 'power',
      warpingFormula: 'htkMel',
      weighting: 'warping'
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
    UnaryOperator: {
      scale: 1,
      shift: 0,
      type: 'log'
    }
  };

  /**
   *Creates an instance of EssentiaExtractor.
  * @param {*} EssentiaModule
  * @param {boolean} [isDebug=false]
  * @constructs
  */
  constructor(public EssentiaModule: any, public isDebug: boolean=false) {
    super(EssentiaModule, isDebug);
  }

  /**
   * Compute mel spectrogram for a given audio data along with an optional extractor profile configuration
   * @method
   * @param {Float32Array} audioData decoded audio signal as Float32 typed array
   * @param {boolean} [asVector=false] whether to output the spectrogram as a vector float type for chaining with other essentia algorithms.
   * @param {*} [config=this.profile]
   * @returns {Array} Frame-wise Mel Spectrogram
   * @memberof EssentiaExtractor
   */
  melSpectrogram(audioData: Float32Array, asVector: boolean=false, config: any=this.profile) {
    // cut audio data into overlapping frames
    let frames = this.FrameGenerator(audioData, this.frameSize, this.hopSize);

    let logMelBandVec = new this.module.VectorVectorFloat();
    let logMelbandFrames = [];
  
    for (var i=0; i <=frames.size(); i++) {
      // we need to compute the following signal process chain 
      // audio frame => windowing => spectrum => mel bands => log scale
      var windowOut = this.Windowing(frames.get(i), 
                                    config.Windowing.normalized, 
                                    this.frameSize,
                                    config.Windowing.type, 
                                    config.Windowing.zeroPadding,
                                    config.Windowing.zeroPhase);
      var spectrumOut = this.Spectrum(windowOut.frame, this.frameSize);
      var melOut = this.MelBands(spectrumOut.spectrum, 
                                config.MelBands.highFrequencyBound, 
                                this.frameSize, 
                                config.MelBands.log, 
                                config.MelBands.lowFrequencyBound, 
                                config.MelBands.normalize, 
                                config.MelBands.numberBands, 
                                this.sampleRate,
                                config.MelBands.type,
                                config.MelBands.warpingFormula,
                                config.MelBands.weighting);
      var logNorm = this.UnaryOperator(melOut.bands,      
                                      config.UnaryOperator.scale, 
                                      config.UnaryOperator.shift,
                                      config.UnaryOperator.type);
      if (asVector) {
        logMelBandVec.push_back(logNorm.array);
      }
      else {
        // convert type to JS array
        let melBandFrame = this.vectorToArray(logNorm.array);
        logMelbandFrames.push(melBandFrame);
      }
    }
    // fallback to free the std vectors
    delete windowOut.frame;
    delete spectrumOut.spectrum;
    delete melOut.bands;
    delete logNorm.array;

    if (asVector) return logMelBandVec;
    else return logMelbandFrames;
  }
  
  /**
   * Compute frame-wise HPCP chroma feature for a given audio data along with an optional extractor profile configuration
   * @method
   * @param {Float32Array} audioData decoded audio signal as Float32 typed array
   * @param {boolean} [asVector=false] whether to output the hpcpgram as a vector float type for chaining with other essentia algorithms.
   * @param {*} [config=this.profile] 
   * @returns {Array} Frame-wise HPCP
   * @memberof EssentiaExtractor
   */
  hpcpgram(audioData: Float32Array, asVector: boolean=false, config: any=this.profile) {
    // cut audio data into overlapping frames
    let frames = this.FrameGenerator(audioData, this.frameSize, this.hopSize);

    let hpcpGramVec = new this.module.VectorVectorFloat();
    let hpcpGram = [];
    for (var i=0; i <=frames.size(); i++) { 
      // we need to compute the following signal process chain 
      // audio frame => windowing => spectrum => spectral peak => spectral whitening => HPCP
      var windowOut = this.Windowing(frames.get(i), 
                                    config.Windowing.normalized, 
                                    this.frameSize,
                                    config.Windowing.type, 
                                    config.Windowing.zeroPadding,
                                    config.Windowing.zeroPhase);

      var spectrumOut = this.Spectrum(windowOut.frame, this.frameSize);

      var peaksOut = this.SpectralPeaks(spectrumOut.spectrum,
                                        config.SpectralPeaks.magnitudeThreshold,
                                        config.SpectralPeaks.maxFrequency,
                                        config.SpectralPeaks.maxPeaks,
                                        config.SpectralPeaks.minFrequency,
                                        config.SpectralPeaks.orderBy,
                                        this.sampleRate);
      
      var whiteningOut = this.SpectralWhitening(spectrumOut.spectrum,
                                                peaksOut.frequencies,
                                                peaksOut.magnitudes,
                                                config.SpectralWhitening.maxFrequency,
                                                this.sampleRate);

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
                              this.sampleRate,
                              config.HPCP.size,
                              config.HPCP.weightType,
                              config.HPCP.windowSize);

      if (asVector) {
        hpcpGramVec.push_back(hpcpOut.hpcp);
      }
      else {
        // convert type to JS array
        let hpcpFrame = this.vectorToArray(hpcpOut.hpcp);
        hpcpGram.push(hpcpFrame);
      }
    }
    // fallback to free the std vectors
    delete windowOut.frame;
    delete spectrumOut.spectrum;
    delete peaksOut.frequencies;
    delete peaksOut.magnitudes;
    delete whiteningOut.magnitudes;
    delete hpcpOut.hpcp;

    if (asVector) return hpcpGramVec;
    else return hpcpGram;
  }

}

export default EssentiaExtractor;
