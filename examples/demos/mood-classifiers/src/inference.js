import EffnetEmbeddings from "./EffnetEmbeddings.js";
import { HeadModelORT } from "./HeadModel.js";
import modelState from "./modelState.js";

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

const effnetEmbeddings = new EffnetEmbeddings(ort);
const classifiers = Object.keys(modelState);

let audioArray = null;
let modelsReady = false; 
let waitingForInference = false;

function getPositives(tensor, name) {
  const reshapeTemp = [];
  const innerDim = tensor.dims[1]
  for (let i = 0; i < tensor.size; i += innerDim) {
    const innerTemp = tensor.data.slice(i, i+innerDim);
    const positive = innerTemp.filter((_, j) => modelState[name].tagOrder[j])[0];
    reshapeTemp.push(positive);
  }
  return reshapeTemp;
}

function average(arr) {
  const length = arr.length;
  if (length === 0) return 0;

  const sum = arr.reduce( (acc, val) => acc + val, 0 );

  return sum/length;
}


function initModels() {
  let initPromiseArray = [];
  initPromiseArray.push(effnetEmbeddings.initialize());
  
  for (let n of classifiers) {
    modelState[n].model = HeadModelORT.create(n, ort);
    initPromiseArray.push(modelState[n].model.initialize());
  }
  
  Promise.all(initPromiseArray).then( () => {
    // update initialized state: message ExtractorManager
    self.postMessage({type: "initialised"});
    console.info('EffNet model initialised');
    classifiers.forEach( n => {
      modelState[n].isLoaded = true;
      console.info(`${n} classifier initialised`);
    })

    modelsReady = true;
    if (waitingForInference) runModels();
  })
}

initModels();

function runClassifiers(embeddings) {
  // use array of promises pattern here too
  for (let n of classifiers) {
    modelState[n].model.predict(embeddings).then(o => {
      const name = o.modelName;
      const outputTensor = o.activations;
      let outputArray = outputTensor.data;
      // console.debug(`${name} output tensor:`, Array.from(outputArray), outputTensor.dims);
      let positivesArray = outputArray;
      
      // format predictions, grab only positive output
      if (!["approachability", "engagement"].includes(name)) {
        positivesArray = getPositives(outputTensor, name);
      }
      
      const summarizedPredictions = average(positivesArray);
      postMessage({
        predictions: [name, summarizedPredictions]
      });
    });
  }
}

async function runModels() {
  const inferenceStart = performance.now();
  const embeddings = await effnetEmbeddings.predict(audioArray);
  // TODO: add musicnn embeddings for emomusic
  // console.debug('embeddings data: ', Array.from(embeddings.data));
  // console.debug('embeddings dims: ', Array.from(embeddings.dims));
  // feed to classifier heads
  runClassifiers(embeddings);
  const inferenceTotal = performance.now() - inferenceStart;
  console.info(`total inference time: ${inferenceTotal}ms, for ${audioArray.length / 16000}s recording`);
};

self.onmessage = async (msg) => {
  switch (msg.data.type) {
    case 'audio':
      console.info('worker received audio');
      audioArray = new Float32Array(msg.data.arrayBuffer);

      if (!modelsReady) {
        waitingForInference = true;
        break;
      }
      runModels();

      break;
  
    default:
      break;
  }
}