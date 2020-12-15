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


import { InputMusiCNN, InputVGGish, InputTempoCNN } from './types';


/**
 * Base class for loading a pre-trained Essentia-Tensorflow.js model for inference
 * using tensorflow.js. 
 * @class 
 */
class EssentiaTensorflowJSModel {

  public model: any = null;
  protected tf: any = null;
  protected isReady: boolean = false;
  protected modelPath: string = "";
  protected IS_TRAIN: any = null;

  constructor(tfjs: any, modelPath: string, verbose: boolean=false) {
    this.tf = tfjs;
    this.IS_TRAIN = this.tf.tensor([0], [1], 'bool');
    this.modelPath = modelPath;
    this.isReady = !!this.model;
  }

  public async loadModel(){
    this.model = await this.tf.loadGraphModel(this.modelPath);
    this.isReady = true;
  }

  public arrayToTensorAsBatches(inputfeatureArray: Float32Array, inputShape: any[], patchSize: number) {
    // convert a flattened 1D typed array into 2D tensor with given shape 
    let featureTensor = this.tf.tensor(
      inputfeatureArray,
      inputShape,
      'float32'
    );
    // create a tensor of zeros for zero-padding the output tensor if necessary
    let zeroPadTensor: any;
    // variable to store the dynamic batch size computed from given input array and patchSize
    let batchSize: number;

    // return the feature with batch size 1 if number of frames = patchSize
    if (inputShape[0] === patchSize) {
      return featureTensor.as3D(1, patchSize, inputShape[1]);
      // Otherwise do zeropadding 
    } else if (inputShape[0] >= patchSize) {
      if ((inputShape[0] % patchSize) != 0) {
        batchSize = Math.floor(inputShape[0] / patchSize) + 1;
        zeroPadTensor = this.tf.zeros(
          [
            Math.floor(((batchSize*patchSize*inputShape[1]) - inputfeatureArray.length) / inputShape[1]),
            inputShape[1]
          ], 
          'float32'
        );
        featureTensor = featureTensor.concat(zeroPadTensor);
        zeroPadTensor.dispose();
        return featureTensor.as3D(batchSize, patchSize, inputShape[1]);
      } else {
        batchSize = Math.floor(inputShape[0] / patchSize);
        zeroPadTensor = this.tf.zeros(
          [
            Math.floor(((batchSize*patchSize*inputShape[1]) - inputfeatureArray.length) / inputShape[1]),
            inputShape[1]
          ], 
          'float32'
        );
        featureTensor = featureTensor.concat(zeroPadTensor);
        zeroPadTensor.dispose();
        return featureTensor.as3D(batchSize, patchSize, inputShape[1]);
      }
    } else {
      // fixed batchSize=1 if the input array has lengh less than the given patchSize.
      batchSize = 1;
      zeroPadTensor = this.tf.zeros([patchSize-inputShape[0], inputShape[1]]);
      featureTensor = featureTensor.concat(zeroPadTensor);
      zeroPadTensor.dispose();
      return featureTensor.as3D(batchSize, patchSize, inputShape[1]);
    }
  }

  public dispose(): void {
    this.model.dispose();
  }
}


/**
 * Class with methods for computing common feature input representations
 * required for the inference of Essentia-Tensorflow.js MusiCNN-based 
 * pre-trained models using Essentia WASM backend.
 * @class 
 * @example
 * // FEATURE EXTRACTION
 * // Create `EssentiaTensorflowInputExtractor` instance by passing 
 * // essentia-wasm import `EssentiaWASM` global object and `extractorType=musicnn`.
 * const inputFeatureExtractor = new EssentiaTensorflowInputExtractor(EssentiaWASM, "musicnn");
 * // Compute feature for a given frame of audio signal
 * let inputMusiCNN = inputFeatureExtractor.compute(audioSignalFrame);
 * // INFERENCE
 * const modelURL = "./model.json"
 * // Where `tf` is the global import object from the `@tensorflow/tfjs*` package.
 * const musicnn = new TensorflowMusiCNN(tf, modelURL);
 * // Promise for loading the model
 * await musicnn.loadModel();
 * // Compute feature for a given frame of audio signal once the model loaded.
 * let predictions = await musicnn.predict(inputMusiCNN);
 */
class TensorflowMusiCNN extends EssentiaTensorflowJSModel {

  constructor(tfjs: any, model_url: string, verbose: boolean=false) {
    super(tfjs, model_url);
  }

  public async predict(inputFeature: InputMusiCNN): Promise<any[]> {

    if (!this.isReady) throw Error("No loaded tfjs model found! Make sure to call `loadModel` method and resolve the promise before calling `predict` method.");

    let featureTensor = this.arrayToTensorAsBatches(
      inputFeature.melSpectrum, 
      [inputFeature.batchSize, inputFeature.melBandsSize], 
      inputFeature.patchSize
    );

    let results = null;

    if (this.model.executor.inputs.length > 1) {
      results = await this.model.execute([featureTensor, this.IS_TRAIN.clone()])
    } else {
      results = await this.model.execute([featureTensor]);
    }
    featureTensor.dispose();
    let resultsArray = results.arraySync();
    results.dispose();
    return resultsArray;
  }

}


/**
 * Class with methods for computing common feature input representations
 * required for the inference of Essentia-Tensorflow.js VGGish-based 
 * pre-trained models using Essentia WASM backend.
 * @class 
 * @example
 * // FEATURE EXTRACTION
 * // Create `EssentiaTensorflowInputExtractor` instance by passing 
 * // essentia-wasm import `EssentiaWASM` global object and `extractorType=vggish`.
 * const inputFeatureExtractor = new EssentiaTensorflowInputExtractor(EssentiaWASM, "vggish");
 * // Compute feature for a given frame of audio signal
 * let inputVGGish = inputFeatureExtractor.compute(audioSignalFrame);
 * // INFERENCE
 * const modelURL = "./model.json"
 * // Where `tf` is the global import object from the `@tensorflow/tfjs*` package.
 * const vggish = new TensorflowVGGish(tf, modelURL);
 * // Promise for loading the model
 * await vggish.loadModel();
 * // Compute feature for a given frame of audio signal once the model loaded.
 * let predictions = await vggish.predict(inputVGGish);
 */
class TensorflowVGGish extends EssentiaTensorflowJSModel {

  constructor(tfjs: any, model_url: string, verbose: boolean=false) {
    super(tfjs, model_url);
  }

  public async predict(inputFeature: InputVGGish): Promise<any[]> {

    if (!this.isReady) throw Error("No loaded tfjs model found! Make sure to call `loadModel` method and resolve the promise before calling `predict` method.");

    let featureTensor = this.arrayToTensorAsBatches(
      inputFeature.melSpectrum, 
      [inputFeature.batchSize, inputFeature.melBandsSize], 
      inputFeature.patchSize
    );

    let results = null;
    let inputsCount = this.model.executor.inputs.length;

    if (inputsCount === 1) {
      results = await this.model.execute([featureTensor]);
    } else if (inputsCount === 2){
      results = await this.model.execute([featureTensor, this.IS_TRAIN.clone()]);
    } else if (inputsCount === 3){
      // Overhead from the tensorflowjs-converter, creates random tensorinput without
      // connected to other layers for some vggish models trained on audioset. 
      // The tfjs model needs this unsignificant tensor object on the prediction call.
      // This will removed in future once this has been sorted on the conversation process.
      let randomTensor = this.tf.zeros([1, this.model.executor.inputs[0].shape[1]]);
      results = await this.model.execute([featureTensor, this.IS_TRAIN.clone(), randomTensor]);
      randomTensor.dispose();
    } else {
      throw Error("Found unsupported number of input requirements for the VGGish model.");
    }
    
    featureTensor.dispose();
    let resultsArray = results.arraySync();
    results.dispose();
    return resultsArray;
  }


}


// class TensorflowTempoCNN extends EssentiaTensorflowJSModel {


//   constructor(tfjs: any, model_url: string, verbose: boolean=false) {
//     super(tfjs, model_url);
//   }

//   public async predict(spectrum: InputTempoCNN, layerName: string) {

//   }
  
// }


export {
  EssentiaTensorflowJSModel,
  TensorflowMusiCNN,
  TensorflowVGGish,
  // TensorflowTempoCNN
};
