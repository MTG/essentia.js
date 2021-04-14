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


import { InputMusiCNN, InputVGGish, InputTempoCNN, EssentiaTFInputExtractorOutput } from './types';


/**
 * Base class for loading a pre-trained Essentia-Tensorflow.js model for inference
 * using TensorFlow.js. 
 * @class 
 */
class EssentiaTensorflowJSModel {

  public model: any = null;
  protected audioSampleRate: number = 16000;
  protected tf: any = null;
  protected isReady: boolean = false;
  protected modelPath: string = "";
  protected IS_TRAIN: any = null;
  protected randomTensorInput: any = null;
  protected minimumInputFrameSize: any = null;

  constructor(tfjs: any, modelPath: string, verbose: boolean=false) {
    this.tf = tfjs;
    this.IS_TRAIN = this.tf.tensor([0], [1], 'bool');
    this.modelPath = modelPath;
    this.isReady = !!this.model;
  }

  /**
   * Promise for loading & initialise an Essentia.js-TensorFlow.js model.
   * @async
   * @method
   * @memberof EssentiaTensorflowJSModel
   */
  public async initialize(): Promise<void> {
    this.model = await this.tf.loadGraphModel(this.modelPath);
    this.isReady = true;
  }

  /**
   * Converts an input 1D or 2D array into a 3D tensor (tfjs) given it's shape and required
   * patchSize. If `padding=true`, this method will zero-pad the input feature.
   * 
   * @method 
   * @param {Float32Array|any[]} inputFeatureArray input feature array as either 1D or 2D array
   * @param {any[]} inputShape shape of the input feature array in 2D.
   * @param {number} patchSize required patchSize to dynamically make batches of feature
   * @param {boolean} [zeroPadding=false] whether to enable zero-padding if less frames found for a batch.
   * @returns {tf.Tensor3D} returns the computed frame-wise feature for the given audio signal.
   * @memberof EssentiaTensorflowJSModel
   */
  public arrayToTensorAsBatches(inputfeatureArray: Float32Array|any[], inputShape: any[], patchSize: number, zeroPadding: boolean=false) {
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

    if (!zeroPadding) {
      this.assertMinimumFeatureInputSize({
        melSpectrum: inputfeatureArray,
        frameSize: inputShape[0],
        melBandsSize: inputShape[1],
        patchSize: patchSize
      });
      return featureTensor.as3D(1, patchSize, inputShape[1])
    // return the feature with batch size 1 if number of frames = patchSize
    } else if (inputShape[0] === patchSize) {
      return featureTensor.as3D(1, patchSize, inputShape[1]);
      // Otherwise do zeropadding 
    } else if (inputShape[0] > patchSize) {
        if ((inputShape[0] % patchSize) != 0) {
          batchSize = Math.floor(inputShape[0] / patchSize) + 1;
          zeroPadTensor = this.tf.zeros(
            [
              Math.floor(batchSize*patchSize - inputfeatureArray.length),
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
              Math.floor(batchSize*patchSize - inputfeatureArray.length),
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

  protected assertMinimumFeatureInputSize(inputFeature: EssentiaTFInputExtractorOutput): void {
    this.minimumInputFrameSize = inputFeature.frameSize*inputFeature.melBandsSize;
    if (inputFeature.melSpectrum.length != this.minimumInputFrameSize ) {
      let minimumAudioDuration = this.minimumInputFrameSize / this.audioSampleRate;
      throw Error(
        "When `padding=false` in `predict` method, the model expect audio feature for a minimum frame size of " 
        + this.minimumInputFrameSize + ", ie. approx " + minimumAudioDuration + 
        "seconds at" + this.audioSampleRate + "KHz input audio sample rate."
      );
    }
  }


  protected disambiguateExtraInputs(): any[] {
    if (!this.isReady) throw Error("No loaded tfjs model found! Make sure to call `initialize` method and resolve the promise before calling `predict` method.");
    let inputsCount = this.model.executor.inputs.length;
    if (inputsCount === 1) {
      return [];
    } else if (inputsCount === 2){
      return [this.IS_TRAIN.clone()];
    } else if (inputsCount === 3){
      // Overhead from the tensorflowjs-converter, creates random tensorinput without
      // connected to other layers for some vggish models trained on audioset. 
      // The tfjs model needs this unsignificant tensor object on the prediction call.
      // This will removed in future once this has been sorted on the conversation process.
      if (!this.randomTensorInput) this.randomTensorInput = this.tf.zeros([1, this.model.executor.inputs[0].shape[1]]);
      return [this.randomTensorInput.clone(), this.IS_TRAIN.clone()];
    } else {
      throw Error("Found unsupported number of input requirements for the model. Expects the following inputs -> " + this.model.executor.inputs);
    }
  }
}


/**
 * Class with methods for computing inference of 
 * Essentia-Tensorflow.js MusiCNN-based pre-trained models.
 * The `predict` method expect an input audio feature computed
 * using `EssentiaTFInputExtractor`.
 * @class 
 * @example
 * // FEATURE EXTRACTION
 * // Create `EssentiaTFInputExtractor` instance by passing 
 * // essentia-wasm import `EssentiaWASM` global object and `extractorType=musicnn`.
 * const inputFeatureExtractor = new EssentiaTFInputExtractor(EssentiaWASM, "musicnn");
 * // Compute feature for a given audio signal
 * let inputMusiCNN = inputFeatureExtractor.computeFrameWise(audioSignal);
 * // INFERENCE
 * const modelURL = "./models/autotagging/msd/msd-musicnn-1/model.json"
 * // Where `tf` is the global import object from the `@tensorflow/tfjs*` package.
 * const musicnn = new TensorflowMusiCNN(tf, modelURL);
 * // Promise for loading the model
 * await musicnn.initialize();
 * // Compute predictions for a given input feature.
 * let predictions = await musicnn.predict(inputMusiCNN);
 * @extends {EssentiaTensorflowJSModel}
 */
class TensorflowMusiCNN extends EssentiaTensorflowJSModel {

  constructor(tfjs: any, model_url: string, verbose: boolean=false) {
    super(tfjs, model_url);
    this.minimumInputFrameSize = 3;
  }

  /**
   * Run inference on the given audio feature input and returns the activations
   * @param {InputMusiCNN} inputFeature audio feature required by the MusiCNN model.
   * @param {boolean} [zeroPadding=false] whether to do zero-padding to the input feature.
   * @returns {array} activations of the output layer of the model
   * @memberof TensorflowMusiCNN
   */
  public async predict(inputFeature: InputMusiCNN, zeroPadding: boolean=false): Promise<any[]> {

    let featureTensor = this.arrayToTensorAsBatches(
      inputFeature.melSpectrum, 
      [inputFeature.frameSize, inputFeature.melBandsSize], 
      inputFeature.patchSize,
      zeroPadding
    );
    // Get default model input variables
    let modelInputs = this.disambiguateExtraInputs();
    // add the input feature tensor to the model inputs
    modelInputs.push(featureTensor);
    // Run inference
    let results = this.model.execute(modelInputs);
    // free tensors
    featureTensor.dispose();
    // decode the output activations as array with a promise
    let resultsArray = await results.array();
    results.dispose();
    return resultsArray;
  }
}


/**
 * Class with methods for computing common feature input representations
 * required for the inference of Essentia-Tensorflow.js VGGish-based 
 * pre-trained models using Essentia WASM backend. The predict method 
 * expect an input audio feature computed using `EssentiaTFInputExtractor`.
 * @class 
 * @example
 * // FEATURE EXTRACTION
 * // Create `EssentiaTFInputExtractor` instance by passing 
 * // essentia-wasm import `EssentiaWASM` global object and `extractorType=vggish`.
 * const inputFeatureExtractor = new EssentiaTFInputExtractor(EssentiaWASM, "vggish");
 * // Compute feature for a given audio signal array
 * let inputVGGish = inputFeatureExtractor.computeFrameWise(audioSignal);
 * // INFERENCE
 * const modelURL = "./models/classifiers/danceability/danceability-vggish-audioset-1/model.json"
 * // Where `tf` is the global import object from the `@tensorflow/tfjs*` package.
 * const vggish = new TensorflowVGGish(tf, modelURL);
 * // Promise for loading the model
 * await vggish.initialize();
 * // Compute predictions for a given input feature.
 * let predictions = await vggish.predict(inputVGGish);
 * @extends {EssentiaTensorflowJSModel}
 */
class TensorflowVGGish extends EssentiaTensorflowJSModel {

  constructor(tfjs: any, model_url: string, verbose: boolean=false) {
    super(tfjs, model_url);
  }

  /**
   * Run inference on the given audio feature input and returns the activations
   * @param {InputVGGish} inputFeature audio feature required by the VGGish model.
   * @param {boolean} [zeroPadding=false] whether to do zero-padding to the input feature.
   * @returns {array} activations of the output layer of the model
   * @memberof TensorflowVGGish
   */
  public async predict(inputFeature: InputVGGish, zeroPadding: boolean=false): Promise<any[]> {
    let featureTensor = this.arrayToTensorAsBatches(
      inputFeature.melSpectrum, 
      [inputFeature.frameSize, inputFeature.melBandsSize], 
      inputFeature.patchSize,
      zeroPadding
    );
    // Get default model input variables
    let modelInputs = this.disambiguateExtraInputs();
    // add the input feature tensor to the model inputs
    modelInputs.push(featureTensor);
    // Run inference
    let results = this.model.execute(modelInputs);
    // free tensors
    featureTensor.dispose();
    // decode the output activations as array with a promise
    let resultsArray = await results.array();
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
