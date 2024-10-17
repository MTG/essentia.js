import { EssentiaWASM } from "essentia.js";
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

const effnetEmbeddings = new EffnetEmbeddings(EssentiaWASM.EssentiaWASM, ort);
const classifiers = Object.keys(modelState);

let waitingForPredict = false;

function getPositives(tensor, name) {
  const reshapeTemp = [];
  const innerDim = tensor.dims[1]
  for (let i = 0; i < tensor.size; i += innerDim) {
    const innerTemp = tensor.data.slice(i, i+innerDim);
    const positive = innerTemp.filter((_, j) => modelState[name].tagOrder[j])
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
    modelState[n].model = HeadModelORT.create(n, "effnet", ort);
    initPromiseArray.push(modelState[n].model.initialize());
  }
  
  Promise.all(initPromiseArray).then( () => {
    // update initialized state: message ExtractorManager
    self.postMessage({type: "initialised"});
    console.log('EffNet model initialised');
    classifiers.forEach( n => {
      modelState[n].isLoaded = true;
      console.info(`${n} classifier initialised`);
    })

    if (waitingForPredict) {
      effnetEmbeddings.predict(testInput).then( embeddings => {
        runClassifiers(embeddings);
      }).catch( err => {
        console.error(err);
      })
    }
  })
}

initModels();

function runClassifiers(embeddings) {
  const inferenceStart = Date.now();
  let predictions = {};
  // use array of promises pattern here too
  const predictPromiseArray = [];
  for (let n of classifiers) {
    predictPromiseArray.push( modelState[n].model.predict(embeddings) );
  }
  Promise.all(predictPromiseArray).then( outputs => {
    outputs.forEach( o => {
      const name = o.modelName;
      const outputTensor = o.activations;
      let outputArray = outputTensor.data;
      let positivesArray = outputArray;

      if (!["approachability", "engagement"].includes(name)) {
        positivesArray = getPositives(outputTensor, name);
      }
    
      const summarizedPredictions = average(positivesArray);
      // format predictions, grab only positive output
      predictions[name] = summarizedPredictions;
    })
    console.log(`classifier heads took: ${Date.now() - inferenceStart}ms`);
  });
}

const testInput = Float32Array.from(Array(44100*8).fill(0.5));
waitingForPredict = true;


self.onmessage = async (msg) => {
  switch (msg.data.type) {
    case 'audio':
      console.log('worker received audio');
      const audioArray = new Float32Array(msg.data.arrayBuffer);
      // runPitchCREPE(audioArray);
      // const musicnnEmbeddingsTensor = musicnnEmbeddings.predict(audioArray);
      const inferenceStart = performance.now();
      const ortEmbeddingsTensor = await effnetEmbeddings.predict(audioArray);
      // console.log('effnet embeddings', effnetEmbeddingsTensor.arraySync());
      
      // feed to classifier heads
      runClassifiers(ortEmbeddingsTensor);
      const inferenceTotal = performance.now() - inferenceStart;
      console.log(`total inference time: ${inferenceTotal}ms, for ${audioArray.length / 16000}s recording`);
      break;
  
    default:
      break;
  }
}