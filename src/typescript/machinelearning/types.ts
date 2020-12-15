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


/**
 * Generic output feature type computed by the `EssentiaTensorflowInputExtractor.compute` method.
 * @type
 */
type EssentiaTensorflowInputExtractorOutput = {
  melSpectrum: any,
  patchSize:number,
  batchSize: number,
  melBandsSize: number 
};

/**
 * Custom input feature type accpeted by `TensorflowMusiCNN.predict` method
 * @type
 */
type InputMusiCNN = {
  melSpectrum: Float32Array,
  patchSize:187,
  batchSize: any,
  melBandsSize: 96 
};

/**
 * Custom input feature type accpeted by `TensorflowVGGish.predict` method
 * @type
 */
type InputVGGish = {
  melSpectrum: Float32Array,
  patchSize:96,
  batchSize: any,
  melBandsSize: 64 
};

/**
 * Custom input feature type accpeted by `TensorflowTempoCNN.predict` method
 * @type
 */
type InputTempoCNN = {
  melSpectrum: Float32Array,
  patchSize:256,
  batchSize: any,
  melBandsSize: 40 
};

export {
  InputMusiCNN,
  InputVGGish,
  InputTempoCNN,
  EssentiaTensorflowInputExtractorOutput
};
