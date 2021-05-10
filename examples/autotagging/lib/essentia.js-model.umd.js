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
    var EssentiaTFInputExtractor = /** @class */ (function () {
        /**
        * @constructs
        * @param {EssentiaWASM} EssentiaWASM Essentia WASM emcripten global module object
        * @param {string} [extractorType='musicnn'] type of the desired extractor type (eg. 'muscinn', 'vggish' or 'tempocnn').
        * @param {boolean} [isDebug=false] whether to enable EssentiaWASM internal debugger for logs.
        */
        function EssentiaTFInputExtractor(EssentiaWASM, extractorType, isDebug) {
            if (extractorType === void 0) { extractorType = "musicnn"; }
            if (isDebug === void 0) { isDebug = false; }
            /**
            * @property {EssentiaJS} this.essentia an instance of `EssentiaWASM.EssentiaJS`.
            * @property {string} this.extractorType type of the choosen extractor (eg. 'muscinn', 'vggish' or 'tempocnn').
            */
            this.essentia = null;
            this.module = null;
            this.frameSize = 512;
            this.sampleRate = 16000;
            this.extractorType = extractorType;
            if (this.extractorType === "musicnn")
                this.frameSize = 512;
            else if (this.extractorType === "vggish")
                this.frameSize = 400;
            else if (this.extractorType === "tempocnn")
                this.frameSize = 1024;
            else
                throw Error("Invalid 'extractorType' choice! Available types are [musicnn', 'vggish', 'tempocnn']");
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
        EssentiaTFInputExtractor.prototype.arrayToVector = function (inputArray) {
            return this.module.arrayToVector(inputArray);
        };
        /**
         * Convert an input VectorFloat array into typed JS Float32Array
         * @method
         * @param {VectorFloat} inputVector input VectorFloat array
         * @returns {Float32Array} returns converted JS typed array
         * @memberof EssentiaTFInputExtractor
         */
        EssentiaTFInputExtractor.prototype.vectorToArray = function (inputVector) {
            return this.module.vectorToArray(inputVector);
        };
        /**
         * Decode and returns the audio buffer from an given audio url or blob uri using Web Audio API. (NOTE: This doesn't work on Safari browser)
         * @async
         * @method
         * @param {string} audioURL web url or blob uri of a audio file
         * @param {AudioContext} webAudioCtx an instance of Web Audio API `AudioContext`
         * @returns {Promise<AudioBuffer>} decoded audio buffer as a promise
         * @memberof EssentiaTFInputExtractor
         */
        EssentiaTFInputExtractor.prototype.getAudioBufferFromURL = function (audioURL, webAudioCtx) {
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
         * Convert an AudioBuffer object to a Mono audio signal array. The audio signal is downmixed
         * to mono using essentia `MonoMixer` algorithm if the audio buffer has 2 channels of audio.
         * Throws an expection if the input AudioBuffer object has more than 2 channels of audio.
         * @method
         * @param {AudioBuffer} buffer `AudioBuffer` object decoded from an audio file.
         * @returns {Float32Array} audio channel data. (downmixed to mono if its stereo signal).
         * @memberof EssentiaTFInputExtractor
         */
        EssentiaTFInputExtractor.prototype.audioBufferToMonoSignal = function (buffer) {
            if (buffer.numberOfChannels === 1) {
                return buffer.getChannelData(0);
            }
            if (buffer.numberOfChannels === 2) {
                var left = this.arrayToVector(buffer.getChannelData(0));
                var right = this.arrayToVector(buffer.getChannelData(1));
                var monoSignal = this.essentia.MonoMixer(left, right);
                return this.vectorToArray(monoSignal);
            }
            throw new Error('Unexpected number of channels found in audio buffer. Only accepts mono or stereo audio buffers.');
        };
        /**
         * Downsample a audio buffer to a target audio sample rate using the Web Audio API
         * NOTE: This method will only works on web-browsers which supports the Web Audio API.
         * @method
         * @param {AudioBuffer} sourceBuffer `AudioBuffer` object decoded from an audio file.
         * @returns {Float32Array} decoded audio buffer object
         * @memberof EssentiaTFInputExtractor
         */
        EssentiaTFInputExtractor.prototype.downsampleAudioBuffer = function (sourceBuffer) {
            // adapted from https://github.com/julesyoungberg/soundboy/blob/main/worker/loadSoundFile.ts#L25
            var ctx = new OfflineAudioContext(1, sourceBuffer.duration * this.sampleRate, this.sampleRate);
            // create mono input buffer
            var buffer = ctx.createBuffer(1, sourceBuffer.length, sourceBuffer.sampleRate);
            buffer.copyToChannel(this.audioBufferToMonoSignal(sourceBuffer), 0);
            // connect the buffer to the context
            var source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            // resolve when the source buffer has been rendered to a downsampled buffer
            return new Promise(function (resolve) {
                ctx.oncomplete = function (e) {
                    var rendered = e.renderedBuffer;
                    var samples = rendered.getChannelData(0);
                    resolve(samples);
                };
                ctx.startRendering();
                source.start(0);
            });
        };
        /**
         * This method compute the pre-configured features for a given audio signal frame.
         * It throws an exception if the size of audioFrame is not equal to the pre-configured
         * audioFrame size for the selected `extractorType` setting.
         * @method
         * @param {Float32Array} audioFrame a frame of audio signal as Float32 typed JS array.
         * @returns {EssentiaTFInputExtractorOutput} returns the computed feature for the input the given audio frame.
         * @memberof EssentiaTFInputExtractor
         */
        EssentiaTFInputExtractor.prototype.compute = function (audioFrame) {
            var frame;
            if (audioFrame instanceof Float32Array) {
                frame = this.arrayToVector(audioFrame);
            }
            else {
                frame = audioFrame;
            } // assume it's of type VectorFloat
            // setup feature extractor based on the given `extractorType` input.
            switch (this.extractorType) {
                case "musicnn": {
                    if (audioFrame.length != this.frameSize)
                        throw new Error("The chosen `extractorType` only works with an audio signal frame size of " + this.frameSize);
                    var spectrum = this.essentia.TensorflowInputMusiCNN(frame);
                    return {
                        melSpectrum: this.vectorToArray(spectrum.bands),
                        frameSize: 1,
                        patchSize: 187,
                        melBandsSize: 96
                    };
                }
                case "vggish": {
                    if (audioFrame.length != this.frameSize)
                        throw new Error("The chosen `extractorType` only works with an audio signal frame size of 400 " + this.frameSize);
                    var spectrum = this.essentia.TensorflowInputVGGish(frame);
                    return {
                        melSpectrum: this.vectorToArray(spectrum.bands),
                        frameSize: 1,
                        patchSize: 96,
                        melBandsSize: 64
                    };
                }
                case "tempocnn": {
                    if (audioFrame.length != this.frameSize)
                        throw Error("The chosen `extractorType` only works with an audio signal frame size of " + this.frameSize);
                    var spectrum = this.essentia.TensorflowInputTempoCNN(frame);
                    return {
                        melSpectrum: this.vectorToArray(spectrum.bands),
                        frameSize: 1,
                        patchSize: 256,
                        melBandsSize: 40
                    };
                }
                default: {
                    throw Error("Invalid 'extractorType' choice! Available types are [musicnn', 'vggish', 'tempocnn']");
                }
            }
        };
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
        EssentiaTFInputExtractor.prototype.computeFrameWise = function (audioSignal, hopSize) {
            var _hopSize;
            if (hopSize)
                _hopSize = hopSize;
            else
                _hopSize = this.frameSize;
            // compute overlapping frames given frameSize, hopSize
            var frames = this.essentia.FrameGenerator(audioSignal, this.frameSize, _hopSize);
            var melSpectrogram = [];
            var framewiseFeature = null;
            for (var i = 0; i < frames.size(); i++) {
                framewiseFeature = this.compute(this.vectorToArray(frames.get(i)));
                melSpectrogram.push(framewiseFeature.melSpectrum);
            }
            framewiseFeature.melSpectrum = melSpectrogram;
            framewiseFeature.frameSize = frames.size();
            frames.delete();
            return framewiseFeature;
        };
        /**
         * Delete essentia session and frees the memory.
         * @method
         * @returns {null}
         * @memberof EssentiaTFInputExtractor
         */
        EssentiaTFInputExtractor.prototype.delete = function () {
            this.essentia.delete();
        };
        /**
         * This method shutdown all the instance of Essentia WASM and frees the memory.
         * NOTE: If you want to just free the memory of the pre-configured extractor,
         * use `this.extractor.delete()` instead.
         * @method
         * @returns {null}
         * @memberof EssentiaTFInputExtractor
         */
        EssentiaTFInputExtractor.prototype.shutdown = function () {
            this.essentia.shutdown();
        };
        return EssentiaTFInputExtractor;
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
            this.audioSampleRate = 16000;
            this.tf = null;
            this.isReady = false;
            this.modelPath = "";
            this.IS_TRAIN = null;
            this.randomTensorInput = null;
            this.minimumInputFrameSize = null;
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
        EssentiaTensorflowJSModel.prototype.arrayToTensorAsBatches = function (inputfeatureArray, inputShape, patchSize, zeroPadding) {
            if (zeroPadding === void 0) { zeroPadding = false; }
            // convert a flattened 1D typed array into 2D tensor with given shape 
            var featureTensor = this.tf.tensor(inputfeatureArray, inputShape, 'float32');
            // create a tensor of zeros for zero-padding the output tensor if necessary
            var zeroPadTensor;
            // variable to store the dynamic batch size computed from given input array and patchSize
            var batchSize;
            if (!zeroPadding) {
                this.assertMinimumFeatureInputSize({
                    melSpectrum: inputfeatureArray,
                    frameSize: inputShape[0],
                    melBandsSize: inputShape[1],
                    patchSize: patchSize
                });
                return featureTensor.as3D(1, patchSize, inputShape[1]);
                // return the feature with batch size 1 if number of frames = patchSize
            }
            else if (inputShape[0] === patchSize) {
                return featureTensor.as3D(1, patchSize, inputShape[1]);
                // Otherwise do zeropadding 
            }
            else if (inputShape[0] > patchSize) {
                if ((inputShape[0] % patchSize) != 0) {
                    batchSize = Math.floor(inputShape[0] / patchSize) + 1;
                    zeroPadTensor = this.tf.zeros([
                        Math.floor(batchSize * patchSize - inputfeatureArray.length),
                        inputShape[1]
                    ], 'float32');
                    featureTensor = featureTensor.concat(zeroPadTensor);
                    zeroPadTensor.dispose();
                    return featureTensor.as3D(batchSize, patchSize, inputShape[1]);
                }
                else {
                    batchSize = Math.floor(inputShape[0] / patchSize);
                    zeroPadTensor = this.tf.zeros([
                        Math.floor(batchSize * patchSize - inputfeatureArray.length),
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
        EssentiaTensorflowJSModel.prototype.assertMinimumFeatureInputSize = function (inputFeature) {
            this.minimumInputFrameSize = inputFeature.patchSize; // at least 1 full patch
            if (inputFeature.melSpectrum.length != this.minimumInputFrameSize) {
                // let minimumAudioDuration = this.minimumInputFrameSize / this.audioSampleRate; // <-- cannot provide accurate duration without model input hopSize
                throw Error("When `padding=false` in `predict` method, the model expect audio feature for a minimum frame size of "
                    + this.minimumInputFrameSize + ". Was given " + inputFeature.melSpectrum.length + " melband frames");
            }
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
    var TensorflowMusiCNN = /** @class */ (function (_super) {
        __extends(TensorflowMusiCNN, _super);
        function TensorflowMusiCNN(tfjs, model_url, verbose) {
            var _this = _super.call(this, tfjs, model_url) || this;
            _this.minimumInputFrameSize = 3;
            return _this;
        }
        /**
         * Run inference on the given audio feature input and returns the activations
         * @param {InputMusiCNN} inputFeature audio feature required by the MusiCNN model.
         * @param {boolean} [zeroPadding=false] whether to do zero-padding to the input feature.
         * @returns {array} activations of the output layer of the model
         * @memberof TensorflowMusiCNN
         */
        TensorflowMusiCNN.prototype.predict = function (inputFeature, zeroPadding) {
            if (zeroPadding === void 0) { zeroPadding = false; }
            return __awaiter(this, void 0, void 0, function () {
                var featureTensor, modelInputs, results, resultsArray;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            featureTensor = this.arrayToTensorAsBatches(inputFeature.melSpectrum, [inputFeature.frameSize, inputFeature.melBandsSize], inputFeature.patchSize, zeroPadding);
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
    var TensorflowVGGish = /** @class */ (function (_super) {
        __extends(TensorflowVGGish, _super);
        function TensorflowVGGish(tfjs, model_url, verbose) {
            return _super.call(this, tfjs, model_url) || this;
        }
        /**
         * Run inference on the given audio feature input and returns the activations
         * @param {InputVGGish} inputFeature audio feature required by the VGGish model.
         * @param {boolean} [zeroPadding=false] whether to do zero-padding to the input feature.
         * @returns {array} activations of the output layer of the model
         * @memberof TensorflowVGGish
         */
        TensorflowVGGish.prototype.predict = function (inputFeature, zeroPadding) {
            if (zeroPadding === void 0) { zeroPadding = false; }
            return __awaiter(this, void 0, void 0, function () {
                var featureTensor, modelInputs, results, resultsArray;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            featureTensor = this.arrayToTensorAsBatches(inputFeature.melSpectrum, [inputFeature.frameSize, inputFeature.melBandsSize], inputFeature.patchSize, zeroPadding);
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

    exports.EssentiaTFInputExtractor = EssentiaTFInputExtractor;
    exports.EssentiaTensorflowJSModel = EssentiaTensorflowJSModel;
    exports.TensorflowMusiCNN = TensorflowMusiCNN;
    exports.TensorflowVGGish = TensorflowVGGish;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
