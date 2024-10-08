import modelsData from "../models/modelsData.js";
import * as tfjs from '@tensorflow/tfjs';
import * as ort from 'onnxruntime-web';

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

const ALLOWED_EMBEDDINGS = ['musicnn', 'effnet'];

export class HeadModel {
  /*
  */
  constructor (modelURL, embeddingsSource, modelName) {
    this.url = modelURL;
    this.name = modelName;
    this.model = null;
    this.tf = tfjs;
    this.isReady = false;
    this.embeddingsSource = embeddingsSource;
  }
  
  static create (modelName, embeddingsSource) {
    if (!ALLOWED_EMBEDDINGS.includes(embeddingsSource)) {
      throw Error("embeddingsSource should be one of these: musicnn / effnet");
    }
    const url = modelsData.heads[modelName].url[embeddingsSource];
    const name =  modelsData.heads[modelName].name;
    return new this(url, embeddingsSource, name);
  }

  async initialize () {
    this.model = await this.tf.loadGraphModel(this.url);
    this.isReady = true;
  }

  predict (embeddings) {
    if (!this.isReady) throw Error ('BrightDark model has NOT been loaded yet, please await initialize() first');
    this.tf.tidy( () => {
      const outputTensor = this.model.execute({"model/Placeholder": embeddings});
      const outputArray = outputTensor.arraySync();
      console.log(`${this.name} (${this.embeddingsSource}-based) inference done: `, outputArray);
      return outputTensor;
    })
  }
}

export class HeadModelORT {
  constructor(modelURL, embeddingsSource, modelName) {
    this.url = modelURL;
    this.name = modelName;
    this.isReady = false;
    this.session = null;
    this.embeddingsSource = embeddingsSource;
  }

  static create (modelName, embeddingsSource) {
    if (!ALLOWED_EMBEDDINGS.includes(embeddingsSource)) {
      throw Error("embeddingsSource should be one of these: musicnn / effnet");
    }
    const url = modelsData.heads[modelName].url[embeddingsSource];
    const name =  modelsData.heads[modelName].name;
    return new this(url, embeddingsSource, name);
  }

  async initialize () {
    this.session = await ort.InferenceSession.create(this.url, { executionProviders: ['wasm'] });
    this.isReady = true;
  }

  async predict (inputTensor) {
    // const inputTensorTypedArray = inputTensor.dataSync();
    // const ortInputTensor = new ort.Tensor('float32', inputTensorTypedArray);
    console.log(`${this.name} input tensor`, inputTensor);
    const ortOutputTensor = await this.session.run({"model/Placeholder:0": inputTensor});
    console.log(`${this.name} (${this.embeddingsSource}-based) inference done: `, ortOutputTensor["model/Placeholder:0"].data);
    return ortOutputTensor;
  }
}