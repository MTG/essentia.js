/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tensorflow/tfjs-core'), require('path'), require('fs'), require('worker_threads'), require('perf_hooks'), require('os')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tensorflow/tfjs-core', 'path', 'fs', 'worker_threads', 'perf_hooks', 'os'], factory) :
  (global = global || self, factory((global.tf = global.tf || {}, global.tf.wasm = global.tf.wasm || {}), global.tf, global.path, global.fs, global.worker_threads, global.perf_hooks, global.os));
}(this, (function (exports, tfjsCore, path, fs, worker_threads, perf_hooks, os) { 'use strict';

  path = path && Object.prototype.hasOwnProperty.call(path, 'default') ? path['default'] : path;
  fs = fs && Object.prototype.hasOwnProperty.call(fs, 'default') ? fs['default'] : fs;
  worker_threads = worker_threads && Object.prototype.hasOwnProperty.call(worker_threads, 'default') ? worker_threads['default'] : worker_threads;
  perf_hooks = perf_hooks && Object.prototype.hasOwnProperty.call(perf_hooks, 'default') ? perf_hooks['default'] : perf_hooks;
  os = os && Object.prototype.hasOwnProperty.call(os, 'default') ? os['default'] : os;

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  // This enum must align with the enum defined in cc/backend.h.
  var CppDType;
  (function (CppDType) {
      CppDType[CppDType["float32"] = 0] = "float32";
      CppDType[CppDType["int32"] = 1] = "int32";
      CppDType[CppDType["bool"] = 2] = "bool";
      CppDType[CppDType["string"] = 3] = "string";
      CppDType[CppDType["complex64"] = 4] = "complex64";
  })(CppDType || (CppDType = {}));
  // Must match enum in cc/fusable_activations.h.
  var FusableActivation;
  (function (FusableActivation) {
      FusableActivation[FusableActivation["linear"] = 0] = "linear";
      FusableActivation[FusableActivation["relu"] = 1] = "relu";
      FusableActivation[FusableActivation["relu6"] = 2] = "relu6";
      FusableActivation[FusableActivation["prelu"] = 3] = "prelu";
      FusableActivation[FusableActivation["leakyrelu"] = 4] = "leakyrelu";
      FusableActivation[FusableActivation["sigmoid"] = 5] = "sigmoid";
  })(FusableActivation || (FusableActivation = {}));

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmFusedMatMul;
  function setup(backend) {
      wasmFusedMatMul = backend.wasm.cwrap(tfjsCore._FusedMatMul, null /* void */, [
          'number',
          'array',
          'number',
          'number',
          'array',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number' // out_id
      ]);
  }
  function fusedBatchMatMul(args) {
      var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
      var a = inputs.a, b = inputs.b, bias = inputs.bias, preluActivationWeights = inputs.preluActivationWeights;
      if (a.dtype !== 'float32' || b.dtype !== 'float32') {
          throw new Error("_FusedMatMul for non non-float32 tensors not yet supported.");
      }
      var transposeA = attrs.transposeA, transposeB = attrs.transposeB, activation = attrs.activation, leakyreluAlpha = attrs.leakyreluAlpha;
      var aId = backend.dataIdMap.get(a.dataId).id;
      var bId = backend.dataIdMap.get(b.dataId).id;
      var biasId = 0;
      if (bias != null) {
          var biasData = backend.dataIdMap.get(bias.dataId);
          if (biasData.shape.length !== 1) {
              throw new Error("_FusedMatMul only supports rank-1 bias but got " +
                  ("rank " + biasData.shape.length + "."));
          }
          biasId = biasData.id;
      }
      var preluActivationWeightsId = preluActivationWeights == null ?
          0 :
          backend.dataIdMap.get(preluActivationWeights.dataId).id;
      var fusedActivation = FusableActivation[activation];
      if (fusedActivation == null) {
          throw new Error(activation + " activation not yet supported for FusedConv2D " +
              "in the wasm backend.");
      }
      var leftDim = transposeA ? a.shape[2] : a.shape[1];
      var rightDim = transposeB ? b.shape[1] : b.shape[2];
      var batchDim = a.shape[0];
      var out = backend.makeOutput([batchDim, leftDim, rightDim], a.dtype);
      var outId = backend.dataIdMap.get(out.dataId).id;
      var aShapeBytes = new Uint8Array(new Int32Array(a.shape).buffer);
      var bShapeBytes = new Uint8Array(new Int32Array(b.shape).buffer);
      wasmFusedMatMul(aId, aShapeBytes, a.shape.length, bId, bShapeBytes, b.shape.length, transposeA, transposeB, fusedActivation, biasId, preluActivationWeightsId, leakyreluAlpha || 0, outId);
      return out;
  }
  var fusedMatMulConfig = {
      kernelName: tfjsCore._FusedMatMul,
      backendName: 'wasm',
      setupFunc: setup,
      kernelFunc: fusedBatchMatMul
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function createUnaryKernelConfig(kernelName) {
      var wasmFunc;
      function setupFunc(backend) {
          wasmFunc =
              backend.wasm.cwrap(kernelName, null /* void */, ['number', 'number']);
      }
      function kernelFunc(args) {
          var backend = args.backend, x = args.inputs.x;
          var xId = backend.dataIdMap.get(x.dataId).id;
          var out = backend.makeOutput(x.shape, x.dtype);
          var outId = backend.dataIdMap.get(out.dataId).id;
          // Short-circuit zero-sized tensors.
          if (tfjsCore.util.sizeFromShape(out.shape) === 0) {
              return out;
          }
          wasmFunc(xId, outId);
          return out;
      }
      return { kernelName: kernelName, backendName: 'wasm', setupFunc: setupFunc, kernelFunc: kernelFunc };
  }

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var absConfig = createUnaryKernelConfig(tfjsCore.Abs);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function createBinaryKernelConfig(kernelName, supportsFullBroadcast, dtype) {
      var wasmFunc;
      function setupFunc(backend) {
          wasmFunc = backend.wasm.cwrap(kernelName, null /* void */, [
              'number',
              'array',
              'number',
              'number',
              'array',
              'number',
              'number',
              'number' // out_id
          ]);
      }
      function kernelFunc(args) {
          var backend = args.backend, inputs = args.inputs;
          var a = inputs.a, b = inputs.b;
          var aId = backend.dataIdMap.get(a.dataId).id;
          var bId = backend.dataIdMap.get(b.dataId).id;
          var outputType = dtype != null ? dtype : a.dtype;
          var newShape = tfjsCore.backend_util.assertAndGetBroadcastShape(a.shape, b.shape);
          var out = backend.makeOutput(newShape, outputType);
          // Short-circuit zero-sized tensors.
          if (tfjsCore.util.sizeFromShape(newShape) === 0) {
              return out;
          }
          var aShapeBytes = new Uint8Array(new Int32Array(a.shape).buffer);
          var bShapeBytes = new Uint8Array(new Int32Array(b.shape).buffer);
          var outId = backend.dataIdMap.get(out.dataId).id;
          var kernelFunc = function () { return wasmFunc(aId, aShapeBytes, a.shape.length, bId, bShapeBytes, b.shape.length, CppDType[a.dtype], outId); };
          // Currently only some float operations support full broadcast.
          if (supportsFullBroadcast && a.dtype === 'float32') {
              kernelFunc();
              return out;
          }
          var aBroadcastDims = tfjsCore.backend_util.getBroadcastDims(a.shape, newShape);
          var bBroadcastDims = tfjsCore.backend_util.getBroadcastDims(b.shape, newShape);
          var loopsOverAllOfA = aBroadcastDims.every(function (v, i) { return v === i; });
          var loopsOverAllOfB = bBroadcastDims.every(function (v, i) { return v === i; });
          if (loopsOverAllOfA && loopsOverAllOfB) {
              kernelFunc();
              return out;
          }
          else {
              throw new Error("Broadcasting along outer dims is not yet " +
                  ("supported for " + a.dtype + " " + kernelName + "."));
          }
      }
      return { kernelName: kernelName, backendName: 'wasm', setupFunc: setupFunc, kernelFunc: kernelFunc };
  }

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast = true;
  var addConfig = createBinaryKernelConfig(tfjsCore.Add, supportsFullBroadcast);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmFunc;
  function setupFunc(backend) {
      wasmFunc = backend.wasm.cwrap(tfjsCore.AddN, null /* void */, [
          'array',
          'number',
          'number',
          'number',
      ]);
  }
  function addn(args) {
      var inputs = args.inputs, backend = args.backend;
      var out = backend.makeOutput(inputs[0].shape, inputs[0].dtype);
      // Short-circuit zero-sized tensors.
      if (tfjsCore.util.sizeFromShape(out.shape) === 0) {
          return out;
      }
      var inputIds = inputs.map(function (x) { return backend.dataIdMap.get(x.dataId).id; });
      var inputIdsBytes = new Uint8Array(new Int32Array(inputIds).buffer);
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmFunc(inputIdsBytes, inputIds.length, CppDType[out.dtype], outId);
      return out;
  }
  var addNConfig = {
      kernelName: tfjsCore.AddN,
      backendName: 'wasm',
      setupFunc: setupFunc,
      kernelFunc: addn,
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function identity(args) {
      var x = args.inputs.x, backend = args.backend;
      var out = backend.makeOutput(x.shape, x.dtype);
      var inVals = backend.typedArrayFromHeap(x);
      var outVals = backend.typedArrayFromHeap(out);
      outVals.set(inVals);
      return out;
  }
  var identityConfig = {
      kernelName: tfjsCore.Identity,
      backendName: 'wasm',
      kernelFunc: identity,
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmTranspose;
  function setup$1(backend) {
      wasmTranspose = backend.wasm.cwrap(tfjsCore.Transpose, null /* void */, [
          'number',
          'array',
          'number',
          'number',
          'number',
          'array',
          'number',
      ]);
  }
  function transpose(args) {
      var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
      // Reduce any dimensions with size one. Lower-rank transpose kernel performs
      // better due to simpler memory access pattern.
      var _a = removeOneSizeDims(inputs.x.shape, attrs.perm), reducedShape = _a[0], perm = _a[1];
      var permIsNoOp = true;
      for (var i = 0; i < perm.length; i++) {
          if (perm[i] !== i) {
              permIsNoOp = false;
          }
      }
      var outShape = computeOutShape(inputs.x.shape, attrs.perm);
      var x = {
          dataId: inputs.x.dataId,
          shape: reducedShape,
          dtype: inputs.x.dtype
      };
      if (permIsNoOp) {
          var cloned = identity({ inputs: inputs, backend: backend });
          cloned.shape = outShape;
          return cloned;
      }
      var out = backend.makeOutput(outShape, x.dtype);
      var xId = backend.dataIdMap.get(x.dataId).id;
      var outId = backend.dataIdMap.get(out.dataId).id;
      var permBytes = new Uint8Array(new Int32Array(perm).buffer);
      var xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
      wasmTranspose(xId, xShapeBytes, x.shape.length, CppDType[x.dtype], outId, permBytes, perm.length);
      return out;
  }
  function computeOutShape(inShape, perm) {
      var outShape = new Array(inShape.length);
      for (var i = 0; i < outShape.length; i++) {
          outShape[i] = inShape[perm[i]];
      }
      return outShape;
  }
  function removeOneSizeDims(shape, perm) {
      var newShape = [];
      var newPerm = [];
      for (var i = 0; i < shape.length; ++i) {
          if (shape[i] !== 1) {
              newShape.push(shape[i]);
          }
          if (shape[perm[i]] !== 1) {
              newPerm.push(perm[i]);
          }
      }
      for (var i = 0; i < newPerm.length; ++i) {
          var minValIdx = -1;
          for (var j = 0; j < newPerm.length; ++j) {
              if (newPerm[j] >= i &&
                  (minValIdx === -1 || newPerm[minValIdx] > newPerm[j])) {
                  minValIdx = j;
              }
          }
          newPerm[minValIdx] = i;
      }
      return [newShape, newPerm];
  }
  var transposeConfig = {
      kernelName: tfjsCore.Transpose,
      backendName: 'wasm',
      kernelFunc: transpose,
      setupFunc: setup$1,
  };

  /**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  /**
   * Compute permutation axes and do a transpose if necessary.
   *
   * Used by reduction ops.
   * @param x input TensorInfo
   * @param axis reduction axes
   * @param backend wasm backend instance
   */
  function permuteAxesAndTranspose(x, axis, backend) {
      var xShape = x.shape;
      var xRank = x.shape.length;
      var originalAxes = tfjsCore.util.parseAxisParam(axis, xShape);
      var axes = originalAxes;
      var permutedAxes = tfjsCore.backend_util.getAxesPermutation(axes, xRank);
      var xTransposed = null;
      var inputWasTransposed = false;
      if (permutedAxes != null) {
          var newShape = new Array(xRank);
          for (var i = 0; i < newShape.length; i++) {
              newShape[i] = xShape[permutedAxes[i]];
          }
          axes = tfjsCore.backend_util.getInnerMostAxes(axes.length, xRank);
          xTransposed =
              transpose({ inputs: { x: x }, attrs: { perm: permutedAxes }, backend: backend });
          var xId = backend.dataIdMap.get(x.dataId).id;
          var transposedId = backend.dataIdMap.get(xTransposed.dataId).id;
          if (transposedId !== xId) {
              inputWasTransposed = true;
          }
      }
      return { transposed: xTransposed, originalAxes: originalAxes, axes: axes, inputWasTransposed: inputWasTransposed };
  }

  /**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmAll;
  function setup$2(backend) {
      wasmAll = backend.wasm.cwrap(tfjsCore.All, null /*void*/, ['number, number, number']);
  }
  function all(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var axis = attrs.axis, keepDims = attrs.keepDims;
      var x = inputs.x;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var inputId = xId;
      var input = x;
      var _a = permuteAxesAndTranspose(x, axis, backend), transposed = _a.transposed, axes = _a.axes, originalAxes = _a.originalAxes, inputWasTransposed = _a.inputWasTransposed;
      if (inputWasTransposed) {
          var transposedId = backend.dataIdMap.get(transposed.dataId).id;
          input = transposed;
          inputId = transposedId;
      }
      var inputRank = input.shape.length;
      tfjsCore.backend_util.assertAxesAreInnerMostDims('all', axes, inputRank);
      var _b = tfjsCore.backend_util.computeOutAndReduceShapes(input.shape, axes), outShape = _b[0], reduceShape = _b[1];
      var reduceSize = tfjsCore.util.sizeFromShape(reduceShape);
      var out = backend.makeOutput(outShape, x.dtype);
      if (tfjsCore.util.sizeFromShape(input.shape) !== 0) {
          var outId = backend.dataIdMap.get(out.dataId).id;
          wasmAll(inputId, reduceSize, outId);
      }
      if (inputWasTransposed) {
          // dispose of the transposed tensor.
          backend.disposeData(transposed.dataId);
      }
      if (keepDims) {
          // reshape
          var newShape = tfjsCore.backend_util.expandShapeToKeepDim(out.shape, originalAxes);
          out.shape = newShape;
      }
      return out;
  }
  var allConfig = {
      kernelName: tfjsCore.All,
      backendName: 'wasm',
      setupFunc: setup$2,
      kernelFunc: all
  };

  /**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmAny;
  function setup$3(backend) {
      wasmAny = backend.wasm.cwrap(tfjsCore.Any, null /*void*/, ['number, number, number']);
  }
  function any(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var axis = attrs.axis, keepDims = attrs.keepDims;
      var x = inputs.x;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var inputId = xId;
      var input = x;
      var _a = permuteAxesAndTranspose(x, axis, backend), transposed = _a.transposed, axes = _a.axes, originalAxes = _a.originalAxes, inputWasTransposed = _a.inputWasTransposed;
      if (inputWasTransposed) {
          var transposedId = backend.dataIdMap.get(transposed.dataId).id;
          input = transposed;
          inputId = transposedId;
      }
      var inputRank = input.shape.length;
      tfjsCore.backend_util.assertAxesAreInnerMostDims('any', axes, inputRank);
      var _b = tfjsCore.backend_util.computeOutAndReduceShapes(input.shape, axes), outShape = _b[0], reduceShape = _b[1];
      var reduceSize = tfjsCore.util.sizeFromShape(reduceShape);
      var out = backend.makeOutput(outShape, x.dtype);
      if (tfjsCore.util.sizeFromShape(input.shape) !== 0) {
          var outId = backend.dataIdMap.get(out.dataId).id;
          wasmAny(inputId, reduceSize, outId);
      }
      if (inputWasTransposed) {
          // dispose of the transposed tensor.
          backend.disposeData(transposed.dataId);
      }
      if (keepDims) {
          // reshape
          var newShape = tfjsCore.backend_util.expandShapeToKeepDim(out.shape, originalAxes);
          out.shape = newShape;
      }
      return out;
  }
  var anyConfig = {
      kernelName: tfjsCore.Any,
      backendName: 'wasm',
      setupFunc: setup$3,
      kernelFunc: any
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmFunc$1;
  function setup$4(backend) {
      wasmFunc$1 = backend.wasm.cwrap(tfjsCore.ArgMax, null /* void */, [
          'number',
          'number',
          'number',
          'number',
          'number' // out_id
      ]);
  }
  function argmax(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var axis = attrs.axis;
      var x = inputs.x;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var inputId = xId;
      var input = x;
      var _a = permuteAxesAndTranspose(x, axis, backend), transposed = _a.transposed, axes = _a.axes, inputWasTransposed = _a.inputWasTransposed;
      if (inputWasTransposed) {
          var transposedId = backend.dataIdMap.get(transposed.dataId).id;
          if (transposedId !== xId) {
              // transpose was not a no-op. We will need to dispose of this
              // once we are done.
              input = transposed;
              inputId = transposedId;
          }
      }
      var outShape = input.shape.slice(0, -1);
      var out = backend.makeOutput(outShape, 'int32');
      var outId = backend.dataIdMap.get(out.dataId).id;
      var outerSize = tfjsCore.util.sizeFromShape(out.shape);
      var innerSize = input.shape[axes[0]];
      wasmFunc$1(inputId, CppDType[input.dtype], outerSize, innerSize, outId);
      if (inputWasTransposed) {
          // dispose of the transposed tensor.
          backend.disposeData(transposed.dataId);
      }
      return out;
  }
  var argMaxConfig = {
      kernelName: tfjsCore.ArgMax,
      backendName: 'wasm',
      kernelFunc: argmax,
      setupFunc: setup$4
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmAvgPool;
  function setup$5(backend) {
      wasmAvgPool = backend.wasm.cwrap(tfjsCore.AvgPool, null /* void */, [
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
      ]);
  }
  function avgPool(args) {
      var inputs = args.inputs, attrs = args.attrs, backend = args.backend;
      var x = inputs.x;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var filterSize = attrs.filterSize, strides = attrs.strides, pad = attrs.pad, dimRoundingMode = attrs.dimRoundingMode;
      var convInfo = tfjsCore.backend_util.computePool2DInfo(x.shape, filterSize, strides, 1 /* dilations */, pad, dimRoundingMode);
      var filterHeight = convInfo.filterHeight;
      var filterWidth = convInfo.filterWidth;
      var padTop = convInfo.padInfo.top;
      var padRight = convInfo.padInfo.right;
      var padBottom = convInfo.padInfo.bottom;
      var padLeft = convInfo.padInfo.left;
      var strideHeight = convInfo.strideHeight;
      var strideWidth = convInfo.strideWidth;
      var channels = convInfo.inChannels;
      if (convInfo.dataFormat !== 'channelsLast') {
          throw new Error("wasm backend does not support dataFormat:'" +
              (convInfo.dataFormat + "'. Please use 'channelsLast'."));
      }
      if (convInfo.dilationWidth !== 1 || convInfo.dilationHeight !== 1) {
          throw new Error("was backend only supports average pooling with dilation = [1, 1], " +
              ("got [" + convInfo.dilationHeight + ", " + convInfo.dilationWidth + "]."));
      }
      var out = backend.makeOutput(convInfo.outShape, 'float32');
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmAvgPool(xId, x.shape[0], x.shape[1], x.shape[2], filterHeight, filterWidth, padTop, padRight, padBottom, padLeft, strideHeight, strideWidth, channels, outId);
      return out;
  }
  var avgPoolConfig = {
      kernelName: tfjsCore.AvgPool,
      backendName: 'wasm',
      setupFunc: setup$5,
      kernelFunc: avgPool
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function reshape(args) {
      var inputs = args.inputs, attrs = args.attrs;
      var x = inputs.x;
      var shape = attrs.shape;
      var xSize = tfjsCore.util.sizeFromShape(x.shape);
      var $shape = tfjsCore.util.inferFromImplicitShape(shape, xSize);
      tfjsCore.util.assert(xSize === tfjsCore.util.sizeFromShape($shape), function () { return "new shape: " + $shape + ", old shape: " + x.shape + ". New shape and old " +
          "shape must have the same number of elements."; });
      // Backend needs to track refCount for the dataId for reshape op
      args.backend.incRef(x.dataId);
      return { dataId: x.dataId, shape: $shape, dtype: x.dtype };
  }
  var reshapeConfig = {
      kernelName: tfjsCore.Reshape,
      backendName: 'wasm',
      kernelFunc: reshape,
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmBatchMatMul;
  function setup$6(backend) {
      wasmBatchMatMul = backend.wasm.cwrap(tfjsCore.BatchMatMul, null /* void */, [
          'number',
          'array',
          'number',
          'number',
          'array',
          'number',
          'number',
          'number',
          'number' // out_id
      ]);
  }
  function batchMatMul(args) {
      var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
      var a = inputs.a, b = inputs.b;
      var transposeA = attrs.transposeA, transposeB = attrs.transposeB;
      if (a.dtype !== 'float32' || b.dtype !== 'float32') {
          throw new Error("BatchMatMul for non non-float32 tensors not yet supported.");
      }
      var aRank = a.shape.length;
      var bRank = b.shape.length;
      var innerShapeA = transposeA ? a.shape[aRank - 2] : a.shape[aRank - 1];
      var innerShapeB = transposeB ? b.shape[bRank - 1] : b.shape[bRank - 2];
      var outerShapeA = transposeA ? a.shape[aRank - 1] : a.shape[aRank - 2];
      var outerShapeB = transposeB ? b.shape[bRank - 2] : b.shape[bRank - 1];
      var outerDimsA = a.shape.slice(0, -2);
      var outerDimsB = b.shape.slice(0, -2);
      var batchDimA = tfjsCore.util.sizeFromShape(outerDimsA);
      var batchDimB = tfjsCore.util.sizeFromShape(outerDimsB);
      var batchDimsCompatible = batchDimA === batchDimB || batchDimA === 1 || batchDimB === 1;
      tfjsCore.util.assert(aRank >= 2 && bRank >= 2 && batchDimsCompatible, function () { return "Error in matMul: the input batch dimensions must either be the " +
          "same or at least one input batch dimension must be 1. Got input " +
          ("batch dimensions of (" + outerDimsA + ") and (" + outerDimsB + ")."); });
      var outShapeOuterDims = batchDimA > batchDimB ? a.shape.slice(0, -2) : b.shape.slice(0, -2);
      var outShape = outShapeOuterDims.concat([outerShapeA, outerShapeB]);
      tfjsCore.util.assert(innerShapeA === innerShapeB, function () { return "Error in matMul: inner shapes (" + innerShapeA + ") and (" +
          (innerShapeB + ") of Tensors with shapes " + a.shape + " and ") +
          (b.shape + " and transposeA=" + transposeA) +
          (" and transposeB=" + transposeB + " must match."); });
      var a3dShape = transposeA ? [batchDimA, innerShapeA, outerShapeA] :
          [batchDimA, outerShapeA, innerShapeA];
      var b3dShape = transposeB ? [batchDimB, outerShapeB, innerShapeB] :
          [batchDimB, innerShapeB, outerShapeB];
      // The rest of the implementation is designed to operate on rank-3 tensors
      var a3d = reshape({ inputs: { x: a }, backend: backend, attrs: { shape: a3dShape } });
      var b3d = reshape({ inputs: { x: b }, backend: backend, attrs: { shape: b3dShape } });
      var a3dId = backend.dataIdMap.get(a3d.dataId).id;
      var b3dId = backend.dataIdMap.get(b3d.dataId).id;
      var leftDim = transposeA ? a3d.shape[2] : a3d.shape[1];
      var rightDim = transposeB ? b3d.shape[1] : b3d.shape[2];
      var batchDim = Math.max(batchDimA, batchDimB);
      var out = backend.makeOutput([batchDim, leftDim, rightDim], a3d.dtype);
      var outId = backend.dataIdMap.get(out.dataId).id;
      var aShapeBytes = new Uint8Array(new Int32Array(a3d.shape).buffer);
      var bShapeBytes = new Uint8Array(new Int32Array(b3d.shape).buffer);
      wasmBatchMatMul(a3dId, aShapeBytes, a3d.shape.length, b3dId, bShapeBytes, b3d.shape.length, transposeA, transposeB, outId);
      backend.disposeData(a3d.dataId);
      backend.disposeData(b3d.dataId);
      out.shape = outShape;
      return out;
  }
  var batchMatMulConfig = {
      kernelName: tfjsCore.BatchMatMul,
      backendName: 'wasm',
      setupFunc: setup$6,
      kernelFunc: batchMatMul
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function cast(args) {
      var x = args.inputs.x, dtype = args.attrs.dtype, backend = args.backend;
      var out = backend.makeOutput(x.shape, dtype);
      var inVals = backend.typedArrayFromHeap(x);
      var outVals = backend.typedArrayFromHeap(out);
      outVals.set(inVals);
      return out;
  }
  var castConfig = {
      kernelName: tfjsCore.Cast,
      backendName: 'wasm',
      kernelFunc: cast,
  };

  /**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var ceilConfig = createUnaryKernelConfig(tfjsCore.Ceil);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmClip;
  function setup$7(backend) {
      wasmClip = backend.wasm.cwrap(tfjsCore.ClipByValue, null /* void */, [
          'number',
          'number',
          'number',
          'number' // out_id
      ]);
  }
  function clip(args) {
      var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
      var x = inputs.x;
      var clipValueMin = attrs.clipValueMin, clipValueMax = attrs.clipValueMax;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var out = backend.makeOutput(x.shape, x.dtype);
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmClip(xId, clipValueMin, clipValueMax, outId);
      return out;
  }
  var clipByValueConfig = {
      kernelName: tfjsCore.ClipByValue,
      backendName: 'wasm',
      setupFunc: setup$7,
      kernelFunc: clip
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function concatImpl(inputs, outShape, dtype, simplyConcat) {
      const outVals = tfjsCore.util.getArrayFromDType(dtype, tfjsCore.util.sizeFromShape(outShape));
      if (simplyConcat && dtype !== 'string') {
          // Use built-in TypedArray.set() method for speed.
          let offset = 0;
          inputs.forEach(input => {
              const size = tfjsCore.util.sizeFromShape(input.shape);
              outVals.set(input.vals, offset);
              offset += size;
          });
      }
      else {
          let colOffset = 0;
          inputs.forEach(input => {
              const decodedData = dtype === 'string' ?
                  tfjsCore.backend_util.fromUint8ToStringArray(input.vals) :
                  input.vals;
              let tIdx = 0;
              for (let row = 0; row < input.shape[0]; ++row) {
                  const resIdx = row * outShape[1] + colOffset;
                  for (let col = 0; col < input.shape[1]; ++col) {
                      outVals[resIdx + col] = decodedData[tIdx++];
                  }
              }
              colOffset += input.shape[1];
          });
      }
      return outVals;
  }

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function rangeImpl(start, stop, step, dtype) {
      const sameStartStop = start === stop;
      const increasingRangeNegativeStep = start < stop && step < 0;
      const decreasingRangePositiveStep = stop < start && step > 1;
      if (sameStartStop || increasingRangeNegativeStep ||
          decreasingRangePositiveStep) {
          return tfjsCore.util.makeZerosTypedArray(0, dtype);
      }
      const numElements = Math.abs(Math.ceil((stop - start) / step));
      const values = tfjsCore.util.makeZerosTypedArray(numElements, dtype);
      if (stop < start && step === 1) {
          // Auto adjust the step's sign if it hasn't been set
          // (or was set to 1)
          step = -1;
      }
      values[0] = start;
      for (let i = 1; i < values.length; i++) {
          values[i] = values[i - 1] + step;
      }
      return values;
  }

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function sliceImpl(vals, begin, size, shape, dtype) {
      const isContinous = tfjsCore.slice_util.isSliceContinous(shape, begin, size);
      const length = tfjsCore.util.sizeFromShape(size);
      const xStrides = tfjsCore.util.computeStrides(shape);
      if (isContinous) {
          const flatOffset = tfjsCore.slice_util.computeFlatOffset(begin, xStrides);
          if (dtype === 'string') {
              return vals.slice(flatOffset, flatOffset + length);
          }
          return vals.subarray(flatOffset, flatOffset + length);
      }
      const decodedData = dtype === 'string' ?
          tfjsCore.backend_util.fromUint8ToStringArray(vals) :
          vals;
      const inBuf = tfjsCore.buffer(shape, dtype, decodedData);
      const outBuf = tfjsCore.buffer(size, dtype);
      for (let i = 0; i < outBuf.size; ++i) {
          const outLoc = outBuf.indexToLoc(i);
          const inLoc = outLoc.map((idx, j) => idx + begin[j]);
          outBuf.set(inBuf.get(...inLoc), ...outLoc);
      }
      if (dtype === 'string') {
          return tfjsCore.backend_util.fromStringArrayToUint8(outBuf.values);
      }
      return outBuf.values;
  }

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function concat(args) {
      var inputs = args.inputs, backend = args.backend;
      var axis = tfjsCore.util.parseAxisParam(args.attrs.axis, inputs[0].shape)[0];
      var outShape = tfjsCore.backend_util.computeOutShape(inputs.map(function (t) { return t.shape; }), axis);
      // Keep only non-empty tensors (ignore tensors with 0 in their shape).
      var $inputs = inputs.filter(function (t) { return tfjsCore.util.sizeFromShape(t.shape) > 0; });
      if ($inputs.length === 1) {
          return identity({ inputs: { x: $inputs[0] }, backend: backend });
      }
      var out = backend.makeOutput(outShape, inputs[0].dtype);
      if (tfjsCore.util.sizeFromShape(outShape) === 0) {
          return out;
      }
      var shapes = $inputs.map(function (t) { return t.shape; });
      tfjsCore.backend_util.assertParamsConsistent(shapes, axis);
      if ($inputs[0].dtype === 'string') {
          // Any concat of n-dimensional tensors across any axis can be reduced to
          // a concatenation of two-dimensional tensors across the axis 1 by first
          // partitioning the axes of the original tensors into those less than the
          // axis to be concatenated and the rest. Then reshape the tensors
          // into a two-dimensional tensor by collapsing these two sets of axes and
          // concatenate the resulting matrices across the axis 1, finally reshaping
          // the result to have the proper shape.
          var inputs2D = $inputs.map(function (t) {
              var innerSize = tfjsCore.util.sizeFromShape(t.shape.slice(axis));
              var shape = [-1, innerSize];
              return reshape({ inputs: { x: t }, backend: backend, attrs: { shape: shape } });
          });
          var inputsValShapes = inputs2D.map(function (t) {
              return { vals: backend.readSync(t.dataId), shape: t.shape };
          });
          // Concats 2d tensors along axis=1.
          outShape =
              tfjsCore.backend_util.computeOutShape(inputs2D.map(function (t) { return t.shape; }), 1 /* axis */);
          var simplyConcat = inputs2D[0].shape[0] === 1;
          var outVals_1 = concatImpl(inputsValShapes, outShape, inputs[0].dtype, simplyConcat);
          var finalOutShape = tfjsCore.backend_util.computeOutShape($inputs.map(function (t) { return t.shape; }), axis);
          out.shape = finalOutShape;
          var outData = backend.dataIdMap.get(out.dataId);
          outData.stringBytes = tfjsCore.backend_util.fromStringArrayToUint8(outVals_1);
          inputs2D.forEach(function (t) { return backend.disposeData(t.dataId); });
          return out;
      }
      var batchDim = tfjsCore.util.sizeFromShape($inputs[0].shape.slice(0, axis));
      var sumInnerDims = 0;
      var innerDims = $inputs.map(function (input) {
          var innerDim = tfjsCore.util.sizeFromShape(input.shape.slice(axis));
          sumInnerDims += innerDim;
          return innerDim;
      });
      var inVals = $inputs.map(function (input) { return backend.typedArrayFromHeap(input); });
      var outVals = backend.typedArrayFromHeap(out);
      for (var b = 0; b < batchDim; b++) {
          var outOffset = b * sumInnerDims;
          for (var i = 0; i < inVals.length; i++) {
              var innerDim = innerDims[i];
              var inOffset = b * innerDim;
              var vals = inVals[i].subarray(inOffset, inOffset + innerDim);
              outVals.set(vals, outOffset);
              outOffset += innerDim;
          }
      }
      return out;
  }
  var concatConfig = {
      kernelName: tfjsCore.Concat,
      backendName: 'wasm',
      kernelFunc: concat,
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmConv2d;
  function setup$8(backend) {
      wasmConv2d = backend.wasm.cwrap(tfjsCore.Conv2D, null /* void */, [
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
      ]);
  }
  function conv2d(args) {
      var inputs = args.inputs, attrs = args.attrs, backend = args.backend;
      var x = inputs.x, filter = inputs.filter;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var filterId = backend.dataIdMap.get(filter.dataId).id;
      var strides = attrs.strides, dilations = attrs.dilations, pad = attrs.pad, dimRoundingMode = attrs.dimRoundingMode, dataFormat = attrs.dataFormat;
      var $dataFormat = tfjsCore.backend_util.convertConv2DDataFormat(dataFormat);
      var convInfo = tfjsCore.backend_util.computeConv2DInfo(x.shape, filter.shape, strides, dilations, pad, dimRoundingMode, false, $dataFormat);
      var filterHeight = convInfo.filterHeight;
      var filterWidth = convInfo.filterWidth;
      var padTop = convInfo.padInfo.top;
      var padRight = convInfo.padInfo.right;
      var padBottom = convInfo.padInfo.bottom;
      var padLeft = convInfo.padInfo.left;
      var dilationHeight = convInfo.dilationHeight;
      var dilationWidth = convInfo.dilationWidth;
      var strideHeight = convInfo.strideHeight;
      var strideWidth = convInfo.strideWidth;
      var inputChannels = convInfo.inChannels;
      var outputChannels = convInfo.outChannels;
      var isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
      if (convInfo.dataFormat !== 'channelsLast') {
          throw new Error("wasm backend Conv2D does not support dataFormat:'" +
              (convInfo.dataFormat + "'. Please use 'channelsLast'."));
      }
      var out = backend.makeOutput(convInfo.outShape, 'float32');
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmConv2d(xId, x.shape[0], x.shape[1], x.shape[2], filterId, filterHeight, filterWidth, padTop, padRight, padBottom, padLeft, isSamePad, dilationHeight, dilationWidth, strideHeight, strideWidth, inputChannels, outputChannels, outId);
      return out;
  }
  var conv2DConfig = {
      kernelName: tfjsCore.Conv2D,
      backendName: 'wasm',
      setupFunc: setup$8,
      kernelFunc: conv2d
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmConv2DBackpropInput;
  function setup$9(backend) {
      wasmConv2DBackpropInput = backend.wasm.cwrap(tfjsCore.Conv2DBackpropInput, null, [
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
      ]);
  }
  function conv2DBackpropInput(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var dy = inputs.dy, filter = inputs.filter;
      var strides = attrs.strides, pad = attrs.pad, dataFormat = attrs.dataFormat, dimRoundingMode = attrs.dimRoundingMode, inputShape = attrs.inputShape;
      var dilations = 1;
      var $dataFormat = tfjsCore.backend_util.convertConv2DDataFormat(dataFormat);
      var convInfo = tfjsCore.backend_util.computeConv2DInfo(inputShape, filter.shape, strides, dilations, pad, dimRoundingMode, false /* depthwise */, $dataFormat);
      var batchSize = convInfo.batchSize, filterHeight = convInfo.filterHeight, filterWidth = convInfo.filterWidth, inChannels = convInfo.inChannels, inHeight = convInfo.inHeight, inWidth = convInfo.inWidth, outChannels = convInfo.outChannels, outHeight = convInfo.outHeight, outWidth = convInfo.outWidth, strideHeight = convInfo.strideHeight, strideWidth = convInfo.strideWidth;
      var topPad = filterHeight - 1 - convInfo.padInfo.top;
      var leftPad = filterWidth - 1 - convInfo.padInfo.left;
      var isChannelsLast = convInfo.dataFormat === 'channelsLast';
      var dxStrides = tfjsCore.util.computeStrides(convInfo.inShape);
      var dyStrides = tfjsCore.util.computeStrides(dy.shape);
      var _a = tfjsCore.util.computeStrides(filter.shape), fltS0 = _a[0], fltS1 = _a[1], fltS2 = _a[2];
      var xBatchStride = dxStrides[0];
      var xRowStride = isChannelsLast ? dxStrides[1] : dxStrides[2];
      var xColStride = isChannelsLast ? dxStrides[2] : 1;
      var xChannelStride = isChannelsLast ? 1 : dxStrides[1];
      var yBatchStride = dyStrides[0];
      var yRowStride = isChannelsLast ? dyStrides[1] : dyStrides[2];
      var yColStride = isChannelsLast ? dyStrides[2] : 1;
      var yChannelStride = isChannelsLast ? 1 : dyStrides[1];
      var out = backend.makeOutput(convInfo.inShape, 'float32');
      var outId = backend.dataIdMap.get(out.dataId).id;
      var dyId = backend.dataIdMap.get(dy.dataId).id;
      var filterId = backend.dataIdMap.get(filter.dataId).id;
      wasmConv2DBackpropInput(dyId, filterId, batchSize, filterHeight, filterWidth, inHeight, inWidth, inChannels, outHeight, outWidth, outChannels, strideHeight, strideWidth, topPad, leftPad, fltS0, fltS1, fltS2, xBatchStride, xRowStride, xColStride, xChannelStride, yBatchStride, yRowStride, yColStride, yChannelStride, outId);
      return out;
  }
  var conv2DBackpropInputConfig = {
      kernelName: tfjsCore.Conv2DBackpropInput,
      backendName: 'wasm',
      setupFunc: setup$9,
      kernelFunc: conv2DBackpropInput
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var cosConfig = createUnaryKernelConfig(tfjsCore.Cos);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  // Must match enum in CropAndResize.cc
  var InterpolationMethod;
  (function (InterpolationMethod) {
      InterpolationMethod[InterpolationMethod["bilinear"] = 0] = "bilinear";
      InterpolationMethod[InterpolationMethod["nearest"] = 1] = "nearest";
  })(InterpolationMethod || (InterpolationMethod = {}));
  var wasmCropAndResize;
  function setup$a(backend) {
      wasmCropAndResize = backend.wasm.cwrap(tfjsCore.CropAndResize, null /*void*/, [
          'number',
          'number',
          'number',
          'number',
          'array',
          'number',
          'number',
          'number',
          'number',
          'number' // out id
      ]);
  }
  function cropAndResize(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var method = attrs.method, extrapolationValue = attrs.extrapolationValue, cropSize = attrs.cropSize;
      var image = inputs.image, boxes = inputs.boxes, boxInd = inputs.boxInd;
      var numBoxes = boxes.shape[0];
      var _a = cropSize, cropHeight = _a[0], cropWidth = _a[1];
      var outShape = [numBoxes, cropHeight, cropWidth, image.shape[3]];
      var imagesData = backend.dataIdMap.get(image.dataId);
      var castedData;
      if (image.dtype !== 'float32') {
          castedData = cast({ backend: backend, inputs: { x: image }, attrs: { dtype: 'float32' } });
          imagesData = backend.dataIdMap.get(castedData.dataId);
      }
      var imagesId = imagesData.id;
      var boxesId = backend.dataIdMap.get(boxes.dataId).id;
      var boxIndId = backend.dataIdMap.get(boxInd.dataId).id;
      var out = backend.makeOutput(outShape, 'float32');
      var outId = backend.dataIdMap.get(out.dataId).id;
      var imagesShapeBytes = new Uint8Array(new Int32Array(image.shape).buffer);
      wasmCropAndResize(imagesId, boxesId, boxIndId, numBoxes, imagesShapeBytes, cropHeight, cropWidth, InterpolationMethod[method], extrapolationValue, outId);
      if (castedData != null) {
          backend.disposeData(castedData.dataId);
      }
      return out;
  }
  var cropAndResizeConfig = {
      kernelName: tfjsCore.CropAndResize,
      backendName: 'wasm',
      setupFunc: setup$a,
      kernelFunc: cropAndResize
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmCumsum;
  function setup$b(backend) {
      wasmCumsum = backend.wasm.cwrap(tfjsCore.Cumsum, null /* void */, [
          'number',
          'number',
          'number',
          'number',
          'number',
          'number' // dtype
      ]);
  }
  function cumsum(args) {
      var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
      var x = inputs.x;
      var axis = attrs.axis, exclusive = attrs.exclusive, reverse = attrs.reverse;
      var xRank = x.shape.length;
      tfjsCore.util.assert(x.dtype === 'float32' || x.dtype === 'int32', function () { return "cumsum does not support " + x.dtype + " tensors in the WASM backend"; });
      // permute required axis to inner most axis
      var permutation = tfjsCore.backend_util.getAxesPermutation([axis], xRank);
      var permutedX = x;
      if (permutation !== null) {
          permutedX = transpose({ inputs: { x: x }, attrs: { perm: permutation }, backend: backend });
      }
      var permutedAxis = tfjsCore.backend_util.getInnerMostAxes(1, xRank)[0];
      tfjsCore.backend_util.assertAxesAreInnerMostDims('cumsum', [permutedAxis], xRank);
      var permutedOut = backend.makeOutput(permutedX.shape, permutedX.dtype);
      var finalDim = permutedX.shape[permutedAxis];
      var permutedXId = backend.dataIdMap.get(permutedX.dataId).id;
      var permutedOutId = backend.dataIdMap.get(permutedOut.dataId).id;
      wasmCumsum(permutedXId, exclusive ? 1 : 0, reverse ? 1 : 0, finalDim, permutedOutId, CppDType[x.dtype]);
      // transpose data back if permuted
      var out = permutedOut;
      if (permutation !== null) {
          var undoPermutation = tfjsCore.backend_util.getUndoAxesPermutation(permutation);
          out = transpose({ inputs: { x: permutedOut }, attrs: { perm: undoPermutation }, backend: backend });
          backend.disposeData(permutedX.dataId);
          backend.disposeData(permutedOut.dataId);
      }
      return out;
  }
  var cumsumConfig = {
      kernelName: tfjsCore.Cumsum,
      backendName: 'wasm',
      setupFunc: setup$b,
      kernelFunc: cumsum
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmDepthToSpace;
  function setup$c(backend) {
      wasmDepthToSpace = backend.wasm.cwrap(tfjsCore.DepthToSpace, null /*void*/, [
          'number',
          'number',
          'number',
          'array',
          'number',
          'array',
          'array',
          'number',
          'number',
      ]);
  }
  function depthToSpace(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var x = inputs.x;
      var blockSize = attrs.blockSize, dataFormat = attrs.dataFormat;
      tfjsCore.util.assert(blockSize > 1, function () { return "blockSize should be > 1 for depthToSpace, but was: " + blockSize; });
      var batchSize = x.shape[0];
      var inputHeight = (dataFormat === 'NHWC') ? x.shape[1] : x.shape[2];
      var inputWidth = (dataFormat === 'NHWC') ? x.shape[2] : x.shape[3];
      var inputDepth = (dataFormat === 'NHWC') ? x.shape[3] : x.shape[1];
      var outputHeight = inputHeight * blockSize;
      var outputWidth = inputWidth * blockSize;
      var outputDepth = inputDepth / (blockSize * blockSize);
      var outputShape = (dataFormat === 'NHWC') ?
          [batchSize, outputHeight, outputWidth, outputDepth] :
          [batchSize, outputDepth, outputHeight, outputWidth];
      var out = backend.makeOutput(outputShape, 'float32');
      var xData = backend.dataIdMap.get(x.dataId);
      var xId = xData.id;
      var xStridesBytes = new Uint8Array(new Int32Array(tfjsCore.util.computeStrides(x.shape)).buffer);
      var outputShapeBytes = new Uint8Array(new Int32Array(outputShape).buffer);
      var outStridesBytes = new Uint8Array(new Int32Array(tfjsCore.util.computeStrides(outputShape)).buffer);
      var outId = backend.dataIdMap.get(out.dataId).id;
      var channelsLast = dataFormat === 'NHWC' ? 1 : 0;
      wasmDepthToSpace(xId, blockSize, channelsLast, xStridesBytes, x.shape.length - 1, outputShapeBytes, outStridesBytes, outputShape.length, outId);
      return out;
  }
  var depthToSpaceConfig = {
      kernelName: tfjsCore.DepthToSpace,
      backendName: 'wasm',
      setupFunc: setup$c,
      kernelFunc: depthToSpace
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmDepthwiseConv2d;
  function setup$d(backend) {
      wasmDepthwiseConv2d =
          backend.wasm.cwrap(tfjsCore.DepthwiseConv2dNative, null /* void */, [
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
          ]);
  }
  function depthwiseConv2d(args) {
      var inputs = args.inputs, attrs = args.attrs, backend = args.backend;
      var x = inputs.x, filter = inputs.filter;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var filterId = backend.dataIdMap.get(filter.dataId).id;
      var strides = attrs.strides, dilations = attrs.dilations, pad = attrs.pad, dimRoundingMode = attrs.dimRoundingMode;
      var $dilations = dilations == null ? [1, 1] : dilations;
      var convInfo = tfjsCore.backend_util.computeConv2DInfo(x.shape, filter.shape, strides, $dilations, pad, dimRoundingMode, true /* depthwise */);
      var filterHeight = convInfo.filterHeight;
      var filterWidth = convInfo.filterWidth;
      var padTop = convInfo.padInfo.top;
      var padRight = convInfo.padInfo.right;
      var padBottom = convInfo.padInfo.bottom;
      var padLeft = convInfo.padInfo.left;
      var dilationHeight = convInfo.dilationHeight;
      var dilationWidth = convInfo.dilationWidth;
      var strideHeight = convInfo.strideHeight;
      var strideWidth = convInfo.strideWidth;
      var inputChannels = convInfo.inChannels;
      var outputChannels = convInfo.outChannels;
      var isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
      if (convInfo.dataFormat !== 'channelsLast') {
          throw new Error("wasm backend DepthwiseConv2dNative does not support dataFormat:'" +
              (convInfo.dataFormat + "'. Please use 'channelsLast'."));
      }
      var out = backend.makeOutput(convInfo.outShape, 'float32');
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmDepthwiseConv2d(xId, x.shape[0], x.shape[1], x.shape[2], filterId, filterHeight, filterWidth, padTop, padRight, padBottom, padLeft, isSamePad, dilationHeight, dilationWidth, strideHeight, strideWidth, inputChannels, outputChannels, outId);
      return out;
  }
  var depthwiseConv2dNativeConfig = {
      kernelName: tfjsCore.DepthwiseConv2dNative,
      backendName: 'wasm',
      setupFunc: setup$d,
      kernelFunc: depthwiseConv2d
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast$1 = false;
  var equalConfig = createBinaryKernelConfig(tfjsCore.Equal, supportsFullBroadcast$1, 'bool');

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var expConfig = createUnaryKernelConfig(tfjsCore.Exp);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function expandDims(args) {
      var inputs = args.inputs, attrs = args.attrs, backend = args.backend;
      var input = inputs.input;
      var dim = attrs.dim;
      var inputRank = input.shape.length;
      var newShape = input.shape.slice();
      var $dim = dim;
      if (dim < 0) {
          // Negative value is counted from the tail of rank.
          tfjsCore.util.assert(-(inputRank + 1) <= dim, function () { return "Axis must be in the interval [" + -(inputRank + 1) + ", " + inputRank + "]"; });
          $dim = inputRank + dim + 1;
      }
      newShape.splice($dim, 0, 1);
      return reshape({ inputs: { x: input }, backend: backend, attrs: { shape: newShape } });
  }
  var expandDimsConfig = {
      kernelName: tfjsCore.ExpandDims,
      backendName: 'wasm',
      kernelFunc: expandDims,
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function fill(args) {
      var _a = args.attrs, shape = _a.shape, value = _a.value, dtype = _a.dtype, backend = args.backend;
      var out = backend.makeOutput(shape, dtype);
      var outVals = backend.typedArrayFromHeap(out);
      outVals.fill(value);
      return out;
  }
  var fillConfig = {
      kernelName: tfjsCore.Fill,
      backendName: 'wasm',
      kernelFunc: fill,
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmFlipLeftRight;
  function setup$e(backend) {
      wasmFlipLeftRight = backend.wasm.cwrap(tfjsCore.FlipLeftRight, null /* void */, [
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
      ]);
  }
  function flipLeftRight(args) {
      var inputs = args.inputs, backend = args.backend;
      var image = inputs.image;
      var out = backend.makeOutput(image.shape, image.dtype);
      var imageId = backend.dataIdMap.get(image.dataId).id;
      var outId = backend.dataIdMap.get(out.dataId).id;
      var _a = image.shape, batch = _a[0], imageHeight = _a[1], imageWidth = _a[2], numChannels = _a[3];
      wasmFlipLeftRight(imageId, batch, imageHeight, imageWidth, numChannels, outId);
      return out;
  }
  var flipLeftRightConfig = {
      kernelName: tfjsCore.FlipLeftRight,
      backendName: 'wasm',
      kernelFunc: flipLeftRight,
      setupFunc: setup$e
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var floorConfig = createUnaryKernelConfig(tfjsCore.Floor);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast$2 = false;
  var floorDivConfig = createBinaryKernelConfig(tfjsCore.FloorDiv, supportsFullBroadcast$2);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmBatchNorm;
  function setup$f(backend) {
      wasmBatchNorm = backend.wasm.cwrap(tfjsCore.FusedBatchNorm, null /* void */, ['number', 'number', 'number', 'number', 'number', 'number', 'number']);
  }
  function fusedBatchNorm(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var varianceEpsilon = attrs.varianceEpsilon;
      var x = inputs.x, mean = inputs.mean, variance = inputs.variance, offset = inputs.offset, scale = inputs.scale;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var meanId = backend.dataIdMap.get(mean.dataId).id;
      var varianceId = backend.dataIdMap.get(variance.dataId).id;
      var offsetId = offset != null ? backend.dataIdMap.get(offset.dataId).id : 0;
      var scaleId = scale != null ? backend.dataIdMap.get(scale.dataId).id : 0;
      var out = backend.makeOutput(x.shape, x.dtype);
      // Short-circuit zero-sized tensors.
      if (tfjsCore.util.sizeFromShape(x.shape) === 0) {
          return out;
      }
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmBatchNorm(xId, meanId, varianceId, offsetId, scaleId, varianceEpsilon, outId);
      return out;
  }
  var fusedBatchNormConfig = {
      kernelName: tfjsCore.FusedBatchNorm,
      backendName: 'wasm',
      setupFunc: setup$f,
      kernelFunc: fusedBatchNorm
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmFusedConv2d;
  function setup$g(backend) {
      wasmFusedConv2d = backend.wasm.cwrap(tfjsCore.FusedConv2D, null /* void */, [
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
      ]);
  }
  function fusedConv2d(args) {
      var inputs = args.inputs, attrs = args.attrs, backend = args.backend;
      var x = inputs.x, filter = inputs.filter, bias = inputs.bias, preluActivationWeights = inputs.preluActivationWeights;
      var strides = attrs.strides, pad = attrs.pad, dilations = attrs.dilations, dataFormat = attrs.dataFormat, dimRoundingMode = attrs.dimRoundingMode, activation = attrs.activation, leakyreluAlpha = attrs.leakyreluAlpha;
      var convInfo = tfjsCore.backend_util.computeConv2DInfo(x.shape, filter.shape, strides, dilations, pad, dimRoundingMode);
      var fusedActivation = FusableActivation[activation];
      if (fusedActivation == null) {
          throw new Error(activation + " activation not yet supported for FusedConv2D " +
              "in the wasm backend.");
      }
      var xId = backend.dataIdMap.get(x.dataId).id;
      var filterId = backend.dataIdMap.get(filter.dataId).id;
      var outputChannels = convInfo.outChannels;
      var biasId = 0;
      if (bias != null) {
          var biasData = backend.dataIdMap.get(bias.dataId);
          if (biasData.shape.length !== 1) {
              throw new Error("FusedConv2D only supports rank-1 bias but got " +
                  ("rank " + biasData.shape.length + "."));
          }
          if (biasData.shape[0] !== outputChannels) {
              throw new Error("FusedConv2D bias shape (" + biasData.shape + ") does not " +
                  ("match the number of output channels (" + outputChannels + ")"));
          }
          biasId = biasData.id;
      }
      var filterHeight = convInfo.filterHeight;
      var filterWidth = convInfo.filterWidth;
      var padTop = convInfo.padInfo.top;
      var padRight = convInfo.padInfo.right;
      var padBottom = convInfo.padInfo.bottom;
      var padLeft = convInfo.padInfo.left;
      var dilationHeight = convInfo.dilationHeight;
      var dilationWidth = convInfo.dilationWidth;
      var strideHeight = convInfo.strideHeight;
      var strideWidth = convInfo.strideWidth;
      var inputChannels = convInfo.inChannels;
      var isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
      var batchSize = convInfo.batchSize;
      var inHeight = convInfo.inHeight;
      var inWidth = convInfo.inWidth;
      if (dataFormat !== 'NHWC') {
          throw new Error("wasm backend FusedConv2D does not support dataFormat:'" +
              (dataFormat + "'. Please use 'NHWC'."));
      }
      var out = backend.makeOutput(convInfo.outShape, 'float32');
      var outId = backend.dataIdMap.get(out.dataId).id;
      var preluActivationWeightsId = preluActivationWeights == null ?
          0 :
          backend.dataIdMap.get(preluActivationWeights.dataId).id;
      wasmFusedConv2d(xId, batchSize, inHeight, inWidth, filterId, filterHeight, filterWidth, biasId, padTop, padRight, padBottom, padLeft, isSamePad, dilationHeight, dilationWidth, strideHeight, strideWidth, inputChannels, outputChannels, fusedActivation, preluActivationWeightsId, leakyreluAlpha || 0, outId);
      return out;
  }
  var fusedConv2DConfig = {
      kernelName: tfjsCore.FusedConv2D,
      backendName: 'wasm',
      setupFunc: setup$g,
      kernelFunc: fusedConv2d
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmFusedDepthwiseConv2d;
  function setup$h(backend) {
      wasmFusedDepthwiseConv2d =
          backend.wasm.cwrap(tfjsCore.FusedDepthwiseConv2D, null /* void */, [
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
              'number',
          ]);
  }
  function fusedDepthwiseConv2d(args) {
      var inputs = args.inputs, attrs = args.attrs, backend = args.backend;
      var x = inputs.x, filter = inputs.filter, bias = inputs.bias, preluActivationWeights = inputs.preluActivationWeights;
      var strides = attrs.strides, pad = attrs.pad, dilations = attrs.dilations, dataFormat = attrs.dataFormat, dimRoundingMode = attrs.dimRoundingMode, activation = attrs.activation, leakyreluAlpha = attrs.leakyreluAlpha;
      var convInfo = tfjsCore.backend_util.computeConv2DInfo(x.shape, filter.shape, strides, dilations, pad, dimRoundingMode, true /* depthwise */);
      var fusedActivation = FusableActivation[activation];
      if (fusedActivation == null) {
          throw new Error(activation + " activation not yet supported for FusedDepthwiseConv2D " +
              "in the wasm backend.");
      }
      var xId = backend.dataIdMap.get(x.dataId).id;
      var filterId = backend.dataIdMap.get(filter.dataId).id;
      var outputChannels = convInfo.outChannels;
      var biasId = 0;
      if (bias != null) {
          var biasData = backend.dataIdMap.get(bias.dataId);
          if (biasData.shape.length !== 1) {
              throw new Error("FusedDepthwiseConv2D only supports rank-1 bias but got " +
                  ("rank " + biasData.shape.length + "."));
          }
          if (biasData.shape[0] !== outputChannels) {
              throw new Error("FusedDepthwiseConv2D bias shape (" + biasData.shape + ") does not " +
                  ("match the number of output channels (" + outputChannels + ")"));
          }
          biasId = biasData.id;
      }
      var filterHeight = convInfo.filterHeight;
      var filterWidth = convInfo.filterWidth;
      var padTop = convInfo.padInfo.top;
      var padRight = convInfo.padInfo.right;
      var padBottom = convInfo.padInfo.bottom;
      var padLeft = convInfo.padInfo.left;
      var dilationHeight = convInfo.dilationHeight;
      var dilationWidth = convInfo.dilationWidth;
      var strideHeight = convInfo.strideHeight;
      var strideWidth = convInfo.strideWidth;
      var inputChannels = convInfo.inChannels;
      var isSamePad = convInfo.padInfo.type === 'SAME' ? 1 : 0;
      var batchSize = convInfo.batchSize;
      var inHeight = convInfo.inHeight;
      var inWidth = convInfo.inWidth;
      if (dataFormat !== 'NHWC') {
          throw new Error("wasm backend FusedDepthwiseConv2D does not support dataFormat:'" +
              (dataFormat + "'. Please use 'NHWC'."));
      }
      var out = backend.makeOutput(convInfo.outShape, 'float32');
      var outId = backend.dataIdMap.get(out.dataId).id;
      var preluActivationWeightsId = preluActivationWeights == null ?
          0 :
          backend.dataIdMap.get(preluActivationWeights.dataId).id;
      wasmFusedDepthwiseConv2d(xId, batchSize, inHeight, inWidth, filterId, filterHeight, filterWidth, biasId, padTop, padRight, padBottom, padLeft, isSamePad, dilationHeight, dilationWidth, strideHeight, strideWidth, inputChannels, outputChannels, fusedActivation, preluActivationWeightsId, leakyreluAlpha || 0, outId);
      return out;
  }
  var fusedDepthwiseConv2DConfig = {
      kernelName: tfjsCore.FusedDepthwiseConv2D,
      backendName: 'wasm',
      setupFunc: setup$h,
      kernelFunc: fusedDepthwiseConv2d
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmGatherNd;
  function setup$i(backend) {
      wasmGatherNd = backend.wasm.cwrap(tfjsCore.GatherNd, null /*void*/, [
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'array',
          'number' // outId
      ]);
  }
  function gatherNd(args) {
      var backend = args.backend, inputs = args.inputs;
      var params = inputs.params, indices = inputs.indices;
      var _a = tfjsCore.gather_util.prepareAndValidate(params, indices), resultShape = _a[0], numSlices = _a[1], sliceSize = _a[2], strides = _a[3];
      var out = backend.makeOutput(resultShape, params.dtype);
      if (numSlices === 0) {
          return out;
      }
      var indicesShape = indices.shape;
      var sliceRank = indicesShape[indicesShape.length - 1];
      var xData = backend.dataIdMap.get(params.dataId);
      var xId = xData.id;
      var indicesData = backend.dataIdMap.get(indices.dataId);
      var indicesId = indicesData.id;
      var stridesBytes = new Uint8Array(new Int32Array(strides).buffer);
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmGatherNd(xId, CppDType[params.dtype], indicesId, numSlices, sliceRank, sliceSize, stridesBytes, outId);
      return out;
  }
  var gatherNdConfig = {
      kernelName: tfjsCore.GatherNd,
      backendName: 'wasm',
      setupFunc: setup$i,
      kernelFunc: gatherNd
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmGather;
  function setup$j(backend) {
      wasmGather = backend.wasm.cwrap('Gather', null /*void*/, [
          'number',
          'number',
          'array',
          'number',
          'number',
          'number',
          'array',
          'number' // outId
      ]);
  }
  function gatherV2(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var x = inputs.x, indices = inputs.indices;
      var axis = attrs.axis, batchDims = attrs.batchDims;
      var parsedAxis = tfjsCore.util.parseAxisParam(axis, x.shape)[0];
      var shapeInfo = tfjsCore.backend_util.segment_util.collectGatherOpShapeInfo(x, indices, parsedAxis, batchDims);
      var flattenX = reshape({
          inputs: { x: x },
          attrs: {
              shape: [
                  shapeInfo.batchSize, shapeInfo.outerSize, shapeInfo.dimSize,
                  shapeInfo.sliceSize
              ]
          },
          backend: backend
      });
      var indicesSize = tfjsCore.util.sizeFromShape(indices.shape);
      var flattenIndex = reshape({
          inputs: { x: indices },
          attrs: { shape: [shapeInfo.batchSize, indicesSize / shapeInfo.batchSize] },
          backend: backend
      });
      var flattenOutputShape = [
          shapeInfo.batchSize, shapeInfo.outerSize, indicesSize / shapeInfo.batchSize,
          shapeInfo.sliceSize
      ];
      var out = backend.makeOutput(flattenOutputShape, x.dtype);
      if (tfjsCore.util.sizeFromShape(x.shape) === 0) {
          return out;
      }
      var stridesSize = flattenX.shape.length - 1;
      var xData = backend.dataIdMap.get(flattenX.dataId);
      var xId = xData.id;
      var indicesData = backend.dataIdMap.get(flattenIndex.dataId);
      var indicesId = indicesData.id;
      var outId = backend.dataIdMap.get(out.dataId).id;
      var xStridesBytes = new Uint8Array(new Int32Array(tfjsCore.util.computeStrides(flattenX.shape)).buffer);
      var outStridesBytes = new Uint8Array(new Int32Array(tfjsCore.util.computeStrides(flattenOutputShape)).buffer);
      wasmGather(xId, CppDType[x.dtype], xStridesBytes, stridesSize, indicesId, shapeInfo.batchSize, outStridesBytes, outId);
      backend.disposeData(flattenX.dataId);
      backend.disposeData(flattenIndex.dataId);
      // reshape
      out.shape = shapeInfo.outputShape;
      return out;
  }
  var gatherV2Config = {
      kernelName: tfjsCore.GatherV2,
      backendName: 'wasm',
      setupFunc: setup$j,
      kernelFunc: gatherV2
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast$3 = false;
  var greaterConfig = createBinaryKernelConfig(tfjsCore.Greater, supportsFullBroadcast$3, 'bool');

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast$4 = false;
  var greaterEqualConfig = createBinaryKernelConfig(tfjsCore.GreaterEqual, supportsFullBroadcast$4, 'bool');

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmFunc$2;
  function setupFunc$1(backend) {
      wasmFunc$2 = backend.wasm.cwrap(tfjsCore.LeakyRelu, null /* void */, [
          'number',
          'number',
          'number' // out_id
      ]);
  }
  function leakyRelu(args) {
      var x = args.inputs.x, alpha = args.attrs.alpha, backend = args.backend;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var out = backend.makeOutput(x.shape, x.dtype);
      if (tfjsCore.util.sizeFromShape(x.shape) !== 0) {
          var outId = backend.dataIdMap.get(out.dataId).id;
          wasmFunc$2(xId, alpha, outId);
      }
      return out;
  }
  var leakyReluConfig = {
      kernelName: tfjsCore.LeakyRelu,
      backendName: 'wasm',
      setupFunc: setupFunc$1,
      kernelFunc: leakyRelu,
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast$5 = false;
  var lessConfig = createBinaryKernelConfig(tfjsCore.Less, supportsFullBroadcast$5, 'bool');

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast$6 = false;
  var lessEqualConfig = createBinaryKernelConfig(tfjsCore.LessEqual, supportsFullBroadcast$6, 'bool');

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var logConfig = createUnaryKernelConfig(tfjsCore.Log);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast$7 = false;
  var logicalAndConfig = createBinaryKernelConfig(tfjsCore.LogicalAnd, supportsFullBroadcast$7, 'bool');

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmMax;
  function setup$k(backend) {
      wasmMax = backend.wasm.cwrap(tfjsCore.Max, null /*void*/, ['number, number, number']);
  }
  function max(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var axis = attrs.reductionIndices, keepDims = attrs.keepDims;
      var x = inputs.x;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var inputId = xId;
      var input = x;
      var _a = permuteAxesAndTranspose(x, axis, backend), transposed = _a.transposed, axes = _a.axes, originalAxes = _a.originalAxes, inputWasTransposed = _a.inputWasTransposed;
      if (inputWasTransposed) {
          var transposedId = backend.dataIdMap.get(transposed.dataId).id;
          input = transposed;
          inputId = transposedId;
      }
      var inputRank = input.shape.length;
      tfjsCore.backend_util.assertAxesAreInnerMostDims('max', axes, inputRank);
      var _b = tfjsCore.backend_util.computeOutAndReduceShapes(input.shape, axes), outShape = _b[0], reduceShape = _b[1];
      var reduceSize = tfjsCore.util.sizeFromShape(reduceShape);
      var out = backend.makeOutput(outShape, x.dtype);
      if (tfjsCore.util.sizeFromShape(input.shape) !== 0) {
          var outId = backend.dataIdMap.get(out.dataId).id;
          wasmMax(inputId, reduceSize, outId);
      }
      if (inputWasTransposed) {
          // dispose of the transposed tensor.
          backend.disposeData(transposed.dataId);
      }
      if (keepDims) {
          // reshape
          var newShape = tfjsCore.backend_util.expandShapeToKeepDim(out.shape, originalAxes);
          out.shape = newShape;
      }
      return out;
  }
  var maxConfig = {
      kernelName: tfjsCore.Max,
      backendName: 'wasm',
      setupFunc: setup$k,
      kernelFunc: max
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast$8 = false;
  var maximumConfig = createBinaryKernelConfig(tfjsCore.Maximum, supportsFullBroadcast$8);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmMaxPool;
  function setup$l(backend) {
      wasmMaxPool = backend.wasm.cwrap(tfjsCore.MaxPool, null /* void */, [
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
      ]);
  }
  function maxPool(args) {
      var inputs = args.inputs, attrs = args.attrs, backend = args.backend;
      var x = inputs.x;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var filterSize = attrs.filterSize, strides = attrs.strides, pad = attrs.pad, dimRoundingMode = attrs.dimRoundingMode;
      var convInfo = tfjsCore.backend_util.computePool2DInfo(x.shape, filterSize, strides, 1 /* dilations */, pad, dimRoundingMode);
      var filterHeight = convInfo.filterHeight;
      var filterWidth = convInfo.filterWidth;
      var padTop = convInfo.padInfo.top;
      var padRight = convInfo.padInfo.right;
      var padBottom = convInfo.padInfo.bottom;
      var padLeft = convInfo.padInfo.left;
      var dilationHeight = convInfo.dilationHeight;
      var dilationWidth = convInfo.dilationWidth;
      var strideHeight = convInfo.strideHeight;
      var strideWidth = convInfo.strideWidth;
      var inputChannels = convInfo.inChannels;
      var outputChannels = convInfo.outChannels;
      if (convInfo.dataFormat !== 'channelsLast') {
          throw new Error("wasm backend does not support dataFormat:'" +
              (convInfo.dataFormat + "'. Please use 'channelsLast'."));
      }
      var out = backend.makeOutput(convInfo.outShape, 'float32');
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmMaxPool(xId, x.shape[0], x.shape[1], x.shape[2], filterHeight, filterWidth, padTop, padRight, padBottom, padLeft, dilationHeight, dilationWidth, strideHeight, strideWidth, inputChannels, outputChannels, outId);
      return out;
  }
  var maxPoolConfig = {
      kernelName: tfjsCore.MaxPool,
      backendName: 'wasm',
      setupFunc: setup$l,
      kernelFunc: maxPool
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmMean;
  function setup$m(backend) {
      wasmMean =
          backend.wasm.cwrap(tfjsCore.Mean, null /*void*/, ['number, number, number']);
  }
  function mean(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var axis = attrs.axis, keepDims = attrs.keepDims;
      var x = inputs.x;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var inputId = xId;
      var input = x;
      var _a = permuteAxesAndTranspose(x, axis, backend), transposed = _a.transposed, axes = _a.axes, originalAxes = _a.originalAxes, inputWasTransposed = _a.inputWasTransposed;
      var reductionAxes = axes;
      if (inputWasTransposed) {
          var transposedId = backend.dataIdMap.get(transposed.dataId).id;
          if (transposedId !== xId) {
              // transpose was not a no-op. We will need to dispose of this
              // once we are done.
              input = transposed;
              inputId = transposedId;
              reductionAxes = tfjsCore.backend_util.getInnerMostAxes(reductionAxes.length, input.shape.length);
          }
      }
      tfjsCore.backend_util.assertAxesAreInnerMostDims('mean', reductionAxes, input.shape.length);
      var _b = tfjsCore.backend_util.computeOutAndReduceShapes(input.shape, reductionAxes), outShape = _b[0], reduceShape = _b[1];
      var reduceSize = tfjsCore.util.sizeFromShape(reduceShape);
      var castedInput = input;
      if (input.dtype !== 'float32') {
          castedInput =
              cast({ backend: backend, inputs: { x: input }, attrs: { dtype: 'float32' } });
          inputId = backend.dataIdMap.get(castedInput.dataId).id;
      }
      var out = backend.makeOutput(outShape, 'float32');
      if (tfjsCore.util.sizeFromShape(input.shape) !== 0) {
          var outId = backend.dataIdMap.get(out.dataId).id;
          wasmMean(inputId, reduceSize, outId);
      }
      if (inputWasTransposed) {
          // dispose of the transposed tensor.
          backend.disposeData(transposed.dataId);
      }
      if (keepDims) {
          // reshape
          var newShape = tfjsCore.backend_util.expandShapeToKeepDim(out.shape, originalAxes);
          out.shape = newShape;
      }
      if (input.dtype !== 'float32') {
          backend.disposeData(castedInput.dataId);
      }
      return out;
  }
  var meanConfig = {
      kernelName: tfjsCore.Mean,
      backendName: 'wasm',
      setupFunc: setup$m,
      kernelFunc: mean
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmMin;
  function setup$n(backend) {
      wasmMin = backend.wasm.cwrap(tfjsCore.Min, null /*void*/, ['number, number, number']);
  }
  function min(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var axis = attrs.axis, keepDims = attrs.keepDims;
      var x = inputs.x;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var inputId = xId;
      var input = x;
      var _a = permuteAxesAndTranspose(x, axis, backend), transposed = _a.transposed, axes = _a.axes, originalAxes = _a.originalAxes, inputWasTransposed = _a.inputWasTransposed;
      if (inputWasTransposed) {
          var transposedId = backend.dataIdMap.get(transposed.dataId).id;
          if (transposedId !== xId) {
              // transpose was not a no-op. We will need to dispose of this
              // once we are done.
              input = transposed;
              inputId = transposedId;
          }
      }
      var inputRank = input.shape.length;
      tfjsCore.backend_util.assertAxesAreInnerMostDims('min', axes, inputRank);
      var _b = tfjsCore.backend_util.computeOutAndReduceShapes(input.shape, axes), outShape = _b[0], reduceShape = _b[1];
      var reduceSize = tfjsCore.util.sizeFromShape(reduceShape);
      var out = backend.makeOutput(outShape, input.dtype);
      if (tfjsCore.util.sizeFromShape(input.shape) !== 0) {
          var outId = backend.dataIdMap.get(out.dataId).id;
          wasmMin(inputId, reduceSize, outId);
      }
      if (inputWasTransposed) {
          // dispose of the transposed tensor.
          backend.disposeData(transposed.dataId);
      }
      if (keepDims) {
          // reshape
          var newShape = tfjsCore.backend_util.expandShapeToKeepDim(out.shape, originalAxes);
          out.shape = newShape;
      }
      return out;
  }
  var minConfig = {
      kernelName: tfjsCore.Min,
      backendName: 'wasm',
      setupFunc: setup$n,
      kernelFunc: min
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast$9 = false;
  var minimumConfig = createBinaryKernelConfig(tfjsCore.Minimum, supportsFullBroadcast$9);

  /**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  // Must match enum in MirrorPad.cc
  var MirrorPaddingMode;
  (function (MirrorPaddingMode) {
      MirrorPaddingMode[MirrorPaddingMode["reflect"] = 0] = "reflect";
      MirrorPaddingMode[MirrorPaddingMode["symmetric"] = 1] = "symmetric";
  })(MirrorPaddingMode || (MirrorPaddingMode = {}));
  var wasmMirrorPad;
  function setup$o(backend) {
      wasmMirrorPad = backend.wasm.cwrap(tfjsCore.MirrorPad, null /* void */, [
          'number',
          'array',
          'number',
          'number',
          'array',
          'array',
          'number',
          'number',
      ]);
  }
  function mirrorPad(args) {
      var x = args.inputs.x, backend = args.backend, _a = args.attrs, paddings = _a.paddings, mode = _a.mode;
      var outShape = paddings.map(function (p, i) { return p[0] /* beforePad */ + x.shape[i] + p[1]; } /* afterPad */);
      var xId = backend.dataIdMap.get(x.dataId).id;
      var out = backend.makeOutput(outShape, x.dtype);
      var outId = backend.dataIdMap.get(out.dataId).id;
      var xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
      var prePaddingsFlat = paddings.map(function (padTuple) { return padTuple[0]; });
      var postPaddingsFlat = paddings.map(function (padTuple) { return padTuple[1]; });
      var prePaddingsBytes = new Uint8Array(new Int32Array(prePaddingsFlat).buffer);
      var postPaddingsBytes = new Uint8Array(new Int32Array(postPaddingsFlat).buffer);
      wasmMirrorPad(xId, xShapeBytes, x.shape.length, CppDType[x.dtype], prePaddingsBytes, postPaddingsBytes, MirrorPaddingMode[mode], outId);
      return out;
  }
  var mirrorPadConfig = {
      kernelName: tfjsCore.MirrorPad,
      backendName: 'wasm',
      kernelFunc: mirrorPad,
      setupFunc: setup$o
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast$a = true;
  var multiplyConfig = createBinaryKernelConfig(tfjsCore.Multiply, supportsFullBroadcast$a);

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var negConfig = createUnaryKernelConfig(tfjsCore.Neg);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  /**
   * Parse the result of the c++ method, which has the shape equivalent to
   * `Result`.
   */
  function parseResultStruct(backend, resOffset) {
      var result = new Int32Array(backend.wasm.HEAPU8.buffer, resOffset, 4);
      var pSelectedIndices = result[0];
      var selectedSize = result[1];
      var pSelectedScores = result[2];
      var pValidOutputs = result[3];
      // Since the result was allocated on the heap, we have to delete it.
      backend.wasm._free(resOffset);
      return { pSelectedIndices: pSelectedIndices, selectedSize: selectedSize, pSelectedScores: pSelectedScores, pValidOutputs: pValidOutputs };
  }

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmFunc$3;
  function setup$p(backend) {
      wasmFunc$3 = backend.wasm.cwrap(tfjsCore.NonMaxSuppressionV3, 'number', // Result*
      [
          'number',
          'number',
          'number',
          'number',
          'number',
      ]);
  }
  function kernelFunc(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var iouThreshold = attrs.iouThreshold, maxOutputSize = attrs.maxOutputSize, scoreThreshold = attrs.scoreThreshold;
      var boxes = inputs.boxes, scores = inputs.scores;
      var boxesId = backend.dataIdMap.get(boxes.dataId).id;
      var scoresId = backend.dataIdMap.get(scores.dataId).id;
      var resOffset = wasmFunc$3(boxesId, scoresId, maxOutputSize, iouThreshold, scoreThreshold);
      var _a = parseResultStruct(backend, resOffset), pSelectedIndices = _a.pSelectedIndices, selectedSize = _a.selectedSize, pSelectedScores = _a.pSelectedScores, pValidOutputs = _a.pValidOutputs;
      // Since we are not using scores for V3, we have to delete it from the heap.
      backend.wasm._free(pSelectedScores);
      backend.wasm._free(pValidOutputs);
      var selectedIndicesTensor = backend.makeOutput([selectedSize], 'int32', pSelectedIndices);
      return selectedIndicesTensor;
  }
  var nonMaxSuppressionV3Config = {
      kernelName: tfjsCore.NonMaxSuppressionV3,
      backendName: 'wasm',
      setupFunc: setup$p,
      kernelFunc: kernelFunc,
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmFunc$4;
  function setup$q(backend) {
      wasmFunc$4 = backend.wasm.cwrap(tfjsCore.NonMaxSuppressionV4, 'number', // Result*
      [
          'number',
          'number',
          'number',
          'number',
          'number',
          'bool',
      ]);
  }
  function nonMaxSuppressionV4(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var iouThreshold = attrs.iouThreshold, maxOutputSize = attrs.maxOutputSize, scoreThreshold = attrs.scoreThreshold, padToMaxOutputSize = attrs.padToMaxOutputSize;
      var boxes = inputs.boxes, scores = inputs.scores;
      var boxesId = backend.dataIdMap.get(boxes.dataId).id;
      var scoresId = backend.dataIdMap.get(scores.dataId).id;
      var resOffset = wasmFunc$4(boxesId, scoresId, maxOutputSize, iouThreshold, scoreThreshold, padToMaxOutputSize);
      var _a = parseResultStruct(backend, resOffset), pSelectedIndices = _a.pSelectedIndices, selectedSize = _a.selectedSize, pSelectedScores = _a.pSelectedScores, pValidOutputs = _a.pValidOutputs;
      // Since we are not using scores for V4, we have to delete it from the heap.
      backend.wasm._free(pSelectedScores);
      var selectedIndicesTensor = backend.makeOutput([selectedSize], 'int32', pSelectedIndices);
      var validOutputsTensor = backend.makeOutput([], 'int32', pValidOutputs);
      return [selectedIndicesTensor, validOutputsTensor];
  }
  var nonMaxSuppressionV4Config = {
      kernelName: tfjsCore.NonMaxSuppressionV4,
      backendName: 'wasm',
      setupFunc: setup$q,
      kernelFunc: nonMaxSuppressionV4,
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmFunc$5;
  function setup$r(backend) {
      wasmFunc$5 = backend.wasm.cwrap(tfjsCore.NonMaxSuppressionV5, 'number', // Result*
      [
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
      ]);
  }
  function kernelFunc$1(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var iouThreshold = attrs.iouThreshold, maxOutputSize = attrs.maxOutputSize, scoreThreshold = attrs.scoreThreshold, softNmsSigma = attrs.softNmsSigma;
      var boxes = inputs.boxes, scores = inputs.scores;
      var boxesId = backend.dataIdMap.get(boxes.dataId).id;
      var scoresId = backend.dataIdMap.get(scores.dataId).id;
      var resOffset = wasmFunc$5(boxesId, scoresId, maxOutputSize, iouThreshold, scoreThreshold, softNmsSigma);
      var _a = parseResultStruct(backend, resOffset), pSelectedIndices = _a.pSelectedIndices, selectedSize = _a.selectedSize, pSelectedScores = _a.pSelectedScores, pValidOutputs = _a.pValidOutputs;
      // Since we are not using validOutputs for V5, we have to delete it from the
      // heap.
      backend.wasm._free(pValidOutputs);
      var selectedIndicesTensor = backend.makeOutput([selectedSize], 'int32', pSelectedIndices);
      var selectedScoresTensor = backend.makeOutput([selectedSize], 'float32', pSelectedScores);
      return [selectedIndicesTensor, selectedScoresTensor];
  }
  var nonMaxSuppressionV5Config = {
      kernelName: tfjsCore.NonMaxSuppressionV5,
      backendName: 'wasm',
      setupFunc: setup$r,
      kernelFunc: kernelFunc$1,
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast$b = false;
  var notEqualConfig = createBinaryKernelConfig(tfjsCore.NotEqual, supportsFullBroadcast$b, 'bool');

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmOneHot;
  function setup$s(backend) {
      wasmOneHot = backend.wasm.cwrap(tfjsCore.OneHot, null /* void */, [
          'number',
          'number',
          'number',
          'number',
          'number' // out_id
      ]);
  }
  function oneHot(args) {
      var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
      var indices = inputs.indices;
      var depth = attrs.depth, onValue = attrs.onValue, offValue = attrs.offValue;
      var out = backend.makeOutput(indices.shape.concat([depth]), 'int32');
      var outId = backend.dataIdMap.get(out.dataId).id;
      var indicesData = backend.dataIdMap.get(indices.dataId);
      var indicesId = indicesData.id;
      wasmOneHot(indicesId, depth, onValue, offValue, outId);
      return out;
  }
  var oneHotConfig = {
      kernelName: tfjsCore.OneHot,
      backendName: 'wasm',
      setupFunc: setup$s,
      kernelFunc: oneHot,
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function onesLike(args) {
      var x = args.inputs.x, backend = args.backend;
      var out = backend.makeOutput(x.shape, x.dtype);
      var outVals = backend.typedArrayFromHeap(out);
      outVals.fill(1);
      return out;
  }
  var onesLikeConfig = {
      kernelName: tfjsCore.OnesLike,
      backendName: 'wasm',
      kernelFunc: onesLike,
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function pack(args) {
      var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
      var axis = attrs.axis;
      if (inputs.length === 1) {
          return expandDims({ inputs: { input: inputs[0] }, backend: backend, attrs: { dim: axis } });
      }
      var shape = inputs[0].shape;
      var dtype = inputs[0].dtype;
      inputs.forEach(function (t) {
          tfjsCore.util.assertShapesMatch(shape, t.shape, 'All tensors passed to stack must have matching shapes');
          tfjsCore.util.assert(dtype === t.dtype, function () { return 'All tensors passed to stack must have matching dtypes'; });
      });
      var intermediateTensorInfos = [];
      var expandedTensors = inputs.map(function (t) {
          var expandedT = expandDims({ inputs: { input: t }, backend: backend, attrs: { dim: axis } });
          intermediateTensorInfos.push(expandedT);
          return expandedT;
      });
      var result = concat({ inputs: expandedTensors, backend: backend, attrs: { axis: axis } });
      intermediateTensorInfos.forEach(function (t) { return backend.disposeData(t.dataId); });
      return result;
  }
  var packConfig = {
      kernelName: tfjsCore.Pack,
      backendName: 'wasm',
      kernelFunc: pack
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmPadV2;
  function setup$t(backend) {
      wasmPadV2 = backend.wasm.cwrap(tfjsCore.PadV2, null /* void */, [
          'number',
          'array',
          'number',
          'number',
          'array',
          'array',
          'number',
          'number',
      ]);
  }
  function pad(args) {
      var x = args.inputs.x, backend = args.backend, _a = args.attrs, paddings = _a.paddings, constantValue = _a.constantValue;
      var outShape = paddings.map(function (p, i) { return p[0] /* beforePad */ + x.shape[i] + p[1]; } /* afterPad */);
      var xId = backend.dataIdMap.get(x.dataId).id;
      var out = backend.makeOutput(outShape, x.dtype);
      var outId = backend.dataIdMap.get(out.dataId).id;
      var xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
      var prePaddingsFlat = paddings.map(function (padTuple) { return padTuple[0]; });
      var postPaddingsFlat = paddings.map(function (padTuple) { return padTuple[1]; });
      var prePaddingsBytes = new Uint8Array(new Int32Array(prePaddingsFlat).buffer);
      var postPaddingsBytes = new Uint8Array(new Int32Array(postPaddingsFlat).buffer);
      wasmPadV2(xId, xShapeBytes, x.shape.length, CppDType[x.dtype], prePaddingsBytes, postPaddingsBytes, constantValue, outId);
      return out;
  }
  var padV2Config = {
      kernelName: tfjsCore.PadV2,
      backendName: 'wasm',
      kernelFunc: pad,
      setupFunc: setup$t
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast$c = false;
  var powConfig = createBinaryKernelConfig(tfjsCore.Pow, supportsFullBroadcast$c);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmPrelu;
  function setup$u(backend) {
      wasmPrelu = backend.wasm.cwrap(tfjsCore.Prelu, null /* void */, [
          'number',
          'number',
          'number' // out_id
      ]);
  }
  function prelu(args) {
      var inputs = args.inputs, backend = args.backend;
      var x = inputs.x, alpha = inputs.alpha;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var weightsId = backend.dataIdMap.get(alpha.dataId).id;
      var out = backend.makeOutput(x.shape, 'float32');
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmPrelu(xId, weightsId, outId);
      return out;
  }
  var preluConfig = {
      kernelName: tfjsCore.Prelu,
      backendName: 'wasm',
      setupFunc: setup$u,
      kernelFunc: prelu
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmProd;
  function setup$v(backend) {
      wasmProd = backend.wasm.cwrap(tfjsCore.Prod, null /*void*/, [
          'number',
          'number',
          'number',
          'number'
      ]);
  }
  function prod(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var axis = attrs.axis, keepDims = attrs.keepDims;
      var x = inputs.x;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var inputId = xId;
      var input = x;
      var _a = permuteAxesAndTranspose(x, axis, backend), transposed = _a.transposed, axes = _a.axes, originalAxes = _a.originalAxes, inputWasTransposed = _a.inputWasTransposed;
      var reductionAxes = axes;
      if (inputWasTransposed) {
          var transposedId = backend.dataIdMap.get(transposed.dataId).id;
          if (transposedId !== xId) {
              // transpose was not a no-op. We will need to dispose of this
              // once we are done.
              input = transposed;
              inputId = transposedId;
              reductionAxes = tfjsCore.backend_util.getInnerMostAxes(reductionAxes.length, input.shape.length);
          }
      }
      tfjsCore.backend_util.assertAxesAreInnerMostDims('prod', reductionAxes, input.shape.length);
      var _b = tfjsCore.backend_util.computeOutAndReduceShapes(input.shape, reductionAxes), outShape = _b[0], reduceShape = _b[1];
      var reduceSize = tfjsCore.util.sizeFromShape(reduceShape);
      var out = backend.makeOutput(outShape, input.dtype);
      if (tfjsCore.util.sizeFromShape(input.shape) !== 0) {
          var outId = backend.dataIdMap.get(out.dataId).id;
          wasmProd(inputId, reduceSize, CppDType[out.dtype], outId);
      }
      if (inputWasTransposed) {
          // dispose of the transposed tensor.
          backend.disposeData(transposed.dataId);
      }
      if (keepDims) {
          // reshape
          var newShape = tfjsCore.backend_util.expandShapeToKeepDim(out.shape, originalAxes);
          out.shape = newShape;
      }
      return out;
  }
  var prodConfig = {
      kernelName: tfjsCore.Prod,
      backendName: 'wasm',
      setupFunc: setup$v,
      kernelFunc: prod
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var range = function (args) {
      var backend = args.backend, attrs = args.attrs;
      var start = attrs.start, stop = attrs.stop, step = attrs.step, dtype = attrs.dtype;
      var values = rangeImpl(start, stop, step, dtype);
      var out = backend.makeOutput([values.length], dtype);
      var outVals = backend.typedArrayFromHeap(out);
      outVals.set(values);
      return out;
  };
  var rangeConfig = {
      kernelName: tfjsCore.Range,
      backendName: 'wasm',
      kernelFunc: range
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast$d = true;
  var realDivConfig = createBinaryKernelConfig(tfjsCore.RealDiv, supportsFullBroadcast$d);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var reluConfig = createUnaryKernelConfig(tfjsCore.Relu);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var relu6Config = createUnaryKernelConfig(tfjsCore.Relu6);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmResizeBilinear;
  function setup$w(backend) {
      wasmResizeBilinear = backend.wasm.cwrap(tfjsCore.ResizeBilinear, null /*void*/, [
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number' // outId
      ]);
  }
  function resizeBilinear(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var images = inputs.images;
      var alignCorners = attrs.alignCorners, halfPixelCenters = attrs.halfPixelCenters, size = attrs.size;
      var newHeight = size[0], newWidth = size[1];
      var _a = images.shape, batch = _a[0], oldHeight = _a[1], oldWidth = _a[2], numChannels = _a[3];
      var outShape = [batch, newHeight, newWidth, numChannels];
      var xData = backend.dataIdMap.get(images.dataId);
      var castedData;
      if (xData.dtype !== 'float32') {
          castedData =
              cast({ backend: backend, inputs: { x: images }, attrs: { dtype: 'float32' } });
          xData = backend.dataIdMap.get(castedData.dataId);
      }
      var xId = xData.id;
      var out = backend.makeOutput(outShape, 'float32');
      if (tfjsCore.util.sizeFromShape(images.shape) === 0) {
          return out;
      }
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmResizeBilinear(xId, batch, oldHeight, oldWidth, numChannels, newHeight, newWidth, alignCorners ? 1 : 0, halfPixelCenters ? 1 : 0, outId);
      if (castedData != null) {
          backend.disposeData(castedData.dataId);
      }
      return out;
  }
  var resizeBilinearConfig = {
      kernelName: tfjsCore.ResizeBilinear,
      backendName: 'wasm',
      setupFunc: setup$w,
      kernelFunc: resizeBilinear
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmReverse;
  function setup$x(backend) {
      wasmReverse = backend.wasm.cwrap(tfjsCore.Reverse, null, [
          'number',
          'array',
          'number',
          'array',
          'number',
          'number' // out_id
      ]);
  }
  function reverse(args) {
      var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
      var x = inputs.x;
      var dims = attrs.dims;
      var axes = tfjsCore.util.parseAxisParam(dims, x.shape);
      if (x.shape.length === 0) {
          return identity({ inputs: { x: x }, backend: backend });
      }
      var out = backend.makeOutput(x.shape, x.dtype);
      var xId = backend.dataIdMap.get(x.dataId).id;
      var outId = backend.dataIdMap.get(out.dataId).id;
      var axesBytes = new Uint8Array(new Int32Array(axes).buffer);
      var outShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
      wasmReverse(xId, axesBytes, axes.length, outShapeBytes, x.shape.length, outId);
      var reshaped = reshape({ inputs: { x: out }, attrs: { shape: x.shape }, backend: backend });
      backend.disposeData(out.dataId);
      return reshaped;
  }
  var reverseConfig = {
      kernelName: tfjsCore.Reverse,
      backendName: 'wasm',
      kernelFunc: reverse,
      setupFunc: setup$x
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmRotate;
  function setup$y(backend) {
      wasmRotate = backend.wasm.cwrap(tfjsCore.RotateWithOffset, null /* void */, [
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'array',
          'number',
          'number',
      ]);
  }
  function rotateWithOffset(args) {
      var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
      var image = inputs.image;
      var radians = attrs.radians, fillValue = attrs.fillValue, center = attrs.center;
      var out = backend.makeOutput(image.shape, image.dtype);
      var imageId = backend.dataIdMap.get(image.dataId).id;
      var outId = backend.dataIdMap.get(out.dataId).id;
      var _a = image.shape, batch = _a[0], imageHeight = _a[1], imageWidth = _a[2], numChannels = _a[3];
      var _b = tfjsCore.backend_util.getImageCenter(center, imageHeight, imageWidth), centerX = _b[0], centerY = _b[1];
      var fillIsBlack = fillValue === 0;
      var fullOpacityValue = 255;
      var fillValues = typeof fillValue === 'number' ?
          [fillValue, fillValue, fillValue, fillIsBlack ? 0 : fullOpacityValue] : fillValue.concat([fullOpacityValue]);
      var fillBytes = new Uint8Array(new Int32Array(fillValues).buffer);
      wasmRotate(imageId, batch, imageHeight, imageWidth, numChannels, radians, centerX, centerY, fillBytes, fillValues.length, outId);
      return out;
  }
  var rotateWithOffsetConfig = {
      kernelName: tfjsCore.RotateWithOffset,
      backendName: 'wasm',
      kernelFunc: rotateWithOffset,
      setupFunc: setup$y
  };

  /**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var roundConfig = createUnaryKernelConfig(tfjsCore.Round);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var rsqrtConfig = createUnaryKernelConfig(tfjsCore.Rsqrt);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmScatterNd;
  function setup$z(backend) {
      wasmScatterNd = backend.wasm.cwrap(tfjsCore.ScatterNd, null /*void*/, [
          'number',
          'number',
          'number',
          'number',
          'number',
          'number',
          'array',
          'number',
          'number' // outId
      ]);
  }
  function scatterNd(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var indices = inputs.indices, updates = inputs.updates;
      var shape = attrs.shape;
      var out = backend.makeOutput(shape, updates.dtype);
      if (tfjsCore.util.sizeFromShape(shape) === 0) {
          return out;
      }
      var _a = tfjsCore.scatter_util.calculateShapes(updates, indices, shape), sliceRank = _a.sliceRank, numUpdates = _a.numUpdates, sliceSize = _a.sliceSize, strides = _a.strides, outputSize = _a.outputSize;
      var indicesData = backend.dataIdMap.get(indices.dataId);
      var indicesId = indicesData.id;
      var updatesData = backend.dataIdMap.get(updates.dataId);
      var updatesId = updatesData.id;
      var stridesBytes = new Uint8Array(new Int32Array(strides).buffer);
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmScatterNd(indicesId, updatesId, CppDType[updates.dtype], sliceRank, numUpdates, sliceSize, stridesBytes, outputSize, outId);
      return out;
  }
  var scatterNdConfig = {
      kernelName: tfjsCore.ScatterNd,
      backendName: 'wasm',
      setupFunc: setup$z,
      kernelFunc: scatterNd
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmSelect;
  function setup$A(backend) {
      wasmSelect = backend.wasm.cwrap('SelectV2', null, [
          'number',
          'number',
          'number',
          'number',
          'number',
      ]);
  }
  function select(args) {
      var inputs = args.inputs, backend = args.backend;
      var condition = inputs.condition, t = inputs.t, e = inputs.e;
      var conditionId = backend.dataIdMap.get(condition.dataId).id;
      var tId = backend.dataIdMap.get(t.dataId).id;
      var eId = backend.dataIdMap.get(e.dataId).id;
      var out = backend.makeOutput(t.shape, t.dtype);
      var outId = backend.dataIdMap.get(out.dataId).id;
      var cRank = condition.shape.length;
      var tRank = t.shape.length;
      var offset = cRank === 0 || cRank > 1 || tRank === 1 ?
          1 :
          tfjsCore.util.sizeFromShape(t.shape.slice(1));
      wasmSelect(conditionId, tId, eId, offset, outId);
      return out;
  }
  var selectConfig = {
      kernelName: tfjsCore.Select,
      backendName: 'wasm',
      kernelFunc: select,
      setupFunc: setup$A
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmFunc$6;
  function setup$B(backend) {
      wasmFunc$6 = backend.wasm.cwrap(tfjsCore.Sigmoid, null /* void */, ['number', 'number']);
  }
  function sigmoid(args) {
      var backend = args.backend, x = args.inputs.x;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var out = backend.makeOutput(x.shape, x.dtype);
      var outId = backend.dataIdMap.get(out.dataId).id;
      // Short-circuit zero-sized tensors.
      if (tfjsCore.util.sizeFromShape(out.shape) === 0) {
          return out;
      }
      wasmFunc$6(xId, outId);
      return out;
  }
  var sigmoidConfig = {
      kernelName: 'Sigmoid',
      backendName: 'wasm',
      setupFunc: setup$B,
      kernelFunc: sigmoid
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var sinConfig = createUnaryKernelConfig(tfjsCore.Sin);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function slice(args) {
      var x = args.inputs.x, _a = args.attrs, begin = _a.begin, size = _a.size, backend = args.backend;
      var _b = tfjsCore.slice_util.parseSliceParams(x, begin, size), begin_ = _b[0], size_ = _b[1];
      var isContinous = tfjsCore.slice_util.isSliceContinous(x.shape, begin_, size_);
      var xVals = backend.readSync(x.dataId);
      var out = backend.makeOutput(size_, x.dtype);
      var xStrides = tfjsCore.util.computeStrides(x.shape);
      var outData = backend.dataIdMap.get(out.dataId);
      if (isContinous) {
          var flatOffset = tfjsCore.slice_util.computeFlatOffset(begin_, xStrides);
          if (x.dtype === 'string') {
              outData.stringBytes =
                  xVals
                      .slice(flatOffset, flatOffset + tfjsCore.util.sizeFromShape(size_));
          }
          else {
              var outVals_1 = backend.typedArrayFromHeap(out);
              outVals_1.set(xVals
                  .subarray(flatOffset, flatOffset + tfjsCore.util.sizeFromShape(size_)));
          }
          return out;
      }
      if (x.dtype === 'string') {
          var res = sliceImpl(xVals, begin_, size_, x.shape, x.dtype);
          outData.stringBytes = res;
          return out;
      }
      var outVals = backend.typedArrayFromHeap(out);
      var rank = x.shape.length;
      if (rank === 2) {
          slice2d(xVals, xStrides[0], outVals, begin_, size_);
      }
      else if (rank === 3) {
          slice3d(xVals, xStrides[0], xStrides[1], outVals, begin_, size_);
      }
      else if (rank === 4) {
          slice4d(xVals, xStrides[0], xStrides[1], xStrides[2], outVals, begin_, size_);
      }
      else {
          var res = sliceImpl(xVals, begin_, size_, x.shape, x.dtype);
          outVals.set(res);
      }
      return out;
  }
  function slice2d(xVals, xStride, outVals, begin, size) {
      var outOffset = 0;
      var beginI = begin[0];
      var beginJ = begin[1];
      var endI = beginI + size[0];
      for (var i = beginI; i < endI; i++) {
          var xOffset = i * xStride + beginJ;
          outVals.set(xVals.subarray(xOffset, xOffset + size[1]), outOffset);
          outOffset += size[1];
      }
  }
  function slice3d(xVals, xStride1, xStride2, outVals, begin, size) {
      var outOffset = 0;
      var beginI = begin[0];
      var beginJ = begin[1];
      var beginK = begin[2];
      var endI = beginI + size[0];
      var endJ = beginJ + size[1];
      for (var i = beginI; i < endI; i++) {
          for (var j = beginJ; j < endJ; j++) {
              var xOffset = i * xStride1 + j * xStride2 + beginK;
              outVals.set(xVals.subarray(xOffset, xOffset + size[2]), outOffset);
              outOffset += size[2];
          }
      }
  }
  function slice4d(xVals, xStride1, xStride2, xStride3, outVals, begin, size) {
      var outOffset = 0;
      var beginI = begin[0];
      var beginJ = begin[1];
      var beginK = begin[2];
      var endI = beginI + size[0];
      var endJ = beginJ + size[1];
      var endK = beginK + size[2];
      var beginL = begin[3];
      for (var i = beginI; i < endI; i++) {
          for (var j = beginJ; j < endJ; j++) {
              for (var k = beginK; k < endK; k++) {
                  var xOffset = i * xStride1 + j * xStride2 + k * xStride3 + beginL;
                  outVals.set(xVals.subarray(xOffset, xOffset + size[3]), outOffset);
                  outOffset += size[3];
              }
          }
      }
  }
  var sliceConfig = {
      kernelName: tfjsCore.Slice,
      backendName: 'wasm',
      kernelFunc: slice,
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmFunc$7;
  function setup$C(backend) {
      wasmFunc$7 = backend.wasm.cwrap(tfjsCore.Softmax, null /* void */, [
          'number',
          'number',
          'number',
          'number' // batch
      ]);
  }
  function softmax(args) {
      var backend = args.backend, logits = args.inputs.logits, dim = args.attrs.dim;
      var xId = backend.dataIdMap.get(logits.dataId).id;
      var out = backend.makeOutput(logits.shape, logits.dtype);
      var outId = backend.dataIdMap.get(out.dataId).id;
      var channels = logits.shape[dim];
      var batch = tfjsCore.util.sizeFromShape(logits.shape) / channels;
      // Short-circuit zero-sized tensors.
      if (tfjsCore.util.sizeFromShape(out.shape) === 0) {
          return out;
      }
      wasmFunc$7(xId, outId, channels, batch);
      return out;
  }
  var softmaxConfig = {
      kernelName: tfjsCore.Softmax,
      backendName: 'wasm',
      setupFunc: setup$C,
      kernelFunc: softmax
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function splitV(args) {
      var inputs = args.inputs, attrs = args.attrs, backend = args.backend;
      var x = inputs.x;
      var numOrSizeSplits = attrs.numOrSizeSplits, axis = attrs.axis;
      var $axis = tfjsCore.util.parseAxisParam(axis, x.shape)[0];
      var splitSizes = tfjsCore.backend_util.prepareSplitSize(x, numOrSizeSplits, $axis);
      var begin = new Array(x.shape.length).fill(0);
      var size = x.shape.slice();
      return splitSizes.map(function (s) {
          var xSliceSize = size.slice();
          xSliceSize[$axis] = s;
          var xSlice = slice({ inputs: { x: x }, attrs: { begin: begin, size: xSliceSize }, backend: backend });
          begin[$axis] += s;
          return xSlice;
      });
  }
  var splitVConfig = {
      kernelName: tfjsCore.SplitV,
      backendName: 'wasm',
      kernelFunc: splitV
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var sqrtConfig = createUnaryKernelConfig(tfjsCore.Sqrt);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var squareConfig = createUnaryKernelConfig(tfjsCore.Square);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast$e = true;
  var squaredDifferenceConfig = createBinaryKernelConfig(tfjsCore.SquaredDifference, supportsFullBroadcast$e);

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmStep;
  function setup$D(backend) {
      wasmStep = backend.wasm.cwrap(tfjsCore.Step, null /*void*/, [
          'number',
          'number',
          'number',
      ]);
  }
  function step(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var alpha = attrs.alpha;
      var x = inputs.x;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var out = backend.makeOutput(x.shape, x.dtype);
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmStep(xId, alpha, outId);
      return out;
  }
  var stepConfig = {
      kernelName: tfjsCore.Step,
      backendName: 'wasm',
      setupFunc: setup$D,
      kernelFunc: step
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmStridedSlice;
  function setup$E(backend) {
      wasmStridedSlice = backend.wasm.cwrap(tfjsCore.StridedSlice, null /*void*/, [
          'number',
          'array',
          'number',
          'array',
          'array',
          'array',
          'array',
          'array',
          'number',
          'number',
      ]);
  }
  function stridedSlice(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var x = inputs.x;
      var begin = attrs.begin, end = attrs.end, strides = attrs.strides;
      if (strides == null) {
          strides = new Array(begin.length);
      }
      var beginMask = attrs.beginMask, endMask = attrs.endMask, ellipsisMask = attrs.ellipsisMask, newAxisMask = attrs.newAxisMask, shrinkAxisMask = attrs.shrinkAxisMask;
      var ellipsisAxes = tfjsCore.backend_util.slice_util.maskToAxes(ellipsisMask);
      if (ellipsisAxes.length > 1) {
          throw new Error('Multiple ellipses in slice is not allowed.');
      }
      if (ellipsisMask !== 0 && newAxisMask !== 0) {
          throw new Error('Using both ellipsisMask and newAxisMask is not yet supported.');
      }
      if (ellipsisMask !== 0 && shrinkAxisMask !== 0) {
          throw new Error('Using both ellipsisMask and shrinkAxisMask is not yet supported.');
      }
      var numInterpolatedAxes = x.shape.length - begin.length;
      // Expand the dims of x based on the newAxisMask.
      var expandAxes = tfjsCore.backend_util.slice_util.maskToAxes(newAxisMask);
      var newShape = x.shape.slice();
      expandAxes.forEach(function (axis) {
          begin[axis] = 0;
          end[axis] = 1;
          newShape.splice(axis, 0, 1);
      });
      var xReshaped = reshape({ inputs: { x: x }, attrs: { shape: newShape }, backend: backend });
      var _a = tfjsCore.backend_util.slice_util.getNormalizedAxes(xReshaped.shape, ellipsisAxes, numInterpolatedAxes, begin, end, strides, beginMask, endMask, ellipsisMask), normalizedBegin = _a.begin, normalizedEnd = _a.end, normalizedStrides = _a.strides;
      begin = normalizedBegin;
      end = normalizedEnd;
      strides = normalizedStrides;
      var shrinkAxes = tfjsCore.backend_util.slice_util.maskToAxes(shrinkAxisMask);
      // Adjust the ends based on the shrink mask.
      shrinkAxes.forEach(function (axis) {
          end[axis] = begin[axis] + 1;
          strides[axis] = 1;
      });
      // Figure out the output shape.
      var size = tfjsCore.backend_util.slice_util.computeOutShape(begin, end, strides);
      // Remove the axes based on shrinkMask.
      var outShape = size.filter(function (_, axis) { return shrinkAxes.indexOf(axis) === -1; });
      var nonStrided = strides.every(function (v) { return v === 1; });
      if (nonStrided) {
          var xSliced = slice({ inputs: { x: xReshaped }, attrs: { begin: begin, size: size }, backend: backend });
          backend.disposeData(xReshaped.dataId);
          var reshaped_1 = reshape({ inputs: { x: xSliced }, attrs: { shape: outShape }, backend: backend });
          backend.disposeData(xSliced.dataId);
          return reshaped_1;
      }
      var out = backend.makeOutput(outShape, 'float32');
      if (!outShape.some(function (axis) { return axis === 0; })) {
          var xId = backend.dataIdMap.get(xReshaped.dataId).id;
          var xStridesBytes = new Uint8Array(new Int32Array(tfjsCore.util.computeStrides(xReshaped.shape)).buffer);
          var beginBytes = new Uint8Array(new Int32Array(begin).buffer);
          var endBytes = new Uint8Array(new Int32Array(end).buffer);
          var stridesBytes = new Uint8Array(new Int32Array(strides).buffer);
          var outputShapeBytes = new Uint8Array(new Int32Array(outShape).buffer);
          var outStridesBytes = new Uint8Array(new Int32Array(tfjsCore.util.computeStrides(outShape)).buffer);
          var outId = backend.dataIdMap.get(out.dataId).id;
          wasmStridedSlice(xId, xStridesBytes, xReshaped.shape.length, beginBytes, endBytes, stridesBytes, outputShapeBytes, outStridesBytes, outShape.length, outId);
      }
      backend.disposeData(xReshaped.dataId);
      var reshaped = reshape({ inputs: { x: out }, attrs: { shape: outShape }, backend: backend });
      backend.disposeData(out.dataId);
      return reshaped;
  }
  var stridedSliceConfig = {
      kernelName: tfjsCore.StridedSlice,
      backendName: 'wasm',
      setupFunc: setup$E,
      kernelFunc: stridedSlice
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var supportsFullBroadcast$f = true;
  var subConfig = createBinaryKernelConfig(tfjsCore.Sub, supportsFullBroadcast$f);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmSum;
  function setup$F(backend) {
      wasmSum = backend.wasm.cwrap(tfjsCore.Sum, null /*void*/, ['number, number, number']);
  }
  function sum(args) {
      var backend = args.backend, inputs = args.inputs, attrs = args.attrs;
      var axis = attrs.axis, keepDims = attrs.keepDims;
      var x = inputs.x;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var inputId = xId;
      var input = x;
      var _a = permuteAxesAndTranspose(x, axis, backend), transposed = _a.transposed, axes = _a.axes, originalAxes = _a.originalAxes, inputWasTransposed = _a.inputWasTransposed;
      var reductionAxes = axes;
      if (inputWasTransposed) {
          var transposedId = backend.dataIdMap.get(transposed.dataId).id;
          if (transposedId !== xId) {
              // transpose was not a no-op. We will need to dispose of this
              // once we are done.
              input = transposed;
              inputId = transposedId;
              reductionAxes = tfjsCore.backend_util.getInnerMostAxes(reductionAxes.length, input.shape.length);
          }
      }
      tfjsCore.backend_util.assertAxesAreInnerMostDims('sum', reductionAxes, input.shape.length);
      var _b = tfjsCore.backend_util.computeOutAndReduceShapes(input.shape, reductionAxes), outShape = _b[0], reduceShape = _b[1];
      var reduceSize = tfjsCore.util.sizeFromShape(reduceShape);
      var out = backend.makeOutput(outShape, input.dtype);
      if (tfjsCore.util.sizeFromShape(input.shape) !== 0) {
          var outId = backend.dataIdMap.get(out.dataId).id;
          wasmSum(inputId, reduceSize, outId);
      }
      if (inputWasTransposed) {
          // dispose of the transposed tensor.
          backend.disposeData(transposed.dataId);
      }
      if (keepDims) {
          // reshape
          var newShape = tfjsCore.backend_util.expandShapeToKeepDim(out.shape, originalAxes);
          out.shape = newShape;
      }
      return out;
  }
  var sumConfig = {
      kernelName: tfjsCore.Sum,
      backendName: 'wasm',
      setupFunc: setup$F,
      kernelFunc: sum
  };

  /**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var tanConfig = createUnaryKernelConfig(tfjsCore.Tan);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var tanhConfig = createUnaryKernelConfig(tfjsCore.Tanh);

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmTile;
  function setup$G(backend) {
      wasmTile = backend.wasm.cwrap(tfjsCore.Tile, null /* void */, [
          'number',
          'array',
          'number',
          'array',
          'number',
          'number' // out_id
      ]);
  }
  function tile(args) {
      var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
      var x = inputs.x;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var reps = attrs.reps;
      var newShape = new Array(x.shape.length);
      for (var i = 0; i < newShape.length; i++) {
          newShape[i] = x.shape[i] * reps[i];
      }
      var xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
      var newShapeBytes = new Uint8Array(new Int32Array(newShape).buffer);
      var out = backend.makeOutput(newShape, x.dtype);
      var outId = backend.dataIdMap.get(out.dataId).id;
      wasmTile(xId, xShapeBytes, x.shape.length, newShapeBytes, newShape.length, CppDType[out.dtype], outId);
      return out;
  }
  var tileConfig = {
      kernelName: tfjsCore.Tile,
      backendName: 'wasm',
      setupFunc: setup$G,
      kernelFunc: tile
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var wasmTopK;
  function setup$H(backend) {
      wasmTopK = backend.wasm.cwrap(tfjsCore.TopK, null /* void */, [
          'number',
          'array',
          'number',
          'number',
          'number',
          'bool',
          'number',
          'number',
      ]);
  }
  var topk = function (_a) {
      var inputs = _a.inputs, backend = _a.backend, attrs = _a.attrs;
      var x = inputs.x;
      var k = attrs.k, sorted = attrs.sorted;
      var xId = backend.dataIdMap.get(x.dataId).id;
      var xShapeBytes = new Uint8Array(new Int32Array(x.shape).buffer);
      var outputShape = x.shape.slice();
      outputShape[outputShape.length - 1] = k;
      var outValues = backend.makeOutput(outputShape, x.dtype);
      var outValuesId = backend.dataIdMap.get(outValues.dataId).id;
      var outIndices = backend.makeOutput(outputShape, 'int32');
      var outIndicesId = backend.dataIdMap.get(outIndices.dataId).id;
      wasmTopK(xId, xShapeBytes, x.shape.length, CppDType[x.dtype], k, sorted, outValuesId, outIndicesId);
      return [outValues, outIndices];
  };
  var topKConfig = {
      kernelName: tfjsCore.TopK,
      backendName: 'wasm',
      setupFunc: setup$H,
      kernelFunc: topk,
  };

  /**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function unpack(args) {
      var inputs = args.inputs, backend = args.backend, attrs = args.attrs;
      var value = inputs.value;
      var axis = attrs.axis;
      if (axis < 0) {
          axis += value.shape.length;
      }
      var numOutputs = value.shape[axis];
      var rank = value.shape.length;
      var outShape = new Array(rank - 1);
      var outIndex = 0;
      for (var i = 0; i < rank; i++) {
          if (i !== axis) {
              outShape[outIndex++] = value.shape[i];
          }
      }
      var outs = new Array(numOutputs);
      var begin = new Array(rank).fill(0);
      var size = value.shape.slice();
      size[axis] = 1;
      for (var i = 0; i < outs.length; i++) {
          begin[axis] = i;
          outs[i] = slice({ inputs: { x: value }, attrs: { begin: begin, size: size }, backend: backend });
      }
      return outs.map(function (_a) {
          var dataId = _a.dataId, dtype = _a.dtype;
          return ({ dataId: dataId, dtype: dtype, shape: outShape });
      });
  }
  var unpackConfig = {
      kernelName: tfjsCore.Unpack,
      backendName: 'wasm',
      kernelFunc: unpack,
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  function zerosLike(args) {
      var x = args.inputs.x, backend = args.backend;
      var out = backend.makeOutput(x.shape, x.dtype);
      var outVals = backend.typedArrayFromHeap(out);
      outVals.fill(0);
      return out;
  }
  var zerosLikeConfig = {
      kernelName: tfjsCore.ZerosLike,
      backendName: 'wasm',
      kernelFunc: zerosLike,
  };

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  // List all kernel configs here
  var kernelConfigs = [
      absConfig,
      addConfig,
      addNConfig,
      allConfig,
      anyConfig,
      argMaxConfig,
      avgPoolConfig,
      batchMatMulConfig,
      castConfig,
      ceilConfig,
      clipByValueConfig,
      concatConfig,
      conv2DConfig,
      conv2DBackpropInputConfig,
      cosConfig,
      cropAndResizeConfig,
      cumsumConfig,
      depthToSpaceConfig,
      depthwiseConv2dNativeConfig,
      equalConfig,
      expConfig,
      expandDimsConfig,
      fillConfig,
      flipLeftRightConfig,
      floorConfig,
      floorDivConfig,
      fusedMatMulConfig,
      fusedBatchNormConfig,
      fusedConv2DConfig,
      fusedDepthwiseConv2DConfig,
      gatherNdConfig,
      gatherV2Config,
      greaterConfig,
      greaterEqualConfig,
      identityConfig,
      leakyReluConfig,
      lessConfig,
      lessEqualConfig,
      logConfig,
      logicalAndConfig,
      maxConfig,
      maximumConfig,
      maxPoolConfig,
      meanConfig,
      minConfig,
      minimumConfig,
      mirrorPadConfig,
      multiplyConfig,
      negConfig,
      nonMaxSuppressionV3Config,
      nonMaxSuppressionV4Config,
      nonMaxSuppressionV5Config,
      notEqualConfig,
      oneHotConfig,
      onesLikeConfig,
      packConfig,
      padV2Config,
      powConfig,
      preluConfig,
      prodConfig,
      rangeConfig,
      realDivConfig,
      reluConfig,
      relu6Config,
      reshapeConfig,
      resizeBilinearConfig,
      reverseConfig,
      rotateWithOffsetConfig,
      rsqrtConfig,
      roundConfig,
      scatterNdConfig,
      selectConfig,
      sigmoidConfig,
      sinConfig,
      sliceConfig,
      softmaxConfig,
      splitVConfig,
      sqrtConfig,
      squareConfig,
      squaredDifferenceConfig,
      stepConfig,
      stridedSliceConfig,
      subConfig,
      sumConfig,
      tanConfig,
      tanhConfig,
      tileConfig,
      topKConfig,
      transposeConfig,
      unpackConfig,
      zerosLikeConfig
  ];
  for (var _i = 0, kernelConfigs_1 = kernelConfigs; _i < kernelConfigs_1.length; _i++) {
      var kernelConfig = kernelConfigs_1[_i];
      tfjsCore.registerKernel(kernelConfig);
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
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
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var _this = undefined;
  var ENV = tfjsCore.env();
  /**
   * True if SIMD is supported.
   */
  // From: https://github.com/GoogleChromeLabs/wasm-feature-detect
  ENV.registerFlag(
  // This typed array passed in to WebAssembly.validate is WebAssembly binary
  // code. In this case it is a small program that contains SIMD
  // instructions.
  'WASM_HAS_SIMD_SUPPORT', function () { return __awaiter(_this, void 0, void 0, function () {
      return __generator(this, function (_a) {
          return [2 /*return*/, WebAssembly.validate(new Uint8Array([
                  0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3,
                  2, 1, 0, 10, 9, 1, 7, 0, 65, 0, 253, 15, 26, 11
              ]))];
      });
  }); });
  /**
   * True if threads are supported.
   */
  // From: https://github.com/GoogleChromeLabs/wasm-feature-detect
  ENV.registerFlag('WASM_HAS_MULTITHREAD_SUPPORT', function () { return __awaiter(_this, void 0, void 0, function () {
      return __generator(this, function (_a) {
          // TODO(annxingyuan): Enable node support once this is resolved:
          // https://github.com/tensorflow/tfjs/issues/3830
          if (ENV.get('IS_NODE')) {
              return [2 /*return*/, false];
          }
          try {
              // Test for transferability of SABs (needed for Firefox)
              // https://groups.google.com/forum/#!msg/mozilla.dev.platform/IHkBZlHETpA/dwsMNchWEQAJ
              new MessageChannel().port1.postMessage(new SharedArrayBuffer(1));
              // This typed array is a WebAssembly program containing threaded
              // instructions.
              return [2 /*return*/, WebAssembly.validate(new Uint8Array([
                      0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5,
                      4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11
                  ]))];
          }
          catch (e) {
              return [2 /*return*/, false];
          }
          return [2 /*return*/];
      });
  }); });

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var tfjsBackendWasmThreadedSimd = createCommonjsModule(function (module, exports) {
  var WasmBackendModuleThreadedSimd = (function() {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
    return (
  function(WasmBackendModuleThreadedSimd) {
    WasmBackendModuleThreadedSimd = WasmBackendModuleThreadedSimd || {};

  function GROWABLE_HEAP_I8(){if(wasmMemory.buffer!=buffer){updateGlobalBufferAndViews(wasmMemory.buffer);}return HEAP8}function GROWABLE_HEAP_U8(){if(wasmMemory.buffer!=buffer){updateGlobalBufferAndViews(wasmMemory.buffer);}return HEAPU8}function GROWABLE_HEAP_I32(){if(wasmMemory.buffer!=buffer){updateGlobalBufferAndViews(wasmMemory.buffer);}return HEAP32}function GROWABLE_HEAP_U32(){if(wasmMemory.buffer!=buffer){updateGlobalBufferAndViews(wasmMemory.buffer);}return HEAPU32}function GROWABLE_HEAP_F64(){if(wasmMemory.buffer!=buffer){updateGlobalBufferAndViews(wasmMemory.buffer);}return HEAPF64}var Module=typeof WasmBackendModuleThreadedSimd!=="undefined"?WasmBackendModuleThreadedSimd:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject;});var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key];}}var arguments_=[];var thisProgram="./this.program";var quit_=function(status,toThrow){throw toThrow};var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;var ENVIRONMENT_IS_SHELL=false;ENVIRONMENT_IS_WEB=typeof window==="object";ENVIRONMENT_IS_WORKER=typeof importScripts==="function";ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof process.versions==="object"&&typeof process.versions.node==="string";ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;var ENVIRONMENT_IS_PTHREAD=Module["ENVIRONMENT_IS_PTHREAD"]||false;if(ENVIRONMENT_IS_PTHREAD){buffer=Module["buffer"];}var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary;var nodeFS;var nodePath;if(ENVIRONMENT_IS_NODE){if(ENVIRONMENT_IS_WORKER){scriptDirectory=path.dirname(scriptDirectory)+"/";}else {scriptDirectory=__dirname+"/";}read_=function shell_read(filename,binary){if(!nodeFS)nodeFS=fs;if(!nodePath)nodePath=path;filename=nodePath["normalize"](filename);return nodeFS["readFileSync"](filename,binary?null:"utf8")};readBinary=function readBinary(filename){var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret);}assert(ret.buffer);return ret};if(process["argv"].length>1){thisProgram=process["argv"][1].replace(/\\/g,"/");}arguments_=process["argv"].slice(2);process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",abort);quit_=function(status){process["exit"](status);};Module["inspect"]=function(){return "[Emscripten Module object]"};var nodeWorkerThreads;try{nodeWorkerThreads=worker_threads;}catch(e){console.error('The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?');throw e}commonjsGlobal.Worker=nodeWorkerThreads.Worker;}else if(ENVIRONMENT_IS_SHELL){if(typeof read!="undefined"){read_=function shell_read(f){return read(f)};}readBinary=function readBinary(f){var data;if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}data=read(f,"binary");assert(typeof data==="object");return data};if(typeof scriptArgs!="undefined"){arguments_=scriptArgs;}else if(typeof arguments!="undefined"){arguments_=arguments;}if(typeof quit==="function"){quit_=function(status){quit(status);};}if(typeof print!=="undefined"){if(typeof console==="undefined")console={};console.log=print;console.warn=console.error=typeof printErr!=="undefined"?printErr:print;}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href;}else if(typeof document!=="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src;}if(typeof _scriptDir !== "undefined" && _scriptDir){scriptDirectory=_scriptDir;}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1);}else {scriptDirectory="";}if(ENVIRONMENT_IS_NODE){read_=function shell_read(filename,binary){if(!nodeFS)nodeFS=fs;if(!nodePath)nodePath=path;filename=nodePath["normalize"](filename);return nodeFS["readFileSync"](filename,binary?null:"utf8")};readBinary=function readBinary(filename){var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret);}assert(ret.buffer);return ret};}else {read_=function(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=function(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)};}readAsync=function(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror();};xhr.onerror=onerror;xhr.send(null);};}}if(ENVIRONMENT_IS_NODE){if(typeof performance==="undefined"){commonjsGlobal.performance=perf_hooks.performance;}}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key];}}moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime=Module["noExitRuntime"]||true;if(typeof WebAssembly!=="object"){abort("no native wasm support detected");}var wasmMemory;var wasmModule;var ABORT=false;function assert(condition,text){if(!condition){abort("Assertion failed: "+text);}}function getCFunc(ident){var func=Module["_"+ident];assert(func,"Cannot call unknown function "+ident+", make sure it is exported");return func}function ccall(ident,returnType,argTypes,args,opts){var toC={"string":function(str){var ret=0;if(str!==null&&str!==undefined&&str!==0){var len=(str.length<<2)+1;ret=stackAlloc(len);stringToUTF8(str,ret,len);}return ret},"array":function(arr){var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string")return UTF8ToString(ret);if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i]);}else {cArgs[i]=args[i];}}}var ret=func.apply(null,cArgs);ret=convertReturnValue(ret);if(stack!==0)stackRestore(stack);return ret}function cwrap(ident,returnType,argTypes,opts){argTypes=argTypes||[];var numericArgs=argTypes.every(function(type){return type==="number"});var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return function(){return ccall(ident,returnType,argTypes,arguments)}}function UTF8ArrayToString(heap,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var str="";while(!(idx>=endIdx)){var u0=heap[idx++];if(!u0)return str;if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heap[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heap[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2;}else {u0=(u0&7)<<18|u1<<12|u2<<6|heap[idx++]&63;}if(u0<65536){str+=String.fromCharCode(u0);}else {var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023);}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(GROWABLE_HEAP_U8(),ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023;}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u;}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63;}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;}else {if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;}}heap[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,GROWABLE_HEAP_U8(),outPtr,maxBytesToWrite)}function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127)++len;else if(u<=2047)len+=2;else if(u<=65535)len+=3;else len+=4;}return len}function writeArrayToMemory(array,buffer){GROWABLE_HEAP_I8().set(array,buffer);}function alignUp(x,multiple){if(x%multiple>0){x+=multiple-x%multiple;}return x}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf);}var INITIAL_MEMORY=Module["INITIAL_MEMORY"]||16777216;if(ENVIRONMENT_IS_PTHREAD){wasmMemory=Module["wasmMemory"];buffer=Module["buffer"];}else {if(Module["wasmMemory"]){wasmMemory=Module["wasmMemory"];}else {wasmMemory=new WebAssembly.Memory({"initial":INITIAL_MEMORY/65536,"maximum":2147483648/65536,"shared":true});if(!(wasmMemory.buffer instanceof SharedArrayBuffer)){err("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag");if(ENVIRONMENT_IS_NODE){console.log("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and also use a recent version)");}throw Error("bad memory")}}}if(wasmMemory){buffer=wasmMemory.buffer;}INITIAL_MEMORY=buffer.byteLength;updateGlobalBufferAndViews(buffer);var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATPOSTRUN__=[];if(!ENVIRONMENT_IS_PTHREAD)__ATINIT__.push({func:function(){___wasm_call_ctors();}});function preRun(){if(ENVIRONMENT_IS_PTHREAD)return;if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift());}}callRuntimeCallbacks(__ATPRERUN__);}function initRuntime(){if(ENVIRONMENT_IS_PTHREAD)return;callRuntimeCallbacks(__ATINIT__);}function preMain(){if(ENVIRONMENT_IS_PTHREAD)return;callRuntimeCallbacks(__ATMAIN__);}function postRun(){if(ENVIRONMENT_IS_PTHREAD)return;if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift());}}callRuntimeCallbacks(__ATPOSTRUN__);}function addOnPreRun(cb){__ATPRERUN__.unshift(cb);}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb);}var runDependencies=0;var dependenciesFulfilled=null;function addRunDependency(id){assert(!ENVIRONMENT_IS_PTHREAD,"addRunDependency cannot be used in a pthread worker");runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}if(runDependencies==0){if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback();}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};function abort(what){if(Module["onAbort"]){Module["onAbort"](what);}if(ENVIRONMENT_IS_PTHREAD)console.error("Pthread aborting at "+(new Error).stack);what+="";err(what);ABORT=true;what="abort("+what+"). Build with -s ASSERTIONS=1 for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}function hasPrefix(str,prefix){return String.prototype.startsWith?str.startsWith(prefix):str.indexOf(prefix)===0}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return hasPrefix(filename,dataURIPrefix)}var fileURIPrefix="file://";function isFileURI(filename){return hasPrefix(filename,fileURIPrefix)}var wasmBinaryFile="tfjs-backend-wasm-threaded-simd.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile);}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}else {throw "both async and sync fetching of the wasm failed"}}catch(err){abort(err);}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch==="function"&&!isFileURI(wasmBinaryFile)){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw "failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}else {if(readAsync){return new Promise(function(resolve,reject){readAsync(wasmBinaryFile,function(response){resolve(new Uint8Array(response));},reject);})}}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmTable=Module["asm"]["F"];wasmModule=module;if(!ENVIRONMENT_IS_PTHREAD){var numWorkersToLoad=PThread.unusedWorkers.length;PThread.unusedWorkers.forEach(function(w){PThread.loadWasmModuleToWorker(w,function(){if(!--numWorkersToLoad)removeRunDependency();});});}}if(!ENVIRONMENT_IS_PTHREAD){addRunDependency();}function receiveInstantiatedSource(output){receiveInstance(output["instance"],output["module"]);}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason);})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&!isFileURI(wasmBinaryFile)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiatedSource,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiatedSource)})})}else {return instantiateArrayBuffer(receiveInstantiatedSource)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync().catch(readyPromiseReject);return {}}var ASM_CONSTS={9816:function(){throw "Canceled!"},9834:function($0,$1){setTimeout(function(){__emscripten_do_dispatch_to_thread($0,$1);},0);}};function initPthreadsJS(){PThread.initRuntime();}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback(Module);continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){wasmTable.get(func)();}else {wasmTable.get(func)(callback.arg);}}else {func(callback.arg===undefined?null:callback.arg);}}}function _emscripten_futex_wake(addr,count){if(addr<=0||addr>GROWABLE_HEAP_I8().length||addr&3!=0||count<0)return -28;if(count==0)return 0;if(count>=2147483647)count=Infinity;var mainThreadWaitAddress=Atomics.load(GROWABLE_HEAP_I32(),__emscripten_main_thread_futex>>2);var mainThreadWoken=0;if(mainThreadWaitAddress==addr){var loadedAddr=Atomics.compareExchange(GROWABLE_HEAP_I32(),__emscripten_main_thread_futex>>2,mainThreadWaitAddress,0);if(loadedAddr==mainThreadWaitAddress){--count;mainThreadWoken=1;if(count<=0)return 1}}var ret=Atomics.notify(GROWABLE_HEAP_I32(),addr>>2,count);if(ret>=0)return ret+mainThreadWoken;throw "Atomics.notify returned an unexpected value "+ret}Module["_emscripten_futex_wake"]=_emscripten_futex_wake;function killThread(pthread_ptr){if(ENVIRONMENT_IS_PTHREAD)throw "Internal Error! killThread() can only ever be called from main application thread!";if(!pthread_ptr)throw "Internal Error! Null pthread_ptr in killThread!";GROWABLE_HEAP_I32()[pthread_ptr+12>>2]=0;var pthread=PThread.pthreads[pthread_ptr];pthread.worker.terminate();PThread.freeThreadData(pthread);PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(pthread.worker),1);pthread.worker.pthread=undefined;}function cancelThread(pthread_ptr){if(ENVIRONMENT_IS_PTHREAD)throw "Internal Error! cancelThread() can only ever be called from main application thread!";if(!pthread_ptr)throw "Internal Error! Null pthread_ptr in cancelThread!";var pthread=PThread.pthreads[pthread_ptr];pthread.worker.postMessage({"cmd":"cancel"});}function cleanupThread(pthread_ptr){if(ENVIRONMENT_IS_PTHREAD)throw "Internal Error! cleanupThread() can only ever be called from main application thread!";if(!pthread_ptr)throw "Internal Error! Null pthread_ptr in cleanupThread!";var pthread=PThread.pthreads[pthread_ptr];if(pthread){GROWABLE_HEAP_I32()[pthread_ptr+12>>2]=0;var worker=pthread.worker;PThread.returnWorkerToPool(worker);}}var PThread={unusedWorkers:[],runningWorkers:[],initMainThreadBlock:function(){var pthreadPoolSize=Math.min(4,Math.max(1,(navigator.hardwareConcurrency||1)/2));for(var i=0;i<pthreadPoolSize;++i){PThread.allocateUnusedWorker();}},initRuntime:function(){var tb=_malloc(228);for(var i=0;i<228/4;++i)GROWABLE_HEAP_U32()[tb/4+i]=0;GROWABLE_HEAP_I32()[tb+12>>2]=tb;var headPtr=tb+152;GROWABLE_HEAP_I32()[headPtr>>2]=headPtr;var tlsMemory=_malloc(512);for(var i=0;i<128;++i)GROWABLE_HEAP_U32()[tlsMemory/4+i]=0;Atomics.store(GROWABLE_HEAP_U32(),tb+100>>2,tlsMemory);Atomics.store(GROWABLE_HEAP_U32(),tb+40>>2,tb);__emscripten_thread_init(tb,!ENVIRONMENT_IS_WORKER,1);_emscripten_register_main_browser_thread_id(tb);},initWorker:function(){},pthreads:{},threadExitHandlers:[],setThreadStatus:function(){},runExitHandlers:function(){while(PThread.threadExitHandlers.length>0){PThread.threadExitHandlers.pop()();}if(ENVIRONMENT_IS_PTHREAD&&_pthread_self())___pthread_tsd_run_dtors();},runExitHandlersAndDeinitThread:function(tb,exitCode){Atomics.store(GROWABLE_HEAP_U32(),tb+56>>2,1);Atomics.store(GROWABLE_HEAP_U32(),tb+60>>2,0);PThread.runExitHandlers();Atomics.store(GROWABLE_HEAP_U32(),tb+4>>2,exitCode);Atomics.store(GROWABLE_HEAP_U32(),tb+0>>2,1);_emscripten_futex_wake(tb+0,2147483647);__emscripten_thread_init(0,0,0);},threadExit:function(exitCode){var tb=_pthread_self();if(tb){PThread.runExitHandlersAndDeinitThread(tb,exitCode);if(ENVIRONMENT_IS_PTHREAD){postMessage({"cmd":"exit"});}}},threadCancel:function(){PThread.runExitHandlersAndDeinitThread(_pthread_self(),-1);postMessage({"cmd":"cancelDone"});},terminateAllThreads:function(){for(var t in PThread.pthreads){var pthread=PThread.pthreads[t];if(pthread&&pthread.worker){PThread.returnWorkerToPool(pthread.worker);}}PThread.pthreads={};for(var i=0;i<PThread.unusedWorkers.length;++i){var worker=PThread.unusedWorkers[i];worker.terminate();}PThread.unusedWorkers=[];for(var i=0;i<PThread.runningWorkers.length;++i){var worker=PThread.runningWorkers[i];var pthread=worker.pthread;PThread.freeThreadData(pthread);worker.terminate();}PThread.runningWorkers=[];},freeThreadData:function(pthread){if(!pthread)return;if(pthread.threadInfoStruct){var tlsMemory=GROWABLE_HEAP_I32()[pthread.threadInfoStruct+100>>2];GROWABLE_HEAP_I32()[pthread.threadInfoStruct+100>>2]=0;_free(tlsMemory);_free(pthread.threadInfoStruct);}pthread.threadInfoStruct=0;if(pthread.allocatedOwnStack&&pthread.stackBase)_free(pthread.stackBase);pthread.stackBase=0;if(pthread.worker)pthread.worker.pthread=null;},returnWorkerToPool:function(worker){PThread.runWithoutMainThreadQueuedCalls(function(){delete PThread.pthreads[worker.pthread.threadInfoStruct];PThread.unusedWorkers.push(worker);PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker),1);PThread.freeThreadData(worker.pthread);worker.pthread=undefined;});},runWithoutMainThreadQueuedCalls:function(func){GROWABLE_HEAP_I32()[__emscripten_allow_main_runtime_queued_calls>>2]=0;try{func();}finally{GROWABLE_HEAP_I32()[__emscripten_allow_main_runtime_queued_calls>>2]=1;}},receiveObjectTransfer:function(data){},loadWasmModuleToWorker:function(worker,onFinishedLoading){worker.onmessage=function(e){var d=e["data"];var cmd=d["cmd"];if(worker.pthread)PThread.currentProxiedOperationCallerThread=worker.pthread.threadInfoStruct;if(d["targetThread"]&&d["targetThread"]!=_pthread_self()){var thread=PThread.pthreads[d.targetThread];if(thread){thread.worker.postMessage(e.data,d["transferList"]);}else {console.error('Internal error! Worker sent a message "'+cmd+'" to target pthread '+d["targetThread"]+", but that thread no longer exists!");}PThread.currentProxiedOperationCallerThread=undefined;return}if(cmd==="processQueuedMainThreadWork"){_emscripten_main_thread_process_queued_calls();}else if(cmd==="spawnThread"){spawnThread(e.data);}else if(cmd==="cleanupThread"){cleanupThread(d["thread"]);}else if(cmd==="killThread"){killThread(d["thread"]);}else if(cmd==="cancelThread"){cancelThread(d["thread"]);}else if(cmd==="loaded"){worker.loaded=true;if(onFinishedLoading)onFinishedLoading(worker);if(worker.runPthread){worker.runPthread();delete worker.runPthread;}}else if(cmd==="print"){out("Thread "+d["threadId"]+": "+d["text"]);}else if(cmd==="printErr"){err("Thread "+d["threadId"]+": "+d["text"]);}else if(cmd==="alert"){alert("Thread "+d["threadId"]+": "+d["text"]);}else if(cmd==="exit"){var detached=worker.pthread&&Atomics.load(GROWABLE_HEAP_U32(),worker.pthread.threadInfoStruct+64>>2);if(detached){PThread.returnWorkerToPool(worker);}}else if(cmd==="exitProcess"){try{exit(d["returnCode"]);}catch(e){if(e instanceof ExitStatus)return;throw e}}else if(cmd==="cancelDone"){PThread.returnWorkerToPool(worker);}else if(cmd==="objectTransfer"){PThread.receiveObjectTransfer(e.data);}else if(e.data.target==="setimmediate"){worker.postMessage(e.data);}else {err("worker sent an unknown command "+cmd);}PThread.currentProxiedOperationCallerThread=undefined;};worker.onerror=function(e){err("pthread sent an error! "+e.filename+":"+e.lineno+": "+e.message);};if(ENVIRONMENT_IS_NODE){worker.on("message",function(data){worker.onmessage({data:data});});worker.on("error",function(data){worker.onerror(data);});worker.on("exit",function(data){});}worker.postMessage({"cmd":"load","urlOrBlob":Module["mainScriptUrlOrBlob"]||_scriptDir,"wasmMemory":wasmMemory,"wasmModule":wasmModule});},allocateUnusedWorker:function(){var pthreadMainJs=locateFile("tfjs-backend-wasm-threaded-simd.worker.js");PThread.unusedWorkers.push(new Worker(pthreadMainJs));},getNewWorker:function(){if(PThread.unusedWorkers.length==0){PThread.allocateUnusedWorker();PThread.loadWasmModuleToWorker(PThread.unusedWorkers[0]);}if(PThread.unusedWorkers.length>0)return PThread.unusedWorkers.pop();else return null},busySpinWait:function(msecs){var t=performance.now()+msecs;while(performance.now()<t){}}};function establishStackSpace(stackTop,stackMax){_emscripten_stack_set_limits(stackTop,stackMax);stackRestore(stackTop);}Module["establishStackSpace"]=establishStackSpace;function getNoExitRuntime(){return noExitRuntime}Module["getNoExitRuntime"]=getNoExitRuntime;function invokeEntryPoint(ptr,arg){return wasmTable.get(ptr)(arg)}Module["invokeEntryPoint"]=invokeEntryPoint;function ___assert_fail(condition,filename,line,func){abort("Assertion failed: "+UTF8ToString(condition)+", at: "+[filename?UTF8ToString(filename):"unknown filename",line,func?UTF8ToString(func):"unknown function"]);}function ___call_main(argc,argv){var returnCode=_main(argc,argv);}var _emscripten_get_now;if(ENVIRONMENT_IS_NODE){_emscripten_get_now=function(){var t=process["hrtime"]();return t[0]*1e3+t[1]/1e6};}else if(ENVIRONMENT_IS_PTHREAD){_emscripten_get_now=function(){return performance.now()-Module["__performance_now_clock_drift"]};}else if(typeof dateNow!=="undefined"){_emscripten_get_now=dateNow;}else _emscripten_get_now=function(){return performance.now()};function setErrNo(value){GROWABLE_HEAP_I32()[___errno_location()>>2]=value;return value}function _atexit(func,arg){if(ENVIRONMENT_IS_PTHREAD)return _emscripten_proxy_to_main_thread_js(1,1,func,arg)}function __emscripten_notify_thread_queue(targetThreadId,mainThreadId){if(targetThreadId==mainThreadId){postMessage({"cmd":"processQueuedMainThreadWork"});}else if(ENVIRONMENT_IS_PTHREAD){postMessage({"targetThread":targetThreadId,"cmd":"processThreadQueue"});}else {var pthread=PThread.pthreads[targetThreadId];var worker=pthread&&pthread.worker;if(!worker){return}worker.postMessage({"cmd":"processThreadQueue"});}return 1}function _abort(){abort();}function _emscripten_asm_const_int(code,sigPtr,argbuf){var args=readAsmConstArgs(sigPtr,argbuf);return ASM_CONSTS[code].apply(null,args)}function _emscripten_conditional_set_current_thread_status(expectedStatus,newStatus){}function _emscripten_futex_wait(addr,val,timeout){if(addr<=0||addr>GROWABLE_HEAP_I8().length||addr&3!=0)return -28;if(!ENVIRONMENT_IS_WEB){var ret=Atomics.wait(GROWABLE_HEAP_I32(),addr>>2,val,timeout);if(ret==="timed-out")return -73;if(ret==="not-equal")return -6;if(ret==="ok")return 0;throw "Atomics.wait returned an unexpected value "+ret}else {if(Atomics.load(GROWABLE_HEAP_I32(),addr>>2)!=val){return -6}var tNow=performance.now();var tEnd=tNow+timeout;var lastAddr=Atomics.exchange(GROWABLE_HEAP_I32(),__emscripten_main_thread_futex>>2,addr);while(1){tNow=performance.now();if(tNow>tEnd){lastAddr=Atomics.exchange(GROWABLE_HEAP_I32(),__emscripten_main_thread_futex>>2,0);return -73}lastAddr=Atomics.exchange(GROWABLE_HEAP_I32(),__emscripten_main_thread_futex>>2,0);if(lastAddr==0){break}_emscripten_main_thread_process_queued_calls();if(Atomics.load(GROWABLE_HEAP_I32(),addr>>2)!=val){return -6}lastAddr=Atomics.exchange(GROWABLE_HEAP_I32(),__emscripten_main_thread_futex>>2,addr);}return 0}}function _emscripten_memcpy_big(dest,src,num){GROWABLE_HEAP_U8().copyWithin(dest,src,src+num);}function _emscripten_num_logical_cores(){if(ENVIRONMENT_IS_NODE)return os.cpus().length;return navigator["hardwareConcurrency"]}function _emscripten_proxy_to_main_thread_js(index,sync){var numCallArgs=arguments.length-2;var stack=stackSave();var serializedNumCallArgs=numCallArgs;var args=stackAlloc(serializedNumCallArgs*8);var b=args>>3;for(var i=0;i<numCallArgs;i++){var arg=arguments[2+i];GROWABLE_HEAP_F64()[b+i]=arg;}var ret=_emscripten_run_in_main_runtime_thread_js(index,serializedNumCallArgs,args,sync);stackRestore(stack);return ret}var _emscripten_receive_on_main_thread_js_callArgs=[];var readAsmConstArgsArray=[];function readAsmConstArgs(sigPtr,buf){readAsmConstArgsArray.length=0;var ch;buf>>=2;while(ch=GROWABLE_HEAP_U8()[sigPtr++]){var double=ch<105;if(double&&buf&1)buf++;readAsmConstArgsArray.push(double?GROWABLE_HEAP_F64()[buf++>>1]:GROWABLE_HEAP_I32()[buf]);++buf;}return readAsmConstArgsArray}function _emscripten_receive_on_main_thread_js(index,numCallArgs,args){_emscripten_receive_on_main_thread_js_callArgs.length=numCallArgs;var b=args>>3;for(var i=0;i<numCallArgs;i++){_emscripten_receive_on_main_thread_js_callArgs[i]=GROWABLE_HEAP_F64()[b+i];}var isEmAsmConst=index<0;var func=!isEmAsmConst?proxiedFunctionTable[index]:ASM_CONSTS[-index-1];return func.apply(null,_emscripten_receive_on_main_thread_js_callArgs)}function _emscripten_get_heap_size(){return GROWABLE_HEAP_U8().length}function emscripten_realloc_buffer(size){try{wasmMemory.grow(size-buffer.byteLength+65535>>>16);updateGlobalBufferAndViews(wasmMemory.buffer);return 1}catch(e){}}function _emscripten_resize_heap(requestedSize){var oldSize=_emscripten_get_heap_size();if(requestedSize<=oldSize){return false}var maxHeapSize=2147483648;if(requestedSize>maxHeapSize){return false}for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=emscripten_realloc_buffer(newSize);if(replacement){return true}}return false}var JSEvents={inEventHandler:0,removeAllEventListeners:function(){for(var i=JSEvents.eventHandlers.length-1;i>=0;--i){JSEvents._removeHandler(i);}JSEvents.eventHandlers=[];JSEvents.deferredCalls=[];},registerRemoveEventListeners:function(){if(!JSEvents.removeEventListenersRegistered){JSEvents.removeEventListenersRegistered=true;}},deferredCalls:[],deferCall:function(targetFunction,precedence,argsList){function arraysHaveEqualContent(arrA,arrB){if(arrA.length!=arrB.length)return false;for(var i in arrA){if(arrA[i]!=arrB[i])return false}return true}for(var i in JSEvents.deferredCalls){var call=JSEvents.deferredCalls[i];if(call.targetFunction==targetFunction&&arraysHaveEqualContent(call.argsList,argsList)){return}}JSEvents.deferredCalls.push({targetFunction:targetFunction,precedence:precedence,argsList:argsList});JSEvents.deferredCalls.sort(function(x,y){return x.precedence<y.precedence});},removeDeferredCalls:function(targetFunction){for(var i=0;i<JSEvents.deferredCalls.length;++i){if(JSEvents.deferredCalls[i].targetFunction==targetFunction){JSEvents.deferredCalls.splice(i,1);--i;}}},canPerformEventHandlerRequests:function(){return JSEvents.inEventHandler&&JSEvents.currentEventHandler.allowsDeferredCalls},runDeferredCalls:function(){if(!JSEvents.canPerformEventHandlerRequests()){return}for(var i=0;i<JSEvents.deferredCalls.length;++i){var call=JSEvents.deferredCalls[i];JSEvents.deferredCalls.splice(i,1);--i;call.targetFunction.apply(null,call.argsList);}},eventHandlers:[],removeAllHandlersOnTarget:function(target,eventTypeString){for(var i=0;i<JSEvents.eventHandlers.length;++i){if(JSEvents.eventHandlers[i].target==target&&(!eventTypeString||eventTypeString==JSEvents.eventHandlers[i].eventTypeString)){JSEvents._removeHandler(i--);}}},_removeHandler:function(i){var h=JSEvents.eventHandlers[i];h.target.removeEventListener(h.eventTypeString,h.eventListenerFunc,h.useCapture);JSEvents.eventHandlers.splice(i,1);},registerOrRemoveHandler:function(eventHandler){var jsEventHandler=function jsEventHandler(event){++JSEvents.inEventHandler;JSEvents.currentEventHandler=eventHandler;JSEvents.runDeferredCalls();eventHandler.handlerFunc(event);JSEvents.runDeferredCalls();--JSEvents.inEventHandler;};if(eventHandler.callbackfunc){eventHandler.eventListenerFunc=jsEventHandler;eventHandler.target.addEventListener(eventHandler.eventTypeString,jsEventHandler,eventHandler.useCapture);JSEvents.eventHandlers.push(eventHandler);JSEvents.registerRemoveEventListeners();}else {for(var i=0;i<JSEvents.eventHandlers.length;++i){if(JSEvents.eventHandlers[i].target==eventHandler.target&&JSEvents.eventHandlers[i].eventTypeString==eventHandler.eventTypeString){JSEvents._removeHandler(i--);}}}},queueEventHandlerOnThread_iiii:function(targetThread,eventHandlerFunc,eventTypeId,eventData,userData){var stackTop=stackSave();var varargs=stackAlloc(12);GROWABLE_HEAP_I32()[varargs>>2]=eventTypeId;GROWABLE_HEAP_I32()[varargs+4>>2]=eventData;GROWABLE_HEAP_I32()[varargs+8>>2]=userData;__emscripten_call_on_thread(0,targetThread,637534208,eventHandlerFunc,eventData,varargs);stackRestore(stackTop);},getTargetThreadForEventCallback:function(targetThread){switch(targetThread){case 1:return 0;case 2:return PThread.currentProxiedOperationCallerThread;default:return targetThread}},getNodeNameForTarget:function(target){if(!target)return "";if(target==window)return "#window";if(target==screen)return "#screen";return target&&target.nodeName?target.nodeName:""},fullscreenEnabled:function(){return document.fullscreenEnabled||document.webkitFullscreenEnabled}};function stringToNewUTF8(jsString){var length=lengthBytesUTF8(jsString)+1;var cString=_malloc(length);stringToUTF8(jsString,cString,length);return cString}function _emscripten_set_offscreencanvas_size_on_target_thread_js(targetThread,targetCanvas,width,height){var stackTop=stackSave();var varargs=stackAlloc(12);var targetCanvasPtr=0;if(targetCanvas){targetCanvasPtr=stringToNewUTF8(targetCanvas);}GROWABLE_HEAP_I32()[varargs>>2]=targetCanvasPtr;GROWABLE_HEAP_I32()[varargs+4>>2]=width;GROWABLE_HEAP_I32()[varargs+8>>2]=height;__emscripten_call_on_thread(0,targetThread,657457152,0,targetCanvasPtr,varargs);stackRestore(stackTop);}function _emscripten_set_offscreencanvas_size_on_target_thread(targetThread,targetCanvas,width,height){targetCanvas=targetCanvas?UTF8ToString(targetCanvas):"";_emscripten_set_offscreencanvas_size_on_target_thread_js(targetThread,targetCanvas,width,height);}function maybeCStringToJsString(cString){return cString>2?UTF8ToString(cString):cString}var specialHTMLTargets=[0,typeof document!=="undefined"?document:0,typeof window!=="undefined"?window:0];function findEventTarget(target){target=maybeCStringToJsString(target);var domElement=specialHTMLTargets[target]||(typeof document!=="undefined"?document.querySelector(target):undefined);return domElement}function findCanvasEventTarget(target){return findEventTarget(target)}function _emscripten_set_canvas_element_size_calling_thread(target,width,height){var canvas=findCanvasEventTarget(target);if(!canvas)return -4;if(canvas.canvasSharedPtr){GROWABLE_HEAP_I32()[canvas.canvasSharedPtr>>2]=width;GROWABLE_HEAP_I32()[canvas.canvasSharedPtr+4>>2]=height;}if(canvas.offscreenCanvas||!canvas.controlTransferredOffscreen){if(canvas.offscreenCanvas)canvas=canvas.offscreenCanvas;var autoResizeViewport=false;if(canvas.GLctxObject&&canvas.GLctxObject.GLctx){var prevViewport=canvas.GLctxObject.GLctx.getParameter(2978);autoResizeViewport=prevViewport[0]===0&&prevViewport[1]===0&&prevViewport[2]===canvas.width&&prevViewport[3]===canvas.height;}canvas.width=width;canvas.height=height;if(autoResizeViewport){canvas.GLctxObject.GLctx.viewport(0,0,width,height);}}else if(canvas.canvasSharedPtr){var targetThread=GROWABLE_HEAP_I32()[canvas.canvasSharedPtr+8>>2];_emscripten_set_offscreencanvas_size_on_target_thread(targetThread,target,width,height);return 1}else {return -4}return 0}function _emscripten_set_canvas_element_size_main_thread(target,width,height){if(ENVIRONMENT_IS_PTHREAD)return _emscripten_proxy_to_main_thread_js(2,1,target,width,height);return _emscripten_set_canvas_element_size_calling_thread(target,width,height)}function _emscripten_set_canvas_element_size(target,width,height){var canvas=findCanvasEventTarget(target);if(canvas){return _emscripten_set_canvas_element_size_calling_thread(target,width,height)}else {return _emscripten_set_canvas_element_size_main_thread(target,width,height)}}function _emscripten_set_current_thread_status(newStatus){}function _emscripten_set_thread_name(threadId,name){}function __webgl_enable_ANGLE_instanced_arrays(ctx){var ext=ctx.getExtension("ANGLE_instanced_arrays");if(ext){ctx["vertexAttribDivisor"]=function(index,divisor){ext["vertexAttribDivisorANGLE"](index,divisor);};ctx["drawArraysInstanced"]=function(mode,first,count,primcount){ext["drawArraysInstancedANGLE"](mode,first,count,primcount);};ctx["drawElementsInstanced"]=function(mode,count,type,indices,primcount){ext["drawElementsInstancedANGLE"](mode,count,type,indices,primcount);};return 1}}function __webgl_enable_OES_vertex_array_object(ctx){var ext=ctx.getExtension("OES_vertex_array_object");if(ext){ctx["createVertexArray"]=function(){return ext["createVertexArrayOES"]()};ctx["deleteVertexArray"]=function(vao){ext["deleteVertexArrayOES"](vao);};ctx["bindVertexArray"]=function(vao){ext["bindVertexArrayOES"](vao);};ctx["isVertexArray"]=function(vao){return ext["isVertexArrayOES"](vao)};return 1}}function __webgl_enable_WEBGL_draw_buffers(ctx){var ext=ctx.getExtension("WEBGL_draw_buffers");if(ext){ctx["drawBuffers"]=function(n,bufs){ext["drawBuffersWEBGL"](n,bufs);};return 1}}function __webgl_enable_WEBGL_multi_draw(ctx){return !!(ctx.multiDrawWebgl=ctx.getExtension("WEBGL_multi_draw"))}var GL={counter:1,buffers:[],programs:[],framebuffers:[],renderbuffers:[],textures:[],uniforms:[],shaders:[],vaos:[],contexts:{},offscreenCanvases:{},timerQueriesEXT:[],programInfos:{},stringCache:{},unpackAlignment:4,recordError:function recordError(errorCode){if(!GL.lastError){GL.lastError=errorCode;}},getNewId:function(table){var ret=GL.counter++;for(var i=table.length;i<ret;i++){table[i]=null;}return ret},getSource:function(shader,count,string,length){var source="";for(var i=0;i<count;++i){var len=length?GROWABLE_HEAP_I32()[length+i*4>>2]:-1;source+=UTF8ToString(GROWABLE_HEAP_I32()[string+i*4>>2],len<0?undefined:len);}return source},createContext:function(canvas,webGLContextAttributes){var ctx=canvas.getContext("webgl",webGLContextAttributes);if(!ctx)return 0;var handle=GL.registerContext(ctx,webGLContextAttributes);return handle},registerContext:function(ctx,webGLContextAttributes){var handle=_malloc(8);GROWABLE_HEAP_I32()[handle+4>>2]=_pthread_self();var context={handle:handle,attributes:webGLContextAttributes,version:webGLContextAttributes.majorVersion,GLctx:ctx};if(ctx.canvas)ctx.canvas.GLctxObject=context;GL.contexts[handle]=context;if(typeof webGLContextAttributes.enableExtensionsByDefault==="undefined"||webGLContextAttributes.enableExtensionsByDefault){GL.initExtensions(context);}return handle},makeContextCurrent:function(contextHandle){GL.currentContext=GL.contexts[contextHandle];Module.ctx=GLctx=GL.currentContext&&GL.currentContext.GLctx;return !(contextHandle&&!GLctx)},getContext:function(contextHandle){return GL.contexts[contextHandle]},deleteContext:function(contextHandle){if(GL.currentContext===GL.contexts[contextHandle])GL.currentContext=null;if(typeof JSEvents==="object")JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);if(GL.contexts[contextHandle]&&GL.contexts[contextHandle].GLctx.canvas)GL.contexts[contextHandle].GLctx.canvas.GLctxObject=undefined;_free(GL.contexts[contextHandle].handle);GL.contexts[contextHandle]=null;},initExtensions:function(context){if(!context)context=GL.currentContext;if(context.initExtensionsDone)return;context.initExtensionsDone=true;var GLctx=context.GLctx;__webgl_enable_ANGLE_instanced_arrays(GLctx);__webgl_enable_OES_vertex_array_object(GLctx);__webgl_enable_WEBGL_draw_buffers(GLctx);GLctx.disjointTimerQueryExt=GLctx.getExtension("EXT_disjoint_timer_query");__webgl_enable_WEBGL_multi_draw(GLctx);var exts=GLctx.getSupportedExtensions()||[];exts.forEach(function(ext){if(ext.indexOf("lose_context")<0&&ext.indexOf("debug")<0){GLctx.getExtension(ext);}});},populateUniformTable:function(program){var p=GL.programs[program];var ptable=GL.programInfos[program]={uniforms:{},maxUniformLength:0,maxAttributeLength:-1,maxUniformBlockNameLength:-1};var utable=ptable.uniforms;var numUniforms=GLctx.getProgramParameter(p,35718);for(var i=0;i<numUniforms;++i){var u=GLctx.getActiveUniform(p,i);var name=u.name;ptable.maxUniformLength=Math.max(ptable.maxUniformLength,name.length+1);if(name.slice(-1)=="]"){name=name.slice(0,name.lastIndexOf("["));}var loc=GLctx.getUniformLocation(p,name);if(loc){var id=GL.getNewId(GL.uniforms);utable[name]=[u.size,id];GL.uniforms[id]=loc;for(var j=1;j<u.size;++j){var n=name+"["+j+"]";loc=GLctx.getUniformLocation(p,n);id=GL.getNewId(GL.uniforms);GL.uniforms[id]=loc;}}}}};var __emscripten_webgl_power_preferences=["default","low-power","high-performance"];function _emscripten_webgl_do_create_context(target,attributes){var a=attributes>>2;var powerPreference=GROWABLE_HEAP_I32()[a+(24>>2)];var contextAttributes={"alpha":!!GROWABLE_HEAP_I32()[a+(0>>2)],"depth":!!GROWABLE_HEAP_I32()[a+(4>>2)],"stencil":!!GROWABLE_HEAP_I32()[a+(8>>2)],"antialias":!!GROWABLE_HEAP_I32()[a+(12>>2)],"premultipliedAlpha":!!GROWABLE_HEAP_I32()[a+(16>>2)],"preserveDrawingBuffer":!!GROWABLE_HEAP_I32()[a+(20>>2)],"powerPreference":__emscripten_webgl_power_preferences[powerPreference],"failIfMajorPerformanceCaveat":!!GROWABLE_HEAP_I32()[a+(28>>2)],majorVersion:GROWABLE_HEAP_I32()[a+(32>>2)],minorVersion:GROWABLE_HEAP_I32()[a+(36>>2)],enableExtensionsByDefault:GROWABLE_HEAP_I32()[a+(40>>2)],explicitSwapControl:GROWABLE_HEAP_I32()[a+(44>>2)],proxyContextToMainThread:GROWABLE_HEAP_I32()[a+(48>>2)],renderViaOffscreenBackBuffer:GROWABLE_HEAP_I32()[a+(52>>2)]};var canvas=findCanvasEventTarget(target);if(!canvas){return 0}if(contextAttributes.explicitSwapControl){return 0}var contextHandle=GL.createContext(canvas,contextAttributes);return contextHandle}function _emscripten_webgl_create_context(a0,a1){return _emscripten_webgl_do_create_context(a0,a1)}var SYSCALLS={mappings:{},buffers:[null,[],[]],printChar:function(stream,curr){var buffer=SYSCALLS.buffers[stream];if(curr===0||curr===10){(stream===1?out:err)(UTF8ArrayToString(buffer,0));buffer.length=0;}else {buffer.push(curr);}},varargs:undefined,get:function(){SYSCALLS.varargs+=4;var ret=GROWABLE_HEAP_I32()[SYSCALLS.varargs-4>>2];return ret},getStr:function(ptr){var ret=UTF8ToString(ptr);return ret},get64:function(low,high){return low}};function _fd_close(fd){if(ENVIRONMENT_IS_PTHREAD)return _emscripten_proxy_to_main_thread_js(3,1,fd);return 0}function _fd_seek(fd,offset_low,offset_high,whence,newOffset){if(ENVIRONMENT_IS_PTHREAD)return _emscripten_proxy_to_main_thread_js(4,1,fd,offset_low,offset_high,whence,newOffset)}function _fd_write(fd,iov,iovcnt,pnum){if(ENVIRONMENT_IS_PTHREAD)return _emscripten_proxy_to_main_thread_js(5,1,fd,iov,iovcnt,pnum);var num=0;for(var i=0;i<iovcnt;i++){var ptr=GROWABLE_HEAP_I32()[iov+i*8>>2];var len=GROWABLE_HEAP_I32()[iov+(i*8+4)>>2];for(var j=0;j<len;j++){SYSCALLS.printChar(fd,GROWABLE_HEAP_U8()[ptr+j]);}num+=len;}GROWABLE_HEAP_I32()[pnum>>2]=num;return 0}function _pthread_cleanup_pop(execute){var routine=PThread.threadExitHandlers.pop();if(execute)routine();}function _pthread_cleanup_push(routine,arg){PThread.threadExitHandlers.push(function(){wasmTable.get(routine)(arg);});}function spawnThread(threadParams){if(ENVIRONMENT_IS_PTHREAD)throw "Internal Error! spawnThread() can only ever be called from main application thread!";var worker=PThread.getNewWorker();if(worker.pthread!==undefined)throw "Internal error!";if(!threadParams.pthread_ptr)throw "Internal error, no pthread ptr!";PThread.runningWorkers.push(worker);var tlsMemory=_malloc(128*4);for(var i=0;i<128;++i){GROWABLE_HEAP_I32()[tlsMemory+i*4>>2]=0;}var stackHigh=threadParams.stackBase+threadParams.stackSize;var pthread=PThread.pthreads[threadParams.pthread_ptr]={worker:worker,stackBase:threadParams.stackBase,stackSize:threadParams.stackSize,allocatedOwnStack:threadParams.allocatedOwnStack,threadInfoStruct:threadParams.pthread_ptr};var tis=pthread.threadInfoStruct>>2;Atomics.store(GROWABLE_HEAP_U32(),tis+(64>>2),threadParams.detached);Atomics.store(GROWABLE_HEAP_U32(),tis+(100>>2),tlsMemory);Atomics.store(GROWABLE_HEAP_U32(),tis+(40>>2),pthread.threadInfoStruct);Atomics.store(GROWABLE_HEAP_U32(),tis+(80>>2),threadParams.stackSize);Atomics.store(GROWABLE_HEAP_U32(),tis+(76>>2),stackHigh);Atomics.store(GROWABLE_HEAP_U32(),tis+(104>>2),threadParams.stackSize);Atomics.store(GROWABLE_HEAP_U32(),tis+(104+8>>2),stackHigh);Atomics.store(GROWABLE_HEAP_U32(),tis+(104+12>>2),threadParams.detached);var global_libc=_emscripten_get_global_libc();var global_locale=global_libc+40;Atomics.store(GROWABLE_HEAP_U32(),tis+(172>>2),global_locale);worker.pthread=pthread;var msg={"cmd":"run","start_routine":threadParams.startRoutine,"arg":threadParams.arg,"threadInfoStruct":threadParams.pthread_ptr,"stackBase":threadParams.stackBase,"stackSize":threadParams.stackSize};worker.runPthread=function(){msg.time=performance.now();worker.postMessage(msg,threadParams.transferList);};if(worker.loaded){worker.runPthread();delete worker.runPthread;}}function _pthread_create(pthread_ptr,attr,start_routine,arg){if(typeof SharedArrayBuffer==="undefined"){err("Current environment does not support SharedArrayBuffer, pthreads are not available!");return 6}if(!pthread_ptr){err("pthread_create called with a null thread pointer!");return 28}var transferList=[];var error=0;if(ENVIRONMENT_IS_PTHREAD&&(transferList.length===0||error)){return _emscripten_sync_run_in_main_thread_4(687865856,pthread_ptr,attr,start_routine,arg)}var stackSize=0;var stackBase=0;var detached=0;if(attr&&attr!=-1){stackSize=GROWABLE_HEAP_I32()[attr>>2];stackSize+=81920;stackBase=GROWABLE_HEAP_I32()[attr+8>>2];detached=GROWABLE_HEAP_I32()[attr+12>>2]!==0;}else {stackSize=2097152;}var allocatedOwnStack=stackBase==0;if(allocatedOwnStack){stackBase=_memalign(16,stackSize);}else {stackBase-=stackSize;assert(stackBase>0);}var threadInfoStruct=_malloc(228);for(var i=0;i<228>>2;++i)GROWABLE_HEAP_U32()[(threadInfoStruct>>2)+i]=0;GROWABLE_HEAP_I32()[pthread_ptr>>2]=threadInfoStruct;GROWABLE_HEAP_I32()[threadInfoStruct+12>>2]=threadInfoStruct;var headPtr=threadInfoStruct+152;GROWABLE_HEAP_I32()[headPtr>>2]=headPtr;var threadParams={stackBase:stackBase,stackSize:stackSize,allocatedOwnStack:allocatedOwnStack,detached:detached,startRoutine:start_routine,pthread_ptr:threadInfoStruct,arg:arg,transferList:transferList};if(ENVIRONMENT_IS_PTHREAD){threadParams.cmd="spawnThread";postMessage(threadParams,transferList);}else {spawnThread(threadParams);}return 0}function _sysconf(name){if(ENVIRONMENT_IS_PTHREAD)return _emscripten_proxy_to_main_thread_js(6,1,name);switch(name){case 30:return 16384;case 85:var maxHeapSize=2147483648;return maxHeapSize/16384;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:return 200809;case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:case 80:case 81:case 79:return -1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1e3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:{if(typeof navigator==="object")return navigator["hardwareConcurrency"]||1;return 1}}setErrNo(28);return -1}if(!ENVIRONMENT_IS_PTHREAD)PThread.initMainThreadBlock();var GLctx;var proxiedFunctionTable=[null,_atexit,_emscripten_set_canvas_element_size_main_thread,_fd_close,_fd_seek,_fd_write,_sysconf];var asmLibraryArg={"e":___assert_fail,"r":___call_main,"x":__emscripten_notify_thread_queue,"b":_abort,"y":_emscripten_asm_const_int,"j":_emscripten_conditional_set_current_thread_status,"c":_emscripten_futex_wait,"d":_emscripten_futex_wake,"f":_emscripten_get_now,"p":_emscripten_memcpy_big,"z":_emscripten_num_logical_cores,"u":_emscripten_receive_on_main_thread_js,"q":_emscripten_resize_heap,"v":_emscripten_set_canvas_element_size,"i":_emscripten_set_current_thread_status,"t":_emscripten_set_thread_name,"w":_emscripten_webgl_create_context,"m":_fd_close,"n":_fd_seek,"g":_fd_write,"o":initPthreadsJS,"a":wasmMemory||Module["wasmMemory"],"k":_pthread_cleanup_pop,"l":_pthread_cleanup_push,"h":_pthread_create,"s":_sysconf};var asm=createWasm();var ___wasm_call_ctors=Module["___wasm_call_ctors"]=function(){return (___wasm_call_ctors=Module["___wasm_call_ctors"]=Module["asm"]["A"]).apply(null,arguments)};var _init=Module["_init"]=function(){return (_init=Module["_init"]=Module["asm"]["B"]).apply(null,arguments)};var _register_tensor=Module["_register_tensor"]=function(){return (_register_tensor=Module["_register_tensor"]=Module["asm"]["C"]).apply(null,arguments)};var _dispose_data=Module["_dispose_data"]=function(){return (_dispose_data=Module["_dispose_data"]=Module["asm"]["D"]).apply(null,arguments)};var _dispose=Module["_dispose"]=function(){return (_dispose=Module["_dispose"]=Module["asm"]["E"]).apply(null,arguments)};var _Abs=Module["_Abs"]=function(){return (_Abs=Module["_Abs"]=Module["asm"]["G"]).apply(null,arguments)};var _Add=Module["_Add"]=function(){return (_Add=Module["_Add"]=Module["asm"]["H"]).apply(null,arguments)};var _AddN=Module["_AddN"]=function(){return (_AddN=Module["_AddN"]=Module["asm"]["I"]).apply(null,arguments)};var _All=Module["_All"]=function(){return (_All=Module["_All"]=Module["asm"]["J"]).apply(null,arguments)};var _Any=Module["_Any"]=function(){return (_Any=Module["_Any"]=Module["asm"]["K"]).apply(null,arguments)};var _ArgMax=Module["_ArgMax"]=function(){return (_ArgMax=Module["_ArgMax"]=Module["asm"]["L"]).apply(null,arguments)};var _AvgPool=Module["_AvgPool"]=function(){return (_AvgPool=Module["_AvgPool"]=Module["asm"]["M"]).apply(null,arguments)};var _BatchMatMul=Module["_BatchMatMul"]=function(){return (_BatchMatMul=Module["_BatchMatMul"]=Module["asm"]["N"]).apply(null,arguments)};var _Ceil=Module["_Ceil"]=function(){return (_Ceil=Module["_Ceil"]=Module["asm"]["O"]).apply(null,arguments)};var _ClipByValue=Module["_ClipByValue"]=function(){return (_ClipByValue=Module["_ClipByValue"]=Module["asm"]["P"]).apply(null,arguments)};var _Conv2D=Module["_Conv2D"]=function(){return (_Conv2D=Module["_Conv2D"]=Module["asm"]["Q"]).apply(null,arguments)};var _Conv2DBackpropInput=Module["_Conv2DBackpropInput"]=function(){return (_Conv2DBackpropInput=Module["_Conv2DBackpropInput"]=Module["asm"]["R"]).apply(null,arguments)};var _Cos=Module["_Cos"]=function(){return (_Cos=Module["_Cos"]=Module["asm"]["S"]).apply(null,arguments)};var _CropAndResize=Module["_CropAndResize"]=function(){return (_CropAndResize=Module["_CropAndResize"]=Module["asm"]["T"]).apply(null,arguments)};var _Cumsum=Module["_Cumsum"]=function(){return (_Cumsum=Module["_Cumsum"]=Module["asm"]["U"]).apply(null,arguments)};var _DepthToSpace=Module["_DepthToSpace"]=function(){return (_DepthToSpace=Module["_DepthToSpace"]=Module["asm"]["V"]).apply(null,arguments)};var _DepthwiseConv2dNative=Module["_DepthwiseConv2dNative"]=function(){return (_DepthwiseConv2dNative=Module["_DepthwiseConv2dNative"]=Module["asm"]["W"]).apply(null,arguments)};var _Equal=Module["_Equal"]=function(){return (_Equal=Module["_Equal"]=Module["asm"]["X"]).apply(null,arguments)};var _Exp=Module["_Exp"]=function(){return (_Exp=Module["_Exp"]=Module["asm"]["Y"]).apply(null,arguments)};var _FlipLeftRight=Module["_FlipLeftRight"]=function(){return (_FlipLeftRight=Module["_FlipLeftRight"]=Module["asm"]["Z"]).apply(null,arguments)};var _Floor=Module["_Floor"]=function(){return (_Floor=Module["_Floor"]=Module["asm"]["_"]).apply(null,arguments)};var _FloorDiv=Module["_FloorDiv"]=function(){return (_FloorDiv=Module["_FloorDiv"]=Module["asm"]["$"]).apply(null,arguments)};var _FusedBatchNorm=Module["_FusedBatchNorm"]=function(){return (_FusedBatchNorm=Module["_FusedBatchNorm"]=Module["asm"]["aa"]).apply(null,arguments)};var _FusedConv2D=Module["_FusedConv2D"]=function(){return (_FusedConv2D=Module["_FusedConv2D"]=Module["asm"]["ba"]).apply(null,arguments)};var _FusedDepthwiseConv2D=Module["_FusedDepthwiseConv2D"]=function(){return (_FusedDepthwiseConv2D=Module["_FusedDepthwiseConv2D"]=Module["asm"]["ca"]).apply(null,arguments)};var _Gather=Module["_Gather"]=function(){return (_Gather=Module["_Gather"]=Module["asm"]["da"]).apply(null,arguments)};var _GatherNd=Module["_GatherNd"]=function(){return (_GatherNd=Module["_GatherNd"]=Module["asm"]["ea"]).apply(null,arguments)};var _Greater=Module["_Greater"]=function(){return (_Greater=Module["_Greater"]=Module["asm"]["fa"]).apply(null,arguments)};var _GreaterEqual=Module["_GreaterEqual"]=function(){return (_GreaterEqual=Module["_GreaterEqual"]=Module["asm"]["ga"]).apply(null,arguments)};var _LeakyRelu=Module["_LeakyRelu"]=function(){return (_LeakyRelu=Module["_LeakyRelu"]=Module["asm"]["ha"]).apply(null,arguments)};var _Less=Module["_Less"]=function(){return (_Less=Module["_Less"]=Module["asm"]["ia"]).apply(null,arguments)};var _LessEqual=Module["_LessEqual"]=function(){return (_LessEqual=Module["_LessEqual"]=Module["asm"]["ja"]).apply(null,arguments)};var _Log=Module["_Log"]=function(){return (_Log=Module["_Log"]=Module["asm"]["ka"]).apply(null,arguments)};var _LogicalAnd=Module["_LogicalAnd"]=function(){return (_LogicalAnd=Module["_LogicalAnd"]=Module["asm"]["la"]).apply(null,arguments)};var _Max=Module["_Max"]=function(){return (_Max=Module["_Max"]=Module["asm"]["ma"]).apply(null,arguments)};var _MaxPool=Module["_MaxPool"]=function(){return (_MaxPool=Module["_MaxPool"]=Module["asm"]["na"]).apply(null,arguments)};var _Maximum=Module["_Maximum"]=function(){return (_Maximum=Module["_Maximum"]=Module["asm"]["oa"]).apply(null,arguments)};var _Mean=Module["_Mean"]=function(){return (_Mean=Module["_Mean"]=Module["asm"]["pa"]).apply(null,arguments)};var _Min=Module["_Min"]=function(){return (_Min=Module["_Min"]=Module["asm"]["qa"]).apply(null,arguments)};var _Minimum=Module["_Minimum"]=function(){return (_Minimum=Module["_Minimum"]=Module["asm"]["ra"]).apply(null,arguments)};var _MirrorPad=Module["_MirrorPad"]=function(){return (_MirrorPad=Module["_MirrorPad"]=Module["asm"]["sa"]).apply(null,arguments)};var _Multiply=Module["_Multiply"]=function(){return (_Multiply=Module["_Multiply"]=Module["asm"]["ta"]).apply(null,arguments)};var _Neg=Module["_Neg"]=function(){return (_Neg=Module["_Neg"]=Module["asm"]["ua"]).apply(null,arguments)};var _NonMaxSuppressionV3=Module["_NonMaxSuppressionV3"]=function(){return (_NonMaxSuppressionV3=Module["_NonMaxSuppressionV3"]=Module["asm"]["va"]).apply(null,arguments)};var _NonMaxSuppressionV4=Module["_NonMaxSuppressionV4"]=function(){return (_NonMaxSuppressionV4=Module["_NonMaxSuppressionV4"]=Module["asm"]["wa"]).apply(null,arguments)};var _NonMaxSuppressionV5=Module["_NonMaxSuppressionV5"]=function(){return (_NonMaxSuppressionV5=Module["_NonMaxSuppressionV5"]=Module["asm"]["xa"]).apply(null,arguments)};var _NotEqual=Module["_NotEqual"]=function(){return (_NotEqual=Module["_NotEqual"]=Module["asm"]["ya"]).apply(null,arguments)};var _OneHot=Module["_OneHot"]=function(){return (_OneHot=Module["_OneHot"]=Module["asm"]["za"]).apply(null,arguments)};var _PadV2=Module["_PadV2"]=function(){return (_PadV2=Module["_PadV2"]=Module["asm"]["Aa"]).apply(null,arguments)};var _Pow=Module["_Pow"]=function(){return (_Pow=Module["_Pow"]=Module["asm"]["Ba"]).apply(null,arguments)};var _Prelu=Module["_Prelu"]=function(){return (_Prelu=Module["_Prelu"]=Module["asm"]["Ca"]).apply(null,arguments)};var _Prod=Module["_Prod"]=function(){return (_Prod=Module["_Prod"]=Module["asm"]["Da"]).apply(null,arguments)};var _RealDiv=Module["_RealDiv"]=function(){return (_RealDiv=Module["_RealDiv"]=Module["asm"]["Ea"]).apply(null,arguments)};var _Relu=Module["_Relu"]=function(){return (_Relu=Module["_Relu"]=Module["asm"]["Fa"]).apply(null,arguments)};var _Relu6=Module["_Relu6"]=function(){return (_Relu6=Module["_Relu6"]=Module["asm"]["Ga"]).apply(null,arguments)};var _ResizeBilinear=Module["_ResizeBilinear"]=function(){return (_ResizeBilinear=Module["_ResizeBilinear"]=Module["asm"]["Ha"]).apply(null,arguments)};var _Reverse=Module["_Reverse"]=function(){return (_Reverse=Module["_Reverse"]=Module["asm"]["Ia"]).apply(null,arguments)};var _RotateWithOffset=Module["_RotateWithOffset"]=function(){return (_RotateWithOffset=Module["_RotateWithOffset"]=Module["asm"]["Ja"]).apply(null,arguments)};var _Round=Module["_Round"]=function(){return (_Round=Module["_Round"]=Module["asm"]["Ka"]).apply(null,arguments)};var _Rsqrt=Module["_Rsqrt"]=function(){return (_Rsqrt=Module["_Rsqrt"]=Module["asm"]["La"]).apply(null,arguments)};var _ScatterNd=Module["_ScatterNd"]=function(){return (_ScatterNd=Module["_ScatterNd"]=Module["asm"]["Ma"]).apply(null,arguments)};var _SelectV2=Module["_SelectV2"]=function(){return (_SelectV2=Module["_SelectV2"]=Module["asm"]["Na"]).apply(null,arguments)};var _Sigmoid=Module["_Sigmoid"]=function(){return (_Sigmoid=Module["_Sigmoid"]=Module["asm"]["Oa"]).apply(null,arguments)};var _Sin=Module["_Sin"]=function(){return (_Sin=Module["_Sin"]=Module["asm"]["Pa"]).apply(null,arguments)};var _Softmax=Module["_Softmax"]=function(){return (_Softmax=Module["_Softmax"]=Module["asm"]["Qa"]).apply(null,arguments)};var _Sqrt=Module["_Sqrt"]=function(){return (_Sqrt=Module["_Sqrt"]=Module["asm"]["Ra"]).apply(null,arguments)};var _Square=Module["_Square"]=function(){return (_Square=Module["_Square"]=Module["asm"]["Sa"]).apply(null,arguments)};var _SquaredDifference=Module["_SquaredDifference"]=function(){return (_SquaredDifference=Module["_SquaredDifference"]=Module["asm"]["Ta"]).apply(null,arguments)};var _Step=Module["_Step"]=function(){return (_Step=Module["_Step"]=Module["asm"]["Ua"]).apply(null,arguments)};var _StridedSlice=Module["_StridedSlice"]=function(){return (_StridedSlice=Module["_StridedSlice"]=Module["asm"]["Va"]).apply(null,arguments)};var _Sub=Module["_Sub"]=function(){return (_Sub=Module["_Sub"]=Module["asm"]["Wa"]).apply(null,arguments)};var _Sum=Module["_Sum"]=function(){return (_Sum=Module["_Sum"]=Module["asm"]["Xa"]).apply(null,arguments)};var _Tan=Module["_Tan"]=function(){return (_Tan=Module["_Tan"]=Module["asm"]["Ya"]).apply(null,arguments)};var _Tanh=Module["_Tanh"]=function(){return (_Tanh=Module["_Tanh"]=Module["asm"]["Za"]).apply(null,arguments)};var _Tile=Module["_Tile"]=function(){return (_Tile=Module["_Tile"]=Module["asm"]["_a"]).apply(null,arguments)};var _TopK=Module["_TopK"]=function(){return (_TopK=Module["_TopK"]=Module["asm"]["$a"]).apply(null,arguments)};var _Transpose=Module["_Transpose"]=function(){return (_Transpose=Module["_Transpose"]=Module["asm"]["ab"]).apply(null,arguments)};var __FusedMatMul=Module["__FusedMatMul"]=function(){return (__FusedMatMul=Module["__FusedMatMul"]=Module["asm"]["bb"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return (_malloc=Module["_malloc"]=Module["asm"]["cb"]).apply(null,arguments)};var _free=Module["_free"]=function(){return (_free=Module["_free"]=Module["asm"]["db"]).apply(null,arguments)};var ___errno_location=Module["___errno_location"]=function(){return (___errno_location=Module["___errno_location"]=Module["asm"]["eb"]).apply(null,arguments)};var _emscripten_get_global_libc=Module["_emscripten_get_global_libc"]=function(){return (_emscripten_get_global_libc=Module["_emscripten_get_global_libc"]=Module["asm"]["fb"]).apply(null,arguments)};var _pthread_self=Module["_pthread_self"]=function(){return (_pthread_self=Module["_pthread_self"]=Module["asm"]["gb"]).apply(null,arguments)};var ___pthread_tsd_run_dtors=Module["___pthread_tsd_run_dtors"]=function(){return (___pthread_tsd_run_dtors=Module["___pthread_tsd_run_dtors"]=Module["asm"]["hb"]).apply(null,arguments)};var _emscripten_main_thread_process_queued_calls=Module["_emscripten_main_thread_process_queued_calls"]=function(){return (_emscripten_main_thread_process_queued_calls=Module["_emscripten_main_thread_process_queued_calls"]=Module["asm"]["ib"]).apply(null,arguments)};var _emscripten_current_thread_process_queued_calls=Module["_emscripten_current_thread_process_queued_calls"]=function(){return (_emscripten_current_thread_process_queued_calls=Module["_emscripten_current_thread_process_queued_calls"]=Module["asm"]["jb"]).apply(null,arguments)};var _emscripten_register_main_browser_thread_id=Module["_emscripten_register_main_browser_thread_id"]=function(){return (_emscripten_register_main_browser_thread_id=Module["_emscripten_register_main_browser_thread_id"]=Module["asm"]["kb"]).apply(null,arguments)};var __emscripten_do_dispatch_to_thread=Module["__emscripten_do_dispatch_to_thread"]=function(){return (__emscripten_do_dispatch_to_thread=Module["__emscripten_do_dispatch_to_thread"]=Module["asm"]["lb"]).apply(null,arguments)};var _emscripten_sync_run_in_main_thread_4=Module["_emscripten_sync_run_in_main_thread_4"]=function(){return (_emscripten_sync_run_in_main_thread_4=Module["_emscripten_sync_run_in_main_thread_4"]=Module["asm"]["mb"]).apply(null,arguments)};var _emscripten_run_in_main_runtime_thread_js=Module["_emscripten_run_in_main_runtime_thread_js"]=function(){return (_emscripten_run_in_main_runtime_thread_js=Module["_emscripten_run_in_main_runtime_thread_js"]=Module["asm"]["nb"]).apply(null,arguments)};var __emscripten_call_on_thread=Module["__emscripten_call_on_thread"]=function(){return (__emscripten_call_on_thread=Module["__emscripten_call_on_thread"]=Module["asm"]["ob"]).apply(null,arguments)};var _emscripten_tls_init=Module["_emscripten_tls_init"]=function(){return (_emscripten_tls_init=Module["_emscripten_tls_init"]=Module["asm"]["pb"]).apply(null,arguments)};var __emscripten_thread_init=Module["__emscripten_thread_init"]=function(){return (__emscripten_thread_init=Module["__emscripten_thread_init"]=Module["asm"]["qb"]).apply(null,arguments)};var stackSave=Module["stackSave"]=function(){return (stackSave=Module["stackSave"]=Module["asm"]["rb"]).apply(null,arguments)};var stackRestore=Module["stackRestore"]=function(){return (stackRestore=Module["stackRestore"]=Module["asm"]["sb"]).apply(null,arguments)};var stackAlloc=Module["stackAlloc"]=function(){return (stackAlloc=Module["stackAlloc"]=Module["asm"]["tb"]).apply(null,arguments)};var _emscripten_stack_set_limits=Module["_emscripten_stack_set_limits"]=function(){return (_emscripten_stack_set_limits=Module["_emscripten_stack_set_limits"]=Module["asm"]["ub"]).apply(null,arguments)};var _memalign=Module["_memalign"]=function(){return (_memalign=Module["_memalign"]=Module["asm"]["vb"]).apply(null,arguments)};var __emscripten_allow_main_runtime_queued_calls=Module["__emscripten_allow_main_runtime_queued_calls"]=9808;var __emscripten_main_thread_futex=Module["__emscripten_main_thread_futex"]=11432;Module["cwrap"]=cwrap;Module["PThread"]=PThread;Module["PThread"]=PThread;Module["wasmMemory"]=wasmMemory;Module["ExitStatus"]=ExitStatus;var calledRun;function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status;}dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller;};function run(args){if(runDependencies>0){return}if(ENVIRONMENT_IS_PTHREAD){readyPromiseResolve(Module);initRuntime();postMessage({"cmd":"loaded"});return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();preMain();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun();}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("");},1);doRun();},1);}else {doRun();}}Module["run"]=run;function exit(status,implicit){if(implicit&&noExitRuntime&&status===0){return}if(!implicit){if(ENVIRONMENT_IS_PTHREAD){postMessage({"cmd":"exitProcess","returnCode":status});throw new ExitStatus(status)}}if(noExitRuntime);else {PThread.terminateAllThreads();if(Module["onExit"])Module["onExit"](status);ABORT=true;}quit_(status,new ExitStatus(status));}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()();}}if(ENVIRONMENT_IS_PTHREAD){noExitRuntime=false;PThread.initWorker();}run();


    return WasmBackendModuleThreadedSimd.ready
  }
  );
  })();
  module.exports = WasmBackendModuleThreadedSimd;
  });

  const wasmWorkerContents = 'var Module={};function threadPrintErr(){var text=Array.prototype.slice.call(arguments).join(" ");console.error(text)}function threadAlert(){var text=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:text,threadId:Module["_pthread_self"]()})}var err=threadPrintErr;this.alert=threadAlert;Module["instantiateWasm"]=function(info,receiveInstance){var instance=new WebAssembly.Instance(Module["wasmModule"],info);Module["wasmModule"]=null;receiveInstance(instance);return instance.exports};function moduleLoaded(){}this.onmessage=function(e){try{if(e.data.cmd==="load"){Module["wasmModule"]=e.data.wasmModule;Module["wasmMemory"]=e.data.wasmMemory;Module["buffer"]=Module["wasmMemory"].buffer;Module["ENVIRONMENT_IS_PTHREAD"]=true;if(typeof e.data.urlOrBlob==="string"){importScripts(e.data.urlOrBlob)}else{var objectUrl=URL.createObjectURL(e.data.urlOrBlob);importScripts(objectUrl);URL.revokeObjectURL(objectUrl)}WasmBackendModuleThreadedSimd(Module).then(function(instance){Module=instance;moduleLoaded()})}else if(e.data.cmd==="objectTransfer"){Module["PThread"].receiveObjectTransfer(e.data)}else if(e.data.cmd==="run"){Module["__performance_now_clock_drift"]=performance.now()-e.data.time;Module["__emscripten_thread_init"](e.data.threadInfoStruct,0,0);var max=e.data.stackBase;var top=e.data.stackBase+e.data.stackSize;Module["establishStackSpace"](top,max);Module["_emscripten_tls_init"]();Module["PThread"].receiveObjectTransfer(e.data);Module["PThread"].setThreadStatus(Module["_pthread_self"](),1);try{var result=Module["invokeEntryPoint"](e.data.start_routine,e.data.arg);if(!Module["getNoExitRuntime"]())Module["PThread"].threadExit(result)}catch(ex){if(ex==="Canceled!"){Module["PThread"].threadCancel()}else if(ex!="unwind"){if(ex instanceof Module["ExitStatus"]){if(Module["getNoExitRuntime"]()){}else{Module["PThread"].threadExit(ex.status)}}else{Module["PThread"].threadExit(-2);throw ex}}}}else if(e.data.cmd==="cancel"){if(Module["_pthread_self"]()){Module["PThread"].threadCancel()}}else if(e.data.target==="setimmediate"){}else if(e.data.cmd==="processThreadQueue"){if(Module["_pthread_self"]()){Module["_emscripten_current_thread_process_queued_calls"]()}}else{err("worker.js received unknown command "+e.data.cmd);err(e.data)}}catch(ex){err("worker.js onmessage() captured an uncaught exception: "+ex);if(ex&&ex.stack)err(ex.stack);throw ex}};if(typeof process==="object"&&typeof process.versions==="object"&&typeof process.versions.node==="string"){self={location:{href:__filename}};var onmessage=this.onmessage;var nodeWorkerThreads=require("worker_threads");global.Worker=nodeWorkerThreads.Worker;var parentPort=nodeWorkerThreads.parentPort;parentPort.on("message",function(data){onmessage({data:data})});var nodeFS=require("fs");var nodeRead=function(filename){return nodeFS.readFileSync(filename,"utf8")};function globalEval(x){global.require=require;global.Module=Module;eval.call(null,x)}importScripts=function(f){globalEval(nodeRead(f))};postMessage=function(msg){parentPort.postMessage(msg)};if(typeof performance==="undefined"){performance={now:function(){return Date.now()}}}}';

  var tfjsBackendWasm = createCommonjsModule(function (module, exports) {
  var WasmBackendModule = (function() {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
    return (
  function(WasmBackendModule) {
    WasmBackendModule = WasmBackendModule || {};

  var Module=typeof WasmBackendModule!=="undefined"?WasmBackendModule:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject;});var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key];}}var arguments_=[];var thisProgram="./this.program";var quit_=function(status,toThrow){throw toThrow};var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;var ENVIRONMENT_IS_SHELL=false;ENVIRONMENT_IS_WEB=typeof window==="object";ENVIRONMENT_IS_WORKER=typeof importScripts==="function";ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof process.versions==="object"&&typeof process.versions.node==="string";ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary;var nodeFS;var nodePath;if(ENVIRONMENT_IS_NODE){if(ENVIRONMENT_IS_WORKER){scriptDirectory=path.dirname(scriptDirectory)+"/";}else {scriptDirectory=__dirname+"/";}read_=function shell_read(filename,binary){if(!nodeFS)nodeFS=fs;if(!nodePath)nodePath=path;filename=nodePath["normalize"](filename);return nodeFS["readFileSync"](filename,binary?null:"utf8")};readBinary=function readBinary(filename){var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret);}assert(ret.buffer);return ret};if(process["argv"].length>1){thisProgram=process["argv"][1].replace(/\\/g,"/");}arguments_=process["argv"].slice(2);process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",abort);quit_=function(status){process["exit"](status);};Module["inspect"]=function(){return "[Emscripten Module object]"};}else if(ENVIRONMENT_IS_SHELL){if(typeof read!="undefined"){read_=function shell_read(f){return read(f)};}readBinary=function readBinary(f){var data;if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}data=read(f,"binary");assert(typeof data==="object");return data};if(typeof scriptArgs!="undefined"){arguments_=scriptArgs;}else if(typeof arguments!="undefined"){arguments_=arguments;}if(typeof quit==="function"){quit_=function(status){quit(status);};}if(typeof print!=="undefined"){if(typeof console==="undefined")console={};console.log=print;console.warn=console.error=typeof printErr!=="undefined"?printErr:print;}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href;}else if(typeof document!=="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src;}if(_scriptDir){scriptDirectory=_scriptDir;}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1);}else {scriptDirectory="";}{read_=function(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=function(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)};}readAsync=function(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror();};xhr.onerror=onerror;xhr.send(null);};}}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key];}}moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime=Module["noExitRuntime"]||true;if(typeof WebAssembly!=="object"){abort("no native wasm support detected");}var wasmMemory;var ABORT=false;function assert(condition,text){if(!condition){abort("Assertion failed: "+text);}}function getCFunc(ident){var func=Module["_"+ident];assert(func,"Cannot call unknown function "+ident+", make sure it is exported");return func}function ccall(ident,returnType,argTypes,args,opts){var toC={"string":function(str){var ret=0;if(str!==null&&str!==undefined&&str!==0){var len=(str.length<<2)+1;ret=stackAlloc(len);stringToUTF8(str,ret,len);}return ret},"array":function(arr){var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string")return UTF8ToString(ret);if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i]);}else {cArgs[i]=args[i];}}}var ret=func.apply(null,cArgs);ret=convertReturnValue(ret);if(stack!==0)stackRestore(stack);return ret}function cwrap(ident,returnType,argTypes,opts){argTypes=argTypes||[];var numericArgs=argTypes.every(function(type){return type==="number"});var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return function(){return ccall(ident,returnType,argTypes,arguments)}}var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heap,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heap[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heap.subarray&&UTF8Decoder){return UTF8Decoder.decode(heap.subarray(idx,endPtr))}else {var str="";while(idx<endPtr){var u0=heap[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heap[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heap[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2;}else {u0=(u0&7)<<18|u1<<12|u2<<6|heap[idx++]&63;}if(u0<65536){str+=String.fromCharCode(u0);}else {var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023);}}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023;}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u;}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63;}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;}else {if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;}}heap[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function writeArrayToMemory(array,buffer){HEAP8.set(array,buffer);}function alignUp(x,multiple){if(x%multiple>0){x+=multiple-x%multiple;}return x}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf);}var INITIAL_MEMORY=Module["INITIAL_MEMORY"]||16777216;var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATPOSTRUN__=[];__ATINIT__.push({func:function(){___wasm_call_ctors();}});function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift());}}callRuntimeCallbacks(__ATPRERUN__);}function initRuntime(){callRuntimeCallbacks(__ATINIT__);}function preMain(){callRuntimeCallbacks(__ATMAIN__);}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift());}}callRuntimeCallbacks(__ATPOSTRUN__);}function addOnPreRun(cb){__ATPRERUN__.unshift(cb);}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb);}var runDependencies=0;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}if(runDependencies==0){if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback();}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};function abort(what){if(Module["onAbort"]){Module["onAbort"](what);}what+="";err(what);ABORT=true;what="abort("+what+"). Build with -s ASSERTIONS=1 for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}function hasPrefix(str,prefix){return String.prototype.startsWith?str.startsWith(prefix):str.indexOf(prefix)===0}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return hasPrefix(filename,dataURIPrefix)}var fileURIPrefix="file://";function isFileURI(filename){return hasPrefix(filename,fileURIPrefix)}var wasmBinaryFile="tfjs-backend-wasm.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile);}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}else {throw "both async and sync fetching of the wasm failed"}}catch(err){abort(err);}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch==="function"&&!isFileURI(wasmBinaryFile)){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw "failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}else {if(readAsync){return new Promise(function(resolve,reject){readAsync(wasmBinaryFile,function(response){resolve(new Uint8Array(response));},reject);})}}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["i"];updateGlobalBufferAndViews(wasmMemory.buffer);wasmTable=Module["asm"]["o"];removeRunDependency();}addRunDependency();function receiveInstantiatedSource(output){receiveInstance(output["instance"]);}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason);})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&!isFileURI(wasmBinaryFile)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiatedSource,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiatedSource)})})}else {return instantiateArrayBuffer(receiveInstantiatedSource)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync().catch(readyPromiseReject);return {}}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback(Module);continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){wasmTable.get(func)();}else {wasmTable.get(func)(callback.arg);}}else {func(callback.arg===undefined?null:callback.arg);}}}function _abort(){abort();}function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num);}function _emscripten_get_heap_size(){return HEAPU8.length}function emscripten_realloc_buffer(size){try{wasmMemory.grow(size-buffer.byteLength+65535>>>16);updateGlobalBufferAndViews(wasmMemory.buffer);return 1}catch(e){}}function _emscripten_resize_heap(requestedSize){var oldSize=_emscripten_get_heap_size();var maxHeapSize=2147483648;if(requestedSize>maxHeapSize){return false}for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=emscripten_realloc_buffer(newSize);if(replacement){return true}}return false}var SYSCALLS={mappings:{},buffers:[null,[],[]],printChar:function(stream,curr){var buffer=SYSCALLS.buffers[stream];if(curr===0||curr===10){(stream===1?out:err)(UTF8ArrayToString(buffer,0));buffer.length=0;}else {buffer.push(curr);}},varargs:undefined,get:function(){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret},getStr:function(ptr){var ret=UTF8ToString(ptr);return ret},get64:function(low,high){return low}};function _fd_close(fd){return 0}function _fd_seek(fd,offset_low,offset_high,whence,newOffset){}function _fd_write(fd,iov,iovcnt,pnum){var num=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];for(var j=0;j<len;j++){SYSCALLS.printChar(fd,HEAPU8[ptr+j]);}num+=len;}HEAP32[pnum>>2]=num;return 0}function _pthread_create(){return 6}function setErrNo(value){HEAP32[___errno_location()>>2]=value;return value}function _sysconf(name){switch(name){case 30:return 16384;case 85:var maxHeapSize=2147483648;return maxHeapSize/16384;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:return 200809;case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:case 80:case 81:case 79:return -1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1e3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:{if(typeof navigator==="object")return navigator["hardwareConcurrency"]||1;return 1}}setErrNo(28);return -1}var asmLibraryArg={"a":_abort,"d":_emscripten_memcpy_big,"e":_emscripten_resize_heap,"f":_fd_close,"c":_fd_seek,"b":_fd_write,"g":_pthread_create,"h":_sysconf};var asm=createWasm();var ___wasm_call_ctors=Module["___wasm_call_ctors"]=function(){return (___wasm_call_ctors=Module["___wasm_call_ctors"]=Module["asm"]["j"]).apply(null,arguments)};var _init=Module["_init"]=function(){return (_init=Module["_init"]=Module["asm"]["k"]).apply(null,arguments)};var _register_tensor=Module["_register_tensor"]=function(){return (_register_tensor=Module["_register_tensor"]=Module["asm"]["l"]).apply(null,arguments)};var _dispose_data=Module["_dispose_data"]=function(){return (_dispose_data=Module["_dispose_data"]=Module["asm"]["m"]).apply(null,arguments)};var _dispose=Module["_dispose"]=function(){return (_dispose=Module["_dispose"]=Module["asm"]["n"]).apply(null,arguments)};var _Abs=Module["_Abs"]=function(){return (_Abs=Module["_Abs"]=Module["asm"]["p"]).apply(null,arguments)};var _Add=Module["_Add"]=function(){return (_Add=Module["_Add"]=Module["asm"]["q"]).apply(null,arguments)};var _AddN=Module["_AddN"]=function(){return (_AddN=Module["_AddN"]=Module["asm"]["r"]).apply(null,arguments)};var _All=Module["_All"]=function(){return (_All=Module["_All"]=Module["asm"]["s"]).apply(null,arguments)};var _Any=Module["_Any"]=function(){return (_Any=Module["_Any"]=Module["asm"]["t"]).apply(null,arguments)};var _ArgMax=Module["_ArgMax"]=function(){return (_ArgMax=Module["_ArgMax"]=Module["asm"]["u"]).apply(null,arguments)};var _AvgPool=Module["_AvgPool"]=function(){return (_AvgPool=Module["_AvgPool"]=Module["asm"]["v"]).apply(null,arguments)};var _BatchMatMul=Module["_BatchMatMul"]=function(){return (_BatchMatMul=Module["_BatchMatMul"]=Module["asm"]["w"]).apply(null,arguments)};var _Ceil=Module["_Ceil"]=function(){return (_Ceil=Module["_Ceil"]=Module["asm"]["x"]).apply(null,arguments)};var _ClipByValue=Module["_ClipByValue"]=function(){return (_ClipByValue=Module["_ClipByValue"]=Module["asm"]["y"]).apply(null,arguments)};var _Conv2D=Module["_Conv2D"]=function(){return (_Conv2D=Module["_Conv2D"]=Module["asm"]["z"]).apply(null,arguments)};var _Conv2DBackpropInput=Module["_Conv2DBackpropInput"]=function(){return (_Conv2DBackpropInput=Module["_Conv2DBackpropInput"]=Module["asm"]["A"]).apply(null,arguments)};var _Cos=Module["_Cos"]=function(){return (_Cos=Module["_Cos"]=Module["asm"]["B"]).apply(null,arguments)};var _CropAndResize=Module["_CropAndResize"]=function(){return (_CropAndResize=Module["_CropAndResize"]=Module["asm"]["C"]).apply(null,arguments)};var _Cumsum=Module["_Cumsum"]=function(){return (_Cumsum=Module["_Cumsum"]=Module["asm"]["D"]).apply(null,arguments)};var _DepthToSpace=Module["_DepthToSpace"]=function(){return (_DepthToSpace=Module["_DepthToSpace"]=Module["asm"]["E"]).apply(null,arguments)};var _DepthwiseConv2dNative=Module["_DepthwiseConv2dNative"]=function(){return (_DepthwiseConv2dNative=Module["_DepthwiseConv2dNative"]=Module["asm"]["F"]).apply(null,arguments)};var _Equal=Module["_Equal"]=function(){return (_Equal=Module["_Equal"]=Module["asm"]["G"]).apply(null,arguments)};var _Exp=Module["_Exp"]=function(){return (_Exp=Module["_Exp"]=Module["asm"]["H"]).apply(null,arguments)};var _FlipLeftRight=Module["_FlipLeftRight"]=function(){return (_FlipLeftRight=Module["_FlipLeftRight"]=Module["asm"]["I"]).apply(null,arguments)};var _Floor=Module["_Floor"]=function(){return (_Floor=Module["_Floor"]=Module["asm"]["J"]).apply(null,arguments)};var _FloorDiv=Module["_FloorDiv"]=function(){return (_FloorDiv=Module["_FloorDiv"]=Module["asm"]["K"]).apply(null,arguments)};var _FusedBatchNorm=Module["_FusedBatchNorm"]=function(){return (_FusedBatchNorm=Module["_FusedBatchNorm"]=Module["asm"]["L"]).apply(null,arguments)};var _FusedConv2D=Module["_FusedConv2D"]=function(){return (_FusedConv2D=Module["_FusedConv2D"]=Module["asm"]["M"]).apply(null,arguments)};var _FusedDepthwiseConv2D=Module["_FusedDepthwiseConv2D"]=function(){return (_FusedDepthwiseConv2D=Module["_FusedDepthwiseConv2D"]=Module["asm"]["N"]).apply(null,arguments)};var _Gather=Module["_Gather"]=function(){return (_Gather=Module["_Gather"]=Module["asm"]["O"]).apply(null,arguments)};var _GatherNd=Module["_GatherNd"]=function(){return (_GatherNd=Module["_GatherNd"]=Module["asm"]["P"]).apply(null,arguments)};var _Greater=Module["_Greater"]=function(){return (_Greater=Module["_Greater"]=Module["asm"]["Q"]).apply(null,arguments)};var _GreaterEqual=Module["_GreaterEqual"]=function(){return (_GreaterEqual=Module["_GreaterEqual"]=Module["asm"]["R"]).apply(null,arguments)};var _LeakyRelu=Module["_LeakyRelu"]=function(){return (_LeakyRelu=Module["_LeakyRelu"]=Module["asm"]["S"]).apply(null,arguments)};var _Less=Module["_Less"]=function(){return (_Less=Module["_Less"]=Module["asm"]["T"]).apply(null,arguments)};var _LessEqual=Module["_LessEqual"]=function(){return (_LessEqual=Module["_LessEqual"]=Module["asm"]["U"]).apply(null,arguments)};var _Log=Module["_Log"]=function(){return (_Log=Module["_Log"]=Module["asm"]["V"]).apply(null,arguments)};var _LogicalAnd=Module["_LogicalAnd"]=function(){return (_LogicalAnd=Module["_LogicalAnd"]=Module["asm"]["W"]).apply(null,arguments)};var _Max=Module["_Max"]=function(){return (_Max=Module["_Max"]=Module["asm"]["X"]).apply(null,arguments)};var _MaxPool=Module["_MaxPool"]=function(){return (_MaxPool=Module["_MaxPool"]=Module["asm"]["Y"]).apply(null,arguments)};var _Maximum=Module["_Maximum"]=function(){return (_Maximum=Module["_Maximum"]=Module["asm"]["Z"]).apply(null,arguments)};var _Mean=Module["_Mean"]=function(){return (_Mean=Module["_Mean"]=Module["asm"]["_"]).apply(null,arguments)};var _Min=Module["_Min"]=function(){return (_Min=Module["_Min"]=Module["asm"]["$"]).apply(null,arguments)};var _Minimum=Module["_Minimum"]=function(){return (_Minimum=Module["_Minimum"]=Module["asm"]["aa"]).apply(null,arguments)};var _MirrorPad=Module["_MirrorPad"]=function(){return (_MirrorPad=Module["_MirrorPad"]=Module["asm"]["ba"]).apply(null,arguments)};var _Multiply=Module["_Multiply"]=function(){return (_Multiply=Module["_Multiply"]=Module["asm"]["ca"]).apply(null,arguments)};var _Neg=Module["_Neg"]=function(){return (_Neg=Module["_Neg"]=Module["asm"]["da"]).apply(null,arguments)};var _NonMaxSuppressionV3=Module["_NonMaxSuppressionV3"]=function(){return (_NonMaxSuppressionV3=Module["_NonMaxSuppressionV3"]=Module["asm"]["ea"]).apply(null,arguments)};var _NonMaxSuppressionV4=Module["_NonMaxSuppressionV4"]=function(){return (_NonMaxSuppressionV4=Module["_NonMaxSuppressionV4"]=Module["asm"]["fa"]).apply(null,arguments)};var _NonMaxSuppressionV5=Module["_NonMaxSuppressionV5"]=function(){return (_NonMaxSuppressionV5=Module["_NonMaxSuppressionV5"]=Module["asm"]["ga"]).apply(null,arguments)};var _NotEqual=Module["_NotEqual"]=function(){return (_NotEqual=Module["_NotEqual"]=Module["asm"]["ha"]).apply(null,arguments)};var _OneHot=Module["_OneHot"]=function(){return (_OneHot=Module["_OneHot"]=Module["asm"]["ia"]).apply(null,arguments)};var _PadV2=Module["_PadV2"]=function(){return (_PadV2=Module["_PadV2"]=Module["asm"]["ja"]).apply(null,arguments)};var _Pow=Module["_Pow"]=function(){return (_Pow=Module["_Pow"]=Module["asm"]["ka"]).apply(null,arguments)};var _Prelu=Module["_Prelu"]=function(){return (_Prelu=Module["_Prelu"]=Module["asm"]["la"]).apply(null,arguments)};var _Prod=Module["_Prod"]=function(){return (_Prod=Module["_Prod"]=Module["asm"]["ma"]).apply(null,arguments)};var _RealDiv=Module["_RealDiv"]=function(){return (_RealDiv=Module["_RealDiv"]=Module["asm"]["na"]).apply(null,arguments)};var _Relu=Module["_Relu"]=function(){return (_Relu=Module["_Relu"]=Module["asm"]["oa"]).apply(null,arguments)};var _Relu6=Module["_Relu6"]=function(){return (_Relu6=Module["_Relu6"]=Module["asm"]["pa"]).apply(null,arguments)};var _ResizeBilinear=Module["_ResizeBilinear"]=function(){return (_ResizeBilinear=Module["_ResizeBilinear"]=Module["asm"]["qa"]).apply(null,arguments)};var _Reverse=Module["_Reverse"]=function(){return (_Reverse=Module["_Reverse"]=Module["asm"]["ra"]).apply(null,arguments)};var _RotateWithOffset=Module["_RotateWithOffset"]=function(){return (_RotateWithOffset=Module["_RotateWithOffset"]=Module["asm"]["sa"]).apply(null,arguments)};var _Round=Module["_Round"]=function(){return (_Round=Module["_Round"]=Module["asm"]["ta"]).apply(null,arguments)};var _Rsqrt=Module["_Rsqrt"]=function(){return (_Rsqrt=Module["_Rsqrt"]=Module["asm"]["ua"]).apply(null,arguments)};var _ScatterNd=Module["_ScatterNd"]=function(){return (_ScatterNd=Module["_ScatterNd"]=Module["asm"]["va"]).apply(null,arguments)};var _SelectV2=Module["_SelectV2"]=function(){return (_SelectV2=Module["_SelectV2"]=Module["asm"]["wa"]).apply(null,arguments)};var _Sigmoid=Module["_Sigmoid"]=function(){return (_Sigmoid=Module["_Sigmoid"]=Module["asm"]["xa"]).apply(null,arguments)};var _Sin=Module["_Sin"]=function(){return (_Sin=Module["_Sin"]=Module["asm"]["ya"]).apply(null,arguments)};var _Softmax=Module["_Softmax"]=function(){return (_Softmax=Module["_Softmax"]=Module["asm"]["za"]).apply(null,arguments)};var _Sqrt=Module["_Sqrt"]=function(){return (_Sqrt=Module["_Sqrt"]=Module["asm"]["Aa"]).apply(null,arguments)};var _Square=Module["_Square"]=function(){return (_Square=Module["_Square"]=Module["asm"]["Ba"]).apply(null,arguments)};var _SquaredDifference=Module["_SquaredDifference"]=function(){return (_SquaredDifference=Module["_SquaredDifference"]=Module["asm"]["Ca"]).apply(null,arguments)};var _Step=Module["_Step"]=function(){return (_Step=Module["_Step"]=Module["asm"]["Da"]).apply(null,arguments)};var _StridedSlice=Module["_StridedSlice"]=function(){return (_StridedSlice=Module["_StridedSlice"]=Module["asm"]["Ea"]).apply(null,arguments)};var _Sub=Module["_Sub"]=function(){return (_Sub=Module["_Sub"]=Module["asm"]["Fa"]).apply(null,arguments)};var _Sum=Module["_Sum"]=function(){return (_Sum=Module["_Sum"]=Module["asm"]["Ga"]).apply(null,arguments)};var _Tan=Module["_Tan"]=function(){return (_Tan=Module["_Tan"]=Module["asm"]["Ha"]).apply(null,arguments)};var _Tanh=Module["_Tanh"]=function(){return (_Tanh=Module["_Tanh"]=Module["asm"]["Ia"]).apply(null,arguments)};var _Tile=Module["_Tile"]=function(){return (_Tile=Module["_Tile"]=Module["asm"]["Ja"]).apply(null,arguments)};var _TopK=Module["_TopK"]=function(){return (_TopK=Module["_TopK"]=Module["asm"]["Ka"]).apply(null,arguments)};var _Transpose=Module["_Transpose"]=function(){return (_Transpose=Module["_Transpose"]=Module["asm"]["La"]).apply(null,arguments)};var __FusedMatMul=Module["__FusedMatMul"]=function(){return (__FusedMatMul=Module["__FusedMatMul"]=Module["asm"]["Ma"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return (_malloc=Module["_malloc"]=Module["asm"]["Na"]).apply(null,arguments)};var _free=Module["_free"]=function(){return (_free=Module["_free"]=Module["asm"]["Oa"]).apply(null,arguments)};var ___errno_location=Module["___errno_location"]=function(){return (___errno_location=Module["___errno_location"]=Module["asm"]["Pa"]).apply(null,arguments)};var stackSave=Module["stackSave"]=function(){return (stackSave=Module["stackSave"]=Module["asm"]["Qa"]).apply(null,arguments)};var stackRestore=Module["stackRestore"]=function(){return (stackRestore=Module["stackRestore"]=Module["asm"]["Ra"]).apply(null,arguments)};var stackAlloc=Module["stackAlloc"]=function(){return (stackAlloc=Module["stackAlloc"]=Module["asm"]["Sa"]).apply(null,arguments)};Module["cwrap"]=cwrap;var calledRun;function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status;}dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller;};function run(args){if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();preMain();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun();}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("");},1);doRun();},1);}else {doRun();}}Module["run"]=run;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()();}}run();


    return WasmBackendModule.ready
  }
  );
  })();
  module.exports = WasmBackendModule;
  });

  var BackendWasm = /** @class */ (function (_super) {
      __extends(BackendWasm, _super);
      function BackendWasm(wasm) {
          var _this = _super.call(this) || this;
          _this.wasm = wasm;
          // 0 is reserved for null data ids.
          _this.dataIdNextNumber = 1;
          _this.wasm.tfjs.init();
          _this.dataIdMap = new tfjsCore.DataStorage(_this, tfjsCore.engine());
          return _this;
      }
      BackendWasm.prototype.write = function (values, shape, dtype) {
          var dataId = { id: this.dataIdNextNumber++ };
          this.move(dataId, values, shape, dtype, 1);
          return dataId;
      };
      BackendWasm.prototype.numDataIds = function () {
          return this.dataIdMap.numDataIds();
      };
      BackendWasm.prototype.time = function (f) {
          return __awaiter(this, void 0, void 0, function () {
              var start, kernelMs;
              return __generator(this, function (_a) {
                  start = tfjsCore.util.now();
                  f();
                  kernelMs = tfjsCore.util.now() - start;
                  return [2 /*return*/, { kernelMs: kernelMs }];
              });
          });
      };
      BackendWasm.prototype.move = function (dataId, values, shape, dtype, refCount) {
          var id = this.dataIdNextNumber++;
          if (dtype === 'string') {
              var stringBytes = values;
              this.dataIdMap.set(dataId, { id: id, stringBytes: stringBytes, shape: shape, dtype: dtype, memoryOffset: null, refCount: refCount });
              return;
          }
          var size = tfjsCore.util.sizeFromShape(shape);
          var numBytes = size * tfjsCore.util.bytesPerElement(dtype);
          var memoryOffset = this.wasm._malloc(numBytes);
          this.dataIdMap.set(dataId, { id: id, memoryOffset: memoryOffset, shape: shape, dtype: dtype, refCount: refCount });
          this.wasm.tfjs.registerTensor(id, size, memoryOffset);
          if (values != null) {
              this.wasm.HEAPU8.set(new Uint8Array(values.buffer, values.byteOffset, numBytes), memoryOffset);
          }
      };
      BackendWasm.prototype.read = function (dataId) {
          return __awaiter(this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                  return [2 /*return*/, this.readSync(dataId)];
              });
          });
      };
      BackendWasm.prototype.readSync = function (dataId) {
          var _a = this.dataIdMap.get(dataId), memoryOffset = _a.memoryOffset, dtype = _a.dtype, shape = _a.shape, stringBytes = _a.stringBytes;
          if (dtype === 'string') {
              return stringBytes;
          }
          var bytes = this.wasm.HEAPU8.slice(memoryOffset, memoryOffset + tfjsCore.util.sizeFromShape(shape) * tfjsCore.util.bytesPerElement(dtype));
          return typedArrayFromBuffer(bytes.buffer, dtype);
      };
      /**
       * Dispose the memory if the dataId has 0 refCount. Return true if the memory
       * is released, false otherwise.
       * @param dataId
       * @oaram force Optional, remove the data regardless of refCount
       */
      BackendWasm.prototype.disposeData = function (dataId, force) {
          if (force === void 0) { force = false; }
          if (this.dataIdMap.has(dataId)) {
              var data = this.dataIdMap.get(dataId);
              data.refCount--;
              if (!force && data.refCount > 0) {
                  return false;
              }
              this.wasm._free(data.memoryOffset);
              this.wasm.tfjs.disposeData(data.id);
              this.dataIdMap.delete(dataId);
          }
          return true;
      };
      /** Return refCount of a `TensorData`. */
      BackendWasm.prototype.refCount = function (dataId) {
          if (this.dataIdMap.has(dataId)) {
              var tensorData = this.dataIdMap.get(dataId);
              return tensorData.refCount;
          }
          return 0;
      };
      BackendWasm.prototype.incRef = function (dataId) {
          var data = this.dataIdMap.get(dataId);
          if (data != null) {
              data.refCount++;
          }
      };
      BackendWasm.prototype.floatPrecision = function () {
          return 32;
      };
      // Returns the memory offset of a tensor. Useful for debugging and unit
      // testing.
      BackendWasm.prototype.getMemoryOffset = function (dataId) {
          return this.dataIdMap.get(dataId).memoryOffset;
      };
      BackendWasm.prototype.dispose = function () {
          this.wasm.tfjs.dispose();
          if ('PThread' in this.wasm) {
              this.wasm.PThread.terminateAllThreads();
          }
          this.wasm = null;
      };
      BackendWasm.prototype.memory = function () {
          return { unreliable: false };
      };
      /**
       * Make a tensor info for the output of an op. If `memoryOffset` is not
       * present, this method allocates memory on the WASM heap. If `memoryOffset`
       * is present, the memory was allocated elsewhere (in c++) and we just record
       * the pointer where that memory lives.
       */
      BackendWasm.prototype.makeOutput = function (shape, dtype, memoryOffset) {
          var dataId;
          if (memoryOffset == null) {
              dataId = this.write(null /* values */, shape, dtype);
          }
          else {
              var id = this.dataIdNextNumber++;
              dataId = { id: id };
              this.dataIdMap.set(dataId, { id: id, memoryOffset: memoryOffset, shape: shape, dtype: dtype, refCount: 1 });
              var size = tfjsCore.util.sizeFromShape(shape);
              this.wasm.tfjs.registerTensor(id, size, memoryOffset);
          }
          return { dataId: dataId, shape: shape, dtype: dtype };
      };
      BackendWasm.prototype.typedArrayFromHeap = function (_a) {
          var shape = _a.shape, dtype = _a.dtype, dataId = _a.dataId;
          var buffer = this.wasm.HEAPU8.buffer;
          var memoryOffset = this.dataIdMap.get(dataId).memoryOffset;
          var size = tfjsCore.util.sizeFromShape(shape);
          switch (dtype) {
              case 'float32':
                  return new Float32Array(buffer, memoryOffset, size);
              case 'int32':
                  return new Int32Array(buffer, memoryOffset, size);
              case 'bool':
                  return new Uint8Array(buffer, memoryOffset, size);
              default:
                  throw new Error("Unknown dtype " + dtype);
          }
      };
      return BackendWasm;
  }(tfjsCore.KernelBackend));
  function createInstantiateWasmFunc(path) {
      // tslint:disable-next-line:no-any
      return function (imports, callback) {
          tfjsCore.util.fetch(path, { credentials: 'same-origin' }).then(function (response) {
              if (!response['ok']) {
                  imports.env.a("failed to load wasm binary file at '" + path + "'");
              }
              response.arrayBuffer().then(function (binary) {
                  WebAssembly.instantiate(binary, imports).then(function (output) {
                      callback(output.instance, output.module);
                  });
              });
          });
          return {};
      };
  }
  /**
   * Returns the path of the WASM binary.
   * @param simdSupported whether SIMD is supported
   * @param threadsSupported whether multithreading is supported
   * @param wasmModuleFolder the directory containing the WASM binaries.
   */
  function getPathToWasmBinary(simdSupported, threadsSupported, wasmModuleFolder) {
      if (wasmPath != null) {
          // If wasmPath is defined, the user has supplied a full path to
          // the vanilla .wasm binary.
          return wasmPath;
      }
      var path = 'tfjs-backend-wasm.wasm';
      if (simdSupported && threadsSupported) {
          path = 'tfjs-backend-wasm-threaded-simd.wasm';
      }
      else if (simdSupported) {
          path = 'tfjs-backend-wasm-simd.wasm';
      }
      if (wasmFileMap != null) {
          if (wasmFileMap[path] != null) {
              return wasmFileMap[path];
          }
      }
      return wasmModuleFolder + path;
  }
  /**
   * Initializes the wasm module and creates the js <--> wasm bridge.
   *
   * NOTE: We wrap the wasm module in a object with property 'wasm' instead of
   * returning Promise<BackendWasmModule> to avoid freezing Chrome (last tested
   * in Chrome 76).
   */
  function init() {
      return __awaiter(this, void 0, void 0, function () {
          var _a, simdSupported, threadsSupported;
          return __generator(this, function (_b) {
              switch (_b.label) {
                  case 0: return [4 /*yield*/, Promise.all([
                          tfjsCore.env().getAsync('WASM_HAS_SIMD_SUPPORT'),
                          tfjsCore.env().getAsync('WASM_HAS_MULTITHREAD_SUPPORT')
                      ])];
                  case 1:
                      _a = _b.sent(), simdSupported = _a[0], threadsSupported = _a[1];
                      return [2 /*return*/, new Promise(function (resolve, reject) {
                              var factoryConfig = {};
                              /**
                               * This function overrides the Emscripten module locateFile utility.
                               * @param path The relative path to the file that needs to be loaded.
                               * @param prefix The path to the main JavaScript file's directory.
                               */
                              factoryConfig.locateFile = function (path, prefix) {
                                  if (path.endsWith('.worker.js')) {
                                      var response = wasmWorkerContents;
                                      var blob = new Blob([response], { type: 'application/javascript' });
                                      return URL.createObjectURL(blob);
                                  }
                                  if (path.endsWith('.wasm')) {
                                      return getPathToWasmBinary(simdSupported, threadsSupported, wasmPathPrefix != null ? wasmPathPrefix : prefix);
                                  }
                                  return prefix + path;
                              };
                              // Use the instantiateWasm override when system fetch is not available.
                              // Reference:
                              // https://github.com/emscripten-core/emscripten/blob/2bca083cbbd5a4133db61fbd74d04f7feecfa907/tests/manual_wasm_instantiate.html#L170
                              if (customFetch) {
                                  factoryConfig.instantiateWasm =
                                      createInstantiateWasmFunc(getPathToWasmBinary(simdSupported, threadsSupported, wasmPathPrefix != null ? wasmPathPrefix : ''));
                              }
                              var initialized = false;
                              factoryConfig.onAbort = function () {
                                  if (initialized) {
                                      // Emscripten already called console.warn so no need to double log.
                                      return;
                                  }
                                  if (initAborted) {
                                      // Emscripten calls `onAbort` twice, resulting in double error
                                      // messages.
                                      return;
                                  }
                                  initAborted = true;
                                  var rejectMsg = 'Make sure the server can serve the `.wasm` file relative to the ' +
                                      'bundled js file. For more details see https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-wasm/README.md#using-bundlers';
                                  reject({ message: rejectMsg });
                              };
                              var wasm;
                              // If `wasmPath` has been defined we must initialize the vanilla module.
                              if (threadsSupported && simdSupported && wasmPath == null) {
                                  factoryConfig.mainScriptUrlOrBlob = new Blob(["var WasmBackendModuleThreadedSimd = " +
                                          tfjsBackendWasmThreadedSimd.toString()], { type: 'text/javascript' });
                                  wasm = tfjsBackendWasmThreadedSimd(factoryConfig);
                              }
                              else {
                                  // The wasmFactory works for both vanilla and SIMD binaries.
                                  wasm = tfjsBackendWasm(factoryConfig);
                              }
                              // The WASM module has been successfully created by the factory.
                              // Any error will be caught by the onAbort callback defined above.
                              wasm.then(function (module) {
                                  initialized = true;
                                  initAborted = false;
                                  var voidReturnType = null;
                                  // Using the tfjs namespace to avoid conflict with emscripten's API.
                                  module.tfjs = {
                                      init: module.cwrap('init', null, []),
                                      registerTensor: module.cwrap('register_tensor', null, [
                                          'number',
                                          'number',
                                          'number',
                                      ]),
                                      disposeData: module.cwrap('dispose_data', voidReturnType, ['number']),
                                      dispose: module.cwrap('dispose', voidReturnType, []),
                                  };
                                  resolve({ wasm: module });
                              });
                          })];
              }
          });
      });
  }
  function typedArrayFromBuffer(buffer, dtype) {
      switch (dtype) {
          case 'float32':
              return new Float32Array(buffer);
          case 'int32':
              return new Int32Array(buffer);
          case 'bool':
              return new Uint8Array(buffer);
          default:
              throw new Error("Unknown dtype " + dtype);
      }
  }
  var wasmBinaryNames = [
      'tfjs-backend-wasm.wasm', 'tfjs-backend-wasm-simd.wasm',
      'tfjs-backend-wasm-threaded-simd.wasm'
  ];
  var wasmPath = null;
  var wasmPathPrefix = null;
  var wasmFileMap = {};
  var initAborted = false;
  var customFetch = false;
  /**
   * @deprecated Use `setWasmPaths` instead.
   * Sets the path to the `.wasm` file which will be fetched when the wasm
   * backend is initialized. See
   * https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-wasm/README.md#using-bundlers
   * for more details.
   * @param path wasm file path or url
   * @param usePlatformFetch optional boolean to use platform fetch to download
   *     the wasm file, default to false.
   *
   * @doc {heading: 'Environment', namespace: 'wasm'}
   */
  function setWasmPath(path, usePlatformFetch) {
      if (usePlatformFetch === void 0) { usePlatformFetch = false; }
      tfjsCore.deprecationWarn('setWasmPath has been deprecated in favor of setWasmPaths and' +
          ' will be removed in a future release.');
      if (initAborted) {
          throw new Error('The WASM backend was already initialized. Make sure you call ' +
              '`setWasmPath()` before you call `tf.setBackend()` or `tf.ready()`');
      }
      wasmPath = path;
      customFetch = usePlatformFetch;
  }
  /**
   * Configures the locations of the WASM binaries.
   *
   * ```js
   * setWasmPaths({
   *  'tfjs-backend-wasm.wasm': 'renamed.wasm',
   *  'tfjs-backend-wasm-simd.wasm': 'renamed-simd.wasm',
   *  'tfjs-backend-wasm-threaded-simd.wasm': 'renamed-threaded-simd.wasm'
   * });
   * tf.setBackend('wasm');
   * ```
   *
   * @param prefixOrFileMap This can be either a string or object:
   *  - (string) The path to the directory where the WASM binaries are located.
   *     Note that this prefix will be used to load each binary (vanilla,
   *     SIMD-enabled, threading-enabled, etc.).
   *  - (object) Mapping from names of WASM binaries to custom
   *     full paths specifying the locations of those binaries. This is useful if
   *     your WASM binaries are not all located in the same directory, or if your
   *     WASM binaries have been renamed.
   * @param usePlatformFetch optional boolean to use platform fetch to download
   *     the wasm file, default to false.
   *
   * @doc {heading: 'Environment', namespace: 'wasm'}
   */
  function setWasmPaths(prefixOrFileMap, usePlatformFetch) {
      if (usePlatformFetch === void 0) { usePlatformFetch = false; }
      if (initAborted) {
          throw new Error('The WASM backend was already initialized. Make sure you call ' +
              '`setWasmPaths()` before you call `tf.setBackend()` or ' +
              '`tf.ready()`');
      }
      if (typeof prefixOrFileMap === 'string') {
          wasmPathPrefix = prefixOrFileMap;
      }
      else {
          wasmFileMap = prefixOrFileMap;
          var missingPaths = wasmBinaryNames.filter(function (name) { return wasmFileMap[name] == null; });
          if (missingPaths.length > 0) {
              throw new Error("There were no entries found for the following binaries: " +
                  (missingPaths.join(',') + ". Please either call setWasmPaths with a ") +
                  "map providing a path for each binary, or with a string indicating " +
                  "the directory where all the binaries can be found.");
          }
      }
      customFetch = usePlatformFetch;
  }

  /** @license See the LICENSE file. */
  // This code is auto-generated, do not modify this file!
  var version = '3.5.0';

  /**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   */
  var _this$1 = undefined;
  var WASM_PRIORITY = 2;
  tfjsCore.registerBackend('wasm', function () { return __awaiter(_this$1, void 0, void 0, function () {
      var wasm;
      return __generator(this, function (_a) {
          switch (_a.label) {
              case 0: return [4 /*yield*/, init()];
              case 1:
                  wasm = (_a.sent()).wasm;
                  return [2 /*return*/, new BackendWasm(wasm)];
          }
      });
  }); }, WASM_PRIORITY);

  exports.BackendWasm = BackendWasm;
  exports.setWasmPath = setWasmPath;
  exports.setWasmPaths = setWasmPaths;
  exports.version_wasm = version;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=tf-backend-wasm.js.map
