import * as ort from 'onnxruntime-web';
import * as tfjs from '@tensorflow/tfjs';

import wasm from "onnxruntime-web/dist/ort-wasm.wasm?url"
import wasmThreaded from "onnxruntime-web/dist/ort-wasm-threaded.wasm?url"
import wasmSimd from "onnxruntime-web/dist/ort-wasm-simd.wasm?url"
import wasmSimdThreaded from "onnxruntime-web/dist/ort-wasm-simd-threaded.wasm?url"

ort.env.wasm.wasmPaths = {
  "ort-wasm.wasm": wasm,
  "ort-wasm-threaded.wasm": wasmThreaded,
  "ort-wasm-simd.wasm": wasmSimd,
  "ort-wasm-simd-threaded.wasm": wasmSimdThreaded,
};

import { EssentiaTFInputExtractor } from "https://cdn.jsdelivr.net/npm/essentia.js@0.1.3/dist/essentia.js-model.es.js";
import modelUrl from '../models/effnet-based/discogs-effnet-bsdynamic-1.onnx?url';


export default class EffnetEmbeddings {
  /*
  */
  constructor (essentiaWasm) {
    this.tf = tfjs;
    this.url = modelUrl;
    this.tfInputMusiCNN = new EssentiaTFInputExtractor(essentiaWasm, "musicnn", false);
    this.frameSize = this.tfInputMusiCNN.frameSize;
    this.hopSize = Math.floor(this.frameSize / 2);

    this.patchSize = 128;
    this.session = null;
  }
  
  async initialize () {
    // console.log('effnet init')
    this.session = await ort.InferenceSession.create(this.url, { executionProviders: ['wasm'] });
  }

  async predict (audio) {
    if (!this.session) throw Error ('Effnet ORT session doesnt exist, please await .initialize() before calling predict');
    // console.log('audio for embeddings', audio);
    const melspectrogram = this.tfInputMusiCNN.computeFrameWise(audio, this.hopSize).melSpectrum;
    // console.log('effnet melspectrogram done', melspectrogram);
    const numPatches = Math.ceil(melspectrogram.length / this.patchSize);
    const paddingSize = (numPatches * this.patchSize) - melspectrogram.length;
    const inputTensor = this.tf.tensor(melspectrogram);
    const paddedTensor = inputTensor.pad([[0, paddingSize], [0,0]]);
    const shapedTensor = paddedTensor.reshape([numPatches, this.patchSize, 96]);
    // console.log('shaped tensor', shapedTensor);
    const shapedTensorTypedArray = shapedTensor.dataSync();
    const ortInputTensor = new ort.Tensor('float32', shapedTensorTypedArray, [numPatches, this.patchSize, 96]);
    console.log('effnet input tensor', ortInputTensor);
    const ortOutputTensor = await this.session.run({melspectrogram: ortInputTensor});
    console.log('effnet embeddings inference done: ', ortOutputTensor);
    
    inputTensor.dispose();
    paddedTensor.dispose();
    shapedTensor.dispose();
    const embeddingsTensor = this.tf.tensor(ortOutputTensor.embeddings.data, ortOutputTensor.embeddings.dims, "float32");
    return {
      ortTensor: ortOutputTensor.embeddings,
      tfTensor: embeddingsTensor
    };
  }
}
