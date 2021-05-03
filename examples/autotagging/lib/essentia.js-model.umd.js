(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.EssentiaModel = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

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
     * Class with methods for computing common feature input representations required
     * for the inference of Essentia-Tensorflow.js pre-trained models using EssentiaWASM
     * backend which is imported from `essentia-wasm*.js` builds.
     * @class
     * @example
     * // Create `EssentiaTensorflowInputExtractor` instance by passing EssentiaWASM import object and `extractorType` value.
     * const extractor = new EssentiaTensorflowInputExtractor(EssentiaWASM, "musicnn");
     * // Compute feature for a given frame of audio signal
     * let featureMusiCNN = await extractor.compute(audioSignalFrame);
     * // Change the feature extractor with a new setting for VGGish input
     * extractor.extractorType = "vggish";
     * let featureVGGish = await extractor.compute(audioSignalFrame);
     * // Delete and shutdown the extractor instance if you don't need it anymore.
     * extractor.delete();
     * extractor.shutdown();
     */
    var EssentiaTensorflowInputExtractor = /** @class */ (function () {
        /**
        * @constructs
        * @param {EssentiaWASM} EssentiaWASM Essentia WASM emcripten global module object
        * @param {string} [extractorType='musicnn']
        */
        function EssentiaTensorflowInputExtractor(EssentiaWASM, extractorType, isDebug) {
            if (extractorType === void 0) { extractorType = "musicnn"; }
            if (isDebug === void 0) { isDebug = false; }
            /**
            * @property {EssentiaJS} this.essentia an instance of `EssentiaWASM.EssentiaJS`.
            * @property {string} this.extractorType List of available Essentia alogrithms from the WASM backend
            */
            this.essentia = null;
            this.module = null;
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
        EssentiaTensorflowInputExtractor.prototype.arrayToVector = function (inputArray) {
            return this.module.arrayToVector(inputArray);
        };
        /**
         * Convert an input VectorFloat array into typed JS Float32Array
         * @method
         * @param {VectorFloat} inputVector input VectorFloat array
         * @returns {Float32Array} returns converted JS typed array
         * @memberof EssentiaTensorflowInputExtractor
         */
        EssentiaTensorflowInputExtractor.prototype.vectorToArray = function (inputVector) {
            return this.module.vectorToArray(inputVector);
        };
        /**
         * Decode and returns the audio buffer from an given audio url or blob uri using Web Audio API. (NOTE: This doesn't work on Safari browser)
         * @async
         * @method
         * @param {string} audioURL web url or blob uri of a audio file
         * @param {AudioContext} webAudioCtx an instance of Web Audio API `AudioContext`
         * @returns {Promise<AudioBuffer>} decoded audio buffer as a promise
         * @memberof EssentiaTensorflowInputExtractor
         */
        EssentiaTensorflowInputExtractor.prototype.getAudioBufferFromURL = function (audioURL, webAudioCtx) {
            return __awaiter(this, void 0, void 0, function () {
                var response, arrayBuffer, audioBuffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch(audioURL)];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.arrayBuffer()];
                        case 2:
                            arrayBuffer = _a.sent();
                            return [4 /*yield*/, webAudioCtx.decodeAudioData(arrayBuffer)];
                        case 3:
                            audioBuffer = _a.sent();
                            return [2 /*return*/, audioBuffer];
                    }
                });
            });
        };
        /**
         * Generates overlapping frames (chunks) of array with given frame size and hop size from an input array.
         * @method
         * @param {string} inputArray web url or blob uri of a audio file
         * @param {number} frameSize frame size for generating frames (chunks) of input array
         * @param {number} hopSize hop size required for overlap while generating the frames.
         * @returns {Array<Float32Array>} generated frames as array of array of Float32 type.
         * @memberof EssentiaTensorflowInputExtractor
         */
        EssentiaTensorflowInputExtractor.prototype.arrayFrameGenerator = function (inputArray, frameSize, hopSize) {
            if (frameSize > inputArray.length)
                throw Error("`frameSize` shouldn't be greater than the length of input array!");
            if (hopSize > frameSize)
                throw Error("`hopSize` shouldn't be greater than `frameSize`!");
            var frames = [];
            for (var i = 0; i < inputArray.length - (frameSize - 1); i + hopSize) {
                frames.push(inputArray.slice(i, i + frameSize));
            }
            return frames;
        };
        /**
         * This method compute the pre-configured features for a given audio signal frame.
         * It throws an exception if the size of audioFrame is not equal to the pre-configured
         * audioFrame size for the selected `extractorType` setting.
         * @method
         * @param {Float32Array} audioFrame a frame of audio signal as Float32 typed JS array.
         * @returns {EssentiaTensorflowInputExtractorOutput} returns the computed feature for the input the given audio frame.
         * @memberof EssentiaTensorflowInputExtractor
         */
        EssentiaTensorflowInputExtractor.prototype.compute = function (audioFrame) {
            // setup feature extractor based on the given `extractorType` input.
            switch (this.extractorType) {
                case "musicnn": {
                    if (audioFrame.length != 512)
                        throw new Error("The chosen `extractorType` only works with an audio signal frame of 512 samples.");
                    var spectrum = this.essentia.TensorflowInputMusiCNN(this.arrayToVector(audioFrame));
                    return {
                        melSpectrum: this.vectorToArray(spectrum.bands),
                        batchSize: 1,
                        patchSize: 187,
                        melBandsSize: 96
                    };
                }
                case "vggish": {
                    if (audioFrame.length != 400)
                        throw new Error("The chosen `extractorType` only works with an audio signal frame of 400 samples.");
                    var spectrum = this.essentia.TensorflowInputVGGish(this.arrayToVector(audioFrame));
                    return {
                        melSpectrum: this.vectorToArray(spectrum.bands),
                        batchSize: 1,
                        patchSize: 96,
                        melBandsSize: 64
                    };
                }
                // case "tempocnn": { 
                //   if (audioFrame.length != 1024) throw "The chosen `extractorType` only works with an audio signal frame of 1024 samples.";
                //   let spectrum = this.essentia.TensorflowInputTempoCNN(audioFrame);
                //   return {
                //     melSpectrum: this.vectorToArray(spectrum.bands),
                //     batchSize: 1,
                //     patchSize: 256,
                //     melBandsSize: 40
                //   };    
                // } 
                default: {
                    throw "Invalid 'extractorType' choice! Available types are [musicnn', 'vggish', 'tempocnn']";
                }
            }
        };
        /**
         * Delete essentia session and frees the memory.
         * @method
         * @returns {null}
         * @memberof EssentiaTensorflowInputExtractor
         */
        EssentiaTensorflowInputExtractor.prototype.delete = function () {
            this.essentia.delete();
        };
        /**
         * This method shutdown all the instance of Essentia WASM and frees the memory.
         * NOTE: If you want to just free the memory of the pre-configured extractor,
         * use `this.extractor.delete()` instead.
         * @method
         * @returns {null}
         * @memberof EssentiaTensorflowInputExtractor
         */
        EssentiaTensorflowInputExtractor.prototype.shutdown = function () {
            this.essentia.shutdown();
        };
        return EssentiaTensorflowInputExtractor;
    }());

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
     * Base class for loading a pre-trained Essentia-Tensorflow.js model for inference
     * using TensorFlow.js.
     * @class
     */
    var EssentiaTensorflowJSModel = /** @class */ (function () {
        function EssentiaTensorflowJSModel(tfjs, modelPath, verbose) {
            this.model = null;
            this.tf = null;
            this.isReady = false;
            this.modelPath = "";
            this.IS_TRAIN = null;
            this.randomTensorInput = null;
            this.tf = tfjs;
            this.IS_TRAIN = this.tf.tensor([0], [1], 'bool');
            this.modelPath = modelPath;
            this.isReady = !!this.model;
        }
        EssentiaTensorflowJSModel.prototype.initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this;
                            return [4 /*yield*/, this.tf.loadGraphModel(this.modelPath)];
                        case 1:
                            _a.model = _b.sent();
                            this.isReady = true;
                            return [2 /*return*/];
                    }
                });
            });
        };
        EssentiaTensorflowJSModel.prototype.arrayToTensorAsBatches = function (inputfeatureArray, inputShape, patchSize) {
            // convert a flattened 1D typed array into 2D tensor with given shape 
            var featureTensor = this.tf.tensor(inputfeatureArray, inputShape, 'float32');
            // create a tensor of zeros for zero-padding the output tensor if necessary
            var zeroPadTensor;
            // variable to store the dynamic batch size computed from given input array and patchSize
            var batchSize;
            // return the feature with batch size 1 if number of frames = patchSize
            if (inputShape[0] === patchSize) {
                return featureTensor.as3D(1, patchSize, inputShape[1]);
                // Otherwise do zeropadding 
            }
            else if (inputShape[0] >= patchSize) {
                if ((inputShape[0] % patchSize) != 0) {
                    batchSize = Math.floor(inputShape[0] / patchSize) + 1;
                    zeroPadTensor = this.tf.zeros([
                        Math.floor(((batchSize * patchSize * inputShape[1]) - inputfeatureArray.length) / inputShape[1]),
                        inputShape[1]
                    ], 'float32');
                    featureTensor = featureTensor.concat(zeroPadTensor);
                    zeroPadTensor.dispose();
                    return featureTensor.as3D(batchSize, patchSize, inputShape[1]);
                }
                else {
                    batchSize = Math.floor(inputShape[0] / patchSize);
                    zeroPadTensor = this.tf.zeros([
                        Math.floor(((batchSize * patchSize * inputShape[1]) - inputfeatureArray.length) / inputShape[1]),
                        inputShape[1]
                    ], 'float32');
                    featureTensor = featureTensor.concat(zeroPadTensor);
                    zeroPadTensor.dispose();
                    return featureTensor.as3D(batchSize, patchSize, inputShape[1]);
                }
            }
            else {
                // fixed batchSize=1 if the input array has lengh less than the given patchSize.
                batchSize = 1;
                zeroPadTensor = this.tf.zeros([patchSize - inputShape[0], inputShape[1]]);
                featureTensor = featureTensor.concat(zeroPadTensor);
                zeroPadTensor.dispose();
                return featureTensor.as3D(batchSize, patchSize, inputShape[1]);
            }
        };
        EssentiaTensorflowJSModel.prototype.dispose = function () {
            this.model.dispose();
        };
        EssentiaTensorflowJSModel.prototype.disambiguateExtraInputs = function () {
            if (!this.isReady)
                throw Error("No loaded tfjs model found! Make sure to call `initialize` method and resolve the promise before calling `predict` method.");
            var inputsCount = this.model.executor.inputs.length;
            if (inputsCount === 1) {
                return [];
            }
            else if (inputsCount === 2) {
                return [this.IS_TRAIN.clone()];
            }
            else if (inputsCount === 3) {
                // Overhead from the tensorflowjs-converter, creates random tensorinput without
                // connected to other layers for some vggish models trained on audioset. 
                // The tfjs model needs this unsignificant tensor object on the prediction call.
                // This will removed in future once this has been sorted on the conversation process.
                if (!this.randomTensorInput)
                    this.randomTensorInput = this.tf.zeros([1, this.model.executor.inputs[0].shape[1]]);
                return [this.randomTensorInput.clone(), this.IS_TRAIN.clone()];
            }
            else {
                throw Error("Found unsupported number of input requirements for the model. Expects the following inputs -> " + this.model.executor.inputs);
            }
        };
        return EssentiaTensorflowJSModel;
    }());
    /**
     * Class with methods for computing inference of
     * Essentia-Tensorflow.js MusiCNN-based pre-trained models.
     * The predict method expect an input audio feature computed
     * using `EssentiaTensorflowInputExtractor`.
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
     * await musicnn.initialize();
     * // Compute predictions for a given frame of input feature.
     * let predictions = await musicnn.predict(inputMusiCNN);
     */
    var TensorflowMusiCNN = /** @class */ (function (_super) {
        __extends(TensorflowMusiCNN, _super);
        function TensorflowMusiCNN(tfjs, model_url, verbose) {
            return _super.call(this, tfjs, model_url) || this;
        }
        TensorflowMusiCNN.prototype.predict = function (inputFeature) {
            return __awaiter(this, void 0, void 0, function () {
                var featureTensor, modelInputs, results, resultsArray;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            featureTensor = this.arrayToTensorAsBatches(inputFeature.melSpectrum, [inputFeature.batchSize, inputFeature.melBandsSize], inputFeature.patchSize);
                            modelInputs = this.disambiguateExtraInputs();
                            // add the input feature tensor to the model inputs
                            modelInputs.push(featureTensor);
                            results = this.model.execute(modelInputs);
                            // free tensors
                            featureTensor.dispose();
                            return [4 /*yield*/, results.array()];
                        case 1:
                            resultsArray = _a.sent();
                            results.dispose();
                            return [2 /*return*/, resultsArray];
                    }
                });
            });
        };
        return TensorflowMusiCNN;
    }(EssentiaTensorflowJSModel));
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
     * await vggish.initialize();
     * // Compute predictions for a given frame of input feature.
     * let predictions = await vggish.predict(inputVGGish);
     */
    var TensorflowVGGish = /** @class */ (function (_super) {
        __extends(TensorflowVGGish, _super);
        function TensorflowVGGish(tfjs, model_url, verbose) {
            return _super.call(this, tfjs, model_url) || this;
        }
        TensorflowVGGish.prototype.predict = function (inputFeature) {
            return __awaiter(this, void 0, void 0, function () {
                var featureTensor, modelInputs, results, resultsArray;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            featureTensor = this.arrayToTensorAsBatches(inputFeature.melSpectrum, [inputFeature.batchSize, inputFeature.melBandsSize], inputFeature.patchSize);
                            modelInputs = this.disambiguateExtraInputs();
                            // add the input feature tensor to the model inputs
                            modelInputs.push(featureTensor);
                            results = this.model.execute(modelInputs);
                            // free tensors
                            featureTensor.dispose();
                            return [4 /*yield*/, results.array()];
                        case 1:
                            resultsArray = _a.sent();
                            results.dispose();
                            return [2 /*return*/, resultsArray];
                    }
                });
            });
        };
        return TensorflowVGGish;
    }(EssentiaTensorflowJSModel));

    exports.EssentiaTensorflowInputExtractor = EssentiaTensorflowInputExtractor;
    exports.EssentiaTensorflowJSModel = EssentiaTensorflowJSModel;
    exports.TensorflowMusiCNN = TensorflowMusiCNN;
    exports.TensorflowVGGish = TensorflowVGGish;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
